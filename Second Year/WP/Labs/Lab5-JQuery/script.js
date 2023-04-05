$(document).ready(function() {
    // sort table based on the content of a specific column
    function sortTable(columnIndex, descending) {
        // selects all the table elements on the page
        var table = $('table');
        // selects all the tr elements within the tbody of the table element
        var rows = $('tbody > tr', table);

        // takes a comparison function as a parameter, which is used to determine the order in which the elements should be sorted
        rows.sort(function(a, b) {
            // store the text content of the cells within the a and b rows at the specified column index
            var aValue = $('td:eq(' + columnIndex + ')', a).text();
            var bValue = $('td:eq(' + columnIndex + ')', b).text();

            if (descending) {
                // returns:
                // a negative number if bValue is greater than aValue
                // a positive number if aValue is greater than bValue
                // 0 if they are equal
                return bValue.localeCompare(aValue);
            } else {
                return aValue.localeCompare(bValue);
            }
        });

        // clears the tbody of the table
        // sorted rows are appended to the tbody of the table element
        $('tbody', table).empty().append(rows);
    }

    // add a click event listener to all th elements on the page
    $('th').click(function() {
        var columnIndex = $(this).index(); // the index of the th element that was clicked
        var isAscending = $(this).hasClass('ascending');

        // remove sorting classes from all other columns
        $('th').removeClass('ascending descending');

        if (isAscending) {
            sortTable(columnIndex, true); // indicate that the table should be sorted in descending order
            $(this).removeClass('ascending').addClass('descending');
        } else {
            sortTable(columnIndex, false); // indicate that the table should be sorted in ascending order
            $(this).removeClass('descending').addClass('ascending');
        }
    });

    // add a click event listener to all td elements that are children of the tfoot element
    $('tfoot td').click(function() {
        var columnIndex = $(this).index();

        if (columnIndex < 3) {
            // select the appropriate td elements from the tbody using nth-child() selector
            var currentColumn = $('tbody td:nth-child(' + (columnIndex + 1) + ')'); // jQuery object containing all the td elements
            var nextColumn = $('tbody td:nth-child(' + (columnIndex + 2) + ')');

        } else if (columnIndex == 3) {
            // edge case where the forth column is swapped with the first column
            var currentColumn = $('tbody td:nth-child(' +  1  + ')');
            var nextColumn = $('tbody td:nth-child(' + 4 + ')');
        }

        currentColumn.each(function(i) {
            var temp = $(this).html(); // contents of the current td element are stored in temp
            $(this).html(nextColumn.eq(i).html()); // contents of current td element are replaced with the contents of the corresponding td element in nextColumn
            nextColumn.eq(i).html(temp); // contents of the corresponding td element in nextColumn are replaced with the contents of temp
        });
    });
});
