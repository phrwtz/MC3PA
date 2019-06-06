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

function makeTeams(rowObjs, myTeacher) { //parse the row objects array looking for and populating teams
    for (i = 0; i < rowObjs.length; i++) {
        var ro = rowObjs[i];
        if (ro["event"] == "model values") {
            addTeam(ro, myTeacher);
        }
    }
    return teams;
}

//We invoke this function when the event is "model values"
//we construct a new team from ro and add it to teams array.
//If we already have a team with that name, classID, and teacher name we use it.
function addTeam(ro) {
    var userID = ro["username"].slice(0, ro["username"].indexOf("@")); // user id precedes @
    var memberObject = getMemberObject(userID);
    var teamName = ro.parameters["groupname"];
    var classId = ro["class_id"];
    var myTeacher = getTeacherById(classId);
    var myTeam = inTeams(teamName, classId, myTeacher.name)
    if (!myTeacher) {
        console.log("No teacher found with class ID " + classId);
    }
    if (!myTeam) { //If this is a new team, initialize variables
        myTeam = new team;
        myTeam.levels = [];
        myTeam.name = ro.parameters["groupname"];
        myTeam.classId = classId;
        myTeam.teacher = myTeacher;
        if (myTeam.classId != myTeacher.classId) {
            console.log("wrong teacher~");
        }
        myTeacher.teams.push(myTeam);
        if (memberObject) {
            myTeam.class = memberObject["class"];
            myTeam.teacher = memberObject["teacher"];
        }
        myTeam.totalTime = 0;
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
        if (levelNumber == 0) {
            return
        }; //For the moment we're ignoring tutorials
        myLevel.firstActionUTime = new Date(ro["time"]).getTime() / 1000;
        addLevelValues(myLevel, ro); //Add all the global variables for this level
        myLevel.id = ID();
        myLevel.actions = [];
        myLevel.members = [];
        myLevel.number = levelNumber;
        myLevel.label = getAlphabeticLabel(levelNumber);
        myLevel.team = myTeam;
        myLevel.teacher = myTeam.teacher;
        myLevel.runs = 0; //total number of runs (member objects contain the runs themselves)
        myLevel.interrupts = []; //array of resistor change interrupt events. (These belong to two members, so they are kept in the enclosing level.)
        myLevel.resistorChanges = 0;
        myLevel.runsAvgLength = 0;
        myLevel.runsPctCloser = 0;
        myLevel.attempted = false;
        myLevel.successVTime = false;
        myLevel.success = false;
        myLevel.successV = false;
        myLevel.successE = false;
        myLevel.successR = false;
        myLevel.successVTime = -1;
        myLevel.successETime = -1;
        myLevel.successRTime = -1;
        myLevel.endVUtime = null;
        myLevel.attainedVs = false;
        myLevel.allRsEqualR0 = false;
        myLevel.chattedEAfterAllRsEqual = false;
        myLevel.chattedR0AfterAllRsEqual = false;
        myLevel.CynthiaStrategyDetected = false;
        myLevel.circuitBreakStrategyDetected = false;
        myLevel.bigRStrategyDetected = false;
        myLevel.EGuessAndCheckSuccess = false;
        myLevel.EGuessAndCheckFailure = false;
        myLevel.RGuessAndCheckSuccess = false;
        myLevel.RGuessAndCheckFailure = false;
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
        if (checkLevelIdForDuplication(myLevel)) {
            console.log("Level id duplicated!")
        }
        myTeam.levels.push(myLevel);
    }
    addMember(myLevel, ro) //add member, if new. Otherwise, do nothing.
}

function addMember(myLevel, ro) {
    var userID = ro.username.slice(0, ro.username.indexOf("@")); // user id precedes @
    var myMember = inMembers(userID, myLevel.members);
    if (!myMember) { //If this is a new member initialize and push to the members array
        myMember = new member;
        myMember.runs = []; //Array to hold resistor change runs
        myMember.onARun = false;
        myMember.team = myLevel.team;
        myMember.id = userID;
        myMember.name = ro.parameters["username"];
        myMember.board = ro.parameters["board"];
        myMember.startTime = ro["time"]; //Log in time for this member
        myMember.colIndex = myLevel.members.length // will be 0, 1, or 2. Used to decide which column to use for this members actions.
        var colorArray = ["DarkTurquoise", "Gold", "GreenYellow"];
        myMember.color = colorArray[myMember.colIndex];
        myMember.styledName = "<span style= \"background-color: " + myMember.color + "\">" + myMember.name + "</span>";
        if (myLevel.members.length == 2) {
            myLevel.startTime = ro["time"];
            myLevel.startUTime = new Date(ro["time"]).getTime() / 1000;
            myLevel.startPTime = new Date(parseFloat(myLevel.startUTime * 1000));
            myLevel.attempted = true;
        }
        myLevel.members.push(myMember);
        //       console.log("At " + ro["time"] + " new member " + myMember.name + " added to level " + myLevel.label + " of team " + myLevel.team.name + " of teacher " + myTeam.teacher.name + ". That makes " + myLevel.members.length + " so far.");

        // Start time for level is when the third member is added
        // Attempted is true when the third member is added, not before
    }
}

//if a team with the right name, classID, and teacher name exists in the teams array, return it. Otherwise return null
function inTeams(teamName, classId, teacherName) {
    for (var j = 0; j < teams.length; j++) {
        if ((teams[j].name == teamName) && (teams[j].classId == classId) && (teams[j].teacher.name == teacherName)) {
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


function getMemberObject(userId) { //Takes the userID and returns the studentData object for that ID
    for (var i = 0; i < studentDataObjs.length; i++) {
        if (studentDataObjs[i]["userId"] == userId) {
            return studentDataObjs[i];
        }
    }
    return null;
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

function deselectAll(checkboxName) {
    var checkboxArray = $("input[name=" + checkboxName + "]");
    for (var i = 0; i < checkboxArray.length; i++) {
        checkboxArray[i].checked = false;
    }
}

function arrayToObjects(rows) { //takes and array with a header and some data and returns objects
    var headers = rows[0];

    function rowObj() {};
    var rowObjs = [];
    for (i = 1; i < rows.length; i++) {
        currentRow = new rowObj;
        var row = rows[i];
        if (row.length > 0) {
            for (j = 0; j < row.length; j++) {
                var thisHeader = headers[j].replace(" ", "");
                currentRow[thisHeader] = row[j];
            }
            rowObjs.push(currentRow);
        }
    }
    return rowObjs;
}

function makeStudentDataObjects(rows) {
    var headers = rows[0];

    function rowObj() {};
    var rowObjs = [];
    for (i = 1; i < rows.length; i++) {
        currentRow = new rowObj;
        var row = rows[i];
        for (j = 0; j < row.length; j++) {
            var header = headers[j];
            if (header == "Student ID") {
                currentRow["studentId"] = row[j];
            } else if (header == "Learner ID(s)") {
                currentRow["learnerId"] = row[j];
            } else if (header == "Class ID") {
                currentRow["classId"] = row[j];
            } else if (header == "Class") {
                currentRow["class"] = row[j];
            } else if (header == "UserID") {
                currentRow["userId"] = row[j];
            } else if (header == "Teachers") {
                currentRow["teacher"] = row[j];
            }
        }
        if (currentRow.studentId) {
            rowObjs.push(currentRow);
        }
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

function downloadTeamsArray(teams) {

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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

function calculateCurrent(act) {
    var level = act.level,
        E = level.E,
        R0 = level.R0,
        R1 = act.R[0],
        R2 = act.R[1],
        R3 = act.R[2],
        I = E / (R0 + R1 + R2 + R3);
    return I;
}

function computeEndUTime(myLevel) {
    //For levels A and B the end time for the level is the earlier of the time when they first submitted the correct voltages or, if they never did that, the time of the last action
    if ((myLevel.label == "A") || (myLevel.label == "B")) {
        if (myLevel.successVTime > 0) {
            return myLevel.successVTime
        } else {
            return myLevel.lastActionUTime
        };
    }

    //For level C, if they submitted the correct voltages and the correct E the end time is the later of those times, if not the end time is the time of the last action
    else if ((myLevel.label == "C")) {
        if ((myLevel.successVTime > 0) && (myLevel.successETime > 0)) {
            return Math.max(myLevel.successVTime, myLevel.successETime)
        } else {
            return myLevel.lastActionUTime;
        };
    }
    //For level D, if they submitted the correct voltages and the correct E and R0, the end time is the later of those times, if not the end time is the time of the last action
    else if ((myLevel.label == "D")) {
        if ((myLevel.successVTime > 0) && (myLevel.successETime > 0) && (myLevel.successRTime > 0)) {
            return Math.max(myLevel.successVTime, Math.max(myLevel.successETime, myLevel.successRTime));
        } else {
            return myLevel.lastActionUTime;
        };
    }
}

function computeSuccessMessage(myLevel) {
    if ((myLevel.label == "A") || myLevel.label == "B") {
        successMsg = (myLevel.success ?
            "<br><b><font color=green>Level successful.</font></b>" :
            "<br><b><font color=red>Level unsuccessful.</font></b>");
    } else if (myLevel.label == "C") {
        //      cellContents += levelEMsg;
        successMsg = ((myLevel.success && myLevel.successE) ?
            "<br><b><font color=green>Level successful.</font></b>" :
            "<br><b><font color=red>Level unsuccessful.</font></b>");
    } else if (myLevel.label == "D") {
        //        cellContents += levelEMsg + levelRMsg;
        successMsg = ((myLevel.success && myLevel.successE && myLevel.successR) ?
            "<br><b><font color=green>Level successful.</font></b>" :
            "<br><b><font color=red>Level unsuccessful.</font></b>");
    }
    return successMsg;
}

function sortActionsByUTime(actions) {
    actions.sort(function (a, b) {
        return (a.uTime - b.uTime)
    });
}

function LocationInCalculation(action) { //Takes a calculation and returns "input"  
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
    console.log("Goal r1 detected");
    return myLevel;
}

var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

function concatenateChats(levels) { //Returns a long string for searching
    var chainedChats = "";
    for (var i = 0, myLevel; myLevel = levels[i]; i++) {
        for (var j = 0, myAction; myAction = myLevel.actions[j]; j++) {
            if (myAction.type == "message") {
                chainedChats += myAction.msg;
            }
        }
    }
    return chainedChats;
}

function findMsg(actions) { //Finds the first action of type "message"
    for (var i = 0; i < actions.length; i++) {
        if (actions[i].type == 'message') {
            alert("i = " + i);
            break;
        }
    }
}

function countOccurrences(searchStr, str) {
    var count = 0;
    var testStr = str;
    var pos = -1;
    var len = searchStr.length;
    pos = testStr.indexOf(searchStr);
    if (!(pos == -1)) {
        count++;
        testStr = testStr.slice(pos + len);
        count = count + countOccurrences(searchStr, testStr);
    }
    return count;
}

function goalVsChatted(myLevel) {
    var goalV1Chatted = false,
        goalV2Chatted = false,
        goalV3Chatted = false;

    for (var i = 0; i < myLevel.varRefs["goalV1"].length; i++) {
        if (myLevel.varRefs["goalV1"][i][0].type == "message") {
            goalV1Chatted = true;
            break;
        }
    }
    for (i = 0; i < myLevel.varRefs["goalV2"].length; i++) {
        if (myLevel.varRefs["goalV2"][i][0].type == "message") {
            goalV2Chatted = true;
            break;
        }
    }

    for (i = 0; i < myLevel.varRefs["goalV3"].length; i++) {
        if (myLevel.varRefs["goalV3"][i][0].type == "message") {
            goalV3Chatted = true;
            break;
        }
    }
    if (goalV1Chatted && goalV2Chatted && goalV3Chatted) {
        return "all";
    } else if (goalV1Chatted || goalV2Chatted || goalV3Chatted) {
        return "some";
    } else {
        return "none";
    }
}

function goalRsChatted(myLevel) {
    var goalR1Chatted = false,
        goalR2Chatted = false,
        goalR3Chatted = false,
        goalR1ChattedToOther = false,
        goalR2ChattedToOther = false,
        goalR3ChattedToOther = false;
    for (var i = 0; i < myLevel.varRefs["goalR1"].length; i++) {
        var myVarRefs = myLevel.varRefs["goalR1"];
        for (var j = 0; j < myVarRefs.length; j++) {
            myAction = myVarRefs[j][0];
            if (myAction.type == "message") {
                goalR1Chatted = true;
                if (myAction.board != 0) {
                    goalR1ChattedToOther = true;
                }
            }
            break;
        }
    }
    for (var i = 0; i < myLevel.varRefs["goalR2"].length; i++) {
        var myVarRefs = myLevel.varRefs["goalR2"];
        for (var j = 0; j < myVarRefs.length; j++) {
            myAction = myVarRefs[j][0];
            if (myAction.type == "message") {
                goalR2Chatted = true;
                if (myAction.board != 1) {
                    goalR2ChattedToOther = true;
                }
            }
            break;
        }
    }
    for (var i = 0; i < myLevel.varRefs["goalR3"].length; i++) {
        var myVarRefs = myLevel.varRefs["goalR3"];
        for (var j = 0; j < myVarRefs.length; j++) {
            myAction = myVarRefs[j][0];
            if (myAction.type == "message") {
                goalR3Chatted = true;
                if (myAction.board != 2) {
                    goalR3ChattedToOther = true;
                }
            }
            break;
        }
    }
    if ((goalR1ChattedToOther && goalR2ChattedToOther) ||
        (goalR2ChattedToOther && goalR3ChattedToOther) || (goalR1ChattedToOther && goalR3ChattedToOther)) {
        return "all";
    } else if (goalR1ChattedToOther || goalR2ChattedToOther || goalR3ChattedToOther) {
        return "some";
    } else {
        return "none";
    }
}

function goalVsCalculated(myLevel) {
    var goalV1Calculated = false,
        goalV2Calculated = false,
        goalV3Calculated = false;

    for (var i = 0; i < myLevel.varRefs["goalV1"].length; i++) {
        if (myLevel.varRefs["goalV1"][i][0].type == "calculation") {
            goalV1Calculated = true;
            break;
        }
    }
    for (var i = 0; i < myLevel.varRefs["goalV2"].length; i++) {
        if (myLevel.varRefs["goalV2"][i][0].type == "calculation") {
            goalV2Calculated = true;
            break;
        }
    }
    for (var i = 0; i < myLevel.varRefs["goalV3"].length; i++) {
        if (myLevel.varRefs["goalV3"][i][0].type == "calculation") {
            goalV3Calculated = true;
            break;
        }
    }
    if (goalV1Calculated && goalV2Calculated && goalV3Calculated) {
        return "all";
    } else if (goalV1Calculated || goalV2Calculated || goalV3Calculated) {
        return "some";
    } else {
        return "none";
    }
}

function goalRsCalculated(myLevel) {
    var goalR1Calculated = false,
        goalR2Calculated = false,
        goalR3Calculated = false;

    for (var i = 0; i < myLevel.varRefs["goalR1"].length; i++) {
        if (myLevel.varRefs["goalR1"][i][0].type == "calculation") {
            goalR1Calculated = true;
            break;
        }
    }
    for (var i = 0; i < myLevel.varRefs["goalR2"].length; i++) {
        if (myLevel.varRefs["goalR2"][i][0].type == "calculation") {
            goalR2Calculated = true;
            break;
        }
    }
    for (var i = 0; i < myLevel.varRefs["goalR3"].length; i++) {
        if (myLevel.varRefs["goalR3"][i][0].type == "calculation") {
            goalR3Calculated = true;
            break;
        }
    }
    if (goalR1Calculated && goalR2Calculated && goalR3Calculated) {
        return "all";
    } else if (goalR1Calculated || goalR2Calculated || goalR3Calculated) {
        {
            return "some";
        }
    } else {
        return "none";
    }
}

function assignLevelsToTeachers() { //Adds success flag and Vgoals and Rgoals properties
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.attempted) {
                myLevel.success = setSuccessFlag(myLevel);
                myLevel.goalVsChatted = goalVsChatted(myLevel);
                myLevel.goalRsChatted = goalRsChatted(myLevel);
                myLevel.goalVsCalculated = goalVsCalculated(myLevel);
                myLevel.goalRsCalculated = goalRsCalculated(myLevel);
                attemptedLevels.push(myLevel);
            }
        }
    }
}

function getLevelByID(id) {
    var myTeam;
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.id == id) {
                return myLevel;
            }
        }
    }
}

function findSelectedLevel() { // returns the level, if there is one, that has its radio button checked. If no radio button has been checked returns null
    var levelButtons = document.getElementsByName("levelRadio");
    if (!levelButtons.length == 0) {
        var myButton,
            myLevel;
        for (var t = 0; t < levelButtons.length; t++) {
            myButton = levelButtons[t];
            if (myButton.checked) {
                myLevel = getLevelByID(levelButtons[t].id);
                return myLevel;
            }
        }
    } else {
        return null;
    }

}

function clearElement(id) {
    if (document.getElementById(id)) {
        var element = document.getElementById(id)
        var parent = element.parentElement;
        parent.removeChild(element);
    }
}

function RChatFilter(level) {
    var returnBoolean = false;
    if (($("#RAllChat")[0].checked) && (myLevel.goalRsChatted == "all")) {
        returnBoolean = true;
    }
    if (($("#RSomeChat")[0].checked) && (myLevel.goalRsChatted == "some")) {
        returnBoolean = true;
    }
    if (($("#RNoChat")[0].checked) && (myLevel.goalRsChatted == "none")) {
        returnBoolean = true;
    }
    return returnBoolean;
}

function RCalcFilter(level) {
    var returnBoolean = false;
    if (($("#RAllCalc")[0].checked) && (myLevel.goalRsCalculated == "all")) {
        returnBoolean = true;
    }
    if (($("#RSomeCalc")[0].checked) && (myLevel.goalRsCalculated == "some")) {
        returnBoolean = true;
    }
    if (($("#RNoCalc")[0].checked) && (myLevel.goalRsCalculated == "none")) {
        returnBoolean = true;
    }
    return returnBoolean;
}

function VChatFilter(level) {
    var returnBoolean = false;
    if (($("#VAllChat")[0].checked) && (myLevel.goalVsChatted == "all")) {
        returnBoolean = true;
    }
    if (($("#VSomeChat")[0].checked) && (myLevel.goalVsChatted == "some")) {
        returnBoolean = true;
    }
    if (($("#VNoChat")[0].checked) && (myLevel.goalVsChatted == "none")) {
        returnBoolean = true;
    }
    return returnBoolean;
}

function outcomeFilter(level) {
    var returnBoolean = false;
    if (($("#success")[0].checked) && (myLevel.success)) {
        returnBoolean = true;
    }
    if (($("#failure")[0].checked) && (!myLevel.success)) {
        returnBoolean = true;
        return returnBoolean;
    }
    return returnBoolean;
}

function levelFilter(level) {
    var returnBoolean = false;
    if (($("#levelA")[0].checked) && (myLevel.label == "A")) {
        returnBoolean = true;
    }
    if (($("#levelB")[0].checked) && (myLevel.label == "B")) {
        returnBoolean = true;
    }
    if (($("#levelC")[0].checked) && (myLevel.label == "C")) {
        returnBoolean = true;
    }
    if (($("#levelD")[0].checked) && (myLevel.label == "D")) {
        returnBoolean = true;
    }
    return returnBoolean;
}

function checkLevelIdForDuplication(myLevel) {
    var levelIdsSoFar = [];
    myId = myLevel.id;
    myTeam = myLevel.team;
    for (var i = 0; i < myTeam.levels.length; i++) {
        levelIdsSoFar.push(myTeam.levels[i].id);
    }
    return (levelIdsSoFar.includes(myId));
}

function getTeacherById(classId) {
    for (var i = 0; i < teachers.length; i++) {
        if (teachers[i].classId == classId) {
            return teachers[i];
        }
    }
    return null;
}

function oneBigR(action) { //Returns true if one of the resistors is much higher than the other two (a possible precursor to measuring E)
    return ((action.R[0] - (action.R[1] + action.R[2]) > 100000) || (action.R[1] - (action.R[0] + action.R[2]) > 100000) || (action.R[2] - (action.R[1] + action.R[0]) > 100000))
}

function findOtherMembers(myLevel, myMember) {
    var otherMembers = [];
    for (var i = 0; i < myLevel.members.length; i++) {
        if (myLevel.members[i].id && (myLevel.members[i].id != myMember.id)) { 
            otherMembers.push(myLevel.members[i]);
        }
    }
    return otherMembers;
}

function setInterrupts(myLevel, myMember, myRun) {
    var otherMembers = findOtherMembers(myLevel, myMember);
    for (var i = 0; i < otherMembers.length; i++) {
        if (otherMembers[i].onARun) {
            var newInterrupt = new interrupt;
            newInterrupt.time = myRun.startTime;
            newInterrupt.outerRun = otherMembers[i].runs[otherMembers[i].runs.length - 1];
            newInterrupt.innerRun = myRun;
            myLevel.interrupts.push(newInterrupt);
        }
    }
}

function setRunStatus(myLevel, myAction, interval) { // Checks all runs and terminates them if this action is more than <interval> after their most recent resistor change.
    for (var i = 0; i < myLevel.members.length; i++) {
        var myMember = myLevel.members[i];
        if (myMember.onARun) {
            var lastRun = myMember.runs[myMember.runs.length - 1]; 
            if ((myAction.uTime - lastRun.endTime) > interval) {
                myMember.onARun = false;
            }
        }
    }
}