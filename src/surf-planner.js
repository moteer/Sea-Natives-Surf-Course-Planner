/*
* dateA  -|- studentA
*         |- studentB
*         |- studentC
* dateB  -|- studentB
*         |- studentC
*/ 
var surfDayPlan = new Map();

function createSurfCalendar() {
  // Example test data
  var guests = [
    {"Name":"Erik",	"Arrival":"Tue 6 Jun 2023",	"Departure":"Tue 20 Jun 2023",	"Booking":"",	"Level":"Beginner",	"Surf lesson":3,	"Age":"",	"Country":""},
    {"Name":"Berti",	"Arrival":"Wed 7 Jun 2023",	"Departure":"Tue 20 Jun 2023",	"Booking":"",	"Level":"Beginner+",	"Surf lesson":2,	"Age":"",	"Country":""},
  {"Name":"Resi",	"Arrival":"Sat 10 Jun 2023",	"Departure":"Wed 21 Jun 2023",	"Booking":"",	"Level":"Intermediate",	"Surf lesson":5,	"Age":"",	"Country":""},
  {"Name":"Klaus",	"Arrival":"Sat 10 Jun 2023",	"Departure":"Tue 13 Jun 2023",	"Booking":"",	"Level":"Advanced",	"Surf lesson":3,	"Age":"",	"Country":""},
  {"Name":"Sabine",	"Arrival":"Sat 10 Jun 2023",	"Departure":"Tue 13 Jun 2023",	"Booking":"",	"Level":"First Timer",	"Surf lesson":2,	"Age":"",	"Country":""}];

  guests = sheetToObject("Overview");

  var guestsWithSurfLessons = guests.filter(function (guest) {
    var surfLesson = guest["Surf lesson"];
    return !isNaN(surfLesson) && surfLesson > 0;  
  });

  planStudentsToSurfLessons(guestsWithSurfLessons);
  writeStudentsToAdultPlan();


  surfDayPlan.forEach(function(studentsForSurfDay, surfDay) {
    var studentsForSurfDayStringifyied = studentsForSurfDay.reduce(function(acc, student) {
      return acc + '| ' + student["Name"] + ' Arrival: ' + student["Arrival"] + ' Departure: ' + student["Departure"]  + ' Status: '  + student["status"] + ' Not assigned Surflessons: '  + student["notAssignedSurfDays"];
    }, "");
    Logger.log(surfDay + ': ' + studentsForSurfDayStringifyied);
    
    Logger.log("Number of students for this day: " + studentsForSurfDay.length);
  });
  

  writeToSheet(guests.filter(function(guest){
    var age = guest["Age"];
    return isNaN(age) || age < 18;
  }), "Nanny");

}

function writeStudentsToAdultPlan() {

  clearSheet("Output");
  const start = "15.07.2023";
  const end = "22.07.2023";
   
  //BEGINNER
  //map handling should be a bit better here
  var startDate = parseDate(start);
  var endDate = parseDate(end);
  
  var beginnerSurfPlan = filterMapByCriteria(surfDayPlan, "Beginner");
  appendMapToSheet(fillMissingDates(beginnerSurfPlan, startDate, endDate), "Output");

  startDate = parseDate(start);
  endDate = parseDate(end);
  var beginnerPlusSurfPlan = filterMapByCriteria(surfDayPlan, "Beginner+");
  appendMapToSheet(fillMissingDates(beginnerPlusSurfPlan, startDate, endDate), "Output");

  startDate = parseDate(start);
  endDate = parseDate(end);
  var intermediateSurfPlan = filterMapByCriteria(surfDayPlan, "Intermediate");
  appendMapToSheet(fillMissingDates(intermediateSurfPlan, startDate, endDate), "Output");
}

function filterMapByCriteria(studentMap, criteria) {
  var filteredMap = new Map();

  studentMap.forEach(function(students, key) {
    var filteredStudents = students.filter(function(student) {
      // Apply your filtering criteria here
      return student.Level === criteria;
    });

    if (filteredStudents.length > 0) {
      filteredMap.set(key, filteredStudents);
    }
  });

  return filteredMap;
}



function fillMissingDates(map, currentDate, formattedEndDate) {
  
  Array.from(map.keys()).sort((a, b) => new Date(a) - new Date(b));
  var filledMap = new Map();

  while (currentDate <= formattedEndDate) {
    var formattedDate = getStringForDate(currentDate); // Format current date as string

    if (!map.has(formattedDate)) {
      filledMap.set(formattedDate, [{"Name":"Nobody"}]); // Set missing date with a placeholder value
    } else {
      filledMap.set(formattedDate, map.get(formattedDate)); // Preserve existing value
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return filledMap;
}

function parseDate(dateString) {
  var parts = dateString.split(".");
  var day = parseInt(parts[0]);
  var month = parseInt(parts[1]) - 1; // Month is zero-based
  var year = parseInt(parts[2]);

  return new Date(year, month, day);
}

function planStudentsToSurfLessons(students) {
  students.forEach(function (student) {
    addStudentToSurfPlan(student);
  });  
}

function addStudentToSurfPlan(student) {
  var possibleSurfDays = getPossibleSurfDays(student);
  
  possibleSurfDays.forEach(function(surfDay) {
    var studentsForDay = getValueFromMapOrCreateNew(surfDay);
    studentsForDay.push(student); 
  })
}

function getPossibleSurfDays(student) {
  var possibleSurfDays = [];
  var dayOfArrival = new Date(student["Arrival"]);
  var dayOfDeparture = new Date(student["Departure"]);
  var numberOfSurfDaysBooked = isNaN(student["Surf lesson"]) ? 0 : student["Surf lesson"];
  
  var nextPossibleSurfDay = getNextPossibleSurfDay(dayOfArrival);

  for(var i=numberOfSurfDaysBooked; i>0; i--) {
    if(nextPossibleSurfDay < dayOfDeparture ) { 
      possibleSurfDays.push(nextPossibleSurfDay);      
    } else {
      student["status"] = "Has more booked lessons than we can deliver. Manual adjustment needed."
      student["notAssignedSurfDays"] = isNaN(student["notAssignedSurfDays"]) ? 1 : student["notAssignedSurfDays"] +1;
    }
    nextPossibleSurfDay = getNextPossibleSurfDay(nextPossibleSurfDay);    
  }
  return possibleSurfDays;
}

function getNextPossibleSurfDay(firstSurfDay) {
  var nextDay = new Date(firstSurfDay); 
  nextDay.setDate(firstSurfDay.getDate() + 1);
  if (isWednesdayOrSaturday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  return nextDay; 
}

function isWednesdayOrSaturday(date) {
  var dayOfWeek = date.getDay();
  return dayOfWeek === 3 || dayOfWeek === 6; // Wednesday is 3, Saturday is 6
}

function getValueFromMapOrCreateNew(date) {
  key = getStringForDate(date);
  
  if (surfDayPlan.has(key)) {
    return surfDayPlan.get(key);
  } else {
    var newValue = []; // adds empty array to store students in it
    surfDayPlan.set(key, newValue);
    return newValue;
  }
}

function getStringForDate(date) {
  var options = { 
    timeZone: "Europe/Paris",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  var formatter = new Intl.DateTimeFormat("de-DE", options);
  return formatter.format(date);
}

function addStudentToCalendar(student, arrivalDate, departureDate, weeklyCalendar) {
  weeklyCalendar.forEach(function (value, date) {
    if (date >= arrivalDate && date <= departureDate) {
      value.students.push(student);
    }
  });
}