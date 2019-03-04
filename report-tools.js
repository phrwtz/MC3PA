function reportResults() {
    clearElement("actionsTable");
    var myLevel = findSelectedLevel();
    if (myLevel) {
        var actionsTable = document.createElement("table");
        actionsTable.id = "actionsTable";
        actionsTable.style.float = "left";
        document.getElementById("reportDiv").appendChild(actionsTable);
        var headerRow = document.createElement("tr");
        headerRow.id = "headerRow";
        actionsTable.appendChild(headerRow);
        var header = document.createElement("th");
        header.setAttribute("colspan", 4);
        header.style.backgroundColor = "#DDFFDD";
        headerRow.appendChild(header);
        var team = myLevel.team;
        header.innerHTML = "Team " + team.name + " (class ID " + team.classId + "), level " + myLevel.label;
        sortActionsByUTime(myLevel.actions);
        //Run through the actions publishing each in a separate row if it has been selected on the form
        for (var i = 0; i < myLevel.actions.length; i++) {
            var act = myLevel.actions[i],
                bd = act.board + 1,
                actor = act.actor,
                styledName = actor.styledName,
                currentMsg = (act.currentFlowing ? ". Current is flowing. " : ". Current is not flowing."),
                preTime, //Used to decide when to insert a horizontal line in the output
                uTime = act.uTime,
                eTime, //Elapsed time since start of level (will be negative for some actions)
                interval = 45; //Maximum interval between logged actions for considering them linked.
            if ((act.uTime - myLevel.startUTime) > 0) {
                eTime = (Math.round((act.uTime - myLevel.startUTime) * 10) / 10).toString();
            } else {
                eTime = "-" + (Math.round((myLevel.startUTime - act.uTime) * 10) / 10).toString();
            }
            switch (act.type) {
                case "submitClicked":
                    if ($("#action-submit-V")[0].checked) {
                        reportSubmitVoltages(act);
                    }
                    break;

                case "submitER":
                    if ($("#action-submit-ER")[0].checked) {
                        reportSubmitER(act);
                    }
                    break;

                case "resistorChange":
                    if ($("#action-resistorChange")[0].checked) {
                        reportResistorChange(act);
                    }
                    break;

                case "message":
                    if ($("#action-message")[0].checked) {
                        reportMessage(act);
                    }
                    break;

                case "calculation":
                    if ($("#action-calculation")[0].checked) {
                        reportCalculation(act);
                    }
                    break;

                case "attach-probe":
                    if ($("#action-attach-probe")[0].checked) {
                        reportAttachProbe(act);
                    }
                    break;

                case "detach-probe":
                    if ($("#action-detach-probe")[0].checked) {
                        reportDetachProbe(act);
                    }
                    break;

                case "connect-lead":
                    if ($("#action-connect-lead")[0].checked) {
                        reportConnectLead(act);
                    }
                    break;

                case "disconnect-lead":
                    if ($("#action-disconnect-lead")[0].checked) {
                        reportDisconnectLead(act);
                    }
                    break;

                case "joined-group":
                    if ($("#action-joined-group")[0].checked) {
                        reportJoinedGroup(act);
                    }
                    break;

                case "opened-zoom":
                    if ($("#action-opened-zoom")[0].checked) {
                        reportOpenedZoom(act);
                    }
                    break;

                case "closed-zoom":
                    if ($("#action-closed-zoom")[0].checked) {
                        reportClosedZoom(act);
                    }
                    break;

                case "measurement":
                    if ($("#action-measurement")[0].checked) {
                        reportMeasurement(act);
                    }
                    break;

                case "move-dial":
                    if ($("#action-move-DMM-dial")[0].checked) {
                        reportMovedDial(act);
                    }
                    break;

                case "activity-settings":
                    if ($("#action-activity-settings")[0].checked) {
                        reportActivitySettings(act);
                    }
                    break;
            } //End of switch block
        } //End of actions
        //  reportVarRefs(acts);
    } else {
        document.getElementById("actionsTable").style.display = "none";
    }
}

function reportVarRefs(acts) {
    var level = acts[0].level,
        team = level.team,
        varRefs,
        vrArray,
        vr,
        act,
        vrStr,
        vrNum,
        oMsg,
        vrScore;

    document.getElementById("data").innerHTML += ("<br><mark>Variable references for team " + team.name + "(" + team.classId + "), level " + myLevel.label + ":</mark><br>");
    varRefs = myLevel.varRefs;
    varRefCount = 0;
    for (var i = 0; i < vrLabelsArray.length; i++) {
        vrStr = vrLabelsArray[i];
        try {
            if ($("#varRef-" + vrStr)[0].checked) {
                document.getElementById("data").innerHTML += ("<br>");
                vrArray = varRefs[vrStr].sort(function (a, b) {
                    return (a[0].uTime - b[0].uTime)
                }); //contains all the varRefs of type vrStr;
                for (var ii = 0; ii < vrArray.length; ii++) {
                    vr = vrArray[ii];
                    act = vr[0];
                    o = ""; // String used to return other matching varRefs
                    vrNum = vr[2];
                    vrScore = vr[3];
                    var t = act.type;
                    var bd = parseInt(act.board) + 1;
                    oMsg = ""
                    switch (t) {
                        case "message":
                            t = "<span style=\"color:#FF0000;\">message</span>";
                            o = findOtherVariables(vr);
                            break;
                        case "calculation":
                            var vrInInput = false;
                            var vrInResult = false;
                            //Check to see whether the varRef is in the input of the calculation
                            for (var kk = 0; kk < act.cvarRefs.length; kk++) {
                                for (var kkk = 0; kkk < act.cvarRefs[kk].length; kkk++) {
                                    if (act.cvarRefs[kk][kkk][1] == vrStr) {
                                        vrInInput = true;
                                    }
                                }
                            }
                            //Check to see whether the varRef is in the result of the calculation
                            for (var rr = 0; rr < act.rvarRefs.length; rr++) {
                                for (var rrr = 0; rrr < act.rvarRefs[rr].length; rrr++) {
                                    if (act.rvarRefs[rr][rrr][1] == vrStr) {
                                        vrInResult = true;
                                    }
                                }
                            }
                            //Insert appropriate text. (Note: if varRef is in both we report that it's in the result.)
                            if (vrInInput) {
                                t = "<span style=\"color:#FF00FF;\">calculation input</span>";
                                o = findOtherVariables(vr);
                            }
                            if (vrInResult) {
                                t = "<span style=\"color:#FF00FF;\">calculation result</span>";
                                o = findOtherVariables(vr);
                            }
                            break;
                        case "measurement":
                            t = "<span style=\"color:#0000FF;\">measurement</span>";
                            o = findOtherVariables(vr);
                            break;
                        case "submitClicked":
                            t = "<span style=\"color:#00AAAA;\"></span>";
                            o = findOtherVariables(vr);
                            break;
                        case "submitER":
                            t = "<span style=\"color:#00AAAA;\">submitER</span>";
                            o = findOtherVariables(vr);
                            break;
                    }
                    if (o.length == 0) {
                        oMsg = ". No other references.";
                    } else if (o.length == 1) {
                        oMsg = ". One other reference: " + o[0];
                    } else {
                        oMsg += ". Other references: " + o[0];
                        for (var jj = 1; jj < o.length; jj++) {
                            oMsg += ", " + o[jj];
                        }
                    }
                    document.getElementById("data").innerHTML += ("Variable " + vrStr + " found at " + act.eMinSecs +
                        " seconds in a " + t + " by " + act.actor.styledName + ", board " + bd + oMsg + "<br>");
                    if (t == "calculation") {
                        console.log("vrInInput = " + vrInInput + ", vrInResult = " + vrInResult);
                    };
                    varRefCount++;
                }
            }
        } catch (err) {
            console.log(err + " in variable references report, vrStr = " + vrStr)
        }
    }
    console.log("report-tools: variable references report generated with " + varRefCount + " lines");
}

function variableInVarRef(vrStr, vrArray) { //Looks for the vrStr in vrArray. Returns true if found.
    for (var i = 0; i < vrArray.length; i++) {
        if (vrArray[i][0][1] == vrStr) {
            return true;
        }
    }
    return false;
}

function findOtherVariables(vr) { // Returns a string containing all the variable names that could have applied to the varRef vr (in other words, other variables that also matched the value field of vr)
    var otherStrs = [], //Array to be filled with the ambiguous variable names, if any
        theseVarRefs = [],
        thisAction = {},
        thisStr = "",
        thisVal = "",
        compareStr = "",
        compareVal = "";
    thisAction = vr[0]; //The action that is associated with the varRef we are examining
    theseVarRefs = thisAction.varRefs //Array of all the varRefs associated with thisAction.
    thisStr = vr[1]; //Variable name of the varRef we are examining
    thisVal = vr[2]; //Value of the varRef we are examining
    //We are interested in variables associated with this action that have the same values as the variable of the varRef we are examining. These are the ambiguous variables
    for (var i = 0; i < theseVarRefs.length; i++) {
        thisVarRef = theseVarRefs[i]; //An array of references, one for each variable that matched the value
        for (var j = 0; j < thisVarRef.length; j++) {
            thisReference = thisVarRef[j]; //each reference is a four-dimensional array consisting of the action that generated gthe match, a string represeting the variable that was matched, the number that was matched, and a score corresponding to that variable. All the references in thisVarRef will have the same action and number,but different strings and scores.
            compareStr = thisReference[1];
            compareVal = thisReference[2];
            if ((compareStr !== thisStr) && (compareVal === thisVal)) {
                otherStrs.push(compareStr);
            }
        }
    }
    return otherStrs;
}

//Reports on total number of resistor changes in each category for each team member, per level.
function reportResistorChanges(teams) {
    var count = {};
    if ($("#summary-resistor-change")[0].checked) {
        for (var k = 0; k < teams.length; k++) {
            var myTeam = teams[k];
            if ($("#team-" + myTeam.name + myTeam.classId)[0].checked) {
                count[myTeam.name] = {};
                for (var j = 0; j < myTeam.levels.length; j++) {
                    var myLevel = myTeam.levels[j];
                    if (myLevel.label != "T") {
                        if ($("#level-" + myLevel.label)[0].checked) {
                            count[myTeam.name][myLevel.label] = {};
                            var acts = myLevel.actions.sort(function (a, b) {
                                return (a.uTime - b.uTime)
                            });
                            for (var i = 0; i < myLevel.members.length; i++) {
                                var myMember = myLevel.members[i];
                                if (myMember) {
                                    count[myTeam.name][myLevel.label][myMember.name] = {};
                                    count[myTeam.name][myLevel.label][myMember.name].achieved = 0;
                                    count[myTeam.name][myLevel.label][myMember.name].overshot = 0;
                                    count[myTeam.name][myLevel.label][myMember.name].undershot = 0;
                                    count[myTeam.name][myLevel.label][myMember.name].closer = 0;
                                    count[myTeam.name][myLevel.label][myMember.name].farther = 0;;
                                    count[myTeam.name][myLevel.label][myMember.name].total = 0;
                                }
                            }
                            //clear all the counts for all members for this level
                            for (var ii = 0; ii < acts.length; ii++) {
                                act = acts[ii];
                                if (act.type == "resistorChange") {
                                    myMember = act.actor;
                                    switch (act.goalMsg) {
                                        case ". Local goal met":
                                            count[myTeam.name][myLevel.label][myMember.name].achieved += 1;
                                            count[myTeam.name][myLevel.label][myMember.name].total += 1;
                                            break;
                                        case ". Goal overshot":
                                            count[myTeam.name][myLevel.label][myMember.name].overshot += 1;
                                            count[myTeam.name][myLevel.label][myMember.name].total += 1;
                                            break;
                                        case ". Goal undershot":
                                            count[myTeam.name][myLevel.label][myMember.name].undershot += 1;
                                            count[myTeam.name][myLevel.label][myMember.name].total += 1;
                                            break;
                                        case ". Goal closer":
                                            count[myTeam.name][myLevel.label][myMember.name].closer += 1;
                                            count[myTeam.name][myLevel.label][myMember.name].total += 1;
                                            break;
                                        case ". Goal farther":
                                            count[myTeam.name][myLevel.label][myMember.name].farther += 1;
                                            count[myTeam.name][myLevel.label][myMember.name].total += 1;
                                            break;
                                    } //end of goalMsg switch
                                } //end of resistor change
                            } //end of actions
                        } //end of level check
                    } //drop to here if level is tutorial
                } //end of levels loop
            } //end of team check
        } //end of team loop
        printResistorReport(teams, count);
    } //come here if checkbox unchecked
} //end of reportResistorChanges

function printResistorReport(teams, count) {
    document.getElementById("data").innerHTML += ('<mark> <br> <tr> <td colspan = "4" align = "center" > Summary Resistor Change Report </td> </tr></mark>');
    for (var kk = 0; kk < teams.length; kk++) {
        var myTeam = teams[kk];
        if ($("#team-" + myTeam.name + myTeam.classId)[0].checked) {
            document.getElementById("data").innerHTML += ("<br><br>");
            for (var j = 0; j < myTeam.levels.length; j++) {
                var myLevel = myTeam.levels[j];
                if (!(myLevel.label == "T") && $("#level-" + myLevel.label)[0].checked) {
                    document.getElementById("data").innerHTML += ("<br>");
                    for (var i = 0; i < myLevel.members.length; i++) {
                        var myMember = myLevel.members[i];
                        if (myMember) {
                            var ach = count[myTeam.name][myLevel.label][myMember.name].achieved;
                            var clo = count[myTeam.name][myLevel.label][myMember.name].closer;
                            var und = count[myTeam.name][myLevel.label][myMember.name].undershot;
                            var ove = count[myTeam.name][myLevel.label][myMember.name].overshot;
                            var far = count[myTeam.name][myLevel.label][myMember.name].farther;
                            var tot = count[myTeam.name][myLevel.label][myMember.name].total;
                            var score = (tot ? Math.round(100 * ((tot - far) / tot)) : 0) / 100;
                            document.getElementById("data").innerHTML += ("Team: " + myTeam.name +
                                ", level " + myLevel.label +
                                ", member " + myMember.styledName + ": local goal met = " + ach +
                                ", overshot = " + ove + ", undershot = " + und + ", closer = " +
                                clo + ", farther = " + far + ", total = " + tot + ", score = " +
                                score + "<br>");
                        } //come here if no member
                    } //end of members loop
                } //come here if level checkbox unchecked
            } //end of levels loop
        } //come here if team checkbox unchecked
    } //end of teams loop
} //end of printResistorReport




//Identifies instances of "voltage regulator behavior" by looking for pairs of resistor changes where
//(a) the actor for the second is not the same as the actor for the first
//(b) the first moved the voltage of the second actor away from the goal
//(c) the second moves the voltage closer to the goal or overshoots, and
//(d) the second follows the first by no more than <timeInterval> seconds
//if additional resistor changes occur within the same <timeInterval> by the second player
//and are goal seeking, they are to be added to the voltage regulator transaction.
//Returns the array of resistorChange actions that belong to the transaction.
// function reportVoltageRegulator(teams) {
//     var previousActions = [];
//     if ($("#voltage-regulator")[0].checked) {
//         for (var k = 0; k < teams.length; k++) {
//             var team = teams[k];
//             if ($("#team-" + team.name)[0].checked) {
//                 for (var j = 0; j < team.levels.length; j++) {
//                     level = team.levels[j];
//                     if ($("#level-" + myLevel.label)[0].checked) {
//                         for (i = 0; i < myLevel.actions.length; i++) {
//                             act = myLevel.actions[i];
//                             if (act.type = "resistorChange") {
//                                 for (var j = 0; j < previousActions.length; j++) {
//                                     preAct = previousActions[j];
//                                     if (act.uTime - preAct.uTime < interval) {
//                                         previousActions.splice(j, 1); //If the j'th element in the array is too old, get rid ot it.
//                                     } else {
//                                         var board = act.board;
//                                         var preBoard = preAct.board;
//                                         bdDiff = (board - preBoard) % 3;
//                                         if (bdDiff != 0) { //If the two resistor changes were by different boards
//                                             var preGoalMsg = (bdDiff = 1 ? preAct.goalAMsg : preAct.goalBMsg);
//                                             if ((preGoalMsg == ". Goal farther") && (act.goalMsg = ". Goal closer")) {
//                                                 console.log("Voltage regulator activity identified!");
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

function reportMessageScores(teams, type) {
    if ($("#summary-action-scores")[0].checked) {
        myDate = teams[0].levels[0].startPTime;
        levelDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
        var count = 0,
            levelsArray = []; //An array of objects with numMsgs, totalScores and averageScores by level
        for (var j = 0; j < teams.length; j++) {
            var myTeam = teams[j];
            for (var i = 0; i < myTeam.levels.length; i++) {
                myLevel = myTeam.levels[i];
                if ((myLevel.members.length != 3)) {
                    break;
                }
                levelsArray[i] = scoreActions(myLevel);
            }
            var arrTotal = [];
            var arrNumber = [];
            var arrAvg = [];

            scoreTable = makeTeamTable(myTeam, myLevel, "Total message score", levelsArray, "Total", arrTotal);
            numberTable = makeTeamTable(myTeam, myLevel, "Number of messages", levelsArray, "Number", arrNumber);
            averageTable = makeTeamTable(myTeam, myLevel, "Average message score", levelsArray, "Average", arrAvg);
            for (var i = 0; i < myLevel.members.length; i++) { // push csv data for each player on this team
                count += arrNumber[i];
                // Teacher / Date / Team / Level / Time / Action / Actor / Total Msg Score / Number Msgs / Avg Msg Score
                newRow = [myTeam.teacher, levelDate, myTeam.name, , , "MsgScores", myLevel.members[i].name, arrTotal[i], arrNumber[i], arrAvg[i]];
                csvSummaryArray.push(newRow);
            }
            var tableSummary = document.createElement("div");
            tableSummary.className = "tableSummary";
            var tableRow = document.createElement("tr"); // contains all three: scoreTable, numberTable, averageTable
            var tableCell = document.createElement("th");

            document.body.appendChild(tableSummary);
            tableSummary.appendChild(scoreTable);
            tableSummary.appendChild(numberTable);
            tableSummary.appendChild(averageTable);
        } //Next level
    } //Next team
    Msg = "report-tools: " + count + " messages scored";
    console.log(Msg);
}

function teacherReport(teams) {
    var tableDiv = document.createElement("div");
    tableDiv.id = "tableDiv";
    document.body.appendChild(tableDiv);

    for (var i = 0; i < teams.length; i++) {
        var myTeam = teams[i];
        if ($("#report-" + myTeam.teacher.replace(" ", ""))[0].checked) {
            var memberNames = [];
            var firstLevel = myTeam.levels[0]; // level A, from which we get the member names
            for (k = 0; k < 3; k++) {
                memberNames[k] = firstLevel.members[k].name;
            }


            var table = document.createElement("table");
            table.className = "tableTeacher";
            tableDiv.appendChild(table);
            var titleRow = document.createElement("tr"); // row 1: table title
            table.appendChild(titleRow);
            var titleCell = document.createElement("th");
            titleCell.setAttribute("colspan", 5);
            titleRow.appendChild(titleCell);
            var headerRow = document.createElement("tr"); // row 2: column headings
            table.appendChild(headerRow);
            var headerCells = [];
            for (var ii = 0; ii < 5; ii++) {
                headerCells[ii] = document.createElement("th");
                headerRow.appendChild(headerCells[ii]);
            }
            headerCells[0].innerHTML = "Team";
            headerCells[1].innerHTML = "Level A";
            headerCells[2].innerHTML = "Level B";
            headerCells[3].innerHTML = "Level C";
            headerCells[4].innerHTML = "Level D";

            var dataRows = []; //table rows that will contain a team name and level data
            var dataCells = []; //table cells that contain the team name and level data


            myDate = myTeam.levels[0].startPTime;
            levelDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
            titleCell.innerHTML = "Results by team and level: " + myTeam.teacher + ", " + myTeam.class + ", " + levelDate;
            dataRows[i] = document.createElement("tr"); // row i+2: team, levels a, b, c, d
            table.appendChild(dataRows[i]);
            dataCells[i] = [];
            dataCells[i][0] = document.createElement("td");
            dataCells[i][0].innerHTML = "<b>" + myTeam.name + "</b><br>&nbsp;" +
                memberNames[0] + "<br>&nbsp;" + memberNames[1] + "<br>&nbsp;" +
                memberNames[2];
            dataRows[i].appendChild(dataCells[i][0]);
            for (var j = 1; j < 5; j++) {
                dataCells[i][j] = document.createElement("td");
                dataCells[i][j].innerHTML = "Not attempted.";
                dataRows[i].appendChild(dataCells[i][j]);
            }

            for (var j = 0; j < myTeam.levels.length; j++) {
                myLevel = myTeam.levels[j];
                if (myLevel.attempted) {
                    myLevel.endUTime = computeEndUTime(myLevel);
                    var levelTime = Math.round(myLevel.endUTime - myLevel.startUTime);
                    myTeam.totalTime += levelTime;
                    var levelMinutes = Math.round(levelTime / 60);
                    var levelSeconds = levelTime % 60;
                    var levelMsg = (myLevel.success ?
                        "<br><font color=green>Goal voltages attained.</font>" :
                        "<br><font color=red>Goal voltages not attained.</font>");
                    var levelEMsg = (myLevel.successE ?
                        "<br><font color=green>E correctly reported.</font>" :
                        "<br><font color=red>E not reported correctly.</font>");
                    var levelRMsg = (myLevel.successR ?
                        "<br><font color=green>R0 correctly reported.</font>" :
                        "<br><font color=red>R0 not reported correctly.</font>");
                    var successMsg = computeSuccessMessage(myLevel);
                    var cellContents = "Time (mm:ss): " + levelMinutes + ":" + ("0" + levelSeconds).slice(-2);
                    var sTime = new Date(myLevel.startUTime * 1000);
                    var eTime = new Date(myLevel.endUTime * 1000);
                    cellContents += "<br><small>Start: " + sTime.getHours() + ":" + (sTime.getMinutes() < 10 ? '0' : '') + sTime.getMinutes();
                    cellContents += ",  End: " + eTime.getHours() + ":" + (eTime.getMinutes() < 10 ? '0' : '') + eTime.getMinutes() + "ET </small>";
                    cellContents += levelMsg;
                    cellContents += successMsg;
                } else {
                    cellContents = "Not attempted."
                }
                dataCells[i][j + 1].innerHTML = cellContents;
            }
            maxLevel = "None";
            for (var j = 0; j < myTeam.levels.length; j++) {
                myLevel = myTeam.levels[j];
                if (myLevel.label == "A" && myLevel.success) {
                    maxLevel = "A";
                }
                if (myLevel.label == "B" && myLevel.success) {
                    maxLevel = "B";
                }
                if (myLevel.label == "C" && myLevel.success && myLevel.successE) {
                    maxLevel = "C";
                }
                if (myLevel.label == "D" && myLevel.success && myLevel.successE && myLevel.successR) {
                    maxLevel = "D";
                }
            }
            myDate = myLevel.startPTime
            if (myDate) {
                levelDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
            }
            // Teacher / Date / Team / Level / Time / Action / Actor / Total Msg Score / Number Msgs / Avg Msg Score
            newRow = [myTeam.teacher, levelDate, myTeam.name, maxLevel, Math.round(myTeam.totalTime / 6) / 10, "MaxLevel"];
            csvSummaryArray.push(newRow);

        }
    }
}


function makeSummaryArray(teams) {
    var summaryArray = ["Team", "Teacher", "Level A", "Level B", "Level C", "Level D"]

    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i]
        myTeacher = myTeam.teacher;
        var summaryRow = [myTeam.name, myTeacher];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            myLevel.success ? summaryRow.push("successful") : summaryRow.push("unsuccessful");
        }
        summaryRow.push("/n");
        summaryArray.push(summaryRow);
    }
    downloadSummaryCSV(summaryArray);
    Msg = "report-tools: makeSummaryArray for " + i + " teams";
    console.log(Msg);
}