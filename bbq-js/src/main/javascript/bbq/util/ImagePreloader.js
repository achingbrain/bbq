/**
 * @class bbq.util.ImagePreloader 
 */
bbq.util.ImagePreloader = Class.create({
	images: null,
	elements: null,
	
	/** Constructor */
	initialize: function() {
		/*this.images = new Array();
		
		for(var i = 0; i < arguments.length; i++)
			{
			Log.info("Preloading " + arguments[i]);
			var image = new Image();
			image.src = arguments[i];
			image.onload = this.imageLoaded.bind(this);
			
			this.images[this.images.length] = image;
			}*/
	},
	
	imageLoaded: function() {
		Log.info("image loaded");
	}
});
