function summaryReport() {
    var filterTable = document.getElementById("filterTable");
    filterTable.style.display = "block";
    updateLevels();
    updateOutcomes();
    updateVGoals();
    updateRGoals();
}

function updateLevels() {
    var levels = attemptedLevels(), //Also adds success flag and Vgoals chatted property
        filterTable = $("#filterTable"),
        levelSuccess = [0, 0, 0, 0],
        levelFail = [0, 0, 0, 0];
    for (var i = 0; i < levels.length; i++) {
        myLevel = levels[i];
        index = myLevel.number - 1; // levels start with tutorial so level A is level 1
        if (myLevel.success) {
            levelSuccess[index]++;
        } else {
            levelFail[index]++;
        }
    }
    document.getElementById("A#").innerHTML = parseInt(levelSuccess[0] + levelFail[0]);
    document.getElementById("B#").innerHTML = parseInt(levelSuccess[1] + levelFail[1]);
    document.getElementById("C#").innerHTML = parseInt(levelSuccess[2] + levelFail[2]);
    document.getElementById("D#").innerHTML = parseInt(levelSuccess[3] + levelFail[3]);
    updateOutcomes();
    updateVGoals();
    updateRGoals();
    actionsReport();
}

function updateOutcomes() {
    var levelsSuccess = 0,
        levelsFailure = 0,
        levels = [],
        myLevel;
    levels = attemptedLevels();
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        if ($("#level" + myLevel.label)[0].checked) {
            (myLevel.success) ? levelsSuccess++ : levelsFailure++;
        }
    }
    document.getElementById("Success#").innerHTML = levelsSuccess;
    document.getElementById("Failure#").innerHTML = levelsFailure;
    updateVGoals();
    updateRGoals();
    actionsReport();
}

function updateVGoals() {
    var allGoalsChatted = 0,
        someGoalsChatted = 0,
        noGoalsChatted = 0,
        levels = [];
    levels = attemptedLevels();
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        if ($("#level" + myLevel.label)[0].checked) {
            if (($("#success")[0]).checked) {
                if (myLevel.success) {
                    if (myLevel.goalVsChatted == "all") {
                        allGoalsChatted++
                    }
                    if (myLevel.goalVsChatted == "some") {
                        someGoalsChatted++
                    }
                    if (myLevel.goalVsChatted == "none") {
                        noGoalsChatted++
                    }
                }
            }
            if (($("#failure")[0]).checked) {
                if (!myLevel.success) {
                    if (myLevel.goalVsChatted == "all") {
                        allGoalsChatted++
                    }
                    if (myLevel.goalVsChatted == "some") {
                        someGoalsChatted++
                    }
                    if (myLevel.goalVsChatted == "none") {
                        noGoalsChatted++
                    }
                }
            }
        }
    }
    document.getElementById("VAllChatted#").innerHTML = allGoalsChatted;
    document.getElementById("VSomeChatted#").innerHTML = someGoalsChatted;
    document.getElementById("VNotChatted#").innerHTML = noGoalsChatted;
    updateRGoals();
    actionsReport();
}

function updateRGoals() {
    var allGoalsChatted = 0,
        someGoalsChatted = 0,
        noGoalsChatted = 0,
        allGoalsCalculated = 0,
        someGoalsCalculated = 0,
        noGoalsCalculated = 0,
        levels = attemptedLevels();
    filteredLevels = [];
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        if ($("#level" + myLevel.label)[0].checked) {
            if ((($("#success")[0]).checked) && (myLevel.success)) {
                switch (myLevel.goalVsChatted) {
                    case "all":
                        if (($("#VAllChat")[0].checked)) {
                            switch (myLevel.goalRsChatted) {
                                case "all":
                                    allGoalsChatted++;
                                    if ($("#RAllChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsChatted++;
                                    if ($("#RSomeChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsChatted++;
                                    if ($("#RNotChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            switch (myLevel.goalRsCalculated) {
                                case "all":
                                    allGoalsCalculated++;
                                    if ($("#RAllCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsCalculated++;
                                    if ($("#RSomeCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsCalculated++;
                                    if ($("#RNotCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                        }
                        break;
                    case "some":
                        if (($("#VSomeChat")[0].checked)) {
                            switch (myLevel.goalRsChatted) {
                                case "all":
                                    allGoalsChatted++;
                                    if ($("#RAllChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsChatted++;
                                    if ($("#RSomeChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsChatted++;
                                    if ($("#RNotChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            switch (myLevel.goalRsCalculated) {
                                case "all":
                                    allGoalsCalculated++;
                                    if ($("#RAllCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsCalculated++;
                                    if ($("#RSomeCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsCalculated++;
                                    if ($("#RNotCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                        }
                        break;
                    case "none":
                        if (($("#VNoChat")[0].checked)) {
                            switch (myLevel.goalRsChatted) {
                                case "all":
                                    allGoalsChatted++;
                                    if ($("#RAllChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsChatted++;
                                    if ($("#RSomeChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsChatted++;
                                    if ($("#RNotChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            switch (myLevel.goalRsCalculated) {
                                case "all":
                                    allGoalsCalculated++;
                                    if ($("#RAllCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsCalculated++;
                                    if ($("#RSomeCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsCalculated++;
                                    if ($("#RNotCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                        }
                }
            }
            if ((($("#failure")[0]).checked) && (!myLevel.success)) {
                switch (myLevel.goalVsChatted) {
                    case "all":
                        if (($("#VAllChat")[0].checked)) {
                            switch (myLevel.goalRsChatted) {
                                case "all":
                                    allGoalsChatted++;
                                    if ($("#RAllChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsChatted++;
                                    if ($("#RSomeChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsChatted++;
                                    if ($("#RNotChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            switch (myLevel.goalRsCalculated) {
                                case "all":
                                    allGoalsCalculated++;
                                    if ($("#RAllCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsCalculated++;
                                    if ($("#RSomeCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsCalculated++;
                                    if ($("#RNotCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                        }
                        break;
                    case "some":
                        if (($("#VSomeChat")[0].checked)) {
                            switch (myLevel.goalRsChatted) {
                                case "all":
                                    allGoalsChatted++;
                                    if ($("#RAllChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsChatted++;
                                    if ($("#RSomeChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsChatted++;
                                    if ($("#RNotChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            switch (myLevel.goalRsCalculated) {
                                case "all":
                                    allGoalsCalculated++;
                                    if ($("#RAllCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsCalculated++;
                                    if ($("#RSomeCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsCalculated++;
                                    if ($("#RNotCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            break;
                        }
                    case "none":
                        if (($("#VNoChat")[0].checked)) {
                            switch (myLevel.goalRsChatted) {
                                case "all":
                                    allGoalsChatted++;
                                    if ($("#RAllChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsChatted++;
                                    if ($("#RSomeChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsChatted++;
                                    if ($("#RNotChat")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            switch (myLevel.goalRsCalculated) {
                                case "all":
                                    allGoalsCalculated++;
                                    if ($("#RAllCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "some":
                                    someGoalsCalculated++;
                                    if ($("#RSomeCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                                case "none":
                                    noGoalsCalculated++;
                                    if ($("#RNotCalc")[0].checked) {
                                        filteredLevels.push(myLevel);
                                    }
                                    break;
                            }
                            break;
                        }
                }
            }
        }
    }
    document.getElementById("RAllChatted#").innerHTML = allGoalsChatted;
    document.getElementById("RSomeChatted#").innerHTML = someGoalsChatted;
    document.getElementById("RNotChatted#").innerHTML = noGoalsChatted;
    document.getElementById("RAllCalculated#").innerHTML = allGoalsCalculated;
    document.getElementById("RSomeCalculated#").innerHTML = someGoalsCalculated;
    document.getElementById("RNotCalculated#").innerHTML = noGoalsCalculated;
    actionsReport();
}

function actionsReport() { //list actions on all levels checked by user
    var f = document.getElementById("levels"),
        levelsToLookAt = filteredLevels;
    if (levelsToLookAt.length == 0) {
        f.innerHTML = "<br>There are no levels to look at:<br>";
        return;
    }
    if (levelsToLookAt.length == 1) {
        f.innerHTML = "<br>This is the level to look at:<br>";
    } else {
        f.innerHTML = "<br>These are the " + levelsToLookAt.length + " levels to look at:<br><form ";
    }
    for (var i = 0; i < levelsToLookAt.length; i++) {
        myLevel = levelsToLookAt[i];
        idStr = ' id=level-' + myLevel.id
        nameStr = ' name="levelRadioButton" '
        typeStr = ' type="radio" '
        f.innerHTML += "Class " + myLevel.team.classId + ", team " + myLevel.team.name + " level " + myLevel.label + '<input ' + typeStr + idStr + nameStr + ' onchange="inspect(myLevel)">' + "<br>";
    }
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

// functio

function makeChatsTable(levels) {
    var chatsFound = findChats(levels);
    removeElement("chatsTable"); // So that we don't keep adding to it.
    var chatsTable = document.createElement("table");
    chatsTable.id = "chatsTable";
    summaryDiv.appendChild(chatsTable);
    var headerRow = document.createElement("tr");
    headerRow.style.backgroundColor = "#DDFFDD";
    chatsTable.appendChild(headerRow);
    var chatsCell = document.createElement("th");
    chatsCell.innerHTML = ("Chat searches");
    headerRow.appendChild(chatsCell);
    for (var m = 0, myChat; myChat = chatsList[m]; m++) {
        chatsRow = document.createElement("tr");
        chatsTable.appendChild(chatsRow);
        chatsCell = document.createElement("td");
        chatsCell.innerHTML = ('<input type="checkbox" id= myChat >' + myChat + " (" + chatsFound[myChat].length + ")")
        chatsRow.appendChild(chatsCell);
    }
    return (chatsTable);
}

function removeElement(id) {
    var t = document.getElementById(id);
    if (t) {
        while (t.firstChild) {
            t.removeChild(t.firstChild);
            t.parentNode.removeChild;
        }
    }
}

function findChats(levels) {
    var chatsFound = function () {}; //Will contain all message actions that match a given search message 
    var searchMsg = "",
        msg = "";
    //initialize the chatsFound arrays
    for (var kk = 0; kk < chatsList.length; kk++) {
        chatsFound[chatsList[kk]] = [];
    }
    //then populate them.
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
    return (chatsFound);
}

function countGoalRVarRefs(levels) {
    var grSelfInCalc = 0,
        grOtherInCalc = 0,
        grSelfInChat = 0,
        grOtherInChat = 0;
    for (var i = 1, myLevel; myLevel = levels[i]; i++) {
        myVr1 = myLevel.varRefs["goalR1"];
        myVr2 = myLevel.varRefs["goalR2"];
        myVr3 = myLevel.varRefs["goalR3"];
        if (myVr1.length > 0) {
            myAct = myVr1[0][0];
            if ((myAct.type == "message") && (myAct.board == 0)) {
                grSelfInChat++;
            }
            if ((myAct.type == "calculation") && (myAct.board == 0)) {
                grSelfInCalc++;
            }
            if ((myAct.type == "message") && (myAct.board != 0)) {
                grOtherInChat++;
            }
            if ((myAct.type == "calculation") && (myAct.board != 0)) {
                grOtherInCalc++;
            }
        }
        if (myVr2.length > 0) {
            myAct = myVr2[0][0];
            if ((myAct.type == "message") && (myAct.board == 1)) {
                grSelfInChat++;
            }
            if ((myAct.type == "calculation") && (myAct.board == 1)) {
                grSelfInCalc++;
            }
            if ((myAct.type == "message") && (myAct.board != 1)) {
                grOtherInChat++;
            }
            if ((myAct.type == "calculation") && (myAct.board != 1)) {
                grOtherInCalc++;
            }
        }
        if (myVr3.length > 0) {
            myAct = myVr3[0][0];
            if ((myAct.type == "message") && (myAct.board == 2)) {
                grSelfInChat++;
            }
            if ((myAct.type == "calculation") && (myAct.board == 2)) {
                grSelfInCalc++;
            }
            if ((myAct.type == "message") && (myAct.board != 2)) {
                grOtherInChat++;
            }
            if ((myAct.type == "calculation") && (myAct.board != 2)) {
                grOtherInCalc++;
            }
        }
    }
    document.getElementById("varRefs").innerHTML = "Chatted own goal resistance = " + grSelfInChat + ", used own goal resistance in calculation = " + grSelfInCalc + "<br>Chatted other\'s goal resistance = " + grOtherInChat + ", used other\'s goal resistance in calculation = " + grOtherInCalc;
}

function inspect(level) { //Takes a single level and opens up all its actions
    var acts = level.actions;
    for (var i = 0, myAct; myAct = acts[i]; i++) {
        console.log(myAct.actor);
    }
}