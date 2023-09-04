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
    
    <h1>Add new article</h1>
    <hr>
    <form action="actions/action_add_article.php" method="post">
        <input type="text" name="journal_name" placeholder="Journal name...">
        <input type="text" name="summary" placeholder="Article summary...">
        <input type="hidden" name="user" value="<?php echo $_SESSION['username'] ?>">
        <input type="hidden" name="date" value="<?php echo date("Y-m-d") ?>">
        <button>Add</button>
    </form>

</body>
</html>