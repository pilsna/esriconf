// Loading the data
$.ajax({
    url: "../data/partnerconf.json",
    dataType: "json",
    success: function(response) {
        var prog = new Program(response.sessionsView);
        ko.applyBindings(prog);
        var sessionList = savedSessions();
        if (sessionList) {
            prog.selectedSessions = sessionList;
        }
        $("#container").fadeIn(400);
    }
});