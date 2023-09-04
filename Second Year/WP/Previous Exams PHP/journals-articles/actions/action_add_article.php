<?php
    require "config.php";

    $journal_name = $_POST["journal_name"];
    
    $sql = "SELECT * FROM journals WHERE name = ?";
    $select_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($select_stmt, "s", $journal_name);
    mysqli_stmt_execute($select_stmt);
    $result = mysqli_stmt_get_result($select_stmt);
    $row = mysqli_fetch_assoc($result);
    if ($row) {
        $journalid = $row["id"];
    } else {
        $sql = "INSERT INTO journals (name) VALUES (?)";
        $stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($stmt, "s", $journal_name);
        mysqli_stmt_execute($stmt);
        $journalid = mysqli_insert_id($conn);
    }
    
    $summary = $_POST["summary"];
    $user = $_POST["user"];
    $date = $_POST["date"];
    
    $sql = "INSERT INTO articles (journalid, summary, user, date) VALUES (?, ?, ?, ?)";
    $insert_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($insert_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($insert_stmt, "isss", $journalid, $summary, $user, $date);
    mysqli_stmt_execute($insert_stmt);


    // Notify the current user about the new article
    $notification = "A new article has been added to the journal: " . $journal_name;
    $_SESSION["notification"] = $notification;

    header("Location: ../home.php");  
?>