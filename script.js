/*
 * Created by Sarah Blankespoor on 10/17/16
 * stuff remaining: change grade
 */
var allStudents = [];
var allTeachers = [];
var allSections = [];
totalStudents = 0;
totalTeachers = 0;
totalSections = 0;
currentId = 0;


function setUpField(fieldName) {
    makeInvisible('options', false);
    makeVisible(fieldName, true);
    makeInvisible('userMessage', true);
}

function makeVisible(str, isId) {
    if(isId) {
        document.getElementById(str).style.display = "inline";
    }else{
        var x = document.getElementsByClassName(str);
        for (var i = 0; i < x.length; i++) {
            x[i].style.display = "inline";
        }
    }
}

function makeInvisible(str, isId) {
    if(isId) {
        document.getElementById(str).style.display = "none";
    }else{
        var x = document.getElementsByClassName(str);
        for (var i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
    }
}

function Person(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
}

function getNextId() {
    return currentId++;
}

function Student(grade, visibleId) {
    this.visibleId = visibleId;
    this.grade = grade;
    this.currentGrade = 0;
    this.sections = [];
    this.changeGrade = function(newGrade) {
        this.currentGrade = newGrade;
    };
}
Student.prototype = Person;

function Teacher(subject) {
    this.subject = subject;
    this.sections = [];
}
Teacher.prototype = Person;

function Section(name, maxSize, teacher) {
    this.name = name;
    this.id = 0;
    this.maxSize = parseInt(maxSize);
    this.students = [];
    this.currentSize = this.students.length;
    this.teacher = teacher;
    this.addStudent = function(theStudent) {
        this.students[this.students.length] = theStudent;
        theStudent.sections[theStudent.sections.length] = this;
        this.currentSize ++;
    };
    this.removeStudent = function(aStudent) {
        this.currentSize --;
        var someStudents = this.students;
        this.students = [];
        for(var key in someStudents) {
            if(someStudents[key].id !== aStudent.id) {
                this.students.push(someStudents[key]);
            }
        }
        var studentsSectionsRebuilt = aStudent.sections;
        aStudent.sections = [];
        for(var thing in studentsSectionsRebuilt) {
            if(studentsSectionsRebuilt[thing].id !== this.id) {
                aStudent.sections.push(studentsSectionsRebuilt[thing]);
            }
        }
    };
    this.sectionSeatsRemaining = function() {
        return(this.maxSize - this.currentSize);
    };
}

function typeToThing(type){
    var y = "";
    if (type === 0){
        y = allStudents;
    }
    if (type === 1){
        y = allTeachers;
    }
    if (type === 2){
        y = allSections;
    }
    return y;
}

function idToObject(theId, type) {
    var x = typeToThing(type);
    for(var i = 0; i < x.length; i++){
        if(x[i].id === theId){
            var thisThing = x[i];
        }
    }
    console.log("thisThingId=" + thisThing.id);
    return thisThing;
}

function listThings (type) {
    var y = typeToThing(type);
    var result = "";
    for (var i = 0; i < y.length; i++){
        var x = y[i].id;
        if(type < 2){
            result += "<option value=" + x + ">" + y[i].lastName + "</option>";
        }
        if(type === 2){
            result += "<option value=" + x + ">" + y[i].name + "</option>";
        }
    }
    return result;
}

function getNewStudent(varName) {
    var repeat = false;
    varName = new Student(document.getElementById("enterGrade").value);
    varName.visibleId = document.getElementById("enterId").value;
    for(var i = 0; i < allStudents.length; i++){
        if(varName.visibleId === allStudents[i].visibleId){
            repeat = true;
        }
    }
    if(!repeat){
        varName.firstName = document.getElementById("enterFirstName").value;
        varName.lastName = document.getElementById("enterLastName").value;
        varName.id = getNextId();
        allStudents.push(varName);
        console.log(allStudents[totalStudents]);
        console.log(varName.id);
        totalStudents++;
        document.getElementById('userMessage').innerHTML = 'Student ' + document.getElementById('enterLastName').value + ' successfully added.';
    }else{
        document.getElementById('userMessage').innerHTML = "Cannot add students with duplicate ids. Student " + document.getElementById('enterLastName').value + " not added.";
    }
}

function getNewTeacher(varName) {
    var repeat = false;
    varName = new Teacher(document.getElementById("enterSubject").value);
    varName.visibleId = document.getElementById("enterId").value;
    varName.lastName = document.getElementById("enterLastName").value;
    for(var i = 0; i < allTeachers.length; i++){
        if(varName.lastName === allTeachers[i].lastName){
            repeat = true;
        }
    }
    if(!repeat){
        varName.firstName = document.getElementById("enterFirstName").value;
        varName.id = getNextId();
        allTeachers.push(varName);
        console.log(allTeachers[totalTeachers]);
        totalTeachers++;
        document.getElementById('userMessage').innerHTML = 'Teacher ' + varName.lastName + ' successfully added.';
    }else{
        document.getElementById('userMessage').innerHTML = "Cannot add teachers with duplicate last names. Teacher " + varName.lastName + " not added.";
    }
}

function getNewSection(varName) {
    var repeat = false;
    var teach = parseInt(document.getElementById("newSectionTeacher").value);
    for(var j = 0; j < allTeachers.length; j++){
        if(allTeachers[j].id === teach){
            teach = allTeachers[j];
        }
    }
    varName = new Section(document.getElementById("newSectionName").value, document.getElementById("newSectionMaxSize").value, teach);
    teach.sections.push(varName);
    for(var i = 0; i < allSections.length; i++){
        if(varName.name === allSections[i].name){
            repeat = true;
        }
    }
    if(!repeat){
        varName.id = getNextId();
        allSections.push(varName);
        console.log(allSections[totalSections]);
        totalSections++;
        document.getElementById('userMessage').innerHTML = 'Section ' + varName.name + " with teacher " + teach.lastName + ' successfully added.';
    }else{
        document.getElementById('userMessage').innerHTML = "Cannot add sections with duplicate names. Section " + varName.name + " not added.";
    }
}

function listStudentsSections(v) {
    var y = idToObject(parseInt(v), 0);
    var result = "";
    for (var i = 0; i < y.sections.length; i++){
        var x = y.sections[i].id;
        result += "<option value=" + x + ">" + y.sections[i].name + "</option>";
    }
    return result;
}

function studentToSec() {
    var y = idToObject(parseInt(document.getElementById("idOfStudent").value), 0);
    var x = parseInt(document.getElementById("nameOfSection").value);
    var notRepeat = true;
    console.log("studentId=" + y.id);
    for(var j = 0; j < y.sections.length; j++) {
        if(y.sections[j].id === x){
            notRepeat = false;
        }
    }
    var v = idToObject(x, 2);
    if(notRepeat) {
        v.addStudent(y);
        document.getElementById("userMessage").innerHTML = "Student " + y.lastName + " successfully added to section " + v.name + ".";
    }else{
        document.getElementById("userMessage").innerHTML = "Student " + y.lastName + " is already in section " + v.name + ".";
    }
}

function studentFromSec() {
    var y = idToObject(parseInt(document.getElementById("studentsId").value), 0);
    var v = idToObject(parseInt(document.getElementById("sectionsName").value), 2);
    v.removeStudent(y);
    document.getElementById("userMessage").innerHTML = "Student " + y.lastName + " successfully removed from section " + v.name + ".";
}

function studentGrade() {
    var x = idToObject(parseInt(document.getElementById("studentsIdForGrade").value), 0);
    var y = parseInt(document.getElementById("enterNewGrade").value);
    x.changeGrade(y);
    document.getElementById("userMessage").innerHTML = "Student " + x.lastName + "'s grade successfully changed to " + y + ".";
}

function listSectionInfo(sectionId) {
    var x = idToObject(parseInt(sectionId), 2);
    var listOfStudents = "";

    for (var j = 0; j < x.students.length; j++){
        listOfStudents += x.students[j].firstName;
        listOfStudents += " ";
        listOfStudents += x.students[j].lastName;
        listOfStudents += ", ";
    }
    var y = x.sectionSeatsRemaining();
    document.getElementById('showOneThing').innerHTML = "Section " + x.name + " has max size " + x.maxSize + " and current size " + x.currentSize +
        ". It is taught by Mx. " + x.teacher.lastName + " and has students " + listOfStudents + ". There are " +
        y + " seats left.";
}

function listAllSections(x) {
    var listOfSections = "<ul style='list-style-type:none'>";
    for (var j = 0; j < x.sections.length; j++) {
        listOfSections += "<li>";
        listOfSections += x.sections[j].name;
        listOfSections += "</li>";
    }
    listOfSections += "</ul>";
    return listOfSections;
}

function listStudentInfo(studentId) {
    var x = idToObject(parseInt(studentId), 0);
    var listOfSections = listAllSections(x);
    document.getElementById('showOneThing').innerHTML = "Student " + x.firstName + " " + x.lastName + " has id " + x.visibleId + " and is in grade " + x.grade +
        ". Their current grade is " + x.currentGrade + " and they are in sections: " + listOfSections;
}

function listTeacherInfo(teacherId) {
    var x = idToObject(parseInt(teacherId), 1);
    var listOfSections = listAllSections(x);
    document.getElementById('showOneThing').innerHTML = "Teacher " + x.firstName + " " + x.lastName + " teaches subject "
        + x.subject + " and sections: " + listOfSections;
}

function listGlobalInfo() {
    var sections = "<tr>\n" +
        "            <th> Section Name </th>\n" +
        "            <th> Section Max Size </th>\n" +
        "            <th> Section Current Size </th>\n" +
        "            <th> Section Seats Remaining </th>\n" +
        "            <th> Teacher </th>\n" +
        "            <th> Students </th>\n" +
        "        </tr>";

    for(var i = 0; i < allSections.length; i++){
        var listOfStudents = "";
        for (var j = 0; j < allSections[i].students.length; j++){
            listOfStudents += allSections[i].students[j].firstName;
            listOfStudents += " ";
            listOfStudents += allSections[i].students[j].lastName;
            listOfStudents += ", ";
        }
        sections += "<tr>" + "<td>" + allSections[i].name + "</td>" + "<td>" + allSections[i].maxSize + "</td>"
            + "<td>" + allSections[i].currentSize + "</td>" + "<td>" + allSections[i].sectionSeatsRemaining() + "</td>"
            + "<td>" + allSections[i].teacher.firstName + " " + allSections[i].teacher.lastName + "</td>"
            + "<td>" + listOfStudents + "</td>" + "</tr>";
    }
    document.getElementById("showAllSections").innerHTML = sections;

    var students = "<tr>\n" +
        "            <th>Student Name</th>\n" +
        "            <th>Student Id</th>\n" +
        "            <th>Student Grade Level</th>\n" +
        "            <th>Student Grade</th>\n" +
        "        </tr>";
    for(var k = 0; k < allStudents.length; k++){
        var listOfSections = "";
        for (var l = 0; l < allStudents[k].sections.length; l++) {
            listOfSections += allStudents[k].sections[l].name;
            listOfSections += " ";
        }
        students += "<tr>" + "<td>" + allStudents[k].firstName + " " + allStudents[k].lastName + "</td>"
            + "<td>" + allStudents[k].visibleId + "</td>" + "<td>" + allStudents[k].grade + "</td>"
            + "<td>" + allStudents[k].currentGrade + "</td>" + "</tr>";
    }
    document.getElementById("showAllStudents").innerHTML = students;

    var teachers = "<tr>\n" +
        "            <th>Teacher Name</th>\n" +
        "            <th>Teacher Subject</th>\n" +
        "        </tr>";
    for(var m = 0; m < allTeachers.length; m++){
        teachers += "<tr>" + "<td>" + allTeachers[m].firstName + " " + allTeachers[m].lastName + "</td>"
            + "<td>" + allTeachers[m].subject + "</td>" + "</tr>";
    }
    document.getElementById("showAllTeachers").innerHTML = teachers;
}