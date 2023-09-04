<?php
    require "config.php";

    if (!isset($_POST["entity_id"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    if (!isset($_POST["entity_name"]) || !isset($_POST["entity_price"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    } 

    $entity_id = $_POST["entity_id"];
    $entity_name = $_POST["entity_name"];
    $entity_price = $_POST["entity_price"];

    if (empty($entity_name) || empty($entity_price)) {
        header("Location: ../error.php?error=" . urlencode("Please fill in all the fields!"));
        exit();
    }

    $sql = "UPDATE entities SET entity_name = ?, entity_price = ? WHERE entity_id = ?";
    $update_stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($update_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($update_stmt, "sdi", $entity_name, $entity_price, $entity_id);
    mysqli_stmt_execute($update_stmt);
    header("Location: ../home.php");
?>