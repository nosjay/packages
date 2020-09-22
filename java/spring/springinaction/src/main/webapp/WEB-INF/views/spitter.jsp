<%@ taglib uri="http://www.springframework.org/tags" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="d" %>
<%@ page session="false" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Spitter-<d:out value="${spitter.username}"/></title>
    <link rel="stylesheet" href="<c:url value="/style/style.css"/>">
</head>
<body>

<div class="spittle-wrapper">
    <div class="spitter-profile">
        <h2>Profile</h2>
        <div class="spitter-content">
            <p>Username: <d:out value="${spitter.username}"/></p>
            <p>CreatedAt: <d:out value="${spitter.createdAt}"/></p>
        </div>
    </div>
</div>

</body>
</html>
