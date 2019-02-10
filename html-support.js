function toggleSelectAll(checkboxName) {
    var checkboxArray = $("input[name=" + checkboxName + "]");
    if (checkboxArray[0].checked) {
        for (var i = 0; i < checkboxArray.length - 1; i++) {
            checkboxArray[i + 1].checked = true;
        }
    } else {
        for (var j = 0; j < checkboxArray.length - 1; j++) {
            checkboxArray[j + 1].checked = false;
        }
    }
}

function setupForm(levels) { // receives checked levels from function showLevels.
    var myTeam;
    var myLevel;
    var acts = [];
    if (levels.length == 0) {
        return;
    }
    var checkDiv = document.createElement("div");
    checkDiv.id = "checkDiv";
    document.body.appendChild(checkDiv);
    var checkForm = document.createElement("form");
    checkForm.id = "checkForm";
    checkForm.style.margin = "5px";
    checkDiv.appendChild(checkForm);
    var checkPara = document.createElement("p");
    checkPara.id = "checkPara";
    checkPara.innerHTML = "";
    checkForm.appendChild(checkPara);
    var checkTable = document.createElement("table");
    checkTable.style.margin = "5px";
    checkForm.appendChild(checkTable);
    var headerRow = document.createElement("tr");
    headerRow.style.backgroundColor = "#DDFFDD";
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");

    headerCell1.innerHTML = "Actions";
    headerCell2.innerHTML = "Variable Refs";

    var dataRow = document.createElement("tr");
    var actionData = document.createElement("td");
    var varRefData = document.createElement("td");

    actionData.innerHTML = "";
    varRefData.innerHTML = "";

    checkTable.appendChild(headerRow);
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);

    checkTable.appendChild(dataRow);
    dataRow.appendChild(actionData);
    dataRow.appendChild(varRefData);

    // Add actions
    IDStr = 'id="all-actions" name="action" ';
    onChangeStr = "onchange = \"toggleSelectAll('action')\"";
    labelStr = '<b>All actions</b><br>';
    actionData.innerHTML = "<input + " + typeStr + IDStr + onChangeStr + ">" + labelStr;
    var actionLabels = ["activity-settings", "message", "calculation", "resistorChange", "attach-probe", "detach-probe",
        "connect-lead", "disconnect-lead", "measurement", "move-DMM-dial", "submit-V", "submit-ER", "joined-group", "opened-zoom", "closed-zoom"
    ];
    for (var k = 0; k < actionLabels.length; k++) {
        IDStr = 'id=action-' + actionLabels[k] + " name=action>";
        labelStr = actionLabels[k] + "<br>";
        actionData.innerHTML += "<input " + typeStr + IDStr + labelStr;
    }
    // Add variable Refs
    IDStr = 'id="all-varRefs" name="varRef" ';
    onChangeStr = "onchange = \"toggleSelectAll('varRef')\"";
    labelStr = '<b>All refs</b><br>';
    varRefData.innerHTML = "<input + " + typeStr + IDStr + onChangeStr + ">" + labelStr;
    for (var kk = 0; kk < vrLabelsArray.length; kk++) {
        IDStr = 'id=varRef-' + vrLabelsArray[kk] + " name=varRef>";
        labelStr = vrLabelsArray[kk] + "<br>";
        varRefData.innerHTML += "<input + " + typeStr + IDStr + labelStr;
    }
    // Add team and level to checkPara
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        checkPara.innerHTML += "Team " + myLevel.team.name + "(" + myLevel.team.classId + "), level " + myLevel.label +"<br>"
    }
    console.log ("setupForm completed.")
}

function clearReport() {
    if (document.getElementById("reportDiv")) {
        var reptDiv = document.getElementById("reportDiv")
        while (reptDiv.firstChild) {
            reptDiv.removeChild(reptDiv.firstChild);
        }
    }
}

function setUpActionsReport(filteredTeams) { //Sets up a table with three columns into which the actions can be inserted with a different column for each actor
    if (document.getElementById("reportDiv")) { //If reportDiv exists
        var reportDiv = document.getElementById("reportDiv"); //clear it
        while (reportDiv.firstChild) {
            reportDiv.removeChild(reportDiv.firstChild);
        }
    } else { //otherwise create one
        var reportDiv = document.createElement("div");
        reportDiv.id = "reportDiv";
        document.body.appendChild(reportDiv);
    }
    var actionTable = document.createElement("table");
    actionTable.id = "actionTable";
    reportDiv.appendChild(actionTable);
}

var rowIndex = counter();

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
    actionTable = reportDiv.firstChild;
    actionTable.appendChild(headerRow);
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
    actionTable.appendChild(actionRow);
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