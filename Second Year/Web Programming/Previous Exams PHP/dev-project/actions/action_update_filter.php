<?php
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
    header("Location: ../home.php?filter=" . $filter);
?>