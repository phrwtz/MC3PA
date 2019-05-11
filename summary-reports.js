filteredLevels = []

function summaryReport() {
    var filterTable = document.getElementById("filterTable"),
        levels;
    filterTable.style.display = "block";
    assignLevelsToTeachers(); //Also eliminates levels that are not attempted and adds properties like goals chatted and calculated.
    updateLevels();
}

function updateLevels() { //Fills in numbers of levels for each teacher checked
    var label,
        myTeacher,
        teacherCheckBoxes, //All the checkboxes with teachers' names, whether or not checked
        numberTutorialLevels = 0,
        numberALevels = 0,
        numberBLevels = 0,
        numberCLevels = 0,
        numberDLevels = 0,
        teacherLevels = []; //All the levels for teachers that are checked
    teacherCheckBoxes = document.getElementsByName("teacher");
    for (var i = 1; i < teacherCheckBoxes.length; i++) { //Start at 1 because we don't want to include the "all/none" box.
        myTeacherCheckBox = teacherCheckBoxes[i];
        if (myTeacherCheckBox.checked) {
            myTeacher = teachers[myTeacherCheckBox.id.match(/[\d]+/)];
            for (var j = 0, myLevel; myLevel = myTeacher.levels[j]; j++) {
                teacherLevels.push(myLevel);
                label = myLevel.label;
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
    document.getElementById("levels#").innerHTML = teacherLevels.length;
    document.getElementById("A#").innerHTML = numberALevels;
    document.getElementById("B#").innerHTML = numberBLevels
    document.getElementById("C#").innerHTML = numberCLevels;
    document.getElementById("D#").innerHTML = numberDLevels;
    updateOutcomes(teacherLevels);
}

function updateOutcomes(teacherLevels) { //Fills in number of successes and failures for each level label checked
    var levelsSuccess = 0,
        levelsFailure = 0,
        labelLevels = []; //Will be all the levels whose label is checked
    for (var j = 0, myLevel; myLevel = teacherLevels[j]; j++) {
        if (document.getElementById("level" + myLevel.label).checked) {
            labelLevels.push(myLevel);
            if (myLevel.success) {
                levelsSuccess++;
            } else {
                levelsFailure++
            }
        }
    }
    document.getElementById("outcomes#").innerHTML = labelLevels.length;
    document.getElementById("success#").innerHTML = levelsSuccess;
    document.getElementById("failure#").innerHTML = levelsFailure;
    updateVChats(labelLevels);
}

function updateVChats(labelLevels) { //Fills in number of voltage chat  properties (all chatted, some chatted, none chatted) for each level label checked
    var allGoalsChatted = 0,
        someGoalsChatted = 0,
        noGoalsChatted = 0,
        vChatLevels = [];
    if (labelLevels.length > 0) {
        for (var i = 0, myLevel; myLevel = labelLevels[i]; i++) {
            if (((document.getElementById("success").checked) && (myLevel.success)) || ((document.getElementById("failure").checked) && (!myLevel.success))) {
                vChatLevels.push(myLevel);
                switch (myLevel.goalVsChatted) {
                    case "all":
                        allGoalsChatted++;
                        break;
                    case "some":
                        someGoalsChatted++;
                        break;
                    case "none":
                        noGoalsChatted++
                        break;
                }
            }
        }
    }
    document.getElementById("vchats#").innerHTML = vChatLevels.length;
    document.getElementById("VAllChatted#").innerHTML = allGoalsChatted;
    document.getElementById("VSomeChatted#").innerHTML = someGoalsChatted;
    document.getElementById("VNotChatted#").innerHTML = noGoalsChatted;
    updateRCalcs(vChatLevels);
}

function updateRCalcs(vChatLevels) { //Fills in number of resistance calculated  properties (all calculated, some calculated, none calculated) for each level whose voltage chat property is checked
    var allGoalsCalculated = 0,
        someGoalsCalculated = 0,
        noGoalsCalculated = 0,
        rCalcLevels = [];
    if (vChatLevels.length > 0) {
        for (var i = 0, myLevel; myLevel = vChatLevels[i]; i++) {
            if (((document.getElementById("VAllChat").checked) && (myLevel.goalVsChatted == "all")) || ((document.getElementById("VSomeChat").checked) && (myLevel.goalVsChatted == "some")) || ((document.getElementById("VNoChat").checked) && (myLevel.goalVsChatted == "none"))) {
                rCalcLevels.push(myLevel);
                switch (myLevel.goalRsCalculated) {
                    case "all":
                        allGoalsCalculated++;
                        break;
                    case "some":
                        someGoalsCalculated++;
                        break;
                    case "none":
                        noGoalsCalculated++
                        break;
                }
            }
        }
    }
    document.getElementById("rcalcs#").innerHTML = rCalcLevels.length;
    document.getElementById("RAllCalculated#").innerHTML = allGoalsCalculated;
    document.getElementById("RSomeCalculated#").innerHTML = someGoalsCalculated;
    document.getElementById("RNotCalculated#").innerHTML = noGoalsCalculated;
    updateRChats(rCalcLevels);
}

function updateRChats(rCalcLevels) {
    var allGoalsChatted = 0,
        someGoalsChatted = 0,
        noGoalsChatted = 0,
        rChatLevels = [];
    selectedLevels = []; //selectedLevels is a global variable
    if (rCalcLevels.length > 0) {
        for (var i = 0; i < rCalcLevels.length; i++) {
            myLevel = rCalcLevels[i];
            if (((document.getElementById("RAllCalc").checked) && (myLevel.goalRsCalculated == "all")) || ((document.getElementById("RSomeCalc").checked) && (myLevel.goalRsCalculated == "some")) || ((document.getElementById("RNoCalc").checked) && (myLevel.goalRsCalculated == "none"))) {
                rChatLevels.push(myLevel)
                switch (myLevel.goalRsChatted) {
                    case "all":
                        allGoalsChatted++;
                        if (document.getElementById("RAllChat").checked) {
                            selectedLevels.push(myLevel);
                        }
                        break;
                    case "some":
                        someGoalsChatted++;
                        if (document.getElementById("RSomeChat").checked) {
                            selectedLevels.push(myLevel);
                        }
                        break;
                    case "none":
                        noGoalsChatted++;
                        if (document.getElementById("RNoChat").checked) {
                            selectedLevels.push(myLevel);
                        }
                        break;
                }
            }
        }
        document.getElementById("rchats#").innerHTML = rChatLevels.length;
        document.getElementById("RAllChatted#").innerHTML = allGoalsChatted;
        document.getElementById("RSomeChatted#").innerHTML = someGoalsChatted;
        document.getElementById("RNotChatted#").innerHTML = noGoalsChatted;
    }
    actionsReport();
}

function actionsReport() { //generates a radio button for each final selected level. Colors it according to strategy
    var levelColor = "black";
    var strategy = "none";
    var f = document.getElementById("levelsPara");
    var c = document.getElementById("chatsPara");
    var a = document.getElementById("actionsTable");
    var t = document.getElementById("checkActions");
    var sb = document.getElementById("strategySpan");
    var strategyRadios = document.getElementsByName("strategyRadio");
    for (var x = 0; x < strategyRadios.length; x++) {
        if (strategyRadios[x].checked) {
            strategy = strategyRadios[x].id
        }
    }
    if (selectedLevels.length == 0) {
        f.innerHTML = "<br><b>There are no levels to look at.</b><br>";
        c.style.display = "none";
        a.style.display = "none";
        t.style.display = "none";
        sb.style.display = "none";
        return;
    } else {
        c.style.display = "inline";
        a.style.display = "inline";
        t.style.display = "inline";

    }
    if (selectedLevels.length == 1) {
        f.innerHTML = "<br><b>This is the level to look at:</b><br>";
        c.innerHTML = "";
    } else {
        f.innerHTML = "<br><b>These are the " + selectedLevels.length + " levels to look at:</b><br>";
        c.innerHTML = "";
    }
    for (var i = 0; i < selectedLevels.length; i++) {
        myLevel = selectedLevels[i];
        switch (strategy) {
            case "Cynthia":
                if (myLevel.CynthiaStrategyDetected) {
                    levelColor = "red";
                } else if (myLevel.allRsEqualR0) {
                    levelColor = "blue";
                } else {
                    levelColor = "black";
                }
                break;
            case "GuessAndCheckForE":
                if (myLevel.EGuessAndCheckSuccess) {
                    levelColor = "red";
                } else if (myLevel.EGuessAndCheckFailure) {
                    levelColor = "blue";
                } else {
                    levelColor = "black";
                }
                break;
            case "GuessAndCheckForR":
                if (myLevel.RGuessAndCheckSuccess) {
                    levelColor = "red";
                } else if (myLevel.RGuessAndCheckFailure) {
                    levelColor = "blue";
                } else {
                    levelColor = "black";
                }
                break;
            case "circuitBreak":
                if (myLevel.circuitBreakStrategyDetected) {
                    levelColor = "red";
                } else {
                    levelColor = "black";
                }
                break;
            case "bigR":
                if (myLevel.bigRStrategyDetected) {
                    levelColor = "red";
                } else {
                    levelColor = "black";
                }
                break;
        }
        f.innerHTML += ("<font color=" + levelColor + "> " + myLevel.teacher.name + ", " + myLevel.team.classId + ", " + myLevel.team.name + ", level " + myLevel.label + '</font><input type="radio" id=' + myLevel.id + ' name="levelRadio" onchange=reportResults()></input>' + "<br>");
    } //Next level
    countChats();
    reportResults();
}

function countChats() {
    if (selectedLevels.length != 0) {
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
        if (selectedLevels.length == 1) {
            strMsg = "<br><b>Most frequent strings for this level:<b><br>"
        }
        if (selectedLevels.length > 1) {
            strMsg = "<br><b>Most frequent strings for these " + selectedLevels.length + " levels:</b><br>";
        }
        if (selectedLevels.length > 0) {
            for (var r = 0, myLevel; myLevel = selectedLevels[r]; r++) {
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
    }
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