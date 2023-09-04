<?php
    require "actions/action_check_user.php";
    require "actions/action_get.php";
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
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

<div id="content">
    <h3>All Projects</h3>
    <?php
        $entities = get_all_projects();
        for ($i = 0; $i < count($entities); $i++) {
            echo "<div class='entity'>";
            echo "<p><span>Name:" . $entities[$i]["name"] . "</span></p>";
            echo "<p><span>Members:" . $entities[$i]["members"] . "</span></p>";
            echo "</div>";
        }
    ?>
</div>

<hr>

<div id="content">
    <h3>My Projects</h3>
    <?php
        $entities = get_user_projects($_SESSION["user_id"]);
        for ($i = 0; $i < count($entities); $i++) {
            echo "<div class='entity'>";
            echo "<p><span>Name:" . $entities[$i]["name"] . "</span></p>";
            echo "</div>";
        }
    ?>
</div>

<hr>
<div id="content">
    <h3>Devs</h3>
    <form action="actions/action_update_filter.php" id="search-field">
        <input type="text" name="filter" placeholder="Filter by skill..." value="<?php echo $filter; ?>">
        <input type="submit" value="Search">
    </form>
    <div class='entity'>
        <?php
            $entities = get_all_devs($filter);
            for ($i = 0; $i < count($entities); $i++) {
                echo "<div class='entity'>";
                echo "<p><span>Name:" . $entities[$i]["name"] . "</span></p>";
                echo "<p><span>Skills:" . $entities[$i]["skills"] . "</span></p>";

                echo "<form action='actions/action_add_member.php' method='POST'>";
                    echo "<input type='hidden' name='dev_id' value=" . $entities[$i]["id"] . ">";
                    echo "<input type='text' name='projects' placeholder='Project ids'>";
                    echo "<input type='submit' value='Add to Project'>";
                echo "</form>";
                echo "</div>";
            }
        ?>
    </div>
</div>

</body>

</html>