include(bbq.gui.GUIWidget);

/**
 * ModalLayer
 * 
 * Greys out the page and shows the passed element in the middle.  The passed element should
 * extend bbq.gui.GUIWidget
 * @class bbq.gui.ModalLayer
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.ModalLayer = new Class.create(bbq.gui.GUIWidget, {
	layerContents: null,
	
	/**
	 * @param {GUIWidget} guiWidget	bbq.gui.GUIWidget
	 */
	initialize: function($super, guiWidget) {
		$super();
		
		this.setRootNode("div");
		this.addClass("ModalLayer");
		this.setStyle("display", "none");
		
		this.appendTo(document.body);
		
		this.layerContents = guiWidget;
		this.layerContents.setStyle("display", "none");
		this.layerContents.appendTo(document.body);
		
		Effect.Appear(this.getRootNode(), { duration: 0.25, to:0.8 });
		Effect.Appear(this.layerContents.getRootNode(), { duration: 0.25, to:1 });
	},
	
	/**
	 * Fades out the layer and removes it from the DOM
	 */
	clearModalLayer: function() {
		Effect.Fade(this.getRootNode(), { duration: 0.25 });
		Effect.Fade(this.layerContents.getRootNode(), { duration: 0.25 });
		
		setTimeout(function() {
			try {
				document.body.removeChild(this.getRootNode());
				document.body.removeChild(this.layerContents.getRootNode());
				this.layerContents = null;			
			} catch(e) {
				Log.error("Error clearing modal layer", e);
			}
		}.bind(this), 600);
	}
});
