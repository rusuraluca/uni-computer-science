<?php

session_start();

if (!isset($_SESSION['username'])) {
    header('Location: ../users/login.php');
}
if (isset($_POST['viewAllButton'])) {
    header('Location: view_all_logs.php');
}
if (isset($_POST['returnButton'])) {
    header('Location: ../users/profile.php');
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
        <title>Add a log report</title>
    </head>
    <body>
        <div class="container" id="addFormDiv">
            <div class="row">
                <div class="col-sm">
                    <div class="container" id="showLogs">
                        <h3>You have added the following logs:</h3>
                        <table class="logTable table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Severity</th>
                                    <th>Date</th>
                                    <th>Username</th>
                                    <th>Log Message</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <button type="button" id="previousButton" class="btn btn-primary mb-1">Previous</button>
                        <button id="nextButton" type="button" class="btn btn-primary mb-1">Next</button>
                    </div>
                </div>
                <div class="col-sm">
                    <div id="addForm" class="container text-left">
                        <h3>Add a new log:</h3>
                        <div class="mb-1"><label for="typeField" class="form-label">Type: </label><input type="text" id="typeField" class="form-control"></div>
                        <div class="mb-1"><label for="severityField" class="form-label">Severity: </label><input type="text" id="severityField" class="form-control"></div>
                        <div class="mb-1"><label for="dateField" class="form-label">Date: </label><input type="date" id="dateField" class="form-control"></div>
                        <div class="mb-1"><label for="logField" class="form-label">Log Message: </label><input type="text" id="logField" class="form-control"></div>
                        <button id="insertLogButton" type="button" class="btn btn-success mb-1">Add Log</button>
                        <form method="post">
                            <input type="submit" class="btn btn-primary mb-1" name="viewAllButton" value="View all log reports">
                            <input type="submit" class="btn btn-secondary mb-1" name="returnButton" value="Return to profile">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="js/add_log.js"></script>
</html>
