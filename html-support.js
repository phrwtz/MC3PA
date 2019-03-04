function setupActionsForm() {
    var myLevel = findSelectedLevel();
    if (myLevel) {
        document.getElementById("checkActions").style.display = "inline";
    } else {
        document.getElementById("checkActions").style.display = "none";
        if (document.getElementById("actionsTable")) {
            document.getElementById("actionsTable").style.display = "none";
        }
    }
}

{
    //         var onchangeStr;
    //         var checkDiv = document.createElement("div");
    //         checkDiv.id = "checkDiv";
    //         document.body.appendChild(checkDiv);
    //         var checkForm = document.createElement("form");
    //         checkForm.id = "checkForm";
    //         checkForm.style.margin = "5px";
    //         checkDiv.appendChild(checkForm);
    //         var checkPara = document.createElement("p");
    //         checkPara.id = "checkPara";
    //         checkPara.innerHTML = "";
    //         checkForm.appendChild(checkPara);
    //         var checkTable = document.createElement("table");
    //         checkTable.id = "checkTable";
    //         checkTable.style.margin = "5px";
    //         checkForm.appendChild(checkTable);
    //         var headerRow = document.createElement("tr");
    //         headerRow.style.backgroundColor = "#DDFFDD";
    //         var headerCell1 = document.createElement("th");
    //         //       var headerCell2 = document.createElement("th");
    //         var actionLabels = ["activity-settings", "message", "calculation", "resistorChange", "attach-probe", "detach-probe",
    //             "connect-lead", "disconnect-lead", "measurement", "move-DMM-dial", "submit-V", "submit-ER", "joined-group", "opened-zoom", "closed-zoom"
    //         ];

    //         headerCell1.innerHTML = "Actions";
    //         //      headerCell2.innerHTML = "Variable Refs";

    //         var dataRow = document.createElement("tr");
    //         var actData = document.createElement("td");
    //         var varRefData = document.createElement("td");

    //         actData.innerHTML = "";
    //         varRefData.innerHTML = "";

    //         checkTable.appendChild(headerRow);
    //         headerRow.appendChild(headerCell1);
    //         //       headerRow.appendChild(headerCell2);

    //         checkTable.appendChild(dataRow);
    //         dataRow.appendChild(actData);
    //         dataRow.appendChild(varRefData);

    //         // Add action checkboxes to checkTable
    //         onchangeStr = "toggleSelectAll('action');reportResults()";
    //         labelStr = '<b> All actions</b><br>';
    //         actData.innerHTML = '<input type="checkbox" id="all-actions" name="action" onchange=' + onchangeStr + '></input>' + labelStr;
    //         onchangeStr = "reportResults()";
    //         for (var k = 0; k < actionLabels.length; k++) {
    //             idStr = "action-" + actionLabels[k];
    //             actData.innerHTML += '<input type="checkbox" name = "action" id=' + idStr + " onchange=" + onchangeStr + "></input>" + actionLabels[k] + "<br>";
    //         }
    // Add variable Refs
    // onChangeStr = "toggleSelectAll('varRef')";
    // labelStr = '<b>All var refs</b><br>';
    // varRefData.innerHTML = '<input + type="checkbox" name="varRef" id = "all=varRefs" onchange=' + onChangeStr + '></input><b> All var refs</b><br>';
    // for (var kk = 0; kk < vrLabelsArray.length; kk++) {
    //     IDStr = 'id=varRef-' + vrLabelsArray[kk] + " name=varRef>";
    //     labelStr = vrLabelsArray[kk] + "<br>";
    //     varRefData.innerHTML += "<input type=checkbox name=varRef " + IDStr + labelStr;
    // }
    // // Add team and level to checkPara
    // for (var i = 0, myLevel; myLevel = levels[i]; i++) {
    //     checkPara.innerHTML += "Team " + myLevel.team.name + "(" + myLevel.team.classId + "), level " + myLevel.label + "<br>"
    // }
    //     }
    // }



    // function setUpActionsTable() {
    //     clearElement("reportDiv"); //Clear the table and set up a new one so that we don't get two.
    //     var reportDiv = document.createElement("div");
    //     var actionsTable = document.createElement("table");
    //     var headerRow = document.createElement("tr");
    //     var header = document.createElement("th");
    //     document.body.appendChild(reportDiv);
    //     reportDiv.appendChild(actionsTable);
    //     actionsTable.appendChild(headerRow);
    //     headerRow.appendChild(header);
    //     reportDiv.id = "reportDiv";
    //     actionsTable.id = "actionsTable";
    //     actionsTable.style.float = "left";
    //     headerRow.id = ("headerRow");
    //     header.id = ("header");
    //     header.setAttribute("colspan", 4);
    //     document.body.appendChild(reportDiv);
    //     reportDiv.appendChild(actionsTable);
    //     actionsTable.appendChild(headerRow);
    // }


    var rowIndex = counter(); ///Gl0bal variable

    function addLevelRow(team, level) {
        var headerRow = document.createElement("tr");
        headerRow.style.backgroundColor = "#DDFFDD";
        var timeCell = document.createElement("th");
        var teamCell = document.createElement("th");
        teamCell.style.alignItems = "flex-start";
        timeCell.innerHTML = "Time";
        teamCell.innerHTML = "Team " + team.name + "(" + team.classId + "), Level " + level.label + ", " + level.errorMsg;
        teamCell.setAttribute("colspan", 3);
        headerRow.appendChild(timeCell);
        headerRow.appendChild(teamCell);
        actionsTable = document.getElementById("actionsTable");
        actionsTable.appendChild(headerRow);
        rowIndex.reset();
    }

    function counter(checkboxName) {
        n = 0;
        return {
            count: function () {
                return n++;
            },
            reset: function () {
                return n = 1
            }
        };
    }
    var dataWindow;

    function showData(act) {
        var cur = Math.round(calculateCurrent(act) * 100000) / 100;
        var temp = act.time.split("T")[1];
        var actTime = temp.split("Z")[0];
        dataWindow = window.open("", "myWindow", "left=500, top=15, width=400, height=200");
        var currentFlowingMsg = (act.currentFlowing ? ".  Current = " + cur + " mAmps." : ".  Current not flowing.");
        dataWindow.document.body.innerHTML = act.team.name + ", level " + act.level.label + ". E = " + act.E + ", R0 = " + act.R0 + ", Unix time = " + act.uTime + ", pretty time = " + actTime + "<br><br>goalR1 = " + act.goalR[0] + ", goalR2 = " + act.goalR[1] + ", goalR3 = " + act.goalR[2] + "<br>goalV1 = " + act.goalV[0] + ", goalV2 = " + act.goalV[1] + ", goalV3 = " + act.goalV[2] + "<br><br>R1 = " + act.R[0] + ", R2 = " + act.R[1] + ", R3 = " + act.R[2] + "<br>V1 = " + act.V[0] + ", V2 = " + act.V[1] + ", V3 = " + act.V[2] + currentFlowingMsg;
    }

    function hideData() {
        dataWindow.close();
    }

    function addActionRow(act, content) {

        var reportDiv = document.getElementById("reportDiv");
        var actionsTable = document.getElementById("actionsTable");
        if (!actionsTable) {
            actionsTable = document.createElement("table");
            actionsTable.id = "actionsTable";
            actionsTable.style.float = "left";
            reportDiv.appendChild(actionsTable);
        }
        var actionRow = document.createElement("tr");
        actionRow.id = 'row-' + rowIndex.count();
        var actionCell0 = document.createElement("td");
        var actionCell1 = document.createElement("td");
        var actionCell2 = document.createElement("td");
        var actionCell3 = document.createElement("td");
        actionCell0.width = "4%";
        actionCell1.width = "32%";
        actionCell2.width = "32%";
        actionCell3.width = "32%";
        var bd = parseInt(act.board);
        actionsTable.appendChild(actionRow);
        actionCell0.innerHTML = act.eMinSecs;
        if (isNaN(act.R[0])) {
            console.log("R[0] doesn't exist");
        }
        actionCell0.addEventListener("mousedown", function () {
            showData(act);
        })
        actionCell0.addEventListener("mouseup", function () {
            hideData();
        })

        switch (act.type) {
            case "joined-group":
                actionCell0.style.backgroundColor = "#EAEEBB";
                break;
            case "activity-settings":
                actionCell0.style.backgroundColor = "#E5FFCC";
                break;
            case "attach-probe":
                actionCell0.style.backgroundColor = "#FFE5CC";
                break;
            case "detach-probe":
                actionCell0.style.backgroundColor = "#FFE5CC";
                break;
            case "connect-lead":
                actionCell0.style.backgroundColor = "#CCFFE5";
                break;
            case "disconnect-lead":
                actionCell0.style.backgroundColor = "#CCFFE5";
                break;
            case "message":
                actionCell0.style.backgroundColor = "#F9D593";
                break;
            case "resistorChange":
                actionCell0.style.backgroundColor = "#B5F3A9";
                break;
            case "calculation":
                actionCell0.style.backgroundColor = "#B3F3F6";
                break;
            case "measurement":
                actionCell0.style.backgroundColor = "#FACBFA";
                break;
            case "move-dial":
                actionCell0.style.backgroundColor = "#FADEFA";
                break;
            case "opened-zoom":
                actionCell0.style.backgroundColor = "#D9D6FF";
                break;
            case "closed-zoom":
                actionCell0.style.backgroundColor = "#D9D6FF";
                break;
            case "submitClicked":
                actionCell0.style.backgroundColor = "#DDDDFF";
                break;
            case "submitER":
                actionCell0.style.backgroundColor = "#CCCCFF";
                break;
        }
        actionRow.appendChild(actionCell0);
        var cellIndex = bd;

        switch (bd) {
            case 0:
                actionCell1.innerHTML = content;
                actionCell2.innerHTML = "";
                actionCell3.innerHTML = "";
                actionRow.appendChild(actionCell1);
                actionRow.appendChild(actionCell2);
                actionRow.appendChild(actionCell3);
                break;
            case 1:
                actionCell1.innerHTML = "";
                actionCell2.innerHTML = content;
                actionCell3.innerHTML = "";
                actionRow.appendChild(actionCell1);
                actionRow.appendChild(actionCell2);
                actionRow.appendChild(actionCell3);
                break;
            case 2:
                actionCell1.innerHTML = "";
                actionCell2.innerHTML = "";
                actionCell3.innerHTML = content;
                actionRow.appendChild(actionCell1);
                actionRow.appendChild(actionCell2);
                actionRow.appendChild(actionCell3);
                break;
        }
    }
}