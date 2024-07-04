<?php
    require "config.php";

    $category = $_POST["category"];
    
    $sql = "SELECT * FROM category WHERE name = ?";
    $select_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($select_stmt, "s", $category);
    mysqli_stmt_execute($select_stmt);
    $result = mysqli_stmt_get_result($select_stmt);
    $row = mysqli_fetch_assoc($result);

    if ($row) {
        $category_id = $row["id"];

    } else {
        $sql = "INSERT INTO category (name) VALUES (?)";
        $stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($stmt, "s", $category);
        mysqli_stmt_execute($stmt);
        $category_id = mysqli_insert_id($conn);
    }
    
    $description = $_POST["description"];
    $user = $_POST["user"];
    $date = $_POST["date"];
    
    $sql = "INSERT INTO auction (categoryid, description, user, date) VALUES (?, ?, ?, ?)";
    $insert_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($insert_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($insert_stmt, "isss", $category_id, $description, $user, $date);
    mysqli_stmt_execute($insert_stmt);

    header("Location: ../home.php");  
?>
