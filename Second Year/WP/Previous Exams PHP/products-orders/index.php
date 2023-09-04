<?php
  require 'actions/config.php';

  if (isset($_SESSION['username'])) {
    header('Location: home.php');
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
</head>
<body>

  <h1>Login</h1>
  
  <?php
    if (isset($_GET["error"])) {
      echo "<h4>Error: " . $_GET["error"] . "</h4>";
    }
  ?>

  <form action="actions/action_login.php" method="post">
    <input type="text" name="username" placeholder="username">
    <input type="submit" value="Login">
  </form>

</body>
</html>

