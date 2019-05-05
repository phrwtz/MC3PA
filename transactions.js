function checkStrategy() { //Checks all levels for evidence of various strategies.    var s = document.getElementById("strategies");
    var s = document.getElementById("strategies")
    s.innerHTML = "";
    s.style.display = "block";
    for (var i = 0, myTeam; myTeam = teams[i]; i++) {
        for (var j = 0, myLevel; myLevel = myTeam.levels[j]; j++) {
            //           checkCynthiaStrategy(myLevel);
            //           checkBreakCircuitStrategy(myLevel);
            checkGuessAndCheck(myLevel)
        }

        function checkCynthiaStrategy(myLevel) { //Adds true for allRsEqualR0, chattedEAfterAllRsEqual, and chattedR0AfterAllRsEqual to levels where appropriate.
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

function checkGuessAndCheck(myLevel) { //Looks for guess and check strategy for E and R0
    var oldETime,
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
        myTeam = myLevel.team,
        interval = 15,
        ERSubmitsForMember = [
            [],
            [],
            []
        ],
        ESuccessCount = 0, //Count levels that successfully use guess and check to find EW
        EFailureCount = 0, //Count levels that use guess and check but fail to find E
        RSuccessCount = 0,
        RFailureCount = 0,
        guessAndCheckE = ["none", "none", "none"],
        guessAndCheckR = ["none", "none", "none"],
        guessAndCheckEMsg = [],
        guessAndCheckRMsg = [];

    var s = document.getElementById("strategies");
    for (var k = 0; k < myLevel.actions.length; k++) {
        myAction = myLevel.actions[k];
        if (myAction.type === "submitER") {
            board = myAction.board
            ERSubmitsForMember[board].push(myAction); //Push the action onto the array for this board
        }
    }
    //Look for guess and check for E
    for (var ii = 0; ii < 3; ii++) { //run over all three boards
        countE = 0;
        countR = 0;
        for (var jj = 0; jj < ERSubmitsForMember[ii].length; jj++) { //look at this member's ER submits
            thisERSubmit = ERSubmitsForMember[ii][jj];
            E = thisERSubmit.E;
            ESubmitValue = parseInt(thisERSubmit.ESubmitValue);
            ESubmitUnit = thisERSubmit.ESubmitUnit;
            R = thisERSubmit.R0;
            RSubmitValue = parseInt(thisERSubmit.RSubmitValue);
            RSubmitUnit = thisERSubmit.RSubmitUnit;
            if (!((ESubmitValue == E) && (ESubmitUnit = "volts"))) { //If the submitted value for E is incorrect and
                if (countE == 0) { //there are no prior incorrect E submits in the array
                    oldETime = thisERSubmit.eTime;
                    newETime = oldETime;
                    countE++;
                } else { //if there are already incorrect E submissions in the array
                    newETime = thisERSubmit.eTime;
                    if ((newETime - oldETime) < interval) { //if there was a prior incorrect E submit by this member within the time interval
                        countE++ //increment the count
                        if (countE > 2) { //if there are more than two consecutive incorrect submits
                            guessAndCheckE[ii] = "unsuccessful"; //There is evidence of guess and check strategy being employed (so far unsuccessfully) by this member for E
                            EFailureCount++;
                        }
                    } else { // if the next E/R submit action is more than the time interval later than the last one
                        countE = 0; //zero out the count and keep looking.
                    }
                }
            } else { //if we find a correct E submission
                if ((countE > 1) && ((newETime - oldETime) < interval)) { //and there two or more incorrect E guesses within the time interval 
                    guessAndCheckE[ii] = "successful"; //There is evidence of guess and check strategy being employed successfully by this member for E
                    ESuccessCount++;
                }
            }
            //Look for guess and check for R0 if level is D
            if (myLevel.label == "D") {
                if (!((RSubmitValue == R) && (RSubmitUnit = "ohms"))) { //If the submitted value for R0 is incorrect and
                    if (countR == 0) { //there are no prior incorrect R0 submits in the array
                        oldRTime = thisERSubmit.eTime;
                        newRTime = oldRTime;
                        countR++;
                    } else { //if there are already incorrect R0 submissions in the array
                        newRTime = thisERSubmit.eTime;
                        if ((newRTime - oldRTime) < interval) { //if there was a prior incorrect R submit by this member within the time interval
                            countR++ //increment the count
                            if (countR > 2) { //if there are more than two consecutive incorrect submits
                                guessAndCheckR[ii] = "unsuccessful"; //There is evidence of guess and check strategy being employed (so far unsuccessfully) by this member for R0
                                RFailureCount++;
                            }
                        } else { // if the next E/R submit action is more than the time interval later than the last one
                            countR = 0; //zero out the count and keep looking.
                        }
                    }
                } else { //if we find a correct R submission
                    if ((countR > 1) && ((newRTime - oldRTime) < interval)) { //and there two or more incorrect E guesses within the time interval 
                        guessAndCheckR[ii] = "successful"; //There is evidence of guess and check strategy being employed successfully by this member for R0
                        RSuccessCount++;
                    }
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
    if ((myLevel.label == "C") || (myLevel.label == "D")) {
        s.innerHTML += "<br>" + "Team " + myTeam.name + "(" + myTeam.classId + "}, level " + myLevel.label + ", " + guessAndCheckEMsg[0] + ", " + guessAndCheckEMsg[1] + ", " + guessAndCheckEMsg[2];
    }
    if (myLevel.label == "D") {
        s.innerHTML += "<br>" + "Team " + myTeam.name + "(" + myTeam.classId + "}, level " + myLevel.label + ", " + guessAndCheckRMsg[0] + ", " + guessAndCheckRMsg[1] + ", " + guessAndCheckRMsg[2];
    }
    // console.log(ESuccessCount + " levels successfully used guess and check to find E.");
    // console.log(EFailureCount + " levels used guess and check to find E but failed to do so.");
    // console.log(RSuccessCount + " levels successfully used guess and check to find R0.");
    // console.log(RFailureCount + " levels used guess and check to find R0 but failed to do so.");
}