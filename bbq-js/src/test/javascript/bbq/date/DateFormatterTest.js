include(bbq.language.Language);
include(bbq.date.DateFormatter);

test = new Test.Unit.Runner({

	testButtonClicked: function() {
		with (this) {
			// shim in language translations
			Language._language = {
				"bbq.date.DateFormatter.long.days0": "Sunday",
				"bbq.date.DateFormatter.long.days1": "Monday",
				"bbq.date.DateFormatter.long.days2": "Tuesday",
				"bbq.date.DateFormatter.long.days3": "Wednesday",
				"bbq.date.DateFormatter.long.days4": "Thursday",
				"bbq.date.DateFormatter.long.days5": "Friday",
				"bbq.date.DateFormatter.long.days6": "Saturday",
				"bbq.date.DateFormatter.long.months0": "January",
				"bbq.date.DateFormatter.long.months1": "Februrary",
				"bbq.date.DateFormatter.long.months2": "March",
				"bbq.date.DateFormatter.long.months3": "April",
				"bbq.date.DateFormatter.long.months4": "May",
				"bbq.date.DateFormatter.long.months5": "June",
				"bbq.date.DateFormatter.long.months6": "July",
				"bbq.date.DateFormatter.long.months7": "August",
				"bbq.date.DateFormatter.long.months8": "September",
				"bbq.date.DateFormatter.long.months9": "October",
				"bbq.date.DateFormatter.long.months10": "November",
				"bbq.date.DateFormatter.long.months11": "December",
				"bbq.date.DateFormatter.short.days0": "Sun",
				"bbq.date.DateFormatter.short.days1": "Mon",
				"bbq.date.DateFormatter.short.days2": "Tues",
				"bbq.date.DateFormatter.short.days3": "Wed",
				"bbq.date.DateFormatter.short.days4": "Thurs",
				"bbq.date.DateFormatter.short.days5": "Fri",
				"bbq.date.DateFormatter.short.days6": "Sat",
				"bbq.date.DateFormatter.short.months0": "Jan",
				"bbq.date.DateFormatter.short.months1": "Feb",
				"bbq.date.DateFormatter.short.months2": "Mar",
				"bbq.date.DateFormatter.short.months3": "Apr",
				"bbq.date.DateFormatter.short.months4": "May",
				"bbq.date.DateFormatter.short.months5": "Jun",
				"bbq.date.DateFormatter.short.months6": "Jul",
				"bbq.date.DateFormatter.short.months7": "Aug",
				"bbq.date.DateFormatter.short.months8": "Sept",
				"bbq.date.DateFormatter.short.months9": "Oct",
				"bbq.date.DateFormatter.short.months10": "Nov",
				"bbq.date.DateFormatter.short.months11": "Dec"
			};

			var date = new Date("2011/10/12 12:00:00");


			this.assertEqual("2011/10/12", date.format("yyyy/m/d"));
			this.assertEqual("Wednesday, October 12th, 2011, 12:00:00 PM", date.format("dddd, mmmm dS, yyyy, h:MM:ss TT"));
			this.assertEqual("2011-10-12T12:00:00", date.format("isoDateTime"));
			this.assertEqual("Wednesday, October 12, 2011", date.format("fullDate"));
			this.assertEqual("Wed Oct 12 2011 12:00:00", date.format());
			this.assertEqual("12:00:00 PM GMT+0100", date.format("longTime"));
			this.assertEqual("11:00:00 AM UTC", date.format("UTC:h:MM:ss TT Z"));
		}
	}
});
