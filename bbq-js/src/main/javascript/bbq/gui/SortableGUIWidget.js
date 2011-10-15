include(bbq.gui.GUIWidget);

/**
 * @class bbq.gui.SortableGUIWidget
 * @extends bbq.gui.panel.Panel 
 */
bbq.gui.SortableGUIWidget = new Class.create(bbq.gui.GUIWidget, {
	_currentSortKey: null,
	
	sortIt: function(event) {
		
	},
	
	ascSortFunction: function (a, b) {
		var aValue = (a[this._currentSortKey] instanceof Function ? a[this._currentSortKey].call(a, a) : a[this._currentSortKey]);
		var bValue = (b[this._currentSortKey] instanceof Function ? b[this._currentSortKey].call(b, b) : b[this._currentSortKey]);
		
		if(aValue == null && bValue) {
			return 1;
		} else if(aValue && bValue == null) {
			return -1;
		} else if(aValue == null && bValue == null) {
			return 0;
		}
		
		if(typeof(aValue) != "undefined") {
			if(aValue === true || aValue === false) {
				return this.sortBool(aValue, bValue);
			} else if(aValue instanceof Array) {
				return this.sortArray(aValue, bValue)
			} else if(aValue.toLowerCase) {
				return this.sortString(aValue, bValue);
			} else {
				return aValue - bValue;
			}
		} else {
			var key = this._currentSortKey.split(".");
			
			try {
				if(aValue === true || aValue === false) {
					return this.sortBool(aValue, bValue);
				} else if(a[key[0]][key[1]] instanceof Array) {
					return this.sortArray(a[key[0]][key[1]], b[key[0]][key[1]])
				} else if(a[key[0]][key[1]].toLowerCase) {
					return this.sortString(a[key[0]][key[1]], b[key[0]][key[1]]);
				} else {
					return a[key[0]][key[1]] - b[key[0]][key[1]];
				}
			} catch(e) {
				Log.warn("Error thrown while using " + key + " as a sort field", e);
				Log.warn("a :");
				Log.dir(a);
				Log.warn("b :");
				Log.dir(b);
				Log.dir(e);
				throw e;
			}
		}
	},
	
	descSortFunction: function (a, b) {
		var aValue = (a[this._currentSortKey] instanceof Function ? a[this._currentSortKey].call(a, a) : a[this._currentSortKey]);
		var bValue = (b[this._currentSortKey] instanceof Function ? b[this._currentSortKey].call(b, b) : b[this._currentSortKey]);
		
		if(aValue == null && bValue) {
			return -1;
		} else if(aValue && bValue == null) {
			return 1;
		} else if(aValue == null && bValue == null) {
			return 0;
		}
		
		if(typeof(aValue) != "undefined") {
			if(aValue === true || aValue === false) {
				return this.sortBool(bValue, aValue);
			} else if(aValue instanceof Array) {
				return this.sortArray(bValue, aValue)
			} else if(aValue.toLowerCase) {
				return this.sortString(bValue, aValue);
			} else {
				return bValue - aValue;
			}
		} else {
			var key = this._currentSortKey.split(".");
			
			try {
				if(aValue === true || aValue === false) {
					return this.sortBool(bValue, aValue);
				} else if(a[key[0]][key[1]] instanceof Array) {
					return this.sortArray(b[key[0]][key[1]], a[key[0]][key[1]])
				} else if(a[key[0]][key[1]].toLowerCase) {
					return this.sortString(b[key[0]][key[1]], a[key[0]][key[1]]);
				} else {
					return b[key[0]][key[1]] - a[key[0]][key[1]];
				}
			} catch(e) {
				Log.warn("Error thrown while using " + key + " as a sort field", e);
				Log.warn("a :");
				Log.dir(a);
				Log.warn("b :");
				Log.dir(b);
				throw e;
			}
		}
	},
	
	sortString: function(a, b, asc) {
		if(b.toLowerCase() > a.toLowerCase()) {
			return (asc ? -1 : 1);
		} else if(b.toLowerCase() < a.toLowerCase()) {
			return (asc ? 1 : -1);
		} else {
	 		return 0;
	 	}
	},
	
	sortBool: function(a, b) {
		if(a == b) {
			return 0;
		} else if(a) {
			return -1;
		} else {
	 		return 1;
	 	}
	},
	
	sortArray: function(a, b) {
		if(b.length > a.length) {
			return -1;
		} else if(b.length < a.length) {
			return 1;
		} else {
	 		return 0;
	 	}
	}
});
