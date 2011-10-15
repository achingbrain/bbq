include(bbq.gui.ScrollLoadGUIWidget);
include(bbq.ajax.JSONRequest);
include(bbq.gui.LoadingNotification);

/**
 * @class bbq.gui.table.ScrollLoadTable
 * @extends bbq.gui.ScrollLoadGUIWidget 
 */
bbq.gui.table.ScrollLoadTable = new Class.create(bbq.gui.ScrollLoadGUIWidget, {
	_headerHeight: 0,
	_tableHead: null,
	_tableBody: null,
	_table: null,
	_selectedIndex: 0,
	_selectedKey: null,
	
	/**
	 * A table that loads data from somewhere. 
	 * 
	 * The URL passed as part of the options object should return in the following format:
	 * 
	 *  { numEntities: int, entities: {"en7": data, "en8": data, "en9": data,...}}     // <-  enN is zero indexed!
	 * 
	 * @param	Object		options					Options for the whole table
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		rowHeight: int																	// roughly the expected height of one row.
	 * 		createEntity: function(data, index)								// should return one new entity
	 * 		url: String																			// where to load from
	 * 		args: Object																		// arguments to pass to the url
	 * 		loadingText: String															// shown while doin the inital load
	 * 		noEntitiesText:	String														// shown when there is nothing to show
	 * 		defaultActionColumn: int												// the index of the column who's onclick handler should be invoked when the user keypresses over the rows
	 * 		columnData = [{
	 * 			text: function(entity, index, cell, ScrollLoadTable)	// Should return either a string, a node or a GUIButton
	 * 			shorten: int																	// The maximum length of the field value - nb. this will only be applied if a string is returned from text()
	 * 			sortField: boolean														// If we should allow sorting by this column
	 * 			ignoreDownState: bool												// Will not set the down state for the row if a link in this column is clicked
	 * 			onclick: function(entity)												// Invoked if the text is clicked
	 * 			ondblclick: function(entity)										// Invoked if the text is double clicked
	 * 			className: function(entity)										// Should return a string or null to get added as a CSS class to the td element
	 * 			
	  * 	}, {...}, {...}]
	 * }
	 * 
	 * N.B. The down state referred to below means that a specified tr element will have a CSS class titled "down" applied to it.
	 * 
	 * Supports observers for the following events
	 * 
	 * onEntitiesLoad
	 * onEmptyList
	 * onEntitiesLoaded
	 * onSort
	 * onBeforeSort
	 * onAfterSort
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("ScrollLoadTable");
		this._table = DOMUtil.createElement("table", {className: "ScrollLoadTable"});
		
		if(this.options.headerRows) {
			this._tableHead = this._table.appendChild(DOMUtil.createElement("thead"));
		}
		
		if(typeof(this.options.defaultActionColumn) == "undefined") {
			this.options.defaultActionColumn = 0;
		}
		
		this._tableBody = this._table.appendChild(DOMUtil.createElement("tbody"));
		
		this._selectedIndex = -1;
		this._selectedKey = false;
	},
	
	/**
	 * Parses through the entity list and creates the table
	 */
	render: function() {
		var scrollTop = 0;
		
		if(this._scrollableHolder) {
			scrollTop = this._scrollableHolder.getScrollTop();
		}
		
		this.empty();
		
		var eLength = this._entities.getLength();
		
		if(this._initialLoad == true) {
			// show loading text
			this.appendChild(new bbq.gui.LoadingNotification({text: this.options.loadingText}));
		} else if(eLength == 0) {
			// show "no items" type notification
			this.appendChild(DOMUtil.createTextElement("p", this.options.noEntitiesText ? this.options.noEntitiesText : Language.get("bbq.gui.table.ScrollLoadTable.emptylist"), {className: "ScrollLoadTableEmptyList"}));
		} else {
			try {
				// create header rows
				if(this.options.headerRows) {
					DOMUtil.emptyNode(this._tableHead);
					this._tableHead.appendChild(DOMUtil.createTextElement("tr", this._generateHeaderRows()));
				}
				
				DOMUtil.emptyNode(this._tableBody);
				
				// create one row for each entity
				for(var i = 0; i < eLength; i++) {
					this._tableBody.appendChild(this._generateRow(i, this._entities.getElement(i)));
				}
				
				// add style to last row
				if(eLength > 0) {
					DOMUtil.addClass(this._tableBody.childNodes.item(this._tableBody.childNodes.length - 1), "lastRow");
				}
				
				this.appendChild(this._table);
			} catch(e) {
				Log.error("Error while rendering", e);
			}
		}
		
		if(this._scrollableHolder) {
			this._scrollableHolder.setScrollTop(scrollTop);
		}
	},
	
	_generateHeaderRows: function() {
		var cells = [];
		
		for(var i = 0; i < this.options.headerRows.length; i++) {
			var cell = document.createElement("th");
			
			if(!this.options.columnData[i]["sortField"] || typeof(this.options.columnData[i]["sortField"]) == "undefined") {
				// not a header that the data is supposed to be sortable by
				cell.appendChild(document.createTextNode(this.options.headerRows[i]));
			} else {
				// create link that when clicked sorts the table
				var anchor = DOMUtil.createTextElement("a", this.options.headerRows[i], {href: ".", onclick: this.sortByIndex.bind(this, i, this.options.args.sortDirection == foundation.constants.FOUNDATION_DATABASE_PAGINATOROPTIONS_SORTDESC ? foundation.constants.FOUNDATION_DATABASE_PAGINATOROPTIONS_SORTASC : foundation.constants.FOUNDATION_DATABASE_PAGINATOROPTIONS_SORTDESC)});
							
				// are we currently sorted by this header?
				if(this.options.args.sortBy == i) {
					DOMUtil.addClass(anchor, "sortedBy" + ((this.options.args.sortDirection == foundation.constants.FOUNDATION_DATABASE_PAGINATOROPTIONS_SORTDESC) ? "DESC" : "ASC"));
				}
				
				cell.appendChild(anchor);
			}
			
			if(this.options.columnData[i] && this.options.columnData[i]["iconColumn"]) {
				DOMUtil.addClass(cell, "iconColumnHeader");
			}
			// add cell to row
			cells.push(cell);
		}
		
		return cells;
	},
	
	_generateRow: function(index, entity) {
		var row = document.createElement("tr");
		
		if(!entity) { // invalid item
			row = this._handleInvalidItem(row, index);
		} else if(this.options.createRow instanceof Function) { // custom item
			row = this.options.createRow(row, entity, index);
			row.owningEntity = entity;
		} else { // create row from column data
			row = 	this._handleValidItem(row, index, entity);
			
			if(this.isSelectedEntity(entity)) {
				DOMUtil.addClass(row, "down");
			}
		}
		
		if(index % 2 == 0) {
			DOMUtil.addClass(row, "oddRow");
		} else {
			DOMUtil.addClass(row, "evenRow");
		}
		
		return row;
	},
	
	_handleValidItem: function(row, rowIndex, entity) {
		var cData = this.options.columnData;
		
		for(var n = 0, nCount=this.options.columnData.length; n < nCount; n++) { // process one entity (eg. one row)
			var cell = row.appendChild(DOMUtil.createElement("td", {className: "column" + n}));
			
			if(this.options.columnData[n].iconColumn) {
				DOMUtil.addClass(cell, "ScrollLoadTableIconColumn");
			}
			
			if(!(this.options.columnData[n].text instanceof Function)) {
				Log.error("Please pass an instance of Function to ScrollLoadTable to generate cell text");
				return;
			}
			
			var cellContent = this.options.columnData[n].text(entity, n, cell, this);
			
			if(cellContent) {
				if(cellContent.appendTo) {
					// passed GUIWidget
					cellContent.appendTo(cell);
				} else {
					// passed text
					if(this.options.columnData[n].onclick || this.options.columnData[n].ondblClick) {
						// make text clickable
						var link = DOMUtil.createTextElement("a", cellContent, {
							href: ".",
							onclick: this._processEvent.bindAsEventListener(this, entity),
							ondblclick: this._processEvent.bindAsEventListener(this, entity)
						});
						
						if(Object.isElement(cellContent)) {
							Event.observe(cellContent, "click", function() {
								link.blur();
								return true;
							});
						}
						
						cellContent = link;
						
						if(this.options.columnData[n].onclick) {
							this._storeCallback(entity, "click", this.options.columnData[n].onclick.bind(this, entity));
						}
						
						if(this.options.columnData[n].ondblclick) {
							this._storeCallback(entity, "dblclick", this.options.columnData[n].ondblclick.bind(this, entity));
						}
					}
					
					if(Object.isString(cellContent)) {
						cellContent = document.createTextNode(cellContent);
					}
					
					cell.appendChild(cellContent);
				}
			
				if(this.options.columnData[n]["className"]) {
					var className;
					
					if(className = this.options.columnData[n]["className"](entity)) {
						//Log.info("custom class " + className);
						DOMUtil.addClass(cellContent, className);
					}
				}
			}
		}
		return row;
	},
	
	/**
	 * Sets the down state on the row containing the passed element
	 * 
	 * @param	{mixed}	object	Either an entity contained within this table or an ID
	 */
	setDown: function(entity) {
		this.notifyListeners("onBeforeSelectedEntityChange");
		if(!entity) {
			this.clearDown();
		} else {
			var index = this._entities.indexOf(entity);
			
			if(index != this._selectedIndex) {
				this.clearDown();
				this._selectedIndex = index;
				this._selectedKey =  this._getEntityKey(entity);
				
				var rows = $A(this._tableBody.getElementsByTagName("tr"));
				DOMUtil.addClass(rows[this._selectedIndex], "down");
				
				bbq.gui.ScrollLoadGUIWidget.prototype.setDown.call(this, entity);
			}
		}
		this.notifyListeners("onAfterSelectedEntityChange");
	},
	
	/**
	 * Removes the down state from all table rows
	 */
	clearDown: function() {
		this._selectedIndex = -1;
		this._selectedKey = false;
		DOMUtil.removeClass(this.getRootNode(), "down", true);
	},
	
	acceptFocus: function() {
		this.addClass("hasFocus");
	},
	
	loseFocus: function() {
		this.removeClass("hasFocus");
	},
	
	processKeypress: function(event) {
		var nextEntity = false;
		
		// process keypress
		if(event.keyCode == Event.KEY_DOWN) {
			nextEntity = this._entities.getElement(this._selectedIndex + 1);
		} else if(event.keyCode == Event.KEY_UP) {
			nextEntity = this._entities.getElement(this._selectedIndex - 1);
		}
		
		if(nextEntity) {
			this.setDown(nextEntity);
			this._invokeCallback(nextEntity, "click");
		}
		
		return true;
	},
	
	isSelectedEntity: function(entity) {
		if(this._selectedKey && entity) {
			return this._selectedKey ==  this._getEntityKey(entity);
		}
		
		return false;
	},
	
	_handleInvalidItem: function(row, index) {
		row.appendChild(DOMUtil.createTextElement("td", new bbq.gui.LoadingNotification(), {className: "column0", colSpan: this.options.columnData.length, style: {height: this.options.rowHeight + "px"}}));
		return row;
	},
	
	getHeaderHeight: function() {
		if(this.getRootNode().getElementsByTagName("thead")[0]) {
			return Element.getHeight(this.getRootNode().getElementsByTagName("thead")[0]);
		}
		
		return 0;
	},
	
	_workOutMovement: function() {	
		if(this._scrollingTimeout) {
			clearTimeout(this._scrollingTimeout);
		}
		
		// if we've no scrollableholder, we won't know how many to load
		if(!this._scrollableHolder) {
			return;
		}
		
		var offset = this._scrollableHolder.getRootNode().scrollTop - this.getHeaderHeight();
		
		if(offset < 0) {
			offset = 0;
		}
		
		// div height or table height if not scrolling
		var visibleHeight = Element.getHeight(this._scrollableHolder.getRootNode());
		
		if(visibleHeight == 0) {
			return;
		}
		
		var startRow = Math.floor(offset/this.options.rowHeight);
		var endRow = startRow + Math.floor(visibleHeight/this.options.rowHeight);
		
		if(this._lastRange.start != startRow || this._lastRange.end != endRow || this._initialLoad === true || this._forceLoad) {
			this._lastRange.start = startRow;
			this._lastRange.end = endRow;
			
			// load missing details
			//Log.info("calling loadDetails for rows " + (startRow) + " to " + (endRow + 1) + " this._forceLoad = " + this._forceLoad);
			this._loadDetails(startRow, endRow + 1);
		}
	}
});
