angular.module('calendarController', ['ui.calendar', 'ui.bootstrap']) //import modules
        .controller('CalendarCtrl', CalendarCtrl);
//this is a change
// function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, $uibModal, $document, $http) {
//     var date = new Date();
//     var d = date.getDate();
//     var m = date.getMonth();
//     var y = date.getFullYear();
//     $scope.isCreated = false


function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, $uibModal, $document, $http) { //loading dependecies
    $scope.isToggled = false //true -> on my appointments      false -> on available appointments
    $scope.selectAppointment = selectAppointment
    $scope.studentOptions = getAllStudents()
    $scope.tutorOptions = getAllTutors()
    $scope.courseOptions = []
    $scope.events = []
    $scope.bookedEvents = []
    $scope.tempSource = []
    
    //initialization function that pulls data from DB, gets user, and renders calendar
    function init(){
      getAllAppointments()
      getCurrentUser()
      renderCalendar('myCalendar')
    }
    init() //initialize on page load

    /* Launches modal on event click for booking function */
    $scope.modalOnEventClick = function(date, jsEvent, view){
            $('#dateTitle').html(date.title)
            $('#dateTitle2').html(date.start.toString());
            $('#dateTitle3').html(date.end.toString());
            $('#dateBody').html("Book this Appointment?");
            $('#dateSubmit').attr('class',"btn btn-success");
            $('#dateSubmit').html('Book');
            $('#dateObject').html(date);
            $('#bookModal').modal();
            $scope.eventToChange = date //storing event in scope for booking function
         
         if(date.title.indexOf(' with ') > -1){ //if toggled (event is booked)
            $('#dateTitle').html(date.title)
            $('#dateTitle2').html("Start: " + date.start.toString());
            $('#dateTitle3').html("End: " + date.end.toString());
            $('#dateBody').html("Cancel this Appointment?");
            $('#dateSubmit').attr('class',"btn btn-danger"); //function is same as booking, just updates differntly. Attribute
            $('#dateSubmit').attr('ng-click',"test()");      //is changed for UX
            $('#dateSubmit').html('Cancel');
            $('#dateObject').html(date);
            $('#bookModal').modal();
            $scope.eventToChange = date
        }
    }

    /* changes the display of the calendar with provided options*/
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view); //calling one of fullcalendar's functions
    }

    function renderCalendar(calendarId) { //Method necessary to actually render the calendar object
      $timeout(function () {
        calendarTag = $('#' + calendarId)
        calendarTag.fullCalendar('render')
      }, 0)
    }

    function selectAppointment(start, end){
    //For whatever reason, this function is necessary to make the calendar render. As such, we don't actually use it
    //But we need to keep it to render the calendar
    }

    /* Configuration of the Calendar Object itself */
    $scope.uiConfig = {
      calendar:{
        height: 500,
        editable: false,
        customButtons: { //property is necessary to overload stock calendar functionality
          next: {
            icon: 'right-single-arrow',
            click: function() {
                 uiCalendarConfig.calendars.myCalendar.fullCalendar('next');//ugly way to access calendar object method, advances month.
             }
          },
          prev: {
            icon: 'left-single-arrow',
            click: function() {
                uiCalendarConfig.calendars.myCalendar.fullCalendar('prev');//ugly way to access calendar object method, goes back month.
                //probably useless now, since this turned out not to be the issue.
             }
          },
          today: {
            text: 'today',
            click: function() {
                uiCalendarConfig.calendars.myCalendar.fullCalendar('today');//goes back to current month.
            }
          },
          toggle: { //custom button used to toggle between available and booked appointments
            text: "View My Appointments",
            click: function() { //call a custom function (rather than fullcalendar one) on click
                $scope.toggle($scope.isToggled) //call the toggle function, passing in a global toggle flag
                if($scope.isToggled == true) //if button has been clicked
                  $scope.uiConfig.calendar.customButtons.toggle.text ="View Available Appointments" //change display
                else
                  $scope.uiConfig.calendar.customButtons.toggle.text ="View My Appointments" //if button is unclicked, change display
                renderCalendar('myCalendar') //re-render calendar to reflect changes of event sources
            }
          }
      },
        header:{
          left: 'title', //header elements
          center: 'toggle',
          right: 'today prev,next'
        },
        selectable: true, //defined various calendar functions and what to do on each
			  selectHelper: true,
        navLinks: true, 
        eventClick: $scope.modalOnEventClick, //this is the only fuctionality we use. 
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        select: $scope.selectAppointment
      }
    }
    
    // Calendar needs eventSource to render events.
    $scope.eventSources = [$scope.events]

    //This is the toggle function that modifies the events
    $scope.toggle = function($isToggled){
      if($scope.isToggled == false){ //view is changing from available to booked
        for(let k = 0; k < $scope.events.length; k++){
          $scope.tempSource[k] = $scope.events[k] //store all of the available events in temp storage
        }
        $scope.events.splice(0,$scope.events.length) //remove all events from events array
        for(let i = 0; i < $scope.bookedEvents.length; i++){
          $scope.events.push($scope.bookedEvents[i]) //populate vents array with booked events
        }
        return $scope.isToggled = true //return global flag to keep track of which events are populated
      }
       if($scope.isToggled == true){ //view is changing from booked to available
        $scope.events.splice(0,$scope.events.length) //clear events
        for(let j = 0; j < $scope.tempSource.length; j++){
          $scope.events.push($scope.tempSource[j]) //push back our events stored temporarily from earlier
        }
        $scope.tempSource = [] //clear temp storage
        return $scope.isToggled = false //reset flag
       }
    }
    
    //this function sends a request to the API to get the information about the sessioned user
    function getCurrentUser(){
     return $http.get('/api/user').then(  //return the promise object for use in booking function
          function(user){ //function called on success of promise 
            return $scope.currentUser = user.data //assigning to scope for binding in markup
            },
            function(err) { //$http.get returns a promise; error handling 
                console.log(err)
        })
    }

    //this function sends a request to the API to get the information about all the students. Admin use for booking appointments
    function getAllStudents(){
      $http.get('/api/users').then(
            function(students){
              let allStudents = []
              for(let i = 0; i < students.data.length; i++){
                if(students.data[i]['permissions'] == 'Student'){ //check permissions
                  allStudents.push(students.data[i]) //push each student object into an array of students
                }
              }
              $scope.studentOptions = allStudents //assign to scope for modal dropdown binding
            },
            function(err) {
                console.log(err)
        })
    }

    //this function sends a request to the API to get the information about all the tutors. Admin use for booking appointments
    function getAllTutors(){
      $http.get('/api/users').then(
            function(tutors){
              let allTutors = []
              for(let i = 0; i < tutors.data.length; i++){
                if(tutors.data[i]['permissions'] == 'Tutor'){ //check permissions
                  allTutors.push(tutors.data[i]) //push each tutor object into an array of tutors
                }
              }
              $scope.tutorOptions = allTutors //assign to scope for modal dropdown binding
            },
            function(err) {
                console.log(err)
        })
    }
   
    //this function is passed a tutor object and gets all of the courses that belong to that tutor object 
    $scope.getTutorCourses = function(tutor){
              let courses = [] //temp array
              for(let i = 0; i < $scope.tutorOptions.length; i++){ //iterate through array of tutors gathered earlier
                if($scope.tutorOptions[i]['_id']==tutor._id){ //if ids match (you find the correct tutor)
                  for(let j=0; j<$scope.tutorOptions[i].courses.length; j++){ //courses is an array, iterate through it
                    courses.push($scope.tutorOptions[i].courses[j]) //push each course into the array so get the course list
                  }
                }
              }
              $scope.courseOptions = courses //bind to scope to see options in dropdown
    }
    
    //Really busy function that pulls all appointments objects from API and binds them to events that are then populated on the calendar
    function getAllAppointments() {
      getCurrentUser()
      $http.get('/api/calendar').then(
          function(appointments){
            if ($scope.events.length == 0){ //if the calendar is loaded for the first time
                for(let i = 0; i < appointments.data.length; i++){ //iterate through the appointments 
                  console.log('first: ' + appointments.data[i].student.id)
                  if(appointments.data[i].student.id === null){   //available appointments have null assigned to student properties 
                      let endTime = new Date(appointments.data[i].date) //get the start date of the appointments
                      let obj = { //build event object with properties of appointment object 
                      title: appointments.data[i].course + " tutored by: " + appointments.data[i].tutor.name.firstName, //create a title relevent to the appointment
                      start: Date.parse(appointments.data[i].date), //set the start date
                      end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true, //all appointments are arbitrarily one hour long
                      color:  '#B30000', id: appointments.data[i]['_id']                                          //convert the date to ISO string, add an hour
                    }                                                                                             //then parse back to date and assign to end time
                      $scope.events.push(obj) //events is available appointments.

                   }
                  else{ //if the student object doesn't have a null value, appointment is booked
                    let endTime = new Date(appointments.data[i].date) //all events objects are built the same. 
                    let obj = {
                      title: appointments.data[i].course + ' with ' + appointments.data[i].tutor.name.firstName,
                      start: Date.parse(appointments.data[i].date), 
                      end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true, //stick property makes events persist thru view changes
                      color:  '#00b250', id: appointments.data[i]['_id'] //all events have an option ID parameter that we make use of to directly bind an event to
                    }                                                    //and appointments object. Since all appointments have a unique object ID, this allows use to have
                      $scope.bookedEvents.push(obj)                      //a direct reference.
                  }   //booked events are events with students
                }
            }
            else{ //if events already has objects, then this is being called to update a newly updated/created event
              $scope.events.splice(0,$scope.events.length) //remove all available events (since we're getting them all anyways)
              $scope.bookedEvents.splice(0,$scope.bookedEvents.length) 
              $scope.isToggled = false //reset toggle state to default 
              $scope.uiConfig.calendar.customButtons.toggle.text ="View My Appointments" //reset button label to default
              for(let j = 0; j < appointments.data.length; j++){ //All the same logic as above for the rest of the function
                console.log('second: ' + appointments.data[j].student.id)
                  if(appointments.data[j].student.id === null){
                      let endTime = new Date(appointments.data[j].date)
                      let obj = {
                      title: appointments.data[j].course + " tutored by: " + appointments.data[j].tutor.name.firstName, 
                      start: Date.parse(appointments.data[j].date), 
                      end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                      color:  '#B30000', id: appointments.data[j]['_id']
                    }
                      $scope.events.push(obj)
                   }
                  else{
                    let endTime = new Date(appointments.data[j].date)
                    let obj = {
                      title: appointments.data[j].course + ' with ' + appointments.data[j].tutor.name.firstName,
                      start: Date.parse(appointments.data[j].date), 
                      end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                      color:  '#00b250', id: appointments.data[j]['_id']
                    }
                       $scope.bookedEvents.push(obj)
                  }
              }
            }
          },
          function(err) {
              console.log(err)
      })
      $scope.isToggled = false
    }
    
    //function that creates an appointment for admin use
    $scope.createAppointment = function(student, tutor, course, date){ //pass in objects selected in modal
      let data //declar object 
      if(student == undefined){ //if students object is undefined, then this will be an open appointments 

         data = { date: date,
                    course: course,
                    tutor: { 
                      name: {
                        firstName: tutor.name.firstName, //build the appointment object
                        lastName:  tutor.name.lastName,
                      },
                      id: tutor._id,
                    },
                    student: { 
                      name:  {
                        firstName: null, //since this is open, we assign null values to the student properties
                        lastName:  null,
                      },
                      id: null, //when this appointment is booked, the propery student ID will be passed in here. placeholder.
                    }           //important note: id is actually type ObjectID inside of mongoDB, and is held by reference
                  }             //                the mongoose model will not accept anything except an ObjectID or null for the value
        
      }
      else{ //if student has value, then this a booked appointment
         data = { date: date,
                   course: course,
                   tutor: { 
                     name: {
                       firstName: tutor.name.firstName,
                       lastName:  tutor.name.lastName,
                     },
                     id: tutor._id,
                   },
                  student: { 
                     name:  {
                       firstName: student.name.firstName, //assigning student values 
                       lastName:  student.name.lastName,
                     },
                     id: student._id,
                   }
                }
      }

        $http.post('/api/calendar', data).then( //submit post request to API with our built object
            function(result){
                let endTime = new Date(data.date)
                let obj = {
                  title: 'Tutoring', start: Date.parse(data.date), 
                  end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                  color:  '#B30000', id: data['_id']
                }

                // $scope.isCreated = true //???? was in HEAD but not in the commit?

                getAllAppointments()
                $scope.clearDropdowns()
            },
            function(err){
                console.log('err: ', err)
        })
    }
    
    //Method called to pass the event ID on the event card so that the delete function can be called 
    $scope.bindModal = function(event){
      $scope.temp = []
      $scope.temp = event.id //assign ID to temporary value 
    }
    
    //Function that passes in an object ID to the API and deletes that object from the DB 
    $scope.deleteAppointment = function () {
      let appointment = $scope.temp //getting ID from bindModal method 
      console.log(appointment)
        $http.delete('/api/calendar/' + appointment).then(
            function(result){
              console.log(result)
              for(let i = 0; i < $scope.events.length; i++){ //iterating through events to find which one matches the deleted appointment
                if($scope.events[i].id == appointment)
                  $scope.events.splice(i,1) //when found, remove that event from the calendar. 
              }
            },
            function(err){
                console.log(err)
        })
    }
    
    //This is a promise heavy function that books and unbooks appointments 
    $scope.bookAppointment = function () {
      getCurrentUser().then(function(user){
          $scope.queryResult = $scope.getAppointmentByID($scope.eventToChange.id) //since this is in scope, the ID is bound to the modal and pass this to lookup 
          $scope.queryResult.then(function(query){                                //only that specific appointment. We then chain this to another promise that looks
          //booking appointment                                                 //up the current user 
           if($scope.isToggled==false){
            query.student.name.firstName = user.name.firstName
            query.student.name.lastName = user.name.lastName
            query.student.id = user._id
           }
           //cancelling appointment
           else{ //based on the toggle flag, we know if this is a booked or unbooked event being changed. We either add or remove the student name accordingly.
            query.student.name.firstName = null
            query.student.name.lastName = null
            query.student.id = null
           }
           
        $http.put('/api/calendar/' + query._id, query).then( //post update to the DB
            function(result){
              console.log(query)
              init() //then we initialize the calendar again, which will update the events accordingly and re-render the calendar
            },
            function(err){
                console.log(err)
        })
      })
    })
    }
    
    //This function queries the API to find a specific appointment by ID.
    $scope.getAppointmentByID = function(id){
     return $http.get('/api/calendar/' + id).then( //we return the promise to chain it in the booking function
            function(appointment){
             return appointment.data //return the data to be nested in the promise object 
            },
            function(err) {
                console.log(err)
        })
      
    }

    //Quality of life function that simply clears modal dropdowns when a supervisor/admin is making multiple appointments.
    $scope.clearDropdowns = function(){
      $scope.student = undefined
      $scope.tutor = ""
      $scope.date = ""
      $scope.course = ""
    }
    
}