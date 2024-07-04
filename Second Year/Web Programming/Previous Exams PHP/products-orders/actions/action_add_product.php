<?php
    require "config.php";

    $name = $_POST["name"];
    $description = $_POST["description"];
    
    $sql = "INSERT INTO products (name, description) VALUES (?, ?)";
    $insert_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($insert_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($insert_stmt, "ss", $name, $description);
    mysqli_stmt_execute($insert_stmt);

    header("Location: ../home.php");  
?>