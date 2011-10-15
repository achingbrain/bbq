include(bbq.gui.panel.DualPanel);
include(bbq.gui.Resizer);
include(bbq.gui.panel.Panel);

/**
 * @class bbq.gui.panel.ResizablePanels
 * @extends bbq.gui.panel.DualPanel
 */
bbq.gui.panel.ResizablePanels  = new Class.create(bbq.gui.panel.DualPanel, {
	_resizer: null,
	_resized: false,
	
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("ResizeablePanels");
		this.addClass((this.layout.vertical() ? "Vertical" : "Horizontal") + "ResizeablePanels");
		
		this._resizer = new bbq.gui.Resizer({
			vertical: this.layout.vertical()
		});
		
		if(this.options.panel1InitialSize) {
			this._resized = true;
		}
	},
	
	/**
	 * @return Returns the resizer widget	
	 * @type {bbq.gui.Resizer}
	 */
	getResizer: function() {
		return this._resizer;
	},
	
	/**
	 * Draws the panels
	 * 
	 * @return	void
	 */
	render: function() {
		this.empty();
		
		try {
			var panel1 = new bbq.gui.panel.Panel();
			var panel2 = new bbq.gui.panel.Panel();
			
			if(this.layout.vertical()) {
				if(this.getTopPanel()) {
					panel1 = this.getTopPanel();
				}
				
				if(this.getBottomPanel()) {
					panel2 = this.getBottomPanel();
					panel2.setStyle("position", "absolute");
				}
			} else {
				if(this.getLeftPanel()) {
					panel1 = this.getLeftPanel();
				}
				
				if(this.getRightPanel()) {
					panel2 = this.getRightPanel();
				}
			}
			
			if(this._resizer != null) {
				this._resizer.options.div1 = panel1.getRootNode();
				this._resizer.options.div1Min = (this.options.panel1Min ? this.options.panel1Min : 50);
				this._resizer.options.div2 = panel2.getRootNode();
				this._resizer.options.div2Min = (this.options.panel2Min ? this.options.panel2Min : 50);
				
				// ensure that when dragged, the intial size specificed gets set to false
				this._resizer.registerListener("onResize", function() {
					this.options.panel1InitialSize = false;
					this._resized = true;
				}.bind(this));
			}
			
			this.appendChild(panel1);
			this.appendChild(this._resizer);
			this.appendChild(panel2);
		} catch(e) {
			Log.error("Error rendering", e);
		}
	},
	
	_getDimensions: function(element) {
		var panelSizing = Element.getDimensions(element);
		
		var borderWidthLeft = parseInt(element.getStyle("borderLeftWidth"))
		var borderWidthRight = parseInt(element.getStyle("borderRightWidth"));
		var borderWidth = 0 + (isNaN(borderWidthLeft) ? 0 : borderWidthLeft) + (isNaN(borderWidthRight) ? 0 : borderWidthRight)
		
		panelSizing.width -= borderWidth;
		
		var borderHeightTop = parseInt(element.getStyle("borderTopWidth"))
		var borderHeightBottom = parseInt(element.getStyle("borderBottomWidth"));
		var borderHeight = 0 + (isNaN(borderHeightTop) ? 0 : borderHeightTop) + (isNaN(borderHeightBottom) ? 0 : borderHeightBottom)
				
		panelSizing.height -= borderHeight;
		
		return panelSizing;
	},
	
	resize: function() {
		try {
			var availableSize = {
				width: parseInt(this.getStyle("width")),
				height: parseInt(this.getStyle("height"))
			}
			
			if(isNaN(availableSize.width) || isNaN(availableSize.height)) {
				return;
			}
			
			var panel1 = null;
			var panel2 = null;
			
			if(this.layout.vertical) {
				panel1 = this.getTopPanel();
				panel2 = this.getBottomPanel();
			} else {
				panel1 = this.getRightPanel();
				panel2 = this.getLeftPanel();
			}
			
			var panel1sizing = {width: 0, height: 0};
			var panel2sizing = {width: 0, height: 0};
			var resizerSizing = {width: 0, height: 0};
			
			if(!this._resized) {
				// if we'v never been resized, ensure that both panels are 50% of the available size
				if(this.layout.vertical()) {
					resizerSizing.width =  availableSize.width;
					panel1sizing.width =  availableSize.width;
					panel2sizing.width =  availableSize.width;
					
					panel1sizing.height = Math.round((availableSize.height - 22) / 2);
					panel2sizing.height = availableSize.height - panel1sizing.height;
					
					//Log.info("height " + panel1sizing.height);
				} else {
					resizerSizing.height =  availableSize.height;
					panel1sizing.height =  availableSize.height;
					panel2sizing.height =  availableSize.height;
					
					panel1sizing.width = Math.round((availableSize.width - 22) / 2);
					panel2sizing.width = availableSize - panel1sizing.width;
				}
			} else {
				if(panel1) {
					panel1sizing = this._getDimensions(panel1.getRootNode());
				}
				
				if(panel2) {
					panel2sizing = this._getDimensions(panel2.getRootNode());
				}
			}
			
			if(this.layout.vertical()) {
				//Log.info("sizing vertical resizeable") ;
				this._computeSizing("width", "height", availableSize, panel1sizing, panel2sizing, resizerSizing, panel1, panel2);
				
				resizerSizing.top = panel1sizing.height;
				resizerSizing.left = 0;
				panel2sizing.top = resizerSizing.top + resizerSizing.height;
			} else {
				this._computeSizing("height", "width", availableSize, panel1sizing, panel2sizing, resizerSizing);
				
				resizerSizing.top = 0;
				resizerSizing.left = panel1sizing.width;
				panel2sizing.left = resizerSizing.left + resizerSizing.width;
			}
			
			this._applySizing(panel1, panel1sizing);
			this._applySizing(panel2, panel2sizing);
			this._applySizing(this.getResizer(), resizerSizing);
			
			if(panel1 && Object.isFunction(panel1.resize)) {
				panel1.resize();
			}
			
			if(panel2 && Object.isFunction(panel2.resize)) {
				panel2.resize();
			}
			
			this.notifyListeners("onResize");
		} catch(e) {
			Log.error("Error resizing", e);
		}
	},
	
	/*setTopPanel: function($super, content, panelName) {
		content.setStyle("position", "absolute");
		content.setStyle("top", "0");
		
		$super(content, panelName);
	},*/
	
	setRightPanel: function($super, content, panelName) {
		content.setStyle("position", "absolute");
		content.setStyle("top", "0");
		
		$super(content, panelName);
	},
	
	_applySizing: function(panel, sizing) {
		if(panel) {
			for(var key in sizing) {
				if(!isNaN(sizing[key]) && sizing[key] > 0) {
					panel.setStyle(key, sizing[key] + "px");
				}
			}
			
			panel.resize();
		}
	},
	
	_computeSizing: function(dim1, dim2, availableSize, panel1sizing, panel2sizing, resizerSizing, panel1, panel2) {
		// increase non-directional size to the maximum - eg. if this.options.direction == "vertical" make width as wide as possible
		var maxDim = parseInt(this.getStyle(dim1));
		
		panel1sizing[dim1] = maxDim;
		panel2sizing[dim1] = maxDim;
		
		// make resizer 22px wide and expand height or vise versa
		resizerSizing[dim1] = maxDim;
		resizerSizing[dim2] = 22;
		
		if(panel1 && panel1.hasMinimisedChild && panel1.hasMinimisedChild()) {
			// if panel is minimised, set the size of the panel to reflect that
			panel1sizing[dim2] = panel1.getMinimisedSize();
		} else if(this.options.panel1Min && panel1sizing[dim2] < this.options.panel1Min) {
			// if minimum specified, enforce it
			panel1sizing[dim2] = this.options.panel1Min;
		}
		
		if(panel2 && panel2.hasMinimisedChild && panel2.hasMinimisedChild()) {
			panel2sizing[dim2] = panel2.getMinimisedSize();
			
			// available size minus dim of minimised panel minus dim of resizer
			panel1sizing[dim2] = availableSize[dim2] - panel2.getMinimisedSize() - resizerSizing[dim2];
		}
		
		// if initial size specified, enforce it.  N.B - this.options.panel1InitialSize gets set to false when the dragger is first dragged
		if(this.options.panel1InitialSize) {
			var dim = this.getRootNode()["get" + dim2.capitalize()]();
			
			if(dim - this.options.panel1InitialSize < panel2sizing[dim2]) {
				panel1sizing[dim2] = this.options.panel1InitialSize/2;
			} else {
				panel1sizing[dim2] = this.options.panel1InitialSize;
			}
		}
		
		panel2sizing[dim2] = availableSize[dim2] - panel1sizing[dim2] - resizerSizing[dim2];
		
		// if minimum specified, enforce it
		if(this.options.panel2Min && panel2sizing[dim2] < this.options.panel2Min) {
			panel2sizing[dim2] = this.options.panel2Min;
			
			panel1sizing[dim2] = availableSize[dim2] - panel2sizing[dim2] - resizerSizing[dim2];
		}
	},
	
	setDisabled: function(disabled) {
		this._resizer.setDisabled(disabled);
	}
});
