<?php
    // check if the user is logged in
    require "actions/action_check_user.php";

    // get the entities
    require "actions/action_get_all.php";

    // get the notification
    require "actions/action_get_notification.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>

<style>
    .entity {
        border: 1px solid black;
        padding: 10px;
        margin: 10px;
    }

    .entity:hover {
        background-color: #eee;
        cursor: pointer;
    }
</style>

<body>
    <?php 
        echo "<h2>Welcome, " . $_SESSION["username"] . "!</h2>";
    ?>

    <hr>

    <button><a href="update_post.php">Update post</a></button>
    <button><a href="add_post.php">Add a new post</a></button>

    <hr>

</body>

</html>