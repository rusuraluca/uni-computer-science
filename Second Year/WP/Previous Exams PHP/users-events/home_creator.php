<?php
    // check if the user is logged in
    require "actions/action_check_user.php";

    // get the entities
    require "actions/action_get_all.php";

    // get the necessary parameters
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
    $page = !isset($_GET["page"]) ? 0 : $_GET["page"];
    $page_size = !isset($_GET["page_size"]) ? 4 : $_GET["page_size"];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home </title>
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

</body>
</html>
