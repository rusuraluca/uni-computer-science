<?php
    // check if the user is logged in
    require "actions/action_check_user.php";

    // get the entities
    require "actions/action_get_all.php";

    // get the necessary parameters
    $filter = !isset($_GET["filter"]) ? "" : $_GET["filter"];
    $page = !isset($_GET["page"]) ? 0 : $_GET["page"];
    $page_size = !isset($_GET["page_size"]) ? 4 : $_GET["page_size"];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home </title>
</head>

<style>
    .entity {
        border: 1px solid black;
        padding: 10px;
        margin: 10px;
        font-size: 15px;
    }

    .entity:hover {
        background-color: #eee;
        cursor: pointer;
    }
</style>

<body>
    <?php
        echo "<h2>Welcome, " . $_SESSION["username"] . "!";
    ?>

    <hr>

    <div id="content">
        <?php
            $entities = get_all_files($_SESSION["user_id"], $filter, $page, $page_size);
            for ($i = 0; $i < count($entities); $i++) {
                echo "<div class='entity'>";
                echo "<p><span>Name: " . $entities[$i]["filename"] . " </span></p>";
                echo "<p><span>Path:" . $entities[$i]["filepath"] . " </span></p>";
                echo "<p><span>Size:" . $entities[$i]["size"] . " </span></p>";
                echo "</div>";
            }
        ?>
    </div>
    <form action="actions/action_change_page.php" method="get">
        <input type="hidden" name="page" value="<?php echo $page; ?>">
        <input type="hidden" name="page_size" value="<?php echo $page_size; ?>">
        <input type="hidden" name="filter" value="<?php echo $filter; ?>">
        <input type="hidden" name="change" value="-1">
        <button class="button"><< Prev</button>
    </form>

    <form action="actions/action_change_page.php" method="get">
        <input type="hidden" name="page" value="<?php echo $page; ?>">
        <input type="hidden" name="page_size" value="<?php echo $page_size; ?>">
        <input type="hidden" name="filter" value="<?php echo $filter; ?>">
        <input type="hidden" name="change" value="+1">
        <button class="button">Next >></button>
    </form>

    <p id="popularFile"></p>

    <script>
        var filenames = [];
        var mostPopularFile = '';
        
        function countFilenames() {
            var elements = document.querySelectorAll("p:first-child");
            
            for (var i = 0; i < elements.length; i++) {
                var filename = elements[i].innerText.split(": ")[1];
                filenames.push(filename);
            }
        }
        
        function findMostPopularFile() {
            var counts = {};
            var maxCount = 0;
            
            for (var i = 0; i < filenames.length; i++) {
                var count = (counts[filenames[i]] || 0) + 1;
                counts[filenames[i]] = count;
                
                if (count > maxCount) {
                    maxCount = count;
                    mostPopularFile = filenames[i];
                }
            }
            
            console.log('Most popular file: ' + mostPopularFile);
            var popularFileElement = document.getElementById('popularFile');
            popularFileElement.textContent = 'Most Popular File: ' + mostPopularFile;
        }
    
        countFilenames();
        findMostPopularFile();
    </script>
</body>
</html>
