<?php
    require "actions/action_check_user.php";

    require "actions/action_get_one.php";
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

    .avatar {
        width: 100px;
        height: 100px;
    }
</style>

<body>
    <?php 
        echo "<h2>Welcome, " . $_SESSION["username"] . "!</h2>";
    ?>
    <hr>

    <div id="content">
        <h3>Profile</h3>

        <?php
            $entity = get_one_person($_SESSION["username"]);
            echo "<div class='entity'>";
            echo "<p><span> User:" . $entity["user"] . "</span></p>";
            echo "<p><span> Name:" . $entity["name"] . "</span></p>";
            echo "<img class='avatar' src=" . $entity['pictureFile'] . " alt='User Photo'><br>";
            $family = get_family($entity["familymembers"]);
            for($i = 0; $i < count($family); $i++) {
                echo "<p><span> Family Member: " . $family[$i]["name"] . "</span></p>";
            }
            echo "</div>";
        ?>
    </div>
    
    <hr>

    <div id="content">
        <h3>Family</h3>
        <?php
            $family = get_my_family($_SESSION["username"]);
            echo "<div class='entity'>";
            for($i = 0; $i < count($family); $i++) {
                echo "<p><span> Family of: " . $family[$i]["name"] . "</span></p>";
            }
            echo "</div>";
        ?>
    </div>

    <hr>

    <div id="content">
        <h3>1st level friends</h3>
        <?php
            $friend1 = get_1st_level($_SESSION["username"]);
            echo "<div class='entity'>";
            for($i = 0; $i < count($friend1); $i++) {
                echo "<p><span> Friend: " . $friend1[$i]["name"] . "</span></p>";
            }
            echo "</div>";
        ?>
    </div>

    <hr>

    <div id="content">
        <h3>2st level friends</h3>
        <?php
            $friend2 = get_2nd_level($_SESSION["username"]);
            echo "<div class='entity'>";
            for($i = 0; $i < count($friend2); $i++) {
                echo "<p><span> Friend: " . $friend2[$i]["name"] . "</span></p>";
            }
            echo "</div>";
        ?>
    </div>

    <hr>

    <div id="content">
        <h3>3rd level friends</h3>
        <?php
            $friend3 = get_3rd_level($_SESSION["username"]);
            echo "<div class='entity'>";
            foreach ($friend3 as $friend) {
                echo "<p><span> Friend: " . $friend["name"] . "</span></p>";
            }
            echo "</div>";
        ?>
    </div>


    <hr>
    
    <div id="content">
        <h2>Add enemy</h2>
        <form action='actions/action_add_enemy.php' method='POST'>
            <input type='text' name='user'>
            <button type='submit'>Add Enemy</button>
        </form>
    </div>

    <hr>
</body>
</html>