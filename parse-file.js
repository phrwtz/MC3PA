//global variables
var teacher = function () {};
var team = function () {};
var level = function () {};
var member = function () {};
var action = function () {};
var run = function () { }; //Resistor change run
var interrupt = function () { }; //Event in which one member's resistor change coincides with another's resistor change run.
var chatsList = ["voltage", "current"]; //Array of strings to search for in chats
var selectedLevels = []; //Final selected levels array
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
    for (var i = 0; i < data.length; i++) {
        count = i / (data.length - 1);
        rowObjs = JSON.parse(data[data.length - (i + 1)]);
        var thisTeacher = teachers[i];
        classIds.push(rowObjs[0]["class_id"]);
        teams = makeTeams(rowObjs, thisTeacher); // identify teams and members, actions taken by them
        analyze(rowObjs); // adding actions to the arrays
        console.log("parse-file: analysis complete on " + rowObjs[0].id + ", count = " + count + ".");
    }
    for (var i = 0, myTeam; myTeam = teams[i]; i++) {
        for (var j = 0, myLevel; myLevel = myTeam.levels[j]; j++) {
            if (checkValidity(myLevel)) {
                populateTeacherLevelArrays(myLevel);
                checkCynthiaStrategy(myLevel);
                checkGuessAndCheck(myLevel);
                checkBreakCircuitStrategy(myLevel);
                findResistorChangeRuns(myLevel);
            }
            document.getElementById("analyzeButton").style.display = "none";
            document.getElementById("reportButton").style.display = "inline";
        }
    }
}

function populateTeacherLevelArrays(myLevel) {
    myLevel.success = setSuccessFlag(myLevel);
    myLevel.goalVsChatted = goalVsChatted(myLevel);
    myLevel.goalRsChatted = goalRsChatted(myLevel);
    myLevel.goalVsCalculated = goalVsCalculated(myLevel);
    myLevel.goalRsCalculated = goalRsCalculated(myLevel);
    myTeacher = myLevel.team.teacher
    myTeacher.levels.push(myLevel);
}

function checkValidity(myLevel) { //Checks for level attempted and contains three members, each with a different board.
    var returnVal = false;
    if (myLevel.attempted && myLevel.members.length == 3 &&
        (myLevel.members[0].board != myLevel.members[1].board) && (myLevel.members[1].board != myLevel.members[2].board) && (myLevel.members[2].board != myLevel.members[0].board)) {
        return true;
    } else {
        return false;
    }
}
    