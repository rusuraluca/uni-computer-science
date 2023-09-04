<?php
    // check if the user is logged in
    require "actions/action_check_user.php";

    // get the entities
    require "actions/action_get_all.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>

<style>
    .entity {
        border: 1px solid black;
        padding: 10px;
        margin: 10px;
    }

    .entity:hover {
        background-color: #eee;
        cursor: pointer;
    }
</style>

<body>
    <?php 
        echo "<h2>Welcome, " . $_SESSION["username"] . "!</h2>";
    ?>

    <hr>

    <div id="content">
        <?php
            $courses = get_all_courses();
            for ($i = 0; $i < count($courses); $i++) {
                echo "<h2>Students of " . $courses[$i]["coursename"] . ":</h2>";
                if($courses[$i]["participants"]) {
                    echo "<div class='entity'>";
                    echo "<p><span>" . $courses[$i]["participants"] . "</span></p>";
                    echo "</div>";
                } else {
                    echo "<div class='entity'>";
                    echo "<a><span>No  students enrolled!</span></a>";
                    echo "</div>";
                }
            }
        ?>
    </div>

    <hr>

    <div id="content">
        <?php
            $entities = get_all_students();
            for ($i = 0; $i < count($entities); $i++) {
                echo "<h2>Courses of " . $entities[$i]["name"] . ":</h2>";
                $courses = get_student_curses($entities[$i]["name"]);
                if(count($courses))
                    for ($j = 0; $j < count($courses); $j++) {
                        echo "<div class='entity'>";
                        echo "<p><span>" . $courses[$j]["coursename"] . "</span></p>";
                        echo "</div>";
                    }
                else {
                    echo "<div class='entity'>";
                    echo "<a><span>No courses found!</span></a>";
                    echo "</div>";
                }
            }
        ?>
    </div>

    <hr>

    <div id="content">
        <?php
            echo "<h2>Your courses students and grades:</h2>";
            $courses =  get_prof_courses($_SESSION["id"]);
            for ($i = 0; $i < count($courses); $i++) {
                echo "<h4>Course" . $courses[$i]["coursename"] . "</h2>";
                echo "<div class='entity'>";
                echo "<p><span>" . $courses[$i]["grades"] . "</span></p>";
                echo "</div>";
            }

        ?>

        <button><a href="update_grade.php">Manage grades</a></button>

    </div>


</body>

</html>