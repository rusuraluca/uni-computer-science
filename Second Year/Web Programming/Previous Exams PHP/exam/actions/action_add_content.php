<?php
    require "config.php"; 

    $entries = $_POST["entries"];
    $user_id = $_POST["user_id"];
    $date = $_POST["date"];
      
    foreach ($entries as $entry) {
        $title = $entry["title"];
        $description = $entry["description"];
        $URL = $entry["URL"];
      
        $sql = "INSERT INTO Content (Date, Title, Description, URL, UserID) VALUES (?, ?, ?, ?, ?)";
        $insert_stmt = mysqli_stmt_init($conn);
      
        mysqli_stmt_prepare($insert_stmt, $sql);
        mysqli_stmt_bind_param($insert_stmt, "ssssi", $date, $title, $description, $URL, $user_id);
        mysqli_stmt_execute($insert_stmt);
    }
    
    header("Location: ../home.php");
    exit();
?>
