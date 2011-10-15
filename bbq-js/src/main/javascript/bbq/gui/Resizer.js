include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.Resizer
 * @extends bbq.gui.GUIWidget 
 */
bbq.gui.Resizer = new Class.create(bbq.gui.GUIWidget, {
	
	_disabled: null,
	_screenSize: null,
	_lastMousePosition: null,
	_dimension: null,
	_axis: null,
	_mouseIsDown: null,
	
	/**
	 * @param {mixed} options
	 * @example
	 * Supports the following options:
	 * 
	 * options {
	 * 		div1: node,						The div one side of the dragger
	 * 		div2: node,						The div on the other side of the dragger
	 * 		div1Min: int,					The minimum size of div1
	 * 		div2Min: int,					The minimum size of div2
	 * 		horizontal: bool			Whether the dragging motion is horizontal or vertical
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("Resizer");
		this.addClass(this.options.vertical ? "VerticalResizer" : "HorizontalResizer");
		this._disabled = false;
		
		if(this.options.vertical) {
			this._dimension = "height";
			this._axis = "y";
		} else {
			this._dimension = "width";
			this._axis = "x";
		}
		
		Event.observe(this.getRootNode(), "mousedown", function(event) {
			this._mouseIsDown = true;
			this._startResize(event);
		}.bindAsEventListener(this));
		
		Event.observe(document, "mouseup", function(event) {
			this._mouseIsDown = false;
		}.bindAsEventListener(this));
		
		Event.observe(this.getRootNode(), "mouseover", function(event) {
			if(this._mouseIsDown) {
				this._startResize(event);
			}
		}.bindAsEventListener(this));
	},
	
	/**
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		this._disabled = disabled;
		this[(disabled ? "add" : "remove") + "Class"]("ResizerDisabled");
	},
	
	_startResize: function(event) {
		if(!this._disabled) {
			this._lastMousePosition = {
				x: Event.pointerX(event),
				y: Event.pointerY(event)
			};
			
			Event.stop(event);
			document.onmousemove = this._resizeIt.bindAsEventListener(this);
			document.onmouseup = this._stopResize.bindAsEventListener(this);
			document.onselectstart = function() {
				return false;
			};
			
			this._screenSize = BBQUtil.getWindowSize();
			this.addClass("ResizerOver");
		}
	},
			
	_stopResize: function() {
		document.onmousemove = null;
		document.onmouseup = null;
		document.onselectstart = null;
		this._lastMousePosition = {};
		
		this.removeClass( "ResizerOver");
	},
	
	_getPanelDimension: function(panel, dimension) {
		var value;
		
		if(panel.getRootNode instanceof Function) {
			value = panel.getStyle(dimension);
		} else {
			value = panel.style[dimension];
		}
		
		return parseInt(value.replace("px", ""));
	},
	
	_resizeIt: function(event) {
		var currentMousePosition = {
			x: Event.pointerX(event),
			y: Event.pointerY(event)
		};
		
		var d = currentMousePosition[this._axis] - this._lastMousePosition[this._axis];
		
		var newDiv1Dim = this._getPanelDimension(this.options.div1, this._dimension) + d;
		var newDiv2Dim = this._getPanelDimension(this.options.div2, this._dimension) - d;
		
		if(this.options.div1.owner) {
			this.options.div1.owner().triggerEvent("onWillResize");
		}	
		
		if(this.options.div2.owner) {
			this.options.div2.owner().triggerEvent("onWillResize");
		}	
		
		if(newDiv1Dim > this.options.div1Min && newDiv2Dim > this.options.div2Min) {
			DOMUtil.setStyle(this.options.div1, this._dimension, newDiv1Dim + "px");
		}
		
		if(this.options.div1.owner) {
			this.options.div1.owner().triggerEvent("onResize");
			
			if(this.options.div1.owner().resize) {
				this.options.div1.owner().resize();
			}
		}	
		
		if(this.options.div2.owner) {
			this.options.div2.owner().triggerEvent("onResize");
			
			if(this.options.div2.owner().resize) {
				this.options.div2.owner().resize();
			}
		}	
		
		LayoutManager.resizePanels();
		this._lastMousePosition = currentMousePosition;
		this.notifyListeners("onResize");
		Event.stop(event);
	}
		
});
