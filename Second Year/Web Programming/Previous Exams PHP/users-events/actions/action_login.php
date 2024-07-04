<?php
    require "config.php";

    // get the user's data
    if (!isset($_POST["username"]) || !isset($_POST["password"]) || empty($_POST["username"]) || empty($_POST["password"])) {
        header("Location: ../error.php?error=" . urlencode("Please fill all the fields!"));
        exit();
    }

    $username = $_POST["username"];
    $password = $_POST["password"];

    // check if user exists
    $sql = "SELECT * FROM user WHERE username = ? AND password = ?";
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

    // set the session and redirect to the home page
    $_SESSION["user_id"] = $row["id"];
    $_SESSION["user_role"] = $row["role"];
    $_SESSION["username"] = $row["username"];

    if ($row["role"] === 1) {
        header("Location: ../home_creator.php");
    }
    else {
        header("Location: ../home_consumer.php");
    }
?>
