<?php
    // check if the user is logged in
    require "actions/action_check_user.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update</title>
</head>
<body>
    
    <h1>Manage grades</h1>
    <hr>
    <form action="actions/action_update_grade.php" method="post">
        <input type="text" name="courseid" placeholder="course id...">
        <input type="text" name="name" placeholder="name...">
        <input type="text" name="grade" placeholder="grade...">
        <button>Update</button>
    </form>
</body>
</html>