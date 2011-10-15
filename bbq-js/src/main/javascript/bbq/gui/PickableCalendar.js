include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.PickableCalendar
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.PickableCalendar = new Class.create(bbq.gui.GUIWidget, {
	
	monthDays: new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
	_today: null,
	_date: null,
	_initialDate: null,
	
	/**
	 * @param {mixed} options
	 * @example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		startDate:	Date		// the initially selected date (optional)
	 * 		owner:		Object		// should have a method datePicked(Date:date)
	 * 		title:				String		// the calendar title
	 * 		createCell:	function(day, cell, callbackFunction rowNumber, columnNumber)
	 * 		prevCallback: function(date)
	 * 		nextCallback: function(date)
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		if(this.options.startDate instanceof Date) {
			this._date = this.options.startDate;
		} else {
			this._date = new Date(this.options.startDate);
		}
		
		this.setRootNode("div");
		this.addClass("pickableCalendar");
		
		this._today = new Date();
		this._initialDate = new Date(this._date.getTime());
		this.render();
	},
	
	render: function() {
		// check for leap years
		if(this._date.getMonth() == 1 && (this._date.getFullYear() % 4 == 0 || (this._date.getFullYear() % 100 == 0 && this._date.getFullYear() % 400 == 0))) {
			this.monthDays[1] = 29;
		} else {
			this.monthDays[1] = 28;
		}
		
		DOMUtil.emptyNode(this.getRootNode());
		
		var dateTable = document.createElement("table");
		var dateTableBody = document.createElement("tbody");
		dateTable.appendChild(dateTableBody);
		
		// title
		if(typeof(this.options.title) != "undefined") {
			var titleRow = DOMUtil.createTableHeaderRow(1);
			titleRow.childNodes[0].appendChild(document.createTextNode(this.options.title));
			titleRow.childNodes[0].colSpan = 7;
			DOMUtil.addClass(titleRow.childNodes[0], "titlecell");
			dateTableBody.appendChild(titleRow);
		}
		
		var topRow = DOMUtil.createTableHeaderRow(3);
		
		// back
		var backMonthLink = DOMUtil.createTextElement("a", "<", {href: ".", onclick: this.previousMonth.bindAsEventListener(this), title: Language.get("bbq.gui.PickableCalendar.previousmonth")});
		DOMUtil.addClass(topRow.childNodes[0], "prevnext");
		topRow.childNodes[0].appendChild(backMonthLink);
		
		// month
		topRow.childNodes[1].appendChild(document.createTextNode(Language.get("bbq.gui.PickableCalendar.months" + this._date.getMonth()) + " " + this._date.getFullYear()));
		topRow.childNodes[1].colSpan = 5;
		
		// forwards
		var forwardMonthLink = DOMUtil.createTextElement("a", ">", {href: ".", onclick: this.nextMonth.bindAsEventListener(this), title: Language.get("bbq.gui.PickableCalendar.nextmonth")});
		DOMUtil.addClass(topRow.childNodes[2], "prevnext");
		topRow.childNodes[2].appendChild(forwardMonthLink);
		
		dateTableBody.appendChild(topRow);
		
		// day headers
		var dayRow = DOMUtil.createTableHeaderRow(7);
		
		for(var i = 0; i < 7; i++) {
			dayRow.childNodes[i].appendChild(document.createTextNode(Language.get("bbq.gui.PickableCalendar.days" + i).substr(0, 1)));
		}
		
		dateTableBody.appendChild(dayRow);
		
		// pad out the first row
		var tempDate = new Date(this._date.getTime());
		tempDate.setDate(1);
		
		var padding = tempDate.getDay();
		var row = document.createElement("tr");
		
		var n = 0;
		
		for(; n < padding; n++) {
			var cell = document.createElement("td");
			cell.appendChild(document.createTextNode(" "));
			row.appendChild(cell);
		}
		
		// loop through the days of the month
		var j = 1;
		var datePickedCallback = this._datePicked.bindAsEventListener(this);
		
		for(var k = 1, kCount=this.monthDays[this._date.getMonth()]; k <= kCount; k++) {
			if(n == 7) {
				dateTableBody.appendChild(row);
				row = document.createElement("tr");
				
				if(j % 2 == 0) {
					DOMUtil.addClass(row, "even");
				}
				
				n = 1;
				j++;
			} else {
				n++;
			}
			
			var cell = document.createElement("td");
			
			if(this.options.createCell) {
				cell.appendChild(this.options.createCell(k, cell, DOMUtil.createElement("a",  {href: ".", onclick: datePickedCallback}), j, n));
			} else {
				cell.appendChild(DOMUtil.createTextElement("a", k, {href: ".", onclick: datePickedCallback}));
			}
			
			tempDate.setDate(k);
			
			DOMUtil.addClass(cell, "day");
			
			if(this.options.showStartDate && this.equals(tempDate, this._initialDate)) {
				DOMUtil.addClass(cell, "originalDate");
			} else if(this.options.showToday && this.equals(tempDate, this._today)) {
				DOMUtil.addClass(cell, "today");
			}
			
			row.appendChild(cell);
		}
		
		// pad out the last row if necessary
		if(n != 0) {
			for(; n < 7; n++) {
				var cell = document.createElement("td");
				cell.appendChild(document.createTextNode(" "));
				row.appendChild(cell);
			}
			
			dateTableBody.appendChild(row);
		}
		
		this.getRootNode().appendChild(dateTable);
	},
	
	equals: function(date1, date2) {
		return (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate());
	},
	
	previousMonth: function(event) {
		BBQUtil.clearFocus(event);
		
		try {
			this._date.setMonth(this._date.getMonth() - 1);
			
			if(this.options.prevCallback) {
				this.options.prevCallback(new Date(this._date));
			}
			
			this.render();	
			
			this.notifyListeners("onMonthChanged");
		} catch(e) {
			Log.error("Error going to previous month", e);
		}
		return false;
	},
	
	nextMonth: function(event) {
		BBQUtil.clearFocus(event);
		
		try {
			this._date.setMonth(this._date.getMonth() + 1);
			
			if(this.options.nextCallback) {
				this.options.nextCallback(new Date(this._date));
			}
			
			this.render();
			
			this.notifyListeners("onMonthChanged");
		} catch(e) {
			Log.error("Error going to next month", e);
		}
		
		return false;
	},
	
	_datePicked: function(event) {
		this.notifyListeners("onDatePicked");
		Log.info('_datePicked in PickableCalendar');
		//Log.dir(event);
		var element = BBQUtil.clearFocus(event);
		
		this._date.setDate(element.innerHTML);
		
		if(this.options.owner && this.options.owner.datePicked) {
			this.options.owner.datePicked(this._date);
		}
		
		return false;
	}
});
