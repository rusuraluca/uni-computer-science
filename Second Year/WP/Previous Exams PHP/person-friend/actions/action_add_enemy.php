<?php
    require 'config.php';

    $sql = "SELECT * FROM person WHERE user = ?";
    $stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }
    mysqli_stmt_bind_param($stmt, "s", $_SESSION["username"]);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $userRow = mysqli_fetch_assoc($result);
    $userFamilyMembers = explode(',', $userRow["familymembers"]);
    
    if ($userFamilyMembers) {
        $enemy = $_POST["user"];
    
        $enemySql = "SELECT * FROM person WHERE user = ?";
        $enemyStmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($enemyStmt, $enemySql)) {
            header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
            exit();
        }
        mysqli_stmt_bind_param($enemyStmt, "s", $enemy);
        mysqli_stmt_execute($enemyStmt);
        $enemyResult = mysqli_stmt_get_result($enemyStmt);
        $enemyRow = mysqli_fetch_assoc($enemyResult);
    
        if ($enemyRow) {
            $enemyId = $enemyRow["id"];
    
            $deleteSql = "DELETE FROM friend WHERE (friendA = ? AND friendB = ?) OR (friendA = ? AND friendB = ?)";
            $deleteStmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($deleteStmt, $deleteSql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }
            foreach ($userFamilyMembers as $familyMember) {
                mysqli_stmt_bind_param($deleteStmt, "iiii", $familyMember, $enemyId, $enemyId, $familyMember);
                mysqli_stmt_execute($deleteStmt);
            }
            echo "<h3>Enemy added successfully. Common friendship relations deleted.</h3>";
        } else {
            echo "<h3>Enemy not found in the database.</h3>";
        }
    } else {
        echo "<h3>No family members found for the user.</h3>";
    }    
?>