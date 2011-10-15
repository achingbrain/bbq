include(bbq.gui.updateables.UpdateableField);
include(bbq.gui.DatePicker);
include(bbq.gui.button.DatePickerButton);

/**
 * @class bbq.gui.updateables.UpdateableDateField
 * @extends bbq.gui.updateables.UpdateableField  
 */
bbq.gui.updateables.UpdateableDateField = new Class.create(bbq.gui.updateables.UpdateableField, {
	_datePicker: null,
	_dayDropDown: null,
	_hourDropDown: null,
	_minuteDropDown: null,
	_monthDropDown: null,
	_yearDropDown: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Supports the following options
	 * 
	 * options: {
	 * 		pickerTitle:		String
	 * 		initialValue:	Date, int or undefined
	 * 		mustBeGreaterThan:	bbq.gui.updateables.UpdateableDateField
	 * 		mustBeLessThan:	bbq.gui.updateables.UpdateableDateField
	 * 		shortDate: boolean		if true, hours and minutes will not be shown
	 * }
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("UpdateableDateField");
	},
	
	_setInitialValues: function() {
		if(typeof(this.options.propertyDisplay) != "undefined") {
			this._setCurrentValue(new Date(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key)));
			this._setOriginalValue(new Date(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key)));
		} else {
			if(typeof(this.options.initialValue) == "undefined" || this.options.initialValue == null) {
				this.options.initialValue = new Date();
				
				// set to midday
				this.options.initialValue.setHours(12, 0, 0, 0);
			} else if(this.options.initialValue instanceof Date) {
				// create copy of passed date object
				this.options.initialValue = new Date(this.options.initialValue);
			} else {
				// timestamp passed, hopefully
				this.options.initialValue = new Date(parseInt(this.options.initialValue));
			}
			
			this._setCurrentValue(new Date(this.options.initialValue));
			this._setOriginalValue(new Date(this.options.initialValue));
		}
		
		this._setDisplayValue(DateFormatter.getFormattedDate({date: this._getCurrentValue(), withStrings: true, shortDate: this.options.shortDate}));
	},
	
	_updateInitialValues: function() {
		this._setCurrentValue(new Date(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key)));
		this._setOriginalValue(new Date(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key)));
		this._setDisplayValue(DateFormatter.getFormattedDate({date: this._getCurrentValue(), withStrings: true, shortDate: this.options.shortDate}));
	},
	
	_createViewFieldFromPropertyDisplay: function() {
		return this.options.propertyDisplay.entity.getPropertyDisplay({property: this.options.propertyDisplay.key, formatter: function(date) {
			return DateFormatter.getFormattedDate({date: date, withStrings: true, shortDate: this.options.shortDate});
		}.bind(this)});
	},
	
	cancelEdit: function() {
		this._setCurrentValue(new Date(this._getOriginalValue()));
		this._setDisplayValue(DateFormatter.getFormattedDate({date: this._getCurrentValue(), withStrings: true, shortDate: this.options.shortDate}));
	},
	
	createEditField: function() {
		var datePicker = new bbq.gui.button.DatePickerButton({
			onclick: this.openDatePicker.bind(this),
			toolTip: Language.get("bbq.gui.updateables.UpdateableDateField.opendatepicker")
		});
		
		var node = DOMUtil.createElement("nobr");
		datePicker.appendTo(node);
		
		var dateOrder = DateFormatter.getOrder({shortDate: this.options.shortDate});
		var dateFragment;
		
		for(var i = 0, iCount=dateOrder.length; i < iCount; i++) {
			if(this["generate" + dateOrder[i]]) {
				dateFragment = this["generate" + dateOrder[i]].call(this)
				if(dateFragment.hide !== true || dateFragment.hide == "undefined") { 
					node.appendChild(dateFragment);
				}
			} else {
				Log.info("Invalid date atom - " + dateOrder[i]);
			}
		}
		
		return node;
	},
	
	openDatePicker: function(event) {
		try {
			if(!this._datePicker) {
				this._datePicker = new bbq.gui.DatePicker({width: 142, height: 176, owner: this, title: this.options.pickerTitle, startDate: this._getCurrentValue(), pointerEvent: event, showStartDate: true});
				this._datePicker.appear();
			}
		} catch(e) {
			Log.error("Error opening date picker", e);
		}
		return false;
	},
	
	datePicked: function(pickedDate, autoCorrect) {
		if(pickedDate instanceof Date) {
			this._getCurrentValue().setTime(pickedDate.getTime());
			this.render();
			
			if(typeof(autoCorrect) == "undefined" ) { // prevent recursion
				this.notifyListeners("onValueChanged");
			}
		}
		
		this._datePicker = null;
	},
	
	generateDay: function() {
		this._dayDropDown = DOMUtil.createElement("select", {
			onfocus: this._clearFocusWatcher.bind(this),
			onchange: this.updateLocalValue.bindAsEventListener(this),
			name: "days"
		});
		
		var daysInMonth = this.getDaysInMonth(this._getCurrentValue());
		
		for(var i = 1; i <= daysInMonth; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode(i));
			
			if(i == this._getCurrentValue().getDate()) {
				option.selected = "selected";
			}
			
			this._dayDropDown.appendChild(option);
		}
		
		this._dayDropDown.disabled = this.disabled;
		
		return this._dayDropDown;
	},
	
	generateDateSeparator: function() {
		return document.createTextNode(DateFormatter.getDateSeparator());
	},
	
	generateEmptySpace: function() {
		return document.createTextNode(" ");
	},
	
	generateBreakableSpace: function() {
		return DOMUtil.createElement("wbr");
	},
	
	generateHour: function() {
		this._hourDropDown = document.createElement("select");
		this._hourDropDown.onchange = this.updateLocalValue.bindAsEventListener(this);
		this._hourDropDown.name = "hours";
		
		for(var i = 1; i < 24; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode((i < 10 ? "0" + i : i)));
			
			if(i == this._getCurrentValue().getHours()) {
				option.selected = true;
			}
			
			this._hourDropDown.appendChild(option);
		}
		
		this._hourDropDown.disabled = this.disabled;
		this._hourDropDown.hide = this.options.hideHours;
		
		return this._hourDropDown;
	},
	
	generateMinute: function() {
		this._minuteDropDown = DOMUtil.createElement("select", {onchange: this.updateLocalValue.bindAsEventListener(this), name: "minutes"});
		
		for(var i = 0; i < 60; i += 15) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode((i < 10 ? "0" + i : i)));
			
			if(i == this._getCurrentValue().getMinutes()) {
				option.selected = true;
			}
			
			this._minuteDropDown.appendChild(option);
		}
		
		this._minuteDropDown.disabled = this.disabled;
		this._minuteDropDown.hide = this.options.hideMinutes;
		return this._minuteDropDown;
	},
	
	generateMonth: function() {
		this._monthDropDown = DOMUtil.createElement("select", {onchange: this.updateLocalValue.bindAsEventListener(this), name: "months"});
		
		for(var i = 0; i < 12; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode(Language.get("bbq.gui.updateables.UpdateableDateField.months" + i).substr(0, 3)));
			
			if(i == this._getCurrentValue().getMonth() || "0" + i == this._getCurrentValue().getMonth()) {
				option.selected = true;
			}
			
			this._monthDropDown.appendChild(option);
		}
		
		this._monthDropDown.disabled = this.disabled;
		
		return this._monthDropDown;
	},
	
	generateTimeSeparator: function() {
		if(this.options.hideMinutes) {
			return this.generateEmptySpace();
		} else {
			return document.createTextNode(DateFormatter.getTimeSeparator());
		}
	},
	
	generateYear: function() {
		this._yearDropDown = DOMUtil.createElement("select", {onchange: this.updateLocalValue.bindAsEventListener(this), name: "years"});
		var currentDate = new Date();
		
		for(var i = currentDate.getFullYear() - 5; i < (currentDate.getFullYear() + 10); i++) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode(i));
			
			if(i == this._getCurrentValue().getFullYear()) {
				option.selected = true;
			}
			
			this._yearDropDown.appendChild(option);
		}
		
		this._yearDropDown.disabled = this.disabled;
		
		return this._yearDropDown;
	},
	
	getDaysInMonth: function(date) {
		return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
	},
	
	getValue: function() {
		return this._getCurrentValue().getTime();
	},
	
	saveEdit: function() {
		this._setOriginalValue(new Date(this._getCurrentValue()));
		this._setDisplayValue(DateFormatter.getFormattedDate({date: this._getCurrentValue(), withStrings: true, shortDate: this.options.shortDate}));
	},
	
	updateLocalValue: function(event) {
		// make sure we don't go off the end of the month - ie. select july 31 then select february
		var daysInCurrentMonth = this.getDaysInMonth(this._getCurrentValue());
		var daysInNewMonth = this.getDaysInMonth(new Date(Form.Element.getValue(this._yearDropDown), Form.Element.getValue(this._monthDropDown)));
		var day = $F(this._dayDropDown);
		
		if(day > daysInNewMonth) {
			day = daysInNewMonth;
		}
		
		if(this._hourDropDown && this._minuteDropDown) {
			this._setCurrentValue(new Date($F(this._yearDropDown), $F(this._monthDropDown), day, $F(this._hourDropDown), $F(this._minuteDropDown), 0));
		} else {
			this._setCurrentValue(new Date($F(this._yearDropDown), $F(this._monthDropDown), day, 0, 0, 0));
		}
		
		this.render();
		this.notifyListeners("onValueChanged");
	},
	
	mustBeGreaterThan: function(dateField) {
		this.registerListener("onValueChanged", function() {
			if(dateField.getValue() > this.getValue()) {
				dateField.datePicked(new Date(this.getValue()), true);
			}
		}.bind(this));
	},
	
	mustBeLessThan: function(dateField) {
		this.registerListener("onValueChanged", function() {
			if(dateField.getValue() < this.getValue()) {
				dateField.datePicked(new Date(this.getValue()), true);
			}
		}.bind(this));
	}
});
