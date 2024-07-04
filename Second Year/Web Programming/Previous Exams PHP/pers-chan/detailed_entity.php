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
    <title>Application | Detailed entity</title>
</head>
<body>
    <div id="entity">
        <?php
            echo '<h2>' . $entity_name . '</h2>';
            echo '<hr>';
            echo '<h4>' . $entity_price . '$</h4>';
        ?>
    </div>

    <hr><hr>
    <button><a href="update_entity.php?entity_id=<?php echo $entity_id ?>">Update</a></button>
    <br>
    <form action="actions/action_delete_entity.php"  method="get">
        <input type="hidden" name="entity_id" value="<?php echo $entity_id ?>"></input>
        <button>Delete</button>
    </form>
</body>
</html>