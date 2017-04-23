let app = angular.module("IndexApp", [])
        
app.controller("IndexController", IndexController)
    
function IndexController($scope, $http) {
    $scope.createUser = createUser
    $scope.deleteUser = deleteUser
    $scope.editUser = editUser
    $scope.updateUser = updateUser
    $scope.validationError = null

    //These are in the model, probably need to pull from there
    $scope.permissionOptions = ['Admin', 'Supervisor', 'Tutor', 'Student']
    function init(){
        getAllUsers()
    }
    init()

    function getAllUsers() {
        $http.get('/api/users').then(
            function(users){
                $scope.users = users.data
            },
            function(err) {
                console.log(err)
        })
    }
    
    // TODO: fire off flash message or something with the returned json error
    // from the database
    function createUser(user) {
        $scope.validationError = null
        $http.post('/api/users', user).then(
            function(result){
                getErrors(result)
                getAllUsers()
            },
            function(err){
                console.log(err)
        })
    }

    function deleteUser(user) {
        $http.delete('/api/users/' + user).then(
            function(result){
                getAllUsers()
            },
            function(err){
                console.log(err)
        })
    }

    function editUser(user) {
        $http.get('/api/users/'+user).then(
            function(result){
                $scope.user = result.data
            },
            function(err){
                console.log(err)
            }
        )
    }

    function updateUser(user) {
        user.permissions = user.permissions.trim()
        $http.put('/api/users/'+user._id, user).then(
            function(result){
                getAllUsers()
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