<?php
    function get_one() {
        require "config.php";
        $entity_id = $_GET["entity_id"];

        $sql = "SELECT * FROM entities WHERE entity_id = ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        
        mysqli_stmt_bind_param($select_stmt, "i", $entity_id);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $row = mysqli_fetch_assoc($result);
        
        return $row;
    }
?>