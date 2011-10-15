/**
 * @class bbq.lang.Iterator 
 */
bbq.lang.Iterator = new Class.create({
	theObject: null,
	i: null,
	
	/**
	 * @param {Object} theObject
	 */
	initialize: function(theObject) {
		this.theObject = theObject;
		this.i = 0;
	},
	
	next: function() {
		if(this.hasNext()) {
			var member = this.theObject[this.i];
			this.i++;
			return member;
		}
		
		return false;
	},
	
	hasNext: function() {
		return (this.i < this.theObject.length);
	},
	
	currentIndex: function() {
		return this.i;
	},
	
	lastIndex: function() {
		return (this.i > 0 ? this.i - 1 : null);
	},
	
	nextIndex: function() {
		return (this.hasNext() ? this.i + 1 : null);
	},
	
	num: function() {
		return this.theObject.length;
	}
});
