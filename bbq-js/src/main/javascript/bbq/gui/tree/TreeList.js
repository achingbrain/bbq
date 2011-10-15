include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.tree.TreeList
 * @extends bbq.gui.GUIWidget 
 */
bbq.gui.tree.TreeList = new Class.create(bbq.gui.GUIWidget, {
	
	_entities: null,
	_selectedID: null,
	_selectedIndex: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._entities = [];
		
		this.setRootNode("ul");
		this.addClass("TreeList");
	},
	
	/**
	 * @param {Object} content
	 * @param {Object} parentNode
	 * @param {string} elementID 
	 */	
	addEntity: function(text, onclick, id) {
		this._entities.push({
			content: text,
			callback: onclick,
			id: id
		});
	},
	
	render: function() {
		this.empty();
		
		this._entities.each(function(entity) {
			var listElement = DOMUtil.createTextElement("li", entity.callback ? DOMUtil.createTextElement("a", entity.content, {href: ".", onclick: this._processClick.bindAsEventListener(this, entity)}) : entity.content);
			
			if(entity.id == this._selectedID) {
				DOMUtil.addClass(listElement, "down");
			}
			
			this.appendChild(listElement);
		}.bind(this));
	},
	
	_processClick: function(event, entity) {
		if(FocusWatcher) {
			FocusWatcher.setKeypressCallbackObject(this);
		}
		
		try {
			var element = BBQUtil.clearFocus(event);
		
			if(entity.callback) {
				entity.callback();
			}
		} catch(e) {
			Log.error("Error processing click callback", e);
		}
		
		this.setDown(entity);
		
		return false;
	},
	
	setDown: function(entity) {
		if(entity) {
			this.clearDown();
			
			var id;
			
			if(entity.getId && entity.getId instanceof Function) {
				id = entity.getId();
			} else if(typeof(entity.id) != "undefined") {
				id = entity.id;
			} else {
				id = entity;
			}
			
			var listElements = $A(this.getRootNode().getElementsByTagName("li"));
			
			this._entities.each(function(currentEntity, index) {
				if(currentEntity.id == id) {
					DOMUtil.addClass(listElements[index], "down");
					this._selectedID = id;
					this._selectedIndex = index;
				}
			}.bind(this));
		}
	},
	
	clearDown: function() {
		this.removeClass("down", true);
		this._selectedID = null;
		this._selectedIndex = null;
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
			if(this._entities[this._selectedIndex + 1]) {
				nextEntity = this._entities[this._selectedIndex + 1];
			}
		} else if(event.keyCode == Event.KEY_UP) {
			if(this._entities[this._selectedIndex - 1]) {
				nextEntity = this._entities[this._selectedIndex - 1];
			}
		}
		
		if(nextEntity) {
			this._processClick(null, nextEntity);
		}
		
		return true;
	}
});
