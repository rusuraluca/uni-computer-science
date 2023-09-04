<?php
    require "config.php";
    
    if (!isset($_SESSION['username'])) {
        header("Location: index.php?error=" . urlencode("You are not logged in!"));
        exit();
    }
?>