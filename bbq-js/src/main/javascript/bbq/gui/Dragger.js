
/**
 * @class bbq.gui.Dragger 
 */
bbq.gui.Dragger = new Class.create({
	
	draggingDiv: null,
	startedDrag: null,
	startX: null,
	startY: null,
	droppableCurrentlyOver: null,
	startDraggable: null,
	feedList: null,
	
	/**
	 * @param {Node} currentPage
	 * @param {Node} draggingDiv
	 * @param {mixed} feedList
	 */
	initialize: function(currentPage, draggingDiv, feedList) {
		this.draggingDiv = draggingDiv;
		this.feedList = feedList;
		this.startedDrag = false;
	},
	
	/**
	 * @param {String} nodeID
	 * @param {mixed} nodeData
	 */
	mouseDownOverDraggable: function(nodeID, nodeData) {
		this.startDraggable = new Object();
		this.startDraggable.data = nodeData;
		this.startDraggable.node = $(nodeID);
	
		this.testStartDrag();
	},
	
	/**
	 * @param {String} nodeID
	 * @param {mixed} nodeData
	 */
	mouseUpOverDraggable: function(nodeID, nodeData) {
		if(this.startDraggable && this.startDraggable.node && this.startDraggable.node == $(nodeID)) {
			this.startDraggable = null;
		}
	},
	
	/**
	 * @param {String} nodeID
	 * @param {mixed} nodeData
	 */
	setOverDroppable: function(nodeID, nodeData) {
		if(nodeID && nodeData) {
			this.droppableCurrentlyOver = new Object();
			this.droppableCurrentlyOver.data = nodeData;
			this.droppableCurrentlyOver.node = $(nodeID);
			
			if(this.startedDrag) {
				DOMUtil.addClass(this.droppableCurrentlyOver.node, "hoverFolder");
			}
		} else	if(this.droppableCurrentlyOver) {
			DOMUtil.removeClass(this.droppableCurrentlyOver.node, "hoverFolder");
			this.droppableCurrentlyOver = null;
		}
	},
	
	/**
	 * Tests if the object is dragged
	 */
	testStartDrag: function(tested) {
		setTimeout(this.startDrag.bind(this), 100);
	},
	
	/**
	 * Starts dragging
	 */
	startDrag: function() {
		DOMUtil.emptyNode(this.draggingDiv);
		
		// store starting node
		var nodeClone = this.startDraggable.node.cloneNode(true);
		nodeClone.id = "";
	
		// put dragging copy in dragger div
		this.draggingDiv.appendChild(nodeClone);
		
		document.onmousemove = this.doDrag;
		document.onmouseup = this.stopDrag;
	},
	
	/**
	 * @param {Event} firedMouseEvent
	 */
	doDrag: function(firedMouseEvent) {
		var mouseEvent = new CF_MouseEvent(firedMouseEvent);
		
		$("draggerDiv").style.left = (mouseEvent.x + 5) + "px";
		$("draggerDiv").style.top = (mouseEvent.y - 5) + "px";
		
		if(!this.startedDrag) {
			this.startX = mouseEvent.x;
			this.startY = mouseEvent.y;
			
			DOMUtil.removeClass(this.startDraggable.node, "highlightedChannel");
			new Effect.Opacity(this.startDraggable.node, {from:1.0, to:0.4, duration: 0.15});
			new Effect.Opacity('draggerDiv', {from:0.0, to:0.8, duration: 0.15});
			$("draggerDiv").style.display = "block";
			this.startedDrag = true;
		}
		
		this.killSelection(firedMouseEvent);
	},
	
	/**
	 * @param {Event} firedMouseEvent
	 */		
	stopDrag: function(firedMouseEvent) {
		var mouseEvent = new CF_MouseEvent(firedMouseEvent);
		
		document.onmousemove = null;
		document.onmouseup = null;
		this.startedDrag = false;
		
		this.resolveDrag(mouseEvent.x, mouseEvent.y);
	},
	
	/**
	 * @param {number} mouseX
	 * @param {number} mouseY
	 */
	resolveDrag: function(mouseX, mouseY) {
		if(this.droppableCurrentlyOver && this.startDraggable) {
			$('draggerDiv').style.display = "none";
			
			if(this.startDraggable.data.type == "channel" && this.droppableCurrentlyOver.data.type == "folder") {
				if(this.startDraggable.data.folderIndex !=  this.droppableCurrentlyOver.data.index) {
					this.feedList.addChannelToFolder(this.startDraggable.data, this.droppableCurrentlyOver.data);
				}
			}
			
			DOMUtil.removeClass(this.droppableCurrentlyOver.node, "hoverFolder");
		} else {
			setTimeout("CF_Dragger.moveSelectionBack(" + mouseX + ", " + mouseY + ")", 10);
		}
		
		new Effect.Opacity('draggerDiv', {from:0.8, to:0.0, duration: 0.1});
		
		if(this.startDraggable && this.startDraggable.node) {
			new Effect.Opacity(this.startDraggable.node, {from:0.4, to:1.0, duration: 0.3});
		}
		
		this.droppableCurrentlyOver = null;
		this.startDraggable = null;
	},
	
	/**
	 * @param {number} mouseX
	 * @param {number} mouseY
	 */
	moveSelectionBack : function(currentX, currentY) {
		var dX = ((currentX - this.startX) / 5);
		var dY = ((currentY - this.startY) / 5);
		
		if(Math.round(dX) != Math.round(dY) != 0) { // not there yet
			if(dX < 1 && dX > 0) {
				dX = 1;
			} else if(dX < 0 && dX > -1) {
				dX = -1;
			}
			
			if(dY < 1 && dY > 0) {
				dY = 1;
			} else if(dY < 0 && dY > -1) {
				dY = -1;
			}
			
			currentX -= dX;
			currentY -= dY;
			
			$("draggerDiv").style.left =  Math.round(currentX) + "px";
			$("draggerDiv").style.top =  Math.round(currentY) + "px";
		
			setTimeout("CF_Dragger.moveSelectionBack(" + currentX + ", " + currentY + ")", 10);
		}
	},
	
	/**
	 * @param {Event} mouseEvent
	 */
	killSelection: function(mouseEvent) {
		if(mouseEvent && mouseEvent.preventDefault) {
			mouseEvent.preventDefault();
		} else {
			event.cancelBubble = true;
	    	event.returnValue = false;
		}
	}
});
