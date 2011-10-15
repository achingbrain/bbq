include(bbq.gui.ScrollLoadGUIWidget);
include(bbq.gui.LoadingNotification);

/**
 * @class bbq.gui.ImageBrowser
 * @extends bbq.gui.table.ScrollLoadGUIWidget
 */
bbq.gui.ImageBrowser = new Class.create(bbq.gui.ScrollLoadGUIWidget, {
	
	_lastNumEntities: null,
	
	/**
	 * Constructor
	 * @param {mixed} options
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("ImageBrowser");
	},
	
	/**
	 * @private
	 */
	_workOutMovement: function() {	
		if(this._scrollingTimeout) {
			clearTimeout(this._scrollingTimeout);
		}
		
		var scrollableDimensions = Element.getDimensions(this._scrollableHolder.getRootNode());
		
		if(scrollableDimensions.height == 0) {
			return;
		}
		
		// calculate number of images in row
		var offset = this._scrollableHolder.getRootNode().scrollTop;
		var numImagesInRow = Math.floor((scrollableDimensions.width - 4)/(this.options.boxWidth + 7));
		
		if(numImagesInRow == 0) {
			numImagesInRow = 1;
		}
		
		// calculate number of visible rows
		var visibleHeight = scrollableDimensions.height;
		var rowHeight = this.options.boxHeight + 4
		var startRow = Math.floor(offset > 0 ? (offset/rowHeight) : 1);
		var endRow = Math.ceil((offset + visibleHeight)/rowHeight);
		
		// calculate number of visible images
		var startImage = (startRow * numImagesInRow) - numImagesInRow;
		var endImage = (endRow * numImagesInRow);
		
		if(this._lastRange.start != startImage || this._lastRange.end != endImage || this._initialLoad === true) {
			this._lastRange.start = startImage;
			this._lastRange.end = endImage;
			
			// load missing details
			this._loadDetails(startImage, endImage);
		}
	},
	
	/**
	 * Render
	 */
	render: function() {	
		
		var scrollTop = 0;
		
		if(this._scrollableHolder) {
			scrollTop = this._scrollableHolder.getScrollTop();
		}
		
		this.empty();
		
		if(this._initialLoad == true) {
			this.appendChild(new bbq.gui.LoadingNotification({text: this.options.loadingText}));
		} else if(this._entities.getElements().length == 0) {
			this.appendChild(DOMUtil.createTextElement("p", this.options.noEntitiesText, {className: "ScrollLoadTableEmptyList"}));
		} else {
			try {	
				this._entities.getElements().each(function(entity, index) {
					if(entity) {
						this.appendChild(this.options.createImageView(entity, index));
					} else {
						this.appendChild(this._renderInvalidItem(index));
					}
				}.bind(this));
				
				this._lastNumEntities = this._entities.length;
			} catch(e) {
				Log.error("Error while rendering", e);
			}
		}
		
		if(this._scrollableHolder) {
			this._scrollableHolder.setScrollTop(scrollTop);
		}
	},
	
	/**
	 * @private
	 */
	_renderInvalidItem: function(index) {
		return DOMUtil.createTextElement("div", new bbq.gui.LoadingNotification(), {
			className: "ImageBox", style: {height: this.options.boxHeight + "px", width: this.options.boxWidth+ "px"}, invalid: true
		});
	}	
});
