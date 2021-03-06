include(bbq.lang.Delegator);
include(bbq.web.DOMUtil);

bbq.gui.GUIWidget = new Class.create(bbq.lang.Delegator, /** @lends bbq.gui.GUIWidget.prototype */ {
	/**
	 * This property holds the point at which this widget is attached to the DOM.
	 *
	 * @type {Node}
	 */
	_rootNode: null,

	/**
	 * <p>This class is used as a base for all objects that have GUI representations.</p>

	 * <p>The constructor method of this class should always be called explicitly by child classes.</p>
	 *
	 * <p>The rootNode property is a DOM node that is attached to the DOM tree after the object is
	 * created via the appendTo method.</p>
	 *
	 * <pre><code class="language-javascript">
	 * com.myapp.MyWidget = new Class.create(bbq.gui.GUIWidget, {
	 *      _greeting: null,
	 *
	 *      initialize: function($super, options) {
	 *          $super(options);
	 *
	 *          this._greeting = DOMUtil.createElement("p", "Hello world!");
	 *      },
	 *
	 *      render: function() {
	 *          this.empty();
	 *
	 *          this.appendChild(this._greeting);
	 *      }
	 * });
	 *
	 * ...
	 *
	 * var widget = new com.myapp.MyWidget({
	 *     attributes: {
	 *         className: "Foo",
	 *         style: {
	 *             backgroundColour: "red"
	 *         }
	 *     }
	 * });
	 * widget.appendTo(document.body);
	 * </code></pre>
	 *
	 * @memberOf bbq.gui
	 * @constructs
	 * @param {Object} options
	 * @param {Object} [options.attributes] A key/value object of attributes to be applied to the root node
	 * @extends bbq.lang.Delegator
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
	},
	
	/**
	 * <p>The idea of the method is to create a DOM node tree representation of the widget.  The root node of the tree should be
	 * this._rootNode.  The presence of any other nodes in the DOM tree which are not descendants of this._rootNode should not
	 * be relied upon.</p>
	 * 
	 * <p>This method will be called before the node tree is added to the main document tree (in a similar way to off-screen buffering
	 * in graphics programming) and may be called at seeming arbitrary times.  Consequently it should always create a 
	 * representation of the widget/object in it's current state but at the same time, not rely on any other portion of the DOM tree 
	 * existing.</p>
	 */
	render: function() {
		
	},
	
	/**
	 * <p>Sets the root node and registers this object for retrieval from the root node.</p>
	 * 
	 * <p>This object can then be retrieved by calling owner() on the dom node passed as the argument to this method.</p>
	 * 
	 * @param {Node or String} rootNode Either a DOM Node (from document.createElement) or the String name of a node - e.g. "div"
	 * @example
	 * <pre><code class="language-javascript">
	 * bbq.gui.form.TextField = new Class.create(bbq.gui.GUIWidget, {
	 *     initialize: function($super, options) {
	 *       $super(options);
	 *
	 *       this.setRootNode(document.createElement("input"));
	 *       this.addClass("TextField");
	 *       this.setAttribute("value", this.options.value);
	 *   }
	 * });
	 * 
	 * ...
	 * 
	 * var foo = new bbq.gui.form.TextField({value: "a value"});
	 * foo.appendTo(document.body);
	 * 
	 * ...
	 * 
	 * var bar = document.getElementById("exampleObject");
	 * var foo = bar.owner();
	 * </code></pre>
	 */
	setRootNode: function(rootNode) {
		if(this._rootNode) {
			var oldNode = this._rootNode;
		}

		if(Object.isString(rootNode)) {
			this._rootNode = document.createElement(rootNode);
		} else {
			this._rootNode = rootNode;
		}

		if(oldNode && oldNode.className) {
			this.addClass(oldNode.className.split(" "));
		}

		if(this.options && this.options.attributes) {
			var attr = this.options.attributes;
			for(var key in attr) {
				this.setAttribute(key, attr[key]);
			}
		}

		this._rootNode = $(this._rootNode);
		this.registerObject();
	},
	
	getRootNode: function() {
		return this._rootNode;
	},

	/**
	 * Sets a reference to this object on the rootNode DOM node.  This allows us to take a DOM node from the document tree and 
	 * get the GUIWidget object of which it is the root node.
	 * 
	 * @see bbq.gui.GUIWidget#setRootNode
	 */
	registerObject: function() {
		if(!this._rootNode) {
			return;
		}
		
		this._rootNode.owner = function() {
			return this;
		}.bind(this);
	},
	
	/**
	 * Removes all nodes attached to this GUIWidgets rootNode
	 */
	empty: function() {
		DOMUtil.emptyNode(this.getRootNode());
	},

	hasClass: function(className) {
		return DOMUtil.hasClass(this.getRootNode(), className);
	},
	
	/**
	 * Adds a class to the root node
	 *
	  * @param	{String}	className	The name of the class to add
	 */
	addClass: function(className) {
		DOMUtil.addClass(this.getRootNode(), className);
	},
	
	/**
	 * Removes a class from the root node
	 * 
	 * @param	{String}	className	The name of the class to remove
	 */
	removeClass: function(className, recursively) {
		DOMUtil.removeClass(this.getRootNode(), className, recursively);
	},
	
	/**
	 * Attaches the root node to the passed node
	 * 
	 * @param	{Node}	pageNode	The node to attach the root node to
	 */
	appendTo: function(pageNode) {
		try {
			if(pageNode) {
				pageNode = this._getNode(pageNode);
				pageNode.appendChild(this.getRootNode());
			}
			
			this.render();
		} catch(e) {
			Log.error("Error while appending to node " + pageNode, e);
		}
	},

	/**
	 * Adds this GUIWidget to the DOM in front of the passed node
	 *
	 * @param Node node
	 */
	appendBefore: function(node) {
		try {
			node = this._getNode(node);
			var parentNode = node.parentNode;
			parentNode.insertBefore(this.getRootNode(), node);

			this.render();
		} catch(e) {
			Log.error("Error while appending before " + node, e);
		}
	},

	appendAfter: function(node) {
		try {
			node = this._getNode(node);

			// find the parent node
			var parentNode = node.parentNode;

			// find the index of the node
			var nodeArray = $A(parentNode.childNodes);
			var index = nodeArray.indexOf(node);
			var nextNode = nodeArray[index + 1];

			parentNode.insertBefore(this.getRootNode(), nextNode);

			this.render();
		} catch(e) {
			Log.error("Error while appending after " + node, e);
		}
	},
	
	/**
	 * Adds a node or GUIWidget to the root node of this element
	 * 
	 * @param	{Mixed}	childNode	A Node, GUIWidget or array of Node and/or GUIWidget objects
	 */
	appendChild: function(childNode) {
		if(!childNode) {
			return;
		}
		
		if(childNode instanceof Array) {
			childNode.each(function(node) {
				this.appendChild(node);
			}.bind(this));
		} else {
			if(childNode && this._rootNode) {
				if(childNode.appendTo instanceof Function) {
					childNode.appendTo(this._rootNode);
				} else if(childNode.toUpperCase instanceof Function) {
					this._rootNode.appendChild(document.createTextNode(childNode));
				} else {
					this._rootNode.appendChild(childNode);
				}
			}
		}
		
		return childNode;
	},
	
	/**
	 * <p>Attempts to remove the passed node if it is a child of this._rootNode</p>
	 * 
	 * <p>The passed argument can be either a DOM Node object, or a GUIWidget object.</p>
	 * 
	 * @param	{Mixed}	A child node
	 */
	removeChild: function(childNode) {
		if(childNode && this.getRootNode()) {
			try {
				if(childNode.getRootNode instanceof Function) {
					this.getRootNode().removeChild(childNode.getRootNode());
				} else {
					this.getRootNode().removeChild(childNode);
				}
			} catch(e) {
				Log.error("Error removing child " + childNode, e);
			}
		}
	},
	
	/**
	 * Replaces a DOM node or GUIWidget that is a child of the root node of this object
	 * 
	 * @param	{Node || GUIWidget}		oldNode		The outgoing child
	 * @param	{Node || GUIWidget}		newNode		The incoming child
	 * @return {Node || GUIWidget}		The incoming child
	 */
	replaceChild: function(oldNode, newNode) {
		var output = newNode;

		if(oldNode && newNode && this.getRootNode()) {
			try {
				if(oldNode.getRootNode instanceof Function) {
					oldNode = oldNode.getRootNode();
				}

				if(newNode.getRootNode instanceof Function) {
					newNode.render();
					newNode = newNode.getRootNode();
				}

				// check that we actually contain the old node before attempting to replace it
				if(Element.descendantOf(oldNode, this.getRootNode())) {
					this.getRootNode().replaceChild(newNode, oldNode);
				}
			} catch(e) {
				Log.error("Error replacing child " + oldNode + " for " + newNode, e);
			}
		}

		return output;
	},
	
	/**
	 * Sets the id attribute on the root node
	 * 
	 * @param	{string}	id
	 */
	setId: function(id) {
		this.setAttribute("id", id);
	},
	
	/**
	 * Returns the id of the root node
	 * 
	 * @return	{string}
	 */
	getId: function() {
		this.getAttribute("id");
	},
	
	/**
	 * <p>Sets one or more CSS style properties to the passed value on the root node.</p>
	 * 
	 * @example
	 * <pre><code class="language-javascript">
	 * // setting individual styles
	 * myWidget.setStyle("width", "10em");
	 * </code></pre>
	 * @example
	 * <pre><code class="language-javascript">
	 * // setting multiple styles
	 * myWidget.setStyle({
	 *   width: "10em",
	 *   height: "5em"
	 * });
	 * </code></pre>
	 * @param	{string}	styleName	e.g. "border"
	 * @param	{string}	styleValue	e.g. "1px solid #CCC"
	 */
	setStyle: function() {
		DOMUtil.setStyle.apply(this, [this].concat($A(arguments)));
	},
	
	/**
	 * Returns the requested CSS style property
	 * 
	 * @param	{string}	styleName	e.g. "font"
	 * @return	{string}
	 */
	getStyle: function(styleName) {
		return DOMUtil.getStyle(this.getRootNode(), styleName);
	},
	
	/**
	 * Sets an attribute on the root node
	 * 
	 * @param	{String}	attributeName	e.g. "id"
	 * @param	{String}	attributeValue	e.g. "anElement"
	 */
	setAttribute: function() {
		if(arguments.length == 1 && arguments[0] instanceof Object) {
			for(var key in arguments[0]) {
				this.setAttribute(key, arguments[0][key]);
			}
		}
		
		if(arguments.length == 2) {
			var attributeName = arguments[0];
			var attributeValue = arguments[1];
			
			if(attributeName == "style" && attributeValue instanceof Object) {
				// special case
				for(var key in attributeValue) {
					this.setStyle(key, attributeValue[key]);
				}
				
				return;
			}
			
			this.getRootNode()[attributeName] = attributeValue;
		}
	},
	
	/**
	 * Returns the requested attribute from the root node
	 * 
	 * @param	{String}	attributeName	e.g. "id"
	 * @return	{String}
	 */
	getAttribute: function(attributeName) {
		if(this._rootNode) {
			return this._rootNode[attributeName];
		}
	},
	
	/**
	 * Returns whether or not the root node of this object is of the passed CSS class
	 * 
	 * @return boolean
	 */
	isClass: function(className) {
		return DOMUtil.hasClass(this.getRootNode(), className);
	},
	
	/**
	 * @return void
	 */
	resize: function() {
		this.notifyListeners("onResize");
	},
	
	_sizeScrollable: function(scrollable, dim, maxSize) {
		if(scrollable && scrollable.parentNode) {
			scrollable.owner().triggerEvent("onWillResize");
			var nodeList = $A(scrollable.parentNode.childNodes);
			
			nodeList.each(function(node){
				if(node && node != scrollable) {
						var dims = Element.getDimensions(node);
						maxSize = maxSize - dims[dim];
				}
			});
			
			scrollable.style[dim] = maxSize + "px";
			scrollable.owner().triggerEvent("onResize");
		}
	},
	
	/**
	 * Makes the passed node the first child of this object.
	 * 
	 * @param {Object} A GUIWidget or DOM Node
	 */
	insertAtTop: function(newNode) {
		this.getRootNode().insertBefore(this._getNode(newNode), this.getRootNode().firstChild);
	},
	
	/**
	 * Inserts the first passed node before the second.
	 * 
	 * @param {Object} A GUIWidget or DOM Node
	 * @param {Object} A GUIWidget or DOM Node - should be a child of this element
	 */
	insertBefore: function(newNode, referenceNode) {
		this.getRootNode().insertBefore(this._getNode(newNode), this._getNode(referenceNode));
	},
	
	/**
	 * Gets the DOM node from a GUIWidget
	 * 
	 * @param {Object} A GUIWidget or DOM Node
	 * @return {Node}
	 */
	_getNode: function(fromNode) {
		if(fromNode) {
			if(fromNode.getRootNode instanceof Function) {
				return fromNode.getRootNode();
			} else if(fromNode.appendChild) {
				return fromNode;
			}
		}

		Log.error("Invalid node!");
	},

	/**
	 * Causes this GUIWidget to gain focus
	 *
	 * @see bbq.gui.GUIWidget#blur
	 */
	focus: function() {
		this.getRootNode().focus();
	},

	/**
	 * Causes this GUIWidget to lose focus
	 *
	 * @see bbq.gui.GUIWidget#focus
	 */
	blur: function() {
		this.getRootNode().blur();
	},

	/**
	 * Shows this GUIWidget if hidden
	 *
	 * @see bbq.gui.GUIWidget#hide
	 */
	show: function() {
		this.getRootNode().show();
	},

	/**
	 * Hides this GUIWidget
	 *
	 * @see bbq.gui.GUIWidget#show
	 */
	hide: function() {
		this.getRootNode().hide();
	}
});
