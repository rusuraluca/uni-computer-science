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
    
    <h1>Update a post</h1>
    <hr>
    <form action="actions/action_update_post.php" method="post">
        <input type="text" name="id" placeholder="Post Id">
        <input type="text" name="topicid" placeholder="Topic Id">
        <input type="text" name="text" placeholder="Text">
        <input type="hidden" name="user" value="<?php echo $_SESSION['username'] ?>">
        <input type="hidden" name="date" value="<?php echo date("Y-m-d") ?>">
        <button>Update</button>
    </form>

</body>
</html>