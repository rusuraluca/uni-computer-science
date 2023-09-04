<?php
    // check if the user is logged in
    require "actions/action_check_user.php";

    // get the entity's info
    require "actions/action_get_one.php";
    $entity = get_one();
    $entity_id = $entity['entity_id'];
    $entity_name = $entity['entity_name'];
    $entity_price = $entity['entity_price'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application | Update</title>
</head>
<body>
    
    <h1>Update</h1>
    <hr>
    <form action="actions/action_update_entity.php" method="post">
        <input type="hidden" name="entity_id" value="<?php echo $entity_id ?>">
        <input type="text" name="entity_name" value="<?php echo $entity_name ?>">
        <input type="text" name="entity_price" value="<?php echo $entity_price ?>">
        <button>Update</button>
    </form>

</body>
</html>