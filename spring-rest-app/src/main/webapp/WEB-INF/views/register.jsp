<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원 등록</title>
</head>
<body>
<h1>회원 등록</h1>
<form id="registrationForm">
  <div>
    <label for="username">이름:</label>
    <input type="text" id="username" name="username" required>
  </div>
  <div>
    <label for="password">비밀번호:</label>
    <input type="password" id="password" name="password" required>
  </div>
  <div>
    <label for="email">이메일:</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div>
    <button type="submit">등록</button>
  </div>
</form>

<script>
  document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value; // 이메일 필드 추가

    fetch('/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email // 이메일 필드 전송
      })
    })
            .then(response => {
              if (!response.ok) {
                return response.json().then(errorData => {
                  throw new Error(errorData.message || '회원 생성 실패');
                });
              }
              return response.json();
            })
            .then(data => {
              console.log('회원 생성 성공:', data);
              alert('회원이 성공적으로 생성되었습니다.');
            })
            .catch(error => {
              console.error('회원 생성 실패:', error);
              alert(`회원 생성에 실패했습니다. ${error.message}`);
            });
  });
</script>
</body>
</html>
