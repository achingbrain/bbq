include(bbq.gui.SortableGUIWidget);
include(bbq.gui.table.ScrollLoadTable);
include(bbq.util.BBQUtil);

/**
 * SortableTable
 * 
 * @class bbq.gui.table.SortableTable This class allows creation of tables displaying lists of data.
 * @extends bbq.gui.SortableGUIWidget 
 */
bbq.gui.table.SortableTable = new Class.create(bbq.gui.SortableGUIWidget, {
	_tableHead: null,
	_callBacks: null,
	_boundCallBacks: null,
	_selectedElementID: null,
	sortedByColumnIndex: null,
	sortedByDirection: null,
	_selectedEntity: null,
	
	/**
	 * @param	Object		options					Options for the whole table
	 * @example
	 * It supports the following options:
	 * 
	 * options = {
	 * 		entities: Array								An array of objects to build the table from	
	 * 		entityID: String								The name of the id field of the objects above
	 * 		listItemsKey: String						Use object field with the passed name as entities
	 * 		startSorted: {
	 * 			column:	int				Which column to sort by - default 0
	 * 			direction : string	Sort direction: default ASC
	 * 		},
	 * 		columnData = [{
	 * 			text: mixed								Either a string which references a property on the current entity or a function that conforms to function(entity, index) and returns a Node
	 * 			shorten: int								The maximum length of the field
	 * 			sortField: string						The name of the object property to sort this column by.  Omit for a non-sortable column.
	 * 			ignoreDownState: bool			Will not set the down state for the row if a link in this column is clicked
	 * 	}, {...}, {...}]
	 * }
	 * 
	 * N.B. The down state referred to below means that a specified tr element will have a CSS class titled "down" applied to it.
	 * 
	 * Functions attached to onclick and ondblclick should return false to prevent their row from becoming selected.
	 * 
	 * onSort
	 * onBeforeSort
	 * onAfterSort
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("table");
		
		// steal styling from ScrollLoadTable
		this.addClass("ScrollLoadTable");
		
		this.addClass("SortableTable");
		
		this._callBacks = {};
		this.options.entityID = this.options.entityID ? this.options.entityID : "id";
		
		if(this.options.entities) {
			if(this.options.entities.getElements) {
				this.options.entities = this.options.entities.getElements();
			}
		} else {
			this.options.entities = [];
		}
		
		this._selectedEntity = {
			row: false,
			entity: false
		};
		
		this._boundCallBacks = {
			onclick: this._itemClicked.bindAsEventListener(this),
			ondblclick: this._itemDoubleClicked.bindAsEventListener(this)
		}
	},
	
	/**
	  Overrides ancestor method in order to sort data after the ancestor method calls render();
	 */
	appendTo: function($super, pageNode) {
		$super(pageNode);
		
		if(this.options.startSorted) {
			if(this.options.startSorted.direction) {
				this.sortedByDirection = this.options.startSorted.direction == "DESC" ? "ASC" : "DESC";
			}
			
			this.sortByIndex(this.options.startSorted.column ? this.options.startSorted.column : 0);
		} else {
			this.sortByIndex(0);
		}
	},
	
	/**
	 * Parses through the entity list and creates the table
	 */
	render: function() {
		this.empty();
		
		try {
			var cData = this.options.columnData;
			
			if(this.options.headerRows) {
				var headerRow = DOMUtil.createTextElement("tr", this._generateHeaderRows());
				/*
				var headerRow = document.createElement("tr");
			
				for(var i = 0, iCount=hRows.length; i < iCount; i++) {
					var cell = document.createElement("th");
					
					if(!cData[i]["sortField"] || Object.isUndefined(cData[i]["sortField"])) {
						// not a header that the data is supposed to be sortable by
						cell.appendChild(document.createTextNode(hRows[i]));
					} else {
						// create link that when clicked sorts the table
						var anchor = DOMUtil.createTextElement("a", hRows[i], {href: ".", onclick: this.sortByColumn.bindAsEventListener(this, i)});
						
						// are we currently sorted by this header?
						if(this.sortedByColumnIndex == i) {
							DOMUtil.addClass(anchor, "sortedBy" + this.sortedByDirection);
						}
						
						cell.appendChild(anchor);
					}
					
					if(cData[i] && cData[i]["iconColumn"]) {
						DOMUtil.addClass(cell, "iconColumnHeader");
					}
					
					// add cell to row
					headerRow.appendChild(cell);
				}
				*/
				this._tableHead = document.createElement("thead");
				this._tableHead.appendChild(headerRow);
				this.appendChild(this._tableHead);
			}
			
			// updates data needed to build the table nodes
			var entityGroup = this.getEntityGroup();
			
			var tableBody = document.createElement("tbody");
			this.appendChild(tableBody);
			
			for(var i = 0; i < entityGroup.length; i++) {
				tableBody.appendChild(this._generateRow(i, entityGroup[i]));
			}
			
			this.scrollToSelectedEntity();
		} catch(e) {
			Log.error("Error while rendering", e);
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
			
			if(entity[this.options.entityID] == this._selectedElementID) {
				DOMUtil.addClass(row, "down");
				this._selectedEntity.row = row;
				this._selectedEntity.entity = entity;
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
		for(var n = 0, nCount=cData.length; n < nCount; n++) { // process one entity (eg. one row)
			var cell = document.createElement("td");
			
			if(cData[n].iconColumn) {
				DOMUtil.addClass(cell, "ScrollLoadTableIconColumn");
			}
			
			row.appendChild(cell);
			DOMUtil.addClass(cell, "column" + n);
			
			if(cData[n]["text"] instanceof Function) {
				var cellContent = cData[n]["text"].call(this, entity, n, cell);
				
				if(cellContent) {
					if(cellContent.appendTo) {
						// passed GUIWidget
						cellContent.appendTo(cell);
					} else {
							this._processCallbacks(cellContent, entity, n);
							cell.appendChild(cellContent.appendChild ? cellContent : document.createTextNode(cellContent));
					}
				}
			} else {
				var text = this.getText(entity, cData[n]["text"]);
				cell.appendChild(document.createTextNode(text ? text : " "));
			}
			
			cell.owningEntity = entity;
		}
		
		row.owningEntity = entity;
		
		return row;
	},
	
	_handleInvalidItem: function(row) {
		return row;
	},
	
	/**
	 * Stores onclick and ondblclick so we can call them after setting the down state of the row
	 * 
	 * @private
	 * @param	{Node}	node	A node that we suspect has onclick, etc attributes defined on it
	 * @param	{Object}	entity	The entity that the row was made from that the node is from
	 */
	_processCallbacks: function(node, entity, columnIndex) {
		if(node) {
			try {
				node.columnIndex = columnIndex;
				
				for(var key in {onclick: "", ondblclick: ""}) { // check for onclick and ondblclick
					if(node[key]) { // if it's defined
						if(!this._callBacks[entity[this.options.entityID]]) { // make sure the callback holder is defined
							this._callBacks[entity[this.options.entityID]] = {};
						}
						
						if(!this._callBacks[entity[this.options.entityID]][columnIndex]) { // make sure the callback holder is defined
							this._callBacks[entity[this.options.entityID]][columnIndex] = {};
						}
						
						this._callBacks[entity[this.options.entityID]][columnIndex][key] = node[key]; // store the callback for calling later
						node[key] = this._boundCallBacks[key]; // replace it with our generic callback
					}
				}
			} catch(e) {
				// this will fail when something that isn't a DOM node is passed to be the contents of a cell.
				//  since we are only concerned with anchor tags and the like, we don't mind so swallow the exception
			}
		}
	},
	
	/**
	 * Sets the down state on a row clicked by an user
	 * 
	 * @private
	 * @param	{Event}	An onclick event
	 */
	_itemClicked: function(event) {
		this._processEvent(BBQUtil.clearFocus(event), "onclick");
		
		return false;
	},
	
	_itemDoubleClicked: function(event) {
		this._processEvent(BBQUtil.clearFocus(event), "ondblclick");
		
		return false;
	},
	
	/**
	 * @private
	 */
	_processEvent: function(node, eventName) {
		var entity = node.parentNode.owningEntity;
		var columnIndex = node.columnIndex;
		
		if(this._callBacks[entity[this.options.entityID]] && this._callBacks[entity[this.options.entityID]][columnIndex] && this._callBacks[entity[this.options.entityID]][columnIndex][eventName] && this._callBacks[entity[this.options.entityID]][columnIndex][eventName] instanceof Function) {
			// if the callback returns false, do not allow the current row to become selected
			if(this._callBacks[entity[this.options.entityID]][columnIndex][eventName].call(this, entity) === false) {
				return;
			}
		}
		
		if(!this.options.columnData[columnIndex].ignoreDownState) {
			this._setItemDown(node);
			this._selectedElementID = entity[this.options.entityID];
			this.render();
		}
		
		if(FocusWatcher) {
			FocusWatcher.setKeypressCallbackObject(this);
		}
	},
	
	/**
	 * Sets the down state on the row containing the passed element
	 * 
	 * @private
	 * @param	{Node}	Typically an anchor node
	 */
	_setItemDown: function(element) {
		this.clearDown();
		
		var row = element.parentNode.parentNode;
		DOMUtil.addClass(row, "down");
	},
	
	/**
	 * Removes the down state from all table rows
	 */
	clearDown: function() {
		this._selectedElementID = null;
		DOMUtil.removeClass(this.getRootNode(), "down", true);
		
		this._selectedEntity = {
			row: false,
			entity: false
		};
	},
	
	/**
	 * Returns either the value of the entity property using text as a key or text itself.
	 * 
	 * So getText({name: "alex"}, "name") would return "alex" but getText({name: "alex"}, "age") would return "age".  
	 * 
	 * If entityID has . characters in it, this method will step down into entity to find the key, so 
	 * getText({name: "alex", innerObject : {name: "bob"}}, "innerObject.bob") would return "bob"
	 * 
	 * @param	{Object}		entity
	 * @param	{string}		text
	 */
	getText: function(entity, text) {
		if(text.search(/(\.)/) > -1) {
			return this._findIt(entity, text.split("."));
		} else if(entity[text]) {
			return entity[text];
		}
		
		return text;
	},
	
	/**
	 * Returns the ID of the entity.  If entityID has . characters in it, this method will step down into entity to find the key.
	 */
	getEntityID: function(entity, entityID) {
		if(entityID.search(/\./)) {
			return this._findIt(entity, entityID.split("."));
		}
		
		return entity[entityID];
	},
	
	/**
	 * Called by getText and getEntityID to step down into objects.
	 * 
	 * @private
	 * @param	{Object}	entity
	 * @param	{Array}	keys
	 */
	_findIt: function(entity, keys) {
		var output = entity[keys[0]];
			
		for(var i = 1, iCount=keys.length; i < iCount; i++) {
			output = output[keys[i]];
		}
			
		return output;
	},
	
	/**
	 * Sets the appropriate class name on the clicked column header and calls sortByIndex to do the sorting
	 * 
	 * @param	{Event}	event
	 * @return	{boolean}
	 */
	sortByColumn: function(event, index) {
		var element = BBQUtil.clearFocus(event);
		
		DOMUtil.removeClass(this._tableHead, "sortedByASC", true);
		DOMUtil.removeClass(this._tableHead, "sortedByDESC", true);
		
		this.sortByIndex(index);
		
		return false;
	},
	
	/**
	 * Gets the entities to make the table from
	 */
	getEntityGroup: function() {
		if(this.options["listItemsKey"]) {
			return this.options.entities[this.options["listItemsKey"]];
		} else if(this.options.entities instanceof Function) {
			return this.options.entities();
		}
		
		return this.options.entities;
	},
	
	sort: function() {
		this.sortedByDirection = (this.sortedByDirection == "DESC" ? "ASC" : "DESC");
		this.sortByIndex(this.sortedByColumnIndex);
	},
	
	/**
	 * Sorts the table entries by this.sortedByColumnIndex or a specified column - 
	 * 0 = first column, 1 = second column, etc
	 * 
	 * @param	{integer}	index
	 * @return	void
	 */
	sortByIndex: function(index) {
		this.notifyListeners("onBeforeSort");
		
		if(index == -1) {
			return;
		}
		
		if(this.sortedByColumnIndex == index) {
			this.sortedByDirection = (this.sortedByDirection == "DESC" ? "ASC" : "DESC");
		} else {
			this.sortedByDirection = "DESC";
		}
		
		//Log.info("sorting by " + this.sortedByDirection);
		
		this.sortedByColumnIndex = index;
		this.currentSortKey = this.options.columnData[this.sortedByColumnIndex]["sortField"];
		
		var entityGroup = this.getEntityGroup();
		
		if(this.sortedByDirection == "ASC") {
			entityGroup.sort(this.ascSortFunction.bind(this));
		} else {
			entityGroup.sort(this.descSortFunction.bind(this));
		}
		
		this.render();
		this.notifyListeners("onAfterSort");
		this.notifyListeners("onSort");
	},
	
	/**
	 * Returns the ID of the first item in the entity array
	 * 
	 * @return	{string}
	 */
	getFirstEntity: function() {
		var entityGroup = this.getEntityGroup();
		
		if(entityGroup instanceof Array) {
			return entityGroup[0];
		}
	},
	
	/**
	 * Sets the down state on the row formed from the passed entity.  Or, more correctly, sets the down state on the row formed from
	 * the entity originally passed to the constructor with an identification field that matches the entity passed to this method.
	 * 
	 * @param	{Object}		The entity whose row to set to the down state
	 */
	setDown: function(entity) {
		if(entity) {
			this._selectedElementID = entity[this.options.entityID];
			
			this._selectedEntity = {
				row: false,
				entity: entity
			};
			
			this.render();
		}
	},
	
	/**
	 * Removes a row from th table.  NB. this will destructively affect the entity array passed to this object's constructor
	 * 
	 * @param	{Object}	entity	The entity to remove
	 * @param	{bool}	selectNew	Whether or not to select the first item in the table if the currently selected entity is the one we are deleting
	 */
	removeEntity: function(entity, selectNew) {
		var ents = this.options.entities;
		for(var i = 0; i < ents.length; i++) {
			if(ents[i] && ((entity.equals && entity.equals(ents[i])) || ents[i][this.options.entityID] == entity[this.options.entityID])) {
				ents.splice(i, 1);
				i--;
			}
		}
		
		this.render();
	},
	
	acceptFocus: function() {
		this.addClass("hasFocus");
	},
	
	loseFocus: function() {
		this.removeClass("hasFocus");
	},
	
	processKeypress: function(event) {
		var nextEntity = false;
		var foundEntity = false;
		
		// process keypress
		if(event.keyCode == Event.KEY_DOWN) { // if we can go one further down the list, do it but skip the contents of closed folders
			$A(this.getRootNode().getElementsByTagName("tr")).each(function(row){
				if(foundEntity && !nextEntity) {
					nextEntity = row.owningEntity;
				}
				
				if(this.isSelectedEntity(row.owningEntity)) {
					foundEntity = true;
				}
			}.bind(this));
		} else if(event.keyCode == Event.KEY_UP) {  // if we can go one further up the list, do it but skip the contents of closed folders
			$A(this.getRootNode().getElementsByTagName("tr")).each(function(row){
				if(this.isSelectedEntity(row.owningEntity)) {
					foundEntity = true;
					throw $break;
				}
				
				nextEntity = row.owningEntity;
			}.bind(this));
		}
		
		if(nextEntity) {
			this.setDown(nextEntity);
			
			if(this._callBacks[nextEntity[this.options.entityID]] && this._callBacks[nextEntity[this.options.entityID]][0] && this._callBacks[nextEntity[this.options.entityID]][0]["onclick"] && this._callBacks[nextEntity[this.options.entityID]][0]["onclick"] instanceof Function) {
				this._callBacks[nextEntity[this.options.entityID]][0]["onclick"].call(this, nextEntity);
			}
		}
		
		return true;
	},
	
	isSelectedEntity: function(entity) {
		if(entity) {
			return this._selectedElementID == entity[this.options.entityID];
		}
	},
	
	scrollToSelectedEntity: function() {
		if(this._selectedEntity.row && this._selectedEntity.row.scrollIntoView) {
			//this._selectedEntity.row.scrollIntoView();
		}
	}
});
