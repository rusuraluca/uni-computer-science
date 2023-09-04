<!-- index.php -->

<!DOCTYPE html>
<html>
<head>
    <title>Content Management System</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <?php
    session_start();

    // Check if the user is authenticated
    if (!isset($_SESSION['username'])) {
        header('Location: login.php');
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

    // Check the role of the user
    $userId = $_SESSION['userId'];
    $userRole = $_SESSION['role'];

    if ($userRole == 1) {
        // Content creator page
        ?>

        <h2>Create Content</h2>
        <form method="POST" action="create_content.php">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required><br>
            <label for="content">Content:</label>
            <textarea id="content" name="content" required></textarea><br>
            <input type="submit" value="Create">
        </form>


        <?php
    } elseif ($userRole == 2) {
        // Content reader page
        ?>

        <h2>Recent Content</h2>
        <div id="contentContainer">
            <!-- Content will be displayed here -->
        </div>

        <script>
        $(document).ready(function() {
            // Function to fetch and display content
            function fetchContent() {
                $.ajax({
                    url: 'fetch_content.php',
                    type: 'GET',
                    success: function(response) {
                        $('#contentContainer').html(response);
                    }
                });
            }

            // Function to check for new content
            function checkNewContent() {
                $.ajax({
                    url: 'check_new_content.php',
                    type: 'GET',
                    success: function(response) {
                        if (response === 'true') {
                            alert('New content was added!');
                            fetchContent();
                        }
                    }
                });
            }

            // Fetch and display initial content
            fetchContent();

            // Check for new content every 5 seconds
            setInterval(checkNewContent, 5000);
        });
        </script>
        <?php
    }

    // Close the database connection
    $conn->close();
    ?>
</body>
</html>
