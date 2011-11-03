# bbq-js

This module contains the JavaScript library and is most probably what you came here for.

Documentation will appear on this page in dribs and drabs.  Eventually it'll probably get moved to a wiki somewhere...

## Date formatting

bbq borrows it's date formatting from [Steven Levithan's rather excellent blog](http://blog.stevenlevithan.com/archives/date-time-format).

When you have a JavaScript date object, you can do this sort of thing:

	DateFormatter.format(myDate, "yyyy\\mm\\dd");

Outputs:

	2011\\10\\15

The full list of supported formatting instructions are as follows:

<table cellspacing="0" summary="Date Format mask metasequences">
	<thead>
		<tr>
			<th>Mask</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>d</code></td>
			<td>Day of the month as digits; no leading zero for single-digit days.</td>
		</tr>
		<tr>
			<td><code>dd</code></td>
			<td>Day of the month as digits; leading zero for single-digit days.</td>
		</tr>
		<tr>
			<td><code>ddd</code></td>
			<td>Day of the week as a three-letter abbreviation.</td>
		</tr>
		<tr>
			<td><code>dddd</code></td>
			<td>Day of the week as its full name.</td>
		</tr>
		<tr>
			<td><code>m</code></td>
			<td>Month as digits; no leading zero for single-digit months.</td>
		</tr>
		<tr>
			<td><code>mm</code></td>
			<td>Month as digits; leading zero for single-digit months.</td>
		</tr>
		<tr>
			<td><code>mmm</code></td>
			<td>Month as a three-letter abbreviation.</td>
		</tr>
		<tr>
			<td><code>mmmm</code></td>
			<td>Month as its full name.</td>
		</tr>
		<tr>
			<td><code>yy</code></td>
			<td>Year as last two digits; leading zero for years less than 10.</td>
		</tr>
		<tr>
			<td><code>yyyy</code></td>
			<td>Year represented by four digits.</td>
		</tr>
		<tr>
			<td><code>h</code></td>
			<td>Hours; no leading zero for single-digit hours (12-hour clock).</td>
		</tr>
		<tr>
			<td><code>hh</code></td>
			<td>Hours; leading zero for single-digit hours (12-hour clock).</td>
		</tr>
		<tr>
			<td><code>H</code></td>
			<td>Hours; no leading zero for single-digit hours (24-hour clock).</td>
		</tr>
		<tr>
			<td><code>HH</code></td>
			<td>Hours; leading zero for single-digit hours (24-hour clock).</td>
		</tr>
		<tr>
			<td><code>M</code></td>
			<td>Minutes; no leading zero for single-digit minutes.<br />
				<span class="small">Uppercase M unlike CF <code>timeFormat</code>'s m to avoid conflict with months.</span></td>
		</tr>
		<tr>
			<td><code>MM</code></td>
			<td>Minutes; leading zero for single-digit minutes.<br />
				<span class="small">Uppercase MM unlike CF <code>timeFormat</code>'s mm to avoid conflict with months.</span></td>
		</tr>
		<tr>
			<td><code>s</code></td>
			<td>Seconds; no leading zero for single-digit seconds.</td>
		</tr>
		<tr>
			<td><code>ss</code></td>
			<td>Seconds; leading zero for single-digit seconds.</td>
		</tr>
		<tr>
			<td><code>l</code> <em>or</em> <code>L</code></td>
			<td>Milliseconds. <code>l</code> gives 3 digits. <code>L</code> gives 2 digits.</td>
		</tr>
		<tr>
			<td><code>t</code></td>
			<td>Lowercase, single-character time marker string: <em>a</em> or <em>p</em>.<br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
		<tr>
			<td><code>tt</code></td>
			<td>Lowercase, two-character time marker string: <em>am</em> or <em>pm</em>.<br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
		<tr>
			<td><code>T</code></td>
			<td>Uppercase, single-character time marker string: <em>A</em> or <em>P</em>.<br />
				<span class="small">Uppercase T unlike CF's t to allow for user-specified casing.</span></td>
		</tr>
		<tr>
			<td><code>TT</code></td>
			<td>Uppercase, two-character time marker string: <em>AM</em> or <em>PM</em>.<br />
				<span class="small">Uppercase TT unlike CF's tt to allow for user-specified casing.</span></td>
		</tr>
		<tr>
			<td><code>Z</code></td>
			<td>US timezone abbreviation, e.g. <em>EST</em> or <em>MDT</em>. With non-US timezones or in the Opera browser, the GMT/UTC offset is returned, e.g. <em>GMT-0500</em><br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
		<tr>
			<td><code>o</code></td>
			<td>GMT/UTC timezone offset, e.g. <em>-0500</em> or <em>+0230</em>.<br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
		<tr>
			<td><code>S</code></td>
			<td>The date's ordinal suffix (<em>st</em>, <em>nd</em>, <em>rd</em>, or <em>th</em>). Works well with <code>d</code>.<br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
		<tr>
			<td><code>'&hellip;'</code> <em>or</em> <code>"&hellip;"</code></td>
			<td>Literal character sequence. Surrounding quotes are removed.<br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
		<tr>
			<td><code>UTC:</code></td>
			<td>Must be the first four characters of the mask. Converts the date from local time to UTC/GMT/Zulu time before applying the mask. The "UTC:" prefix is removed.<br />
				<span class="small">No equivalent in CF.</span></td>
		</tr>
	</tbody>
</table>

Alternatively you can pass in a named mask:

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Mask</th>
			<th>Example</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>default</td>
			<td>ddd mmm dd yyyy HH:MM:ss</td>
			<td>Sat Jun 09 2007 17:46:21</td>
		</tr>
		<tr>
			<td>shortDate</td>
			<td>m/d/yy</td>
			<td>6/9/07</td>
		</tr>
		<tr>
			<td>mediumDate</td>
			<td>mmm d, yyyy</td>
			<td>Jun 9, 2007</td>
		</tr>
		<tr>
			<td>longDate</td>
			<td>mmmm d, yyyy</td>
			<td>June 9, 2007</td>
		</tr>
		<tr>
			<td>fullDate</td>
			<td>dddd, mmmm d, yyyy</td>
			<td>Saturday, June 9, 2007</td>
		</tr>
		<tr>
			<td>shortTime</td>
			<td>h:MM TT</td>
			<td>5:46 PM</td>
		</tr>
		<tr>
			<td>mediumTime</td>
			<td>h:MM:ss TT</td>
			<td>5:46:21 PM</td>
		</tr>
		<tr>
			<td>longTime</td>
			<td>h:MM:ss TT Z</td>
			<td>5:46:21 PM EST</td>
		</tr>
		<tr>
			<td>isoDate</td>
			<td>yyyy-mm-dd</td>
			<td>2007-06-09</td>
		</tr>
		<tr>
			<td>isoTime</td>
			<td>HH:MM:ss</td>
			<td>17:46:21</td>
		</tr>
		<tr>
			<td>isoDateTime</td>
			<td>yyyy-mm-dd'T'HH:MM:ss</td>
			<td>2007-06-09T17:46:21</td>
		</tr>
		<tr>
			<td>isoUtcDateTime</td>
			<td>UTC:yyyy-mm-dd'T'HH:MM:ss'Z'</td>
			<td>2007-06-09T22:46:21Z</td>
		</tr>
	</tbody>
</table>

### Custom date formatter

DateFormatter#format takes a third argument which is an object which has the appropriate functions which are called by DateFormatter.

See the source code of DateFormatter._stringFormatter or bbq.gui.form.DateFieldFormatter for an example.

## Drag and drop

Drag and drop on the web even with HTML5 is [a bit of a mess](http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html).  To make your GUIWidget draggable, include the DragAndDropManager

	include(bigboard.gui.DragAndDrop);

Then, in your GUIWidget's constructor, register your widget with the manager:

	DragAndDropManager.makeDraggable(this);

You'll need something to drop it on, we refer to this as a drop target.  In another GUIWidget, make it a drop target:

	DragAndDropManager.makeDroppable(this);

A drop target should implement a method:

	getDropTypes();

This method returns an array of objects that it's interested in receiving notifications about when they are dropped on it.

Finally, the drop target defines one more method:

	draggableDropped(draggable);

This gets called when a draggable of the appropriate type is dropped onto the drop target.

So:

	com.foo.MyDraggable = new Class.create(bbq.gui.GUIWidget, {
		initialize: function() {
			DragAndDropManager.makeDraggable(this);
		},
		
		draggableStarted: function() {
			// dragging this widget started
		},
		
		draggableStoped: function() {
			// dragging this widget stopped
		},
	}
	
	com.foo.MyDropTarget = new Class.create(bbq.gui.GUIWidget, {
		initialize: function() {
			DragAndDropManager.makeDropTarget(this);
		},
		
		dropTargetWillAccept: function(draggable) {
			return draggable instanceof com.foo.MyDraggable;
		},
		
		dropTargetEnter: function(draggable) {
			// the passed object was dragged into this one
		},
		
		dropTargetLeave: function(draggable) {
			// the passed object was dragged out of this one
		},
		
		dropTargetDropped: function(draggable) {
			// the passed object was dropped on this one
		}
	}

## Internationalisation

bbq has full i18n support.  Through some Spring [MessageSource](http://static.springsource.org/spring/docs/3.1.x/javadoc-api/org/springframework/context/MessageSource.html) magic, the language sent to the browser defaults to the browser locale (i.e. the locale of the [ServletRequest](http://download.oracle.com/javaee/6/api/javax/servlet/ServletRequest.html#getLocale\(\))).

### Language files

For every JavaScript class file

	MySuperFunClass.js

Store language files next to them:

	MySuperFunClass.js
	MySuperFunClass.en_GB.lang.xml
	MySuperFunClass.en_US.lang.xml
	MySuperFunClass.en.lang.xml

The language code is contained in the file name.  If a specific localisation is available (e.g. en_GB), bbq will use it, if not it will fall back to the general case (e.g. en) and finally to the default language defined in your [bbq-maven-plugin](https://github.com/achingbrain/bbq/tree/master/bbq-maven-plugin) setup.

Language files are Java xml properties files - xml because it gives you UTF8 support whereas .properties files are only ASCII, and ASCII tastes bad.

A sample file looks like this:

	<?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
	<properties>
		<entry key="mysuperfunclass.foo">Foo</entry>
		<entry key="mysuperfunclass.bar">Bar</entry>
	</properties>

In your class, reference the translations like this:

	Language.get("mysuperfunclass.foo");

### Formatting strings

Strings can contain placeholders which are substituted at runtime.  Placeholders are delimited with curly braces.  For example, if you have the following language file:

	<?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
	<properties>
		<entry key="mysuperfunclass.foo">Foo {bar}</entry>
	</properties>

To perform the substitution, you can do:

	Language.getFormatted("mysuperfunclass.foo", {bar: "baz"});

This will output:

	Foo baz

Substitutions can be DOM nodes or GUIWidgets too:

	Language.getFormatted("mysuperfunclass.foo", {bar: DOMUtil.createElement("p", "hello")});

This will output:

	Foo <p>hello</p>
