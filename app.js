const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
 
app.use(express.static(path.join(__dirname, 'public')));

/* checkWorkingHours*/

const checkWorkingHours = (req, res, next) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 17) {
      // It's within working hours, call the next middleware in the chain
      next();
    } else {
      // Calculate the remaining time until the site is open
      const openingTime = new Date(now);
      openingTime.setHours(9, 0, 0, 0); // Set opening time to 9am
      if (dayOfWeek === 0) {
        // It's Sunday, so set opening time to tomorrow
        openingTime.setDate(openingTime.getDate() + 1);
      } else if (dayOfWeek === 6) {
        // It's Saturday, so set opening time to Monday
        openingTime.setDate(openingTime.getDate() + 2);
      }
      const timeDiff = openingTime.getTime() - now.getTime();
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);
      const remainingTime = `${hoursDiff} hours, ${minutesDiff} minutes, and ${secondsDiff} seconds`;
  
      // Send a "404 Not Found" response with the remaining time
      res.status(404).send(`
      <div class="error-message">
        <h1>404 Not Found</h1>
        <p>Sorry, this page is only available during working hours (Monday to Friday, from 9am to 5pm).</p>
        <p>The site will be available in ${remainingTime}.</p>
      </div>
    `);
    }
  };
  
  app.use(checkWorkingHours);


router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
 
router.get('/services',function(req,res){
  res.sendFile(path.join(__dirname+'/services.html'));
});
 
router.get('/contact',function(req,res){
  res.sendFile(path.join(__dirname+'/contact.html'));
});
 
//add the router
app.use('/', router);
app.listen(process.env.port || 3000);
 
console.log('Running at Port 3000');