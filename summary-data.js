function setSuccessFlag(myLevel) {
    if ((myLevel.label == "A") || (myLevel.label == "B")) {
        return (myLevel.successV);
    } else if (myLevel.label == "C") {
        return (myLevel.successV) && (myLevel.successE);
    } else if (myLevel.label == "D") {
        return (myLevel.successV && myLevel.successE && myLevel.successR);
    } else {
        console.log("Illegal level label");
    }
}

function findSummaryData(myLevel, prFlag) { //Runs through all the actions in myLevel collecting summary data, print if prFlag
    // Set up variables
    myLevel.success = setSuccessFlag(myLevel);
    var acts = myLevel.actions;
    var team = myLevel.team;
    myLevel.endUTime = computeEndUTime(myLevel);
    var levelTime = Math.round(myLevel.endUTime - myLevel.startUTime);
    var levelMinutes = Math.round(levelTime / 60);
    var levelSeconds = levelTime % 60;
    if (levelSeconds < 10) {
        levelSeconds = "0" + levelSeconds;
    }
    var myDate = myLevel.startPTime;
    if (myDate) {
        var levelDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
    }

    var messagesBeforeVsCount = [0, 0, 0],
        messagesBeforeVsTotal = 0,
        messagesAfterVsCount = [0, 0, 0],
        messagesAfterVsTotal = 0,
        messagesWithoutVsCount = [0, 0, 0],
        messagesWithoutVsTotal = 0,
        calculationsBeforeVsCount = [0, 0, 0],
        calculationsBeforeVsTotal = 0,
        calculationsAfterVsCount = [0, 0, 0],
        calculationsAfterVsTotal = [0],
        calculationsWithoutVsCount = [0, 0, 0],
        calculationsWithoutVsTotal = 0,
        resistorChangesBeforeVsCount = [0, 0, 0],
        resistorChangesBeforeVsTotal = 0,
        resistorChangesAfterVsCount = [0, 0, 0],
        resistorChangesAfterVsTotal = 0,
        resistorChangesWithoutVsCount = [0, 0, 0],
        resistorChangesWithoutVsTotal = 0,
        sumResistorDistancesFromGoal = [0, 0, 0],
        totalResistanceChanges = [0, 0, 0],
        averageResistanceDistances = [0, 0, 0],
        joinedGroupCount = 0,
        levelVMsg = "",
        successMsg = "";
    myLevel.errorMsg = ""; //This one is added to the level so that we can report it in the level row.
    // Run through actions compiling level summary data  
    for (var ii = 0; ii < acts.length; ii++) {
        thisAction = acts[ii];
        index = thisAction.actor.colIndex;
        switch (thisAction.type) {
            //Count messages before and after voltage attained success (if any)
            case "message":
                if (myLevel.attainedVs) {
                    if (thisAction.eTime <= myLevel.attainedVsTime) {
                        messagesBeforeVsCount[index]++;
                        messagesBeforeVsTotal++;
                    } else {
                        messagesAfterVsCount[index]++;
                        messagesAfterVsTotal++;
                    }
                } else {
                    messagesWithoutVsCount[index]++;
                    messagesWithoutVsTotal++;
                }
                break;
            //Same for calculations and resistor changes
            case "calculation":
                if (myLevel.attainedVs) {
                    if (thisAction.eTime <= myLevel.attainedVsTime) {
                        calculationsBeforeVsCount[index]++;
                        calculationsBeforeVsTotal++;
                    } else {
                        calculationsAfterVsCount[index]++;
                        calculationsAfterVsTotal++;
                    }
                } else {
                    calculationsWithoutVsCount[index]++;
                    calculationsWithoutVsTotal++;
                }
                break;

            case "resistorChange":
                if (myLevel.attainedVs) {
                    if (thisAction.eTime <= myLevel.attainedVsTime) {
                        resistorChangesBeforeVsCount[index]++;
                        totalResistanceChanges[index]++;
                        resistorChangesBeforeVsTotal++;
                        sumResistorDistancesFromGoal[index] += thisAction.resDist;
                    } else {
                        resistorChangesAfterVsCount[index]++;
                        totalResistanceChanges[index]++;
                        resistorChangesAfterVsTotal++;
                        sumResistorDistancesFromGoal[index] += thisAction.resDist;
                    }
                } else {
                    resistorChangesWithoutVsCount[index]++;
                    totalResistanceChanges[index]++;
                    resistorChangesWithoutVsTotal++;
                    sumResistorDistancesFromGoal[index] += thisAction.resDist;
                }
                break;

            case "joined-group":
                joinedGroupCount++;
                break;
        } //End of switch body
    } //Next action

    for (var u = 0; u < 3; u++) {
        if (totalResistanceChanges[u] == 0) {
            averageResistanceDistances[u] = 0;
        } else {
            averageResistanceDistances[u] = Math.round(10 * sumResistorDistancesFromGoal[u] / totalResistanceChanges[u]) / 10;
        }
        totalAverageResDist = Math.round(10 * (sumResistorDistancesFromGoal[0] + sumResistorDistancesFromGoal[1] + sumResistorDistancesFromGoal[2]) / (totalResistanceChanges[0] + totalResistanceChanges[1] + totalResistanceChanges[2])) / 10;
    }

    //Tag levels with technical problems by creating an error message
    if (joinedGroupCount > 3) {
        myLevel.errorMsg += " <font color=red>Note: high JoinGroup count = " + joinedGroupCount + "</font><br>"
    }

    if (joinedGroupCount < 3) {
        myLevel.errorMsg += " <font color=red>Note: Fewer than three joined-group actions! Total time may be incorrect.</font><br>"
    }

    if (myLevel.levelValuesChanged) {
        myLevel.errorMsg += " <font color=red>Note: Level values changed. Check activity-settings actions.</font><br>"
    }

    if (prFlag) { // skip printing unless query of teams/levels is requested
        //Create summary messages for this level
        if (myLevel.success) {
            levelVMsg = "Goal voltages correctly reported at " + myLevel.VSuccessTime + "."
        } else {
            levelVMsg = "Goal voltages not reported correctly."
        };
        var levelEMsg = (myLevel.successE ? " E correctly reported." : " E not reported correctly.");
        var levelRMsg = (myLevel.successR ? " R0 correctly reported." : " R0 not reported correctly.");
        var levelMsg,
            goalVMsg,
            goalV1Communicated = false,
            goalV2Communicated = false,
            goalV3Communicated = false;
        if (myLevel.movedAwayFromV) {
            goalVMsg = "Attained goal voltages at " + myLevel.attainedVseMinSecs + " and then moved away at " + myLevel.movedAwayFromVMinSecs + ". ";
        } else if (myLevel.attainedVs) {
            goalVMsg = "Attained correct goal voltages at " + myLevel.attainedVseMinSecs + ". "
        } else {
            goalVMsg = "Never attained goal voltages. "
        }
        if ((myLevel.label == "A") || (myLevel.label == "B")) {
            levelMsg = levelVMsg;
        }
        if (myLevel.label == "C") {
            levelMsg = levelVMsg + levelEMsg;
        }
        if (myLevel.label == "D") {
            levelMsg = levelVMsg + levelEMsg + levelRMsg;
        }
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
        if ((goalV1Communicated) && (goalV2Communicated) && (goalV3Communicated)) {
            goalVMsg += " Goal voltages chatted. ";
        } else {
            goalVMsg += "Goal voltages not chatted. ";
        }

        // Print summary
        if (!myLevel.attempted) {
            document.getElementById("data").innerHTML += "<br> <mark>Team " + myLevel.team.name + ", level " + myLevel.label + "</mark> <span style=\"color:#FF0000;\"> not attempted.</span><br>";
        } else {
            if (myLevel.success) {
                successMsg = "<b>Level successful. </b>";
            } else {
                successMsg = "<b>Level unsuccessful. </b>";
            }
            document.getElementById("data").innerHTML += ("<br><br><mark>Team " +
                team.name + ", level " + myLevel.label + "</mark>, start time: " + successMsg + myLevel.startPTime + ", duration: " + levelMinutes + ":" + levelSeconds + "<br>" + goalVMsg + levelMsg + "<br>");

            if (myLevel.errorMsg != "") {
                document.getElementById("data").innerHTML += (myLevel.errorMsg);
            }

            document.getElementById("data").innerHTML += "Average resistor distances from goal = " + averageResistanceDistances[0] + ", " + averageResistanceDistances[1] + ", " + averageResistanceDistances[2] + ". <span style = \"color:#FF0000;\"><b>Team average = " + totalAverageResDist + "</b></span><br>";

            if (myLevel.attainedVs) {
                document.getElementById("data").innerHTML += "<br><span style=\"color:#0000FF;\">Resistor changes performed before voltages attained:: </span>" + resistorChangesBeforeVsCount[0] + " + " + resistorChangesBeforeVsCount[1] + " + " + resistorChangesBeforeVsCount[2] + " = " + resistorChangesBeforeVsTotal + "<br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#FF0000;\">Messages sent before voltages attained: </span>" + messagesBeforeVsCount[0] + " + " + messagesBeforeVsCount[1] + " + " + messagesBeforeVsCount[2] + " = " + messagesBeforeVsTotal + "<br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#00DD00;\">Calculations performed before voltages attained:: </span>" + calculationsBeforeVsCount[0] + " + " + calculationsBeforeVsCount[1] + " + " + calculationsBeforeVsCount[2] + " = " + calculationsBeforeVsTotal + "<br><br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#0000FF;\">Resistor changes after voltages attained:: </span>" + resistorChangesAfterVsCount[0] + " + " + resistorChangesAfterVsCount[1] + " + " + resistorChangesAfterVsCount[2] + " = " + resistorChangesAfterVsTotal + "<br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#FF0000;\">Messages sent after voltages attained: </span>" + messagesAfterVsCount[0] + " + " + messagesAfterVsCount[1] + " + " + messagesAfterVsCount[2] + " = " + messagesAfterVsTotal + "<br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#00DD00;\">Calculations performed after voltages attained:: </span>" + calculationsAfterVsCount[0] + " + " + calculationsAfterVsCount[1] + " + " + calculationsAfterVsCount[2] + " = " + calculationsAfterVsTotal + "<br>";
            } else {
                document.getElementById("data").innerHTML += "<br><span style=\"color:#FF0000;\">Resistor changes: </span>" + resistorChangesWithoutVsCount[0] + " + " + resistorChangesWithoutVsCount[1] + " + " + resistorChangesWithoutVsCount[2] + " = " + resistorChangesWithoutVsTotal + "<br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#FF0000;\">Messages sent: </span>" + messagesWithoutVsCount[0] + " + " + messagesWithoutVsCount[1] + " + " + messagesWithoutVsCount[2] + " = " + messagesWithoutVsTotal + "<br>";

                document.getElementById("data").innerHTML += "<span style=\"color:#FF0000;\">Calculations: </span>" + calculationsWithoutVsCount[0] + " + " + calculationsWithoutVsCount[1] + " + " + calculationsWithoutVsCount[2] + " = " + calculationsWithoutVsTotal + "<br><br>";
            }
        }
    }
}