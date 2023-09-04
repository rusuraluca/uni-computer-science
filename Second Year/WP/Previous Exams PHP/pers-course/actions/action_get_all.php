<?php
    function get_all_courses() {
        require "config.php";

        $sql = "SELECT * FROM courses";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }

        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);

        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }

        return $entities;
    }   


    function get_all_students() {
        require "config.php";

        $sql = "SELECT * FROM personss WHERE role = 'student'";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }

        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);

        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }

        return $entities;
    }   


    function get_student_curses($name) {
        require "config.php";
    
        $sql = "SELECT * FROM courses WHERE participants LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);
    
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        $search_name = "%" . $name . "%";
        mysqli_stmt_bind_param($select_stmt, "s", $search_name);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);
    
        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }
    
        return $entities;
    }


    function get_prof_courses($id) {
        require "config.php";
    
        $sql = "SELECT * FROM courses WHERE professorId = ? ";
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
    
        return $entities;
    }

?>