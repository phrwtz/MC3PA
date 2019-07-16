function findInterrupts(myLevel) {
    var r = [],
        i,
        j,
        endTimesToCompare = [];
    myLevel.interrupts = [];
    for (i = 0; i < myLevel.members[0].runs.length; i++) {
        r.push(myLevel.members[0].runs[i]);
    }
    for (i = 0; i < myLevel.members[1].runs.length; i++) {
        r.push(myLevel.members[1].runs[i]);
    }
    for (i = 0; i < myLevel.members[2].runs.length; i++) {
        r.push(myLevel.members[2].runs[i]);
    }
    r = r.sort(function (a, b) {
        return a.startTime - b.startTime;
    });
    //Search an array of runs sorted by increasing start times. Select each run in turn and keep its end time on a stack. Examine the next run to see whether it starts before the earlier one has ended; if so, we have an interrupt. If not, the first run us uninterrupted. Move the index to examine the second run in the same way. If we find an interrupt, we record it and store it in the level's interrupts array. As before, we increment the index to look for an interrupt of the second run. If a run interrupts more than one other run we count that as a single interrupt.
    for (i = 0; i < r.length - 1; i++) {
        if (r[i + 1].startTime < r[i].endTime) {
            generateInterrupt(myLevel, r, i);
        }
    }
}

function generateInterrupt(myLevel, r, i) {
    var interpt = new interrupt();
    interpt.interrupter = r[i + 1].actor;
    interpt.interruptee = r[i].actor;
    interpt.time = r[i + 1].startMinSecs;
    myLevel.interrupts.push(interpt);
    //console.log("Interrupt found at time " + interpt.time + " on level " + myLevel.label + " of team " + myLevel.team.name + ". Interrupter was " + interpt.interrupter.name + ", interruptee was " + interpt.interruptee.name + ".");
}