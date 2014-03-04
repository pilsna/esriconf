// Loading the data
$.ajax({
    url: "../data/devsummit.json",
    dataType: "json",
    success: function(response) {
        var prog = new Program(response.sessionsView);
        ko.applyBindings(prog);
        var sessionList = savedSessions();
        if (sessionList) {
            prog.selectedSessions = sessionList;
            $.each(sessionList, function(index, item){
                prog.selectItem(item, true);
            });
        }
        $("#container").fadeIn(400);
    }
});