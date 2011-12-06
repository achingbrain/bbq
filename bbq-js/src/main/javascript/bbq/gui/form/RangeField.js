include(bbq.gui.form.FormField);
include(bbq.web.Browser);

bbq.gui.form.RangeField = new Class.create(bbq.gui.form.FormField, {
	_native: null,
	_bar: null,
	_handle: null,
	_value: null,

	/**
	 * Supports the following options:
	 *
	 * options: {
	 *      min: Number     // the minimum value
	 *      max: Number    // the maximum value
	 *      step: Number    // value increment size
	 *      forceNonNative: boolean // if true will not use native browser control even if it's supported
	 * }
	 * @param $super
	 * @param args
	 */
	initialize: function($super, args) {
		try {
			$super(args);

			if(!this.options.step) {
				this.options.step = 1;
			}

			if(!this.options.min) {
				this.options.min = 1;
			}

			if(!this.options.max) {
				this.options.max = 100;
			}

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
						width: "10px",
						height: "10px",
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

	_startDrag: function() {
		var doDrag = this._doDrag.bindAsEventListener(this);

		Event.observe(document, "mousemove", doDrag);

		Event.observe(document, "mouseup", function(event) {
			Event.stopObserving(document, "mouseup", this);
			Event.stopObserving(document, "mousemove", doDrag);
		});
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
	},

	_moveHandle: function(position) {
		var width = Element.getDimensions(this._bar).width;

		// e.g. between 5 and 55 with a step size of 10 there are 6 potential values - 5, 15, 25, 35, 45, 55
		var potentialValues = Math.ceil((this.options.max - this.options.min)/this.options.step);

		// multiples of this number are valid values for handle positioning
		var segmentWidth = Math.ceil(width/potentialValues) + 1;
		var newValue = 0;

		//Log.info("width " + width + " step size " + this.options.step + " " + potentialValues + " steps");

		for(var i = 0; i <= potentialValues; i++) {
			var segmentStart = i * segmentWidth;

			//Log.info("segmentStart " + segmentStart + " position " + position);

			if(position >= (segmentStart - (segmentWidth / 2)) && position <= (segmentStart + (segmentWidth / 2))) {
				position = segmentStart;

				newValue = this.options.min + (this.options.step * i);

				break;
			}
		}

		if(position >= width) {
			var handleWidth = Element.getDimensions(this._handle).width;
			position -= handleWidth;
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
