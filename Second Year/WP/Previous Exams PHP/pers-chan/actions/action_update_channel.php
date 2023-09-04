<?php
    require "config.php";

    $id = $_GET["id"];
    $action = $_GET["action"];

    $sql = "SELECT * FROM channels WHERE id = ?";
    $select_stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    mysqli_stmt_bind_param($select_stmt, "i", $id);
    mysqli_stmt_execute($select_stmt);
    $results = mysqli_stmt_get_result($select_stmt);
    $entities = array();
    while ($row = mysqli_fetch_assoc($results)) {
        array_push($entities, $row);
    }
    $subscribers = $entities[0]['subscribers'];

    if ($action === "subscribe") {
        $subscribers .= ($_SESSION['username'] . date('Y-m-d') . ',');
    } elseif ($action === "unsubscribe") {
        $subscribers = str_replace($_SESSION['username'] . date('Y-m-d') . ',', '', $subscribers);
    }

    $sql = "UPDATE channels SET subscribers = ? WHERE id = ?";
    $update_stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($update_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    mysqli_stmt_bind_param($update_stmt, "si", $subscribers, $id);
    mysqli_stmt_execute($update_stmt);

    header("Location: ../home.php");
    exit();
?>
