angular.module('calendarController', ['ui.calendar', 'ui.bootstrap'])
        .controller('CalendarCtrl', CalendarCtrl);
//this is a change
function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, $uibModal, $document, $http) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.isCreated = false
    $scope.isToggled = false
    $scope.remove = remove
    $scope.selectAppointment = selectAppointment
    $scope.studentOptions = getAllStudents()
    $scope.tutorOptions = getAllTutors()
    $scope.courseOptions = []
    $scope.events = []
    $scope.bookedEvents = []
    $scope.tempSource = []
    
    function init(){
      getAllAppointments()
      getCurrentUser()
      renderCalendar('myCalendar')
    }
    init()

    /* alert on eventClick */
    $scope.alertOnEventClick = function(date, jsEvent, view){
            $('#dateTitle').html(date.title);
            $('#dateBody').html("Book this Appointment?");
             $('#dateSubmit').attr('class',"btn btn-success");
              $('#dateSubmit').html('Book');
            $('#dateObject').html(date);
            $('#bookModal').modal();
            $scope.eventToChange = date
         
         if(date.title.indexOf(' with ') > -1){
            $('#dateTitle').html(date.title);
            $('#dateBody').html("Cancel this Appointment?");
            $('#dateSubmit').attr('class',"btn btn-danger");
            $('#dateSubmit').attr('ng-click',"test()");
            $('#dateSubmit').html('Cancel');
            $('#dateObject').html(date);
            $('#bookModal').modal();
            $scope.eventToChange = date
        }
    };

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
          },
          toggle: {
            text: "View My Appointments",
            click: function() {
                $scope.toggle($scope.isToggled)
                if($scope.isToggled==true)
                  $scope.uiConfig.calendar.customButtons.toggle.text =" View Available Appointments"
                else
                     $scope.uiConfig.calendar.customButtons.toggle.text ="View My Appointments"
                renderCalendar('myCalendar')
            }
          }
      },
        header:{
          left: 'title',
          center: 'toggle',
          right: 'today prev,next'
        },
        selectable: true,
			  selectHelper: true,
        navLinks: true, 
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        select: $scope.selectAppointment
      }
    };
    
    // Calendar needs eventSource to render events.
    $scope.eventSources = [$scope.events]

    $scope.toggle = function($isToggled){
      if($scope.isToggled == false){
        for(let k = 0; k < $scope.events.length; k++){
          $scope.tempSource[k] = $scope.events[k]
        }
        $scope.events.splice(0,$scope.events.length)
        for(let i = 0; i < $scope.bookedEvents.length; i++){
          $scope.events.push($scope.bookedEvents[i])
        }
        return $scope.isToggled = true
      }
       if($scope.isToggled == true){
        $scope.events.splice(0,$scope.events.length)
        for(let j = 0; j < $scope.tempSource.length; j++){
          $scope.events.push($scope.tempSource[j])
        }
        $scope.tempSource = []
        return $scope.isToggled = false
       }
    }
    
    function getCurrentUser(){
     return $http.get('/api/user').then(
          function(user){
            return $scope.currentUser = user.data
            },
            function(err) {
                console.log(err)
        })
    }

    function getAllStudents(){
      $http.get('/api/users').then(
            function(students){
              let allStudents = []
              for(let i = 0; i < students.data.length; i++){
                if(students.data[i]['permissions'] == 'Student'){
                  allStudents.push(students.data[i])
                }
              }
              $scope.studentOptions = allStudents
            },
            function(err) {
                console.log(err)
        })
    }

    function getAllTutors(){
      $http.get('/api/users').then(
            function(tutors){
              let allTutors = []
              for(let i = 0; i < tutors.data.length; i++){
                if(tutors.data[i]['permissions'] == 'Tutor'){
                  console.log(tutors)
                  allTutors.push(tutors.data[i])
                }
              }
              $scope.tutorOptions = allTutors
            },
            function(err) {
                console.log(err)
        })
    }
   
    
    $scope.getTutorCourses = function(tutor){
              let courses = []
              for(let i = 0; i < $scope.tutorOptions.length; i++){
                console.log($scope.tutorOptions[i]['_id'])
                console.log(tutor._id)
                if($scope.tutorOptions[i]['_id']==tutor._id){
                  for(let j=0; j<$scope.tutorOptions[i].courses.length; j++){
                    courses.push($scope.tutorOptions[i].courses[j])
                  }
                }
              }
              $scope.courseOptions = courses
    }

    
    
    function getAllAppointments() {
      getCurrentUser()
      $http.get('/api/calendar').then(
          function(appointments){
            console.log($scope.currentUser._id)
            if ($scope.events.length == 0){
                for(let i = 0; i < appointments.data.length; i++){
                  console.log(appointments.data[i])
                  if(appointments.data[i].student.name.id == $scope.currentUser._id || $scope.currentUser.permissions == 'Admin' || $scope.currentUser.permissions == 'Supervisor'){    //if available
                      console.log('firstget')
                      let endTime = new Date(appointments.data[i].date)
                      let obj = {
                      title: appointments.data[i].course + " tutored by: " + appointments.data[i].tutor.name.firstName, 
                      start: Date.parse(appointments.data[i].date), 
                      end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                      color:  '#B30000', id: appointments.data[i]['_id']
                    }
                      $scope.events.push(obj)
                   }
                  else{
                    let endTime = new Date(appointments.data[i].date)
                    let obj = {
                      title: appointments.data[i].course + ' with ' + appointments.data[i].tutor.name.firstName,
                      start: Date.parse(appointments.data[i].date), 
                      end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                      color:  '#B30000', id: appointments.data[i]['_id']
                    }
                      $scope.events.push(obj)
                  }
                }
            }
            else{
              $scope.events.splice(0,$scope.events.length)
              $scope.bookedEvents.splice(0,$scope.bookedEvents.length)
              $scope.isToggled = false
              $scope.uiConfig.calendar.customButtons.toggle.text ="View My Appointments"
              for(let j = 0; j < appointments.data.length; j++){
                  if(typeof appointments.data[j].student._id === 'null'){    //if available
                    console.log('secondget')
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
                      color:  '#B30000', id: appointments.data[j]['_id']
                    }
                       $scope.bookedEvents.push(obj)
                  }
              }
            }
              
              //stick property in events object necessary to make events persist on view changes.
              //only way to modify an ISO string is to pass back to date object, modify, then covert back to date.
          },
          function(err) {
              console.log(err)
      })
      $scope.isToggled = false
    }
    
    $scope.createAppointment = function(student, tutor, course, date){
      let data
      console.log('student')
      console.log(student)
      if(student == undefined){
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
                        firstName: null,
                        lastName:  null,
                      },
                      id: null,
                    }
                  }
        
      }
      else{
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
                       firstName: student.name.firstName,
                       lastName:  student.name.lastName,
                     },
                     id: student._id,
                   }
                }
      }
      console.log(data)
        $http.post('/api/calendar', data).then(
            function(result){
                let endTime = new Date(data.date)
                let obj = {
                  title: 'Tutoring', start: Date.parse(data.date), 
                  end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                  color:  '#B30000', id: data['_id']
                }
                console.log(result)
                $scope.isCreated = true
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
              console.log(result)
              for(let i = 0; i < $scope.events.length; i++){
                if($scope.events[i].id == appointment)
                  $scope.events.splice(i,1)
              }
            },
            function(err){
                console.log(err)
        })
    }
    
    $scope.updateAppointment = function () {
    $scope.isCreated = true
      getCurrentUser().then(function(user){
          $scope.queryResult = $scope.getAppointmentByID($scope.eventToChange.id)
          $scope.queryResult.then(function(query){
           if($scope.isToggled==false){
            query.student.name.firstName = user.name.firstName
            query.student.name.lastName = user.name.lastName
            query.student.id = user._id
           }
           //cancelling an appointment?
           else{
             console.log('where am i')
            query.student.name.firstName = null
            query.student.name.lastName = null
            query.student.id = null
           }
           
        $http.put('/api/calendar/' + query._id, query).then(
            function(result){
              console.log(query)
              init()
            },
            function(err){
                console.log(err)
        })
      })
    })
    }
    
    
    $scope.getAppointmentByID = function(id){
     return $http.get('/api/calendar/' + id).then(
            function(appointment){
             return appointment.data
            },
            function(err) {
                console.log(err)
        })
      
    }

    $scope.clearDropdowns = function(){
      $scope.student = undefined
      $scope.tutor = ""
      $scope.date = ""
      $scope.course = ""
    }
    
}