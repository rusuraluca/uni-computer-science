<?php
    require "config.php";

    if (!isset($_POST["entity_name"]) || !isset($_POST["entity_price"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    } 

    $entity_name = $_POST["entity_name"];
    $entity_price = $_POST["entity_price"];

    if (empty($entity_name) || empty($entity_price)) {
        header("Location: ../error.php?error=" . urlencode("Please fill in all the fields!"));
        exit();
    }

    $sql = "INSERT INTO entities (entity_name, entity_price) VALUES (?, ?)";
    $update_stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($update_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($update_stmt, "sd", $entity_name, $entity_price);
    mysqli_stmt_execute($update_stmt);
    header("Location: ../home.php");
?>