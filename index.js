/**
 * * Call the consts you need to run Express, axios, and body-parser
 */ 
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

//* Instantiate Express
const app = express();

//* Express app.use for JSON encoding
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//* Use dotenv inside of a node app
require('dotenv').config();

//* Use pug as the view engine
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//* Use this to serve up static files from public directory
app.use(express.static(__dirname + '/public'));


/**  
 * * First, we'll create a route at the root (/) where our web app will appear.
 * TODO: Use app.get to call the route, render 'index' file of PUG, send title to index.pug file. 
 */

app.get('/', (req, res) => {
    res.render('index', { title: 'AV Rental Equipment | HubSpot APIs'});
});

/**
 * * Next, we'll get the existing data from our custom object to show on our calendar. The data we're calling is from the CSV file we imported.
 * TODO: Get the custom object ID, then include that in the API endpoint we're sending. We'll use our private app token we made earlier for authorization. Then, we want to view our results in JSON at /get-data route.
 */

// * This constant will be your custom object's id
const YOUR_CUSTOM_OBJECT_ID = '2-13876839';
app.get('/get-data', async (req, res) => {
    const apiCall = `https://api.hubspot.com/crm/v3/objects/${YOUR_CUSTOM_OBJECT_ID}/?limit=50&archived=false&properties=name,start_date,end_date`
    const headers = {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try{
        const resp = await axios.get(apiCall, { headers });
        const data = resp.data.results;
        res.json(data);
    }catch(error){
        console.log(error);
    }
});



/**
 * * Now that we've built our form, it's time to send that data to our HubSpot account upon submit.
 * TODO: Use app.post to send form data to HubSpot, using the the POST API endpoint. Then, when the POST works, redirect to the page you're currently on to show updated calendar.
 */

app.post('/', async (req, res) => {
    const equipment = req.body.chooseEquipment;
    const arrEquipment = equipment.split("_");

    for (var i = 0; i < arrEquipment.length; i++) {
        arrEquipment[i] = arrEquipment[i].charAt(0).toUpperCase() + arrEquipment[i].slice(1);
    }

    const newEQuipmentRental = {
        properties: {
            "name": arrEquipment.join(" "),
            "start_date": req.body.chooseStartDate,
            "end_date": req.body.chooseEndDate,
        }
    }

    const postNewRental = `https://api.hubspot.com/crm/v3/objects/${YOUR_CUSTOM_OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try{
        await axios.post(postNewRental, newEQuipmentRental, { headers });
        res.redirect('back');
    }catch(error){
        console.error(error);
    }
});

//* This is how we'll listen on port 3000 when we call nodemon.
app.listen(3000, () => console.log('Listening on http://localhost:3000'));