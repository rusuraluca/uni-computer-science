<?php    
    function get_all_articles($filter, $page, $page_size) {
        require "config.php";
        $entities = array();

        if (!isset($filter) || empty($filter)) $filter = "%";
        else $filter = "%" . $filter . "%";

        $offset = $page * $page_size;

        $sql = "SELECT * FROM journals WHERE name LIKE ?";
        $select_stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($select_stmt, $sql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }

        mysqli_stmt_bind_param($select_stmt, "s", $filter);
        mysqli_stmt_execute($select_stmt);
        $results = mysqli_stmt_get_result($select_stmt);

        while ($row = mysqli_fetch_assoc($results)) {
            $id = $row["id"];
            $select_articles_stmt = mysqli_stmt_init($conn);
            $articles_sql = "SELECT * FROM articles WHERE user = ? AND journalid = ?";
            
            if (!mysqli_stmt_prepare($select_articles_stmt, $articles_sql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }

            mysqli_stmt_bind_param($select_articles_stmt, "si", $_SESSION["username"], $id);
            mysqli_stmt_execute($select_articles_stmt);
            $articles_results = mysqli_stmt_get_result($select_articles_stmt);

            while ($article_row = mysqli_fetch_assoc($articles_results)) {
                array_push($entities, $article_row);
            }
        }

        return $entities;
    } 
?>
