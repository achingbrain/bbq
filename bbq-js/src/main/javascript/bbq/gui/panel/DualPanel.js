include(bbq.gui.panel.Panel);

/**
 * A panel with two and only two child panels
 * @class bbq.gui.panel.DualPanel
 * @extends bbq.gui.panel.Panel
 * 
 */
bbq.gui.panel.DualPanel  = new Class.create(bbq.gui.panel.Panel, {
	_panel1Name: null,
	_panel2Name: null,
	
	/**
	 * @param {Object} options
	 * 
	 * Supports the following options: 
	 * 
	 * options: {
	 * 		panel1: bbq.gui.panel.Panel
	 * 		panel2: bbq.gui.panel.Panel
	 * }
	 */
	initialize: function($super, options) {
		// call parent method
		$super(options);
		
		this.addClass("DualPanel");
		
		this._panel1Name = "panel1";
		this._panel2Name = "panel2";
		
		if(this.options.topPanel) {
			this.setTopPanel(this.options.panel1);
		}
		
		if(this.options.topPanel) {
			this.setTopPanel(this.options.topPanel);
		}
		
		if(this.options.bottomPanel) {
			this.setBottomPanel(this.options.bottomPanel);
		}
		
		if(this.options.leftPanel) {
			this.setLeftPanel(this.options.leftPanel);
		}
		
		if(this.options.rightPanel) {
			this.setRightPanel(this.options.rightPanel);
		}
	},
	
	setTopPanel: function(content, panelName) {
		this.layout.setVertical(true);
		this.removeClass("DualPanel_Horizontal");
		this.addClass("DualPanel_Vertical");
		this._setPanel(content, panelName, 1, "top");
		
		return content;
	},
	
	getTopPanel: function() {
		return this._getChildPanel(this._panel1Name);
	},
	
	setBottomPanel: function(content, panelName) {
		this.layout.setVertical(true);
		this.removeClass("DualPanel_Horizontal");
		this.addClass("DualPanel_Vertical");
		this._setPanel(content, panelName, 2, "bottom");
		
		return content;
	},
	
	getBottomPanel: function() {
		return this._getChildPanel(this._panel2Name);
	},
	
	setLeftPanel: function(content, panelName) {
		this.layout.setVertical(false);
		this.removeClass("DualPanel_Vertical");
		this.addClass("DualPanel_Horizontal");
		this._setPanel(content, panelName, 1, "left");
		
		return content;
	},
	
	getLeftPanel: function() {
		return this._getChildPanel(this._panel1Name);
	},
	
	setRightPanel: function(content, panelName) {
		this.layout.setVertical(false);
		this.removeClass("DualPanel_Vertical");
		this.addClass("DualPanel_Horizontal");
		this._setPanel(content, panelName, 2, "right");
		
		return content;
	},
	
	getRightPanel: function() {
		return this._getChildPanel(this._panel2Name);
	},
	
	_setPanel: function(content, panelName, panelIndex, panelClass) {
		DOMUtil.addClass(content, "DualPanel" + panelIndex);
		DOMUtil.addClass(content, "DualPanel_" + (this.layout.vertical() ? "Vertical" : "Horizontal") + "_DualPanel" + panelIndex);
		DOMUtil.addClass(content, "DualPanel_" + panelClass + "Panel");
		
		if(!Object.isUndefined(panelName)) {
			this["_panel" + panelIndex + "Name"] = panelName;
		}
		
		this._setChildPanel(this["_panel" + panelIndex + "Name"], content);
		this.render();
	},
	
	render: function() {
		this.empty();
		
		if(this.layout.vertical()) {
			if(this.getTopPanel()) {
				this.appendChild(this.getTopPanel());
			}
			
			if(this.getBottomPanel()) {
				this.appendChild(this.getBottomPanel());
			}
		} else {
			if(this.getRightPanel()) {
				this.appendChild(this.getRightPanel());
			}
			
			if(this.getLeftPanel()) {
				this.appendChild(this.getLeftPanel());
			}
		}
	},
	
	replacePanel: function($super, oldPanel, newPanel) {
		var oldName = this._getPanelName(oldPanel);
		
		$super(oldPanel, newPanel);
		
		if(oldName == this._panel1Name) {
			this._setPanel(newPanel, oldName, 1)
		} else if(oldName == this._panel2Name) {
			this._setPanel(newPanel, oldName, 2)
		}
	}
});
