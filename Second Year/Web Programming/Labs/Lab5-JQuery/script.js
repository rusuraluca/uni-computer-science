$(document).ready(function() {
    function sortTable(columnIndex, mustSort) {
        var table = $('table');
        var rows = $('tbody > tr', table);

        rows.sort(function(a, b) {
            var aValue = $('td:eq(' + columnIndex + ')', a).text();
            var bValue = $('td:eq(' + columnIndex + ')', b).text();

            if (mustSort) {
                return bValue.localeCompare(aValue);
            } else {
                return aValue.localeCompare(bValue);
            }
        });

        $('tbody', table).empty().append(rows);
    }

    // click event listener to all th elements on the page
    $('th').click(function() {
        var columnIndex = $(this).index();
        var isAscending = $(this).hasClass('ascending');


        $('th').removeClass('ascending descending');

        if (isAscending) {
            sortTable(columnIndex, true);
            $(this).removeClass('ascending').addClass('descending');
        } else {
            sortTable(columnIndex, false);
            $(this).removeClass('descending').addClass('ascending');
        }
    });

    // click event listener to all td elements that are children of the tfoot element
    $('tfoot td').click(function() {
        var columnIndex = $(this).index();

        if (columnIndex < 3) {
            var currentColumn = $('tbody td:nth-child(' + (columnIndex + 1) + ')');
            var nextColumn = $('tbody td:nth-child(' + (columnIndex + 2) + ')');

        } else if (columnIndex == 3) {
            // edge case where the forth column is swapped with the first column
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
