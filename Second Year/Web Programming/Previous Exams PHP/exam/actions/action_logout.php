<?php
    require "config.php";

    $_SESSION["user_id"] = $row[""];
    $_SESSION["username"] = $row[""];
    $_SESSION["role"] = $row[""];
    $_SESSION["lastDisplayedContentID"] = $row[""];
    header("Location: ../index.php");
?>