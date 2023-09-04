<?php
    function get_all_files($user_id, $filter, $page, $page_size) {
        require "config.php";

        if (!isset($filter) || empty($filter)) $filter = "%";
        else $filter = "%" . $filter . "%";

        $offset = $page * $page_size;

        $sql = "SELECT * FROM files WHERE userid = ? AND filename LIKE ? LIMIT ? OFFSET ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }

        mysqli_stmt_bind_param($select_stmt, "isii", $user_id, $filter, $page_size, $offset);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);

        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }

        return $entities;
    }   
?>