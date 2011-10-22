include(bbq.util.Log);

bbq.gui.DragAndDrop = new Class.create({
	_droppable: null,

	initialize: function() {
		try {

		} catch(e) {
			Log.error("Error constructing DragAndDrop", e);
		}
	},

	_onDragStart: function(event) {
		//Log.info("Noticed drag start");

		this._droppable = null;

		var element = Event.findElement(event);

		if (!element.owner) {
			return;
		}

		var owner = element.owner();

		if (owner.getRootNode().draggable) {
			this._droppable = owner;
		}

		if (owner.draggableStarted) {
			owner.draggableStarted();
		}

		// FireFox and Chrome won't honour drag and drop unless some data is set
		event.dataTransfer.setData('Text', "wtf bbq?!");
	},

	_onDrag: function(event) {
		//Log.info("Noticed drag");
	},

	_onDragOver: function(event) {
		//Log.info("Noticed drag over");

		var element = Event.findElement(event);

		// find drop targets
		this._findDropTargets(element).each(function(target) {
			if (target.dropTargetEnter) {
				target.dropTargetEnter(this._droppable);
			}
		}.bind(this));

		// must cancel this event in order for drop to file
		Event.stop(event);
	},

	_onDragEnter: function(event) {
		//Log.info("Noticed drag enter");

		var element = Event.findElement(event);

		// find drop targets
		this._findDropTargets(element).each(function(target) {
			if (target.dropTargetEnter) {
				target.dropTargetEnter(this._droppable);
			}
		}.bind(this));

		// must cancel this event in order for drop to file
		Event.stop(event);
	},

	_onDragLeave: function(event) {
		//Log.info("Noticed drag leave");

		var element = Event.findElement(event);

		// find drop targets
		this._findDropTargets(element).each(function(target) {
			if (target.dropTargetLeave) {
				target.dropTargetLeave(this._droppable);
			}
		}.bind(this));
	},

	_onDrop: function(event) {
		//Log.info("Noticed drop");

		var element = Event.findElement(event);

		// find drop targets
		this._findDropTargets(element).each(function(target) {
			if (target.dropTargetDropped) {
				target.dropTargetDropped(this._droppable);
			}
		}.bind(this));

		Event.stop(event);
	},

	_onDragEnd: function(event) {
		//Log.info("Noticed drag end");

		this._droppable = null;

		var element = Event.findElement(event);

		if (!element.owner) {
			return;
		}

		var owner = element.owner();

		if (owner.draggableStopped) {
			owner.draggableStopped();
		}
	},

	makeDraggable: function(widget) {
		widget.setAttribute("draggable", true);
		widget.addClass("draggable");

		widget.setStyle("-moz-user-select", "none");
		widget.setStyle("-khtml-user-select", "none");
		widget.setStyle("-webkit-user-select", "none");
		widget.setStyle("user-select", "none");
		widget.setStyle("-khtml-user-drag", "element");

		Event.observe(widget.getRootNode(), "dragstart", this._onDragStart.bindAsEventListener(this));
		Event.observe(widget.getRootNode(), "dragend", this._onDragEnd.bindAsEventListener(this));
	},

	makeDropTarget: function(widget) {
		widget.addClass("DragAndDropManager_dropTarget");

		Event.observe(widget.getRootNode(), "dragover", this._onDragOver.bindAsEventListener(this));
		Event.observe(widget.getRootNode(), "dragenter", this._onDragEnter.bindAsEventListener(this));
		Event.observe(widget.getRootNode(), "dragleave", this._onDragLeave.bindAsEventListener(this));
		Event.observe(widget.getRootNode(), "drop", this._onDrop.bindAsEventListener(this));
	},

	_findDropTargets: function(node) {
		var output = [];

		// find drop target
		var parentNode = node;

		while (parentNode) {
			if (parentNode.owner) {
				var owner = parentNode.owner();

				if (owner.hasClass("DragAndDropManager_dropTarget") && owner.dropTargetWillAccept && owner.dropTargetWillAccept(this._droppable)) {
					output.push(owner);
				}
			}

			parentNode = parentNode.parentNode;
		}

		return output;
	}
});

DragAndDropManager = new bbq.gui.DragAndDrop();
