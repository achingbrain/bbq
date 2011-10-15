include(bbq.gui.GUIWidget);
include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.SearchBox
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.SearchBox = new Class.create(bbq.gui.GUIWidget, {
	
	_searchBox: null,
	_searchButton: null,
	_oldSearchText: null,
	_searchTimeout: null,
	_searching: null,
	_active: null,
	_callbackKeys: null,
	
	/**
	 * Constructor
	 * Supports the following options:
	 * options: {
	 * 		doSearch: Function
	 * 		clearSearch: Function
	 * 		model: behvaiour.lang.Model
	 * }
	 * @param {Object} options 
	 */
	initialize: function($super, options) {
		$super(options);

		var input = DOMUtil.createElement("input");
		
		this.setRootNode("div");
		this.addClass("SearchBox");
		
		this._active = false;
		
		this._callbackKeys = {};
		
		this._oldSearchText = false;
		this._searchBox = new bbq.gui.updateables.UpdateableTextField({inlineInstruction: Language.get("bbq.gui.SearchBox.search"), searchBox: true});
		this._searchBox.setEditMode(true);
		this._searchBox.registerListener("onkeyup", this._doSearch.bind(this));
		this._searchButton = DOMUtil.createElement("input", {type: "submit", value: Language.get("bbq.gui.SearchBox.clear"), className: "searchSubmit", onclick: this.clearSearch.bind(this, false), disabled: true})
		this.appendChild(this._searchBox);
		
		if(!Browser.forms.types.search) {
			this.appendChild(this._searchButton);
		} else {
			this._searchBox.registerListener("onclick", function() {
				if(this._oldSearchText && this._searchBox.getValue() == "") {
					this.clearSearch(true);
				}
			}.bind(this));
		}
		
		if(!this.options.model && !this.options.doSearch) {
			this.setDisabled(true);
		}
	},
	
	/**
	 * Render
	 */
	render: function() {
		
	},
	
	/**
	 * @private
	 */
	clearSearch: function(noBlur) {
		try {
			if(!noBlur) {
				this._searchBox.setValue("");
				this._searchBox.blurInstructionField();
			}
			
			this._searchBox.removeClass("SearchBoxSearching");
			this._searchButton.disabled = true;
			this._searching = false;
			this._active = false;
			
			if(this.options.model) {
				this.options.model.setSearchTerm(null);
			}
			
			this._oldSearchText = "";
			
			this.notifyListeners("onClearSearch");
		} catch(e) {
			Log.error("Error clearing search", e);
		}
	},

	/**
	 * @private
	 */
	_doSearch: function() {
		if(this._searchTimeout) {
			clearTimeout(this._searchTimeout);
		}
		
		this._searchTimeout = setTimeout(function() {
			try {
				var searchText = this._searchBox.getValue().strip();
				
				if(searchText == "") {
					this.clearSearch(true);
					
					return;
				}
				
				if(searchText == this._oldSearchText) {
					 // make sure that the search string has changed - eg. do not re-search on arrow key presses, etc
					 return;
				}

				this._searchButton.disabled = false;
				this._searchBox.addClass("SearchBoxSearching");
				this._searching = true;
				this._active = true;
				
				if(this.options.doSearch) {
					this.options.doSearch(searchText);
				} else if(this.options.model) {
					this.options.model.setSearchTerm(searchText);
				}
				
				this._oldSearchText = searchText;
				
				this.notifyListeners("onDoneSearch");
			} catch(e) {
				Log.error("Error while searching", e);
			}
		}.bind(this), 250);
	},
	
	setDisabled: function(disabled) {
		this._searchBox.setDisabled(disabled);
		this._searchButton.disabled = disabled;
	}
});
