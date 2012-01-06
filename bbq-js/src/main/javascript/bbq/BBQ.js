/**
 * @type {Object} currentPage Represents a variable holder for the current page object
 */
var currentPage;

/**
 * Creates the bbq.page.Page object for the current page.  Should be invoked in a document onLoad event.
 * @param className
 * @param args
 */
function init(className, args) {
	if(className) {
		var parts = className.split(".");
		var classToInstantiate = window;
		
		for(var i = 0, iCount=parts.length; i < iCount; i++) {
			if(classToInstantiate[parts[i]]) {
				classToInstantiate = classToInstantiate[parts[i]];
			} else {
				alert("Fatal error - could not load " + (i < (iCount - 1) ? "package" : "class") + " " + parts[i] + (i < (iCount - 1) ? " - undefined in namespace" : " from qualified name " + className));
				return;
			}
		}
		
		currentPage = new classToInstantiate(args);
	}
}

/**
 * Dummy function - the real one is parsed out.
 * 
 * Pass the object that you wish to include, like you would the Java import statement.  Note that you cannot import whole packages.
 */
function include(object) {
	
}

/**
 * @class bbq.BBQ
 */
BBQ = {
	/**
	 * The current BBQ version
	 */
	version: 3.0,

	/**
	 * Constants
	 */
	constants: {
		PAGINATOROPTIONS_SORTDESC: 0,
		PAGINATOROPTIONS_SORTASC: 1
	}
}
