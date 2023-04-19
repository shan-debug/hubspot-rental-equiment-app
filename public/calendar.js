/**
 * * ES6 module in Node.js environment
 * * These import the JS and CSS for the front-end.
 */
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import './css/style.css'

/**
 * * Here, we're creating a function called createCalendar(). This function: 
 * * 1.) calls the data GET data from our /get-data route.
 * * 2.) Creates an array of objects to turn the data we receive from HubSpot into one useable by the Calendar library.
 * * 3.) Loops over the array to create another array of objects to instantiate different colored calendars for each custom object data. 
 * * 4.) Instantiates the calendar.
 */
async function createCalendar() {
  //TODO: Wrap everything in a try/catch for error handling.
  try {
    //TODO: Fetch the data from /get-data
    const resp = await fetch('http://localhost:3000/get-data');

    //TODO: Write an if statment to await response status code of 200 'OK'
    if (resp.status === 200) {
      const data = await resp.json();
      //TODO: Create calendar instance
      const dataMap = data.map((rental) => {
        return {
          id: rental.id,
          calendarId: rental.properties.name,
          title: rental.properties.name,
          category: 'allday',
          dueDateClass: '',
          start: rental.properties.start_date,
          end: rental.properties.end_date,
        }
      });
      console.log(dataMap);

      const calendars = [];
      dataMap.forEach(rental => {
        const avCalendars = {
          id: rental.calendarId,
          name: rental.title,
          backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        }
        calendars.push(avCalendars);
      });
      console.log(calendars);

      const calendar = new Calendar('#calendar', {
        defaultView: 'month',
        calendars: calendars,
      });

      //TODO: Add the individual events to the calendar
      calendar.createEvents(dataMap);

      //TODO: Add heading above calendar to show month and year
      const month = calendar.getDate();
      document.getElementById('month-heading').innerHTML = `${new Date(month).toLocaleString('en-us', { month: 'long', year: 'numeric' })}`;
    } else {
      throw new Error(`Something wen wrong ${resp.statusText}`);
    }

  } catch (error) {
    console.error(error);
  }
}

//* Always call your function.
createCalendar();