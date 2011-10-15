/**
 * @class bbq.gui.Theme 
 */
Theme = {
	_styleSheets: {},
	_styleSheetNodes: [],
	_theme: "",
	
	addStyleSheet: function(sheet, media) {
		if(typeof(Theme._styleSheets[sheet]) == "undefined") {
			sheet = sheet.replace(/\./g, "/");
			
			if(!Theme._styleSheets[sheet]) {
				Theme._styleSheets[sheet] = sheet;
				Theme._styleSheetNodes.push(Theme._addSheetToHead(sheet, media));
			}
		}
	},
	
	setTheme: function(theme) {
		Theme._theme = theme;
		Theme._updateStyleSheets;
	},
	
	_updateStyleSheets: function() {
		var head = document.getElementsByTagName("head")[0];
		
		Theme._styleSheetNodes.each(function(node) {
			head.removeChild(node);
		});
		
		Theme._styleSheets.each(function(sheet) {
			Theme._addSheetToHead(sheet);
		});
	},
	
	_addSheetToHead: function(sheet, m) {
		if (m == "undefined") {
			m = "all";
		}
		Log.info("media: " + m);
		var node = DOMUtil.createElement("link", {
			media: m,
			type: "text/css",
			rel: "stylesheet",
			href: "/css/theme" + Theme._theme + "/" + sheet + "/style.css"
		});
		
		var head = document.getElementsByTagName("head")[0];
		head.insertBefore(node, head.getElementsByTagName("script")[0]);
		
		return node;
	}
};
