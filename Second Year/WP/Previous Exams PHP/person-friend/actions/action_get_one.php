<?php
    function get_one_person($username) {
        require "config.php";
    
        $sql = "SELECT * FROM person WHERE user = ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        
        mysqli_stmt_bind_param($select_stmt, "s", $username);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $row = mysqli_fetch_assoc($result);
        
        return $row;
    }

    function get_family($familymembers) {
        require "config.php";
    
        $sql = "SELECT * FROM person WHERE id IN ($familymembers)";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        return $rows;
    }

    function get_my_family($username) {
        require "config.php";

        $sql = "SELECT * FROM person WHERE user = ?";
        $select_stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($select_stmt, "s", $username);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $row = mysqli_fetch_assoc($result);
        $userid = $row["id"];

        $sql = "SELECT * FROM person WHERE familymembers LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        $new_id = '%' . $userid . '%';
        mysqli_stmt_bind_param($select_stmt, "s", $new_id);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        return $rows;
    }

    function get_1st_level($username) {
        require "config.php";

        // Get the ID of the specified user
        $sql = "SELECT id FROM person WHERE user = ?";
        $select_stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($select_stmt, "s", $username);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $row = mysqli_fetch_assoc($result);
        $userid = $row["id"];
    
        $sql = "SELECT DISTINCT p.* 
                FROM person p
                INNER JOIN friend f 
                    ON (f.friendA = p.id OR f.friendB = p.id)
                WHERE (f.friendA = ? OR f.friendB = ?) AND p.id != ?";
        $select_stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($select_stmt, "iii", $userid, $userid, $userid);
        mysqli_stmt_execute($select_stmt);
        $result = mysqli_stmt_get_result($select_stmt);
        $firstLevelFriends = mysqli_fetch_all($result, MYSQLI_ASSOC);

        return $firstLevelFriends;
    }


    function get_2nd_level($username) {
        require "config.php";
    
        // Get the first level friends of the username
        $firstLevelFriends = get_1st_level($username);
        $firstLevelFriendsIDs = array();
        foreach ($firstLevelFriends as $friend) {
            array_push($firstLevelFriendsIDs, $friend["id"]);
        }
    
        // For each first level friend, get their first level friends
        $secondLevelFriends = array();
        foreach ($firstLevelFriendsIDs as $friendID) {
            $sql = "SELECT DISTINCT p.* 
                    FROM person p
                    INNER JOIN friend f ON (f.friendA = p.id OR f.friendB = p.id)
                    WHERE (f.friendA = ? OR f.friendB = ?) AND p.id != ? AND p.user != ?";
            $select_stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($select_stmt, $sql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }
            mysqli_stmt_bind_param($select_stmt, "iiis", $friendID, $friendID, $friendID, $username);
            mysqli_stmt_execute($select_stmt);
            $result = mysqli_stmt_get_result($select_stmt);
            $secondLevelFriends = array_merge($secondLevelFriends, mysqli_fetch_all($result, MYSQLI_ASSOC));
        }
    
        return $secondLevelFriends;
    }

    function get_3rd_level($username) {
        require "config.php";

        // Get the first level friends of the username
        $firstLevelFriends = get_1st_level($username);
        $firstLevelFriendsIDs = array();
        foreach ($firstLevelFriends as $friend) {
            array_push($firstLevelFriendsIDs, $friend["id"]);
        }

        // Get the first level friends of the username
        $secondLevelFriends = get_2nd_level($username);
        $secondLevelFriendsIDs = array();
        foreach ($secondLevelFriends as $friend) {
            array_push($secondLevelFriendsIDs, $friend["id"]);
        }

        // For each first level friend, get their first level friends
        $thirdLevelFriends = array();
        foreach ($secondLevelFriendsIDs as $friendID) {
            $sql = "SELECT DISTINCT p.* 
                    FROM person p
                    INNER JOIN friend f ON (f.friendA = p.id OR f.friendB = p.id)
                    WHERE (f.friendA = ? OR f.friendB = ?) AND p.id != ? AND p.user != ?";
            $select_stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($select_stmt, $sql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }
            mysqli_stmt_bind_param($select_stmt, "iiis", $friendID, $friendID, $friendID, $username);
            mysqli_stmt_execute($select_stmt);
            $result = mysqli_stmt_get_result($select_stmt);
            $thirdLevelFriends = array_merge($thirdLevelFriends, mysqli_fetch_all($result, MYSQLI_ASSOC));
        }      

        $filteredThirdLevelFriends = array_filter($thirdLevelFriends, function ($friend) use ($firstLevelFriendsIDs) {
            return !in_array($friend["id"], $firstLevelFriendsIDs);
        });

        return $filteredThirdLevelFriends;
    }
?>