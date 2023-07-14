// myModule.test.js

const { default: expect } = require('expect');
const { SurfPlanner } = require('../src/surf-planner-module');

const testGuests = [
  {"Name":"Erik",	"Arrival":"Tue 6 Jun 2023",	"Departure":"Tue 20 Jun 2023",	"Booking":"",	"Level":"Beginner",	"Surf lesson":3,	"Age":"",	"Country":""},
  {"Name":"Berti",	"Arrival":"Wed 7 Jun 2023",	"Departure":"Tue 20 Jun 2023",	"Booking":"",	"Level":"Beginner+",	"Surf lesson":2,	"Age":"",	"Country":""},
{"Name":"Resi",	"Arrival":"Sat 10 Jun 2023",	"Departure":"Wed 21 Jun 2023",	"Booking":"",	"Level":"Intermediate",	"Surf lesson":5,	"Age":"",	"Country":""},
{"Name":"Klaus",	"Arrival":"Sat 10 Jun 2023",	"Departure":"Tue 13 Jun 2023",	"Booking":"",	"Level":"Advanced",	"Surf lesson":3,	"Age":"",	"Country":""},
{"Name":"Sabine",	"Arrival":"Sat 10 Jun 2023",	"Departure":"Tue 13 Jun 2023",	"Booking":"",	"Level":"First Timer",	"Surf lesson":2,	"Age":"",	"Country":""}];


// Test the public class
describe('SurfPlanner', () => {
  // Test the public function
  let surfPlanner = new SurfPlanner(testGuests);

  test('getFullCalendar should return a consecutive calendar from first day given up until the last date', () => {
    let fullCalendar = surfPlanner.getFullCalendar();
    expect(fullCalendar.size).toBe(5);
  });
});
