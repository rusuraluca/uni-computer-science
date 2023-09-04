<?php
    require "config.php";

    $username = $_POST["username"];

    $sql = "SELECT * FROM devs WHERE name = ?";
    $select_stmt = mysqli_stmt_init($conn);
    
    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    mysqli_stmt_bind_param($select_stmt, "s", $username);
    mysqli_stmt_execute($select_stmt);
    $result = mysqli_stmt_get_result($select_stmt);
    $row = mysqli_fetch_assoc($result);
    
    $_SESSION["username"] = $row["name"];
    $_SESSION["user_id"] = $row["id"];
    
    header("Location: ../home.php");
?>