<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('Location: ../users/login.php');
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
        <title>All user logs</title>
    </head>
    <body>
        <div class="container" id="viewLogsDiv">
            <div class="row">
                <div class="col-sm">
                    <div class="container" id="showLogs">
                        <h3>All the logs that are currently in the system:</h3>
                        <table class="logTable table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Severity</th>
                                    <th>Date</th>
                                    <th>Username</th>
                                    <th>Log</th>
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
                    <div id="buttons" class="container">
                        <h3>Filter logs:</h3>
                        <div id="filterBySeverity" class="mb-1">
                            <label for="severityInputFilter" class="form-label">Severity:</label><input type="text" id="severityInputFilter" class="form-control mb-3">
                            <button id="filterBySeverityButton" type="button" class="btn btn-primary">Filter by severity</button>
                        </div>
                        <div id="filterByType" class="mb-1">
                            <label for="typeInputFilter" class="form-label">Type: </label><input type="text" id="typeInputFilter" class="form-control mb-3">
                            <button id="filterByTypeButton" type="button" class="btn btn-primary mb-3">Filter by type</button>
                        </div>
                    <div>
                        <button id="filterByUser" type="button" class="btn btn-primary mb-1">Show my logs</button>
                        <button id="allLogsButton" type="button" class="btn btn-primary mb-1">Show all logs</button>
                    </div>
                    <div>
                        <form method="post">
                            <input id="returnButton" type="submit" class="btn btn-secondary mb-1" name="returnButton" value="Return to profile">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="js/view_all_logs.js"></script>
</html>
