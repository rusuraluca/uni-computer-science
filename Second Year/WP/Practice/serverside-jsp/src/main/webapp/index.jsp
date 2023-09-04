<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>JSP - Hello World</title>
</head>
<body>
  <form method="get" action="/logout">
    <button type="submit">Logout</button>
  </form>
  Succesfully logged in as <%= request.getAttribute("user") %>
</body>
</html>