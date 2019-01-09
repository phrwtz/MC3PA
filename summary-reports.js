function summaryReport() {
    var table = makeSummaryReportTable();
    document.body.appendChild(table);
    fillLevels();
}

function fillLevels() {
    var levelSuccess = [0, 0, 0, 0],
        levelFail = [0, 0, 0, 0],
        levelNotAttempted = [0, 0, 0, 0];
    var t11 = document.getElementById("t11"),
        t21 = document.getElementById("t21"),
        t31 = document.getElementById("t31"),
        t41 = document.getElementById("t41");
    //  var label = ["A", "B", "C", "D"];
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.attempted) {
                myLevel.success = setSuccessFlag(myLevel);
                if (myLevel.success) {
                    levelSuccess[j]++;
                } else {
                    levelFail[j]++;
                }
            }
        }
    }
    if (levelSuccess[0] || levelFail[0]) {
        t11.innerHTML = '<input type="checkbox" name="level" id="levelA" onchange="updateOutcomes()">A(' + parseInt(levelSuccess[0] + levelFail[0]) + ")";
    }
    if (levelSuccess[1] || levelFail[1]) {
        t21.innerHTML = '<input type="checkbox" name="level" id="levelB" onchange="updateOutcomes()">B(' + parseInt(levelSuccess[1] + levelFail[1]) + ")";
    }
    if (levelSuccess[2] || levelFail[2]) {
        t31.innerHTML = '<input type="checkbox" name="level" id="levelC" onchange="updateOutcomes()">C(' + parseInt(levelSuccess[2] + levelFail[2]) + ")";
    }
    if (levelSuccess[3] || levelFail[3]) {
        t41.innerHTML = '<input type="checkbox" name="level" id="levelD" onchange="updateOutcomes()">D(' + parseInt(levelSuccess[3] + levelFail[3]) + ")";
    }
}
// var levelNotAttempted = [0, 0, 0, 0];
// var levelSuccessTime = [0, 0, 0, 0];
// var levelFailTime = [0, 0, 0, 0];
// var levelSuccessActions = [0, 0, 0, 0];
// var levelSuccessGoalsChatted = [0, 0, 0, 0];
// var levelFailActions = [0, 0, 0, 0];
// var avgLevelSuccessTime = [0, 0, 0, 0];
// var avgLevelSuccessActions = [0, 0, 0, 0];
// var avgLevelFailTime = [0, 0, 0, 0];
// var avgLevelFailActions = [0, 0, 0, 0];
// var levelFailGoalsChatted = [0, 0, 0, 0];
// var label = ["A", "B", "C", "D"];
// var levelTime = 0,
//     avgLevelSuccessMinutes = [0, 0, 0, 0],
//     avgLevelSuccessSeconds = [0, 0, 0, 0];


function makeSummaryReportTable() {
    var summaryTable = document.createElement("table");
    summaryTable.id = "summaryTable";
    var headerRow = document.createElement("tr");
    var levelCell = document.createElement("th");
    var outcomeCell = document.createElement("th");
    var goalsCell = document.createElement("th");
    headerRow.style.backgroundColor = "#DDFFDD";
    levelCell.innerHTML = ("Level");
    outcomeCell.innerHTML = ("Outcome");
    goalsCell.innerHTML = ("Goals chatted?");
    summaryDiv.appendChild(summaryTable);
    summaryTable.appendChild(headerRow);
    headerRow.appendChild(levelCell);
    headerRow.appendChild(outcomeCell);
    headerRow.appendChild(goalsCell);

    var checkboxRow1 = document.createElement("tr");
    var checkboxRow2 = document.createElement("tr");
    var checkboxRow3 = document.createElement("tr");
    var checkboxRow4 = document.createElement("tr");
    var cell11 = document.createElement("td");
    var cell12 = document.createElement("td");
    var cell13 = document.createElement("td");
    var cell21 = document.createElement("td");
    var cell22 = document.createElement("td");
    var cell23 = document.createElement("td");
    var cell31 = document.createElement("td");
    var cell41 = document.createElement("td");
    cell11.id = "t11";
    cell12.id = "t12";
    cell13.id = "t13";
    cell21.id = "t21";
    cell22.id = "t22";
    cell23.id = "t23";
    cell31.id = "t31";
    cell41.id = "t41";
    summaryTable.appendChild(checkboxRow1);
    summaryTable.appendChild(checkboxRow2);
    summaryTable.appendChild(checkboxRow3);
    summaryTable.appendChild(checkboxRow4);
    checkboxRow1.appendChild(cell11);
    checkboxRow1.appendChild(cell12);
    checkboxRow1.appendChild(cell13);
    checkboxRow2.appendChild(cell21);
    checkboxRow2.appendChild(cell22);
    checkboxRow2.appendChild(cell23);
    checkboxRow3.appendChild(cell31);
    checkboxRow4.appendChild(cell41);
    return summaryTable;
}

function updateOutcomes() {
    var allLevelsSuccess = 0,
        allLevelsFail = 0;
    var t12 = document.getElementById("t12"),
        t22 = document.getElementById("t22");
    var myTeam,
        myLevel;
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        if (myTeam.levels[0]) {
            myLevel = myTeam.levels[0];
            if (myLevel && $("#levelA")[0].checked) {
                myLevel.success = setSuccessFlag(myLevel);
                if ((myLevel.attempted) && (myLevel.success)) {
                    allLevelsSuccess++;
                } else if ((myLevel.attempted) && (!myLevel.success)) {
                    allLevelsFail++;
                }
            }
            if (myTeam.levels[1]) {
                myLevel = myTeam.levels[1];
                if (myLevel && $("#levelB")[0].checked) {
                    myLevel.success = setSuccessFlag(myLevel);
                    if ((myLevel.attempted) && (myLevel.success)) {
                        allLevelsSuccess++;
                    } else if ((myLevel.attempted) && (!myLevel.success)) {
                        allLevelsFail++;
                    }
                }
            }
            if (myTeam.levels[2]) {
                myLevel = myTeam.levels[2];
                if (myLevel && $("#levelC")[0].checked) {
                    myLevel.success = setSuccessFlag(myLevel);
                    if ((myLevel.attempted) && (myLevel.success)) {
                        allLevelsSuccess++;
                    } else if ((myLevel.attempted) && (!myLevel.success)) {
                        allLevelsFail++;
                    }
                }
            }
            if (myTeam.levels[3]) {
                myLevel = myTeam.levels[3];
                if (myLevel && $("#levelD")[0].checked) {
                    myLevel.success = setSuccessFlag(myLevel);
                    if ((myLevel.attempted) && (myLevel.success)) {
                        allLevelsSuccess++;
                    } else if ((myLevel.attempted) && (!myLevel.success)) {
                        allLevelsFail++;
                    }
                }
            }
        }
        t12.innerHTML = '<input type="checkbox" name="success" id="success" onchange="updateGoalsChatted()">Success(' + allLevelsSuccess + ")";
        t22.innerHTML = '<input type="checkbox" name="failure" id="failure" onchange="updateGoalsChatted()">Failure(' + allLevelsFail + ")";
    }
}

function updateGoalsChatted() {
    var allLevelsGoalsChatted = 0,
        allLevelsNoGoalsChatted = 0,
        goalsChattedArray = [0, 0]; // Used for returning values
    var t13 = document.getElementById("t13"),
        t23 = document.getElementById("t23");
    var myTeam,
        myLevel;
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];

        if (myTeam.levels[0]) {
            myLevel = myTeam.levels[0];
            myLevel.success = setSuccessFlag(myLevel);
            if (myLevel.attempted && $("#levelA")[0].checked) {
                var goalsChattedArray = computeGoalsChattedData(myLevel);
                allLevelsGoalsChatted += goalsChattedArray[0];
                allLevelsNoGoalsChatted += goalsChattedArray[1];
            }
            if (myTeam.levels[1]) {
                myLevel = myTeam.levels[1];
                myLevel.success = setSuccessFlag(myLevel);
                if (myLevel.attempted && $("#levelB")[0].checked) {
                    var goalsChattedArray = computeGoalsChattedData(myLevel);
                    allLevelsGoalsChatted += goalsChattedArray[0];
                    allLevelsNoGoalsChatted += goalsChattedArray[1];
                }
            }
            if (myTeam.levels[2]) {
                myLevel = myTeam.levels[2];
                myLevel.success = setSuccessFlag(myLevel);
                if (myLevel.attempted && $("#levelC")[0].checked) {
                    var goalsChattedArray = computeGoalsChattedData(myLevel);
                    allLevelsGoalsChatted += goalsChattedArray[0];
                    allLevelsNoGoalsChatted += goalsChattedArray[1];
                }
            }
            if (myTeam.levels[3]) {
                myLevel = myTeam.levels[3];
                myLevel.success = setSuccessFlag(myLevel);
                if (myLevel.attempted && $("#levelD")[0].checked) {
                    var goalsChattedArray = computeGoalsChattedData(myLevel);
                    allLevelsGoalsChatted += goalsChattedArray[0];
                    allLevelsNoGoalsChatted += goalsChattedArray[1];
                }
            }
        }
    }
    t13.innerHTML = '<input type="checkbox" name="chatted" id="chatted">Goal Vs chatted(' + allLevelsGoalsChatted + ")";
    t23.innerHTML = '<input type="checkbox" name="notChatted" id="notChatted">Not chatted(' + allLevelsNoGoalsChatted + ")";
}


function computeGoalsChattedData(myLevel) {
    var goalsChatted = 0,
        noGoalsChatted = 0;
    myLevel.success = setSuccessFlag(myLevel);
    myLevel.goalsChatted = goalVsChatted(myLevel);
    if ($("#success")[0].checked) {
        if (myLevel.success && myLevel.goalsChatted) {
            goalsChatted++;
        } else if (myLevel.success && !myLevel.goalsChatted) {
            noGoalsChatted++;
        }
    }
    if ($("#failure")[0].checked) {
        if (!myLevel.success && myLevel.goalsChatted) {
            goalsChatted++;
        } else if (!myLevel.success && !myLevel.goalsChatted) {
            noGoalsChatted++;
        }
    }
    return [goalsChatted, noGoalsChatted];
}
function goalVsChatted(myLevel) {
    var goalV1Communicated,
        goalV2Communicated,
        goalV3Communicated;
    for (var i = 0; i < myLevel.varRefs["goalV1"].length; i++) {
        if (myLevel.varRefs["goalV1"][i][0].type == "message") {
            goalV1Communicated = true;
            break;
        }
    }
    for (i = 0; i < myLevel.varRefs["goalV2"].length; i++) {
        if (myLevel.varRefs["goalV2"][i][0].type == "message") {
            goalV2Communicated = true;
            break;
        }
    }

    for (i = 0; i < myLevel.varRefs["goalV3"].length; i++) {
        if (myLevel.varRefs["goalV3"][i][0].type == "message") {
            goalV3Communicated = true;
            break;
        }
    }
    return (goalV1Communicated && goalV2Communicated && goalV3Communicated);
}