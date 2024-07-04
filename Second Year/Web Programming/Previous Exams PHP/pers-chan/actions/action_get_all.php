<?php
    function get_all_entities($filter, $page, $page_size) {
        require "config.php";

        // transform the filter to a valid SQL LIKE filter
        if (!isset($filter) || empty($filter)) $filter = "%";
        else $filter = "%" . $filter . "%";

        // calculate the offset
        $offset = $page * $page_size;

        $sql = "SELECT * FROM entities WHERE entity_name LIKE ? LIMIT ? OFFSET ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }

        mysqli_stmt_bind_param($select_stmt, "sii", $filter, $page_size, $offset);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);

        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }

        return $entities;
    }   

    function get_all_persons() {
        require "config.php";
    
        $sql = "SELECT * FROM persons";
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

    function get_person_channels($ownerid) {
        require "config.php";
    
        $sql = "SELECT * FROM channels WHERE ownerid LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);
    
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($select_stmt, "i", $ownerid);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);
    
        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }
    
        return $entities;
    }

    function get_user_channels($username) {
        require "config.php";
    
        $sql = "SELECT * FROM channels WHERE subscribers LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);
    
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        $search_username = "%" . $username . "%";
        mysqli_stmt_bind_param($select_stmt, "s", $search_username);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);
    
        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }
    
        return $entities;
    }


    function get_all_channels() {
        require "config.php";
    
        $sql = "SELECT * FROM channels";
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
?>