<?php
    // check if the user is logged in
    require "actions/action_check_user.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application | Add</title>
</head>
<body>
    
    <h1>Add new entity!</h1>
    <hr>
    <form action="actions/action_add_entity.php" method="post">
        <input type="text" name="entity_name" placeholder="name...">
        <input type="text" name="entity_price" placeholder="price...">
        <button>Add</button>
    </form>

</body>
</html>