let app = angular.module("IndexApp", [])
        
app.controller("IndexController", IndexController)
    
function IndexController($scope, $http) {
    $scope.createUser = createUser
    $scope.deleteUser = deleteUser
    $scope.editUser = editUser
    $scope.updateUser= updateUser
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

    function createUser(user) {
        $http.post('/api/users', user).then(
            function(result){
                if(result.data.error){
                    console.log(result.data.error)
                }
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

}