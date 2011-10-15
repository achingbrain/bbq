package org.bbqjs.spring.ajax;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RequestForwarder implements InitializingBean {
	private static final Logger LOG = LoggerFactory.getLogger(RequestForwarder.class);
	private static final String FORWARD_HEADER_NAME = "X-BBQ-Forward-To";
	private static final String X_BBQ_REMOTE_RESPONSE_CODE = "X-BBQ-Remote-ResponseCode";
	private static final String X_BBQ_REMOTE_RESPONSE_MESSAGE = "X-BBQ-Remote-ResponseMessage";

	private String headerName;

	private boolean forwardToSelfSignedCertificateServers;

	@Override
	public void afterPropertiesSet() throws Exception {
		if(StringUtils.isEmpty(headerName)) {
			headerName = FORWARD_HEADER_NAME;
		}

		if(forwardToSelfSignedCertificateServers) {
			// make sure we can forward to https enabled servers using self-signed SSL certificates
			installNaiveTrustManager();
		}
	}

	protected URL getUrlToForwardTo(HttpServletRequest request) throws Exception {
		String header = request.getHeader(headerName);

		if(StringUtils.isEmpty(header)) {
			throw new IllegalArgumentException("Could not determine where to forward to.  Did you send the " + headerName + " header?  All I could find was " + header);
		}

		return new URL(header);
	}

	protected void copyHeaders(HttpURLConnection urlConnection, HttpServletResponse response) {
		Map<String, List<String>> headers = urlConnection.getHeaderFields();
		Iterator<String> keys = headers.keySet().iterator();

		while(keys.hasNext()) {
			String key = keys.next();

			if(key == null) {
				continue;
			}

			Iterator<String> headerValues = headers.get(key).iterator();

			String header = "";

			while(headerValues.hasNext()) {
				header += headerValues.next() + (headerValues.hasNext() ? "; " : "");
			}

			response.addHeader(key, header);
		}
	}
	
	@RequestMapping(value="/forward")
	public void forwardRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpURLConnection urlConnection = null;

		try {
			URL url = getUrlToForwardTo(request);

			urlConnection = sendRequest(url, request, request.getInputStream());

			// honour content type
			response.setContentType(urlConnection.getContentType());

			// forward all response headers
			copyHeaders(urlConnection, response);

			// write response into output stream if available
			InputStream in = urlConnection.getInputStream();

			if(in != null) {
				IOUtils.copy(in, response.getOutputStream());

				in.close();
			}

			if(urlConnection != null) {
				urlConnection.disconnect();
			}

			// for small responses Tomcat seems to need this...
			response.flushBuffer();
		} catch(IOException e) {
			LOG.error("IOException while sending request " + request, e);

			if(urlConnection != null) {
				response.addIntHeader(X_BBQ_REMOTE_RESPONSE_CODE, urlConnection.getResponseCode());
				response.addHeader(X_BBQ_REMOTE_RESPONSE_MESSAGE, urlConnection.getResponseMessage());
			}

			throw e;
		} catch(Exception e) {
			LOG.error("Could not send request " + request, e);

			throw e;
		}
	}
	
	protected HttpURLConnection sendRequest(URL url, HttpServletRequest request, InputStream inputStream) throws IOException {
		HttpURLConnection.setFollowRedirects(true);

		String contentType = request.getContentType();

		if(contentType == null) {
			contentType = "text/xml; charset=UTF-8";
		}

		HttpURLConnection urlConnection = (HttpURLConnection)url.openConnection();
		urlConnection.setConnectTimeout(600000); // one minute
		urlConnection.setReadTimeout(600000); // one minute
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		urlConnection.setUseCaches(false);
		urlConnection.setAllowUserInteraction(false);
		urlConnection.setRequestProperty("Content-type", contentType);
		urlConnection.setInstanceFollowRedirects(true);

		// forward all request headers
		Enumeration<?> headerEnumeration = request.getHeaderNames();

		while(headerEnumeration.hasMoreElements()) {
			String key = (String)headerEnumeration.nextElement();

			if(!key.equals("Host")) {
				urlConnection.setRequestProperty(key, request.getHeader(key));
			}
		}

		byte[] requestBytes = new byte[0];

		// forward post body
		if(request.getMethod().equals("POST")) {
			urlConnection.setRequestMethod("POST");

			// store request body in case we have to redirect
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

			// pipe passed request body into buffer
			IOUtils.copy(inputStream, byteArrayOutputStream);

			requestBytes = byteArrayOutputStream.toByteArray();

			OutputStream out = urlConnection.getOutputStream();

			// pipe buffer into new request
			IOUtils.copy(new ByteArrayInputStream(requestBytes), out);

			out.close();
		}

		if(urlConnection.getHeaderField("location") != null) {
			LOG.info("Request redirected to " + urlConnection.getHeaderField("location"));

			// going from http to https doesn't seem to trigger the follow redirects action
			return sendRequest(new URL(urlConnection.getHeaderField("location")), request, new ByteArrayInputStream(requestBytes));
		}

		return urlConnection;
	}

	private static void installNaiveTrustManager() {
		// Create a trust manager that does not validate certificate chains
		TrustManager[] trustAllCerts = new TrustManager[]{
			new X509TrustManager() {
				@Override
				public X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				@Override
				public void checkClientTrusted(X509Certificate[] certs, String authType) {

				}

				@Override
				public void checkServerTrusted(X509Certificate[] certs, String authType) {

				}
			}
		};

		// Install the all-trusting trust manager
		try {
			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
		} catch (Exception e) {

		}
	}

	public void setHeaderName(String headerName) {
		this.headerName = headerName;
	}

	public void setForwardToSelfSignedCertificateServers(boolean forwardToSelfSignedCertificateServers) {
		this.forwardToSelfSignedCertificateServers = forwardToSelfSignedCertificateServers;
	}
}
