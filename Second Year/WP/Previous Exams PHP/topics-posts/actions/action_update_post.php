<?php
    require "config.php";

    // Retrieve the form inputs
    $id = $_POST["id"];
    $topicid = $_POST["topicid"];
    $text = $_POST["text"];
    $user = $_POST["user"];
    $date = $_POST["date"];

    // Update the post in the database
    $sql = "UPDATE posts SET topicid = ?, text = ?, user = ?, date = ? WHERE id = ?";
    $update_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($update_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($update_stmt, "isssi", $topicid, $text, $user, $date, $id);
    mysqli_stmt_execute($update_stmt);

    header("Location: ../home.php");  
?>
