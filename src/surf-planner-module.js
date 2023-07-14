class SurfPlanner {
  
    calendar = new Map();

    constructor(guests) {
        this.calendar.set(1);
        this.calendar.set(2);
        this.calendar.set(3);
        this.calendar.set(4);
        this.calendar.set(5);
    }

    getFullCalendar() {
        return this.calendar;
    }

    getKidsOnly() {

    }

    getAdultsOnly() {
    
    }
}

// Export the public API
module.exports = {
    SurfPlanner,
};
