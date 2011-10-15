include(bbq.gui.ModalWindow);
include(bbq.gui.button.ButtonHolder);

/**
 * @class bbq.gui.error.FatalError
 * @extends bbq.gui.ModalWindow
 */
bbq.gui.error.FatalError = new Class.create(bbq.gui.ModalWindow, {
	/**
	 * @param {mixed} options
	 * @example	
	 * Supports the following options:
	 * 
	 * options: {
	 * 		showChrome: boolean						// Whether to be draggable, show close window button, etc
	 * }
	 * 
	 */
	initialize: function($super, options) {
		if(!options) {
			options = {};
		}
		
		options.modal = true;
		
		if(!options.width) {
			options.width = 400;
		}
		
		if(!options.height) {
			options.height = 500;
		}
		
		options.hideChrome = true;
		
		$super(options);
		
		this.addClass("FatalError");
		
		var content = DOMUtil.createTextElement("div", [ 
			DOMUtil.createTextElement("h2", this.getHeader()),
			this.getMessage()
		], {className: "FatalErrorContent"});
		
		if(!this.options.noReload) {
			content.appendChild(DOMUtil.createTextElement("p", Language.get("bbq.gui.error.FatalError.belowmessage")));
			
			var reload = new bbq.gui.button.ButtonHolder();
			reload.addButton(new bbq.gui.button.NativeButton({buttonText: Language.get("bbq.gui.error.FatalError.button"), onclick: function() {
				window.location.reload();
			}.bind(this)}));
			
			reload.appendTo(content);
		}
		
		this.setContent(content);
		
		// stop edit watchers from throwing up a dialogue if the user refreshes the page.
		if(typeof(EditWatcher) != "undefined") {
			EditWatcher.deRegisterAllEditors();
		}
	},
	
	getHeader: function() {
		return Language.get("bbq.gui.error.FatalError.header");
	},
	
	getMessage: function() {
		return Language.get("bbq.gui.error.FatalError.abovemessage");
	}
});
