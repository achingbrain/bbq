/**
 * Utility class with static methods for manipulating the DOM
 *
 * @class DOMUtil
 */
DOMUtil = {
	/** Boots old browsers to the upgrade page  */
	checkDOM: function() {
		if(!Browser.DOM || !Browser.Ajax) {
			window.location = "/requirements/error/browser/";
		}
	},
	
	/**
	 * Removes all children of the passed node
	 * 
	 * @param {Node} The node whose children to remove
	 * @return {Node}
	 */
	emptyNode: function(node) {
		if(!node) {
			return;
		}
		
		if(node instanceof bbq.gui.GUIWidget) {
			node = node.getRootNode();
		}
		
		while(node.hasChildNodes()) {
			var childNode = node.childNodes[node.childNodes.length-1];
			
			// if we are dealing with a GUIWidget, inform it's listeners 
			var owner;
			
			if(childNode.owner) {
				owner = childNode.owner();
			}
				
			if(owner && owner.notifyListeners) {
				owner.notifyListeners("onBeforeRemoveFromDOM");
			}
			
			node.removeChild(node.childNodes[node.childNodes.length-1]);
			
			if(owner && owner.notifyListeners) {
				owner.notifyListeners("onAfterRemoveFromDOM");
			}
		}
		
		return node;
	},
	
	/**
	 * Removes all children of the passed nodes
	 *
	 * @example
	 * <pre><code class="language-javascript">
	 * DOMUtil.emptyNodes(node1, node2…);
	 * </code></pre>
	 */
	emptyNodes: function() {
		$A(arguments).each(function(element, index) {
			if(element instanceof Array) {
				this.emptyNodes(element);
			} else {
				this.emptyNode(element);
			}
		}.bind(this));
	},
	
	/**
	 * Creates a node with a textNode as a child
	 * 
	 * @param	{string}		tagName
	 * @param	{string}		text
	 * @param	{Object}		attributes
	 * @return	{Node}
	 * @deprecated Use DOMUtil#createElement instead
	 */
	createTextElement: function(tagName, text, attributes) {
		var element = this.createElement(tagName, attributes);
		
		this.append(text ? text : "", element);
		
		return element;
	},
	
	/**
	 * Shortcut for creating a DOM node
	 *
	 *
	 * @example
	 * <pre><code class="language-javascript">
	 * // &lt;p&gt;Hello world!&lt;/p&gt;
	 * DOMUtil.createElement("p", "Hello world!");
	 * 
	 * // &lt;p class="foo" style="color: red" &gt;Hello world!&lt;/p&gt;
	 * DOMUtil.createElement("p", "Hello world!", {className: "foo", style: {color: "red"}});
	 *
	 * // &lt;p&gt;Contents as array&lt;/p&gt;
	 * DOMUtil.createElement("p", ["Contents", " ", "as", " ", "array"]);
	 * </code></pre> 
	 * @param	{string}		Tag name
	 * @param	{Object}		The contents of the output node - a string, DOM Node or bbq.gui.GUIWidget
	 * @param	{Object}		Attributes that will be applied to the output of this function
	 * @return	{Node}
	 */
	createElement: function(arg1, arg2, arg3) {
		var tagName = arg1;
		var attributes;
		var content;

		if(arg2 && (Object.isString(arg2) || arg2.appendChild || Object.isArray(arg2))) {
			content = arg2;
			attributes = arg3;

			return DOMUtil.createTextElement(tagName, content, attributes);
		} else {
			attributes = arg2;
		}

		var element = $(document.createElement(tagName));
		this.applyAttributesToElement(element, attributes);
		
		return element;
	},
	
	/**
	 * Creates a table row
	 * 
	 * @param {Number} numCells
	 * @param {boolean} header
	 * @return {Node}
	 */
	createTableRow: function(numCells, header) {
		var row = document.createElement("tr");
		
		for(var i = 0; i < numCells; i++) {
			row.appendChild(document.createElement((header ? "th" : "td")));
		}
		
		return row;
	},
	
	/**
	 * Creates a row of empty table header cells
	 * 
	 * @param {Number} numCells
	 * @return {Node}
	 */
	createTableHeaderRow: function(numCells) {
		return this.createTableRow(numCells, true);
	},
	
	/**
	 * Creates a single line HTML text input
	 * 
	 * @param {String} 	nodeValue
	 * @param {Object} 	options
	 * @return {Node}
	 */
	createTextInputNode: function(nodeValue, options) {
		var element = this.createElement("input", options);
		element.type = "text";
		element.value = (nodeValue == null ? "" : nodeValue);
				
		return element;
	},
	
	/**
	 * Creates a HTML password input
	 * 
	 * @param {String} nodeValue
	 * @param {Object} options
	 * @return {Node}
	 */
	createPasswordInputNode: function(nodeValue, options) {
		var element = this.createTextInputNode(nodeValue, options);
		element.type = "password";
		
		return element;
	},
	
	/**
	 * Creates a HTML submit button
	 * 
	 * @param {String} nodeValue
	 * @param {Object} options
	 * @return {Node}
	 */
	createSubmitInputNode: function(nodeValue, options) {
		var element = this.createTextInputNode(nodeValue, options);
		element.type = "submit";
		element.value = (nodeValue == null ? "" : nodeValue );
		
		return element;
	},
	
	/**
	 * Creates a HTML password input
	 * 
	 * @param {Node} element Node to apply attributes to
	 * @param {Object} attributes Associative array of attributes to apply to the passed node
	 * @return {void}
	 */
	applyAttributesToElement: function(element, attributes) {
		if(attributes) {
			for(var key in attributes) {
				if(key == "style") {
					for(s_key in attributes[key]) {
						element.style[s_key] = attributes[key][s_key];
					}
				} else {
					element[key] = attributes[key];
				}
			}
		}
	},

	createNullForm: function(attributes) {
		var element = document.createElement("form");
		
		this.applyAttributesToElement(element, attributes);
		
		element.action = ".";
		element.method = "get";
		element.onsubmit = function() {return false};
		
		return element;
	},
	
	/**
	 * Adds a CSS class to the passed node
	 * 
	 * @param {Node} node
	 * @param {string} newClass
	 * @return {void}
	 */
	addClass: function(node, newClass) {
		if(node && newClass) {
			if(newClass instanceof Array) {
				for(var i = 0, iCount=newClass.length; i < iCount; i++) {
					this.addClass(node, newClass[i]);
				}
			} else if(node.addClass) {
				node.addClass(newClass);
			} else if(!DOMUtil.hasClass(node, newClass)) {
				Element.addClassName(node, newClass);
			}
		}
	},
	
	/**
	 * Removes a CSS class to the passed node, optionally recursing through it's child nodes
	 * 
	 * @param {Node} node
	 * @param {String} oldClass
	 * @param {boolean} recursive
	 * @return {void}
	 */
	removeClass: function(node, oldClass, recursive) {
		if(!node) {
			return;
		}
		
		if(oldClass instanceof Array) {
			for(var i = 0; i < oldClass.length; i++) {
				this.removeClass(node, oldClass[i], recursive);
			}
		} else if(recursive) {
			this.recursivelyRemoveClasses(node, oldClass);
		} else {
			Element.removeClassName(node, oldClass);
		}
	},
	
	removeClasses: function(nodes, oldClass) {
		for(var i = 0; i < nodes.length; i++) {
			this.removeClass(nodes[i], oldClass);
		}
	},
	
	recursivelyRemoveClasses: function(node, oldClass) {
		if(node && node.hasChildNodes()) {
			this.removeClass(node, oldClass);
			
			for(var i = 0; i < node.childNodes.length; i++) {
				if(node.childNodes[i].hasChildNodes()) {
					this.recursivelyRemoveClasses(node.childNodes[i], oldClass);
				}
			}
		}
	},
	
	/**
	 * Returns the iFrameDocument object from the passed iFrame in a browser neutral way
	 * 
	 * @param {Node} iframe
	 * @return {Node}
	 */
	getIFrameDocument: function(iframe) {
		var oDoc = false;
		
		if(iframe.contentWindow) {
			Log.info("found iframe.contentWindow");
			oDoc = iframe.contentWindow;
		} else if(iframe.contentDocument) {
			Log.info("found iframe.contentDocument");
			oDoc = iframe.contentDocument;
		}
		
		if(oDoc.document) {
			Log.info("found oDoc.document");
			oDoc = oDoc.document;
		}
		
		return oDoc;
	},
	
	/**
	 * Sets a CSS style on the passed node to the passed value
	 * 
	 * @example
	 * <pre><code class="language-javascript">
	 * // setting individual styles
	 * DOMUtil.setStyle(node, "width", "10em");
	 * </code></pre>
	 * @example
	 * <pre><code class="language-javascript">
	 * // setting multiple styles
	 * DOMUtil.setStyle(node, {
	 *   width: "10em",
	 *   height: "5em"
	 * });
	 * </code></pre>
	 * 
	 * @param {Node or GUIWidget} element
	 * @param {Object} styleToSet
	 * @param {Object} value
	 */
	setStyle: function() {
		try {
			if(arguments.length == 0) {
				return;
			}
			
			if(arguments.length == 2 && arguments[1] instanceof Object) {
				for(var key in arguments[1]) {
					DOMUtil.setStyle(arguments[0], key, arguments[1][key]);
				}
			}
			
			if(arguments.length == 3) {
				var node = arguments[0];
				
				if(!node) {
					return;
				}
				
				if(node instanceof bbq.gui.GUIWidget) {
					node = node.getRootNode();
				}
				
				node.style[arguments[1]] = arguments[2];
			}
		} catch(e) {
			Log.error("Error setting style " + arguments, e);
		}
	},
	
	/**
	 * @param {Object} element
	 * @param {Object} styleToGet
	 */
	getStyle: function(element, styleToGet) {
		try {
			if(element.owner) {
				// get root node of GUIWidget
				element = element.owner().getRootNode();
			}

			if(element.currentStyle) {
				return element.currentStyle[styleToGet];
			} else if (window.getComputedStyle) {
				return document.defaultView.getComputedStyle(element, null).getPropertyValue(styleToGet);
			}

			if(element && element.style) {
				return element.style[styleToGet];
			}
		} catch(e) {
			Log.error("Error getting style " + styleToGet + " from element " + element, e);
		}
	},
	
	/**
	 * @param {Node}
	 * @param {string} className
	 * @return {boolean}
	 */
	hasClass: function(node, className) {
		var hasClass = false;
		
		if(node && node.className) {
			// broken
			//Element.hasClassName(node, className);
			
			var elementClassName = node.className;
			elementClassName = elementClassName.replace(/\s+/g, " ");
			
			elementClassName.split(" ").each(function(nodeClassName) {
				if(className == nodeClassName) {
					hasClass = true;
				}
			});
		}
		
		return hasClass;
	},
	
	/**
	 * @param {Object} headerArray
	 * @param {Object} attributes
	 * @return {Node}
	 */
	createTable: function(headerArray, attributes) {
		if(typeof(attributes) == "undefined") {
			attributes = {};
		}
		
		var table = DOMUtil.createElement("table", attributes);
		
		if(headerArray instanceof Array && headerArray.length > 0) {
			var thead  = DOMUtil.createElement("thead");
			thead.appendChild(DOMUtil._processRow(headerArray, "th"));
			table.appendChild(thead);
		}
		
		return table;
	},
	
	/**
	 * @param {Node} table
	 * @param {Object} rowData
	 */
	addRowToTable: function(table, rowData) {
		var tbody = table.getElementsByTagName("tbody")[0];
		
		if(!tbody) {
			tbody = document.createElement("tbody");
			table.appendChild(tbody);
		}
		
		tbody.appendChild(DOMUtil._processRow(rowData, "td"));
	},
	
	_processRow: function(rowData, cellType) {
		var row = document.createElement("tr");
		
		for(var i = 0; i < rowData.length; i++) {
			var headerCell = document.createElement(cellType);
			
			if(rowData[i]) {
				if(rowData[i].appendTo) {
					rowData[i].appendTo(headerCell);
				} else if(rowData[i].appendChild) {
					headerCell.appendChild(rowData[i]);
				} else {
					headerCell.appendChild(document.createTextNode(rowData[i]));
				}
			} else {
				headerCell.appendChild(document.createTextNode(" "));
			}
			
			row.appendChild(headerCell);
		}
		
		return row;
	},
	
	/**
	 * @param {Array} values
	 * @param {Array} attributes
	 * @return {Node}
	 */
	createDefinitionList: function(values, attributes) {
		var definitions = [];
		
		for(var key in values) {
			definitions.push(DOMUtil.createTextElement("dt", key, attributes[key]));
			definitions.push(DOMUtil.createTextElement("dd", values[key], attributes[key]))
		}
		
		return DOMUtil.createTextElement("dl", definitions);
	},
	
	_findSibling: function(node, type) {
		var sibling = null;
		
		while(true) {
			sibling = node[type + "Sibling"];
			
			if(!sibling) {
				return sibling;
			}
			
			if(sibling.nodeType != 3) {
				return $(sibling);
			}
			
			node = sibling;
		}
	},
	
	getOccupiedDimensions: function(node) {
		if(Object.isFunction(node.getRootNode)) {
			node = node.getRootNode();
		}
		
		node = $(node);
		
		var dims = {
			height: 0,
			width: 0
		};
		
		if(!node.getHeight || !node.getWidth) {
			return dims;
		}
		
		dims.height = node.getHeight();
		dims.width = node.getWidth();
		
		var nextSibling = DOMUtil._findSibling(node, "next");
		
		// find node siblings - if margins have been set we need to adjust the dimensions
		if(nextSibling) {
			
			// occupied size is affected by margins
			if(node.getStyle("marginBottom")) {
				var nodeMarginBotton = parseInt(node.getStyle("marginBottom"));
				var nextSiblingMarginTop = parseInt(nextSibling.getStyle("marginTop"));
				
				// only add if the next node's marginTop does not trump our marginBottom
				if(nodeMarginBotton > nextSiblingMarginTop) {
					dims.height += nodeMarginBotton;
				}
			}
			
			if(node.getStyle("marginRight")) {
				var nodeMarginRight = parseInt(node.getStyle("marginRight"));
				var nextSiblingMarginLeft = parseInt(nextSibling.getStyle("marginLeft"));
				
				// only add if the next node's marginTop does not trump our marginBottom
				if(nodeMarginRight > nextSiblingMarginLeft) {
					dims.width += nodeMarginRight;
				}
			}
		}
		
		var previousSibling = DOMUtil._findSibling(node, "previous");
		
		if(previousSibling) {
			
			// occupied size is affected by margins
			if(node.getStyle("marginTop")) {
				var nodeMarginTop = parseInt(node.getStyle("marginTop"));
				var previousSiblingMarginBottom = parseInt(previousSibling.getStyle("marginBottom"));
				
				// only add if the next node's marginTop does not trump our marginBottom
				if(nodeMarginTop > previousSiblingMarginBottom) {
					dims.height += nodeMarginTop;
				}
			}
			
			if(node.getStyle("marginLeft")) {
				var nodeMarginLeft = parseInt(node.getStyle("marginLeft"));
				var previousSiblingMarginBottom = parseInt(previousSibling.getStyle("marginRight"));
				
				// only add if the next node's marginTop does not trump our marginBottom
				if(nodeMarginLeft > previousSiblingMarginBottom) {
					dims.width += nodeMarginLeft;
				}
			}
		}
		
		return dims;
	},
	
	/*
	 * Returns the dimensions occupied by an element on screen, including padding
	
	getOccupiedDimensions: function(node) {
		var dims = {height: 0, width: 0};
		
		if(!(node.getStyle instanceof Function)) {
			return dims;
		}
		
		dims.height = parseInt(node.getStyle("height"));
		dims.height = DOMUtil._addStyleCalculation(dims.height, node, "borderTopWidth");
		dims.height = DOMUtil._addStyleCalculation(dims.height, node, "borderBottomWidth");
		dims.height = DOMUtil._addStyleCalculation(dims.height, node, "marginTop");
		dims.height = DOMUtil._minusStyleCalculation(dims.height, node, "marginBottom");
		dims.height = DOMUtil._addStyleCalculation(dims.height, node, "paddingTop");
		dims.height = DOMUtil._addStyleCalculation(dims.height, node, "paddingBottom");
		
		dims.width = parseInt(node.getStyle("width"));
		dims.width = DOMUtil._addStyleCalculation(dims.width, node, "borderLeftWidth");
		dims.width = DOMUtil._addStyleCalculation(dims.width, node, "borderRightWidth");
		dims.width = DOMUtil._minusStyleCalculation(dims.width, node, "marginLeft");
		dims.width = DOMUtil._minusStyleCalculation(dims.width, node, "marginRight");
		dims.width = DOMUtil._addStyleCalculation(dims.width, node, "paddingLeft");
		dims.width = DOMUtil._addStyleCalculation(dims.width, node, "paddingRight");
		
		return dims;
	},
	
	_addStyleCalculation: function(dim, node, style) {
		return DOMUtil._doStyleCalculation(dim, node, style, true);
	},

	_minusStyleCalculation: function(dim, node, style) {
		return DOMUtil._doStyleCalculation(dim, node, style, false);
	},
	
	_doStyleCalculation: function(dim, node, style, add) {
		var value = parseInt(node.getStyle(style));
		
		if(!isNaN(value)) {
			if(add) {
				dim += value;
			} else {
				dim -= value;
			}
		}
		
		return dim;
	}, */
	
	/**
	 * Returns true if the passed node is in the DOM
	 * 
	 * @param {Node} a DOM Node
	 * @returns {boolean}
	 */
	isInDOM: function(node) {
		while(true) {
			if(!node.parentNode) {
				return false;
			} else if(node.parentNode.tagName == "BODY") {
				return true;
			}
			
			node = node.parentNode;
		}
	},
	
	append: function(what, toNode) {
		if(Object.isString(what) || Object.isNumber(what)) {
			// string or number
			toNode.appendChild(document.createTextNode(what));
		} else if(what.appendTo) {
			// GUIWidget
			what.appendTo(toNode);
		} else if(what.appendChild) {
			// Node
			toNode.appendChild(what);
		} else if(Object.isArray(what)) {
			// Array of items
			what.each(function(item) {
				DOMUtil.append(item, toNode);
			});
		}
	},
	
	elementWasClickedOn: function(event, element) {
		var position = Element.positionedOffset(element);
		var dims = Element.getDimensions(element);
		var mouseX = Event.pointerX(event);
		var mouseY = Event.pointerY(event);
		var inBoxHorizontal = mouseX > position.left && mouseX < position.left + dims.width;
		var inBoxVertical = mouseY > position.top && mouseY < position.top + dims.height;
		
		return inBoxHorizontal && inBoxVertical;
	}
}
