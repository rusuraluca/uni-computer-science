<?php
    require "config.php";

    $lastDisplayedContentID = $_SESSION["lastDisplayedContentID"];

    $sql = "SELECT * FROM Content WHERE ID > ?";
    $stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
        exit();
    }

    mysqli_stmt_bind_param($stmt, "i", $lastDisplayedContentID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $newContent = array();
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $newContent[] = array(
                'title' => $row["Title"],
                'description' => $row["Description"],
                'url' => $row["URL"]
            );
            $_SESSION["lastDisplayedContentID"] = $row["ID"];
        }
    }

    $response = array(
        'success' => true,
        'entities' => $newContent
    );

    header('Content-Type: application/json');
    echo json_encode($response);
?>
