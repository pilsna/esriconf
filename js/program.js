function Program(sessionsView) {
    var self = this;
    console.log(sessionsView);
    self.sessions = ko.observableArray(sessionsView.results);

    self.saveSession = function(id) {
        //self.savedSessions.push();
    };

    self.removePerson = function() {
        self.sessions.remove(this);
    }
}
$.ajax({
    url: "etc/devsummit.json",
    dataType: "json",
    success: function(response) {
        ko.applyBindings(new Program(response.sessionsView));
    }
});