//Global variables
var filterTableAlreadyCreated = false;
var rowIndex = counter(); ///Gl0bal variable

function createFilterTable() //Sets up the teacher, level, outcome, goal voltage chats, goal resistance calcs, and goal resistance chats entries without populating the span fields. (Done dynamically because the teachers field is not determined until the data has been loaded.)
{
    var filterTable = document.getElementById("filterTable");
    var totalLevels = 0;
    if (!filterTableAlreadyCreated) {
        filterTableAlreadyCreated = true;
        filterTable.style.display = "block";
        for (var i = 0;
            ((i < teachers.length) || (i < 4)); i++) {
            addFilterRow(i, filterTable);
        }
        for (var j = 0; j < teachers.length; j++) {
            totalLevels += teachers[j].levels.length;
        }
        document.getElementById("teachers#").innerHTML = totalLevels;

        function addFilterRow(i, table) {
            var filterRow = document.createElement("tr");
            var teacherCell = document.createElement("td");
            var levelCell = document.createElement("td");
            var outcomeCell = document.createElement("td");
            var gVChatsCell = document.createElement("td");
            var gRCalcsCell = document.createElement("td");
            var gRChatsCell = document.createElement("td");
            var teacherId;
            if (teachers[i]) {
                teacherId = teachers[i].id;
                teacherCell.innerHTML = teachers[i].name + "(" + teachers[i].levels.length + ")" +
                    "<input type=\"checkbox\" name=\"teacher\" id=" + teacherId + " onchange=\"updateLevels()\"></input>";
            }
            if (i == 0) {
                levelCell.innerHTML = "A(" + '<span id="A#"></span>' + ")" +
                    '<input type="checkbox" name="level" id="levelA" onchange="updateLevels()"></input>';
                outcomeCell.innerHTML = "Success(" + '<span id="success#"></span>' + ")" +
                    '<input type="checkbox" name="outcome" id="success" onchange="updateLevels()"></input>';
                gVChatsCell.innerHTML = "All chatted(" + '<span id="VAllChatted#"></span>' + ")" +
                    '<input type="checkbox" name="vchat" id="VAllChat" onchange="updateLevels()"></input>';
                gRCalcsCell.innerHTML = "All Calculated(" + '<span id="RAllCalculated#"></span>' + ")" +
                    '<input type="checkbox" name="rcalc" id="RAllCalc" onchange="updateLevels()"></input>';
                gRChatsCell.innerHTML = "All Chatted(" + '<span id="RAllChatted#"></span>' + ")" +
                    '<input type="checkbox" name="rchat" id="RAllChat" onchange="updateLevels()"></input>';
            } else if (i == 1) {
                levelCell.innerHTML = "B(" + '<span id="B#"></span>' + ")" +
                    '<input type="checkbox" name="level" id="levelB" onchange="updateLevels()"></input>';
                outcomeCell.innerHTML = "Failure(" + '<span id="failure#"></span>' + ")" +
                    '<input type="checkbox" name="outcome" id="failure" onchange="updateLevels()"></input>';
                gVChatsCell.innerHTML = "Some chatted(" + '<span id="VSomeChatted#"></span>' + ")" +
                    '<input type="checkbox" name="vchat" id="VSomeChat" onchange="updateLevels()"></input>';
                gRCalcsCell.innerHTML = "Some Calculated(" + '<span id="RSomeCalculated#"></span>' + ")" +
                    '<input type="checkbox" name="rcalc" id="RSomeCalc" onchange="updateLevels()"></input>';
                gRChatsCell.innerHTML = "Some Chatted(" + '<span id="RSomeChatted#"></span>' + ")" +
                    '<input type="checkbox" name="rchat" id="RSomeChat" onchange="updateLevels()"></input>';
            } else if (i == 2) {
                levelCell.innerHTML = "C(" + '<span id="C#"></span>' + ")" +
                    '<input type="checkbox" name="level" id="levelC" onchange="updateLevels()"></input>';
                outcomeCell.innerHTML = "";
                gVChatsCell.innerHTML = "None chatted(" + '<span id="VNotChatted#"></span>' + ")" +
                    '<input type="checkbox" name="vchat" id="VNoChat" onchange="updateLevels()"></input>';
                gRCalcsCell.innerHTML = "None Calculated(" + '<span id="RNotCalculated#"></span>' + ")" +
                    '<input type="checkbox" name="rcalc" id="RNoCalc" onchange="updateLevels()"></input>';
                gRChatsCell.innerHTML = "None Chatted(" + '<span id="RNotChatted#"></span>' + ")" +
                    '<input type="checkbox" name="rchat" id="RNoChat" onchange="updateLevels()"></input>';
            } else if (i == 3) {
                levelCell.innerHTML = "D(" + '<span id="D#"></span>' + ")" +
                    '<input type="checkbox" name="level" id="levelD" onchange="updateLevels()"></input>';
            }
            filterRow.appendChild(teacherCell);
            filterRow.appendChild(levelCell);
            filterRow.appendChild(outcomeCell);
            filterRow.appendChild(gVChatsCell);
            filterRow.appendChild(gRCalcsCell);
            filterRow.appendChild(gRChatsCell);
            table.appendChild(filterRow);
        }
    }
}

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
            return 1;
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
    });
    actionCell0.addEventListener("mouseup", function () {
        hideData();
    });

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
            actionCell0.style.backgroundColor = "#CC99E5";
            break;
        case "disconnect-lead":
            actionCell0.style.backgroundColor = "#FFCCE5";
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