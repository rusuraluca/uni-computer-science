let currentPage = 0;

const insertData = (newBody, data) => {
    if (currentPage === 0) {
        $('#previousButton').attr('disabled', true);
    }
    let result = JSON.parse(data);
    let numberOfPages = Math.ceil(result.length/4);
    for (let log of result) {
        let newRow = newBody.insertRow();
        if (result.indexOf(log) >= 4 * currentPage) {
            for (let index of ['id', 'type', 'severity', 'date', 'user', 'logtext']) {
                let newCol = newRow.insertCell();
                let newText = document.createTextNode(log[index]);
                newCol.appendChild(newText);
            }
            newBody.append(newRow);
        }
        if (result.indexOf(log) >= 4 * currentPage + 3) {
            break;
        }
    }
    if (numberOfPages === 0) {
        $('#nextButton').attr('disabled', true);
    } else {
        if (currentPage === numberOfPages - 1) {
            $('#nextButton').attr('disabled', true);
        } else {
            $('#nextButton').attr('disabled', false);
        }
    }
}

const showLogsByUser = () => {
    let body = $('.logTable tbody').eq(0);
    let newBody = document.createElement('tbody');
    $.ajax({
        type: 'GET',
        url: "http://localhost/wp/Lab6-Php,Ajax,JSON/app/db/schema.php",
        data: {action: 'selectLogsByUser'},
        success: (data) => {
            insertData(newBody, data);
        }
    })
    body.replaceWith(newBody);
}

$(document).ready(() => {
    showLogsByUser();
    $('#insertLogButton').click(() => {
        let type = $('#typeField').val();
        let severity = $('#severityField').val();
        let date = $('#dateField').val();
        let log = $('#logField').val();
        if (type.trim().length > 0 && severity.trim().length > 0 && date.trim().length > 0 && log.trim().length > 0) {
            $.ajax({
                type: 'GET',
                url: "http://localhost/wp/Lab6-Php,Ajax,JSON/app/db/schema.php",
                data: {
                    action: 'addLog',
                    logType: type,
                    severity: severity,
                    date: date,
                    log: log
                },
                success: (data) => {
                    let res = JSON.parse(data);
                    if (res === 0) {
                        alert("Log could not be added!");
                    } else {
                        $('.form-control').val("");
                        showLogsByUser();
                    }
                }
            })
        } else {
            alert("Please enter valid data in all fields!");
        }
    })

    $('#previousButton').click(() => {
        if (currentPage > 0) {
            currentPage--;
            if (currentPage === 0) {
                $('#previousButton').attr('disabled', true);
            }
        }
        showLogsByUser();
    })

    $('#nextButton').click(() => {
        $('#previousButton').attr('disabled', false);
        currentPage++;
        showLogsByUser();
    })
})
