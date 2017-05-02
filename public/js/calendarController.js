angular.module('calendarController', ['ui.calendar', 'ui.bootstrap'])
        .controller('CalendarCtrl', CalendarCtrl);

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
          },
          toggle: {
            text: "My Appointments",
            click: function() {
                $scope.toggle($scope.isToggled)
                if($scope.isToggled==true)
                  $scope.uiConfig.calendar.customButtons.toggle.text ="Available Appointments"
                else
                   $scope.uiConfig.calendar.customButtons.toggle.text ="My Appointments"
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
    
    $scope.toggle = function($isToggled){
      if($scope.isToggled == false){
        for(let k = 0; k < $scope.events.length; k++){
          $scope.tempSource[k] = $scope.events[k]
        }
        $scope.events.splice(0,$scope.events.length)
        for(let i = 0; i < $scope.bookedEvents.length; i++){
          $scope.events.push($scope.bookedEvents[i])
        }
        $scope.buttonLabel = "My Appointments"
        return $scope.isToggled = true
      }
       if($scope.isToggled == true){
        $scope.events.splice(0,$scope.events.length)
        for(let j = 0; j < $scope.tempSource.length; j++){
          $scope.events.push($scope.tempSource[j])
        }
        $scope.tempSource = []
        //$scope.buttonLabel = "My Appointments"
        return $scope.isToggled = false
       }
    }
    
    function getCurrentUser(){
      $http.get('/api/user').then(
          function(user){
             $scope.currentUser = user.data
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
                if($scope.tutorOptions[i]['_id']==tutor._id){
                  for(let j=0; j<$scope.tutorOptions[i].courses.length; j++){
                    courses.push($scope.tutorOptions[i].courses[j])
                  }
                }
              }
              $scope.courseOptions = courses
    }
/* 
                                ,_-=(!7(7/zs_.
                             .='  ' .`/,/!(=)Zm.
               .._,,._..  ,-`- `,\ ` -` -`\\7//WW.
          ,v=~/.-,-\- -!|V-s.)iT-|s|\-.'   `///mK%.
        v!`i!-.e]-g`bT/i(/[=.Z/m)K(YNYi..   /-]i44M.
      v`/,`|v]-DvLcfZ/eV/iDLN\D/ZK@%8W[Z..   `/d!Z8m
     //,c\(2(X/NYNY8]ZZ/bZd\()/\7WY%WKKW)   -'|(][%4.
   ,\\i\c(e)WX@WKKZKDKWMZ8(b5/ZK8]Z7%ffVM,   -.Y!bNMi
   /-iit5N)KWG%%8%%%%W8%ZWM(8YZvD)XN(@.  [   \]!/GXW[
  / ))G8\NMN%W%%%%%%%%%%8KK@WZKYK*ZG5KMi,-   vi[NZGM[
 i\!(44Y8K%8%%%**~YZYZ@%%%%%4KWZ/PKN)ZDZ7   c=//WZK%!
,\v\YtMZW8W%%f`,`.t/bNZZK%%W%%ZXb*K(K5DZ   -c\\/KM48
-|c5PbM4DDW%f  v./c\[tMY8W%PMW%D@KW)Gbf   -/(=ZZKM8[
2(N8YXWK85@K   -'c|K4/KKK%@  V%@@WD8e~  .//ct)8ZK%8`
=)b%]Nd)@KM[  !'\cG!iWYK%%|   !M@KZf    -c\))ZDKW%`
YYKWZGNM4/Pb  '-VscP4]b@W%     'Mf`   -L\///KM(%W!
!KKW4ZK/W7)Z. '/cttbY)DKW%     -`  .',\v)K(5KW%%f
'W)KWKZZg)Z2/,!/L(-DYYb54%  ,,`, -\-/v(((KK5WW%f
 \M4NDDKZZ(e!/\7vNTtZd)8\Mi!\-,-/i-v((tKNGN%W%%
 'M8M88(Zd))///((|D\tDY\\KK-`/-i(=)KtNNN@W%%%@%[
  !8%@KW5KKN4///s(\Pd!ROBY8/=2(/4ZdzKD%K%%%M8@%%
   '%%%W%dGNtPK(c\/2\[Z(ttNYZ2NZW8W8K%%%%YKM%M%%.
     *%%W%GW5@/%!e]_tZdY()v)ZXMZW%W%%%*5Y]K%ZK%8[
      '*%%%%8%8WK\)[/ZmZ/Zi]!/M%%%%@f\ \Y/NNMK%%!
        'VM%%%%W%WN5Z/Gt5/b)((cV@f`  - |cZbMKW%%|
           'V*M%%%WZ/ZG\t5((+)L'-,,/  -)X(NWW%%
                `~`MZ/DZGNZG5(((\,    ,t\\Z)KW%@
                   'M8K%8GN8\5(5///]i!v\K)85W%%f
                     YWWKKKKWZ8G54X/GGMeK@WM8%@
                      !M8%8%48WG@KWYbW%WWW%%%@
                        VM%WKWK%8K%%8WWWW%%%@`
                          ~*%%%%%%W%%%%%%%@~
                             ~*MM%%%%%%@f`
                                 '''''
  this is a euphanism for how the function below is structured
*/
    
    //abandon all hope ye who enter here
    function getAllAppointments() {
      $http.get('/api/calendar').then(
          function(appointments){
            if ($scope.isCreated == false){
                for(let i = 0; i < appointments.data.length; i++){
                  if(appointments.data[i].student.name.firstName == undefined){    //if available
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
                      $scope.bookedEvents.push(obj)
                  }
                }
            }
            else
              if($scope.events.length != appointments.data.length){
                let i = appointments.data.length-1
                let endTime = new Date(appointments.data[i].date)
                let obj = {
                  title: 'Tutoring', start: Date.parse(appointments.data[i].date), 
                  end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                  color:  '#B30000', id: appointments.data[i]['_id']
                }
                $scope.events.push(obj)
                $scope.isCreated = false
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

        $http.post('/api/calendar', data).then(
            function(result){
                let endTime = new Date(data.date)
                let obj = {
                  title: 'Tutoring', start: Date.parse(data.date), 
                  end: Date.parse(endTime.toISOString(endTime.setHours(endTime.getHours() + 1))), stick:true,
                  color:  '#B30000', id: data['_id']
                }
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
      $scope.student = undefined
      $scope.tutor = ""
      $scope.date = ""
      $scope.course = ""
    }
}