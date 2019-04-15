//global variables
var team = function () {};
var level = function () {};
var member = function () {};
var action = function () { };
var chatsList = ["voltage", "current"]; //Array of strings to search for in chats
var rows = [];
var teams = [];
var attemptedLevels = [];
var classIds = [];
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

//This function takes a JSON file and turns it into row objects
function parseJSON(data) {
    //     var analysisBar = document.getElementById("analysisProgress");
    //     var count = 0;
    //     analysisBar.max = 1;
    //     analysisBar.value;
    // var loading = document.getElementById("loading");
    // loading.style.display = "block";
    for (var i = 0; i < data.length; i++) {
        count = i / (data.length - 1);
        rowObjs = JSON.parse(data[i]);
        var thisTeacher = teachers[i];
        classIds.push(rowObjs[0]["class_id"]);
        teams = makeTeams(rowObjs, thisTeacher); // identify teams and members, actions taken by them
        analyze(rowObjs); // adding actions to the arrays
        // analysisBar.value = count;
        // analysisBar.style.display = "block";

        console.log("parse-file: analysis complete on " + rowObjs[0].id + ", count = " + count + ".");
    }
    //   document.getElementById("analysisProgress").style.display = "none";

    document.getElementById("reportButton").style.display = "inline";
    document.getElementById("filterCynthia").style.display = "inline";
}