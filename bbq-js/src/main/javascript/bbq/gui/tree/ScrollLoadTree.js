include(bbq.gui.ScrollLoadGUIWidget);
include(bbq.ajax.JSONRequest);
include(bbq.gui.LoadingNotification);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.tree.ScrollLoadTree
 * @extends bbq.gui.ScrollLoadGUIWidget 
 */
bbq.gui.tree.ScrollLoadTree = new Class.create(bbq.gui.ScrollLoadGUIWidget, {
	_currentlySelectedID: null,
	_selectedIndex: null,
	_selectedKey: null,
	_listConstructionData: null,
	_scrollTop: null,
	_list: null,
	_entityTree: null,
	
	/**
	 * @param {Object} options
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		saveOpenStateURL: String,		The URL to post folder open state data to
	  * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("ScrollLoadTree");
		
		this._listConstructionData = [];
		this._selectedIndex = -1;
		
		this._entityTree = {};
	},
	
	/**
	 * @param {Object} constructionData
	 * @example
	 * Expects an object with the following properties:
	 * 
	 * constructionData: {
	 * 		text: function(entity),								// this should return the text to be displayed for the entry
	 * 		onclick: function(entity),						// a function that is called when the item is clicked
	 * 		[collapsible: boolean,]								// can this level be collapsed?
	 * 		[startCollapsed: function(entity),]			// if collapsible is true, this should return true if the level is to start collapsed
	 * 		[propertyName: string]							// if specified, this is the property on the parent object that contains the elements for this tree level
	 * }
	 */
	addLevel: function(constructionData) {
		this._listConstructionData.push(constructionData);
	},
	
	/**
	 * Renders
	 */
	render: function() {
		/*
		if(this._scrollableHolder) {
			Log.info('scrollTop in folderTree = ' + this._scrollableHolder.getRootNode().scrollTop);
		}*/
		this.empty();
		var eLength = this._entities.getLength();
		if(this._initialLoad == true) {
			this.appendChild(new bbq.gui.LoadingNotification({text: this.options.loadingText}));
		} else if(eLength == 0) {
			this.appendChild(DOMUtil.createTextElement("p", this.options.noEntitiesText, {className: "ScrollLoadTreeEmptyList"}));
		} else {
			try {	
				this._list = DOMUtil.createElement("ul");
				
				for(var i = 0; i < eLength; i++) {
					var entity = this._entities.getElement(i);
					
					if(entity) {
						this._list.appendChild(this._handleValidItem(entity, i));
					} else {
						this._list.appendChild(this._handleInvalidItem(entity));
					}
				}
				
				this.appendChild(this._list);
			} catch(e) {
				Log.error("Error while rendering", e);
			}
		}
	},
	
	/**
	 * @private
	 */
	_handleValidItem: function(entity, index) {
		try {
			var entityKey = BBQUtil.getKey(entity);
			var treeData = this._entityTree[entityKey];
			
			if(!treeData) {
				Log.warn("Could not determing tree data for entity");
				Log.dir(entity);
				return;
			}
			
			var constructionData = this._listConstructionData[treeData["level"]];
			
			var output = DOMUtil.createElement("li", {
				className: "CollapseExpandListTitle ScrollLoadTreeLevel" + treeData["level"]
			});
					
			// set down if has been selcted before
			//if(index == this._selectedIndex) {
			if(entityKey == this._selectedKey) {
				DOMUtil.addClass(output, "down");
			}
			
			if(!constructionData) {
				Log.info("could not get construction data for level " + treeData["level"]);
			}
			
			// add collapse/expand button
			if(constructionData.collapsible) {
				var startCollapsed = !treeData["folderOpen"];
				
				output.collapsible = true;
				output.collapsed = startCollapsed;
				
				if(treeData["children"].length > 0) {
					output.appendChild(DOMUtil.createTextElement("a", Language.get("bbq.gui.tree.ScrollLoadTreeList.collapseexpand"), {
						href: ".",
						onclick: function(event, entity) {
							try {
								BBQUtil.clearFocus(event);
								this._folderClicked(entity);
							} catch(e) {
								Log.error("Error clearing focus", e);
							}
							
							return false;
						}.bindAsEventListener(this, entity),
						title: Language.get("bbq.gui.tree.ScrollLoadTreeList.collapseexpand"),
						className: "CollapseExpand  CollapseExpand" + (startCollapsed ? "Collapsed" : "Expanded"),
						collapsed: startCollapsed
					}));
				} else {
					// no children, add placeholder
					output.appendChild(DOMUtil.createElement("span", {
						className: "CollapseExpand  CollapseExpandCollapserPlaceHolder"
					}));
				}
			}
			
			var text = constructionData.text(entity);
			var folderTitle;
			
			if(constructionData.onclick || constructionData.ondblclick) {
				folderTitle = DOMUtil.createTextElement("a", text, {
					href: ".",
					onmousedown: this._processEvent.bindAsEventListener(this, entity),
					onclick: this._processEvent.bindAsEventListener(this, entity),
					ondblclick: this._processEvent.bindAsEventListener(this, entity),
					className: "CollapseExpandFolderTitle"
				});
				
				if(Object.isElement(text)) {
					Event.observe(text, "click", function() {
						folderTitle.blur();
						return true;
					});
				}
				
				if(constructionData.onclick) {
					this._storeCallback(entity, "click", constructionData.onclick.bind(this, entity));
				}
				
				if(constructionData.ondblclick) {
					this._storeCallback(entity, "dblclick", constructionData.ondblclick.bind(this, entity));
				}
			} else {
				if(Object.isElement(text)) {
					folderTitle = text;
				} else {
					folderTitle = DOMUtil.createTextElement("span", text);
				}
				
				DOMUtil.addClass(folderTitle, "CollapseExpandFolderTitle");
			}
			
			if(constructionData.className instanceof Function) {
				var className = constructionData.className(entity, [folderTitle, output]);
				
				if(Object.isString(className)) {
					DOMUtil.addClass(folderTitle, className);
					DOMUtil.addClass(output, className);
				}
			}
			
			output.appendChild(folderTitle);
			
			return output;
		} catch(e) {
			Log.error("Error handling valid item", e);
		}
		
		return output;
	},
	
	/**
	 * @private
	 */
	_handleInvalidItem: function(entity) {
		return DOMUtil.createTextElement("li", new bbq.gui.LoadingNotification()); 
	},
	
	/**
	 * @private
	 */
	_folderClicked: function(entity, newStatus) {
		var treeData = this._entityTree[BBQUtil.getKey(entity)];
		
		// newStatus is passed by left/right arrow keypress handler.  abort if our status will not change.
		if(typeof(newStatus) != "undefined" && newStatus == !treeData["folderOpen"]) {
			return;
		}
		
		// store where we are scrolled to so that we can scroll to it after loading
		this._scrollTop = this._scrollableHolder.getRootNode().scrollTop;
		
		// store collapsed state
		new bbq.ajax.JSONRequest({
			url: "/backend/setFolderCollapsedStatus", 
			args: {
				entity:  this._getEntityKey(entity),
				closed: treeData["folderOpen"]
			}, 
			onSuccess: this.reloadEntities.bind(this)
		});
		
		return false;
	},
	
	/**
	 * Selects the element in the tree
	 * 
	 * @param {Object} object
	 * @return void
	 */
	setDown: function(entity) {
		this.notifyListeners("onBeforeSelectedEntityChange");
		
		var index = this._entities.indexOf(entity);
	
		if(index != this._selectedIndex) {
			this.clearDown();
			this._selectedIndex = index;
			this._selectedKey = BBQUtil.getKey(entity);
			
			if(this._list) {
				var rows = $A(this._list.getElementsByTagName("li"));
				DOMUtil.addClass(rows[this._selectedIndex], "down");
				bbq.gui.ScrollLoadGUIWidget.prototype.setDown.call(this, entity);
			}
		}
		
		this.notifyListeners("onAfterSelectedEntityChange");
	},
	
	/**
	 * Removes selection
	 */
	clearDown: function() {
		this._selectedIndex = -1;
		this._selectedKey = null;
		this.removeClass("down", true);
	},
	
	/**
	 * Adds focus to the tree
	 */
	acceptFocus: function() {
		this.addClass("hasFocus");
	},
	
	/**
	 * Removes focus from the tree
	 */
	loseFocus: function() {
		this.removeClass("hasFocus");
	},
	
	/**
	 * Process key presses
	 * 
	 * @param {Event} event
	 * @return {Boolean} true
	 */
	processKeypress: function(event) {
		var increment = 1;
		var nextEntity = this._getNextEntity(event, increment);
		
		while(nextEntity) {
			if(this._invokeCallback(nextEntity, "click") === false) {
				increment++;
				nextEntity = this._getNextEntity(event, increment);
			} else {
				return true;
			}
		}
		
		return true;
	},
	
	_getNextEntity: function(event, increment) {
		var nextEntity = false;
		
		// process keypress
		if(event.keyCode == Event.KEY_DOWN) {
			nextEntity = this._entities.getElement(this._selectedIndex + increment);
		} else if(event.keyCode == Event.KEY_UP) {
			nextEntity = this._entities.getElement(this._selectedIndex - increment);
		} else if(event.keyCode == Event.KEY_RIGHT) { // if the currently selected level is collapsible and collapsed, expand it
			this._folderClicked(this._entities.getElement(this._selectedIndex), false);
		} else if(event.keyCode == Event.KEY_LEFT) { // if the currently selected level is collapsible and expanded, collapse it
			this._folderClicked(this._entities.getElement(this._selectedIndex), true);
		}
		
		return nextEntity;
	},
	
	/**
	 * @private
	 * Override
	 */
	 _processNewEntities: function(json) {
		try {
			var keyToEntity = {};
			
			for(var i = 0, iCount=json.numEntities; i < iCount; i++) {
				var entityData = json.entities["en" + i];
				
				// do not process missing items
				if(typeof(entityData) == "undefined") {
					continue;
				}
				
				// overwrite currently stored entity with entity passed from server, otherwise preserve entitiy 
				// if we have it already, otherwise make false to trigger placeholder
				if(this.options.createEntity instanceof Function) {
					this._entities.setElement(i, this.options.createEntity(entityData, i));
				} else {
					this._entities.setElement(i, entityData);
				}
				
				if(this._entities.getElement([i])) {
					if(!this._entities.getElement(i).getId) {
						Log.dir(this._entities.getElement(i));
					} else{
						keyToEntity[this._entities.getElement(i).getId()] = this._entities.getElement(i);
					}
				}
			}
			var tree = json.entityTree;
			// store tree construction data
			for(var key in tree) {
				if(!key) {
					continue;
				}
				
				if(this._entityTree[key]) {
					this._entityTree[key]["folderOpen"] = tree[key]["folderOpen"];
					this._entityTree[key]["children"] = this._entityTree[key]["children"].concat(tree[key]["children"]).uniq();
				} else {
					this._entityTree[key] = {
						folderOpen: tree[key]["folderOpen"] ? true : false,
						children: tree[key]["children"] ? tree[key]["children"] : [],
						level: tree[key]["level"]
					};
				}
			}
			
			this.render();
		} catch(e) {
			Log.error("Error processing new entities", e);
		}
	},
	
	/**
	 * @private
	 */
	_workOutMovement: function() {	
		if(this._scrollingTimeout) {
			clearTimeout(this._scrollingTimeout);
		}
		
		// do not try to load entities if there were none last time as chances are there still won't be any
		if(!this._initialLoad && this._entities.getLength() == 0) {
			return;
		}
		
		// if we've no scrollabelholder, we won't know how many to load
		if(!this._scrollableHolder) {
			return;
		}
		
		var offset = this._scrollableHolder.getRootNode().scrollTop;
		
		// div height or table height if not scrolling
		var visibleHeight = Element.getHeight(this._scrollableHolder.getRootNode());
		
		if(visibleHeight == 0) {
			return;
		}
		
		var startRow = Math.floor(offset/this.options.rowHeight);
		var endRow = startRow + Math.floor(visibleHeight/this.options.rowHeight);
		
		if(this._lastRange.start != startRow || this._lastRange.end != endRow || this._initialLoad) {
			this._lastRange.start = startRow;
			this._lastRange.end = endRow;
			
			// load missing details
			//Log.info("calling loadDetails for rows " + (startRow) + " to " + (endRow + 1) + " this._forceLoad = " + this._forceLoad);
			this._loadDetails(startRow, endRow + 1);
		}
	}
});
