<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Business Card</title>
  <style>
    .business-card {
      width: 400px;
      padding: 20px;
      margin: 50px auto;
      border: 1px solid #ccc;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
    }
    .business-card h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .business-card p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
<div class="business-card">
  <h1>${businessCard.name}</h1>
  <p><strong>Country:</strong> ${businessCard.country}</p>
  <p><strong>Email:</strong> ${businessCard.email}</p>
  <p><strong>SNS:</strong> ${businessCard.sns}</p>
  <p><strong>Introduction:</strong> ${businessCard.introduction}</p>
  <img src="${businessCard.qr}" alt="QR Code" />
</div>
</body>
</html>
