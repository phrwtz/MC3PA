function summaryReport() {
    var filterTable = document.getElementById("filterTable"),
        levels;
    filterTable.style.display = "block";
    addGoalsToLevels();
    updateLevels();
}

function updateLevels() {
    var filterTable = $("#filterTable"),
        label,
        numberTutorialLevels = 0,
        numberALevels = 0,
        numberBLevels = 0,
        numberCLevels = 0,
        numberDLevels = 0,
        filteredLevels = [];
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.attempted) {
                label = myLevel.label;
                if ($("#level" + myLevel.label)[0].checked) {
                    filteredLevels.push(myLevel);
                }
                if (label == "A") {
                    numberALevels++;
                } else if (label == "B") {
                    numberBLevels++;
                } else if (label == "C") {
                    numberCLevels++;
                } else if (label == "D") {
                    numberDLevels++;
                }
            }
        }
    }
    document.getElementById("levels#").innerHTML = filteredLevels.length;
    document.getElementById("A#").innerHTML = numberALevels;
    document.getElementById("B#").innerHTML = numberBLevels
    document.getElementById("C#").innerHTML = numberCLevels;
    document.getElementById("D#").innerHTML = numberDLevels;
    updateOutcomes(filteredLevels);
}


function updateOutcomes(levels) {
    var levelsSuccess = 0,
        levelsFailure = 0,
        filteredLevels = []; //So we can run filters without changing the length of the array we're scanning
    if (levels.length > 0) {
        filteredLevels = levels;
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            if (myLevel.success) {
                levelsSuccess++;
                if (!$("#success")[0].checked) {
                    filteredLevels = deleteAndFill(levels[i]);
                }
            } else {
                levelsFailure++
                if (!$("#failure")[0].checked) {
                    filteredLevels = deleteAndFill(levels[i]);
                }
            }
        }
    }
    document.getElementById("outcomes#").innerHTML = levels.length;
    document.getElementById("Success#").innerHTML = levelsSuccess;
    document.getElementById("Failure#").innerHTML = levelsFailure;
    updateVChats(filteredLevels);
}

function updateVChats(levels) {
    var allGoalsChatted = 0,
        someGoalsChatted = 0,
        noGoalsChatted = 0,
        filteredLevels = []; //So we can run filters without changing the length of the array
    if (levels.length > 0) {
        filteredLevels = levels; 
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            switch (myLevel.goalVsChatted) {
                case "all":
                    allGoalsChatted++
                    if (!($("#VAllChat")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                case "some":
                    someGoalsChatted++
                    if (!($("#VSomeChat")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                case "none":
                    noGoalsChatted++
                    if (!($("#VNoChat")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
            }
        }
    }
    document.getElementById("vchats#").innerHTML = levels.length;
    document.getElementById("VAllChatted#").innerHTML = allGoalsChatted;
    document.getElementById("VSomeChatted#").innerHTML = someGoalsChatted;
    document.getElementById("VNotChatted#").innerHTML = noGoalsChatted;
    updateRCalcs(filteredLevels);
}

function updateRCalcs(levels) {
    var allGoalsCalculated = 0,
        someGoalsCalculated = 0,
        noGoalsCalculated = 0,
        filteredLevels = []; //So we can run filters without changing the length of the array
    if (levels.length > 0) {
        filteredLevels = levels;
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            switch (myLevel.goalRsCalculated) {
                case "all":
                    allGoalsCalculated++;
                    if (!($("#RAllCalc")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                    break;
                case "some":
                    someGoalsCalculated++;
                    if (!($("#RSomeCalc")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                    break;
                case "none":
                    noGoalsCalculated++;
                    if (!($("#RNoCalc")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                    break;
            }
        }
    }
    document.getElementById("rcalcs#").innerHTML = levels.length;
    document.getElementById("RAllCalculated#").innerHTML = allGoalsCalculated;
    document.getElementById("RSomeCalculated#").innerHTML = someGoalsCalculated;
    document.getElementById("RNotCalculated#").innerHTML = noGoalsCalculated;
    updateRChats(filteredLevels);
}

function updateRChats(levels) {
    var allGoalsChatted = 0,
        someGoalsChatted = 0,
        noGoalsChatted = 0,
        filteredLevels = []; //So we can run filters without changing the length of the array;
    if (levels.length > 0) {
        filteredLevels = levels;
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            switch (myLevel.goalRsChatted) {
                case "all":
                    allGoalsChatted++;
                    if (!($("#RAllCalc")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                    break;
                case "some":
                    someGoalsChatted++;
                    if ((!$("#RSomeCalc")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                    break;
                case "none":
                    noGoalsChatted++;
                    if (!($("#RNoChat")[0].checked)) {
                        filteredLevels = deleteAndFill(levels[i]);
                    }
                    break;
            }
        }
    }
    document.getElementById("rchats#").innerHTML = levels.length;
    document.getElementById("RAllChatted#").innerHTML = allGoalsChatted;
    document.getElementById("RSomeChatted#").innerHTML = someGoalsChatted;
    document.getElementById("RNotChatted#").innerHTML = noGoalsChatted;
    actionsReport(filteredLevels);
}

function actionsReport(levels) { //list actions on all levels checked by user
    var f = document.getElementById("levels");
    if (levels.length == 0) {
        f.innerHTML = "<br>There are no levels to look at:<br>";
        return;
    }
    if (levels.length == 1) {
        f.innerHTML = "<br>This is the level to look at:<br>";
    } else {
        f.innerHTML = "<br>These are the " + levels.length + " levels to look at:<br><form ";
    }
    for (var i = 0; i < levels.length; i++) {
        myLevel = levels[i];
        myID = myLevel.id;
        idStr = ' id=level-' + myLevel.id
        nameStr = ' name="levelRadioButton" '
        typeStr = ' type="checkbox" '
        f.innerHTML += "Class " + myLevel.team.classId + ", team " + myLevel.team.name + " level " + myLevel.label + '<input ' + typeStr + idStr + nameStr + ' onchange="countChats(levels)">' + "<br>";
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

function countChats(levels) {
    var acts = [],
        chatP = document.getElementById("chatsPara"),
        noInclude = ["the", "a", "an", "of", "is", "at", "to", "is", "in", "and"],
        str = "",
        strFound,
        strArray = [],
        strCountArray = [];
    chatP.innerHTML = "";
    if (levels.length > 0) {
        for (var r = 0, myLevel; myLevel = levels[r]; r++) {
            if ($("#level" + myLevel.id)[0].checked) {
                acts = myLevel.actions;
                for (var i = 0, myAct; myAct = acts[i]; i++) {
                    if (myAct.type == "message") {
                        str += myAct.msg + " ";
                    }
                }
            }
        }
        str2 = str.toLowerCase();
        strArray = str2.split(" ");
        for (var j = 0, myStr; myStr = strArray[j]; j++) {
            strFound = false;
            for (var k = 0; k < strCountArray.length; k++) {
                if (strCountArray[k].string == myStr) {
                    strCountArray[k].count++;
                    strFound = true;
                    break;
                }
            }
            if (!strFound && !noInclude.includes(myStr)) {
                myStrCount = new StrCount;
                myStrCount.string = myStr;
                myStrCount.count = 1;
                strCountArray.push(myStrCount)
            }
        }
        sca = strCountArray.sort(function (a, b) {
            return b.count - a.count
        });
        for (var kk = 0; kk < 10; kk++) {
            chatP.innerHTML += (sca[kk].string + " : " + sca[kk].count + "<br>")
        }
    }
}

function StrCount(string, count) {
    this.string = string;
    this.count = count;
}