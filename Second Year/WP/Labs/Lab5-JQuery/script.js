$(document).ready(function() {
    function sortTable(columnIndex, descending) {
        var table = $('table');
        var rows = $('tbody > tr', table);

        rows.sort(function(a, b) {
            // select the cell within each row at the specified column index and get its text content
            var aValue = $('td:eq(' + columnIndex + ')', a).text();
            var bValue = $('td:eq(' + columnIndex + ')', b).text();

            if (descending) {
                return bValue.localeCompare(aValue);
            } else {
                return aValue.localeCompare(bValue);
            }
        });
        $('tbody', table).empty().append(rows);
    }

    $('th').click(function() {
        var columnIndex = $(this).index();
        var isDescending = $(this).hasClass('descending');

        // remove sorting classes from all other columns
        $('th').removeClass('ascending descending');

        if (isDescending) {
            sortTable(columnIndex, false);
            $(this).removeClass('descending').addClass('ascending');
        } else {
            sortTable(columnIndex, true);
            $(this).removeClass('ascending').addClass('descending');
        }
    });

    // swap columns when footer cell is clicked
    $('tfoot td').click(function() {
        var columnIndex = $(this).index();

        if (columnIndex < 3) {
            var currentColumn = $('tbody td:nth-child(' + (columnIndex + 1) + ')');
            var nextColumn = $('tbody td:nth-child(' + (columnIndex + 2) + ')');

        } else if (columnIndex == 3) {
            var currentColumn = $('tbody td:nth-child(' +  1  + ')');
            var nextColumn = $('tbody td:nth-child(' + 4 + ')');
        }

        currentColumn.each(function(i) {
            var temp = $(this).html();
            $(this).html(nextColumn.eq(i).html());
            nextColumn.eq(i).html(temp);
        });
    });
});
