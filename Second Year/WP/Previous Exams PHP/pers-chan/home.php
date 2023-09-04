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

    <div id="content">
        <?php
            $entities = get_all_persons();
            for ($i = 0; $i < count($entities); $i++) {
                echo "<h2>Channels of " . $entities[$i]["name"] . ":</h2>";
                $channels = get_person_channels($entities[$i]["id"]);
                if(count($channels))
                    for ($j = 0; $j < count($channels); $j++) {
                        echo "<div class='entity'>";
                        echo "<p><span>" . $channels[$j]["name"] . "</span></p>";
                        echo "<p><span>" . $channels[$j]["description"] . "</span></p>";
                        echo "<p><span>" . $channels[$j]["subscribers"] . "</span></p>";
                        echo "</div>";
                    }
                else {
                    echo "<div class='entity'>";
                    echo "<a><span>No channels found!</span></a>";
                    echo "</div>";
                }
            }
        ?>
    </div>

    <hr>

    <div id="content">
        <?php
            echo "<h2>Channels of " . $_SESSION["username"] . ":</h2>";
            $channels =  get_user_channels($_SESSION["username"]);
            for ($i = 0; $i < count($channels); $i++) {
                echo "<div class='entity'>";
                echo "<p><span>" . $channels[$i]["name"] . "</span></p>";
                echo "<p><span>" . $channels[$i]["description"] . "</span></p>";
                echo "</div>";
            }
        ?>
    </div>

    <hr>

    <div id="content">
    <?php
        echo "<h2>Subscribe to channels:</h2>";
        $channels = get_all_channels();
        for ($i = 0; $i < count($channels); $i++) {
            echo "<div class='entity'>";
            echo "<p><span>" . $channels[$i]["name"] . "</span></p>";
            if (strpos($channels[$i]["subscribers"], $_SESSION["username"]) !== false) {
                echo "<a href='actions/action_update_channel.php?id=" . $channels[$i]["id"] . "&action=unsubscribe'>Unsubscribe</a>";
            } else {
                echo "<a href='actions/action_update_channel.php?id=" . $channels[$i]["id"] . "&action=subscribe'>Subscribe</a>";
            }
            echo "</div>";
        }
    ?>
</div>
</body>
</html>
