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

    // Fetch the most recent 4 content entries from the database
    $sql = "SELECT * FROM Content ORDER BY Date DESC LIMIT 4";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<div>";
            echo "<h3>{$row['Title']}</h3>";
            echo "<p>{$row['Description']}</p>";
            echo "<a href='{$row['URL']}' target='_blank'>View Content</a>";
            echo "<hr>";
            echo "</div>";
        }
    } else {
        echo "<p>No content found.</p>";
    }

    // Close the database connection
    $conn->close();
?>
