include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.FloatingWindow
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.FloatingWindow = new Class.create(bbq.gui.GUIWidget, {
	
	_contentDiv: null,
	_content: null,
	_lastMouseX: null,
	_lastMouseY: null,
	_escapeKeyObserver: null,
	
	/**
	 * @param {mixed} options
	 * @example	
	 * Supports the following options:
	 * 
	 * options: {
	 * 		x: int						// initial x position, optional
	 * 		y: int						// initial y position, optional
	 * 		width: int				// inital width
	 * 		height: int				// initial height
	 * 		owner: Object		// should implement a method called windowClosed
	 * 		title: String				// the window title
	 * 		modal: boolean		// whether the window should be modal
	 * 		nearPointer: boolean	// whether the window should appear near to where the user clicked
	 * 		pointerEvent: Event		// the mouse click
	 * 		shouldCloseWindow: Function // a function that can return false to prevent the window from disappearing
	 * }
	 * 
	 * Supports the following events:
	 * 
	 * onAppear
	 * onDisappear
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("FloatingWindow");
		this.setStyle("position", "absolute");
		this.setStyle("width", this.options.width + "px");
		this.setStyle("height", this.options.height + "px");
		
		this.setStyle("display", "none");
		
		if(!this.options.hideChrome) {
			this._windowTitle = DOMUtil.createTextElement("a", this.options.title ? this.options.title : ".", {
				title: Language.get("bbq.gui.FloatingWindow.clickandholdtodrag"), 
				href: ".", 
				onclick: this.blurIt.bindAsEventListener(this), 
				onmousedown: this.startDrag.bindAsEventListener(this),
				className: "FloatingWindowTitle"
			});
			
			if(Browser.InternetExplorer) {
				this._windowTitle.ondrag = function() {return false};
				this._windowTitle.onselectstart = function() {return false};
			}
			
			var row = DOMUtil.createTableRow(2);
			row.childNodes[0].appendChild(this._windowTitle);
			DOMUtil.addClass(row.childNodes[0], "dragLinkCell");
			
			row.childNodes[1].appendChild(DOMUtil.createTextElement("a", Language.get("bbq.gui.FloatingWindow.close"), {href: ".", onclick: this.closeWindow.bindAsEventListener(this)}));
			DOMUtil.addClass(row.childNodes[1], "closeLinkCell");
			
			this.appendChild(DOMUtil.createTextElement("div", DOMUtil.createTextElement("table", DOMUtil.createTextElement("tbody", row), {className: "chrome"}), {className: "FloatingWindowHeader"}));
			
			this._escapeKeyObserver = function(event) {
				// if escape key was pressed and we are the front-most window
				if(event.keyCode == Event.KEY_ESC && !DOMUtil.hasClass(this.getRootNode(), "Backgrounded")) {
					this.closeWindow();
				}
			}.bind(this);
			
			Event.observe(document, "keypress", this._escapeKeyObserver);
		}
		
		this._contentDiv = DOMUtil.createElement("div", {className: "FloatingWindowContent"}); 
		
		this.appendChild(this._contentDiv);
		
		this._resizeContent();
		
		Event.observe(window, "resize", this._windowResized.bind(this));
		
		if(this.options.modal) {
			currentPage.addModalLayer(this);
		}
		
		// register ourselves with the window list
		bbq.gui.FloatingWindow.windows.push(this);
		
		// watch the content window for clicks to bring the window to front
		var bringToFront = this.bringToFront.bind(this);
		Event.observe(this._contentDiv, "click", bringToFront);
		
		this.registerListener("onWindowClosed", function() {
			// stop observing content window to prevent memory leak
			Event.stopObserving(this._contentDiv, "click", bringToFront);
			
			// remove ourselves from the window list
			for(var i = 0; i < bbq.gui.FloatingWindow.windows.length; i++) {
				if(bbq.gui.FloatingWindow.windows[i] == this) {
					bbq.gui.FloatingWindow.windows.splice(i, 1);
					i--;
				}
			}
		}.bind(this));
	},
	
	isFrontMostWindow: function() {
		return this.getStyle("zIndex") == bbq.gui.FloatingWindow.topZIndex;
	},
	
	/**
	 * Brings this window in front of all other instances of FloatingWindow
	 */
	bringToFront: function() {
		bbq.gui.FloatingWindow.topZIndex++;
		this.setStyle("zIndex", bbq.gui.FloatingWindow.topZIndex);
		this.removeClass("Backgrounded");
		
		for(var i = 0; i < bbq.gui.FloatingWindow.windows.length; i++) {
			if(bbq.gui.FloatingWindow.windows[i] != this) {
				bbq.gui.FloatingWindow.windows[i].addClass("Backgrounded");
			}
		}
	},
	
	/**
	 * Shows the passed content in the window
	 */
	setContent: function(content) {
		if(content) {
			this._content = content;
			DOMUtil.emptyNode(this._contentDiv);
			
			if(this._content.appendTo) {
				this._content.setID(null);
				//this._content.setStyle("height", DOMUtil.getStyle(this._contentDiv, "height"));
				this._content.appendTo(this._contentDiv);
			} else {
				this._content.id = null;
				//DOMUtil.setStyle(this._content, "height", DOMUtil.getStyle(this._contentDiv, "height"));
				this._contentDiv.appendChild(this._content);
			}
			
			this._resizeContent();
		}
	},
	
	/**
	 * @private
	 */
	_minusStyle: function(node, style) {
		var dim = parseInt(node.getStyle(style))
		
		if(!isNaN(dim)) {
			return dim;
		}
		
		return 0;
	},
	
	/**
	 * @private
	 */
	_resizeContent: function() {
		var dims = Element.getDimensions(this.getRootNode());
		
		dims.width -= this._minusStyle(this._contentDiv, "paddingLeft");
		dims.width -= this._minusStyle(this._contentDiv, "paddingRight");
		dims.height -= this._minusStyle(this._contentDiv, "paddingTop");
		dims.height -= this._minusStyle(this._contentDiv, "paddingBottom");
		
		if(!this.options.hideChrome) {
			dims.height -= 30;
			dims.width -= 4;
		}
		
		DOMUtil.setStyle(this._contentDiv, "width", Math.abs(dims.width) + "px");
		DOMUtil.setStyle(this._contentDiv, "height", Math.abs(dims.height) + "px");
		
		if(this._content) {
			DOMUtil.setStyle(this._content, "height", Math.abs(dims.height - 2) + "px");
			//make sure that hight of content and contentDiv are different to please IE
			DOMUtil.setStyle(this._contentDiv, "height", Math.abs(dims.height) + "px");
			
			if(this._content.resize) {
				this._content.resize();
			}
		}
	},
	
	/**
	 * Sets the window title to the passed string
	 * 
	 * @param String title The new title
	 */
	setWindowTitle: function(title) {
		if(!this._windowTitle) {
			return;
		}
		
		DOMUtil.emptyNode(this._windowTitle);
		
		if(Object.isString(title)) {
			this._windowTitle.appendChild(document.createTextNode(title ? title : " "));
		} else {
			this._windowTitle.appendChild(title);
		}
	},
	
	/**
	 * @override
	 */
	render: function() {
		if(this._content && this._content.render) {
			this._content.render();
		}
	},
	
	/**
	 * Makes the window visible
	 */
	appear: function() {
		this.appendTo(document.body);
		
		this._resizeContent();
		
		Effect.Appear(this.getRootNode(), {
			duration: 0.1,
			afterFinish: function() {
				this._resizeContent();
				this.notifyListeners("onAppear");
				this.bringToFront();
			}.bind(this)
		});
	},
	
	/**
	 * Makes the window invisible
	 */
	disappear: function() {
		Effect.Fade(this.getRootNode(), { duration: 0.25 });
		setTimeout(function() {
			if(!this.options.modal) {
				var parentNode = this.getRootNode().parentNode;
		
				if(parentNode) {
					parentNode.removeChild(this.getRootNode());
				}
			}
			
			this.notifyListeners("onDisppear");
		}.bind(this), 260);
		
		Event.stopObserving(document, "keypress", this._escapeKeyObserver);
	},
	
	/**
	 * @override
	 */
	appendTo: function(node) {
		bbq.gui.GUIWidget.prototype.appendTo.apply(this, arguments);
		
		Effect.Appear(this.getRootNode(), { duration: 0.1 });
		
		this._positionWindow();
	},
	
	/**
	 * @private
	 */
	_positionWindow: function() {
		var dims = Element.getDimensions(this.getRootNode());
		var windowDims = BBQUtil.getWindowSize();
		
		if(this.options.x && this.options.y) {
			this.setStyle("left", this.options.x + "px");
			this.setStyle("top", this.options.y + "px");
		} else if(this.options.pointerEvent) {
			var mouseDims = {
				x: Event.pointerX(this.options.pointerEvent),
				y: Event.pointerY(this.options.pointerEvent)
			}
			
			var windowPosition = {x: 0, y: 0};
			
			if(mouseDims.x < (windowDims.width/2)) { //left hand side of screen
				if(mouseDims.y < (windowDims.height/2)) { // top half of screen
					windowPosition.x = mouseDims.x + 10;
					windowPosition.y = mouseDims.y - 10;
				} else { // bottom half of screen
					windowPosition.x = mouseDims.x + 10;
					windowPosition.y = (mouseDims.y - dims.height) + 10;
				}
			} else { // right hand side of screen
				if(mouseDims.y < (windowDims.height/2)) { // top half of screen
					windowPosition.x = (mouseDims.x - dims.width) - 10;
					windowPosition.y = mouseDims.y - 10;
				} else { // bottom half of screen
					windowPosition.x = (mouseDims.x - dims.width) - 10;
					windowPosition.y = (mouseDims.y - dims.height) + 10;
				}
			}
					
			this.setStyle("left", windowPosition.x + "px");
			this.setStyle("top", windowPosition.y + "px");
		} else {
			this.setStyle("left", Math.abs((windowDims.width - dims.width)/2) + "px");
			this.setStyle("top", Math.abs((windowDims.height - dims.height)/2) + "px");
		}
	},
	
	/**
	 * Makes the window disappear unless options.shouldCloseWindow is set and returns false.
	 */
	closeWindow: function(event) {
		BBQUtil.clearFocus(event);
		
		if(this.options.shouldCloseWindow instanceof Function && !this.options.shouldCloseWindow()) {
			return false;
		}
		
		this.notifyListeners("onWindowClosed");
		this.disappear();
		
		return false;
	},
	
	/**
	 * @private
	 */
	blurIt: function(event) {
		BBQUtil.clearFocus(event);
		return false;
	},
	
	/**
	 * @private
	 */
	startDrag: function(event) {
		BBQUtil.clearFocus(event);
		Event.stop(event);
		
		this.bringToFront();
		this._lastMouseX = Event.pointerX(event);
		this._lastMouseY = Event.pointerY(event);
		
		document.onmousemove = this._doDrag.bindAsEventListener(this);
		document.onmouseup = this._stopDrag.bindAsEventListener(this);
	},
	
	/**
	 * @private
	 */
	_stopDrag: function() {
		document.onmousemove = null;
		document.onmouseup = null;
	},
	
	/**
	 * @private
	 */
	_doDrag: function(event) {
		var x = parseInt(this.getStyle("left").replace("px", "")) - (this._lastMouseX - Event.pointerX(event));
		var y = parseInt(this.getStyle("top").replace("px", "")) - (this._lastMouseY - Event.pointerY(event))
		var windowDims = BBQUtil.getViewportSize();
		
		if(x >= 0 && x <= (windowDims.width - this.options.width - 10)) {
			this.setStyle("left", x + "px");
			this._lastMouseX = Event.pointerX(event);
		}
		
		if(y >= 0  && y <= (windowDims.height - this.options.height - 10)) {
			this.setStyle("top", y + "px");
			this._lastMouseY = Event.pointerY(event);
		}
	},
	
	/**
	 * Animates a change in the window size.
	 */
	setWindowSize: function(width, height, duration) {
		this.options.width = width;
		this.options.height = height;
		
		if(Object.isUndefined(duration)) {
			duration = 0.5;
			
			new Effect.Morph(this.getRootNode(), { 
				style: {
					width: this.options.width + "px",
					height: this.options.height + "px"
				},
				afterUpdate: function() {
					this._resizeContent();
					
					this._windowResized(true);
				}.bind(this),
				afterFinish: function() {
					this.notifyListeners("onAfterWindowResize");
				}.bind(this),
				duration: duration
			});
		} else {
			if(this._contentDiv) {
				this._contentDiv.style.display = "none";
			}
			
			new Effect.Morph(this.getRootNode(), {
				style: {
					width: this.options.width + "px",
					height: this.options.height + "px"
				},
				afterUpdate: function() {
					this._resizeContent();
					
					this._windowResized(true);
				}.bind(this),
				afterFinish: function() {
					if(this._contentDiv) {
						Effect.Appear(this._contentDiv, {duration: duration/2});
					}
					
					this.notifyListeners("onAfterWindowResize");
				}.bind(this),
				duration: duration
			});
		}
	},
	
	/**
	 * @private
	 */
	_windowResized: function(animate) {
		this._resizeContent();
		
		if(this.options.centerWindow) {
			// move window into center of screen
			this._positionWindow();
		} else {
			// make sure window is still entirely on the screen
			var windowDims = BBQUtil.getViewportSize();
			var x = parseInt(this.getStyle("left"));
			var y = parseInt(this.getStyle("top"));
			var onScreenX = (windowDims.width - this.options.width - 10);
			var onScreenY = (windowDims.height - this.options.height - 10);
			
			if(onScreenX < 0) {
				onScreenX = 0;
			}
			
			if(x > onScreenX) {
				if(animate) {
					new Effect.Morph(this.getRootNode(), {
						style: {
							left: onScreenX + "px"
						}, 
						duration: 0.15
					});
				} else {
					this.setStyle("left", onScreenX + "px");
				}
			}
			
			if(onScreenY < 0) {
				onScreenY = 0;
			}
			
			if(y > onScreenY) {
				if(animate) {
					new Effect.Morph(this.getRootNode(), {
						style: {
							top: onScreenY + "px"
						}, 
						duration: 0.15
					});
				} else {
					this.setStyle("top", onScreenY + "px");
				}
			}
		}
	}
});

bbq.gui.FloatingWindow.topZIndex = 100;
bbq.gui.FloatingWindow.windows = [];
