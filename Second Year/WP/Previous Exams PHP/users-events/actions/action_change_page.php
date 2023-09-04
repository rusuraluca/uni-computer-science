<?php
    require 'action_get_number_of_entities.php';  

    // get the necessary parameters
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
    $page = !isset($_GET["page"]) ? 0 : $_GET["page"];
    $page_size = !isset($_GET["page_size"]) ? 4 : $_GET["page_size"];
    $change = isset($_GET["change"]) ? $_GET["change"] : 0;

    $number_of_entities = get_number_of_entities($filter);
    $page += $change;
    if ($page < 0) $page++;
    if ($page >= $number_of_entities / $page_size) $page--;

    header("Location: ../home.php?page=" . $page . "&page_size=" . $page_size . "&filter=" . $filter);
?>