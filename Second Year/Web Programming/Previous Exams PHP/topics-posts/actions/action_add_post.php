<?php
    require "config.php";

    $topic_name = $_POST["topic_name"];
    
    $sql = "SELECT * FROM topics WHERE topicname = ?";
    $select_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($select_stmt, "s", $topic_name);
    mysqli_stmt_execute($select_stmt);
    $result = mysqli_stmt_get_result($select_stmt);
    $row = mysqli_fetch_assoc($result);
    if ($row) {
        $topic_id = $row["id"];
    } else {
        $sql = "INSERT INTO topics (topicname) VALUES (?)";
        $stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($stmt, "s", $topic_name);
        mysqli_stmt_execute($stmt);
        $topic_id = mysqli_insert_id($conn);
    }
    
    $text = $_POST["text"];
    $user = $_POST["user"];
    $date = $_POST["date"];
    
    $sql = "INSERT INTO posts (topicid, text, user, date) VALUES (?, ?, ?, ?)";
    $insert_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($insert_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($insert_stmt, "isss", $topic_id, $text, $user, $date);
    mysqli_stmt_execute($insert_stmt);

    header("Location: ../home.php");  
?>
