package org.bbqjs.mojo.tests;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.mojo.MojoLogger;
import org.bbqjs.tests.JavaScriptTestRunner;
import org.bbqjs.tests.TestResult;
import org.bbqjs.tests.TestResult.TYPE;
import org.codehaus.plexus.util.StringUtils;
import org.slf4j.Logger;

import java.io.File;
import java.util.ArrayList;

/**
 * Parses include statements in JavaScript files and generates single file
 * JavaScript and CSS files.
 * 
 * @author alex
 *
 * @goal test
 * @phase test
 * @threadSafe
 * @requiresDependencyResolution test
 * @configurator include-project-test-dependencies
 */
public class TestJavaScriptMojo extends AbstractMojo {

	/**
	 * The root directory that holds the test files.
	 *
	 * Each file should end in Test.js - e.g. MySuperFunTest.js and contain one test and that test should
	 * be defined in a global variable named "test".  E.g.
	 *
	 * <code>
	 * test = new Test.Unit.Runner({
	 *
	 * 		// optional set up method
	 * 		setup: function() { with(this) {
	 *
	 * 		}},
	 *
	 * 		// optional tear down method
	 * 		teardown: function() { with(this) {
	 *
	 * 		}},
	 *
	 * 		// one or more test methods
	 * 		testSomething: function() { with(this) {
	 * 			// some code, hopefully with some assertions
	 * 		}}
	 * })
	 * </code>
	 *
	 * @parameter default-value="src/test/javascript"
	 * @required
	 */
	private File testDirectory;

	/**
	 * A list of files to include before each test.
	 *
	 * IMPORTANT - this list should include a unit testing suite such as
	 * unittest.js from the scriptaculous library
	 *
	 * Eg. JavaScript files.
	 *
	 * @parameter
	 */
	private String[] includes;

	/**
	 * @parameter
	 */
	private String[] sourceRoots;

	/**
	 * @parameter expression="${project}"
	 * @required
	 * @readonly
	 */
	protected MavenProject project;

	/**
	 * Plugin descriptor.
	 *
	 * @parameter default-value="${plugin}"
	 * @required
	 * @readonly
	 */
	protected PluginDescriptor descriptor;

	private ArrayList<TestResult> results;

	@Override
	public void execute() throws MojoExecutionException, MojoFailureException {
		//super.execute(project, descriptor);

		// Should we skip test execution?
		if(System.getProperty("skipTests") != null || System.getProperty("maven.test.skip") != null) {
			getLog().info("Tests are skipped.");

			return;
		}

		Logger log = new MojoLogger(getLog());
		JavaScriptTestRunner.setLogger(log);

		results = new ArrayList<TestResult>();

		if(!testDirectory.exists()) {
			throw new MojoExecutionException("Test directory " + testDirectory + " does not exist.  Please check your plugin configuration.");
		}

		if(!testDirectory.isDirectory()) {
			throw new MojoExecutionException("Test directory " + testDirectory + " is not a directory.  Please check your plugin configuration.");
		}

		String specifiedTest = System.getProperty("bbq.test");

		if(StringUtils.isNotBlank(specifiedTest)) {
			// has the user specified a test or tests to run

			for(String test : specifiedTest.split(",")) {
				test = test.trim();

				if(test.endsWith(".js")) {
					// strip off the test file extension if supplied
					test = test.substring(0, test.length() - 3);
				}

				test = test.replaceAll("\\.", File.separator);

				File testFile = new File(testDirectory.getAbsolutePath() + File.separator + test + ".js");

				if(!testFile.exists()) {
					throw new MojoFailureException("Could not find test at " + testFile.getAbsolutePath() + " to run");
				}

				try {
					runTest(testFile);
				} catch (Exception e) {
					throw new MojoExecutionException("Exception thrown while executing tests", e);
				}
			}
		} else {
			// no specified test, run everything
			try {
				parseInputFiles(testDirectory);
			} catch (Exception e) {
				throw new MojoExecutionException("Exception thrown while executing tests", e);
			}
		}

		boolean failures = false;
		String failingTests = "";

		for(TestResult result : results) {
			if(!result.getType().equals(TYPE.SUCCESS)) {
				failingTests += result.getName() + " - " + result.getMessage() + "\r\n";

				// we have test failures - cause this mojo to make a fuss
				failures = true;
			}
		}

		if(failures) {
			log.error("");
			log.error("Failing tests:");
			log.error("");
			log.error(failingTests);
			log.error("");

			throw new MojoExecutionException("There were test failures.  To re-run individual tests, specify the tests to run using the -Dbbq.test property.  e.g. mvn test -Dbbq.test=my.wonderful.ClassTest");
		}
	}

	protected void parseInputFiles(File directory) throws Exception {
		for(File file : directory.listFiles()) {
			if(file.isHidden()) {
				continue;
			}

			if(file.isDirectory()) {
				// descend into directory
				parseInputFiles(file);
			} else {
				if(!file.getPath().endsWith("Test.js")) {
					continue;
				}

				runTest(file);
			}
		}
	}

	protected void runTest(File testFile) throws Exception {
		// replace test directory
		String filePackage = testFile.getAbsolutePath().replace(testDirectory.getAbsolutePath() + File.separator, "");

		// replace filename
		filePackage = filePackage.substring(0, filePackage.length() - testFile.getName().length());

		// found unit test, run it
		JavaScriptTestRunner testRunner = new JavaScriptTestRunner();
		testRunner.setIncludes(includes);
		testRunner.setTestFile(testFile.toURI().toURL());
		testRunner.setTestPackage(filePackage);
		testRunner.setSourceRoots(sourceRoots);

		results.add(testRunner.runTest());
	}

	public void setTestDirectory(File testDirectory) {
		this.testDirectory = testDirectory;
	}

	public void setIncludes(String[] includes) {
		this.includes = includes;
	}

	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}

	public void setProject(MavenProject project) {
		this.project = project;
	}

	public void setDescriptor(PluginDescriptor descriptor) {
		this.descriptor = descriptor;
	}
}
