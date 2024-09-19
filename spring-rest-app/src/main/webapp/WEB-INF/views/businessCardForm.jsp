<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html>
<head>
  <title>명함 등록</title>
</head>
<body>
<h1>명함 등록</h1>
<form:form action="/business-card/save" modelAttribute="businessCardDTO" method="post">
  <table>
    <tr>
      <td>이름:</td>
      <td><form:input path="name" /></td>
    </tr>
    <tr>
      <td>국가:</td>
      <td><form:input path="country" /></td>
    </tr>
    <tr>
      <td>이메일:</td>
      <td><form:input path="email" /></td>
    </tr>
    <tr>
      <td>SNS:</td>
      <td><form:textarea path="sns" /></td>
    </tr>
    <tr>
      <td>소개:</td>
      <td><form:input path="introduction" /></td>
    </tr>
    <tr>
      <td>QR 코드:</td>
      <td><form:textarea path="qr" /></td>
    </tr>
    <tr>
      <td colspan="2">
        <button type="submit">등록</button>
      </td>
    </tr>
  </table>
</form:form>
</body>
</html>
