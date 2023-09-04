<?php
    require "config.php";

    if (!isset($_POST["dev_id"]) || !isset($_POST["projects"])) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    $dev_id = $_POST["dev_id"];
    $projects = $_POST["projects"];

    if (empty($dev_id) || empty($projects)) {
        header("Location: ../error.php?error=" . urlencode("Please fill in all the fields!"));
        exit();
    }

    $project_ids = explode(",", $projects);

    foreach ($project_ids as $project_id) {


        $sql = "SELECT members FROM project WHERE id = ?";
        $select_stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($select_stmt, "i", $project_id);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);
        $row = mysqli_fetch_assoc($results);



        if (empty($row)) {
           
            $sql = "INSERT INTO project (id, members) VALUES (?, ?)";
            $insert_stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($insert_stmt, $sql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }
            mysqli_stmt_bind_param($insert_stmt, "is", $project_id, $dev_id);
            mysqli_stmt_execute($insert_stmt);
            
        } else {
            $members = $row["members"];

            if (empty($members)) {
                $members = array();
            } else {
                $members = explode(",", $members);
            }

            if (in_array($dev_id, $members)) {
                header("Location: ../error.php?error=" . urlencode("This developer is already a member of one of the projects!"));
                exit();
            }

            $members[] = $dev_id;

            $members = implode(",", $members);

            $sql = "UPDATE project SET members = ? WHERE id = ?";
            $update_stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($update_stmt, $sql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }
            mysqli_stmt_bind_param($update_stmt, "si", $members, $project_id);
            mysqli_stmt_execute($update_stmt);
        }
    }

    mysqli_close($conn);

    header("Location: ../home.php");
?>
