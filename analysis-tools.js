//This is where we do all the analysis of the files once the raw data has been parsed
function analyze(rowObjs) {
    for (var i = 0; i < rowObjs.length; i++) {
        var ro = rowObjs[i];
        var ev = ro["event"];
        var type = ro.parameters["type"];
        var time = ro["time"];
        switch (ev) {
            case "Activity Settings":
                addActivitySettings(ro);
                break;
            case "model values":
                addModelValues(ro);
                break;

            case "Joined Group":
                addJoinedGroup(ro);
                break;

            case "Opened Zoom View":
                addOpenedZoom(ro);
                break;
            case "Closed Zoom View":
                addClosedZoom(ro);
                break;
            case "Changed circuit":
                switch (type) {
                    case "changed component value":
                        addRChange(ro);
                        break;
                    case "disconnect lead":
                        addDisconnectLead(ro);
                        break;
                    case "connect lead":
                        addConnectLead(ro);
                        break;
                }
                break;
            case "Sent message":
                addMessage(ro);
                break;
            case "Calculation performed":
                addCalculation(ro);
                break;
            case "Submit clicked":
                addSubmit(ro);
                break;
            case "Unknown Values Submitted":
                addSubmitER(ro);
                break;
            case "Attached probe":
                addAttachProbe(ro);
                break;
            case "Detached probe":
                addDetachProbe(ro, i);
                break;
            case "DMM measurement":
                addMeasurement(ro, i);
                break;

            case "Moved DMM dial":
                addMovedDial(ro, i);
                break;
        }
    }
}

//General function for adding a new action. Sets all the parameters the different actions have in common.
function addAction(ro, type) {
    var teamFound = false;
    var teamName = ro.parameters["groupname"];
    for (var k = 0; k < teams.length; k++) {
        if (teamName && (teams[k].name == teamName)) {
            teamFound = true;
            myTeam = teams[k];
        }
    }
    if (!teamFound) {
        return;
    }
    var levelFound = false;
    var levelName = ro.parameters["levelName"];
    if (levelName) {
        var levelNumber = getLevelNumber(levelName); //0 for tutorial, 1 for level A, etc.
        for (var i = 0; i < myTeam.levels.length; i++) {
            if (myTeam.levels[i].number == levelNumber) {
                myLevel = myTeam.levels[i];
                levelFound = true;
            }
        }
    } else {
        console.log("No level name found! Class " + ro.class_id);
    }
    if (!levelFound) {
        // console.log("No level found in add action. Team = " + myTeam.name + ", level number = " + number);
        return;
    }
    var memberID = ro["username"].slice(0, ro["username"].indexOf("@")); // memberID precedes @, changed with MC3PA!
    var memberFound = false;
    for (var j = 0; j < myLevel.members.length; j++) {
        if (myLevel.members[j].id == memberID) {
            memberFound = true;
            myMember = myLevel.members[j];
        }
    }
    if (!memberFound) {
        return;
    }
    var myAction = new action;
    myAction.R = [];
    myAction.V = [];
    myAction.goalR = [];
    myAction.goalRIndex = [];
    myAction.goalV = [];
    myAction.E = myLevel.E;
    myAction.R0 = myLevel.R0;
    if ((type != "resistorChange") && (myAction.R.length == 3)) {
        var newR = [];
        //Check to make sure R hasn't changed.
        newR[0] = parseInt(ro.parameters["r1"]);
        newR[1] = parseInt(ro.parameters["r2"]);
        newR[2] = parseInt(ro.parameters["r3"]);
        for (var ii = 0; ii < 3; ii++) {
            if (newR[ii] != myLevel.R[ii]) {
                console.log("mysterious R change detected");
            }
        }
    }
    for (var j = 0; j < 3; j++) {
        myAction.R[j] = myLevel.R[j];
        myAction.V[j] = myLevel.V[j];
        myAction.goalR[j] = myLevel.goalR[j]; //goal values may change during the level if something goes wrong
        grStr = myAction.goalR[j].toString();
        myAction.goalRIndex[j] = resIndex[grStr];
        myAction.goalV[j] = myLevel.goalV[j];
    }
    myAction.type = type;
    myAction.team = myTeam;
    myAction.level = myLevel;
    myAction.actor = myMember;
    myAction.actor.id = myMember.id;
    myAction.time = ro["time"];
    myAction.uTime = new Date(ro["time"]).getTime() / 1000;
    myAction.eTime = Math.round(myAction.uTime - myLevel.firstActionUTime);
    if (myAction.eTime >= 0) {
        var eMins = String(Math.floor(myAction.eTime / 60));
        var eSecs = myAction.eTime % 60 > 9 ? String(myAction.eTime % 60) : "0" + String(myAction.eTime % 60);
    } else {
        var absETime = -myAction.eTime;
        var eMins = "-" + String(Math.floor((absETime / 60)));
            var eSecs = (absETime % 60 > 9) ? String(absETime % 60) : "0" + String(absETime % 60);
        }
        myAction.eMinSecs = eMins + ":" + eSecs;
        myAction.pTime = unixTimeConversion(myAction.uTime);
        myAction.board = parseInt(ro.parameters["board"]);
        myAction.index = myLevel.actions.length; //The length of the array before the action is pushed. (The index of the action
        //if it is pushed will equal this.)
        myAction.currentFlowing = false;
        if ((ro.parameters["currentFlowing"] == "true") || ro.parameters["currentFlowing"] == "TRUE") {
            myAction.currentFlowing = true;
        }
        myLevel.lastActionUTime = myAction.uTime;
        myLevel.lastActionTime = myAction.time;
        if (!myAction) {
            console.log("Returning a null action!");
        }
        return myAction;
    }

    function findRValues(ro, oldR) {
        var newR = [];
        newR = oldR;
        if ((ro.parameters["r1"] != "") && (ro.parameters["r1"] != "unknown")) {
            newR[0] = parseInt(ro.parameters["r1"])
        }
        if ((ro.parameters["r2"] != "") && (ro.parameters["r2"] != "unknown")) {
            newR[1] = parseInt(ro.parameters["r2"])
        }
        if ((ro.parameters["r3"] != "") && (ro.parameters["r3"] != "unknown")) {
            newR[0] = parseInt(ro.parameters["r3"])
        }
        return newR;
    }

    function findVValues(E, R0, R) { //Computes V given E, R0 and current R values. Returns V values.
        var Rtot;
        var V = [];
        Rtot = R0 + R[0] + R[1] + R[2];
        for (var i = 0; i < 3; i++) {
            V[i] = Math.round(100 * (E * R[i] / Rtot)) / 100;
        }
        return V;
    }

    //Function for detecting duplicate actions by comparing them to previous actions
    function duplicate(action) {
        if (!action) {
            return true; //If action is undefined we want to do nothing with it.
        }
        var actions = action.level.actions; //Array of actions for this level
        var dup = false;
        var thisAct = action,
            thisID = thisAct.actor.id,
            thisTime = thisAct.uTime,
            thisType = thisAct.type,
            thisTeam = thisAct.team;
        var checkAct,
            checkID,
            checkTime,
            checkType,
            checkTeam,
            checkbackLength = 5;
        for (var i = 1;
            (actions[thisAct.index - i] && i < checkbackLength); i++) { //check five actions back or as far back as there are actions in the list
            checkAct = actions[thisAct.index - i];
            if (checkAct.actor.id && checkAct.uTime && checkAct.type) {
                checkID = checkAct.actor.id
                checkTime = checkAct.uTime;
                checkType = checkAct.type;
                checkTeam = checkAct.team;
                if ((checkID == thisID) && (checkType == thisType) && (checkTeam == thisTeam) && (Math.abs(thisTime - checkTime) < 1)) {
                    dup = true;
                }
            }
        }
        return dup //If any of the checked previous action matches, there is a duplicate
    }

    function addActivitySettings(ro) {
        var myAction = addAction(ro, "activity-settings");
        if (!(duplicate(myAction))) {
            if (!(duplicate(myAction))) {
                myLevel = myAction.level;
                myLevel.E = parseInt(ro.parameters["E"]);
                myLevel.R0 = parseInt(ro.parameters["R0"]); //Note: this variable is R0, not R in event activity settings!
                myAction.E = myLevel.E;
                myAction.R0 = myLevel.R0;
                myLevel.actions.push(myAction);
            }
        }
    }

    function addModelValues(ro) {
        var myAction = addAction(ro, "model-values");
        if (!(duplicate(myAction))) {
            var myLevel = myAction.level;
            myLevel.E = parseInt(ro.parameters["E"]);
            myLevel.goalV[0] = parseFloat(ro.parameters["V1"]);
            myLevel.goalV[1] = parseFloat(ro.parameters["V2"]);
            myLevel.goalV[2] = parseFloat(ro.parameters["V3"]);
            myLevel.goalR[0] = parseInt(ro.parameters["GoalR1"]);
            myLevel.goalR[1] = parseInt(ro.parameters["GoalR2"]);
            myLevel.goalR[2] = parseInt(ro.parameters["GoalR3"]);
            myAction.E = myLevel.E;
            for (var i = 9; i < 3; i++) {
                myAction.goalV[i] = myLevel.goalV[i];
                myAction.goalR[i] = myLevel.goalR[i];
            }
            myAction.level.actions.push(myAction);
        }
    }

    function addJoinedGroup(ro) {
        var myAction = addAction(ro, "joined-group");
        if (!(duplicate(myAction))) {
            var myLevel = myAction.level;
            if (myLevel.members.length == 3) {
                myLevel.lastJoinedTime = myAction.eMinSecs;
                myLevel.lastJoinedUTime = myAction.uTime;
            }
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addOpenedZoom(ro) {
        var myAction = addAction(ro, "opened-zoom");
        if (!(duplicate(myAction))) {
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addClosedZoom(ro) {
        var myAction = addAction(ro, "closed-zoom");
        if (!(duplicate(myAction))) {
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addConnectLead(ro) {
        var myAction = addAction(ro, "connect-lead");
        if (!(duplicate(myAction))) {
            myAction.location = ro.parameters["location"];
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        } else {
            //        console.log("Passed over a connect lead action at . " + myAction.time);
        }
    }

    function addDisconnectLead(ro) {
        var myAction = addAction(ro, "disconnect-lead");
        if (!(duplicate(myAction))) {
            myAction.location = ro.parameters["location"];
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addRChange(ro) {
        var myAction = addAction(ro, "resistorChange");
        if (!(duplicate(myAction))) {
            myAction.oldR = [];
            myAction.newR = [];
            var myLevel = myAction.level,
                bd = myAction.board,
                bdA = (bd + 1) % 3,
                bdB = (bd + 2) % 3,
                oldGoalDifference,
                newGoalDifference;
            for (var i = 0; i < 3; i++) {
                myAction.oldR[i] = myLevel.R[i];
                myAction.newR[i] = myAction.oldR[i]; // Only one R is going to change
            }
            myAction.newR[bd] = parseInt(ro.parameters["value"]); //So set the value for the changed R.
            myAction.oldV = findVValues(myAction.E, myAction.R0, myAction.oldR);
            myAction.newV = findVValues(myAction.E, myAction.R0, myAction.newR)

            if ((!(isNaN(myAction.newR[0])) && !(isNaN(myAction.newR[1])) && !(isNaN(myAction.newR[2]))) &&
                ((myAction.newR[0] != myAction.oldR[0]) || (myAction.newR[1] != myAction.oldR[1]) || (myAction.newR[2] != myAction.oldR[2]))) {
                oldGoalDifference = myAction.oldV[bd] - myAction.goalV[bd];
                newGoalDifference = myAction.newV[bd] - myAction.goalV[bd];
                totalGoalDifference = Math.abs(myAction.newV[0] - myAction.goalV[0]) + Math.abs(myAction.newV[1] - myAction.goalV[1]) + Math.abs(myAction.newV[2] - myAction.goalV[2]);
                myAction.attainedVsMsg = (totalGoalDifference < .01 ? ", goal voltages attained, " : ", goal voltages not attained, ");
                if (Math.abs(totalGoalDifference) < .01) {
                    if (!myLevel.attainedVs) { //only record time the first time
                        myLevel.attainedVsTime = myAction.eTime;
                        myLevel.attainedVseMinSecs = myAction.eMinSecs;
                    }
                    myLevel.attainedVs = true;
                } else if ((myLevel.attainedVs) && (!myLevel.movedAwayFromV)) {
                    myLevel.movedAwayFromV = true;
                    myLevel.movedAwayFromVTime = myAction.eTime;
                    myLevel.movedAwayFromVMinSecs = myAction.eMinSecs;
                }
                if (Math.abs(newGoalDifference) < .01) {
                    myAction.goalMsg = ". Local goal met";
                } else if (Math.sign(oldGoalDifference) != Math.sign(newGoalDifference) &&
                    (newGoalDifference > 0)) {
                    myAction.goalMsg = ". Goal overshot";
                } else if (Math.sign(oldGoalDifference) != Math.sign(newGoalDifference) &&
                    (newGoalDifference < 0)) {
                    myAction.goalMsg = ". Goal undershot";
                } else if (Math.abs(newGoalDifference) < Math.abs(oldGoalDifference)) {
                    myAction.goalMsg = ". Goal closer";
                } else if (Math.abs(newGoalDifference) > Math.abs(oldGoalDifference)) {
                    myAction.goalMsg = ". Goal farther";
                }
                for (var jk = 0; jk < 3; jk++) {
                    myAction.R[jk] = myAction.newR[jk];
                    myLevel.R[jk] = myAction.newR[jk]; //Save the new values in the level (they will become the old values for the next resistor change event)
                    myAction.V[jk] = myAction.newV[jk];
                    myLevel.V[jk] = myAction.newV[jk]; //Save the new values in the level (they will become the old values for the next resistor change event)
                };
                var oldRIndex = resIndex[myAction.oldR[bd].toString()];
                var newRIndex = resIndex[myAction.newR[bd].toString()];
                myAction.resJump = newRIndex - oldRIndex;
                myAction.resDist = resDist(myAction); // The number of resistances we are away from the closest appro.parameters["groupname"]ch to the goal V
                myAction.level.actions.push(myAction); //and push the action onto the level
            }
        }
    }

    function addMessage(ro) {
        var myAction = addAction(ro, "message");
        if (!(duplicate(myAction))) {
            if (ro.parameters["message"]) {
                myAction.msg = ro.parameters["message"];
            } else {
                myAction.msg = ro["event_value"];
            }
            myAction.varRefs = getVarRefs(myAction, myAction.msg);
            myAction.score = scoreAction(myAction);
            myAction.highlightedMsg = highlightMessage(myAction, myAction.msg);
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addCalculation(ro) {
        myAction = addAction(ro, "calculation");
        if (!(duplicate(myAction))) {
            myAction.cMsg = ro.parameters["calculation"];
            myAction.rMsg = ro.parameters["result"];
            myAction.msg = myAction.cMsg + " = " + myAction.rMsg
            myAction.cvarRefs = getVarRefs(myAction, myAction.cMsg);
            myAction.rvarRefs = getVarRefs(myAction, myAction.rMsg);
            myAction.varRefs = myAction.cvarRefs.concat(myAction.rvarRefs);
            myAction.highlightedMsg = highlightMessage(myAction, myAction.msg);
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addMeasurement(ro, i) {
        var myAction = addAction(ro, "measurement");
        if (!(duplicate(myAction))) {
            myAction.dialPosition = ro.parameters["dial_position"];
            myAction.measurementType = ro.parameters["measurement"];
            myAction.blackPosition = ro.parameters["black_probe"];
            myAction.redPosition = ro.parameters["red_probe"];
            if (myAction.blackPosition.slice(1) === myAction.redPosition.slice(1) && //same column
                (myAction.blackPosition[0] !== myAction.redPosition[0])) { //and different row
                myAction.gapMeasurement = true; //means measurement across a gap
            } else {
                myAction.gapMeasurement = false;
            }
            myAction.currentFlow = (ro.parameters["currentFlowing"] == "True" ? true : false);
            myAction.board = ro.parameters["board"];
            myAction.msg = ro.parameters["result"].replace(/\s/g, '');
            myAction.varRefs = getVarRefs(myAction, myAction.msg);
            myAction.highlightedMsg = highlightMessage(myAction, myAction.msg);
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addSubmit(ro) {
        var myAction = addAction(ro, "submitClicked");
        if (!duplicate(myAction)) {
            myLevel = myAction.level;
            var V1 = myAction.V[0];
            var V2 = myAction.V[1];
            var V3 = myAction.V[2];
            var goalV1 = myAction.goalV[0];
            var goalV2 = myAction.goalV[1];
            var goalV3 = myAction.goalV[2];
            var voltagesCorrectlySubmitted = (Math.abs(V1 - goalV1) + Math.abs(V2 - goalV2) + Math.abs(V3 - goalV3) < .01)
            if (voltagesCorrectlySubmitted) { //if they've got the right voltages
                if (!(myLevel.successV)) { //and this is the first time
                    myLevel.VSuccessTime = myAction.eMinSecs; //remember the time
                    myLevel.successVTime = myAction.uTime;
                    myLevel.successV = true; //set successV true
                }
            }
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addSubmitER(ro) {
        var myAction = addAction(ro, "submitER");
        if (!duplicate(myAction)) {
            myTeam = myAction.team;
            myLevel = myAction.level;
            (ro.parameters["E: Value"] ? myAction.ESubmitValue = ro.parameters["E: Value"] : myAction.ESubmitValue = "<No value submitted>");
            (ro.parameters["E: Unit"] ? myAction.ESubmitUnit = ro.parameters["E: Unit"] : myAction.ESubmitUnit = "");
            (ro.parameters["R: Value"] ? myAction.RSubmitValue = ro.parameters["R: Value"] : myAction.RSubmitValue = "<No value submitted>");
            (ro.parameters["R: Unit"] ? myAction.RSubmitUnit = ro.parameters["R: Unit"] : myAction.RSubmitUnit = "");

            if (!myLevel.successE) { //Only set this variable if it's the first time.
                if ((myAction.ESubmitValue == myLevel.E) && (myAction.ESubmitUnit ==
                        "volts")) {
                    myLevel.successE = true;
                    myLevel.successETime = myAction.uTime;
                }
            }
            if (!myLevel.successR) { //Only set this variable if it's the first time.
                if ((myAction.RSubmitValue == myLevel.R0) && (myAction.RSubmitUnit ==
                        "ohms")) {
                    myLevel.successR = true;
                    myLevel.successRTime = myAction.uTime;
                }
            }
            myAction.varRefs = [];
            myAction.varRefs.push(getVarRefs(myAction, myAction.ESubmitValue));
            myAction.varRefs.push(getVarRefs(myAction, myAction.RSubmitValue));
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addAttachProbe(ro) {
        var myAction = addAction(ro, "attach-probe");
        if (!(duplicate(myAction))) {
            myAction.location = ro.parameters["location"];
            myAction.probeColor = ro.parameters["color"];
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addDetachProbe(ro, i) {
        var myAction = addAction(ro, "detach-probe");
        if (!(duplicate(myAction))) {
            myAction.location = ro.parameters["location"];
            myAction.probeColor = ro.parameters["color"];
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function addMovedDial(ro, i) {
        var myAction = addAction(ro, "move-dial");
        if (!(duplicate(myAction))) {
            myAction.dialPosition = ro.parameters["value"];
            keepLevelValues(myAction);
            myAction.level.actions.push(myAction);
        }
    }

    function keepLevelValues(myAction) {
        myLevel = myAction.level;
        myAction.E = myLevel.E;
        myAction.R0 = myLevel.R0;
        for (var i = 0; i < 3; i++) {
            myAction.R[i] = myLevel.R[i];
            myAction.V[i] = myLevel.V[i];
            myAction.goalR[i] = myLevel.goalR[i];
            myAction.goalV[i] = myLevel.goalV[i];
        }
    }