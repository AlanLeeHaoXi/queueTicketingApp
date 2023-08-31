# Ticket Queuing Web Application
- Demonstrating a customer ticket queuing scenario in which the counter manager handles the traffic queue by micro-managing the front counters.
- Web app developed using HTML, CSS, Bootstrap, and EJS. ExpressJS, Javascript, Mongoose, and MongoDB and follows the Model-View-Controller (MVC) system pattern.
- Web app hosted on Heroku web hosting service. 

## Customer View 
As a customer, 
- The Customer can get in queue by clicking the "Take Ticket" button. 
- The Customer can also view the current status of the counter and queue.
- Customer view link: https://queue-ticketing-app.herokuapp.com/customer_view

## Counter Management View
As a counter manager,
- The Counter manager can call the next person in queue to the counter by clicking the "Call Next" button.
- The Counter manager can mark the current ticket served at the counter as complete by clicking the "Complete Current" button.
- The Counter manager can set the counter online or offline by clicking the "Go Online/Offline" button.
- Counter manager view link: https://queue-ticketing-app.herokuapp.com/counter_management_view
