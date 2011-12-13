#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
<%@ page contentType="text/html" %><%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js"></script>

		<!--[if IE]>
			<link rel="stylesheet" type="text/css" href="/style/fixIE.css" />
		<![endif]-->
		<!--[if IE 6]>
			<link rel="stylesheet" type="text/css" href="/style/fixIE6.css" />
		<![endif]-->
		<!--[if IE 7]>
			<link rel="stylesheet" type="text/css" href="/style/fixIE7.css" />
		<![endif]-->
		<!--[if IE 8]>
			<link rel="stylesheet" type="text/css" href="/style/fixIE8.css" />
		<![endif]-->
		<!--[if IE 9]>
			<link rel="stylesheet" type="text/css" href="/style/fixIE9.css" />
		<![endif]-->
		
		<title><spring:message code="${symbol_dollar}{pagetitle}" /></title>
		<link rel="stylesheet" type="text/css" media="all"  href="/css/${symbol_dollar}{stylesheet}" />
		<script src="/javascript/${symbol_dollar}{script}"></script>
	</head>
	<body onload="init('${symbol_dollar}{javascriptClass}')">
		<div id="content"></div>
	</body>
</html>