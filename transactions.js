function checkCynthiaStrategy(myLevel) { //if myLevel is C or D, checks for evidence of Cynthia strategy. Adds true for the properties allRsEqualR0, chattedEAfterAllRsEqual, and chattedR0AfterAllRsEqual to all C and D levels where appropriate.
    var returnStr = "",
        time,
        myTeacher,
        totalCynthias = 0,
        eSubmittedAfterRsEqual = false,
        r0SubmittedAfterRsEqual = false;
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

function checkGuessAndCheck(myLevel) { //Looks for guess and check strategy for E and R0 for all C and D levels
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
        guessAndCheckRMsg = [],
        s = document.getElementById("strategies");
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
        } //next board}
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
        }
    }
}

function checkBreakCircuitStrategy(myLevel) { //Looks for measurement of E by breaking circuit and measuring directly. Also checks for "big R strategy" – making one resistor much bigger than the other two so that the voltage across it is close to E
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

function findResistorChangeRuns(myLevel) {
    var myRun;
    var iSlider = document.getElementById("intervalSlider");
    var iOutput = document.getElementById("intervalBox");
    interval = parseInt(iSlider.value);
    iOutput.innerHTML = interval;
    for (var i = 0, myAction; myAction = myLevel.actions[i]; i++) {
        setRunStatus(myLevel, myAction, interval); // Checks all runs and terminates them if this action is more than <interval> after their most recent resistor change.
        if (myAction.type == "resistorChange") {
            var board = myAction.board; //this is an integer
            var myMember = myAction.actor;
            if (!myMember.onARun) { //If this is the first action of a new run...
                var myRun = makeNewRun(myMember, myAction);
            } else { //actor already on a run. Is this action within <interval> of the last one?
                var thisTime = myAction.uTime;
                var lastTime = myMember.runs[myMember.runs.length - 1].endTime;
                var lastMinSecs = myMember.runs[myMember.runs.length - 1].endMinSecs;
                if ((thisTime - lastTime) <= interval) {
                    //If so, this action should be added to that ongoing run
                    myRun = continueRun(myMember, myAction);
                } else { //Time has run out, this is a new run
                    myRun = makeNewRun(myMember, myAction);
                }
            }
        }
    } //new action
    // Compute average length of runs and percent closer for each member and add to total runs, average length, and percent closer to level
    for (var j = 0, myMember; myMember = myLevel.members[j]; j++) {
        var resistorChanges = 0;
        var runsCloser = 0;
        var numRuns = myMember.runs.length
        for (k = 0; k < numRuns; k++) {
            resistorChanges += myMember.runs[k].changes;
            if (myMember.runs[k].closer) {
                runsCloser++
            }
            myMember.runsAvgLength = resistorChanges / numRuns;
            myMember.runsCloser = runsCloser;
            myMember.runsPctCloser = parseInt(1000 * runsCloser / numRuns) / 10;
        }
        myLevel.runs += numRuns;
        myLevel.resistorChanges += resistorChanges;
    }
    myLevel.runsPctCloser = parseInt(1000 * (myLevel.members[0].runsCloser + myLevel.members[1].runsCloser + myLevel.members[2].runsCloser) / myLevel.runs) / 10;
}

function makeNewRun(myMember, myAction) {
    var colors = ["#EEAAFF", "#AAFFEE", "#FFEEAA"]; //Toggle between these to separate resistor change runs in action report
    var myRun = new run;
    var board = myAction.board;
    myRun.backgroundColor = colors[myMember.runs.length % 3];
    myAction.backgroundColor = colors[myMember.runs.length % 3];
    myRun.actor = myMember;
    myMember.onARun = true;
    myAction.newRun = true;
    myAction.endRun = false; //Will be set true if another resistor change action by this member happens after an interval greater than "interval"
    myRun.startR = myAction.oldR[board];
    myRun.startV = myAction.oldV[board];
    myRun.startDV = Math.abs(myLevel.goalV[board] - myRun.startV);
    myRun.endR = myAction.newR[myAction.board];
    myRun.endV = myAction.newV[myAction.board];
    myRun.endDV = Math.abs(myLevel.goalV[board] - myRun.endV);
    (myRun.endDV <= myRun.startDV ? myRun.closer = true : myRun.closer = false);
    myRun.startMinSecs = myAction.eMinSecs;
    myRun.endMinSecs = myAction.eMinSecs;
    myRun.startTime = myAction.uTime;
    myRun.endTime = myAction.uTime; //Same as start time for first res change
    myRun.changes = 1;
    myMember.runs.push(myRun);
    if (myMember.runs.length > 1) { //If there is at least one previous run its last action must have its endRun property set to true
        var lastAction = myMember.runs[myMember.runs.length - 2];
        lastAction.endRun = true;
    }
    return myRun;
}

function continueRun(myMember, myAction) {
    var board = myAction.board;
    var myRun = myMember.runs[myMember.runs.length - 1];
    myAction.newRun = false;
    myAction.endRun = false;
    myAction.backgroundColor = myRun.backgroundColor;
    myRun.endR = myAction.newR[board];
    myRun.endV = myAction.newV[board];
    myRun.endDV = Math.abs(myLevel.goalV[board] - myRun.endV);
    myRun.endResDist = myAction.resDist;
    myRun.endMinSecs = myAction.eMinSecs;
    myRun.endTime = myAction.uTime;
    myRun.changes++;
    (myRun.endDV <= myRun.startDV ? myRun.closer = true : myRun.closer = false);
    myMember.runs.pop(); //Replace the last run in the array with this one.
    myMember.runs.push(myRun);
    return myRun;
}

function addRunsRow(myLevel) {
    var runsTable = document.getElementById("runsTable");
    var runsTableBody = document.getElementById("runsBody");
    var runRow = document.createElement("tr");
    var teacherCell = document.createElement("td");
    var classCell = document.createElement("td");
    var teamCell = document.createElement("td");
    var levelCell = document.createElement("td");
    var interruptsCell = document.createElement("td");

    var number1Cell = document.createElement("td");
    number1Cell.style.borderLeftWidth = "2px";
    var number2Cell = document.createElement("td");
    number2Cell.style.borderLeftWidth = "2px";
    var number3Cell = document.createElement("td");
    number3Cell.style.borderLeftWidth = "2px";
    var numberTotCell = document.createElement("td");
    numberTotCell.style.borderLeftWidth = "2px";

    var avgLength1Cell = document.createElement("td");
    var avgLength2Cell = document.createElement("td");
    var avgLength3Cell = document.createElement("td");
    var avgLengthTotCell = document.createElement("td");

    var pctCloser1Cell = document.createElement("td");
    var pctCloser2Cell = document.createElement("td");
    var pctCloser3Cell = document.createElement("td");
    var pctCloserTotCell = document.createElement("td");

    var membersByBoard = [1, 2, 3]; //Array of members ordered by board so that they correspond to the actions table

    for (var h = 0; h < myLevel.members.length; h++) {
        membersByBoard[myLevel.members[h].board] = myLevel.members[h];
    }

    teacherCell.innerHTML = myLevel.teacher.name;
    classCell.innerHTML = myLevel.team.classId;
    teamCell.innerHTML = myLevel.team.name;
    levelCell.innerHTML = myLevel.label;
    interruptsCell.innerHTML = myLevel.interrupts.length;

    number1Cell.innerHTML = membersByBoard[0].runs.length;
    number2Cell.innerHTML = membersByBoard[1].runs.length;
    number3Cell.innerHTML = membersByBoard[2].runs.length;
    numberTotCell.innerHTML = myLevel.runs;

    avgLength1Cell.innerHTML = parseInt(100 * membersByBoard[0].runsAvgLength) / 100;
    avgLength2Cell.innerHTML = parseInt(100 * membersByBoard[1].runsAvgLength) / 100;
    avgLength3Cell.innerHTML = parseInt(100 * membersByBoard[2].runsAvgLength) / 100;
    avgLengthTotCell.innerHTML = parseInt(100 * myLevel.resistorChanges / myLevel.runs) / 100;

    pctCloser1Cell.innerHTML = membersByBoard[0].runsPctCloser;
    pctCloser2Cell.innerHTML = membersByBoard[1].runsPctCloser;
    pctCloser3Cell.innerHTML = membersByBoard[2].runsPctCloser;
    pctCloserTotCell.innerHTML = myLevel.runsPctCloser

    runRow.appendChild(teacherCell);
    runRow.appendChild(classCell);
    runRow.appendChild(teamCell);
    runRow.appendChild(levelCell);
    runRow.appendChild(interruptsCell);
    runRow.appendChild(number1Cell);
    runRow.appendChild(avgLength1Cell);
    runRow.appendChild(pctCloser1Cell);
    runRow.appendChild(number2Cell);
    runRow.appendChild(avgLength2Cell);
    runRow.appendChild(pctCloser2Cell);
    runRow.appendChild(number3Cell);
    runRow.appendChild(avgLength3Cell);
    runRow.appendChild(pctCloser3Cell);
    runRow.appendChild(numberTotCell);
    runRow.appendChild(avgLengthTotCell);
    runRow.appendChild(pctCloserTotCell);
    runsTableBody.appendChild(runRow);
    runsTable.style.display = "inline";
}


function toggleShowRuns() {
    var toggleRunsButton = document.getElementById("toggleRunsButton")
    var runsSpan = document.getElementById("runsSpan");
    var runsTable = document.getElementById("runsTable");
    var runsTableBody = document.getElementById("runsBody");
    if (runsSpan.innerHTML == "Hide resistor change runs") {
        runsSpan.innerHTML = "Display resistor change runs";
    } else {
        runsSpan.innerHTML = "Hide resistor change runs"
    }
    updateRunsTable();
}

function updateRunsTable() {
    removeRunsTable();
    var levelButtons = document.getElementsByName("levelRadio"),
        runsSpan = document.getElementById("runsSpan"),
        runsTable = document.getElementById("runsTable"),
        runsTableBody = document.getElementById("runsBody"),
        runLevels = [],
        id;
    runsTable.style.display = "none"; //To avoid flicker
    for (var j = 0; j < levelButtons.length; j++) {
        id = levelButtons[j].id;
        myLevel = getLevelByID(id);
        runLevels.push(myLevel);
    }
    for (var i = 0, myLevel; myLevel = runLevels[i]; i++) {
        addRunsRow(myLevel);
    }
    if (runsSpan.innerHTML == "Hide resistor change runs") {
        runsTable.style.display = "inline";
    } else {
        runsTable.style.display = "none";
    }
}

function removeRunsTable() {
    var runsTableBody = document.getElementById("runsBody");
    var children = runsTableBody.childNodes;
    var length = children.length;
    for (var i = children.length; i > 0; i--) {
        runsTableBody.removeChild(children[i - 1]);
    }
}

function setRunInterval() {
    var iSlider = document.getElementById("intervalSlider");
    var iOutput = document.getElementById("intervalBox");
    runInterval = iSlider.value;
    iOutput.innerHTML = runInterval;
    for (var i = 0; i < selectedLevels.length; i++) {
        myLevel = selectedLevels[i];
        clearRunsInfo(myLevel);
        findResistorChangeRuns(myLevel, runInterval);
        findInterrupts(myLevel);
        updateRunsTable();
    }
}

function clearRunsInfo(myLevel) { //Clears all run information from level and members
    myLevel.runs = 0;
    myLevel.interrupts = [];
    myLevel.runsAvgLength = 0;
    myLevel.runsPctCloser = 0;
    for (var i = 0; i < myLevel.members.length; i++) {
        myMember = myLevel.members[i];
        myMember.runs = [];
        myMember.runsAvgLength = 0;
        myMember.runsCloser = 0;
        myMember.runsPctCloser = 0;
        myMember.onARun = false;
    }
}