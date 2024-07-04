<?php
    $last_auction_id = isset($_SESSION['last_auction_id']) ? $_SESSION['last_auction_id'] : 0;

    // Query the database to check for new articles
    $new_auction_sql = "SELECT * FROM auction WHERE id > ? ORDER BY id DESC";
    $new_auction_stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($new_auction_stmt, $new_auction_sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    mysqli_stmt_bind_param($new_auction_stmt, "i", $last_auction_id);
    mysqli_stmt_execute($new_auction_stmt);
    $new_auction_result = mysqli_stmt_get_result($new_auction_stmt);


    if (mysqli_num_rows($new_auction_result) > 0) {
        while ($row = mysqli_fetch_assoc($new_auction_result)) {
            if ($row['user'] !== $_SESSION['username']) {
                $notification .= "Auction Id: " . $row["id"] . "\n";
                $notification .= "Topic Id: " . $row["categoryid"] . "\n";
                $notification .= "Description: " . $row["description"] . "\n";
                $notification .= "\n";
            }
        }
        if ($notification != "") {
            echo "<p> New auctions added by other users:" . $notification . "</p>";
        }
    }

    $latest_auction_id = mysqli_insert_id($conn);
    $_SESSION['last_auction_id'] = $latest_auction_id;
?>