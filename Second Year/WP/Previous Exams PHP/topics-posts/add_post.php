<?php
    // check if the user is logged in
    require "actions/action_check_user.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add</title>
</head>
<body>
    
    <h1>Add new post</h1>
    <hr>
    <form action="actions/action_add_post.php" method="post">
        <input type="text" name="topic_name" placeholder="Topic name">
        <input type="text" name="text" placeholder="Text">
        <input type="hidden" name="user" value="<?php echo $_SESSION['username'] ?>">
        <input type="hidden" name="date" value="<?php echo date("Y-m-d") ?>">
        <button>Add</button>
    </form>

</body>
</html>