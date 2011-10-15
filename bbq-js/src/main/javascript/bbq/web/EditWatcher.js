include(bbq.util.BBQUtil);

/**
 * Simple object to keep track of entities that have not had their changes saved.
 * @class EditWatcher
 */
EditWatcher = {
	_editors: {},
	
	/**
	 * Call this method when the current entity being edited has had properties changed.
	 * 
	 * @param	{mixed}		editor			Some sort of entitiy - will have a property set named __editorGUID.  If a function is passed, it will be invoked in the changesOutstanding method - if it returns true it will be assumed that no changes have been made
	 * @param	{string}		message		The message that will be popped up if changes are not saved.  Optional.
	 */
	registerEditor: function(editor, func, message) {
		if(arguments.length != 3) {
			throw "Need more arguments for EditWatcher";
		}
		
		if(editor.__editorGUID) {
			EditWatcher.deRegisterEditor(editor.__editorGUID);
		}
		
		editor.__editorGUID = BBQUtil.generateGUID();
		
		EditWatcher._editors[editor.__editorGUID] = {
			func: func,
			message: message ? message: false
		};
	},
	
	/**
	 * Call this method once the changes to the current method have been either saved or cancelled.
	 */
	deRegisterEditor: function(editor) {
		if(editor.__editorGUID) {
			delete EditWatcher._editors[editor.__editorGUID];
			delete editor.__editorGUID;
		}
	},
	
	/**
	 * Checks if a given editor has outstanding changes.  Returns true if no changes are outstanding and it is ok to proceed.  If an editor is supplied and changes are outstanding, 
	 * will pop up a confirm dialog asking if the user wishes to abandon changes.  If no editor is supplied will check to see if any changes are outstanding, if there are it will pop up
	 * a generic message about unsaved changes.
	 * 
	 * If the user explicitly abandons changes, all editors are deregistered.
	 * 
	 * @param	{Object}		[editor]		Optional.
	 * @param	{String}		[overrideMessage]	Optional - if supplied will be presented to the user instead of the message passed to registerEditor
	 * 
	 * @return {boolean}	true if changes have yet to be saved, false otherwise
	 */
	changesOutstanding: function(editor, message) {
		var func;
		
		if(editor && editor.__editorGUID && EditWatcher._editors[editor.__editorGUID]) {
			func = EditWatcher._editors[editor.__editorGUID]["func"];
			
			if(!message && EditWatcher._editors[editor.__editorGUID]["message"]) {
				message = EditWatcher._editors[editor.__editorGUID]["message"];
			}
		} else {
			for(var key in EditWatcher._editors) {
				if(EditWatcher._editors[key]) {
					func = EditWatcher._editors[key]["func"];
					
					if(!message && EditWatcher._editors[key]["message"]) {
						message = EditWatcher._editors[key]["message"];
					}
					
					break;
				}
			}
		}
		
		if(!func) {
			//Log.warn("EditWatcher callback function not found");
			return;
		}
		
		// test to see if changes have occured
		if(!func()) {
			return false;
		}
		
		return !confirm(message ? message : Language.get("bbq.web.EditWatcher.unsavedchanges"));
	},
	
	/**
	 * Blanks the local store of editors with outstanding changes.  
	 * Does not remove __editorGUID field on editor objects although could do in the future by some cunning use of event notifications.
	 */
	deRegisterAllEditors: function() {
		EditWatcher._editors = {};
	},
	
	_warnUser: function(event) {
		for(var key in EditWatcher._editors) {
			if(EditWatcher._editors[key]) {
				return EditWatcher._editors[key] === true ? Language.get("bbq.web.EditWatcher.unsavedchanges") : EditWatcher._editors[key].message;
			}
		}
	}
}

window.onbeforeunload = EditWatcher._warnUser;