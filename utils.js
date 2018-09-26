function clearScreen(csvActionsArray, csvSummaryArray) { //clears data and summary tables
    document.getElementById("data").innerHTML = ""; // clear data paragraph
    if (document.getElementById("tableDiv")) { // clear tableDiv division
        var tableDiv = document.getElementById("tableDiv");
        while (tableDiv.firstChild) {
            tableDiv.removeChild(tableDiv.firstChild);
        }
    }
    Array.from(document.getElementsByClassName("tableSummary")).forEach( // clear divisions of this classname
        function (e) {
            e.parentNode.removeChild(e);
        }
    );
    csvActionsArray.length = 1;
    csvSummaryArray.length = 1; // re-initialize the csv download files	
    console.log("utils.js:clearScreen: csvActionsArray.length = " + csvActionsArray.length + "; csvSummaryArray.length = " + csvSummaryArray.length);
} // end clearScreen

function initializeVarRefs(level) { //Initializes variable references for this level
    for (var i = 0; i < vrLabelsArray.length; i++) {
        level.varRefs[vrLabelsArray[i]] = []
    }
}

//Takes a variable string and an action and returns 1 if the variable
//is known to all players, 2 if it is known to the actor, 3 if it
//is known to a player other than the actor, and 4 if it is not initially
//known to anyone (and is presumed to be the result of a calculation).
//(Note: the designations for "E" and "R0" depend on the level.)
function score(varStr, action) {
    var score = 0;
    var bd = action.board + 1;
    switch (varStr) {
        case "E":
            (action.level.label < "C" ? score = 1 : score = 4);
            break;
        case "R0":
            (action.level.label < "D" ? score = 1 : score = 4);
            break;
        case "R1":
            (bd == 1 ? score = 2 : score = 3);
            break;
        case "R2":
            (bd == 2 ? score = 2 : score = 3);
            break;
        case "R3":
            (bd == 3 ? score = 2 : score = 3);
            break;
        case "goalR1":
            score = 4;
            break;
        case "goalR2":
            score = 4;
            break;
        case "goalR3":
            score = 4;
            break;
        case "V0":
            score = 4;
            break;
        case "V1":
            (bd == 1 ? score = 2 : score = 3);
            break;
        case "V2":
            (bd == 2 ? score = 2 : score = 3);
            break;
        case "V3":
            (bd == 3 ? score = 2 : score = 3);
            break;
        case "sumVs":
            score = 4;
            break;
        case "goalV0":
            score = 4;
            break;
        case "goalV1":
            (bd == 1 ? score = 2 : score = 3);
            break;
        case "goalV2":
            (bd == 2 ? score = 2 : score = 3);
            break;
        case "goalV3":
            (bd == 3 ? score = 2 : score = 3);
            break;
        case "IA":
            score = 4;
            break;
        case "ImA":
            score = 4;
            break;
        case "goalIA":
            score = 4;
            break;
        case "goalImA":
            score = 4;
            break;
        case "??":
            score = 0;
            break;
    }
    return score;
}

//Assuming that an action contains multiple numbers and that at least some of
//those numbers are associated with multiple variables, the algorithm for
//computing the score is to examine the scores for each of the numbers in the
//message, find the minimum score for those variables, then iterate over the numbers
//and return the sum of those scores

function scoreAction(action) {
    var vrs = action.varRefs;
    var s = [];
    var ns;
    var score = 0;
    if (vrs) {
        for (var i = 0; i < vrs.length; i++) { //iterating over the numbers
            s[i] = 5;
            for (var j = 0; j < vrs[i].length; j++) { //iterating over the variables for each number
                if (vrs[i].length == 0) { //if no variable was matched for this number
                    return 0; //the score is zero
                } else {
                    ns = vrs[i][j][3]; //the score for the j'th variable
                    if (ns < s[i]) { //if it's smaller than the last one
                        s[i] = ns; //replace the last one
                    } //s[i] is the minimum score over all the variables associated with
                    //the ith number
                }
            } //next j
            score += s[i]; //the score for the action is the sum of the scores for
            //each of its numbers
        } //next i
        return score;
    }
}

function highlightMessage(act, text) { //Highlights the variable names, if any, in a message
    //or measurement reading, Returns the highlighted message or reading
    vrArray = act.varRefs;
    var textWithoutSpaces = text.replace(/\s/g, '');
    var numRegEx = new RegExp(/([[0-9]+\.?[0-9]*)|(\.[0-9]+)/g);
    var numArray = textWithoutSpaces.match(numRegEx);
    //numArray is an array of all the numbers in the message, including those
    //for which no matching variable was found
    //to a given number in the message
    if (numArray) { //if there are numbers in the message
        for (i = 0; i < numArray.length; i++) { //look at each and try to match it
            var numStr = numArray[i]; //the number string in the message.
            var matchedVariables = []; //array to store matching variables for this number
            for (j = 0; j < vrArray[i].length; j++) { //compare it to the i'th array of var refs
                vrNum = vrArray[i][j][2]; //the number that matched the variable
                vrVar = vrArray[i][j][1]; //the string representing the variable
                if (numStr == vrNum) { //if it matches the number in the message
                    vrScore = vrArray[i][j][3];
                    matchedVariables.push(vrVar); //put it in the array
                }
            }
            var highlightedStr = " <mark>["
            for (var k = 0; k < matchedVariables.length; k++) {
                highlightedStr += matchedVariables[k] + ", ";
            }
            highlightedStr = highlightedStr.substring(0, highlightedStr.length - 2) + "]</mark>";
            text = text.replace(numArray[i], numArray[i] + highlightedStr);
        }
    }
    return text;
}

function getVarRefs(action, text) {
    //returns an array (possibly empty) of variable references contained in text.
    //(the message of a message action, the input or output of a calculation, the
    //result of a measurement, or the E and/or R value submitted at levels C and D.)
    //A variable reference is an array consisting of the action in which the
    //reference occurs, a string representing the variable that is matched, a string
    //representing the number that was matched, and a numerical score indicating whether
    //the value of the variable was globally known (e.g., E and/or R0 at some levels),
    //known to the actor of the action (e.g.,the actor's own resistance or voltage),
    //known to some other member of the team, or unknown (presumably, the result of a calculation)

    var textWithoutSpaces = text.replace(/\s/g, '');
    var pattern = new RegExp(/([[0-9]+\.?[0-9]*)|(\.[0-9]+)/g);
    var nums = textWithoutSpaces.match(pattern);
    var vrs = [] //array that will contain all the variable references
    //contained in the action. It will remain empty if nums is null or
    //no VRs are found.
    if (nums) {
        //nums is an array of strings representing all the numbers in text
        for (var i = 0; i < nums.length; i++) {
            vrs[i] = findVars(action, nums[i]); //matches the numbers to the variables.
            //puts an array of varRefs into level.varRefs
        }
    }
    //If we're looking at the result of a calculation and it doesn't correspond to any
    //known variable, handle it differently
    if ((action.type == "calculation") && (text == action.rMsg) && (vrs[0] == "??")) {
        vrs[0] = "unknown" + action.level.ukIndex;
        vrLabelsArray.push("unknown" + action.level.ukIndex);
        action.level.ukIndex++;
    }
    return vrs;
}

//This function looks for variables by matching numStr to their numeric values.
//If it finds a match it returns an array of variable reference objects, each of
//which is itself a four-dimensional array consisting of the action object,
//the label of the variable matched, the string that was matched, and a score
//(0 to 5). Note: numStr can match more than one variable, which is why the
//function returns an array, rather than a single varRef
function findVars(act, numStr) {
    var num = parseFloat(numStr);
    var myLevel = act.level;
    var returnArray = [];
    var E = parseInt(act.E),
        R0 = parseInt(act.R0),
        goalV1 = act.goalV[0],
        goalV2 = act.goalV[1],
        goalV3 = act.goalV[2],
        sumGoalVs = goalV1 + goalV2 + goalV3,
        goalV0 = E - sumGoalVs,
        goalR1 = act.goalR[0],
        goalR2 = act.goalR[1],
        goalR3 = act.goalR[2],
        sumGoalRs = goalR1 + goalR2 + goalR3,
        R1 = act.R[0],
        R2 = act.R[1],
        R3 = act.R[2],
        sumRs = R1 + R2 + R3,
        sumRsPlusR0 = sumRs + R0,
        Rtot = R0 + R1 + R2 + R3,
        goalRtot = R0 + goalR1 + goalR2 + goalR3,
        V0 = E * R0 / Rtot,
        V1 = act.V[0],
        V2 = act.V[1],
        V3 = act.V[2],
        sumVs = V1 + V2 + V3,
        IA = E / Rtot,
        ImA = 1000 * IA,
        goalIA = E / goalRtot,
        goalImA = 1000 * goalIA;
    //tol is how close two numbers have to be to considered "about equal"
    //Note: we compare tol to |x - y| / (x + y) so it's a relative value
    var tol = .001,
        thisStr = "";
    var variableFound = false;
    if (about(num, E, tol)) {
        variableFound = true;
        thisStr = "E";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, R0, tol)) {
        variableFound = true;
        thisStr = "R0";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, R1, tol)) {
        variableFound = true;
        thisStr = "R1";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, R2, tol)) {
        variableFound = true;
        thisStr = "R2";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, R3, tol)) {
        variableFound = true;
        thisStr = "R3";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, sumRs, tol)) {
        variableFound = true;
        thisStr = "sumRs";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, sumRsPlusR0, tol)) {
        variableFound = true;
        thisStr = "sumRsPlusR0";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, V0, tol)) {
        variableFound = true;
        thisStr = "V0";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, V1, tol)) {
        variableFound = true;
        thisStr = "V1";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, V2, tol)) {
        variableFound = true;
        thisStr = "V2";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, V3, tol)) {
        variableFound = true;
        thisStr = "V3";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, sumVs, tol)) {
        variableFound = true;
        thisStr = "sumVs";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalR1, tol)) {
        variableFound = true;
        thisStr = "goalR1";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalR2, tol)) {
        variableFound = true;
        thisStr = "goalR2";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalR3, tol)) {
        variableFound = true;
        thisStr = "goalR3";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, sumGoalRs, tol)) {
        variableFound = true;
        thisStr = "sumGoalRs";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, sumGoalVs, tol)) {
        variableFound = true;
        thisStr = "sumGoalVs";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalV0, tol)) {
        variableFound = true;
        thisStr = "goalV0";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalV1, tol)) {
        variableFound = true;
        thisStr = "goalV1";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalV2, tol)) {
        variableFound = true;
        thisStr = "goalV2";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalV3, tol)) {
        variableFound = true;
        thisStr = "goalV3";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, IA, tol)) {
        variableFound = true;
        thisStr = "IA";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, ImA, tol)) {
        variableFound = true;
        thisStr = "ImA";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalIA, tol)) {
        variableFound = true;
        thisStr = "goalIA";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    if (about(num, goalImA, tol)) {
        variableFound = true;
        thisStr = "goalImA";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        try {
            act.level.varRefs[thisStr].push(thisVarRef);
        } catch (err) {
            console.log(err + " var ref label = " + thisStr)
        }
        returnArray.push(thisVarRef);
    }
    if (!variableFound) { //if there is no match
        thisStr = "unknown";
        thisVarRef = [act, thisStr, numStr, score(thisStr, act)];
        act.level.varRefs[thisStr].push(thisVarRef);
        returnArray.push(thisVarRef);
    }
    return returnArray;
}

function makeTeams(rowObjs) { //parse the row objects array looking for and populating teams
    for (i = 0; i < rowObjs.length; i++) {
        var ro = rowObjs[i];
        if (ro["event"] == "model values") {
            addTeam(ro);
        }
    }
    return teams;
}

//We invoke this function when the event is "model values"
//we construct a new team from ro and add it to teams array.
//If we already have a team with that name, we use it.
function addTeam(ro) {
    var userID = ro["username"].slice(0, ro["username"].indexOf("@")); // user id precedes @
    var myClass = getMemberDataObj(userID)["Class"];
    var classID = getMemberDataObj(userID)["Class ID"];
    var teacher = getMemberDataObj(userID)["Teachers"];
    var teamName = ro.parameters["groupname"];
    var myTeam = inTeams(teamName, teams)
    if (!myTeam) { //If this is a new team, initialize variables
        myTeam = new team;
        myTeam.name = ro.parameters["groupname"];
        myTeam.class = myClass;
        myTeam.classID = classID;
        myTeam.levels = [];
        myTeam.teacher = teacher;
        myTeam.levels = [];
        teams.push(myTeam); //and put it on the array
    }
    addLevel(myTeam, ro); //add level, if new
}

//construct a new level from ro and add it to the levels array for myTeam. If the level already exists don't change anything. In either event, try adding a member to the level.
function addLevel(myTeam, ro) { 
    var levelName = ro.parameters["levelName"];
    var levelNumber = getLevelNumber(levelName); //0 for tutorial, 1 for level A, etc.
    var myLevel = inLevels(levelNumber, myTeam.levels)
    if (!myLevel) { //It's a brand new level! Initialize all the necessary variables
        var myLevel = new level;
        addLevelValues(myLevel, ro); //Add all the global variables for this level
        myLevel.actions = [];
        myLevel.members = [];
        myLevel.startUTime = new Date(ro["time"]).getTime() / 1000;
        var startDate = new Date(parseFloat(myLevel.startUTime * 1000));
        myLevel.startPTime = startDate;
        myLevel.number = levelNumber;
        myLevel.label = getAlphabeticLabel(levelNumber);
        myLevel.team = myTeam;
        myLevel.success = false;
        myLevel.successE = false;
        myLevel.successR = false;
        myLevel.attainedVs = false;
        myLevel.attainedVsTime = 0;
        myLevel.movedAwayFromV = false;
        myLevel.movedAwayFromVTime = 0;
        myLevel.varRefs = function () {} //List of references to known variables
        //Each property is a variable label and is associated with an array of
        //actions (messages, calculations, measurements) that contain a reference
        //to that variable, paired with a string that defines whether the
        //variable is globally known, known to the actor, known to some other
        //team member, or unknown.
        initializeVarRefs(myLevel); //Set all the arrays empty
        myTeam.levels.push(myLevel);
    }
    addMember(myLevel, ro) //add member, if new. Otherwise, do nothing.
}

function addMember(myLevel, ro) {
    var userID = ro.username.slice(0, ro.username.indexOf("@")); // user id precedes @
    var myMember = inMembers(userID, myLevel.members)
    if (!myMember) { //If this is a new member initialize and push to the members array
        myMember = new member;
        myMember.team = ro.parameters["groupname"];
        myMember.id = userID;
        myMember.name = ro.parameters["username"];
        myMember.board = ro.parameters["board"];
        myMember.startTime = ro["time"]; //Log in time for this member
        myMember.colIndex = myLevel.members.length // will be 0, 1, or 2
        var colorArray = ["DarkTurquoise", "Gold", "GreenYellow"];
        myMember.color = colorArray[myMember.colIndex];
        myMember.styledName = "<span style= \"background-color: " + myMember.color + "\">" + myMember.name + "</span>";
        myLevel.members.push(myMember);
        console.log("Level " + myLevel.label + " of team " + myLevel.team.name + " now has " + myLevel.members.length + " members.");
        if (myLevel.members.length == 2) {
            myLevel.lastJoinedUTime = new Date(ro["time"]).getTime() / 1000;
        }
    }
}
//if a team with the name teamName exists in the teams array, return it. Otherwise return null
function inTeams(teamName, teams) {
    for (var j = 0; j < teams.length; j++) {
        if (teams[j].name == teamName) {
            return teams[j];
        }
    }
    return null;
}

//if a level with the number levelNumber exists in the levels array, return it. Otherwise return null
function inLevels(levelNumber, levels) {
    for (var j = 0; j < levels.length; j++) {
        if (levels[j].number == levelNumber) {
            return levels[j];
        }
    }
    return null;
}

//if a member with the ID userID exists in the members array, return it. Otherwise return null
function inMembers(userID, members) {
    for (var j = 0; j < members.length; j++) {
        if (members[j].id == userID) {
            return members[j];
        }
    }
    return null;
}

function about(num, target, tol) {
    return (Math.abs((num - target) / Math.abs(num + target)) < tol)
}

function getLevelNumber(levelName) {
    if (levelName.includes("tutorial")) {
        return 0;
    }
    if (levelName.includes("levelA")) {
        return 1;
    }
    if (levelName.includes("levelB")) {
        return 2;
    }
    if (levelName.includes("levelC")) {
        return 3;
    }
    if (levelName.includes("levelD")) {
        return 4;
    }
}

function addLevelValues(myLevel, ro) { //Adds all the global variables for this level
    myLevel.E = parseInt(ro.parameters["E"]);
    myLevel.R0 = parseInt(ro.parameters["R"]);
    myLevel.R = [];
    myLevel.initR = [];
    myLevel.goalR = [];
    myLevel.goalV = [];
    myLevel.V = [];
    myLevel.initR = [parseInt(ro.parameters["R1"]), parseInt(ro.parameters["R2"]), parseInt(ro.parameters["R3"])];
    myLevel.goalR = [parseInt(ro.parameters["GoalR1"]), parseInt(ro.parameters["GoalR2"]), parseInt(ro.parameters["GoalR3"])];
    for (var i = 0; i < myLevel.initR.length; i++) {
        myLevel.R[i] = myLevel.initR[i];
    }
    myLevel.V = findVValues(myLevel.E, myLevel.R0, myLevel.R);
    myLevel.goalV = findVValues(myLevel.E, myLevel.R0, myLevel.goalR)
}


function getMemberDataObj(userID) { //Takes the userID and returns the studentData object for that ID
    var memberDataObject = function () {};
    for (var i = 0; i < studentDataObjs.length; i++) {
        if (studentDataObjs[i]["UserID"] == userID) {
            memberDataObject = studentDataObjs[i];
        }
    }
    return memberDataObject;
}

function unixTimeConversion(uTime) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(uTime * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    var formattedTime = month + "/" + day + "/" + year + " " +
        hours + ':' + minutes + ":" + seconds + "." + milliseconds;
    return (formattedTime);
}

function arrayToObjects(rows) { //takes and array with a header and some data and returns objects
    var headers = rows[0];

    function rowObj() {};
    var rowObjs = [];
    for (i = 1; i < rows.length; i++) {
        currentRow = new rowObj;
        var row = rows[i];
        if (row.length == headers.length) {
            for (j = 0; j < row.length; j++) {
                currentRow[headers[j]] = row[j];
            }
        }
        rowObjs.push(currentRow);
    }
    return rowObjs;
}

function getAlphabeticLabel(index) {
    var alphaArray = ["T", "A", "B", "C", "D"];
    if ((index >= 0) && (index <= 4)) {
        return alphaArray[index];
    } else {
        alert("Alphabetic label array index out of range." + index)
    }
}

function testScore(varStr) {
    var act = new action;
    var lvl = new level;
    lvl.number = 1;
    lvl.label = "A";
    act.board = 2;
    act.level = lvl;
    console.log(score(varStr, act));
}

function saveData(data) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {
            type: "text/csv;encoding:utf-8"
        });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

function downloadLogCSV(csvDataArray) {
    var truncatedFilename = fileName.slice(0, (fileName.length - 4));
    csvDataFilename = truncatedFilename + ".LOGS.csv";
    if (csvDataArray.length < 2) {
        alert("Run a query of team(s), level(s), and action(s) BEFORE downloading a LOG report file");
        return;
    }
    var csvContent = '';
    // Loop through the data array and build the csv file to be downloaded
    // Columns are separated by "," and rows are separated by "\n"
    csvDataArray.forEach(function (infoArray, index) {
        dataString = infoArray.join(",");
        csvContent += index < csvDataArray.length ? dataString + "\n" : dataString;
    })
    saveData()(csvContent, csvDataFilename);
    console.log("util.js: csv of log data (" + csvDataArray.length + " records) created and saved.");
}

function downloadSummaryCSV(csvSummaryArray) {
    var truncatedFilename = fileName.slice(0, (fileName.length - 4));
    var csvSummaryFilename = truncatedFilename + ".SUMMARY.csv";
    if (csvSummaryArray.length < 2) {
        alert("Produce a Message or Teacher report BEFORE downloading a SUMMARY report file.");
        return;
    }
    var csvContent = '';
    // Loop through the data array and build the csv file to be downloaded
    // Columns are separated by "," and rows are separated by "\n"
    csvSummaryArray.forEach(function (infoArray, index) {
        dataString = infoArray.join(",");
        csvContent += index < csvSummaryArray.length ? dataString + "\n" : dataString;
    })
    saveData()(csvContent, csvSummaryFilename);
    console.log("util.js: csv of summary data (" + csvSummaryArray.length + " created and saved.");

}

function sortByTime(a, b) {
    if (a[5] === b[5]) {
        return 0;
    } else {
        return (a[5] < b[5]) ? -1 : 1;
    }
}