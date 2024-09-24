<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>명함 등록</title>
</head>
<body>
<h1>명함 등록</h1>
<form id="businessCardForm">
  <div>
    <label for="name">이름:</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div>
    <label for="country">국가:</label>
    <input type="text" id="country" name="country" required>
  </div>
  <div>
    <label for="email">이메일:</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div>
    <label for="sns">SNS:</label>
    <input type="text" id="sns" name="sns" required>
  </div>
  <div>
    <label for="introduction">소개:</label>
    <textarea id="introduction" name="introduction" required></textarea>
  </div>
  <div>
    <button type="submit">명함 등록</button>
  </div>
</form>

<script>
  document.getElementById('businessCardForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    // memberId를 히든 필드나 서버에서 전달된 값으로 설정
    const memberId = '${memberId}'; // 서버에서 전달된 memberId를 사용

    if (!memberId) {
      alert('멤버 ID가 필요합니다.');
      return;
    }

    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const email = document.getElementById('email').value;
    const sns = document.getElementById('sns').value;
    const introduction = document.getElementById('introduction').value;

    fetch(`/api/business-cards/member/${memberId}`, {  // memberId를 경로에 포함
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        country: country,
        email: email,
        sns: sns,
        introduction: introduction
      })
    })
            .then(response => response.json())
            .then(data => {
              console.log('명함 생성 성공:', data);
              alert('명함이 성공적으로 생성되었습니다.');
              window.location.href = `/business-card/${memberId}`; // 명함 상세 페이지로 리다이렉트
            })
            .catch(error => {
              console.error('명함 생성 실패:', error);
              alert('명함 생성에 실패했습니다.');
            });
  });
</script>

</body>
</html>
