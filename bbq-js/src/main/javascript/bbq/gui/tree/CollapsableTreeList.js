include(bbq.gui.tree.TreeList);
include(bbq.ajax.JSONRequest);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.tree.CollapsableTreeList
 * @extends bbq.gui.tree.TreeList
 */
bbq.gui.tree.CollapsableTreeList = new Class.create(bbq.gui.tree.TreeList, {
	_entities: null,
	_currentlySelectedID: null,
	_listConstructionData: null,
	_folderOpenStatus: null,
	_entityIdToNode: null,
	
	/**
	 * @param {Object} options
	 * @example 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		entities: Array,							An array of objects to build the tree from
	 * 		saveOpenStateURL: String,		The URL to post folder open state data to
	 * 		entityKey: String						The unique property on each entity.  Defaults to "id"
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("CollapsableTreeList");
		
		this._entities = this.options.entities;
		this._listConstructionData = [];
		this._folderOpenStatus = [];
		
		if(!this.options.entityKey) {
			this.options.entityKey = "id";
		}
		
		this._entityIdToNode = {};
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
	
	render: function() {
		this.empty();
		this._entityIdToNode = {};
		
		if(this._entities instanceof Array) {
			if(this._entities.length > 0) {
				var listElement = document.createElement("li");
				this._buildLevel(this, this._entities, 0);
			}
		} else {
			if(this._entities.getLength() > 0) {
				var listElement = document.createElement("li");
				this._buildLevel(this, this._entities.getElements(), 0);
			}
		}
	},
	
	acceptFocus: function() {
		this.addClass("hasFocus");
	},
	
	loseFocus: function() {
		this.removeClass("hasFocus");
	},
	
	/**
	 * @private
	 * 
	 * Recusively walks the tree building a gui representation
	 */
	_buildLevel: function(listHolder, entities, levelIndex) {
		// loop through each entity
		entities.each(function(entity){
			try {
				var listTitle = document.createElement("li");
				listTitle.entity = entity;
				listTitle.onclickcallback = this._listConstructionData[levelIndex].onclick;
				
				if(this._listConstructionData[levelIndex].customClass && this._listConstructionData[levelIndex].customClass instanceof Function) {
					var customClass = this._listConstructionData[levelIndex].customClass(entity);
					
					if(customClass) {
						DOMUtil.addClass(listTitle, this._listConstructionData[levelIndex].customClass(entity));
					}
				}
				
				DOMUtil.addClass(listTitle, "CollapseExpandListTitle");
				var startCollapsed = false;
				
				this._entityIdToNode[entity[this.options.entityKey]] = listTitle;
				
				if(entity[this.options.entityKey] == this._currentlySelectedID) {
					DOMUtil.addClass(listTitle, "down");
				}
				
				// get child elements
				var childElements = [];
				
				if(this._listConstructionData[levelIndex+1] && this._listConstructionData[levelIndex+1].propertyName && entity[this._listConstructionData[levelIndex+1].propertyName]) {
					
					if(entity[this._listConstructionData[levelIndex+1].propertyName] instanceof Function) {
						childElements = entity[this._listConstructionData[levelIndex+1].propertyName]();
					} else {
						childElements = entity[this._listConstructionData[levelIndex+1].propertyName];
					}
				}
				
				if(this._listConstructionData[levelIndex].collapsible) { // add collapse/expand button
					if(childElements.length > 0) {
						if(typeof(this._folderOpenStatus[entity[this.options.entityKey]]) != "undefined") {
							startCollapsed = this._folderOpenStatus[entity[this.options.entityKey]];
						} else {
							startCollapsed = this._listConstructionData[levelIndex].startCollapsed(entity);
						}
						
						listTitle.collapsible = true;
						listTitle.collapsed = startCollapsed;
						
						this._folderOpenStatus[entity[this.options.entityKey]] = startCollapsed;
						
						listTitle.appendChild(DOMUtil.createTextElement("a", Language.get("bbq.gui.tree.CollapsableTreeList.collapseexpand"), {
							href: ".",
							onclick: this._folderClicked.bindAsEventListener(this),
							title: Language.get("bbq.gui.tree.CollapsableTreeList.collapseexpand"),
							className: "CollapseExpand  CollapseExpand" + (startCollapsed ? "Collapsed" : "Expanded"),
							collapsed: startCollapsed,
							entity: entity
						}));
					} else { // no children, add placeholder
						listTitle.appendChild(DOMUtil.createElement("span", {
							className: "CollapseExpand  CollapseExpandCollapserPlaceHolder"
						}));
					}
				}
				
				listTitle.appendChild(DOMUtil.createTextElement("a", this._listConstructionData[levelIndex].text(entity), {
						href: ".",
						onclick: this._elementClicked.bindAsEventListener(this, this._listConstructionData[levelIndex].onclick),
						entity: entity, 
						className: "CollapseExpandFolderTitle"
					}));
				
				var list = document.createElement("ul");
				list.entity = entity;
				list.appendChild(listTitle);
				
				// check for child elements
				if(childElements && childElements.length > 0) {
					var listElement = DOMUtil.createElement("li", {className: "CollapsableTreeListContainerList"});
					this._buildLevel(listElement, childElements, levelIndex+1);
					list.appendChild(listElement);
				
					if(startCollapsed) {
						list.getElementsByClassName("CollapsableTreeListContainerList")[0].style.display = "none";
					}
				}
				
				listHolder.appendChild(list);
			} catch(e) {
				Log.error("Error building level", e);
			}
		}.bind(this));
	},
	
	/**
	 * @private
	 * 
	 * Gets the element which contains the entity who's children we want to show or hide
	 */
	_folderClicked: function(event) {
		var element = BBQUtil.clearFocus(event);
		this._toggleFolder(element, Element.getElementsByClassName(element.parentNode.parentNode, "CollapsableTreeListContainerList")[0]);
		return false;
	},
	
	/**
	 * @private
	 * 
	 * @example
	 * Shows/hides a tree level.  The tree is structured thus:
	 * 
	 * <code>
	 * <ul>
	 *   <li>title 1</li>
	 *   <li class="CollapsableTreeListContainerList">
	 *     <ul>
	 *       <li>element 1</li>
	 *       <li>element 2</li>
	 *     </ul>
	 *   </li>
	 * </ul>
	 * <ul>
	 *   <li>title 2</li>
	 *   <li class="CollapsableTreeListContainerList">
	 *     <ul>
	 *       <li>element a</li>
	 *       <li>element b</li>
	 *     </ul>
	 *   </li>
	 * </ul>
	 * </code>
	 * 
	 * The passed element is the ul element that contains an li with the class CollapsableTreeListContainerList
	 * 
	 */
	_toggleFolder: function(element, listToCollapse) {
		try {
			var entity = element.entity;
			
			// reverse collapsed state
			element.collapsed = !element.collapsed;
			element.parentNode.parentNode.collapsible = true;
			element.parentNode.parentNode.collapsed = element.collapsed;
			
			// store locally to make it persist beyond the next render
			this._folderOpenStatus[entity[this.options.entityKey]] = element.collapsed;
			
			//set css classes
			DOMUtil.removeClass(element, (element.collapsed ? "CollapseExpandExpanded" : "CollapseExpandCollapsed"));
			DOMUtil.addClass(element, (element.collapsed ? "CollapseExpandCollapsed" : "CollapseExpandExpanded"));
			
			// show/hide element
			Effect["Blind" + (element.collapsed ? "Up" : "Down")](listToCollapse, {duration: 0.15});
			
			// store collapsed state
			new bbq.ajax.JSONRequest({url: "/backend/setFolderCollapsedStatus", args: {entity: element.entity.id, closed: element.collapsed}});		
		} catch(e) {
			Log.error("Error toggling folder", e);
		}
	},
	
	/**
	 * 
	 */
	_elementClicked: function(event, callback) {
		try {
			var element = BBQUtil.clearFocus(event);
			
			if(callback) {
				this.setItemDownWithId(element.entity[this.options.entityKey]);
				callback.call(this, element.entity);
				
				if(FocusWatcher) {
					FocusWatcher.setKeypressCallbackObject(this);
				}
			}
		} catch(e) {
			Log.error("Error processing click event", e);
		}
		
		return false;
	},
	
	/**
	 * @param {integer} id
	 * 
	 */
	setItemDownWithId: function(id) {
		this.clearDown();
		this._currentlySelectedID = id;
		//this.render();
		
		DOMUtil.addClass(this._entityIdToNode[id], "down");
	},
	
	/**
	 * Removes selection
	 * @void
	 */
	clearDown: function() {
		this._currentlySelectedID = null;
		//this.render();
		this.removeClass("down", true);
	},
	
	/**
	 * @param {Event} event
	 */
	processKeypress: function(event) {
		//Log.info("looking for " + this._currentlySelectedID);
		var nodes = this._getNodes(this._currentlySelectedID);
		
		// process keypress
		if(event.keyCode == Event.KEY_DOWN) { // if we can go one further down the list, do it but skip the contents of closed folders
			if(nodes.next) {
				var nextNode = this._getNextFolder(nodes, "next");
				
				if(nextNode && nextNode.onclickcallback) {
					this.setItemDownWithId(nextNode.entity[this.options.entityKey]);
					nextNode.onclickcallback.call(this, nextNode.entity);
				}
			}
		} else if(event.keyCode == Event.KEY_UP) {  // if we can go one further up the list, do it but skip the contents of closed folders
			if(nodes.prev) {
				var prevNode = this._getNextFolder(nodes, "previous");
				
				if(prevNode && prevNode.onclickcallback) {
					this.setItemDownWithId(prevNode.entity[this.options.entityKey]);
					prevNode.onclickcallback.call(this, prevNode.entity);
				}
			}
		} else if(event.keyCode == Event.KEY_RIGHT) { // if the currently selected level is collapsible and collapsed, expand it
			var folderLink = nodes.current.getElementsByTagName("a")[0];
			
			if(nodes.current.collapsible && folderLink.collapsed) {
				this._toggleFolder(folderLink, Element.getElementsByClassName(nodes.current.parentNode, "CollapsableTreeListContainerList")[0]);
			}
		} else if(event.keyCode == Event.KEY_LEFT) { // if the currently selected level is collapsible and expanded, collapse it
			var folderLink = nodes.current.getElementsByTagName("a")[0];
			
			if(nodes.current.collapsible && !folderLink.collapsed) {
				this._toggleFolder(folderLink, Element.getElementsByClassName(nodes.current.parentNode, "CollapsableTreeListContainerList")[0]);
			}
		}
		
		return true;
	},
	
	/**
	 * @param {Node} node
	 */
	_goodNode: function(node) {
		//Log.warn("testing " + node.tagName);
		
		while(node.tagName == "UL" || node.tagName == "LI") {
			//Log.warn("testing " + node.tagName);
			
			if(node.entity && this._folderOpenStatus[node.entity[this.options.entityKey]]) {
				if(DOMUtil.hasClass(node, "CollapseExpandListTitle")) { // allow highlighting of collapsed treetops
					return true;
				}
				
				//Log.warn("node hidden");
				return false;
			}
			
			node = node.parentNode;
		}
		
		//Log.warn("node visible");
		return true;
	},
	
	/**
	 * Returns the next/previous folder that isn't collapsed
	 * @param {Array} nodes
	 * 		startNode	One of the ul nodes that the list is made up of
	 * 		nextNode	The next li node in the series - may or may not be a
	 * @param	{String}	direction	previous or next.  Defaults to next
	 */
	_getNextFolder: function(nodes, direction) {
		direction = direction == "previous" ? direction : "next";
		
		if(direction == "previous") {
				for(var i = nodes.index - 1; i >= 0; i--) {
					if(this._goodNode(nodes.nodes[i])) {
						return nodes.nodes[i];
					}
			}
		} else {
				for(var i = nodes.index +1; i < nodes.nodes.length; i++) {
					if(this._goodNode(nodes.nodes[i])) {
						return nodes.nodes[i];
					}
				}
		}
		
		return false;
	},
	
	_getNodes: function(id) {
		var childNodes = [];
		
		$A(this.getRootNode().getElementsByTagName("li")).each(function(node){
			if(node.entity) {
				childNodes.push(node);
			}
		});
		
		var output = {
			prev: false,
			current: false,
			next: false,
			nodes: childNodes,
			index: -1
		};
		
		for(var i = 0; i < childNodes.length; i++) {
			if(childNodes[i].entity) {
				if(childNodes[i].entity[this.options.entityKey] == id) {
					output.index = i;
					output.prev = childNodes[i-1];
					output.current = childNodes[i];
					output.next = childNodes[i+1];
					break;
				}
			}
		}
		
		return output;
	}
});
