include(bbq.gui.table.SortableTable);
include(bbq.ajax.JSONRequest);

/**
 * @class bbq.gui.table.LiveTable
 * @extends bbq.gui.table.SortableTable
 */
bbq.gui.table.LiveTable = new Class.create(bbq.gui.table.SortableTable, {
	dataLoaded: false,
	
	/**
	 * @param {mixed} options
	 * @example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		data: {
	 * 			url: String,
	 * 			method: String,
	 * 			args: Object
	 * 		}
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.dataLoaded = false;
		
		var request = new bbq.ajax.JSONRequest(this.controller, this.options.data.url, this._gotValues.bind(this));
		request.sendRequest(this.options.data.method ? this.options.data.method : 'get', this.options.data.args ? this.options.data.args : "");
	},
	
	/**
	 * @private
	 */
	_gotValues: function(serverResponse, json) {
		this.entities = json[this.options.data.entities];
		this.dataLoaded = true;
		
		if(this.entities.length > 0) {
			if(this.options.startSorted) {
				if(this.options.startSorted.direction && this.options.startSorted.direction == "DESC") {
					this.sortedByColumnIndex = this.options.startSorted.column ? this.options.startSorted.column : 0;
				}
				
				this.sortByIndex(this.options.startSorted.column ? this.options.startSorted.column : 0);
			} else {
				this.sortByIndex(0);
			}
		}
	},
	
	/**
	 * @void
	 */
	render: function($super) {
		if(this.dataLoaded) {
			$super();
		}
	}
});
