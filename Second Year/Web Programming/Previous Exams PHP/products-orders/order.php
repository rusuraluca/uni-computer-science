<?php
    session_start(); // Start or resume the session

    require 'actions/config.php';

    if (isset($_POST['add_to_order'])) {
        $productid = $_POST['productid'];
        $quantity = $_POST['quantity'];

        // Create a new entry in the order array
        $_SESSION['order'][] = array(
            'productid' => $productid,
            'quantity' => $quantity
        );
    }

    if (isset($_POST['finalize'])) {
        // Retrieve the values from the session
        $user = $_SESSION['username'];

        // Insert each product in the order into the database
        foreach ($_SESSION['order'] as $orderItem) {
            $productid = $orderItem['productid'];
            $quantity = $orderItem['quantity'];

            // Insert the order into the database
            $sql = "INSERT INTO orders (user, productid, quantity) VALUES (?, ?, ?)";
            $insert_stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($insert_stmt, $sql)) {
                header("Location: ../error.php?error=" . urlencode("There was an error! Please try again later."));
                exit();
            }
            mysqli_stmt_bind_param($insert_stmt, "sii", $user, $productid, $quantity);
            mysqli_stmt_execute($insert_stmt);
        }

        unset($_SESSION['order']);

        echo "Order finalized successfully!";
    } elseif (isset($_POST['cancel'])) {
        unset($_SESSION['order']);

        echo "Order canceled!";
    }
?>


<!DOCTYPE html>
<html>
<head>
  <title>Order</title>
</head>
<body>
    <button><a href="home.php">Back</a></button>
    <h1>Order</h1>
    <?php if (isset($_SESSION['order']) && count($_SESSION['order']) > 0) { ?>
        <?php foreach ($_SESSION['order'] as $orderItem) { ?>
            <p>Product: <?php echo $orderItem['productid']; ?></p>
            <p>Quantity: <?php echo $orderItem['quantity']; ?></p>
            <hr>
        <?php } ?>
        <form action="" method="post">
            <input type="submit" name="finalize" value="Finalize Order">
            <input type="submit" name="cancel" value="Cancel Order">
        </form>
    <?php } else { ?>
        <p>No products selected.</p>
    <?php } ?>
</body>
</html>
