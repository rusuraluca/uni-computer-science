<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <?php
    session_start();

    // Check if the user is already authenticated
    if (isset($_SESSION['username'])) {
        header('Location: index.php');
        exit();
    }

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

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Check if the credentials are valid
        $sql = "SELECT * FROM Users WHERE User = '$username' AND Password = '$password'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Authentication successful
            $row = $result->fetch_assoc();
            $_SESSION['username'] = $row['User'];
            $_SESSION['userId'] = $row['ID'];
            $_SESSION['role'] = $row['Role'];

            header('Location: index.php');
            exit();
        } else {
            echo "<p>Invalid username or password.</p>";
        }
    }

    // Close the database connection
    $conn->close();
    ?>

    <h2>Login</h2>
    <form method="POST" action="">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
