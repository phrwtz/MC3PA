function checkCynthiaStrategy() { //Checks all C and D levels for evidence of Cynthia strategy. Adds true for the properties allRsEqualR0, chattedEAfterAllRsEqual, and chattedR0AfterAllRsEqual to all C and D levels where appropriate.
    var returnStr = "",
        time,
        myTeacher,
        totalCynthias = 0,
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
                totalCynthias++;
                //           s.innerHTML += ("<b><font color=red> Team " + myTeam.name + ", of class " + myTeam.classId + ", used the Cynthia strategy at level " + myLevel.label + "!</font><b><br>");
            } else if ((myLevel.label == "D") && eSubmittedAfterRsEqual && myLevel.chattedEAfterAllRsEqual && r0SubmittedAfterRsEqual && myLevel.chattedR0AfterAllRsEqual) {
                myLevel.CynthiaStrategyDetected = true;
                totalCynthias++;
                //         s.innerHTML += ("<b><font color=red> Team " + myTeam.name + ", of class " + myTeam.classId + ", used the Cynthia strategy at level " + myLevel.label + "!</font><b><br>");
            }
        }
    }
    console.log(totalCynthias + " Cynthia strategies found.")
}

function checkGuessAndCheck() { //Looks for guess and check strategy for E and R0 for all C and D levels
    var myLevel,
        myTeam,
        totalGuessAndCheckSuccessE = 0,
        totalGuessAndCheckSuccessR = 0,
        totalGuessAndCheckFailureE = 0,
        totalGuessAndCheckFailureR = 0,
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
        interval = 60,
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
                            if ((ESubmitValue) && (ESubmitValue != E)) { //If an incorrect value was submitted E and
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
                                                totalGuessAndCheckSuccessE++;
                                            } else {
                                                guessAndCheckE[ii] = "unsuccessful";
                                                EFailureCount++;
                                                myLevel.EGuessAndCheckFailure = true;
                                                totalGuessAndCheckFailureE++;

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
                            if ((RSubmitValue) && (RSubmitValue != R)) { //If an incorrect value for R0 was submitted and
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
                                                totalGuessAndCheckSuccessR++;
                                            } else {
                                                guessAndCheckR[ii] = "unsuccessful";
                                                RFailureCount++;
                                                myLevel.RGuessAndCheckFailure = true;
                                                totalGuessAndCheckFailureR++;
                                            }
                                        }
                                    } else { // if the most recent E/R submit action is more than the time interval since the last one
                                        countR = 0; //zero out the count and keep looking.
                                    }
                                }
                            }
                        }
                    } //End of G&C for R
                } //next board
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
    }
    console.log(totalGuessAndCheckSuccessE + " guess and check success for E.");
    console.log(totalGuessAndCheckFailureE + " guess and check failures for E.");
    console.log(totalGuessAndCheckSuccessR + " guess and check success for R0.");
    console.log(totalGuessAndCheckFailureR + " guess and check failures for R0.");
}

function checkBreakCircuitStrategy() { //Looks for measurement of E by breaking circuit and measuring directly. Also checks for "big R strategy" – making one resistor much bigger than the other two so that the voltage across it is close to E
    var s = document.getElementById("strategies"),
        totalBreakCircuit = 0,
        totalBigR = 0,
        leadDisconnected,
        circuitState = "Two leads connected",
        lastTime,
        tolerance = .05,
        lastLeadDisconnectedTime = 0;
    s.style.display = "inline";
    s.innerHTML = "";
    for (var j = 0, myTeam; myTeam = teams[j]; j++) {
        for (var i = 0, myLevel; myLevel = myTeam.levels[i]; i++) {
            if ((myLevel.label == "C") || (myLevel.label == "D")) {
                for (var k = 0, myAction; myAction = myLevel.actions[k]; k++) {
                    if (myAction.type == "disconnect-lead") {
                        lastTime = myAction.uTime;
                        if (circuitState == "Two leads connected") {
                            circuitState = "One lead connected";
                        } else {
                            circuitState = "No leads connected";
                        }
                    }
                    if (myAction.type == "connect-lead") {
                        lastTime = myAction.uTime;
                        if (circuitState == "One lead connected") {
                            circuitState = "Two leads connected";
                        } else {
                            circuitState = "One lead connected";
                        }
                    }
                    if ((myAction.type == "measurement") && ((myAction.uTime - lastTime) < 15)) {
                        if ((myAction.result == myLevel.E) && (circuitState == "One lead connected")) {
                            if (!myLevel.circuitBreakStrategyDetected) {
              //                  console.log("At " + myAction.eMinSecs + " " + myLevel.teacher + ", team " + myTeam.name + ", level " + myLevel.label + " made a measurement after circuitbreak. Measurement is " + myAction.result + " E is " + myLevel.E);
                                myLevel.circuitBreakStrategyDetected = true;
                                totalBreakCircuit++;
                            }
                        } else if (about(myAction.result, myLevel.E, tolerance) && oneBigR(myAction) && !myLevel.bigRStrategyDetected) {
                            //          console.log("At " + myAction.eMinSecs + " " + myLevel.teacher + ", team " + myTeam.name + ", level " + myLevel.label + " in big R condition. Measurement is " + myAction.result + " E is " + myLevel.E);
                            myLevel.bigRStrategyDetected = true;
                            totalBigR++;
                        }
                    }
                }
            }
        }
    }
    console.log(totalBreakCircuit + " break circuit strategies detected.");
    console.log(totalBigR + " big R strategies detected.");
}

function findResistorChangeRuns(myLevel) {
    for (var i = 0, myAction; myAction = myLevel.actions[i]; i++) {
        if (myAction.type == "resistorChange") {
            myMember = myAction.actor;
            if (!myMember.onARun) {
                var myRun = new run;
                for (var j = 0; j < myLevel.members.length; j++) {
                    if (myLevel.members[j].board != myAction.board) {
                        myLevel.members[j].onARun = false;
                    } else {
                        myLevel.members[j].onARun = true;
                    }
                }
                myRun.startR = myAction.oldR[myAction.board];
                myRun.endR = myAction.newR[myAction.board];
                myRun.startTime = myAction.eMinSecs;
                myRun.changes = 1;
                myMember.runs.push(myRun);
            } else { //myMember on a run
                myRun = myMember.runs[myMember.runs.length - 1];
                myRun.endR = myAction.newR[myAction.board];
                myRun.endTime = myAction.eMinSecs;
                myRun.changes++;
            }
        }
    }
    console.log("goal V1 = " + myLevel.goalV[0] + ", goal V2 = " + myLevel.goalV[1] + ", goal V3 = " + myLevel.goalV[2]);
    for (var ii = 0; ii < myLevel.members.length; ii++) {
        myMember = myLevel.members[ii];
        for (var jj = 0; jj < myMember.runs.length; jj++) {
            myRun = myMember.runs[jj];
            console.log("At elapsed time " + myRun.startTime + ", member " + ii + " of level " + myLevel.label + ", team " + myLevel.team.name + ", class " + myLevel.team.classId + ", had a run from " + myRun.startR + " to " + myRun.endR + " with " + myRun.changes + " changes.");
        }
    }
}