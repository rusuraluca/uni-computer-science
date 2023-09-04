<?php
    // check if the user is logged in
    require "actions/action_check_user.php";

    // get the entities
    require "actions/action_get_all.php";

    // get the necessary parameters
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
    $page = !isset($_GET["page"]) ? 0 : $_GET["page"];
    $page_size = !isset($_GET["page_size"]) ? 4 : $_GET["page_size"];

    // Retrieve the last stored article ID from the session
    session_start();
    $last_article_id = isset($_SESSION['last_article_id']) ? $_SESSION['last_article_id'] : 0;

    // Query the database to check for new articles
    $new_article_sql = "SELECT * FROM articles WHERE id > ? ORDER BY id DESC";
    $new_article_stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($new_article_stmt, $new_article_sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    mysqli_stmt_bind_param($new_article_stmt, "i", $last_article_id);
    mysqli_stmt_execute($new_article_stmt);
    $new_article_result = mysqli_stmt_get_result($new_article_stmt);

    // Check if new articles exist
    if (mysqli_num_rows($new_article_result) > 0) {
        $notification = "New articles added by other users:\n";

        while ($row = mysqli_fetch_assoc($new_article_result)) {
            // Check if the article user is different from the current user
            if ($row['user'] !== $_SESSION['username']) {
                $notification .= "Journal ID: " . $row["journalid"] . "\n";
                $notification .= "Summary: " . $row["summary"] . "\n";
                $notification .= "User: " . $row["user"] . "\n";
                $notification .= "Date: " . $row["date"] . "\n";
                $notification .= "\n";
            }
        }

        // Display the notification to the current user
        echo "<p>" . $notification . "</p>";
    }

    // Store the ID of the latest article for future comparisons
    $latest_article_id = mysqli_insert_id($conn);
    $_SESSION['last_article_id'] = $latest_article_id;
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

    <?php 
        // Check if there is a notification and display it
        // if (isset($_SESSION["notification"])) {
        //    echo "<p>" . $_SESSION["notification"] . "</p>";
        //    unset($_SESSION["notification"]); // Clear the notification
        // }
    ?>

    <hr>

    <form action="actions/action_update_filter.php" id="search-field">
        <input type="text" name="filter" placeholder="Filter..." value="<?php echo $filter; ?>">
        <input type="hidden" name="page" value="<?php echo $page; ?>">
        <input type="hidden" name="page_size" value="<?php echo $page_size; ?>">
        <input type="submit" value="Search">
    </form>

    <div id="content">
        <?php
            $entities = get_all_articles($filter, $page, $page_size);
            for ($i = 0; $i < count($entities); $i++) {
                echo "<div class='entity'>";
                echo "<p><span> " . $entities[$i]["journalid"] . "</span></p>";
                echo "<p><span> " . $entities[$i]["user"] . "</span></p>";
                echo "<p><span> " . $entities[$i]["summary"] . "</span></p>";
                echo "</div>";
            }
        ?>
    </div>

    <hr>

    <button><a href="add_article.php">Add a new article</a></button>


</body>

</html>