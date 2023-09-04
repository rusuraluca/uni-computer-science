<?php
    require "actions/action_check_user.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> 
    <title>Add</title>
</head> 

<body>
    <h1>Add new content!</h1>
    <hr>
    <form action="actions/action_add_content.php" method="POST">
        <div id="content-entries">
            <div class="entry">
                <input type="text" name="entries[0][title]" placeholder="Title...">
                <input type="text" name="entries[0][description]" placeholder="Description...">
                <input type="text" name="entries[0][URL]" placeholder="URL...">
            </div>
        </div>
        <input type="hidden" name="user_id" value="<?php echo $_SESSION['user_id'] ?>">
        <input type="hidden" name="date" value="<?php echo date('Y-m-d H:i:s'); ?>">
        <button type="button" id="add-entry-btn">Add Entry</button>
        <button type="submit">Add</button>
    </form>
    
    <script>
        $(document).ready(function() {
            let entryCount = 1;

            $('#add-entry-btn').click(function() {
                const newEntry = `
                    <div class="entry">
                        <input type="text" name="entries[${entryCount}][title]" placeholder="Title...">
                        <input type="text" name="entries[${entryCount}][description]" placeholder="Description...">
                        <input type="text" name="entries[${entryCount}][URL]" placeholder="URL...">
                    </div>
                `;

                $('#content-entries').append(newEntry);
                entryCount++;
            });
        });
    </script>
</body>

</html>