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
    teams = makeTeams(rowObjs); // identify teams and members, actions taken by them
    console.log("Teams made");;
    changes = analyze(rowObjs); // adding actions to the arrays
    console.log("parse-file: analysis complete");
    setupForm(teams);
    console.log("Form set up completed.");
}