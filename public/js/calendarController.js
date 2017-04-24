angular.module('calendarController', ['ui.calendar', 'ui.bootstrap'])
        .controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, $uibModal, $document, $http) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.remove = remove
    $scope.selectAppointment = selectAppointment
    $scope.studentOptions = getAllStudents()
    $scope.tutorOptions = getAllTutors()
    $scope.courseOptions = []
    // $scope.getAllAppointments= getAllAppointments
    $scope.events = []

    function init(){
      
      renderCalendar('myCalendar')
      getAllAppointments()
      
      // events
      // getAllAppointments()
      // $scope.events =
      // $scope.events = getAllAppointments()
      
    }
    init()
    console.log('events: ', $scope.events)
  /*  $scope.changeTo = 'Hungarian';
    //event source that pulls from google.com 
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };*/

    /* event source that contains custom events on the scope */
    // $scope.events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ]
    
    // console.log('$scope.events: ', $scope.events)
    // let test = getAllAppointments()
    // console.log('getAllAppointments(): ', test)
    // $scope.events = getAllAppointments()

    /* event source that calls a function on every view switch */
 /*   $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };*/

    // $scope.calEventsExt = {
    //   color: '#f00',
    //   textColor: 'yellow',
    //   events: [
    //       {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //     ]
    // };

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };

    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };

    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    // add and removes an event source of choice 
   /* $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };*/

    /* add custom event*/
  /*  $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };*/

    /* remove event */
    function remove (index) {
      $scope.events.splice(index,1);
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    // $scope.renderCalender = function(calendar) {
    //   $timeout(function() {
    //     if(uiCalendarConfig.calendars[calendar]){
    //       uiCalendarConfig.calendars[calendar].fullCalendar('render');
    //     }
    //   });
    // };
    // $scope.renderCalendar = function() {
    //     $timeout(function(){
    //             $('#calendar').fullCalendar('render');
    //             $('#calendar').fullCalendar('rerenderEvents');
    //         }, 0);
    // };

    function renderCalendar(calendarId) {
      $timeout(function () {
        calendarTag = $('#' + calendarId);
        calendarTag.fullCalendar('render');
      }, 0);
    };

     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
      // console.log('eventRender:')
      // console.log('event: ', event)
      // console.log('element: ', element)
      // console.log('view: ', view)
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

    function selectAppointment(start, end){
      let title = prompt('Appointment title?')
      console.log(start + ' ' + end)
    }

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 500,
        editable: false,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        selectable: true,
			  selectHelper: true,
        navLinks: true, //TODO: make this work
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        select: $scope.selectAppointment
      }
    };

    /* event sources array*/
    // $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources = [$scope.events]
    // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

    function getAllStudents(){
      $http.get('/api/users').then(
            function(students){
              console.log(students.data)
              let allStudents = []
              let names = []
              for(let i = 0; i < students.data.length; i++){
                if(students.data[i]['permissions'] == 'Student'){
                  console.log(students.data[i])
                  allStudents.push(students.data[i])
                  names.push(students.data[i].name.firstName + " " + students.data[i].name.lastName);
                }
              }
              $scope.studentNames = names
              $scope.studentOptions = allStudents
            },
            function(err) {
                console.log(err)
        })
    }

    function getAllTutors(){
      $http.get('/api/users').then(
            function(tutors){
              console.log(tutors.data)
              let allTutors = []
              let courses = []
              let names = []
              for(let i = 0; i < tutors.data.length; i++){
                if(tutors.data[i]['permissions'] == 'Tutor'){
                  allTutors.push(tutors.data[i])
                  names.push(tutors.data[i].name.firstName + " " + tutors.data[i].name.lastName);
                  courses.push(tutors.data[i].courses)
                }
                  
              }
              $scope.courseOptions = courses
              console.log('course options: ', $scope.courseOptions)
              $scope.tutorOptions = allTutors
              $scope.tutorNames = names
            },
            function(err) {
                console.log(err)
        })
    }
    
    
    function getAllAppointments() {
      let temp = []
      $http.get('/api/calendar').then(
          function(appointments){
            
            console.log(appointments.data)
            for(let i = 0; i < appointments.data.length; i++){
              let obj = {title: 'Test', start: Date.parse(appointments.data[i].date), end: Date.parse(appointments.data[i].date)}
              // temp.push(obj)
              $scope.events.push(obj)
            }
            // console.log('temp: ', temp)
            // $scope.events = temp
            // console.log('appt events: ', $scope.events)
          },
          function(err) {
              console.log(err)
      })
    }
    
    //function updateCalendar(event){
    //  let obj = {title: 'Test', start: Date.parse(event.data.date), end: Date.parse(event.data.date)}
    //  $scope.events.push(obj)
    //}

    $scope.createAppointment = function(student, tutor, course, date){
     // console.log(JSON.parse(tutor)._id)
    // console.log('tutor: ', )
      console.log('student: ', student)
      console.log('tutor: ', tutor)
      console.log('course: ', course)
      console.log('date: ', date)
      
      let data = { date: date,
                   course: course,
                   tutor: tutor,
                   student: student };

        $http.post('/api/calendar', data).then(
            function(result){
              getAllAppointments()
            },
            function(err){
                console.log('err: ', err)
        })
    }
}