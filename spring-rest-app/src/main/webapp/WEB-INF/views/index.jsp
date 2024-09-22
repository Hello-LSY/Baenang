<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>테스트 컨트롤러</title>
</head>
<body>
Message : ${message}

<!-- 현재 사용자 정보 확인 -->
<c:choose>
    <c:when test="${not empty principal}">
        <!-- 로그인된 경우, 로그아웃 링크 표시 -->
        <p>안녕하세요, ${principal.name}님!</p>
        <a href="/logout">로그아웃</a>

        <!-- 명함 등록 폼으로 이동하는 버튼 -->
        <form action="/business-card/create" method="get" style="margin-top: 20px;">
            <button type="submit">명함 등록하기</button>
        </form>

    </c:when>
    <c:otherwise>
        <!-- 로그인되지 않은 경우, 로그인 및 회원가입 링크 표시 -->
        <a href="/login">로그인</a> |
        <a href="/register">회원가입</a>
    </c:otherwise>
</c:choose>
</body>
</html>
