<?php
  require 'actions/config.php';

  if (isset($_SESSION['user_id'])) {
    if ($_SESSION["user_role"] === 1) {
      header("Location: home_creator.php");
    }
    else {
        header("Location: home_consumer.php");
    }
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
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <input type="submit" value="Login">
  </form>

</body>
</html>