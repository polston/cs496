let app = angular.module("IndexApp", [])
        
app.controller("IndexController", IndexController)
    
function IndexController($scope, $http) {
    $scope.createUser = createUser
    $scope.deleteUser = deleteUser
    $scope.editUser = editUser
    $scope.updateUser = updateUser
    $scope.validationError = null
    $scope.courses = {courses: [{course: ''}]}
    $scope.numOfFields = 1
    $scope.existingUser = false

    //These are in the model, probably need to pull from there
    $scope.permissionOptions = ['Admin', 'Supervisor', 'Tutor', 'Student']
    function init(){
        getAllUsers()
        getCurrentUser()
    }
    init()
    
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
        if($scope.existingUser ==true){
            let err =[]
            err.push("User ID Already Exists. Please Clear Input Before Creating a New User")
            $scope.validationError=err
            return
        }
        $scope.addCourses()
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
        $scope.clearOptions()
        $http.get('/api/users/'+user).then(
            function(result){
                 $scope.user = result.data
                 $scope.editCourses($scope.user)
            },
            function(err){
                console.log(err)
            }
        )
        $scope.existingUser = true
    }

    function updateUser(user) {
       
        user.permissions = user.permissions.trim()
        $scope.updateCourses(user)
        $http.put('/api/users/'+user._id, user).then(
            function(result){
                getAllUsers()
            },
            function(err){
                console.log(err)
            }
        )
         $scope.clearOptions()
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
    
    $scope.addCourses = function(){
        if($scope.user ==undefined)
            return
        else
            $scope.user.courses = []
        for(let i = 0; i < $scope.numOfFields; i++){
            $scope.user.courses.push($scope.courses[i])
            if($scope.courses[0] == null)
                $scope.user.courses = []
        }
    }
   $scope.editCourses = function(user){
        $scope.courses.courses = []
        if(user.courses.length ==0)
            $scope.courses.courses.push({})
        $scope.numofFields = user.courses.length
         for(let i = 0; i < user.courses.length; i++){
            $scope.courses.courses.push({})
            $scope.courses[i] = user.courses[i]
         }
    }
   $scope.updateCourses = function(user){
        user.courses=[]
         for(let i = 0; i < $scope.courses.courses.length; i++){
             user.courses[i]=$scope.courses[i]
         }
         return user
    }
    
    $scope.addField = function(){
        $scope.numOfFields++
        $scope.courses.courses.push({})
    }
    
    $scope.removeField = function(index){
    $scope.numOfFields--
    $scope.courses[index]=""
    $scope.courses.courses.splice(index, 1)

    }
    
    $scope.clearOptions = function(){
      $scope.courses = {courses: [{course: ''}]}
      $scope.user = null
      $scope.validationError = null
      $scope.existingUser = false
    }
    $scope.arrayToString = function(string){
        return string.join(", ");
    };
    

}