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
    
    <h1>Add new product</h1>
    <hr>
    <form action="actions/action_add_product.php" method="post">
        <input type="text" name="name" placeholder="Name...">
        <input type="text" name="description" placeholder="Description...">
        <button>Add</button>
    </form>

</body>
</html>