let currentPage = 0;
let showType = 'all';

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

const showLogReports = () => {
    let body = $('.logTable tbody').eq(0);
    let newBody = document.createElement('tbody');
    $.ajax({
        type: 'GET',
        url: "http://localhost/wp/Lab6-Php,Ajax,JSON/app/db/schema.php",
        data: {action: 'selectAllLogs'},
        success: (data) => {
            insertData(newBody, data);
        }
    })
    body.replaceWith(newBody);
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

const showLogsBySeverity = (severity) => {
    let body = $('.logTable tbody').eq(0);
    let newBody = document.createElement('tbody');
    $.ajax({
        type: 'GET',
        url: "http://localhost/wp/Lab6-Php,Ajax,JSON/app/db/schema.php",
        data: {action: 'selectLogsBySeverity', severity: severity},
        success: (data) => {
            $('.form-control').val("");
            insertData(newBody, data);
        },
        error: () => {
            alert("The filter field is empty!");
            showType = 'all';
            showCorrectLogs();
        }
    })
    body.replaceWith(newBody);
}

const showLogsByType = (type) => {
    let body = $('.logTable tbody').eq(0);
    let newBody = document.createElement('tbody');
    $.ajax({
        type: 'GET',
        url: "http://localhost/wp/Lab6-Php,Ajax,JSON/app/db/schema.php",
        data: {action: 'selectLogsByType', type: type},
        success: (data) => {
            $('.form-control').val("");
            insertData(newBody, data);
        }
    })
    body.replaceWith(newBody);
}

const showCorrectLogs = () => {
    switch (showType) {
        case 'all':
            showLogReports();
            break;
        case 'user':
            showLogsByUser();
            break;
        case 'severity':
            severity = $('#severityInputFilter').val().trim();
            // if (severity.length > 0)
            //     showLogsBySeverity(severity);
            // else {
            //     showType = 'all';
            //     alert("Input field for severity is empty!");
            // }
            showLogsBySeverity(severity);
            break;
        case 'type':
            type = $('#typeInputFilter').val().trim();
            if (type.length > 0)
                showLogsByType(type);
            else {
                showType = 'all';
                alert("Input field for type is empty!");
            }
            break;
    }
}

$(document).ready(() => {
    showLogReports();

    $('#allLogsButton').click(() => {
        currentPage = 0;
        showType = 'all';
        showCorrectLogs();
    })

    $('#filterByUser').click(() => {
        currentPage = 0;
        showType = 'user';
        showCorrectLogs();
    })

    $('#filterBySeverityButton').click(() => {
        currentPage = 0;
        showType = 'severity';
        showCorrectLogs();
    })

    $('#filterByTypeButton').click(() => {
        currentPage = 0;
        showType = 'type';
        showCorrectLogs();
    })

    $('#previousButton').click(() => {
        if (currentPage > 0) {
            currentPage--;
            if (currentPage === 0) {
                $('#previousButton').attr('disabled', true);
            }
        }
        showCorrectLogs();
    })

    $('#nextButton').click(() => {
        $('#previousButton').attr('disabled', false);
        currentPage++;
        showCorrectLogs();
    })
})
