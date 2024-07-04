$(() => {
        $(".logout-button").on('click', () => {
            CookieUtil.unset("user", "/", null, null);
            window.location="login.html";
        })
        $.get({
            url: BACKEND_MAIN_URL,
            beforeSend: (xhr) => {
                if(CookieUtil.get("user") == null) {
                    return ;
                }
                xhr.setRequestHeader('Authorization', "Bearer " + CookieUtil.get("user"));
            }
        })
            .done((data, status) => {
                $(".login-status").text(data);
            })
            .fail((jqXHR) => {
                if(jqXHR.status == 401) {
                    window.location = "login.html";
                    return ;
                }
                alert("unknown error");
            })
    }
);