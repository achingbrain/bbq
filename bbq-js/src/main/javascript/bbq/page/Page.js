include(bbq.BBQ);
include(bbq.util.Log);
include(bbq.web.Browser);
include(bbq.web.DOMUtil);
include(bbq.language.Language);

bbq.page.Page = new Class.create(/** @lends bbq.page.Page.prototype */ {
	_modalLayer: null,
	_modalLayerContents: null,
	_fatalError: null,
	_options: null,
	
	/**
	 * Base class for creating per-page classes.
	 *
	 * @param {Object} args
	 * @constructs
	 */
	initialize: function(args) {
		//Log.info("Page constructor");
		currentPage = this;
		this._options = args ? args : {};

		DOMUtil.checkDOM();
	},

	/**
	 * Greys out the page and shows the passed element in the middle.  The passed element should
	 * extend bbq.gui.GUIWidget
	 * 
	 * @param	 bbq.gui.GUIWidget} guiWidget
	 */
	addModalLayer: function(guiWidget) {
		try {
			if(!this._modalLayer) {
				this._modalLayer = DOMUtil.createElement("div", {className: "modalLayer", style: {display: "none"}});
				document.body.appendChild(this._modalLayer);
			}

			this._modalLayerContents = guiWidget;
			this._modalLayerContents.setStyle("display", "none");
			this._modalLayerContents.appendTo(document.body);

			if(Browser.Mozilla && Browser.version < 3) { // stop scroll bars from showing through modal layer
				$$(".ScrollableHolder").each(function(element){
					element.style.overflow = "hidden";
				});

				$$(".FloatingWindow .ScrollableHolder").each(function(element){
					element.style.overflow = "auto";
				});
			}

			Effect.Appear(this._modalLayer, {
				duration: 0.25,
				to: 0.8
			});
			
			Effect.Appear(this._modalLayerContents.getRootNode(), {
				duration: 0.25,
				to: 1
			});

			if(this._modalLayerContents.appear && this._modalLayerContents.disappear) {
				// bbq.gui.FloatingWindow
				this._modalLayerContents.appear();
				this._modalLayerContents.registerOneTimeListener("onDisppear", this.clearModalLayer.bind(this));
			}

			return guiWidget;
		} catch(e) {
			Log.error("Error adding modal layer", e);
		}
	},

	/**
	 * Fades out the layers added by bbq.page.Page#addModalLayer
	 *
	 * @see bbq.page.Page#addModalLayer
	 */
	clearModalLayer: function() {
		if(this._fatalError) {
			return;
		}
		
		if(this._modalLayer) {
			Effect.Fade(this._modalLayer, {
				duration: 0.25
			});
		}

		if(this._modalLayerContents) {
			Effect.Fade(this._modalLayerContents.getRootNode(), {
				duration: 0.25
			});
		}

		if(Browser.Mozilla && Browser.version < 3) {// re-enable scroll bars
			$$(".ScrollableHolder").each(function(element){
				element.style.overflow = "auto";
			});
		}

		setTimeout(this._removeModalLayer.bind(this), 600);
	},

	/**
	 * Removes the layers added by com.proxim.page.Page.addModalLayer from the document tree
	 */
	_removeModalLayer: function() {
		if(this._fatalError) {
			return;
		}

		if(!this._modalLayer || this._modalLayer.parentNode != document.body) {
			return;
		}

		if(!this._modalLayerContents || !this._modalLayerContents.rootNode || this._modalLayerContents.rootNode.parentNode != document.body) {
			return;
		}

		try {
			document.body.removeChild(this._modalLayer);
			document.body.removeChild(this._modalLayerContents.rootNode);
		} catch(e) {
			Log.warn("Exception thrown while removing modal layer - " + e);
		}

		this._modalLayer = null;
		this._modalLayerContents = null;
	}
});
