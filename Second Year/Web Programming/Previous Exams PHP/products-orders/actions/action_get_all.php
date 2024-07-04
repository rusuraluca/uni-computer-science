<?php    
    function get_all_products($filter, $page, $page_size) {
        require "config.php";
        $entities = array();

        if (!isset($filter) || empty($filter)) $filter = "%";
        else $filter = "%" . $filter . "%";

        $offset = $page * $page_size;

        $sql = "SELECT * FROM products WHERE name LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        
        $newfilter = '%' . $filter . '%';
        mysqli_stmt_bind_param($select_stmt, "s", $newfilter);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);

        $entities = array();
        while ($row = mysqli_fetch_assoc($results)) {
            array_push($entities, $row);
        }

        return $entities;
    } 
?>
