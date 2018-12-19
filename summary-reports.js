function specialReport() {
    var levelSucceed = [0, 0, 0, 0];
    var levelFail = [0, 0, 0, 0];
    var levelNotAttempted = [0, 0, 0, 0];
    var levelSuccessTime = [0, 0, 0, 0];
    var levelFailTime = [0, 0, 0, 0];
    var levelSuccessActions = [0, 0, 0, 0];
    var levelFailActions = [0, 0, 0, 0];
    var avgLevelSuccessTime = [0, 0, 0, 0];
    var avgLevelSuccessActions = [0, 0, 0, 0];
    var avgLevelFailTime = [0, 0, 0, 0];
    var avgLevelFailActions = [0, 0, 0, 0];
    var label = ["A", "B", "C", "D"];
    var levelTime = 0,
        avgLevelSuccessMinutes= [0, 0, 0, 0],
        avgLevelSuccessSeconds= [0, 0, 0, 0];
    document.getElementById("data").innerHTML = "";
    for (var i = 0; i < teams.length; i++) {
        myTeam = teams[i];
        for (var j = 0; j < myTeam.levels.length; j++) {
            myLevel = myTeam.levels[j];
            if (myLevel.attempted) {
                myLevel.success = setSuccessFlag(myLevel);
                levelTime = myLevel.lastActionUTime - myLevel.startUTime;
                if (myLevel.success) {
                    levelSucceed[j]++;
                    levelSuccessTime[j] += levelTime;
                    levelSuccessActions[j] += myLevel.actions.length;
                } else {
                    levelFail[j]++;
                    levelFailTime[j] += levelTime;
                    levelFailActions[j] += myLevel.actions.length;
                }
            } else {
                levelNotAttempted[j]++;
            }
        } // Next level
    } // Next team
    for (var k = 0; k < 4; k++) {
        avgLevelSuccessTime[k] = Math.round(levelSuccessTime[k] / levelSucceed[k]);
        avgLevelSuccessMinutes[k] = Math.round(avgLevelSuccessTime[k] / 60);
        avgLevelSuccessSeconds[k] = avgLevelSuccessTime[k] % 60;
        avgLevelSuccessActions[k] = Math.round(levelSuccessActions[k] / levelSucceed[k]);Math.round(levelFailTime[k] / levelFail[k]);
        avgLevelFailActions[k] =  Math.round(levelFailActions[k] / levelFail[k]);

        document.getElementById("data").innerHTML += ("<br>At level " + label[k] + ", " + levelSucceed[k] + " teams succeeded, " +  levelFail[k] + " failed and " + levelNotAttempted[k] + " didn't attempt the level.<br>");
        if (levelSucceed[k]) {
            document.getElementById("data").innerHTML += ("Average time to success = " + avgLevelSuccessMinutes[k] + ":" + avgLevelSuccessSeconds[k] + ". Average number of actions for success = " + avgLevelSuccessActions[k] + "<br>");
        }
        if (levelFail[k]) {
            document.getElementById("data").innerHTML += ("Average number of actions for failure = " + avgLevelFailActions[k] + "<br>");
        }
    }
}