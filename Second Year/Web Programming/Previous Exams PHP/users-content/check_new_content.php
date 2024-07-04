<?php
    // Database connection details
    $host = '127.0.0.1:3306';
    $username = 'root';
    $password = '';
    $database = 'prep2';

    // Connect to the database
    $conn = new mysqli($host, $username, $password, $database);
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Get the ID of the most recent content entry
    $sql = "SELECT MAX(ID) AS MaxID FROM Content";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $maxId = $row['MaxID'];

    // Check if the current maximum ID is different from the stored maximum ID
    if ($maxId !== $_SESSION['maxId']) {
        $_SESSION['maxId'] = $maxId;
        echo 'true';
    } else {
        echo 'false';
    }

    // Close the database connection
    $conn->close();
?>
