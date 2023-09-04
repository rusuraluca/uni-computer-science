<?php
    require "actions/action_check_user.php";
    require "actions/action_get_all.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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

    <form action="actions/action_logout.php">
        <button type="submit"> Logout </button>
    </form>

    <hr>

    <?php
    if ($_SESSION["role"] == 1) {
    ?>
        <h2>Create Content</h2>

        <hr>

        <button><a href="add_content.php">Add new content</a></button>

        <hr>

        <div id="content">
            <div id="entity-container">
                <?php
                $entities = get_all();
                for ($i = 0; $i < count($entities); $i++) {
                    echo "<div class='entity'>";
                    echo "<p>Title: " . $entities[$i]["Title"] . "</p>";
                    echo "<p>Description: " . $entities[$i]["Description"] . "</p>";
                    echo "<p>URL: " . $entities[$i]["URL"] . "</p>";
                    echo "</div>";
                }
                ?>
            </div>
        </div>

    <?php
    } elseif ($_SESSION["role"] == 2) {
    ?>
        <h2>Content</h2>

        <hr>

        <button id="show_new_content">Show New Content</button>

        <hr>

        <div id="content">
            <div id="entity-container">
                <?php
                $entities = get_all();
                for ($i = 0; $i < count($entities); $i++) {
                    echo "<div class='entity'>";
                    echo "<p>Title: " . $entities[$i]["Title"] . "</p>";
                    echo "<p>Description: " . $entities[$i]["Description"] . "</p>";
                    echo "<p>URL: " . $entities[$i]["URL"] . "</p>";
                    echo "</div>";
                    $_SESSION["lastDisplayedContentID"] = $entities[$i]["ID"];
                }
                ?>
            </div>
        </div>
    <?php
    }
    ?>

    <script>
    $(document).ready(function() {
        $("#show_new_content").click(function() {
            $.ajax({
                url: "actions/fetch_new_content.php",
                type: "POST",
                dataType: "json",
                success: function(response) {
                    if (response.entities.length > 0) {
                        var container = $("#entity-container");
                        var entities = response.entities;
                        entities.forEach(function(entity, index) {
                            // delay execution
                            setTimeout(function() {
                                var newEntity = $("<div>").addClass("entity")
                                    .append("<p>Title:" + entity.title + "</p>")
                                    .append("<p>Description:" + entity.description + "</p>")
                                    .append("<p>URL:" + entity.url + "</p>")
                                    .hide() // display: none
                                    .fadeIn(500); // animation
                                container.prepend(newEntity);
                            }, 500 * index);
                        });
                    } else {
                        console.log("No new content available.");
                    }
                }
            });
        });
    });
    </script>

</body>
</html>
