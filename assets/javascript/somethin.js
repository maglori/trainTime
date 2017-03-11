// Initialize Firebase
var config = {
	apiKey: "AIzaSyBifUxSFxQqO02cwFPJE7ea1L-X8PHOHxw",
    authDomain: "traintime-bf408.firebaseapp.com",
    databaseURL: "https://traintime-bf408.firebaseio.com",
    storageBucket: "traintime-bf408.appspot.com",
    messagingSenderId: "723045380463"
  };

firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("value", function(snapshot) {
	$("#hottie").empty();
	snapshot.forEach(function(childSnapshot) {

		//convert database child nodes into objects
		var trainObject = JSON.stringify(childSnapshot);
		trainObject = JSON.parse(trainObject);

		var increment = parseInt(trainObject.freq);

		var toHoursMinutes = trainObject.first.split(":");
		var start = moment()
		.hours(toHoursMinutes[0])
		.minutes(toHoursMinutes[1])

		var current = moment(new Date);

		var nextArrival;
		var minutesAway;

		for (var count = 0; count < 1440; count+=increment) {
			var nextTime = start.add(increment, "minutes");
			if (nextTime.diff(current, "minutes") > 0) {
				minutesAway = nextTime.diff(current, "minutes");
				nextArrival = nextTime.calendar();
				break
			}
		}
		
		//generate table row for new/stored train(s)
		var tr = $("<tr>");
		tr.append("<td>" + trainObject.name + "</td>");
		tr.append("<td>" + trainObject.dest + "</td>");
		tr.append("<td>" + trainObject.freq + "</td>");
		tr.append("<td>" + nextArrival + "</td>");
		tr.append("<td>" + minutesAway + " Minutes</td>");
		$("#hottie").append(tr);
	});

}, function(errorObject) {
	console.log("code: " + errorObject)
});

$("#Submit").on("click", function() {

	event.preventDefault();

	if ($("#trainName").val().trim() !== "" &&
		$("#destination").val().trim() !== "" &&
		$("#trainTime").val().trim() !== "" &&
		$("#frequency").val().trim() !== ""
		){
		var name = $("#trainName").val().trim();
		var dest = $("#destination").val().trim();
		var first = $("#trainTime").val().trim();
		var freq = $("#frequency").val().trim();

	
		database.ref().push({
			name: name,
			dest: dest,
			first: first,
			freq: freq
		});
	}

	$("#trainName").val("")
	$("#destination").val("")
	$("#trainTime").val("")
	$("#frequency").val("")

});