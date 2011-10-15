# bbq-maven-plugin

Sample configuration:

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