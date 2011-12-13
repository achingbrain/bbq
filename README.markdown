# bbq

## What is it?

bbq is an application framework for developing responsive, dynamic data-centric applications to be run in a web browser.  It is made of several modules:

### [bbq-js](https://github.com/achingbrain/bbq/tree/master/bbq-js)

The JavaScript UI library.

### [bbq-test](https://github.com/achingbrain/bbq/tree/master/bbq-test)

A unit testing framework used to do automated testing of bbq based applications.

### [bbq-compiler](https://github.com/achingbrain/bbq/tree/master/bbq-compiler)

Takes the contents of numerous JavaScript, CSS and i18n files and joins them together for fast download.

### [bbq-maven-plugin](https://github.com/achingbrain/bbq/tree/master/bbq-maven-plugin)

Ties the UI library, compiler and test suite together for use in CI builds.

### [bbq-spring-integration](https://github.com/achingbrain/bbq/tree/master/bbq-spring-integration)

Some convenience controllers and other niceties to aid working with the [Spring](http://www.springsource.org/) framework. 

### [bbq-spring-security-integration](https://github.com/achingbrain/bbq/tree/master/bbq-spring-security-integration)

Reusable classes to help when developing AJAX based form authentication against [Spring Security](http://static.springsource.org/spring-security/site/).

### [bbq-maven-archetype](https://github.com/achingbrain/bbq/tree/master/bbq-maven-archetype)

A Maven Archetype quickstart project

## How do I get it?

Add the following repositories to your maven project:

The new repo details are:

	<repositories>
		<repository>
			<id>achingbrain-releases</id>
			<url>http://achingbrain.github.com/maven-repo/releases</url>
		</repository>
		<repository>
			<id>achingbrain-snapshots</id>
			<url>http://achingbrain.github.com/maven-repo/snapshots</url>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
		</repository>
	</repositories>

and the for the plugin repositories…

	<pluginRepositories>
		<pluginRepository>
			<id>achingbrain-releases</id>
			<url>http://achingbrain.github.com/maven-repo/releases</url>
		</pluginRepository>
		<pluginRepository>
			<id>achingbrain-snapshots</id>
			<url>http://achingbrain.github.com/maven-repo/snapshots</url>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
		</pluginRepository>
	</pluginRepositories>

See the [bbq-maven-plugin](https://github.com/achingbrain/bbq/tree/master/bbq-maven-plugin) readme for details of how to set up the compiler.