function removeLinks() {
    var links = document.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++) {
        var link = links[i];

        if (link.href.startsWith("http://www.scs.ubbcluj.ro")) {
            link.parentNode.removeChild(link);
        }
    }
}
