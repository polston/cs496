let app = angular.module("AppointmentApp", [])
        
app.controller("AppointmentController", AppointmentController)
    
function AppointmentController($scope, $http) {
    $scope.createAppointment = createAppointment
    $scope.deleteAppointment = deleteAppointment
    $scope.editAppointment = editAppointment
    $scope.updateAppointment = updateAppointment
    $scope.validationError = null


    function init(){
        getAllAppointments()
    }
    init()

    function getAllAppointments() {
        $http.get('/api/calendar').then(
            function(appointments){
                $scope.appointments = appointments.data
            },
            function(err) {
                console.log(err)
        })
    }
    // TODO: fire off flash message or something with the returned json error
    // from the database
    function createAppointment(appointment){
      console.log('\n\n appointment date: ' + JSON.stringify(appointment))
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
                $scope.appointment = result.data
            },
            function(err){
                console.log(err)
            }
        )
    }

    function updateAppointment(appointment) {
        $http.put('/api/calendar/'+appointment._id, appointment).then(
            function(result){
                getAllAppointments()
            },
            function(err){
                console.log(err)
            }
        )
    }

    function getErrors(res){
        let errs = []
        if(res.data.error){
            for(key in res.data.error.errors){
                console.log(res.data.error.errors[key].message)
                errs.push(res.data.error.errors[key].message)
            }
        }
        $scope.validationError = errs
    }

}