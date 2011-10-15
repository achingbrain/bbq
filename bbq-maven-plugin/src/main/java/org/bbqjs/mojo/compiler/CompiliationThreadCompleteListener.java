package org.bbqjs.mojo.compiler;

public interface CompiliationThreadCompleteListener {
	public void doneExecuting(CompilerThread compiler);
	public void failedExecuting(CompilerThread compiler, Exception e);
}
