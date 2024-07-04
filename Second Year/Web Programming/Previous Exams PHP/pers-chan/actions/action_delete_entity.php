<?php
    require "config.php";
    
    if (!isset($_GET["entity_id"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    $entity_id = $_GET["entity_id"];

    $sql = "DELETE FROM entities WHERE entity_id = ?";
    $delete_stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($delete_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    
    mysqli_stmt_bind_param($delete_stmt, "i", $entity_id);
    mysqli_stmt_execute($delete_stmt);
    header("Location: ../home.php");
?>