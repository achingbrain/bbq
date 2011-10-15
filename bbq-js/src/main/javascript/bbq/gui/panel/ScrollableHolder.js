include(bbq.gui.panel.Panel);

/**
 * A panel with two and only two child panels
 * @class bbq.gui.panel.ScrollableHolder
 * @extends bbq.gui.panel.Panel
 */
bbq.gui.panel.ScrollableHolder  = new Class.create(bbq.gui.panel.Panel, {
	_scrollTop: 0,
	
	/**
	 * @param {mixed} options
	 * @example
	 * supports the following callbacks:
	 * 
	 * onScroll
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.layout.setExpands(true);
		
		this.addClass("ScrollableHolder");
		this.getRootNode().onscroll = this._onscroll.bindAsEventListener(this);
		this.registerListener("onWillResize", this._onWillResize.bind(this));
		this.registerListener("onResize", this._onResize.bind(this));
		
		if(this.options.contents) {
			this.appendChild(this.options.contents);
		}
		
		this.registerListener("onBeforeRemoveFromDOM", function() {
			this._scrollTop = this.getScrollTop();
			//Log.info("ScrollableHolder removed from DOM scrollTop" + this._scrollTop);
		}.bind(this));
	},
	
	_onscroll: function(event) {
		this.notifyListeners("onScroll");
	},
	
	/**
	 * If we have been scrolled downwards, store the old scroll value.
	 */
	_onWillResize: function(event) {
		//Log.info('onWillResize scrollTop = ' + this.getScrollTop());
		if(this.getScrollTop() > 0) {
			this._scrollTop = this.getScrollTop();
		}
	},
	
	/**
	 * When we are removed from the DOM tree, our scrollTop becomes 0, so if we've previously been
	 * scrolled down, restore the old scroll value.
	 */
	_onResize: function(event) {
		if(this.getScrollTop() == 0 && this._scrollTop > 0) {
			this.setScrollTop(this._scrollTop);
			// blank the old value so we don't jump around unexpectedly
			this._scrollTop = 0;
		}
		if(typeof(this._scrollTop) == 'undefined') {
			this._scrollTop = 0;
		}
		//Log.info('onResize called in ScrollableHolder scrollTop = '+this._scrollTop);
	},
	
	appendChild: function(childNode) {
		bbq.gui.panel.Panel.prototype.appendChild.call(this, childNode);
		
		if(childNode && childNode.setScrollableHolder instanceof Function) {
			childNode.setScrollableHolder(this);
			/*
			var scrollTop;
			
			childNode.registerListener("onBeforeSelectedEntityChange", function() {
				scrollTop = this.getScrollTop();
				Log.info("stored scrollTop " + scrollTop);
			}.bind(this));
			childNode.registerListener("onAfterSelectedEntityChange", function() {
				this.setScrollTop(scrollTop);
			}.bind(this));*/
		}
		
		return childNode;
	},
	
	getScrollTop: function() {
		//Log.info('getScrollTop = ' + this.getRootNode().scrollTop);
		return this.getRootNode().scrollTop;
	},
	
	setScrollTop: function(scrollTop) {
		//Log.info('setScrollTop = ' + scrollTop);
		return this.getRootNode().scrollTop = scrollTop;
	},
	
	appendTo: function(node) {
		bbq.gui.panel.Panel.prototype.appendTo.apply(this, arguments);
		
		if(this._scrollTop > 0) {
			this.setScrollTop(this._scrollTop);
		}
	}
});
