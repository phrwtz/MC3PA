function summaryReport() {
    if (!document.getElementById("reptTable")) {
        var reptTable = document.createElement(table);
        reptTable.id = "reptTable";
        document.body.appendChild(reptTable);
        var reptRow = document.createElement("tr");
        reptRow.id = "reptRow";
        reptTable.appendChild(reptRow);
    }
    if (!document.getElementById("summaryTable")) {
        var table = makeSummaryReportTable();
        reptRow.appendChild(table);
    }
    filteredLevels = attemptedLevels();
    updateLevels(attemptedLevels());
}

function attemptedLevels() {
    levelsAttempted = [];
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.attempted) {
                myLevel.success = setSuccessFlag(myLevel);
                myLevel.goalsChatted = goalVsChatted(myLevel);
                if (typeof (myLevel.goalsChatted) == "undefined") {
                    console.log("goalsChatted undefined for level " + myLevel.team.name + ", level " + myLevel.label);
                }
                levelsAttempted.push(myLevel);
            }
        }
    }
    return levelsAttempted;
}

function updateLevels(levels) {
    var levelSuccess = [0, 0, 0, 0],
        levelFail = [0, 0, 0, 0],
        t11 = document.getElementById("t11"),
        t21 = document.getElementById("t21"),
        t31 = document.getElementById("t31"),
        t41 = document.getElementById("t41");
    for (var i = 0; i < levels.length; i++) {
        myLevel = levels[i];
        index = myLevel.number - 1; // levels start with tutorial so level A is level 1
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
    //   updateOutcomes(filteredLevels);
    //  updateGoalsChatted(filteredLevels);
}

function updateOutcomes() {
    var levelsSuccess = 0,
        levelsFailure = 0,
        levels = [],
        t12 = document.getElementById("t12"),
        t22 = document.getElementById("t22"),
        myLevel;
    levels = attemptedLevels();
    for (var i = 0; i < levels.length; i++) {
        myLevel = levels[i];
        if ($("#level" + myLevel.label)[0].checked) {
            (myLevel.success) ? levelsSuccess++ : levelsFailure++;
        } else {
            filteredLevels.splice(i, i);
        }
    }
    t12.innerHTML = '<input type="checkbox" name="success" id="success" onchange="updateGoalsChatted()">Success(' + levelsSuccess + ")";
    t22.innerHTML = '<input type="checkbox" name="failure" id="failure" onchange="updateGoalsChatted()">Failure(' + levelsFailure + ")";
}

function updateGoalsChatted() {
    var goalsChattedLevels = 0,
        noGoalsChattedLevels = 0,
        levels = [],
        t13 = document.getElementById("t13"),
        t23 = document.getElementById("t23"),
        myLevel;
    levels = attemptedLevels();
    for (var i = 0; i < levels.length; i++) {
        myLevel = levels[i];
        if ($("#level" + myLevel.label)[0].checked) {
            if (($("#success")[0]).checked) {
                if (myLevel.success) {
                    (myLevel.goalsChatted) ? goalsChattedLevels++ :
                    noGoalsChattedLevels++;
                }
            }
            if (($("#failure")[0]).checked) {
                if (!myLevel.success) {
                    (myLevel.goalsChatted) ? goalsChattedLevels++ :
                    noGoalsChattedLevels++;
                }
            }
        }

        t13.innerHTML = '<input type="checkbox" name="chatted" id="chatted" onchange="SetActionReportsVisibility()">Goal Vs chatted(' + goalsChattedLevels + ")";
        t23.innerHTML = '<input type="checkbox" name="notChatted" id="notChatted" onchange="SetActionReportsVisibility()">Not chatted(' + noGoalsChattedLevels + ")";
    }
}

function SetActionReportsVisibility() {
    var levelsToLookAt = []
    if ($("#chatted")[0].checked || $("#notChatted")[0].checked) {
        $("#SetActionReportsVisibility")[0].style.display = "block";
    } else {
        $("#SetActionReportsVisibility")[0].style.display = "none";
    }
    makeChatsTable(filterLevels());
}

function actionsReport() { //list actions on all levels checked by user
    if (document.getElementById("data")) {
        var p = document.getElementById("data");
    } else {
        var p = document.createElement("paragraph");
        p.id = "data";
        document.body.appendChild(p);
    }
    var levelsToLookAt = filterLevels();
    p.innerHTML = "Here are the " + levelsToLookAt.length + " levels to look at:<br>";
    for (var i = 0; i < levelsToLookAt.length; i++) {
        myLevel = levelsToLookAt[i];
        p.innerHTML += "Class " + myLevel.team.classId + ", team " + myLevel.team.name + " level " + myLevel.label + "<br>";
    }
    return levelsToLookAt;
}

function goalVsChatted(myLevel) {
    var goalV1Communicated = false;
    var goalV2Communicated = false;
    var goalV3Communicated = false;

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

function filterLevels() {
    var filteredLevels = [];
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j]
            if (myLevel.attempted) {
                if ($("#level" + myLevel.label)[0].checked) {
                    if (($("#success")[0]).checked) {
                        if (myLevel.success) {
                            if (($("#chatted")[0]).checked) {
                                if (myLevel.goalsChatted) {
                                    filteredLevels.push(myLevel);
                                }
                            }
                            if (($("#notChatted")[0]).checked) {
                                if (!myLevel.goalsChatted) {
                                    filteredLevels.push(myLevel);
                                }
                            }
                        }
                    }
                    if (($("#failure")[0]).checked) {
                        if (!myLevel.success) {
                            if (($("#chatted")[0]).checked) {
                                if (myLevel.goalsChatted) {
                                    filteredLevels.push(myLevel);
                                }
                            }
                            if ((($("#notChatted")[0]).checked)) {
                                if (!myLevel.goalsChatted) {
                                    filteredLevels.push(myLevel);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return filteredLevels;
}

function makeChatsTable(levels) {
    var chatsFound = function () {}; //Will contain all message actions that match a given search message 
    var chatsList = ["volt", "what"]; //temporary list of search msgs.
    var searchMsg = "",
        msg = "";
    if (document.getElementById("chatsTable")) { //If chatsTable exists, clear it and all its children
        t = document.getElementById("chatsTable");
        t.parentNode.removeChild(t);
    } // and then create one.
    var chatsTable = document.createElement("table");
    chatsTable.id = "chatsTable";
    reptRow.appendChild(chatsTable);
    var headerRow = document.createElement("tr");
    headerRow.style.backgroundColor = "#DDFFDD";
    chatsTable.appendChild(headerRow);
    var chatsCell = document.createElement("th");
    chatsCell.innerHTML = ("Chat searches");
    headerRow.appendChild(chatsCell);
    //initialize the chatsFound arrays
    for (var kk = 0; kk < chatsList.length; kk++) {
        chatsFound[chatsList[kk]] = [];
    }
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        for (j = 0, myAction; myAction = myLevel.actions[j]; j++) {
            if (myAction.type == "message") {
                msg = myAction.msg
                for (var k = 0, searchChat; searchChat = chatsList[k]; k++) {
                    if (!(msg.search(searchChat) == -1)) {
                        chatsFound[searchChat].push(myAction);
                    }
                }
            }
        }
    }
    for (var m = 0, myChat; myChat = chatsList[m]; m++) {
        chatRow = document.createElement("tr");
        chatsTable.appendChild(chatRow);
        chatCell = document.createElement("td");
        chatCell.innerHTML = ('<input type="checkbox" id=' + myChat + '>' + myChat + "(" + chatsFound[myChat].length + ")  " + '<input type="button" style.display="block">Close</input>');
        chatRow.appendChild(chatCell);
    }
    return (chatsTable);
}


function concatenateChats(levels) { //Returns a long string for searching
    var chainedChats = "";
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        for (var j = 0, myAction; myAction = myLevel.actions[j]; j++) {
            if (myAction.type == "message") {
                chainedChats += myAction.msg;
            }
        }
    }
    return chainedChats;
}

function findMsg(actions) { //Finds the first action of type "message"
    for (var i = 0; i < actions.length; i++) {
        if (actions[i].type == 'message') {
            alert("i = " + i);
            break;
        }
    }
}

function countOccurrences(searchStr, str) {
    var count = 0;
    var testStr = str;
    var pos = -1;
    var len = searchStr.length;
    pos = testStr.indexOf(searchStr);
    if (!(pos == -1)) {
        count++;
        testStr = testStr.slice(pos + len);
        count = count + countOccurrences(searchStr, testStr);
    }
    return count;
}