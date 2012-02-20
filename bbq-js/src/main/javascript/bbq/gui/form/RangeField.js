include(bbq.gui.form.FormField);
include(bbq.web.Browser);

bbq.gui.form.RangeField = new Class.create(bbq.gui.form.FormField, /** @lends bbq.gui.form.RangeField.prototype */ {
	_native: null,
	_bar: null,
	_handle: null,
	_value: null,

	/**
	 * Provides an HTML5 range field with fallback for older browsers.
	 *
	 * @constructs
	 * @extends bbq.gui.form.FormField
	 * @param {Object} options
	 * @param {Number} options.min The minimum value
	 * @param {Number} options.max The maximum value
	 * @param {Number} options.step Value increment size
	 * @param {boolean} options.forceNonNative If true will not use native browser control even if it's supported
	 */
	initialize: function($super, options) {
		try {

			if(typeof options.step != 'number' || !isFinite(options.step)) {
				options.step = 1;
			}

			if(typeof options.min != 'number' || !isFinite(options.min)) {
				options.min = 1;
			}

			if(typeof options.max != 'number' || !isFinite(options.max)) {
				options.max = 100;
			}

			if(!Object.isUndefined(options.value)) {
				options.value = options.min
			}

			$super(options);

			if(Browser.forms.types.range && !this.options.forceNonNative) {
				// Supports HTML5 range input type
				this.setAttribute("type", "range");
				this.setAttribute("min", this.options.min);
				this.setAttribute("max", this.options.max);
				this.setAttribute("step", this.options.step);

				this._native = true;
			} else {
				// ack, fallback to custom version
				this._native = false;

				// use a hidden input node to store our current value and maintain compatibility with bbq.gui.form.Form#getValues
				this._bar = DOMUtil.createElement("div", {
					className: "RangeField_bar",
					style: {
						width: "100%"
					},
					onclick: this._doDrag.bind(this)
				});
				this._handle = DOMUtil.createElement("div", {
					className: "RangeField_handle",
					style: {
						position: "absolute"
					},
					onmousedown: this._startDrag.bind(this)
				});

				this.setRootNode("div");
				this.setStyle("position", "relative");
			}

			this.addClass("RangeField");
		} catch(e) {
			Log.error("Error constructing RangeField", e);
		}
	},

	/**
	 * @inheritDoc
	 */
	render: function($super) {
		$super();

		if(!this._native) {
			this.empty();

			this.appendChild(this._bar);
			this.appendChild(this._handle);

			// position handle after being added to the DOM
			setTimeout(function() {
				var width = Element.getDimensions(this._bar).width;

				var range = this.options.max - this.options.min;
				var position = (width/range) * (this._value - this.options.min);

				if(position >= width) {
					var handleWidth = Element.getDimensions(this._handle).width;
					position -= handleWidth;
				}

				var percent = ((position/width) * 100);

				if(percent > 100) {
					percent = 100;
				}

				DOMUtil.setStyle(this._handle, "left", percent + "%");
			}.bind(this), 100);
		}
	},

	_getRawValue: function() {
		if(this._native) {
			return this.getRootNode().value;
		}

		return this._value;
	},

	_setRawValue: function(value) {
		if(this._native) {
			this.getRootNode().value = value;

			return;
		}

		this._value = value;
	},

	_startDrag: function(event) {
		var doDrag = this._doDrag.bindAsEventListener(this);

		Event.observe(document, "mousemove", doDrag);

		Event.observe(document, "mouseup", function(event) {
			Event.stopObserving(document, "mouseup", this);
			Event.stopObserving(document, "mousemove", doDrag);
		});

		event.preventDefault();
	},

	_doDrag: function(event) {
		var mouseX = Event.pointerX(event);
		var elementX = Element.positionedOffset(this.getRootNode()).left;
		var width = Element.getDimensions(this._bar).width;

		var x = mouseX - elementX;

		if(x < 0) {
			x = 0;
		}

		if(x > width) {
			x = width;
		}

		this._moveHandle(x);

		event.preventDefault();
	},

	_moveHandle: function(position) {
		var width = Element.getDimensions(this._bar).width;

		// e.g. between 5 and 55 with a step size of 10 there are 6 potential values - 5, 15, 25, 35, 45, 55
		var potentialValues = Math.ceil((this.options.max - this.options.min)/this.options.step) + 1;

		// multiples of this number are valid values for handle positioning
		var segmentWidth = Math.ceil(width/potentialValues);
		var newValue = 0;

		//Log.info("width " + width + " step size " + this.options.step + " " + potentialValues + " steps");

		var handleWidth = Element.getDimensions(this._handle).width;

		if(position >= width) {
			position = width - handleWidth;
		}

		for(var i = 0; i < potentialValues; i++) {
			var segmentStart = i * segmentWidth;

			//Log.info("segmentStart " + segmentStart + " position " + position);

			if(position >= (segmentStart - (segmentWidth / 2)) && position <= (segmentStart + (segmentWidth / 2))) {
				position = segmentStart;

				newValue = this.options.min + (this.options.step * i);

				break;

			} else if(i == potentialValues - 1) {

				position = width - handleWidth;

				newValue = this.options.min + (this.options.step * i);
			}
		}

		var percent = ((position/width) * 100);

		if(percent > 100) {
			percent = 100;
		}

		DOMUtil.setStyle(this._handle, "left", percent + "%");

		this.setValue(newValue);
		this.notifyListeners("onChange");
	}
});
