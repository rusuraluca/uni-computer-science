<?php
    require "config.php";

    if (!isset($_POST["username"]) || !isset($_POST["password"]) || empty($_POST["username"]) || empty($_POST["password"])) {
        header("Location: ../error.php?error=" . urlencode("Please fill all the fields!"));
        exit();
    }

    $username = $_POST["username"];
    $password = $_POST["password"];

    $sql = "SELECT * FROM Users WHERE User = ? AND Password = ?";
    $select_stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    mysqli_stmt_bind_param($select_stmt, "ss", $username, $password);
    mysqli_stmt_execute($select_stmt);
    $result = mysqli_stmt_get_result($select_stmt);
    $row = mysqli_fetch_assoc($result);

    if (!$row) {
        header("Location: ../error.php?error=" . urlencode("Username and password do not match!"));
        exit();
    }

    $_SESSION["user_id"] = $row["ID"];
    $_SESSION["username"] = $row["User"];
    $_SESSION["role"] = $row["Role"];
    
    header("Location: ../home.php");
?>
