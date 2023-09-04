<?php
    // Retrieve the last stored post ID from the session
    $last_post_id = isset($_SESSION['last_post_id']) ? $_SESSION['last_post_id'] : 0;

    // Query the database to check for new articles
    $new_post_sql = "SELECT * FROM posts WHERE id > ? ORDER BY id DESC";
    $new_post_stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($new_post_stmt, $new_post_sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    mysqli_stmt_bind_param($new_post_stmt, "i", $last_post_id);
    mysqli_stmt_execute($new_post_stmt);
    $new_post_result = mysqli_stmt_get_result($new_post_stmt);

    // Check if new articles exist
    if (mysqli_num_rows($new_post_result) > 0) {
        while ($row = mysqli_fetch_assoc($new_post_result)) {
            // Check if the article user is different from the current user
            if ($row['user'] !== $_SESSION['username']) {
                $notification .= "Post Id: " . $row["id"] . "\n";
                $notification .= "Topic Id: " . $row["topicid"] . "\n";
                $notification .= "User: " . $row["user"] . "\n";
                $notification .= "Text: " . $row["text"] . "\n";
                $notification .= "Date: " . $row["date"] . "\n";
                $notification .= "\n";
            }
        }
        if ($notification != "") {
            echo "<p> New posts added by other users:" . $notification . "</p>";
        }
    }

    // Store the ID of the latest article for future comparisons
    $latest_post_id = mysqli_insert_id($conn);
    $_SESSION['last_post_id'] = $latest_post_id;
?>