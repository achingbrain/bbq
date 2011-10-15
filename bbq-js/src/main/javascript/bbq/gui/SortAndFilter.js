include(bbq.gui.SortableGUIWidget);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.SortAndFilter
 * @extends bbq.gui.SortableGUIWidget  
 */
bbq.gui.SortAndFilter = new Class.create(bbq.gui.SortableGUIWidget, {
	
	sortCriteria: null,
	sortNames: null,
	sortKeys: null,
	items: null,
	searchItems: null,
	originalItems: null,
	filterText: null,
	ascRadio: null,
	descRadio: null,
	
	/**
	 * @param {mixed} options
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("sortAndFilter");
		var form = DOMUtil.createNullForm();
		
		this.appendChild(form);
		
		var sortByText = DOMUtil.createTextElement("label", Language.get("bbq.gui.SortAndFilter.sortby"), {className: "sortByText"});
		form.appendChild(sortByText);
		
		this.sortCriteria = document.createElement("select");
		sortByText.appendChild(this.sortCriteria);
		form.onchange = this.sortIt.bindAsEventListener(this);
		
		this.sortNames = [];
		this.sortKeys = [];
		
		this.items = [];
		this.originalItems = [];
		
		this.searchFields = [];
		
		var span = document.createElement("span");
		DOMUtil.addClass(span, "ascDesc");
			
		this.ascRadio = document.createElement("input");
		this.ascRadio.type = "radio";
		this.ascRadio.name = "sortdirection";
		this.ascRadio.checked = "checked";
		this.ascRadio.value = "asc";
		this.ascRadio.onclick = this.sortIt.bindAsEventListener(this);
		span.appendChild(this.ascRadio);
		
		var radio1Label = document.createElement("label");
		radio1Label.appendChild(document.createTextNode(Language.get("bbq.gui.SortAndFilter.ascending")));
		span.appendChild(radio1Label);
		
		this.descRadio = document.createElement("input");
		this.descRadio.type = "radio";
		this.descRadio.name = "sortdirection";
		this.descRadio.value = "desc";
		this.descRadio.onclick = this.sortIt.bindAsEventListener(this);
		span.appendChild(this.descRadio);
		
		var radio2Label = document.createElement("label");
		radio2Label.appendChild(document.createTextNode(Language.get("bbq.gui.SortAndFilter.descending")));
		span.appendChild(radio2Label);
		
		form.appendChild(span);
	
		var filterLabel = DOMUtil.createTextElement("label", Language.get("bbq.gui.SortAndFilter.filterby"), {className: "filterLabel"}); 
		form.appendChild(filterLabel);
		
		this.filterText = document.createElement("input");
		this.filterText.type = "text";
		this.filterText.onkeydown = this.preFilter.bindAsEventListener(this);
		DOMUtil.addClass(this.filterText, "filterText");
		form.appendChild(this.filterText);
		
		var filterButton = DOMUtil.createSubmitInputNode(Language.get("bbq.gui.SortAndFilter.clear"), {name: "clearFilter", id: "clearFilter"});
		filterButton.onclick = this.clearFilter.bindAsEventListener(this);
		form.appendChild(filterButton);
	},
	
	setItems: function(items) {
		if(items) {
			Log.info("got items");
			// TODO: rewrite this to store the order of IDs, not clone the objects themselves
			//this.originalItems = BBQUtil.cloneObject(items.getElements());
			this.items = items.getElements();
		} else {
			Log.info("not got items");
		}
	},
	
	setSearchItems: function(searchItems) {
		this.searchItems = searchItems;
	},
	
	addSortCriteria: function(text, key, selected) {
		this.sortNames[this.sortNames.length] = text;
		this.sortKeys[this.sortKeys.length] = key;
		
		var optionNode = document.createElement("option");
		optionNode.appendChild(document.createTextNode(text));
		
		if(selected) {
			optionNode.selected = "selected";
		}
		
		this.sortCriteria.appendChild(optionNode);
	},
	
	addNewItem: function(item) {
		this.originalItems[this.originalItems.length] = item;
		this.sortIt();
	},
	
	sortIt: function(event) {
		var element = BBQUtil.clearFocus(event);
		this.currentSortKey = this.sortKeys[this.sortCriteria.selectedIndex];
		
		if(this.sortKeys[this.sortCriteria.selectedIndex].search(/(\.)/) > -1) {
			var keys = this.sortKeys[this.sortCriteria.selectedIndex].split(".");
			this.currentSortKey = keys[keys.length - 1];
			
			for(var i = 0, iCount=this.items.length; i < iCount; i++) {
				if(this.ascRadio.checked) {
					this.items[i][this.searchItems].sort(this.ascSortFunction.bind(this));
				} else {
					this.items[i][this.searchItems].sort(this.descSortFunction.bind(this));
				}
			}
		} else {
			this.currentSortKey = this.sortKeys[this.sortCriteria.selectedIndex];
			
			if(this.ascRadio.checked) {
				this.items.sort(this.ascSortFunction.bind(this));
			} else {
				this.items.sort(this.descSortFunction.bind(this));
			}
		}
		
		this.controller.renderTreeList();
	},
	
	preFilter: function(event) {
		DOMUtil.addClass(this.filterText, "filtering");
		DOMUtil.addClass($("div_dataTree"), "filtering");
		
		setTimeout(this.filterIt.bind(this), 100);
	},
	
	filterIt: function() {
		if(this.filterText.value != "") {
			var expression = new RegExp(this.filterText.value, "i");
			var n = 0;
			
			this.items.splice(0, this.items.length);
			
			if(this.searchItems) {
				for(var i = 0, iCount=this.originalItems.length; i < iCount; i++) {
					// TODO: rewrite this to store the order of IDs, not clone the objects themselves
					//this.items[i] = BBQUtil.cloneObject(this.originalItems[i]);
					this.items[i][this.searchItems].splice(0, this.items[i][this.searchItems].length);
						
					for(var k = 0, kCount=this.originalItems[i][this.searchItems].length; k < kCount; k++) {
						if(this.filterItems(this.originalItems[i][this.searchItems][k], this.filterText.value, expression, 5)) {
							this.items[n][this.searchItems][k] = this.originalItems[i][this.searchItems][k];	
						}
					}
				}
			} else {
				for(var i = 0, iCount=this.originalItems.length; i < iCount; i++) {
					if(this.filterItems(this.originalItems[i], this.filterText.value, expression, 5)) {
						this.items[n] = this.originalItems[i];
						n++;
					}
				}
			}
			
			currentPage.renderTreeList();
		} else {
			this.clearFilter();
		}
	},
	
	filterItems: function(item, text, expression, level) {
		if(level == 0 || !item) {
			return false;
		}
		
		if(item instanceof Array) {
			for(var i = 0, iCount=item.length; i < iCount; i++) {
				if(this.filterItems(item[i], text, expression, level - 1)) {
					return true;			
				}
			}
		} else if(item instanceof Object) {
			for(var key in item) {
				if(this.filterItems(item[key], text, expression, level - 1)) {
					return true;			
				}
			}
		} else {
			return (item == text || (item.search && item.search(expression) > -1));
		}
		
		return false;
	},
	
	clearFilter: function(event) {
		var element = BBQUtil.clearFocus(event);
		
		DOMUtil.removeClass(this.filterText, "filtering");
		DOMUtil.removeClass($("div_dataTree"), "filtering");
		
		this.filterText.value = "";
		
		for(var i = 0, iCount=this.originalItems.length; i < iCount; i++) {
			this.items[i] = this.originalItems[i];
		}
		
		currentPage.renderTreeList();
	}
});
