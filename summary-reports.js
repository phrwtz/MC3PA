var filteredLevels = [] //Includes only levels that were attempted.

function summaryReport() {
    var table = makeSummaryReportTable();
    document.body.appendChild(table);
    fillAllLevels(); // to be filled with all attempted levels
    updateLevels(); // update the levels checkboxes
}

function fillAllLevels() {
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.attempted) {
                myLevel.success = setSuccessFlag(myLevel);
                myLevel.goalsChatted = goalVsChatted(myLevel);
                filteredLevels.push(myLevel);
            }
        }
    }
}

function updateLevels() {
    var levelSuccess = [0, 0, 0, 0],
        levelFail = [0, 0, 0, 0],
        t11 = document.getElementById("t11"),
        t21 = document.getElementById("t21"),
        t31 = document.getElementById("t31"),
        t41 = document.getElementById("t41");
    for (var i = 0; i < filteredLevels.length; i++) {
        myLevel = filteredLevels[i];
        index = myLevel.number - 1; // levels start with tutorial
        if (myLevel.success) {
            levelSuccess[index]++;
        } else {
            levelFail[index]++;
        }
    }

        t11.innerHTML = '<input type="checkbox" name="level" id="levelA" onchange="updateOutcomes(); updateGoalsChatted()">A(' + parseInt(levelSuccess[0] + levelFail[0]) + ")";
    
        t21.innerHTML = '<input type="checkbox" name="level" id="levelB" onchange="updateOutcomes(); updateGoalsChatted()">B(' + parseInt(levelSuccess[1] + levelFail[1]) + ")";
    
        t31.innerHTML = '<input type="checkbox" name="level" id="levelC" onchange="updateOutcomes(); updateGoalsChatted()">C(' + parseInt(levelSuccess[2] + levelFail[2]) + ")";
    
        t41.innerHTML = '<input type="checkbox" name="level" id="levelD" onchange="updateOutcomes(); updateGoalsChatted()">D(' + parseInt(levelSuccess[3] + levelFail[3]) + ")";
    
}

function updateOutcomes() {
    var levelsSuccess = 0,
        levelsFailure = 0,
        t12 = document.getElementById("t12"),
        t22 = document.getElementById("t22"),
        myLevel;
    for (var i = 0; i < filteredLevels.length; i++) {
        myLevel = filteredLevels[i];
        if ($("#level" + myLevel.label)[0].checked) {
            (myLevel.success) ? levelsSuccess++ : levelsFailure++;
        }
    }
    t12.innerHTML = '<input type="checkbox" name="success" id="success" onchange="updateGoalsChatted()">Success(' + levelsSuccess + ")";
    t22.innerHTML = '<input type="checkbox" name="failure" id="failure" onchange="updateGoalsChatted()">Failure(' + levelsFailure + ")";
}

function updateGoalsChatted() {
    var goalsChattedLevels = 0,
        noGoalsChattedLevels = 0,
        t13 = document.getElementById("t13"),
        t23 = document.getElementById("t23"),
        myLevel;
    for (var i = 0; i < filteredLevels.length; i++) {
        myLevel = filteredLevels[i];
        if ($("#level" + myLevel.label)[0].checked) {
            if (($("#success")[0]).checked && myLevel.success) {
                (myLevel.goalsChatted) ? goalsChattedLevels++ :
                    noGoalsChattedLevels++;
            }
            if (($("#failure")[0]).checked && !myLevel.success) {
                (myLevel.goalsChatted) ? goalsChattedLevels++ :
                    noGoalsChattedLevels++;
            }
        }
    }

t13.innerHTML = '<input type="checkbox" name="chatted" id="chatted" onchange="actionRepts()">Goal Vs chatted(' + goalsChattedLevels + ")";
t23.innerHTML = '<input type="checkbox" name="notChatted" id="notChatted" onchange="actionRepts()">Not chatted(' + noGoalsChattedLevels + ")";
}

function actionRepts() {};

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