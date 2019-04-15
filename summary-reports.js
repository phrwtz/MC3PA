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
    for (var i = 0; i < attemptedLevels.length; i++) {
        myLevel = attemptedLevels[i];
        label = myLevel.label;
        if ($("#level" + label)[0].checked) {
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
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            if (myLevel.success) {
                levelsSuccess++;
                if ($("#success")[0].checked) {
                    filteredLevels.push(myLevel);
                }
            } else {
                levelsFailure++
                if ($("#failure")[0].checked) {
                    filteredLevels.push(myLevel);
                }
            }
        }
    }
    document.getElementById("outcomes#").innerHTML = filteredLevels.length;
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
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            switch (myLevel.goalVsChatted) {
                case "all":
                    allGoalsChatted++
                    if (($("#VAllChat")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
                case "some":
                    someGoalsChatted++
                    if (($("#VSomeChat")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
                case "none":
                    noGoalsChatted++
                    if (($("#VNoChat")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
            }
        }
    }
    document.getElementById("vchats#").innerHTML = filteredLevels.length;
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
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            switch (myLevel.goalRsCalculated) {
                case "all":
                    allGoalsCalculated++;
                    if (($("#RAllCalc")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
                case "some":
                    someGoalsCalculated++;
                    if (($("#RSomeCalc")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
                case "none":
                    noGoalsCalculated++;
                    if (($("#RNoCalc")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
            }
        }
    }
    document.getElementById("rcalcs#").innerHTML = filteredLevels.length;
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
        for (var i = 0, myLevel; myLevel = levels[i]; i++) {
            switch (myLevel.goalRsChatted) {
                case "all":
                    allGoalsChatted++;
                    if (($("#RAllChat")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
                case "some":
                    someGoalsChatted++;
                    if (($("#RSomeChat")[0].checked)) {
                        filteredLevels.push(myLevel);
                    }
                    break;
                case "none":
                    noGoalsChatted++;
                    if (($("#RNoChat")[0].checked)) {
                        filteredLevels.push(myLevel);
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

function actionsReport(filteredLevels) { //generates a radio button for each level in filteredLevels
    var f = document.getElementById("levelsPara");
    var c = document.getElementById("chatsPara");
    var selectedLevel = findSelectedLevel();
    var myLevel;
    if (filteredLevels.length == 0) {
        f.innerHTML = "<br>There are no levels to look at.<br>";
        c.innerHTML = "";
        return;
    }
    if (filteredLevels.length == 1) {
        f.innerHTML = "<br>This is the level to look at:<br>";
        c.innerHTML = "";
    } else {
        f.innerHTML = "<br>These are the " + filteredLevels.length + " levels to look at:<br>";
        c.innerHTML = "";
    }
    for (var i = 0; i < filteredLevels.length; i++) {
        var checkTable = document.getElementById("checkTable");
        myLevel = filteredLevels[i];
        f.innerHTML += ("Class " + myLevel.team.classId + ", team " + myLevel.team.name + " level " + myLevel.label + '<input type="radio" id=' + myLevel.id + ' name="levelRadio" onchange=setupActionsForm();reportResults()></input>' + "<br>")
    }
    countChats(filteredLevels);
}

function countChats(filteredLevels) {
    var acts = [],
        chatP = document.getElementById("chatsPara"),
        noInclude = ["the", "a", "an", "of", "is", "at", "to", "is", "in", "and", "i", "im", "my", "it", "so", "ok"],
        str = "",
        strFound,
        strArray = [],
        strCountArray = [],
        sca = [],
        weightedstrs, //sum of unique strings times their frequency
        limit,
        strMsg = "",
        noIncludeStrs = 0,
        strFound = false;
    //chatP.style.display = "inline";
    chatP.innerHTML = "";
    if (filteredLevels.length == 1) {
        strMsg = "<br>Most frequent strings for this level:<br>"
    }
    if (filteredLevels.length > 1) {
        strMsg = "<br>Most frequent strings for these " + filteredLevels.length + " levels:<br>";
    }
    if (filteredLevels.length > 0) {
        for (var r = 0, myLevel; myLevel = filteredLevels[r]; r++) {
            chatP.innerHTML = strMsg;
            acts = myLevel.actions;
            for (var i = 0, myAct; myAct = acts[i]; i++) {
                if (myAct.type == "message") {
                    str += myAct.msg + " ";
                }
            }
        }
        str2 = str.toLowerCase();
        strArray = str2.split(" ");
        for (var j = 0; j < strArray.length; j++) {
            myStr = strArray[j];
            if (strCountArray.length == 0) {
                myStrCount = new StrCount;
                myStrCount.string = myStr;
                myStrCount.count = 1;
                strCountArray.push(myStrCount);
            } else if (noInclude.includes(myStr)) {
                noIncludeStrs++;
            } else {
                strFound = false;
                for (var k = 0; k < strCountArray.length; k++) {
                    if (strCountArray[k].string == myStr) {
                        strCountArray[k].count++;
                        strFound = true;
                    }
                }
                if (!strFound) {
                    myStrCount = new StrCount;
                    myStrCount.string = myStr;
                    myStrCount.count = 1;
                    strCountArray.push(myStrCount);
                }
            }
        }
        sca = strCountArray.sort(function (a, b) {
            return b.count - a.count
        });
        limit = Math.min(10, sca.length);
        weightedStrs = 0;
        for (var kk = 0; kk < limit; kk++) {
            weightedStrs += sca[kk].count;
            chatP.innerHTML += ((kk + 1) + ". " + sca[kk].string + " : " + sca[kk].count + "<br>");
        }
    }
    //   countGoalRVarRefs(filteredLevels);
    setupActionsForm();
}


function StrCount(string, count) {
    this.string = string;
    this.count = count;
}

function countGoalRVarRefs(levels) {
    var grSelfInCalc = 0,
        grOtherInCalc = 0,
        grSelfInChat = 0,
        grOtherInChat = 0,
        varRefsPara = document.getElementById("varRefs");
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
    varRefsPara.innerHTML = "<br>Chatted own goal resistance = " + grSelfInChat + ", used own goal resistance in calculation = " + grSelfInCalc + "<br>Chatted other\'s goal resistance = " + grOtherInChat + ", used other\'s goal resistance in calculation = " + grOtherInCalc;
}

function findChats(levels) {
    var chatsFound = function () {}; //Will contain all message actions that match a given search message and their count
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