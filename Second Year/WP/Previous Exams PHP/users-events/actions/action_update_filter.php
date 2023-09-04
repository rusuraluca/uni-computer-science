<?php
    // get the necessary parameters
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
    $page = 0;
    $page_size = !isset($_GET["page_size"]) ? 4 : $_GET["page_size"];
   
    header("Location: ../home.php?page=" . $page . "&page_size=" . $page_size . "&filter=" . $filter);
?>