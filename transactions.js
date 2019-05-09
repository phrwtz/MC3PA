function checkCynthiaStrategy() { //Checks all C and D levels for evidence of Cynthia strategy. Adds true for the properties allRsEqualR0, chattedEAfterAllRsEqual, and chattedR0AfterAllRsEqual to all C and D levels where appropriate.
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
                        }
                    }
                    if (myLevel.allRsEqualR0) {
                        if (myAction.ESubmitValue == myLevel.E) {
                            eSubmittedAfterRsEqual = true;
                        }
                        if (myAction.R0SubmitValue == myLevel.R0) {
                            r0SubmittedAfterRsEqual = true;
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

function displayCynthiaStrategy() {
    strategy = "Cynthia";
    actionsReport();
}

function displayGuessAndCheckForE() {
    strategy = "GuessAndCheckForE";
    actionsReport();
}

function displayGuessAndCheckForR() {
    strategy = "GuessAndCheckForR";
    actionsReport();
}

function checkGuessAndCheck() { //Looks for guess and check strategy for E and R0 for all C and D levels
    var myLevel,
        myTeam,
        oldETime,
        oldRTime,
        newETime,
        newRTime,
        countE,
        countR,
        E,
        ESubmitValue,
        ESubmitUnit,
        R,
        RSubmitValue,
        RSubmitUnit,
        board,
        interval = 400,
        ERSubmitsForMember = [
            [],
            [],
            []
        ],
        ESuccessCount = 0, //Count levels that successfully use guess-and-check to find E
        EFailureCount = 0, //Count levels that use guess-and-check but fail to find E
        RSuccessCount = 0,
        RFailureCount = 0,
        guessAndCheckE = [],
        guessAndCheckR = [],
        guessAndCheckEMsg = [],
        guessAndCheckRMsg = [];

    var s = document.getElementById("strategies");
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j]; //If we're dealing with level C or D
            if ((myLevel.label == "C") || (myLevel.label == "D")) {
                //First count all the ER Submit actions for this level
                ERSubmitsForMember = [
                    [],
                    [],
                    []
                ];
   //             sortActionsByUTime(myLevel.actions);
                for (var k = 0; k < myLevel.actions.length; k++) {
                    myAction = myLevel.actions[k];
                    if (myAction.type === "submitER") {
                        board = myAction.board
                        ERSubmitsForMember[board].push(myAction); //Push the action onto the array for this board
                    }
                }
                //Then look for guess and check for E and R0 for this level
                guessAndCheckE = ["none", "none", "none"];
                guessAndCheckR = ["none", "none", "none"];
                for (var ii = 0; ii < 3; ii++) { //run over all three boards
                    countE = 0;
                    countR = 0;
                    for (var jj = 0; jj < ERSubmitsForMember[ii].length; jj++) { //look at each member's ER submits
                        thisERSubmit = ERSubmitsForMember[ii][jj];
                        if (guessAndCheckE[ii] == "none") { //only look further if we haven't yet detected guess and check strategy for E
                            E = thisERSubmit.E;
                            ESubmitValue = parseFloat(thisERSubmit.ESubmitValue);
                            ESubmitUnit = thisERSubmit.ESubmitUnit;
                            if (Number.isInteger(ESubmitValue) && (ESubmitValue != E)) { //If an incorrect value was submitted E and
                                if (countE == 0) { //there are no prior incorrect E submits in the array
                                    oldETime = thisERSubmit.eTime;
                                    newETime = oldETime;
                                    countE++;
                                } else { //if there are already incorrect E submissions in the array
                                    newETime = thisERSubmit.eTime;
                                    if ((newETime - oldETime) < interval) { //and the interval between this ERSubmit and the most recent one is less than the designate4d time interval
                                        countE++ //increment the count
                                        if (countE > 2) { //if there are more than two consecutive incorrect submits then we've identified guess and check strategy for E
                                            if (myLevel.successE) {
                                                guessAndCheckE[ii] = "successful";
                                                ESuccessCount++;
                                                myLevel.EGuessAndCheckSuccess = true;
                                            } else {
                                                guessAndCheckE[ii] = "unsuccessful";
                                                EFailureCount++;
                                                myLevel.EGuessAndCheckFailure = true;

                                            }
                                        }
                                    } else { // if the most recent E/R submit action is more than the time interval since the last one
                                        countE = 0; //zero out the count and keep looking.
                                    }
                                }
                            }
                        } //Now look for guess and check for R0 for this level
                        R = thisERSubmit.R0;
                        if ((thisERSubmit.RSubmitValue != "<No value submitted>") && (guessAndCheckR[ii] == "none")) { //Don't proceed if no R0 was submitted (e.g., if the level is C) or if we've already detected guess and check for R
                            RSubmitValue = parseFloat(thisERSubmit.RSubmitValue);
                            RSubmitUnit = thisERSubmit.RSubmitUnit;
                            if (Number.isInteger(RSubmitValue) && (RSubmitValue != R)) { //If an incorrect value for R0 was submitted and
                                if (countR == 0) { //there are no prior incorrect R0 submits in the array
                                    oldRTime = thisERSubmit.eTime;
                                    newRTime = oldRTime;
                                    countR++;
                                } else { //if there are already incorrect R0 submissions in the array
                                    newRTime = thisERSubmit.eTime;
                                    if ((newRTime - oldRTime) < interval) { //if there was a prior incorrect R submit by this member within the time interval
                                        countR++ //increment the count
                                        if (countR > 2) { //if there are more than two consecutive incorrect submits
                                            if (myLevel.successR) {
                                                guessAndCheckR[ii] = "successful";
                                                RSuccessCount++;
                                                myLevel.RGuessAndCheckSuccess = true;
                                            } else {
                                                guessAndCheckR[ii] = "unsuccessful";
                                                    RFailureCount++;
                                                myLevel.RGuessAndCheckFailure = true;
                                            }
                                        }
                                    } else { // if the most recent E/R submit action is more than the time interval since the last one
                                        countR = 0; //zero out the count and keep looking.
                                    }
                                }
                            }
                        }
                    } //End of G&C for R
                }//next board
            }
            for (var m = 0; m < 3; m++) {
                switch (guessAndCheckE[m]) {
                    case "none":
                        guessAndCheckEMsg[m] = "board " + (m + 1) + " did not try guess and check for E";
                        break;
                    case "unsuccessful":
                        guessAndCheckEMsg[m] = "<span  style=\"color:blue\">board " + (m + 1) + " used guess and check for E unsuccessfully</span>";
                        break;
                    case "successful":
                        guessAndCheckEMsg[m] = "<span  style=\"color:red\">board " + (m + 1) + " used guess and check for E successfully</span>";
                        break;
                }
                switch (guessAndCheckR[m]) {
                    case "none":
                        guessAndCheckRMsg[m] = "board " + (m + 1) + " did not try guess and check for R0";
                        break;
                    case "unsuccessful":
                        guessAndCheckRMsg[m] = "<span  style=\"color:blue\">board " + (m + 1) + " used guess and check for R0 unsuccessfully</span>";
                        break;
                    case "successful":
                        guessAndCheckRMsg[m] = "<span  style=\"color:red\">board " + (m + 1) + " used guess and check for R0 successfully</span>";
                        break;
                }
            } //Next board
        } //Next level 
    } //Next team
}

function checkBreakCircuitStrategy(myLevel) { //Looks for measurement of E by breaking circuit and measuring directly.
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