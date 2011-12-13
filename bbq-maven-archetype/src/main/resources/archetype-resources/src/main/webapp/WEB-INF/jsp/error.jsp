#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <title>Error</title>
     <style type="text/css">
    
body {
	margin: 0;
	padding: 15px;
	line-height: 1;
	height: 100%;
	color: ${symbol_pound}666;
	font: small Helvetica, Arial, Verdana, Sans-serif;
}
h2 {
	font-size: x-large;
	font-weight: bold;
	margin: 0;
	padding: 0;
}
pre {
	background-color: ${symbol_pound}EEE;
	border: 1px solid ${symbol_pound}CCC;
	padding: 10px;
	overflow: auto;
}

    </style>
  </head>
  <body>
    <h2>Error</h2>
    <p>Oops...</p>
    <pre><spring:message text="${symbol_dollar}{error}" /></pre>
  </body>
</html>