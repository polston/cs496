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
    //$scope.getAllAppointments= getAllAppointments
    $scope.events = []
    function init(){
      
      renderCalendar('myCalendar')
      getAllAppointments()

    }
    init()


    /* alert on eventClick */
   /* $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };*/

    /* remove event */
    function remove (index) {
      $scope.events.splice(index,1);
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };

    function renderCalendar(calendarId) {
      $timeout(function () {
        calendarTag = $('#' + calendarId);
        calendarTag.fullCalendar('render');
      }, 0);
    };

    function selectAppointment(start, end){
      //let title = prompt('Appointment title?')
      //console.log(start + ' ' + end)
    }

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 500,
        editable: false,
        customButtons: {
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
          }
      },
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
    
    // Celndar needs eventSource to render events.
    $scope.eventSources = [$scope.events]

    function getAllStudents(){
      $http.get('/api/users').then(
            function(students){
              //console.log(students.data)
              let allStudents = []
              let names = []
              for(let i = 0; i < students.data.length; i++){
                if(students.data[i]['permissions'] == 'Student'){
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
              //console.log(tutors.data)
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
             // $scope.courseOptions = courses
              //console.log('course options: ', $scope.courseOptions)
              $scope.tutorOptions = allTutors
              $scope.tutorNames = names
            },
            function(err) {
                console.log(err)
        })
    }
    
    $scope.getTutorCourses = function(tutor){
              let courses = []
              for(let i = 0; i < $scope.tutorOptions.length; i++){
                if($scope.tutorOptions[i]['_id']==tutor){
                  courses.push($scope.tutorOptions[i].courses)
                }
              }
              $scope.courseOptions = courses
    }
 
    
    
    function getAllAppointments() {
     // $scope.events = []
      //console.log(temp[0])
      $http.get('/api/calendar').then(
          function(appointments){
            
            //console.log(appointments.data)
            for(let i = 0; i < appointments.data.length; i++){
              let endTime = new Date(appointments.data[i].date)
              let obj = {title: 'Tutoring', start: Date.parse(appointments.data[i].date), 
              end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
              color:  '#B30000'
              }
              //stick property in events object necessary to make events persist on view changes.
              //only way to modify an ISO string is to pass back to date object, modify, then covert back to date.
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
                let endTime = new Date(data.date)
                let obj = {title: 'Tutoring', start: Date.parse(data.date), 
                 end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                 color:  '#B30000'
                 }
                $scope.events.push(obj)
                $scope.clearDropdowns()
            },
            function(err){
                console.log('err: ', err)
        })
    }
    
    $scope.clearDropdowns = function(){
      $scope.student = ""
      $scope.tutor = ""
      $scope.date = ""
      $scope.course = ""
    }
}