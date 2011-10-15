
/**
 * @class bbq.gui.LoadingNotification
 * @extends bbq.gui.GUIWidget 
 */
bbq.gui.LoadingNotification = new Class.create(bbq.gui.GUIWidget, {
	/**
	 * @param {mixed} options
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("p");
		this.addClass("LoadingNotification");
		
		if(typeof(this.options.text) == "undefined") {
			this.options.text = Language.get("bbq.gui.LoadingNotification.loading");
		}
	},
	
	/**
	 * Renders
	 */
	render: function() {
		this.empty();
		this.appendChild(this.options.text);
	}
});
