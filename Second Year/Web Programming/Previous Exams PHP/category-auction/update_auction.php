<?php
    // check if the user is logged in
    require "actions/action_check_user.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update</title>
</head>
<body>
    
    <h1>Update auction</h1>
    <hr>
    <form action="actions/action_update_auction.php" method="post">
        <input type="number" name="id" placeholder="Auction id">
        <input type="text" name="description" placeholder="Description">
        <input type="hidden" name="user" value="<?php echo $_SESSION['username'] ?>">
        <input type="hidden" name="date" value="<?php echo date("Y-m-d") ?>">
        <button>Update</button>
    </form>

</body>
</html>