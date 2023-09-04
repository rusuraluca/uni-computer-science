<?php
    require "config.php";

    if (!isset($_POST["courseid"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    if (!isset($_POST["name"]) || !isset($_POST["grade"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    } 

    $courseid = $_POST["courseid"];
    $name = $_POST["name"];
    $grade = $_POST["grade"];

    if(empty($courseid) || empty($name) || empty($grade)) {
        header("Location: ../error.php?error=" . urlencode("Please fill in all the fields!"));
        exit();
    }


    ///


    $sql = "SELECT * FROM courses WHERE id = ?";
    $select_stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($select_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    mysqli_stmt_bind_param($select_stmt, "i", $courseid);
    mysqli_stmt_execute($select_stmt);
    $results = mysqli_stmt_get_result($select_stmt);
    $entities = array();
    while ($row = mysqli_fetch_assoc($results)) {
        array_push($entities, $row);
    }
    $grades = $entities[0]['grades'];
    $participants = $entities[0]['participants'];

    if (strpos($grades, $name) !== false) {
        // If the username already exists in grades, replace the grade
        $pattern = "/{$name}\d/";
        $grades = preg_replace($pattern, $name . $grade, $grades);
    } else {
        // If the username doesn't exist in grades, add the username and grade
        $grades .= $name . $grade . ",";
        $participants .= $name . ",";
    }

    

    ///
    

   $sql = "UPDATE courses SET grades = ?, participants = ? WHERE id = ?";
    $update_stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($update_stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    mysqli_stmt_bind_param($update_stmt, "ssi", $grades, $participants, $courseid);
    mysqli_stmt_execute($update_stmt);

    header("Location: ../home.php");
    exit();
?>