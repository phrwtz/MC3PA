function checkStrategy() { //Checks all levels for evidence of "Cynthia strategy"/ Adds true for allRsEqualR0, chattedEAfterAllRsEqual, and chattedR0AfterAllRsEqual to levels where appropriate. Also looks for measurement of E by breaking circuit and measuring directly.
    for (var i = 0, myTeam; myTeam = teams[i]; i++) {
        for (var j = 0, myLevel; myLevel = myTeam.levels[j]; j++) {
            checkCynthiaStrategy(myLevel);
            checkBreakCircuitStrategy(myLevel);
        }

        function checkCynthiaStrategy(myLevel) {
            var returnStr = "",
                time,
                myTeacher,
                eSubmittedAfterRsEqual = false,
                r0SubmittedAfterRsEqual = false;
            for (var i = 0, myTeam; myTeam = teams[i]; i++) {
                for (var j = 0, myLevel; myLevel = myTeam.levels[j]; j++) {
                    if ((myLevel.label == "C") || (myLevel.label == "D")) {
                        eSubmitted = false;
                        eChatted = false;
                        for (var k = 0, myAction; myAction = myLevel.actions[k]; k++) {
                            time = myAction.eMinSecs;
                            myTeacher = myLevel.team.teacher.name;
                            if (myAction.type == "resistorChange") {
                                if ((myAction.R[0] == myLevel.R0) && (myAction.R[0] == myAction.R[1]) && (myAction.R[1] == myAction.R[2])) { //If all variable resistances are the same as R0;
                                    myLevel.allRsEqualR0 = true;
                                    //                      s.innerHTML += "At " + time + " " + myTeacher + "\'s team " + myLevel.team.name + ", level " + myLevel.label + ", had all resistances the same as R0.<br>";
                                }
                            }
                            if (myLevel.allRsEqualR0) {
                                if (myAction.ESubmitValue == myLevel.E) {
                                    eSubmittedAfterRsEqual = true;
                                    //                    s.innerHTML += "At " + time + " they submitted the correct value for E<br>";
                                }
                                if (myAction.R0SubmitValue == myLevel.R0) {
                                    r0SubmittedAfterRsEqual = true;
                                    s.innerHTML += "At " + time + " they submitted the correct value for R0<br>";
                                }
                                if (myAction.type == "message") {
                                    msgNumberMatch = myAction.msg.match(/[\d]+/);
                                    if (msgNumberMatch) {
                                        if (myLevel.E.toString() == msgNumberMatch[0]) {
                                            myLevel.chattedEAfterAllRsEqual = true;
                                            //                           s.innerHTML += "Someone chatted the E value at " + time + "<br>";
                                        }
                                        if (myLevel.R0.toString() == msgNumberMatch[0]) {
                                            myLevel.chattedRoAfterAllRsEqual = true;
                                            //                       s.innerHTML += "Someone chatted the R0 value at " + time + "<br>";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if ((myLevel.label == "C") && (eSubmittedAfterRsEqual && myLevel.chattedEAfterAllRsEqual)) {
                        myLevel.CynthiaStrategyDetected = true;
                        //           s.innerHTML += ("<b><font color=red> Team " + myTeam.name + ", of class " + myTeam.classId + ", used the Cynthia strategy at level " + myLevel.label + "!</font><b><br>");
                    } else if ((myLevel.label == "D") && eSubmittedAfterRsEqual && myLevel.chattedEAfterAllRsEqual && r0SubmittedAfterRsEqual && myLevel.chattedR0AfterAllRsEqual) {
                        myLevel.CynthiaStrategyDetected = true;
                        //         s.innerHTML += ("<b><font color=red> Team " + myTeam.name + ", of class " + myTeam.classId + ", used the Cynthia strategy at level " + myLevel.label + "!</font><b><br>");
                    }
                }
            }
        }
    }
}

function displayCynthiaStrategy(myLevel) {
    var time,
        myTeacher = myLevel.team.teacher.name,
        myTeam = myLevel.team,
        myAction,
        eSubmittedAfterRsEqual = false,
        r0SubmittedAfterRsEqual = false,
        s = document.getElementById("strategies");
    s.style.display = "inline";
    s.innerHTML = "";
    for (var k = 0, myAction; myAction = myLevel.actions[k]; k++) {
        time = myAction.eMinSecs;
        if (myAction.type == "resistorChange") {
            if ((myAction.R[0] == myLevel.R0) && (myAction.R[0] == myAction.R[1]) && (myAction.R[1] == myAction.R[2])) { //If all variable resistances are the same as R0;
                s.innerHTML += "At " + time + " " + myTeacher + "\'s team " + myLevel.team.name + ", level " + myLevel.label + ", had all resistances the same as R0.<br>";
            }
        }
        if (myLevel.allRsEqualR0) {
            if (myAction.ESubmitValue == myLevel.E) {
                eSubmittedAfterRsEqual = true;
                s.innerHTML += "At " + time + " they submitted the correct value for E<br>";
            }
            if (myAction.R0SubmitValue == myLevel.R0) {
                r0SubmittedAfterRsEqual = true;
                s.innerHTML += "At " + time + " they submitted the correct value for R0<br>";
            }
            if (myAction.type == "message") {
                msgNumberMatch = myAction.msg.match(/[\d]+/);
                if (msgNumberMatch) {
                    if (myLevel.E.toString() == msgNumberMatch[0]) {
                        myLevel.chattedEAfterAllRsEqual = true;
                        s.innerHTML += myAction.actor.name + " chatted the E value at " + time + "<br>";
                    }
                    if (myLevel.R0.toString() == msgNumberMatch[0]) {
                        myLevel.chattedRoAfterAllRsEqual = true;
                        s.innerHTML += myAction.actor.name + " chatted the R0 value at " + time + "<br>";
                    }
                }
            }
        }
    }
    if ((myLevel.label == "C") && (eSubmittedAfterRsEqual) && (myLevel.chattedEAfterAllRsEqual)) {
        myLevel.CynthiaStrategyDetected = true;
        s.innerHTML += ("<b><font color=red> Team " + myTeam.name + ", of class " + myTeam.classId + ", used the Cynthia strategy at level " + myLevel.label + "!</font><b><br>");
    } else if (((myLevel.label == "D") && (eSubmittedAfterRsEqual) && (myLevel.chattedEAfterAllRsEqual) && (r0SubmittedAfterRsEqual) && (myLevel.chattedR0AfterAllRsEqual))) {
        myLevel.CynthiaStrategyDetected = true;
        s.innerHTML += ("<b><font color=red> Team " + myTeam.name +
            ", of class " + myTeam.classId + ", used the Cynthia strategy at level " + myLevel.label + "!</font><b><br>");
    }
}

function checkBreakCircuitStrategy(myLevel) {
    var s = document.getElementById("strategies"),
        leadDisconnected,
        circuitState = "Two leads connected",
        lastLeadDisconnectedTime = 0;
    s.style.display = "inline";
    s.innerHTML = "";
    if ((myLevel.label == "C") || (myLevel.label == "D")) {
        for (var k = 0, myAction; myAction = myLevel.actions[k]; k++) {
            time = myAction.eMinSecs;
            if (myAction.type == "disconnect-lead") {
                if (circuitState == "Two leads connected") {
                    circuitState = "One lead connected";
                    lastLeadDisconnectedTime = myAction.utime;
                } else {
                    circuitState = "No leads connected";
                    lastLeadDisconnectedTime = 0;
                }
            }
            if (myAction.type == "connect-lead") {
                if (circuitState == "One lead connected") {
                    circuitState = "Two leads connected";
                    lastLeadDisconnectedTime = 0;
                } else {
                    circuitState = "No leads disconnected";
                    circuitState = "One lead connected";
                    lastLeadDisconnectedTime = myAction.utime;;
                }
            }
            if (((myAction.type == "measurement") && (circuitState = "One lead connected") && (myAction.time - lastLeadDisconnectedTime) < 5)) {
                console.log("Measurement after circuitbreak");
            }
        }
    }
}

function findGuessAndCheck(teams) {
    var tOldE,
        tOldR,
        tNewE,
        tNewR,
        countE,
        countR,
        board,
        interval = 30,
        ERSubmitsForMember = [
            [],
            [],
            []
        ],
        guessAndCheckE = [],
        guessAndCheckR = [],
        guessAndCheckEMsg = [],
        guessAndCheckRMsg = [],
        gAndCMsgE,
        gAndCMsgR;

    document.getElementById("data").innerHTML = ""; //Clear data
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        if (($("#team-" + myTeam.name + myTeam.classId)[0].checked)) {
            document.getElementById("data").innerHTML += "<br>"
            for (var j = 0; j < myTeam.levels.length; j++) {
                myLevel = myTeam.levels[j];
                if ($("#level-" + myLevel.label)[0].checked) {
                    ERSubmitsForMember = [
                        [],
                        [],
                        []
                    ];
                    guessAndCheckE = ["none", "none", "none"]; //initialize to no guess and check strategy
                    guessAndCheckR = ["none", "none", "none"];
                    for (var k = 0; k < myLevel.actions.length; k++) { ///run over all the actions for this team and level
                        myAction = myLevel.actions[k];
                        if (myAction.type === "submitER") { //if the action is an E/R submit
                            board = myAction.board
                            ERSubmitsForMember[board].push(myAction); //Push the action onto the array for this board
                        }
                    }
                    //Look for guess and check for E
                    for (var ii = 0; ii < 3; ii++) { ///run over all three boards
                        countE = 0;
                        countR = 0;
                        for (var jj = 0; jj < ERSubmitsForMember[ii].length; jj++) { //look at this member's ER submits
                            thisERSubmit = ERSubmitsForMember[ii][jj];
                            if (!thisERSubmit.successE) { //if the value for E is incorrect
                                if (countE === 0) { //if there are no prior incorrect E submits in the array
                                    tOldE = thisERSubmit.eTime;
                                    tNewE = tOldE;
                                    countE++;
                                } else { //if there are already incorrect E submissions in the array
                                    tNewE = thisERSubmit.eTime;
                                    if ((tNewE - tOldE) < interval) { //if there was a prior incorrect E submit by this member within the time interval
                                        countE++ //increment the count
                                        if (countE > 2) { //if there are more than two consecutive incorrect submits
                                            guessAndCheckE[ii] = "unsuccessful"; //There is evidence of guess and check strategy being employed (so far unsuccessfully) by this member for E
                                        }
                                    } else { // if there are no incorrect E submits within 30 seconds of this one
                                        countE = 0; //zero out the count and keep looking.
                                    }
                                }
                            } else if (thisERSubmit.successE) { //if we find a correct E submission
                                if ((countE > 1) && ((tNewE - tOldE) < 30)) { //and there two or more incorrect E guesses within the time interval 
                                    guessAndCheckE[ii] = "successful"; //There is evidence of guess and check strategy being employed successfully by this member for E
                                }
                            }
                            //Look for guess and check for R0
                            if (!thisERSubmit.successR) { //if the value for R is incorrect
                                if (countR === 0) { //if there are no prior incorrect R submits in the array
                                    tOldR = thisERSubmit.eTime;
                                    tNewR = tOldR;
                                    countR++;
                                } else { //if there are already incorrect R submissions in the array
                                    tNewR = thisERSubmit.eTime;
                                    if ((tNewR - tOldR) < interval) { //if there was a prior incorrect R submit by this member within the time interval
                                        countR++ //increment the count
                                        if (countR > 2) { //if there  more than two consecutive incorrect submits
                                            guessAndCheckR[ii] = "unsuccessful"; //There is evidence of guess and check strategy being employed (so far unsuccessfully) by this member for R
                                        }
                                    } else { // if there are no incorrect R submits within 30 seconds of this one
                                        countR = 0; //zero out the count and keep looking.
                                    }
                                }
                            } else if (thisERSubmit.successR) { //if we find a correct R submission
                                if ((countR > 1) && ((tNewR - tOldR) < interval)) { //and there two or more incorrect R guesses within the time interval 
                                    guessAndCheckR[ii] = "successful"; //There is evidence of guess and check strategy being employed successfully by this member for R
                                }
                            }
                        }
                    }
                    for (var m = 0; m < 3; m++) {
                        switch (guessAndCheckE[m]) {
                            case "none":
                                guessAndCheckEMsg[m] = "board " + (m + 1) + " did not try guess and check for E";
                                break;
                            case "unsuccessful":
                                guessAndCheckEMsg[m] = "board " + (m + 1) + " used guess and check for E unsuccessfully";
                                break;
                            case "successful":
                                guessAndCheckEMsg[m] = "board " + (m + 1) + " used guess and check for E successfully";
                                break;
                        }
                        switch (guessAndCheckR[m]) {
                            case "none":
                                guessAndCheckRMsg[m] = "board " + (m + 1) + " did not try guess and check for R0";
                                break;
                            case "unsuccessful":
                                guessAndCheckRMsg[m] = "board " + (m + 1) + " used guess and check for R0 unsuccessfully";
                                break;
                            case "successful":
                                guessAndCheckRMsg[m] = "board " + (m + 1) + " used guess and check for R0 successfully";
                                break;
                        }
                    }
                    if ((myLevel.label == "C") || (myLevel.label == "D")) {
                        document.getElementById("data").innerHTML += "<br>" + "Team " + myTeam.name + "(" + myTeam.classId + "}, level " + myLevel.label + ", " + guessAndCheckEMsg[0] + ", " + guessAndCheckEMsg[1] + ", " + guessAndCheckEMsg[2];
                    }
                    if (myLevel.label == "D") {
                        document.getElementById("data").innerHTML += "<br>" + "Team " + myTeam.name + "(" + myTeam.classId + "}, level " + myLevel.label + ", " + guessAndCheckRMsg[0] + ", " + guessAndCheckRMsg[1] + ", " + guessAndCheckRMsg[2];
                    }
                }
            }
        }
    }
}