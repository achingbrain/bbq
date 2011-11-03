# bbq-maven-plugin

## Page package

A bbq application has one main class per page.  There should be a package that contains these classes (sub packages are ok).  The name of this package should be specified as the

	${js.page.package}

maven property.  e.g.:

	<properties>
		<js.page.package>com.myapp.pages</js.page.package>
	</properties>

This package should exist in the JavaScript directory.  By default this would be at:

	src/main/javascript

So, from the above example the plugin expects to see something like this:

	src/main/javascript/com/myapp/pages/HomePage.js

## Sample configuration

	<plugin>
		<groupId>org.bbqjs</groupId>
		<artifactId>bbq-maven-plugin</artifactId>
		<version>${maven.plugin.bbq.version}</version>
		<executions>
			<execution>
				<id>Compile JavaScript</id>
				<goals>
					<goal>marinateJS</goal>
				</goals>
				<configuration>
					<outputDirectory>${project.build.directory}/js/bbq</outputDirectory>
				</configuration>
			</execution>
			<execution>
				<id>Compile CSS</id>
				<goals>
					<goal>marinateCSS</goal>
				</goals>
				<configuration>
					<outputDirectory>${project.build.directory}/css/bbq</outputDirectory>
					<libraries>
						<library>boilerplate.less</library>
					</libraries>
				</configuration>
			</execution>
			<execution>
				<id>Compile Language</id>
				<goals>
					<goal>marinateLanguage</goal>
				</goals>
				<configuration>
					<defaultLanguage>en_GB</defaultLanguage>
					<supportedLanguages>
						<supportedLanguage>en_GB</supportedLanguage>
						<supportedLanguage>en_US</supportedLanguage>
					</supportedLanguages>
				</configuration>
			</execution>
			<execution>
				<id>Test JavaScript</id>
				<goals>
					<goal>unitTestJavaScript</goal>
				</goals>
				<configuration>
					<testDirectory>${project.basedir}/src/test/javascript</testDirectory>
					<includes>
						<include>javascript/libs/prototype-1.7.0.0.js</include>
						<include>javascript/libs/unittest-1.8.0.js</include>
					</includes>
				</configuration>
			</execution>
			<execution>
				<id>Copy Images</id>
				<goals>
					<goal>copyImages</goal>
				</goals>
				<configuration>
					<outputDirectory>${project.build.directory}/${project.build.finalName}/images</outputDirectory>
				</configuration>
			</execution>
		</executions>

		<dependencies>
			<dependency>
				<groupId>org.bbqjs</groupId>
				<artifactId>bbq-js</artifactId>
				<version>${bbq.version}</version>
			</dependency>
		</dependencies>
	</plugin>

Woah.  Let's break that down a little.

The bbq Maven plugin does four things:

1. Compiles JavaScript
2. Compiles CSS
3. Compiles Language files
4. Runs JavaScript unit tests
5. Copies images into the web root

When we say "compile" we really mean "gloms a bunch of files together".  See the [bbq-compiler](https://github.com/achingbrain/bbq/tree/master/bbq-compiler) for more information on this.

Each task is done via an execution.

## JavaScript compilation

	<execution>
		<id>Compile JavaScript</id>
		<goals>
			<goal>marinateJS</goal>
		</goals>
		<configuration>
			<outputDirectory>${project.build.directory}/js/bbq</outputDirectory>
		</configuration>
	</execution>

This execution looks for page classes to compile.  By default, the package it examines is found at:

	src/main/javascript/${js.page.package}

If yours lives somewhere else, specify an

	<inputDirectory>path/to/directory</inputDirectory>

element in the configuration section

Each compiled JavaScript file (one per page) is outputted into the directory specified by the

	<outputDirectory>path/to/directory</outputDirectory>

element.

## CSS compilation

	<execution>
		<id>Compile CSS</id>
		<goals>
			<goal>marinateCSS</goal>
		</goals>
		<configuration>
			<outputDirectory>${project.build.directory}/css/bbq</outputDirectory>
			<libraries>
				<library>boilerplate.less</library>
			</libraries>
		</configuration>
	</execution>

This works in a similar fashion to the JavaScript compilation exectution, except instead of JavaScript files, it compiles CSS files.

## Language compilation

	<execution>
		<id>Compile Language</id>
		<goals>
			<goal>marinateLanguage</goal>
		</goals>
		<configuration>
			<defaultLanguage>en_GB</defaultLanguage>
			<supportedLanguages>
				<supportedLanguage>en_GB</supportedLanguage>
				<supportedLanguage>en_US</supportedLanguage>
			</supportedLanguages>
		</configuration>
	</execution>

Also similar to the JavaScript compiler execution, this execution compiles language translation files.  Each JavaScript class should have one or more language translation files next to it in the source directory structure.  So, for example:

	src/main/javascript/com/myapp/MyClass.js
	src/main/javascript/com/myapp/MyClass.en_GB.lang.xml
	src/main/javascript/com/myapp/MyClass.en_US.lang.xml

The

	<defaultLanguage>locale_code</defaultLanguage>

element defines which language is used when translations do not exist in the specified language.  So, for example, with the configuration above you could put all of your translations in the en_GB files, then override alternative spellings such as "color" in the en_US files.

Only languages defined in

	<supportedLanguage>locale_code</supportedLanguage

elements will be compiled.

Language files are simple Java properties files.  This ensures the translations support multibyte character sets.  e.g:

	<?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
	<properties>
		<entry key="com.myapp.hello">Hello</entry>
		<entry key="com.myapp.world">World</entry>
	</properties>

## JavaScript Unit tests

	<execution>
		<id>Test JavaScript</id>
		<goals>
			<goal>unitTestJavaScript</goal>
		</goals>
		<configuration>
			<testDirectory>${project.basedir}/src/test/javascript</testDirectory>
			<includes>
				<include>javascript/libs/prototype-1.7.0.0.js</include>
				<include>javascript/libs/unittest-1.8.0.js</include>
			</includes>
		</configuration>
	</execution>

The includes directive specifies arbitrary javascript files that will be loaded into the test environment.  Use this to make sure your chosen framework/test/mocking libraries are present when you run your tests.

More information is available in the [bbq-test readme](https://github.com/achingbrain/bbq/tree/master/bbq-test/README.markdown).

## Copying images

	<execution>
		<id>Copy Images</id>
		<goals>
			<goal>copyImages</goal>
		</goals>
		<configuration>
			<outputDirectory>${project.build.directory}/${project.build.finalName}/images</outputDirectory>
		</configuration>
	</execution>

# Unit tests

## Running individual tests

By default every available JavaScript test is run in the test phase.  If you wish to specify the tests to be run, you can do so as follows:

	mvn test -Dbbq.test=my.super.fun.ClassTest

This will only run the specified test.  If you wish to run multiple tests, separate them with commas:

	mvn test -Dbbq.test=my.super.fun.ClassTest,my.other.ClassTest

If you accidentally include the .js extension it will be removed.
