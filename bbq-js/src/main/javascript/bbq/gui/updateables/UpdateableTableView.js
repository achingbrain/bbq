include(bbq.gui.updateables.UpdateableFieldGroup);
include(bbq.ajax.JSONRequest);
include(bbq.gui.updateables.NonUpdateableField);
include(bbq.gui.updateables.UpdateableInvisibleField);

/**
 * @class bbq.gui.updateables.UpdateableTableView
 * @extends	bbq.gui.updateables.UpdateableFieldGroup
 */
bbq.gui.updateables.UpdateableTableView = new Class.create(bbq.gui.updateables.UpdateableFieldGroup, {
	
	_icon: null,
	_tableBody: null,
	
	/**
	 * Supports the folloiwng options
	 * 
	 * options: {
	 * 		withStyledFirstRow: boolean			// if true the first tr tag in the table body will have the class name "first"
	 * 		hideEmptyFields: boolean				// if true fields returning null values or empty arrays will not be visible when the table is not in edit mode
	 * 		saveURL: string									// Where to POST the contents of this table to
	 * }
	 * 
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("table");
		this.addClass("UpdateableTableView");
		this._tableBody = DOMUtil.createElement("tbody");
		this.appendChild(this._tableBody);
	},
	
	/**
	 * Adds a row to the table.
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		invisible: boolean			//  If true the field will not be visible
	 * 		expanding: boolean		//  If true the field is treated as a field that is cabable of adding multiple instances of itself to the table
	 * 		icon: boolean				//  If true the field will be added to the right of the table and have extra blank rows added to pad the table to an appropriate height
	 * 		hideOnEdit: booelan	//  If true the field will not be shown in edit mode
	 * 		hideIf: function				//  If the passed function returns true, the field will not be shown in edit mode
	 * }
	 * 
	 * See bbq.gui.updateables.UpdatableFieldGroup#addField for more options
	 * 
	 * @param {bbq.gui.updateables.UpdateableField} fieldData The field
	 * @param {Object} options The field options.  See above for more details.
	 */
	addField: function($super, field, options) {
		$super(field, options);
		
		if(options.icon) {
			this.setIcon(field);
		}
		
		return field;
	},
	
	/**
	 * Sends the contents of the table to the url passed to the constructor as part of the options object
	 * 
	 * @param {Function} callback
	 */
	sendValues: function(callback) {
		new bbq.ajax.JSONRequest({
			url: this.options.saveURL, 
			args: this.getValues(), 
			onSuccess: callback, 
			method: "post"
		});
	},
	
	/**
	 * @param {bbq.gui.updateables.UpdatableField} field The icon field
	 */
	setIcon: function(field) {
		this._icon = field;
	},
	
	render: function() {
		DOMUtil.emptyNode(this._tableBody);
		
		var rowCount = 0;
		var iconRowCount = -1;
		
		for(var i = 0, iCount=this._fields.length; i < iCount; i++) {
			//Log.info("name = " + this.fieldNames[i] + " title = " + this.fieldTitles[i] + " invisible = " + this.invisibleFields[i]);
			
			if(!this.getEditMode() && this._fieldOptions[i].hideOnView) {
				continue;
			}
			
			if(this._fields[i] instanceof bbq.gui.updateables.UpdateableInvisibleField || this._fields[i] == this._icon || (this.getEditMode() && this._fieldOptions[i].hideOnEdit)) {
				continue;
			}
			
			// ignore empty fields
			if(this.options.hideEmptyFields && this._fields[i] && !this.getEditMode() && !(this._fields[i] instanceof bbq.gui.updateables.NonUpdateableField)) {
				var value = this._fields[i].getValue(true);
				
				if(value == null || (value instanceof Array && value.length == 0) || value == "[]") {
					continue;
				}
			}
			
			if(this._fieldOptions[i].hideIf && this._fieldOptions[i].hideIf()) {
				continue;
			}
			
			var row = document.createElement("tr");
			
			this._stripe(rowCount, row);
			
			var cell = document.createElement("td");
			
			if(!this._fieldOptions[i].spanColumns) {
				var header = document.createElement("th");
				header.appendChild(document.createTextNode(this._fieldOptions[i].label ? this._fieldOptions[i].label : " "));
				row.appendChild(header);
			} else {
				cell.colSpan = "2";
			}
			
			if(this._fields[i]) {
				this._fields[i].appendTo(cell);
			}
			
			row.appendChild(cell);
			
			this._tableBody.appendChild(row);
			
			var iconCell;
			
			// test for icon
			if(this._icon) {
				if(iconRowCount == -1) {
					iconCell = document.createElement("td");
					DOMUtil.addClass(iconCell, "iconCell");
					this._icon.appendTo(iconCell);			
					iconCell.rowSpan = "6";
					
					iconCell.width = (this._icon.width ? this._icon.width : 120);
					iconCell.style.width = (this._icon.width ? this._icon.width : 120) + "px";
					iconCell.vAlign = "top";
					row.appendChild(iconCell);
					
					iconRowCount = 0;
				}
				
				if(iconRowCount >= 6) {
					cell.colSpan = "2";
				}
				
				iconRowCount++;
			}
			
			rowCount++;
		}
		
		if(this._icon) {
			iconCell.rowSpan = iconRowCount;
			
			/*while(iconRowCount < 6) { // pad table with extra rows so is valid
				var row = document.createElement("tr");
				this._stripe(rowCount, row);
				row.appendChild(document.createElement("td"));
				row.appendChild(document.createElement("td"));
				this._tableBody.appendChild(row);
				rowCount++;
				iconRowCount++;
			}*/
		}
	},
	
	/**
	 * @param {integer} rowCount
	 * @param {mixed} row
	 */
	_stripe: function(rowCount, row) {
		if(this.options.withStyledFirstRow) {
			if(rowCount == 0) {
				DOMUtil.addClass(row, "first");
			} else if(rowCount % 2 == 0) {
				DOMUtil.addClass(row, "even");
			}
		} else if(rowCount % 2 == 1) {
			DOMUtil.addClass(row, "even");
		}
	}
});
