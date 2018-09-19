//global variables
var team = function () {};
var level = function () {};
var member = function () {};
var action = function () {};
var rows = [];
var teams = [];
var teachers = [];
var studentDataObjs = [];
var timeZone = -5; //offset for Eastern Standard Time
var vrLabelsArray = ["E", "R0", "R1", "R2", "R3", "sumRs", "sumRsPlusR0", "V0", "V1", "V2", "V3",
    "sumVs", "goalR1", "goalR2", "goalR3", "sumGoalRs", "goalV0", "goalV1", "goalV2", "goalV3", "sumGoalVs",
    "Rtot", "goalRtot", "IA", "ImA", "goalIA", "goalImA", "unknown"
]; //Array of varRef labels (used to label)
var csvActionsArray = [
    ["Teacher", "Date", "Team", "Level", "Time", "Action", "Actor", "Message", "Input", "Result",
        "Old Resistance", "New Resistance", "Dial Position", "Probe Positions", "Measurement type",
        "Measurement Result", "Submit E-Value", "Submit E-Unit", "Submit R0-Value", "Submit R0-Unit"
    ]
]; //col headings for Actions File Download as csv file
var csvSummaryArray = [
    ["Teacher", "Date", "Team", "Level", "Time", "Summary Type", "Actor", "Total Msg Score", "Number Msgs", "Avg Msg Score"]
] // col headings for Summary File Downloads as csv files
var csvFilename;

function parseJSON() {
    rowObjs = JSON.parse(data);
    //findTeams(rowObjs);
    findStudentActions(rowObjs, 166566);
}

function findTeams(rows) {
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row.event == "Joined Group") {
            if (row.event_value == "Tools") {
                console.log("On row " + i + ", " + "student " + row.username.slice(0, 6) + " joined team tools at " + row.time.slice(12, 19) + " on level " + row.parameters.levelName.slice(21, 22));
            }
        }
    }
    console.log("All done!")
}

function findStudentActions(rows, studentID) {
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row.username.slice(0, 6) == studentID && row.event == "Sent message") {
            console.log("On row " + i + " at " +  row.time.slice(12, 19) + " student " + studentID + " said " + row.parameters.message);
        }
        if (row.username.slice(0, 6) == studentID && row.event == "Joined Group") {
            console.log("On row " + i + " at " + row.time.slice(12, 19) + " student " + studentID + " joined team " + row.parameters.groupname + " at level " + row.parameters.levelName.slice(21, 22));
        }
    }
    console.log("All done!");
}

function parseCSV() {
    var filteredTeams = [];
    console.log("parse-file: starting parse");
    teams = []; //Clear the teams array (which might be populated if we haven't
    //refreshed the page).
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
    if (regex.test(fileInput.value)) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onerror = function (err) {
                console.log("Error loading file " + err);
            }
            reader.onloadend = function (e) {

                fileName = fileInput.files[0].name;
                console.log("Loading log file " + fileName + "...");
                var obj = Papa.parse(e.target.result);
                console.log("Log data parsed.");

                //Sort obj by time
                var headerArray = obj.data[0];
                var dataArray = obj.data.slice(1, obj.data.length) //omit the header row when sorting
                dataArray.sort(sortByTime);
                var dataPlusHeaderArray = new Array;
                dataPlusHeaderArray[0] = headerArray;
                for (var ii = 1; ii < dataArray.length + 1; ii++) {
                    dataPlusHeaderArray[ii] = dataArray[ii - 1];
                }

                //Turn the rows into objects
                rowObjs = arrayToObjects(dataPlusHeaderArray);
                console.log(rowObjs.length + " row objects created. Finding teams...");
                teams = makeTeams(rowObjs); // identify teams and members, actions taken by them
                for (var i = 0; i < teams.length; i++) {
                    console.log("Identified " + teams[i].members.length + " members in " + teams[i].name);
                    if (teams[i].members.length == 3) {
                        filteredTeams.push(teams[i]);
                    }
                }
                teams = filteredTeams;
                console.log("After maketeams, out of " + teams.length + " teams found, " + filteredTeams.length + " have the required 3-members");
                changes = analyze(rowObjs); // adding actions to the arrays
                console.log("parse-file: analysis complete");
                setupForm(teams);
                console.log("Form set up completed.");
            }
            reader.readAsText(fileInput.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}