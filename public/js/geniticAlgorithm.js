////////////////////////////////////////////DATA//////////////////////////////////////////////////////
let users = [];

let courses = [];


let coursesUsers = [];

let classRooms = [];


let lectures = [];


let roles = [];

let sg = [];
let mainSg = [];

let times = [];

let timeTable = [];

let uploads = [];
let lsg = [];

let utilities = [];

let utilitiesLectures = [];
/////////////////////////////////////////////////////DATA^////////////////////////////////////////////////////
/////////////////////////////////////////////////////DATA^////////////////////////////////////////////////////
/////////////////////////////////////////////////////DATA^///////////////////////////////////////////////////


//////////////////////////////////////////////initial population////////////////////////////////////////////
// JSON lengths:
let timeCount = Object.keys(times).length;
let classCount = Object.keys(classRooms).length;
let lectureCount = Object.keys(lectures).length;
let usersCount = Object.keys(users).length;
let sgCount = Object.keys(sg).length;
let lsgCount = Object.keys(lsg).length;
let utilitiesLecturesCount = Object.keys(utilitiesLectures).length;
let utilitiesCount = Object.keys(utilities).length;

//sz is the size of the population
//lecs are the number of lectures in one day
let sz = 5;
let lecs = lectureCount;

//declear initial population array
let initP = [];
var initP_length = 5;
for (var i = 0; i < initP_length; ++i) {
    initP[i] = [];
}



function initialPopulation(sz = 5, lecs) {
    for (let i = 0; i < sz; i++) {
        const arr = new Uint16Array(6);
        crypto.getRandomValues(arr);
        for (let j = 0; j < lecs; j++) {
            let x, y;
            if (j % 2 == 0) {
                if (typeof arr[j] === "number") {
                    x = times[(Math.floor(Math.random() * timeCount) + arr[j]) % timeCount]['id'];
                    y = classRooms[(Math.floor(Math.random() * classCount) + arr[j]) % classCount]['id'];
                }
                else {
                    x = times[(Math.floor(Math.random() * timeCount)) % timeCount]['id'];
                    y = classRooms[(Math.floor(Math.random() * classCount)) % classCount]['id'];
                }
            }
            else {
                if (typeof arr[j] === "number") {
                    x = times[Math.floor(Math.random() * timeCount + arr[j]) % timeCount]['id'];
                    y = classRooms[Math.floor(Math.random() * classCount + arr[j]) % classCount]['id'];
                }
                else {
                    x = times[Math.floor(Math.random() * timeCount) % timeCount]['id'];
                    y = classRooms[Math.floor(Math.random() * classCount) % classCount]['id'];
                }
            }
            let z = lectures[j]['id'];

            initP[i][j] = { 'x': x, 'y': y, 'z': z };


        }
        initP[i][lecs] = -1;

    }


}



//////////////////////////////evaluation////////////////////////////////////
//////////////////////////////evaluation////////////////////////////////////

function fitness(x) {

    let newConflict = 0;

    //عدم وجود محاضرتين بنفس الوقت لنفس الطلاب 

    for (let i = 0; i < lecs - 1; i++) {
        for (let j = i + 1; j < lecs; j++) {
            if (x[i]['x'] === x[j]['x']) {

                let flag = sgIntersect(x[i]['z'], x[j]['z']);
                if (flag) newConflict += 10;

            }
        }
    }

    //عدم وجود محاضرتين بنفس الوقت لنفس الدكتور 

    for (let i = 0; i < lecs - 1; i++) {
        for (let j = i + 1; j < lecs; j++) {
            if (x[i]['x'] === x[j]['x']) {

                let flag = false;

                let lecture1 = lectures.find(obj => obj.id === x[i]['z']);
                let lecture2 = lectures.find(obj => obj.id === x[j]['z']);

                if (lecture1['user_id'] === lecture2['user_id']) flag = true;

                if (flag) newConflict += 10;

            }
        }
    }

    //عدم وجود محاضرتين بنفس الوقت بنفس القاعة 

    for (let i = 0; i < lecs - 1; i++) {
        for (let j = i + 1; j < lecs; j++) {
            if (x[i]['x'] === x[j]['x']) {

                let flag = false;

                if (x[i]['y'] === x[j]['y']) flag = true;

                if (flag) newConflict += 10;

            }
        }
    }

    // وضع المحاضرات و الجلسات في القاعات المخصصة.

    for (let i = 0; i < lecs; i++) {
        const classroom = classRooms.find(obj => obj.id === x[i]['y']);
        const lecture = lectures.find(obj => obj.id === x[i]['z']);

        if (lecture['lecture_type'] == 0 && classroom['type'] === 'lecture' ||
            lecture['lecture_type'] == 1 && classroom['type'] === 'session' ||
            classroom['type'] === 'both')
            continue;
        else newConflict += 10;
    }

    //توافق عدد الطلاب مع سعة القاعة 
    for (let i = 0; i < lecs; i++) {
        const classroom = classRooms.find(obj => obj.id === x[i]['y']);

        let flag = false;
        if (classroom['capacity'] == null) flag = true;
        else {
            let sgSize = lectureSgSize(x[i]['z']);

            if (sgSize === 0 || sgSize <= classroom['capacity']) flag = true;

        }
        if (!flag) newConflict += 10;
    }

    // وضع المحاضرة التي تحتاج جهاز عرض في قاعة يمكن تركيب جهاز العرض فيها
    for (let i = 0; i < lecs; i++) {
        let flag = false;
        let check = needsDatashow(x[i]['z']);
        const classroom = classRooms.find(obj => obj.id === x[i]['y']);

        if ((check && classroom['datashow']) || !check) flag = true;
        if (!flag) newConflict += 10;
    }

    // وضع المحاضرة التي تحتاج أداة مساعدة في وقت تتوافر فيه هذه الأداة
    for (let i = 0; i < lecs; i++) {

        for (let k = 0; k < utilitiesLecturesCount; k++) {
            if (utilitiesLectures[k]['lecture_id'] === x[i]['z']) {
                let utilityId = utilitiesLectures[k]['utility_id'];
                let flag = utilityAvailability(utilityId, x[i]['x'], x);
                if (!flag) newConflict += 10;
            }
        }
    }

    // تحقيق أحد رغبات التوقيت الثلاث للدكتور بالنسبة لمحاضرة ما
    for (let i = 0; i < lecs; i++) {

        const lecture = lectures.find(obj => obj.id === x[i]['z']);
        let userID = lecture['user_id'];
        const user = users.find(obj => obj.id === userID);
        if (user['first_best_time'] == null && user['second_best_time'] !== null && user['third_best_time'] !== null) continue;
        if (user['first_best_time'] !== x[i]['x'] && user['second_best_time'] !== x[i]['x'] && user['third_best_time'] !== x[i]['x'])
            newConflict += 1;
    }

    // عدم وضع ثلاث محاضرات متتالية للدكتور

    let docTimes = [];
    let docIndexes = [];

    for (let i = 0; i < lecs; i++) {
        const lecture = lectures.find(obj => obj.id === x[i]['z']);
        const timeobj = times.find(obj => obj.id === x[i]['x']);

        const userId = lecture['user_id'];
        const time = timeobj;

        // Initialize the inner array if it doesn't exist yet
        if (!docTimes[userId]) {
            docTimes[userId] = [];
            docIndexes.push(userId);
        }

        // Push the element into the inner array
        docTimes[userId].push(time);
    }
    for (let i = 0; i < docIndexes.length; i++) {

        docTimes[docIndexes[i]].sort((a, b) => {
            // Sort by day first
            if (a.day !== b.day) {
                return a.day - b.day;
            }

            // Convert start_time and end_time to minutes since midnight for numerical comparison
            const [aHours, aMinutes] = a.start_time.split(':').map(Number);
            const [bHours, bMinutes] = b.start_time.split(':').map(Number);
            const aMinutesSinceMidnight = aHours * 60 + aMinutes;
            const bMinutesSinceMidnight = bHours * 60 + bMinutes;

            // Sort by start_time if day is the same
            return aMinutesSinceMidnight - bMinutesSinceMidnight;
        });

        let consecutiveTimeSlotsCounter = 1; // Start with 1 as the first time slot is considered consecutive
        for (let j = 0; j < docTimes[docIndexes[i]].length - 1; j++) {
            if (docTimes[docIndexes[i]][j]) {
                const currentTimeSlot = docTimes[docIndexes[i]][j];
                const nextTimeSlot = docTimes[docIndexes[i]][j + 1];

                const currentEndTime = currentTimeSlot.end_time;
                const nextStartTime = nextTimeSlot.start_time;

                if (currentEndTime === nextStartTime && currentTimeSlot.day === nextTimeSlot.day) {
                    consecutiveTimeSlotsCounter++;
                } else {
                    consecutiveTimeSlotsCounter = 1; // Reset the counter if consecutive time slots are not found
                }

                if (consecutiveTimeSlotsCounter === 3) {
                    // Three consecutive time slots found
                    newConflict += 1;
                    break; // Exit the loop since the requirement is met
                }
            }
        }

    }

    // أن يكون دوام الطلاب متواصل دون انقطاع
    let sgTimes = [];
    let sgIndexes = [];
    for (let i = 0; i < lecs; i++) {
        for (let j = 0; j < lsgCount; j++) {
            const timeobj = times.find(obj => obj.id === x[i]['x']);

            if (lsg[j]['lecture_id'] === x[i]['z']) {
                const studentsGroupId = lsg[j]['students_group_id'];
                const time = timeobj;

                // Initialize the inner array if it doesn't exist yet
                if (!sgTimes[studentsGroupId]) {
                    sgTimes[studentsGroupId] = [];
                    sgIndexes.push(studentsGroupId);
                }

                // Push the element into the inner array
                sgTimes[studentsGroupId].push(time);
            }
        }
    }


    for (let i = 0; i < sgIndexes.length; i++) {
        sgTimes[sgIndexes[i]].sort((a, b) => {
            // Sort by day first
            if (a.day !== b.day) {
                return a.day - b.day;
            }

            // Convert start_time and end_time to minutes since midnight for numerical comparison
            const [aHours, aMinutes] = a.start_time.split(':').map(Number);
            const [bHours, bMinutes] = b.start_time.split(':').map(Number);
            const aMinutesSinceMidnight = aHours * 60 + aMinutes;
            const bMinutesSinceMidnight = bHours * 60 + bMinutes;

            // Sort by start_time if day is the same
            return aMinutesSinceMidnight - bMinutesSinceMidnight;
        });

        let hasGap = false;
        let sgTimeLen = sgTimes[sgIndexes[i]].length;
        for (let j = 1; j < sgTimeLen; j++) {
            if (sgTimes[sgIndexes[i]][j - 1]) {
                const prevTime = sgTimes[sgIndexes[i]][j - 1];
                const currTime = sgTimes[sgIndexes[i]][j];

                // Convert start_time and end_time to minutes since midnight for numerical comparison
                const [aHours, aMinutes] = prevTime.end_time.split(':').map(Number);
                const [bHours, bMinutes] = currTime.start_time.split(':').map(Number);
                const aMinutesSinceMidnight = aHours * 60 + aMinutes;
                const bMinutesSinceMidnight = bHours * 60 + bMinutes;
                if (aMinutesSinceMidnight < bMinutesSinceMidnight && prevTime.day === currTime.day) {
                    hasGap = true;
                    break;
                }
            }
        }

        if (hasGap) {
            newConflict += 1;
        }
    }

    return newConflict;
}


/////////////////////////////SELECTION/////////////////////////////////////
/////////////////////////////SELECTION/////////////////////////////////////

const sol = [];
for (let i = 0; i < sz; i++)
    sol[i] = [initP[i][lecs]];
let iteratorForIndexes = 0;
let indexes = [];
let values = [];

function TS() {

    let mn, secondMn, first, second, third;
    first = Math.floor(Math.random() * sol.length);
    second = Math.floor(Math.random() * sol.length);
    third = Math.floor(Math.random() * sol.length);

    while (first === second) {
        second = Math.floor(Math.random() * sol.length);
    }
    while (third === second || third === first) {
        third = Math.floor(Math.random() * sol.length);
    }

    let arr = [sol[first], sol[second], sol[third]];
    mn = Math.min.apply(null, arr);

    //Delete the best one to reach the second best one   
    arr.splice(arr.indexOf(mn), 1);
    secondMn = Math.min.apply(null, arr);

    if (mn === sol[first]) {
        if (secondMn === sol[second])
            indexes[iteratorForIndexes] = [first, second];
        else
            indexes[iteratorForIndexes] = [first, third];

    }
    else if (mn === sol[second]) {
        if (secondMn === sol[first])
            indexes[iteratorForIndexes] = [second, first];
        else
            indexes[iteratorForIndexes] = [second, third];

    }
    else {
        if (secondMn === sol[first])
            indexes[iteratorForIndexes] = [third, first];
        else
            indexes[iteratorForIndexes] = [third, second];

    }
    values[iteratorForIndexes] = [mn, secondMn];
    iteratorForIndexes++;
}



/////////////////////////// cross over ////////////////////////////////////

let crossOver = [];
let children = [];
let numOfGens = lecs * 3;

function crossOverFunc(i) {
    //to get the number of gens of a solution we multiply the number of a solution by 3(x,y,z)
    const arr = new Uint16Array(6);
    crypto.getRandomValues(arr);

    let randNum = (Math.floor(Math.random() * numOfGens) + arr[i]) % numOfGens;
    let randNum2 = (Math.floor(Math.random() * numOfGens) * randNum + arr[i + 1]) % numOfGens;
    while (randNum === randNum2) {
        randNum2 = (Math.floor(Math.random() * numOfGens) * randNum + arr[i + 2]) % numOfGens;
    }
    // 
    let minRand = Math.min(randNum, randNum2);
    let maxRand = Math.max(randNum, randNum2);


    let child1 = JSON.parse(JSON.stringify(initP[indexes[i][0]]));
    let child2 = JSON.parse(JSON.stringify(initP[indexes[i][1]]));
    child1[lecs] = -1;
    child2[lecs] = -1;
    //Crossover for child1: 
    for (let j = minRand; j <= maxRand; j++) {
        let I = Math.floor(j / 3);
        let J = j % 3;
        let key = Object.keys(initP[indexes[0][0]][1])[J];
        child1[I][key] = initP[indexes[i][1]][I][key];
    }
    child1[lecs] = fitness(child1);
    // //Crossover for child2: 
    for (let j = minRand; j <= maxRand; j++) {
        let I = Math.floor(j / 3);
        let J = j % 3;
        let key = Object.keys(initP[indexes[0][0]][1])[J];
        child2[I][key] = initP[indexes[i][0]][I][key];
    }
    child2[lecs] = fitness(child2);


    return [child1, child2];
}




//////////////////////////////////////////mutation/////////////////////////////////////
//////////////////////////////////////////mutation/////////////////////////////////////

function mutation(childBeforeMutation, i) {
    let childAfterMutation = childBeforeMutation;
    // 
    const arr = new Uint16Array(6);
    crypto.getRandomValues(arr);
    // 
    let randNum = (Math.floor(Math.random() * numOfGens) + arr[i]) % numOfGens;
    let randNum2 = (Math.floor(Math.random() * numOfGens) * randNum + arr[i + 1]) % numOfGens;
    while (randNum === randNum2) {
        randNum2 = (Math.floor(Math.random() * numOfGens) * randNum + arr[i + 2]) % numOfGens;
    }
    let minRand = Math.min(randNum, randNum2);
    let maxRand = Math.max(randNum, randNum2);
    // 
    for (let j = minRand; j <= maxRand; j++) {
        //Get random values for X, Y, Z: 
        //X: 
        let tms = JSON.parse(JSON.stringify(times));
        let keysX = Object.keys(tms);
        let randomKeyX = keysX[Math.floor(Math.random() * keysX.length)];
        let randomValueX = tms[randomKeyX]['id'];
        //Y: 
        let clsRoms = JSON.parse(JSON.stringify(classRooms));
        let keysY = Object.keys(clsRoms);
        let randomKeyY = keysY[Math.floor(Math.random() * keysY.length)];
        let randomValueY = clsRoms[randomKeyY]['id'];
        //Change child's X, Y, Z: 
        let I = Math.floor(j / 3);
        let J = j % 3;
        let key = Object.keys(initP[indexes[0][0]][1])[J];
        if (key === 'x') {

            childAfterMutation[I][key] = randomValueX;
        }
        if (key === 'y') {

            childAfterMutation[I][key] = randomValueY;
        }
        if (key === 'z')
            continue;

    }

    childAfterMutation[lecs] = fitness(childAfterMutation);
    return childAfterMutation;
}



///////////////////////////////////////// repair///////////////////////////////////////
///////////////////////////////////////// repair///////////////////////////////////////

function sgIntersect(firstLecId, secondLecId) {
    let flag = false;
    for (let k = 0; k < lsgCount; k++) {
        if (firstLecId === lsg[k]['lecture_id']) {
            for (let r = 0; r < lsgCount; r++) {
                if (secondLecId === lsg[r]['lecture_id']) {

                    sg1 = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                    sg2 = sg.find(obj => obj.id === lsg[r]['students_group_id']);

                    if (lsg[k]['students_group_id'] === lsg[r]['students_group_id']) {

                        flag = true;
                        break;
                    }
                    else if (sg1['year'] === sg2['year'] && sg1['department'] === sg2['department']) {
                        if (sg1['division'] === sg2['division'] || sg1['division'] === null || sg2['division'] === null) {
                            if (sg1['category'] === sg2['category'] || sg1['category'] === null || sg2['category'] === null) {

                                flag = true;
                                break;
                            }
                        }
                    }
                }
            }

        }
        if (flag) break;

    }

    return flag;
}

function profAvailability(profId, timeId, x) {

    let flag = true;
    for (let k = 0; k < lecs; k++) {
        if (timeId === x[k]['x']) {

            let lecture2 = lectures.find(obj => obj.id === x[k]['z']);
            if (profId === lecture2['user_id']) {

                flag = false;
                break;
            }

        }

    }

    return flag;
}

function classAvailability(classId, timeId, x) {

    let flag = true;

    for (let k = 0; k < lecs; k++) {
        if (timeId === x[k]['x']) {

            if (classId === x[k]['y']) {
                flag = false;
                break;
            }

        }
    }

    return flag;
}

function lectureSgSize(lectureId) {

    let size = 0;
    for (let k = 0; k < lsgCount; k++) {

        if (lsg[k]['lecture_id'] === lectureId) {
            stg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
            if (stg['size'] != null) size += stg['size'];
        }

    }

    return size;

}

function utilityAvailability(utilityId, timeId, x) {
    let flag = false;
    let utility = utilities.find(obj => obj.id === utilityId);
    let cnt = utility['count'];

    for (let i = 0; i < lecs; i++) {
        if (timeId === x[i]['x']) {
            for (let k = 0; k < utilitiesLecturesCount; k++) {
                if (utilitiesLectures[k]['lecture_id'] === x[i]['z'] && utilitiesLectures[k]['utility_id'] === utilityId) {
                    cnt--;
                }
            }

        }
    }
    if (cnt > 0) flag = true;

    return flag;
}

function needsDatashow(lectureId) {
    let flag = false;
    for (let k = 0; k < utilitiesLecturesCount; k++) {

        if (utilitiesLectures[k]['lecture_id'] === lectureId) {
            let utility = utilities.find(obj => obj.id === utilitiesLectures[k]['utility_id']);
            if (utility['name'] === 'datashow') flag = true;

        }
    }
    return flag;
}

function changeToAGoodClass(lectureObj, x) {
    for (let j = 0; j < classCount; j++) {

        let firstFlag = false;
        lecture = lectures.find(obj => obj.id === lectureObj['z']);
        classroom = classRooms.find(obj => obj.id === classRooms[j]['id']);

        if (lecture['lecture_type'] == 0 && classroom['type'] === 'lecture' ||
            lecture['lecture_type'] == 1 && classroom['type'] === 'session' ||
            classroom['type'] === 'both') firstFlag = true;

        if (firstFlag) {
            let secondFlag = false;
            if (classroom['capacity'] == null) secondFlag = true;
            else {
                let sgSize = lectureSgSize(lectureObj['z']);

                if (sgSize === 0 || sgSize <= classroom['capacity']) secondFlag = true;

            }

            if (secondFlag) {
                let thirdFlag = false;
                let check = needsDatashow(lectureObj['z']);

                if ((check && classroom['datashow']) || !check) thirdFlag = true;

                if (thirdFlag) {
                    let fourthFlag = classAvailability(classRooms[j]['id'], lectureObj['x'], x);

                    if (fourthFlag) {
                        lectureObj['y'] = classRooms[j]['id'];
                        break;
                    }
                    else {
                        for (let t = 0; t < timeCount; t++) {

                            let check1 = classAvailability(classRooms[j]['id'], times[t]['id'], x);
                            let check2 = false;
                            for (let k = 0; k < lecs; k++) {
                                if (times[t]['id'] === x[k]['x']) {

                                    check2 = sgIntersect(lectureObj['z'], x[k]['z']);
                                }
                                if (check2) break;
                            }
                            let check3 = true;
                            for (let k = 0; k < lecs; k++) {
                                if (times[t]['id'] === x[k]['x']) {

                                    let lecture1 = lectures.find(obj => obj.id === lectureObj['z']);
                                    let lecture2 = lectures.find(obj => obj.id === x[k]['z']);
                                    if (lecture1['user_id'] === lecture2['user_id']) {

                                        check3 = false;
                                        break;
                                    }


                                }
                            }

                            if (check1 && !check2 && check3) {
                                lectureObj['x'] = times[t]['id'];
                                lectureObj['y'] = classRooms[j]['id'];
                                break;
                            }
                        }
                    }
                }

            }


        }
    }

    return lectureObj;
}

function changeToAGoodTime(lectureObj, x) {
    for (let t = 0; t < timeCount; t++) {
        let firstFlag = false;

        for (let k = 0; k < lecs; k++) {
            if (times[t]['id'] === x[k]['x']) {

                firstFlag = sgIntersect(lectureObj['z'], x[k]['z']);
            }
            if (firstFlag) break;
        }

        if (firstFlag) continue;
        else {

            let lecture1 = lectures.find(obj => obj.id === lectureObj['z']);
            let profId = lecture1['user_id'];

            let secondFlag = profAvailability(profId, times[t]['id'], x);

            if (!secondFlag) continue;
            else {

                let thirdFlag = classAvailability(lectureObj['y'], times[t]['id'], x);

                if (!thirdFlag) continue;
                else {
                    let fourthFlag = true;
                    for (let k = 0; k < utilitiesLecturesCount; k++) {
                        if (utilitiesLectures[k]['lecture_id'] === lectureObj['z']) {
                            let utilityId = utilitiesLectures[k]['utility_id'];
                            fourthFlag = utilityAvailability(utilityId, lectureObj['x'], x);

                        }
                    }
                    if (fourthFlag) {
                        lectureObj['x'] = times[t]['id'];
                        break;

                    }
                }

            }

        }


    }

    return lectureObj;
}

function repair(x) {

    //عدم وجود محاضرتين بنفس الوقت لنفس الطلاب 

    for (let i = 0; i < lecs - 1; i++) {
        for (let j = i + 1; j < lecs; j++) {
            if (x[i]['x'] === x[j]['x']) {

                let flag = sgIntersect(x[i]['z'], x[j]['z']);

                if (flag) {

                    x[i] = changeToAGoodTime(x[i], x);
                }

            }
        }
    }


    //عدم وجود محاضرتين بنفس الوقت لنفس الدكتور 

    for (let i = 0; i < lecs - 1; i++) {
        for (let j = i + 1; j < lecs; j++) {
            if (x[i]['x'] === x[j]['x']) {

                let flag = false;

                let lecture1 = lectures.find(obj => obj.id === x[i]['z']);
                let lecture2 = lectures.find(obj => obj.id === x[j]['z']);

                if (lecture1['user_id'] === lecture2['user_id']) flag = true;

                if (flag) {
                    x[i] = changeToAGoodTime(x[i], x);
                }

            }
        }
    }

    //عدم وجود محاضرتين بنفس الوقت بنفس القاعة 

    for (let i = 0; i < lecs - 1; i++) {
        for (let j = i + 1; j < lecs; j++) {
            if (x[i]['x'] === x[j]['x']) {

                let flag = false;

                if (x[i]['y'] === x[j]['y']) flag = true;

                if (flag) {
                    x[i] = changeToAGoodTime(x[i], x);
                }

            }
        }
    }

    // وضع المحاضرات و الجلسات في القاعات المخصصة.

    for (let i = 0; i < lecs; i++) {
        let classroom = classRooms.find(obj => obj.id === x[i]['y']);
        let lecture = lectures.find(obj => obj.id === x[i]['z']);

        if (lecture['lecture_type'] == 0 && classroom['type'] === 'lecture' ||
            lecture['lecture_type'] == 1 && classroom['type'] === 'session' ||
            classroom['type'] === 'both')
            continue;
        else {
            x[i] = changeToAGoodClass(x[i], x);

        }
    }

    //توافق عدد الطلاب مع سعة القاعة 
    for (let i = 0; i < lecs; i++) {
        const classroom = classRooms.find(obj => obj.id === x[i]['y']);

        let flag = false;
        if (classroom['capacity'] == null) flag = true;
        else {
            let sgSize = lectureSgSize(x[i]['z']);

            if (sgSize === 0 || sgSize <= classroom['capacity']) flag = true;

        }
        if (!flag) {
            x[i] = changeToAGoodClass(x[i], x);
        }
    }

    // وضع المحاضرة التي تحتاج جهاز عرض في قاعة يمكن تركيب جهاز العرض فيها
    for (let i = 0; i < lecs; i++) {
        let flag = false;
        let check = needsDatashow(x[i]['z']);
        const classroom = classRooms.find(obj => obj.id === x[i]['y']);

        if ((check && classroom['datashow']) || !check) flag = true;
        if (!flag) {
            x[i] = changeToAGoodClass(x[i], x);
        }
    }

    // وضع المحاضرة التي تحتاج أداة مساعدة في وقت تتوافر فيه هذه الأداة
    for (let i = 0; i < lecs; i++) {

        let flag = true;
        for (let k = 0; k < utilitiesLecturesCount; k++) {
            if (utilitiesLectures[k]['lecture_id'] === x[i]['z']) {
                let utilityId = utilitiesLectures[k]['utility_id'];
                flag = utilityAvailability(utilityId, x[i]['x'], x);

            }
        }

        if (!flag) {

            x[i] = changeToAGoodTime(x[i], x);

        }
    }


    return x;
}


/////////////////////////////////////////elistism///////////////////////////////////////
/////////////////////////////////////////elistis////////////////////////////////////////

// children, initP
function elistism() {
    // دمج مصفوفة الأباء والأبناء في موصفوفة واحدة

    let allIndividuals = [...children, ...initP];

    // ترتيب هذه المصفوفة تنازليا حسب التقييم

    allIndividuals.sort((a, b) => {
        return a[lecs] - b[lecs];
    })


    return allIndividuals;
}




////////////////////////////////////////////////////main function/////////////////////////
function displayWaitingMessage() {
    document.getElementsByClassName('container-fluid')[0].innerHTML = '<center><h2>يتم توليد البرنامج...<br>الرجاء الإنتظار</h2></center>';
}

function geneticAlgorithm() {

    let content = ""

    let bestIndividual;

    // initializing the initial population
    initialPopulation(sz, lecs);

    // evaluating the fitness of the solutions
    for (let i = 0; i < sz; i++)
        initP[i][lecs] = fitness(initP[i]);


    /// start
    let sz1_2 = Math.floor(sz / 2);
    for (let r = 0; r < 1; r++) {

        //     // selecting individual for crossover
        for (let i = 0; i < sz1_2; i++)  TS();

        //     // applying crossover to get childrens
        console.log('k');
        let j = 0, k = 0;
        for (let i = 0; i < sz1_2; i++) {
            crossOver[i] = crossOverFunc(i);
            children[j] = crossOver[i][k];
            j++;
            children[j] = crossOver[i][k + 1];
            k = 0;
            j++;
        }
        if (sz % 2 !== 0) {
            crossOver[sz1_2] = crossOverFunc(0);
            children[j] = crossOver[sz1_2][k];
        }

        // applying mutation for individuals
        let childMutationProbability = [];
        const leastAcceptableChildValue = 0.5;
        for (let i = 0; i < sz; i++) {
            childMutationProbability[i] = Math.random() * 1;
        }
        for (let i = 0; i < sz; i++) {
            if (childMutationProbability[i] < leastAcceptableChildValue) {
                children[i] = mutation(children[i], i);

            }
        }

        // repairing individuals
        for (let i = 0; i < sz; i++) {
            initP[i] = repair(initP[i]);
            children[i] = repair(children[i]);
        }

        // إعادة تقييم بعد الإصلاح
        for (let i = 0; i < sz; i++) {
            initP[i][lecs] = fitness(initP[i]);
            children[i][lecs] = fitness(children[i]);
        }

        let all = elistism();

        // اختيار الأبناء الأفضل للإنتقال إلى الجيل الجديد
        if (bestIndividual === undefined) bestIndividual = all[0];
        else bestIndividual = (bestIndividual.lecs <= all[0][lecs] ? bestIndividual : all[0]);
        if (bestIndividual[lecs] < 10) break;
        let bestindividuals = [];
        for (let i = 0; i < sz; i++) {
            bestindividuals.push(all[i]);
        }

        initP = bestindividuals;
    }

    // // end



    let XYZsz = bestIndividual.length;
    let mainsz = mainSg.length;
    let lsgsz = lsgCount;
    console.log(bestIndividual);


    if (XYZsz > 0) {


        bestIndividual.sort((a, b) => {

            const timeA = times.find(t => t.id === a['x']);
            const timeB = times.find(t => t.id === b['x']);
            if (!timeA || !timeB) return 0;
            if (timeA.day === timeB.day) {
                return timeA.start_time.localeCompare(timeB.start_time);
            }

            return timeA.day - timeB.day;
        });



        let MaximumPossibleScore = lecs * 9
        let accuracy = Math.floor(((MaximumPossibleScore - bestIndividual[lecs]) / MaximumPossibleScore) * 100);
        // accuracy = Math.floor(accuracy - Math.random() * 2);
        content = "<!-- Page Heading --><div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>لوحة التحكم</h1><div><span class='h3 mb-0 primary text-gray-800'>دقة الحل: %" + accuracy + "</span></div><a id = 'saveResult' class='d-none d-sm-inline-block btn btn-lg btn-success shadow-sm' style='color:white;'> <i class='fas fa-download fa-sm text-white-50' ></i>حفظ البرنامج الناتج</a><a id = 'runAlgorithm' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm' style='color:white;'> <i class='fas fa-cog fa-sm text-white-50' ></i> توليد برنامج دوام</a></div>";

        for (let x in mainSg) {
            let year = "";
            switch (mainSg[x]['year']) {
                case 1: year = "الأولى"; break;
                case 2: year = "الثانية"; break;
                case 3: year = "الثالثة"; break;
                case 4: year = "الرابعة"; break;
                case 5: year = "الخامسة"; break;
            }
            content += "  <div class='card shadow mb-4'><div class='card-header py-3'><h6 class='m-0 font-weight-bold text-primary'><center>" + "السنة : " + year + " | القسم : " + mainSg[x]['department'] + (mainSg[x]['division'] ? " | الشعبة : " + mainSg[x]['division'] : " ") + "</center></h6></div ><div class='view card-body'><div class='wrapper table-responsive'><table class='table table-bordered'>";


            let time = {};
            content += "<thead></thead><tbody>";

            content += "<tr><td class='sticky-col first-col'>السبت</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['z']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));
                                    time = times.find(obj => obj.id === bestIndividual[i]['x']);

                                    if (time['day'] === 1) {
                                        if (Object.keys(lastTime).length > 0) {

                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الأحد</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['z']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['x']);

                                    if (time['day'] === 2) {
                                        if (Object.keys(lastTime).length > 0) {

                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الأثنين</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['z']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['x']);

                                    if (time['day'] === 3) {
                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الثلاثاء</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['z']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['x']);

                                    if (time['day'] === 4) {
                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }

            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الأربعاء</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['z']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['x']);
                                    if (time['day'] === 5) {

                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }
                                    }


                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الخميس</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['z']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['x']);

                                    if (time['day'] === 6) {
                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['y']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['z']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            content += "</tbody></table></div></div></div>";

        }
        document.getElementsByClassName('container-fluid')[0].innerHTML = content;
        bestIndividual.pop();

        document.getElementById('saveResult').addEventListener('click', function () {
            saveTheResult(bestIndividual);
        });

        document.getElementById('runAlgorithm').addEventListener('click', function () {
            displayWaitingMessage();
            setTimeout(() => {
                geneticAlgorithm()
            }, 1000);

        });




    }

}

/////////////////////////////////////////////integration////////////////////////////



// Loading users
function loadUsers() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/users', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('users', JSON.stringify(data));
            users = data;
            usersCount = Object.keys(users).length;

        })

}
//Loading courses
function loadCourses() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/courses', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('courses', JSON.stringify(data));
            courses = data;

        })

}

//loading classooms
function loadClassrooms() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/classrooms', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('classrooms', JSON.stringify(data));

            classRooms = data;
            classCount = Object.keys(classRooms).length;

        })

}

//loading lectures
function loadLectures() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/normal_lectures', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('lectures', JSON.stringify(data));

            lectures = data;
            lectureCount = Object.keys(lectures).length;

        })

}

//loading students groups
function loadSg() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/students_groups', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('sg', JSON.stringify(data));
            sg = data;

            sgCount = Object.keys(sg).length;

        })

}

//loading lsg
function loadLsg() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/lectures_students_groups', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('lsg', JSON.stringify(data));

            lsg = data;
            lsgCount = Object.keys(lsg).length;

        })

}


//loading times
function loadTimes() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/times', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('times', JSON.stringify(data));

            times = data;
            timeCount = Object.keys(times).length;

        })

}

//loading utilitis
function loadUtilities() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/utilities', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('utilities', JSON.stringify(data));

            utilities = data;
            utilitiesCount = Object.keys(utilities).length;
        })

}

//loading utilitis_lectures
function loadUtilitiesLectures() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/utilities_lectures', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            window.sessionStorage.setItem('utilities_lectures', JSON.stringify(data));
            utilitiesLectures = data;
            utilitiesLecturesCount = Object.keys(utilitiesLectures).length;

        })

}

window.addEventListener('load', loadScheduledLectures);

function loadScheduledLectures(e) {
    e.preventDefault();
    loadUsers();
    loadCourses();
    loadClassrooms();
    loadLectures();
    loadSg();
    loadLsg();
    loadTimes();
    loadUtilities();
    loadUtilitiesLectures();

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/scheduled_lectures', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    })
        .then((res) => res.json())
        .then((data) => {
            let content = "";
            let mainLectures = [];
            let XYZsz = data.length;
            let mainsz = mainSg.length;
            let lsgsz = lsgCount;

            if (data.length > 0) {

                displayTimetable(data)

            }
            else {
                content = "<!-- Page Heading --><div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>لوحة التحكم</h1><a id = 'runAlgorithm' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm' style='color:white;'><i class='fas fa-cog fa-sm text-white-50' ></i> توليد برنامج دوام</a></div><!-- 404 Error Text --><div class='text-center'><p class='lead text-gray-800 mb-5'>لا يوجد برنامج دوام محفوظ</p><p class='text-gray-500 mb-0'>يبدو أنك لم تقم بحفظ برنامج دوام بعد</p><a id = 'runAlgorithm'>&larr; قم بتوليد برنامج الأن </a></div>"
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;
                setVal()
                document.getElementById('runAlgorithm').addEventListener('click', function () {
                    displayWaitingMessage();
                    setTimeout(() => {
                        geneticAlgorithm()
                    }, 1000);

                });
            }



        })


}

function setVal() {

    users = JSON.parse(window.sessionStorage.getItem('users'));
    usersCount = Object.keys(users).length;

    courses = JSON.parse(window.sessionStorage.getItem('courses'));
    classRooms = JSON.parse(window.sessionStorage.getItem('classrooms'));
    classCount = Object.keys(classRooms).length;

    lectures = JSON.parse(window.sessionStorage.getItem('lectures'));
    lectureCount = Object.keys(lectures).length;
    lecs = lectureCount;

    sg = JSON.parse(window.sessionStorage.getItem('sg'));
    let sz = sg.length;
    for (let i = 0; i < sz; i++) {
        if (sg[i]['main']) mainSg.push(sg[i]);
    }
    sgCount = Object.keys(sg).length

    lsg = JSON.parse(window.sessionStorage.getItem('lsg'));
    lsgCount = Object.keys(lsg).length;

    times = JSON.parse(window.sessionStorage.getItem('times'));
    timeCount = Object.keys(times).length;

    utilities = JSON.parse(window.sessionStorage.getItem('utilities'));
    utilitiesCount = Object.keys(utilities).length;

    utilitiesLectures = JSON.parse(window.sessionStorage.getItem('utilities_lectures'));
    utilitiesLecturesCount = Object.keys(utilitiesLectures).length;

}


function saveTheResult(result) {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/scheduled_lectures', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(result)

    })
        .then((res) => res.json())
        .then((data) => {

            location.reload();



        })

}

function displayTimetable(bestIndividual) {
    setVal()
    let XYZsz = bestIndividual.length;
    let mainsz = mainSg.length;
    let lsgsz = lsgCount;
    console.log(bestIndividual);


    if (XYZsz > 0) {


        bestIndividual.sort((a, b) => {

            const timeA = times.find(t => t.id === a['time_id']);
            const timeB = times.find(t => t.id === b['time_id']);
            if (!timeA || !timeB) return 0;
            if (timeA.day === timeB.day) {
                return timeA.start_time.localeCompare(timeB.start_time);
            }

            return timeA.day - timeB.day;
        });



        let content = "";
        // accuracy = Math.floor(accuracy - Math.random() * 2);
        content = "<!-- Page Heading --><div class='d-sm-flex align-items-center justify-content-between mb-4'><h2> البرنامج الحالي</h2><a id = 'deleteSavedResult' class='d-none d-sm-inline-block btn btn-lg btn-success shadow-sm' style='color:white;'> <i class='fas fa-download fa-sm text-white-50' ></i>حذف البرنامج المحفوظ</a><a id = 'runAlgorithm' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm' style='color:white;'> <i class='fas fa-cog fa-sm text-white-50' ></i> توليد برنامج دوام</a></div>";

        for (let x in mainSg) {
            let year = "";
            switch (mainSg[x]['year']) {
                case 1: year = "الأولى"; break;
                case 2: year = "الثانية"; break;
                case 3: year = "الثالثة"; break;
                case 4: year = "الرابعة"; break;
                case 5: year = "الخامسة"; break;
            }
            content += "  <div class='card shadow mb-4'><div class='card-header py-3'><h6 class='m-0 font-weight-bold text-primary'><center>" + "السنة : " + year + " | القسم : " + mainSg[x]['department'] + (mainSg[x]['division'] ? " | الشعبة : " + mainSg[x]['division'] : " ") + "</center></h6></div ><div class='view card-body'><div class='wrapper table-responsive'><table class='table table-bordered'>";


            let time = {};
            content += "<thead></thead><tbody>";

            content += "<tr><td class='sticky-col first-col'>السبت</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));
                                    time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                    if (time['day'] === 1) {
                                        if (Object.keys(lastTime).length > 0) {

                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الأحد</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                    if (time['day'] === 2) {
                                        if (Object.keys(lastTime).length > 0) {

                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الأثنين</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                    if (time['day'] === 3) {
                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الثلاثاء</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                    if (time['day'] === 4) {
                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }

            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الأربعاء</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['time_id']);
                                    if (time['day'] === 5) {

                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }
                                    }


                                }
                            }
                        }

                    }
                }



            }
            time = {};
            content += "</tr><tr><td class='sticky-col first-col'>الخميس</td>";
            for (let i = 0; i < XYZsz - 1; i++) {

                for (let k = 0; k < lsgsz; k++) {
                    if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                        const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                        if (csg['year'] == mainSg[x]['year']) {
                            if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                    let lastTime = JSON.parse(JSON.stringify(time));

                                    time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                    if (time['day'] === 6) {
                                        if (Object.keys(lastTime).length > 0) {


                                            if (time['id'] === lastTime['id']) {
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }
                                        else {
                                            const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                            const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                            const course = courses.find(obj => obj.id === lecture['course_id']);
                                            const prof = users.find(obj => obj.id === lecture['user_id']);

                                            content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                            content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                        }

                                    }
                                }
                            }
                        }

                    }
                }



            }
            content += "</tbody></table></div></div></div>";

        }

        document.getElementsByClassName('container-fluid')[0].innerHTML = content;

        document.getElementById('deleteSavedResult').addEventListener('click', deleteSavedResult);

        document.getElementById('runAlgorithm').addEventListener('click', function () {
            displayWaitingMessage();
            setTimeout(() => {
                geneticAlgorithm()
            }, 1000);

        });


    }
}

function deleteSavedResult() {

    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/admin/delete_scheduled_lectures', {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: {},
    }).then((res) => res.json()).then((data) => {

        location.reload();

    })
}