// Formatting
var zero = function(time, pre){
        var s = time.toString();
        var out;
        if (s.length < 2) {
            if (pre) {
                out = '0' + s;
            } else {
                out = s + '0';
            }
        } else {
            out = s;
        }
        return out;
}
var postZero = function (time) {
    return zero(time, false);
}
var preZero = function (time) {
    return zero(time, true);
}
var day = function (date){
    //only valid in March 2014: partner conf + devsummit
    var days = ['Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th'];
    var index = date % 7;
    return days[index];
}
//compressing data to hash
var encodeSessions = function(list){
    list.sort(function(a,b){return a - b});

    var last = list[0];
    var miniList = [];
    miniList.push(last);
    for (var i = 1; i < list.length; i++) {
        miniList.push(list[i]-last);
        last = list[i];
    };

    var string = miniList.toString();

    var compressed = LZString.compressToBase64(string);
    compressed = encodeURIComponent(compressed);
    return compressed;
}
var decodeSessions = function(hash) {
    var compressed = decodeURIComponent(hash);
    var string = LZString.decompressFromBase64(compressed);
    
    var origList = [];
    var tmpList = JSON.parse("[" + string + "]");
    var previous = 0;
    for (var i = 0; i < tmpList.length; i++ ){
        if (i === 0) {
            origList[i] = tmpList[i] ;
        } else {
            origList[i] = previous + tmpList[i];
        }
        previous = origList[i];
    }
    return origList;

}

// Knockout model
function Program(sessionsView) {
    var self = this;

    self.sessions = ko.observableArray(sessionsView.results);
    self.expandedParagraph = ko.observable(-1);
    self.selectedSessions = [];

    self.saveSession = function() {
        var id = parseInt(this.offeringID);
        var index = self.selectedSessions.indexOf(id);
        if (index == -1){
            self.selectedSessions.push(id);
            self.selectItem(this.offeringID, true);
        } else {
            self.selectedSessions.splice(index, 1);
            self.selectItem(this.offeringID, false);
        }
            var urlparam = encodeSessions(self.selectedSessions);
            window.location.hash = urlparam;
    };

    self.removeSession = function() {
        self.selectedSessions.remove(this);

    };
    self.selectItem = function(offeringID, enable) {
        if (enable) {
            var btn = $('#btn_' + offeringID);
            btn.text('Saved');
            btn.removeClass('notsaved');
            btn.addClass('saved');
            $('#item_' + offeringID).addClass('selected');
        } else {
            var btn = $('#btn_' + offeringID);
            btn.text('Save');
            btn.removeClass('saved');
            btn.addClass('notsaved');
            $('#item_' + offeringID).removeClass('selected');
        }
    };
    self.expand = function(row, event) {
        //var selected = self.selectedSessions.indexOf(parseInt(this.offeringID)) > -1;
            //self.selectItem(this.offeringID, selected);

        if (self.expandedParagraph() !== this.offeringID) {
            var previous = $('#descr_' + self.expandedParagraph());
            var prevItem = $('#item_' + self.expandedParagraph());
            self.expandedParagraph(this.offeringID);
            if (previous.length > 0) {
                var currentItem = $('#item_' + this.offeringID); 
                var list = $('li');
                if (list.index(prevItem) < list.index(currentItem)) {
                    window.scrollBy(0, -previous.height() +40);
                    //currentItem[0].scrollIntoView(false);
                }
            }
        }
    }
    self.opacity = function (row, event) {
        if (row.startHour < 12){
            return 0.4;
        } else if (row.startHour < 16) {
            return 0.7;
        } else {
            return 1;
        }
    }
    

}
var savedSessions = function() {
    if (window.location.hash) {
        var list = decodeSessions(window.location.hash);
        return list;
    }

}
