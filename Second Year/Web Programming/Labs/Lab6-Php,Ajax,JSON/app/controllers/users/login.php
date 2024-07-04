<?php
header('Cache-Control: no-cache, must-revalidate');

require_once '../../db/schema.php';

session_start();
if (isset($_SESSION['username'])) {
    unset($_SESSION['username']);
}

function checkValidPassword(string $username, string $password): bool {
    $connection = new DBConnection();
    $result = $connection->selectUserByUsername($username);
    if (count($result) == 0) {
        return false;
    } else {
        if ($result[0]["password"] === $password) {
            return true;
        } else {
            return false;
        }
    }
}

if (isset($_POST['loginButton'])) {
    $errors = 0;
    $fields = array("username", "password");
    foreach ($fields as $key => $field) {
        if (!isset($_POST[$field]) && empty($_POST[$field])) {
            $errors++;
        }
    }

    if ($errors <= 0) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        if (checkValidPassword($username, $password)) {
            $_SESSION['username'] = $username;
            header("Location: profile.php");
        } else {
            $_SESSION['login-error'] = "Invalid username and/or password! Try again!";
        }
    } else {
        $_SESSION['login-error'] = "Invalid username and/or password! Try again!";
    }
}

if (isset($_POST['indexPage'])) {
    header('Location: ../../index.html');
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="../../styles/style.css">
        <title>Login</title>
    </head>
    <body>
    <div class="container">
        <h2>Login</h2>
        <form id="login-form" method="post" action="login.php">
            <div class="mb-3 mt-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control" id="username" placeholder="Enter username" name="username">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" class="form-control" id="password" placeholder="Enter password" name="password">
            </div>
            <input type="submit" class="btn btn-primary" name="loginButton" value="Login">
            <input type="submit" class="btn btn-secondary" name="indexPage" value="Cancel">
            <?php
                if (isset($_SESSION['login-error'])) {
                    $error = $_SESSION['login-error'];
                    echo '<script type="text/javascript">';
                    echo 'window.alert("Invalid username and/or password")';
                    echo '</script>';
                }
            ?>
        </form>
    </div>
    </body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</html>

<?php
    unset($_SESSION['login-error']);
?>
