let app = angular.module("CalendarApp", [])
        
app.controller("CalendarController", CalendarController)
    
function CalendarController($scope, $http) {
    $scope.createAppointment = createAppointment
    $scope.deleteAppointment = deleteAppointment
    $scope.editAppointment = editAppointment
    $scope.updateAppointment = updateAppointment
    $scope.tutorOptions = ['Admin', 'Supervisor', 'Tutor', 'Student']
    $scope.studentOptions = getAllStudents()

    function init(){
        getAllAppointments()
        // $scope.studentOptions = getAllStudents()
        console.log($scope.studentOptions)
    }
    init()

    function getAllAppointments() {
        $http.get('/api/calendar').then(
            function(appointment){
                $scope.appointments = appointment.data
            },
            function(err) {
                console.log(err)
        })
    }

    function createAppointment(appointment) {
        $http.post('/api/calendar', appointment).then(
            function(result){
                getAllAppointments()
            },
            function(err){
                console.log(err)
        })
    }

    function deleteAppointment(appointment) {
        $http.delete('/api/calendar/' + appointment).then(
            function(result){
                getAllAppointments()
            },
            function(err){
                console.log(err)
        })
    }

    function editAppointment(appointment) {
        $http.get('/api/calendar/'+appointment).then(
            function(result){
              console.log(result)
                $scope.appointment = result.data
            },
            function(err){
                console.log(err)
            }
        )
    }

    function updateAppointment(appointment) {
        appointment.permissions = appointment.permissions.trim()
        $http.put('/api/users/'+appointment._id, appointment).then(
            function(result){
                getAllUsers()
            },
            function(err){
                console.log(err)
            }
        )
    }

    function getAllStudents(){
      $http.get('/api/users').then(
            function(students){
              console.log(students.data)
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


}