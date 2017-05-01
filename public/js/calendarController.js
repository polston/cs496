angular.module('calendarController', ['ui.calendar', 'ui.bootstrap'])
        .controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, $uibModal, $document, $http) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var isCreated = false
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
      getCurrentUser()

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
    
    // Calendar needs eventSource to render events.
    $scope.eventSources = [$scope.events]

    // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    
    //TODO: these getALL functions are handled mostly by the API now, and need to be adjusted
    
    function getCurrentUser(){
      $http.get('/api/user').then(
          function(user){
             $scope.currentUser = user.data
              console.log($scope.currentUser)
            },
            function(err) {
                console.log(err)
        })
    }

    function getAllStudents(){
      $http.get('/api/users').then(
            function(students){
              let allStudents = []
              let names = []
              for(let i = 0; i < students.data.length; i++){
                if(students.data[i]['permissions'] == 'Student'){
                  allStudents.push(students.data[i])
                  names.push(students.data[i].name.firstName + " " + students.data[i].name.lastName);
                }
              }
              $scope.studentOptions = allStudents
              console.log($scope.studentOptions)
            },
            function(err) {
                console.log(err)
        })
    }

    function getAllTutors(){
      $http.get('/api/users').then(
            function(tutors){
              let allTutors = []
              let courses = []
              let names = []
              for(let i = 0; i < tutors.data.length; i++){
                if(tutors.data[i]['permissions'] == 'Tutor'){
                  allTutors.push(tutors.data[i])
                }
                  
              }
              $scope.tutorOptions = allTutors
             // console.log($scope.tutorOptions)
            },
            function(err) {
                console.log(err)
        })
    }
   
    
    $scope.getTutorCourses = function(tutor){
              let courses = []
              for(let i = 0; i < $scope.tutorOptions.length; i++){
                if($scope.tutorOptions[i]['_id']==tutor){
                  for(let j=0; j<$scope.tutorOptions[i].courses.length; j++){
                    courses.push($scope.tutorOptions[i].courses[j])
                  }
                }
              }
              $scope.courseOptions = courses
    }
    function getAllAppointments() {
      $http.get('/api/calendar').then(
          function(appointments){
            if (isCreated == false){
                for(let i = 0; i < appointments.data.length; i++){
                  let endTime = new Date(appointments.data[i].date)
                  let obj = {title: 'Tutoring', start: Date.parse(appointments.data[i].date), 
                  end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                  color:  '#B30000', id: appointments.data[i]['_id']
                  }
                  $scope.events.push(obj)
                }
            }
            else
              if($scope.events.length != appointments.data.length){
                 let i = appointments.data.length-1
                  let endTime = new Date(appointments.data[i].date)
                  let obj = {title: 'Tutoring', start: Date.parse(appointments.data[i].date), 
                  end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                  color:  '#B30000', id: appointments.data[i]['_id']
                }
              $scope.events.push(obj)
              isCreated = false
                }
              //stick property in events object necessary to make events persist on view changes.
              //only way to modify an ISO string is to pass back to date object, modify, then covert back to date.
          },
          function(err) {
              console.log(err)
      })
    }
    

    $scope.createAppointment = function(student, tutor, course, date){

      let data = { date: date,
                   course: course,
                   tutor: tutor,
                   student: student,
                    };

        $http.post('/api/calendar', data).then(
            function(result){
                let endTime = new Date(data.date)
                let obj = {title: 'Tutoring', start: Date.parse(data.date), 
                 end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                 color:  '#B30000', id: data['_id']
                 }
                isCreated = true
                getAllAppointments()
                $scope.clearDropdowns()
            },
            function(err){
                console.log('err: ', err)
        })
    }
    
    $scope.bindModal = function(event){
      $scope.temp = []
      $scope.temp = event.id
    }
    
    $scope.deleteAppointment = function () {
      let appointment = $scope.temp
      console.log(appointment)
        $http.delete('/api/calendar/' + appointment).then(
            function(result){
              for(let i = 0; i < $scope.events.length; i++){
                if($scope.events[i].id == appointment)
                 $scope.events.splice(i,1)
              }
            },
            function(err){
                console.log(err)
        })
    }
    
    $scope.clearDropdowns = function(){
      $scope.student = ""
      $scope.tutor = ""
      $scope.date = ""
      $scope.course = ""
    }
}