<?php
    function get_number_of_files($filter) {
        require "config.php";

        if (empty($filter)) $filter = "%";
        else $filter = "%" . $filter . "%";

        $sql = "SELECT * FROM files WHERE filename LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        
        mysqli_stmt_bind_param($select_stmt, "s", $filter);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);
        return mysqli_num_rows($results);
    }
?>