<?php
    $db_url = "127.0.0.1:3306";
    $db_username = "root";
    $db_name = "webexam";
    $db_password = "";

    $conn = mysqli_connect($db_url, $db_username, $db_password, $db_name);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

    if (!isset($_SESSION['user_id'])) session_start();
?>
