include(bbq.gui.panel.DualPanel);

/**
 * @class deadline.gui.panel.HeaderPanel
 * @extends bbq.gui.panel.DualPanel
 */
bbq.gui.panel.HeaderPanel = new Class.create(bbq.gui.panel.DualPanel, {
	
	/**
	 * Constructor
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.options.fixedHeight = true;
		
		this.addClass("HeaderPanel");
		
		if(this.options.headerLeft) {
			this.setHeaderLeft(this.options.headerLeft);
		}
		
		if(this.options.headerRight) {
			this.setHeaderRight(this.options.headerRight);
		}
	},
	
	/**
	 * Adds node to the Panel2
	 */
	setHeaderLeft: function(node) {
		if(!node) {
			this.setLeftPanel();
			return;
		}
		
		if(Object.isString(node) || Object.isArray(node)) {
			node = DOMUtil.createTextElement("h2", node);
		}
		
		DOMUtil.addClass(node, "HeaderPanelHeaderLeft");
		return this.setLeftPanel(node);
	},
	
	/**
	 * Adds node to the Panel1
	 */
	setHeaderRight: function(node) {
		if(!node) {
			this.setRightPanel();
			return;
		}
		
		if(Object.isString(node) || Object.isArray(node)) {
			node = DOMUtil.createTextElement("h3", node);
		}
		
		DOMUtil.addClass(node, "HeaderPanelHeaderRight");
		return this.setRightPanel(node);
	},
	
	/**
	 * @private
	 */
	_createHeader: function(node, type) {
		return DOMUtil.createTextElement(type, node);
	}
});
