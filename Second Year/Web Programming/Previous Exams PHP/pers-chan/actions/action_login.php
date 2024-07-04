<?php
    require "config.php";

    // get the user's data
    if (!isset($_POST["username"]) || empty($_POST["username"])) {
        header("Location: ../error.php?error=" . urlencode("Please fill all the fields!"));
        exit();
    }

    $username = $_POST["username"];

    function isUserSubscribedToAnyChannel($conn, $username) {
        $sql = "SELECT * AS count FROM users WHERE user LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        $usernameWildcard = $username;
        mysqli_stmt_bind_param($select_stmt, "s", $usernameWildcard);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $data = mysqli_fetch_assoc($result);
        $count = $data['count'];
        return $count > 0
    }

    if (isUserSubscribedToAnyChannel($conn, $username)) {   
        // set the session and redirect to the home page
        $_SESSION["username"] = $username;
    }
    
    header("Location: ../home.php");
?>