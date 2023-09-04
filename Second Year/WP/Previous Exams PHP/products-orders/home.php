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

    <button><a href="add_product.php">Add a new product</a></button>

    <hr>

    <form action="actions/action_update_filter.php" id="search-field">
        <input type="text" name="filter" placeholder="Filter..." value="<?php echo $filter; ?>">
        <input type="submit" value="Search">
    </form>

    <div id="content">
        <?php
            $entities = get_all_products($filter, $page, $page_size);
            for ($i = 0; $i < count($entities); $i++) {
                echo "<div class='entity'>";
                echo "<p><span> " . $entities[$i]["name"] . "</span></p>";
                echo "<p><span> " . $entities[$i]["description"] . "</span></p>";
                echo "</div>";
            }
        ?>
    </div>

    <hr>

    <h2>Select Product</h2>
    <form action="order.php" method="post">
        <input type="number" name="productid">
        <input type="number" name="quantity">
        <input type="submit" name="add_to_order" value="Add to order">
    </form>

</body>
</html>