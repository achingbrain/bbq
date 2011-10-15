package org.bbqjs.mojo.compiler;

import java.util.Formatter;
import java.util.Locale;

import org.apache.maven.plugin.logging.Log;
import org.slf4j.Logger;
import org.slf4j.Marker;

/**
 * Facade to convert Maven's Mojo Logger into a SLF4J friendly one.
 * 
 * @author alex
 *
 */
public class MojoLogger implements Logger {
	private Log log;
	
	public MojoLogger(Log log) {
		this.log = log;
	}
	
	@Override
	public String getName() {
		return log.toString();
	}
	
	@Override
	public boolean isTraceEnabled() {
		return isInfoEnabled();
	}
	
	@Override
	public void trace(String msg) {
		info(msg);
	}

	@Override
	public void trace(String format, Object arg) {
		info(format, arg);
	}

	@Override
	public void trace(String format, Object arg1, Object arg2) {
		info(format, arg1, arg2);
	}

	@Override
	public void trace(String format, Object[] argArray) {
		info(format, argArray);
	}

	@Override
	public void trace(String msg, Throwable t) {
		info(msg, t);
	}

	@Override
	public boolean isTraceEnabled(Marker marker) {
		return isInfoEnabled(marker);
	}

	@Override
	public void trace(Marker marker, String msg) {
		info(marker, msg);
	}

	@Override
	public void trace(Marker marker, String format, Object arg) {
		info(marker, format, arg);
	}

	@Override
	public void trace(Marker marker, String format, Object arg1, Object arg2) {
		info(marker, format, arg1, arg2);
	}

	@Override
	public void trace(Marker marker, String format, Object[] argArray) {
		info(marker, format, argArray);
	}

	@Override
	public void trace(Marker marker, String msg, Throwable t) {
		info(marker, msg, t);
	}

	@Override
	public boolean isDebugEnabled() {
		return log.isDebugEnabled();
	}

	@Override
	public void debug(String msg) {
		log.debug(msg);
	}

	@Override
	public void debug(String format, Object arg) {
		log.debug(format(format, arg));
	}

	@Override
	public void debug(String format, Object arg1, Object arg2) {
		log.debug(format(format, arg1, arg2));
	}

	@Override
	public void debug(String format, Object[] argArray) {
		log.debug(format(format, argArray));
	}

	@Override
	public void debug(String msg, Throwable t) {
		log.debug(msg, t);
	}

	@Override
	public boolean isDebugEnabled(Marker marker) {
		return log.isDebugEnabled();
	}

	@Override
	public void debug(Marker marker, String msg) {
		log.debug(msg);
	}

	@Override
	public void debug(Marker marker, String format, Object arg) {
		log.debug(format(format, arg));
	}

	@Override
	public void debug(Marker marker, String format, Object arg1, Object arg2) {
		log.debug(format(format, arg1, arg2));
	}

	@Override
	public void debug(Marker marker, String format, Object[] argArray) {
		log.debug(format(format, argArray));
	}

	@Override
	public void debug(Marker marker, String msg, Throwable t) {
		log.debug(msg, t);
	}

	@Override
	public boolean isInfoEnabled() {
		return log.isInfoEnabled();
	}

	@Override
	public void info(String msg) {
		log.info(msg);
	}

	@Override
	public void info(String format, Object arg) {
		log.info(format(format, arg));
	}

	@Override
	public void info(String format, Object arg1, Object arg2) {
		log.info(format(format, arg1, arg2));
	}

	@Override
	public void info(String format, Object[] argArray) {
		log.info(format(format, argArray));
	}

	@Override
	public void info(String msg, Throwable t) {
		log.info(msg, t);
	}

	@Override
	public boolean isInfoEnabled(Marker marker) {
		return log.isInfoEnabled();
	}

	@Override
	public void info(Marker marker, String msg) {
		log.info(msg);
	}

	@Override
	public void info(Marker marker, String format, Object arg) {
		log.info(format(format, arg));
	}

	@Override
	public void info(Marker marker, String format, Object arg1, Object arg2) {
		log.info(format(format, arg1, arg2));
	}

	@Override
	public void info(Marker marker, String format, Object[] argArray) {
		log.info(format(format, argArray));
	}

	@Override
	public void info(Marker marker, String msg, Throwable t) {
		log.info(msg, t);
	}

	@Override
	public boolean isWarnEnabled() {
		return log.isWarnEnabled();
	}

	@Override
	public void warn(String msg) {
		log.warn(msg);
	}

	@Override
	public void warn(String format, Object arg) {
		log.warn(format(format, arg));
	}

	@Override
	public void warn(String format, Object[] argArray) {
		log.warn(format(format, argArray));
	}

	@Override
	public void warn(String format, Object arg1, Object arg2) {
		log.warn(format(format, arg1, arg2));
	}

	@Override
	public void warn(String msg, Throwable t) {
		log.warn(msg, t);
	}

	@Override
	public boolean isWarnEnabled(Marker marker) {
		return log.isWarnEnabled();
	}

	@Override
	public void warn(Marker marker, String msg) {
		log.warn(msg);
	}

	@Override
	public void warn(Marker marker, String format, Object arg) {
		log.warn(format(format, arg));
	}

	@Override
	public void warn(Marker marker, String format, Object arg1, Object arg2) {
		log.warn(format(format, arg1, arg2));
	}

	@Override
	public void warn(Marker marker, String format, Object[] argArray) {
		log.warn(format(format, argArray));
	}

	@Override
	public void warn(Marker marker, String msg, Throwable t) {
		log.warn(msg, t);
	}

	@Override
	public boolean isErrorEnabled() {
		return log.isErrorEnabled();
	}

	@Override
	public void error(String msg) {
		log.error(msg);
	}

	@Override
	public void error(String format, Object arg) {
		log.error(format(format, arg));
	}

	@Override
	public void error(String format, Object arg1, Object arg2) {
		log.error(format(format, arg1, arg2));
	}

	@Override
	public void error(String format, Object[] argArray) {
		log.error(format(format, argArray));
	}

	@Override
	public void error(String msg, Throwable t) {
		log.error(msg, t);
	}

	@Override
	public boolean isErrorEnabled(Marker marker) {
		return log.isErrorEnabled();
	}

	@Override
	public void error(Marker marker, String msg) {
		log.error(msg);
	}

	@Override
	public void error(Marker marker, String format, Object arg) {
		log.error(format(format, arg));
	}

	@Override
	public void error(Marker marker, String format, Object arg1, Object arg2) {
		log.error(format(format, arg1, arg2));
	}

	@Override
	public void error(Marker marker, String format, Object[] argArray) {
		log.error(format(format, argArray));
	}

	@Override
	public void error(Marker marker, String msg, Throwable t) {
		log.error(msg, t);
	}
	
	private String format(String format, Object arg) {
		StringBuilder sb = new StringBuilder();
		Formatter formatter = new Formatter(sb, Locale.getDefault());
		formatter.format(format, arg);
		
		return sb.toString();
	}
	
	private String format(String format, Object arg1, Object arg2) {
		StringBuilder sb = new StringBuilder();
		Formatter formatter = new Formatter(sb, Locale.getDefault());
		formatter.format(format, arg1, arg2);
		
		return sb.toString();
	}
	
	private String format(String format, Object[] argArray) {
		StringBuilder sb = new StringBuilder();
		Formatter formatter = new Formatter(sb, Locale.getDefault());
		formatter.format(format, argArray);
		
		return sb.toString();
	}
}
