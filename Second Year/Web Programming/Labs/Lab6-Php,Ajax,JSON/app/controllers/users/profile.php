<?php

session_start();

if (isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
} else {
    header('Location: login.php');
    die();
}

if (isset($_POST['logoutButton'])){
    session_unset();
    session_destroy();
    header('Location: login.php');
}

if (isset($_POST['viewAllButton'])) {
    header('Location: ../logs/view_all_logs.php');
}

if(isset($_POST['addLogButton'])) {
    header('Location: ../logs/add_log.php');
}

if(isset($_POST['removeLogButton'])) {
    header('Location: ../logs/remove_log.php');
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
        <title>User page</title>
    </head>
    <body>
        <div class="container text-center">
            <h3>Welcome, <?php echo $username;?>!</h3>
            <form method="post">
                <input type="submit" class="btn btn-primary" name="viewAllButton" value="View all log reports">
                <input type="submit" class="btn btn-success" name="addLogButton" value="Add a log report">
                <input type="submit" class="btn btn-danger" name="removeLogButton" value="Remove a log report">
                <input type="submit" class="btn btn-dark" name="logoutButton" value="Log out">
            </form>
        </div>
    </body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</html>
