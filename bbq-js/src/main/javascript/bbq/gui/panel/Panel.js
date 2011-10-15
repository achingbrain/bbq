include(bbq.gui.GUIWidget);
include(bbq.gui.layout.Layout);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.panel.Panel
 * @extends bbq.gui.GUIWidget 
 */
bbq.gui.panel.Panel = new Class.create(bbq.gui.GUIWidget, {
	_childPanels: {},
	layout: null,
	
	/**
	 * @param	{Object}	options		An associative array
	 * @example
	 * 
	 * Supports the following options:
	 * 
	 * options = {
	 * 		fixedHeight: boolean		// If true, the panel will not be resized in height - set the desired height in CSS  NB. The panel preceeding this panel will be reized to fill all remaining height
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		if(!this.options.layout) {
			this.options.layout = new bbq.gui.layout.Layout();
		}
		
		this.layout = this.options.layout;
		
		this.setRootNode("div");
		this.getRootNode().layout = this.layout;
		this.addClass("Panel");
		
		this._childPanels = {};
	},
	
	/**
	 * Adds a child panel to this panel object.  Child panels are named so they can be replaced by passing a new panel
	 * with the same name.
	 * 
	 * @param	{string}	panelName
	 * @param	{mixed}	panelContent	Can be bbq.gui.GUIWidget or Node
	 */
	_setChildPanel: function(panelName, panelContent) {
		if(typeof(this._childPanels[panelName]) != "undefined" && typeof(panelContent) != "undefined") {
			this.replaceChild(this._childPanels[panelName], panelContent);
		}
		
		this._childPanels[panelName] = panelContent;
	},
	
	/**
	 * Returns the panel with the specified name
	 * 
	 * @param	{string}	panelName
	 * @return	{mixed}		Can be bbq.gui.GUIWidget or Node
	 */
	_getChildPanel: function(panelName) {
		if(typeof(this._childPanels[panelName]) == "undefined") {
			return null;
		}
		
		return this._childPanels[panelName];
	},
	
	/**
	 * @param {Object} options Should be bbq.gui.panel.Panel 
	 * @example
	 * addPanel({panel: Panel, withName: String})
	 */
	addPanel: function(options) {
		if(Object.isUndefined(options.withName)) {
			options.withName = BBQUtil.generateGUID();
		}
		
		this._setChildPanel(options.withName, options.panel);
		bbq.gui.GUIWidget.prototype.appendChild.call(this, options.panel);
		
		return options.panel;
	},
	
	/**
	 * Replace a child panel.  Pass in the panel to replace or it's name, and the new panel.
	 * 
	 * @param {Mixed}	oldPanel		A string or a bbq.gui.panel.Panel object.  Must be a child of this panel
	 * @param {bbq.gui.panel.Panel}		newPanel	The new panel
	 */
	replacePanel: function(oldPanel, newPanel) {
		if(oldPanel && newPanel) {
			var panelName;
			
			if(oldPanel.toUpperCase) {
				panelName = oldPanel;
			} else {
				panelName = this._getPanelName(oldPanel);
			}
			
			if(!panelName) {
				Log.warn("Panel to replace is not a child of this panel");
				return;
			}
			
			var panelToReplace = this._childPanels[panelName];
			
			if(!panelToReplace) {
				Log.warn("Panel to replace is not a child of this panel");
				return;
			}
			
			// replace the DOM node
			var parentNode = panelToReplace.getRootNode().parentNode;
			
			if(parentNode) {
				newPanel.render();
				parentNode.replaceChild(newPanel.getRootNode(), panelToReplace.getRootNode());
			}
			
			// add to our local store
			this._setChildPanel(panelName, newPanel);
		}
	},
	
	/**
	 * @private
	 */
	_getPanelName: function(panel) {
		for(var key in this._childPanels) {
			if(this._childPanels[key] == oldPanel) {
				return key;
			}
		}
		
		return null;
	},
	
	/**
	 * Appends child to a panel. Child can be ancestor of Panel or GUIWidget.
	 * 
	 * @param {Object} child
	 */
	appendChild: function($super, child) {
		if(child && child.isClass && child.isClass("panel")) {
			this._setChildPanel(BBQUtil.generateGUID(), child);
		}
		
		return $super(child);
	},
	
	/**
	 * Returns a child panel by name
	 * @param {String} byName
	 * @return {Object}
	 */
	getPanel: function(byName) {
		return this._getChildPanel(byName);
	},
	
	/**
	 * Sets a child on a Panel object
	 * 
	 * @param {String} withName
	 * @param {Panel} withPanel
	 * @return {Panel}
	 */
	setPanel: function(withName, withPanel) {
		this._setChildPanel(withName, withPanel);
		return withPanel;
	},
	
	/**
	 * @private
	 */
	_getPanelHeight: function(node) {
		if(!node) {
			//Log.error("Invalid node passed to Panel#_getPanelHeight");
			return NaN;
		}
		
		node = (node.getRootNode ? node.getRootNode() : node);
		
		if(DOMUtil.getStyle(node, "display") == "none") {
			return 0;
		}
		
		var occupiedDims = DOMUtil.getOccupiedDimensions(node);
		
		if(isNaN(occupiedDims.height)) {
			//Log.warn("height NaN "+ node.className);
			var dims = Element.getDimensions(node);
			
			if(isNaN(dims.height)) {
				Log.error("height still NaN "+ node.className);
			} else {
				//Log.warn("height was "+ dims.height);
				occupiedDims.height = dims.height;
			}
		}
		//Log.info("returning " + (occupiedDims.height < 0 ? 0 : occupiedDims.height));
		return occupiedDims.height < 0 ? 0 : occupiedDims.height;
	},
	
	/**
	 * @private
	 */
	_getResizeCandidate: function(panels, scrollable) {
		if(typeof(scrollable) != "undefined" && scrollable) {
			return scrollable;
		} else {
			return panels.last();
		}
	},
	
	/**
	 * @private
	 */
	_expandPreviousPanel: function(panel, height) {
		if(panel) {
			panel.setStyle("height", height + "px");
			
			if(panel.resize) {
				panel.resize();
			}
			
			return true;
		}
		
		return false;
	},
	
	_findLayout: function(node) {
		if(node.owner) {
			owner = node.owner();
			
			return owner.layout;
		}
		
		return node.layout;
	},
	
	_gatherNodesForResize: function(node) {
		var panels = [];
		
		// gather child nodes that want resizing
		$A(node.childNodes).each(function(node) {
			var layout = null;
			var owner = null;
			
			if(node.owner) {
				// is a GUIWidget
				owner = node.owner();
				
				if(owner.layout) {
					// is a GUIWidget that wants layout
					layout = owner.layout;
				}
			} else {
				if(node.layout) {
					// is a node that's had a bbq.gui.layout.Layout object attached to it
					layout = node.layout;
				}
			}
			
			if(DOMUtil.getStyle(node, "display") == "none") {
				// skip hidden items
				return;
			}
			
			panels.push({
				node: node,
				layout: layout,
				owner: owner
			});
		});
		
		return panels;
	},
	
	_nodeIsInDocumentFlow: function(node) {
		if(DOMUtil.getStyle(node, "position") == "absolute") {
			return false;
		}
		
		if(DOMUtil.getStyle(node, "top")) {
			return false;
		}
		
		if(DOMUtil.getStyle(node, "left")) {
			return false;
		}
		
		if(DOMUtil.getStyle(node, "float")) {
			return false;
		}
		
		return true;
	},
	
	_resizeNode: function(node) {
		try {
			if(node.nodeType == 3) {
				// do not try to resize text nodes
				return;
			}
			
			var owner = null;
			var nodeLayout = this._findLayout(node);
			
			if(node.owner) {
				owner = node.owner();
			}
			
			var availableHeight = this._getPanelHeight(node);
			var styleHeight = parseInt(node.style.height);
			
			if(availableHeight > styleHeight) {
				availableHeight = styleHeight;
			}
			
			if(availableHeight <= 0) {
				return;
			}
			
			if(owner) {
				owner.triggerEvent("onWillResize");
			}
			
			var panels = this._gatherNodesForResize(node);
			var scrollable = null;
			
			// stores height of scrollable 
			var lastScrollableHeight = 0;
			
			panels.each(function(panel) {
				if(nodeLayout && nodeLayout.vertical()) {
					// i am a panel with vertical contents
					var panelHeight = this._getPanelHeight(panel.node);
					
					// subtract height of panel from available height
					if(panel.layout && panel.layout.expands()) {
						lastScrollableHeight = panelHeight;
						
						// store reference to panel which will expand 
						scrollable = panel;
					}
					
					// floaty nodes do not affect available height
					if(this._nodeIsInDocumentFlow(panel.node)) {
						availableHeight -= panelHeight;
					}
				} else {
					// i am a panel with horizontal contents
					if(panel.layout && panel.layout.expands()) {
						DOMUtil.setStyle(panel.node, "height", availableHeight + "px");
					}
				}
			}.bind(this));
			
			if(scrollable && nodeLayout && nodeLayout.vertical()) {
				// resize scrollable to fill available height
				DOMUtil.setStyle(scrollable.node, "height", lastScrollableHeight + availableHeight + "px");
			}
			
			// all done, resize each child panel
			panels.each(function(panel) {
				this._resizeNode(panel.node);
			}.bind(this));
			
			if(owner) {
				owner.triggerEvent("onResize");
			}
		} catch(e) {
			Log.error("Error resizing node", e);
		}
	},
	
	/**
	 * Resizes and notifies listeners "onResize"
	 */
	resize: function() {
		this._resizeNode(this.getRootNode());
	},
	
	/**
	 * Checks whether the panel has a minimised child
	 * @return {Boolean}
	 */
	hasMinimisedChild: function() {
		for(var key in this._childPanels) {
			if(this._childPanels[key].minimised) {
				return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Returns a minimised height
	 * @return {Integer} height
	 */
	getMinimisedSize: function() {
		var height = parseInt(this.getStyle("height"));
		
		for(var key in this._childPanels) {
			if(this._childPanels[key].minimised) {
				var childHeight = parseInt(this._childPanels[key].getStyle("height"));
				
				if((height - childHeight) < 0) {
					return height;
				}
				
				height -= childHeight;
			}
		}
		
		return height;
	}
});
