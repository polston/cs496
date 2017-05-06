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
    function init(){ //on page load, get all the users in the DB as well as the current user 
        getAllUsers()
        getCurrentUser()
    }
    init()
    
    //Gets the currently sessioned user to hide DOM elements based on permissions 
    function getCurrentUser(){
        $http.get('/api/user').then(
            function(user){
                $scope.currentUser = user.data
            },
            function(err) {
                console.log(err)
        })
    }

    //pulls all users from the DB. 
    function getAllUsers() {
        $http.get('/api/users').then(
            function(users){
                $scope.users = users.data //assigns results to scope for populating user table 
            },
            function(err) {
                console.log(err)
        })
    }

    //adds a user to the Db based on the user passed in from the admin tools 
    function createUser(user) {
        if($scope.existingUser ==true){ //this is a flag set when a user's information is being edited
            let err =[]                 //This validates the passed in user's id as you cannot have two objects with the same id in Mongo.
            err.push("User ID Already Exists. Please Clear Input Before Creating a New User") //error is pushed to scope and propagated to page.
            $scope.validationError=err
            return
        }
        $scope.addCourses() //This calls a function that adds every course added in the dynamic input to that user's course property
        $scope.validationError = null //remove validations errors possibly triggered when user is posted
        $http.post('/api/users', user).then(
            function(result){
                getErrors(result) //if backend returns errors, call function to propagate to page
                getAllUsers() //query user list to update
            },
            function(err){
                console.log(err)
        })
    }

    //deletes a user based on their ID 
    function deleteUser(user) {
        $http.delete('/api/users/' + user).then(
            function(result){
                getAllUsers()
            },
            function(err){
                console.log(err)
        })
    }

    //gets a user and populated fields with their information
    function editUser(user) {
        $scope.clearOptions() //clears the fields for edited user's properties 
        $http.get('/api/users/'+user).then(
            function(result){
                 $scope.user = result.data //assign user to scope 
                 $scope.editCourses($scope.user) //call edit Courses function that populated dynamic input with users courses property
            },
            function(err){
                console.log(err)
            }
        )
        $scope.existingUser = true //populate flag to prevent duplicate user posting in an above function
    }
    
    //Function to update the user that is populated after an editUser function is called
    function updateUser(user) {
        user.permissions = user.permissions.trim() //trim any whitespace of this field for sanitary posting
        $scope.updateCourses(user) //call a function that will update the user courses based on the dynamic input fields
        $http.put('/api/users/'+user._id, user).then( //updates the user information
            function(result){
                getAllUsers() //refreshes table 
            },
            function(err){
                console.log(err)
            }
        )
         $scope.clearOptions() //clear options of user data once updated
    }

    //function that is called in the event of an unsuccessful post promise that propagates the errors to the page
    function getErrors(res){
        let errs = []
        if(res.data.error){
            for(key in res.data.error.errors){
                console.log(res.data.error.errors[key].message)
                errs.push(res.data.error.errors[key].message)
            }
        }
        $scope.validationError = errs //assigns all the errors to scope for binding
    }
    
    //function that adds course from dynamic input to user's courses array 
    $scope.addCourses = function(){
        if($scope.user ==undefined) //can't add courses if there's no user to add to
            return
        else
            $scope.user.courses = [] //initialize courses property
        for(let i = 0; i < $scope.numOfFields; i++){ //for each item in input 
            $scope.user.courses.push($scope.courses[i]) //push the value of each
            if($scope.courses[0] == null) //if the input contains no values
                $scope.user.courses = [] //then neither will the user's courses 
        }
    }
    
    //function that transfers a user's course list to the dynamic input
   $scope.editCourses = function(user){
        $scope.courses.courses = [] //initialize the input array 
        if(user.courses.length ==0) //if user has no courses, populate 1 empty to field to allow adding of courses
            $scope.courses.courses.push({}) //pushes the blank value
        $scope.numofFields = user.courses.length //we specify number of fields to know how many objects to push to input
         for(let i = 0; i < user.courses.length; i++){ //for each course the user has, push to input to create input = user course length
            $scope.courses.courses.push({}) //push blank first
            $scope.courses[i] = user.courses[i] //then assign value
         }
    }
    //function that will transfer the data in each input field to the user's course list 
   $scope.updateCourses = function(user){
        user.courses=[] //clear user courses 
         for(let i = 0; i < $scope.courses.courses.length; i++){
             user.courses[i]=$scope.courses[i] //for each item in input, add to users courses
         }
         return user
    }
    
    //called on button click to push a new empty field and iterate the number for tracking 
    $scope.addField = function(){
        $scope.numOfFields++
        $scope.courses.courses.push({})
    }
    
    //same as above, sets value to be blank and removes value from input 
    $scope.removeField = function(index){
    $scope.numOfFields--
    $scope.courses[index]=""
    $scope.courses.courses.splice(index, 1)

    }
    
    //UX function that allows on-demand clearing of input fields 
    $scope.clearOptions = function(){
      $scope.courses = {courses: [{course: ''}]}
      $scope.user = null
      $scope.validationError = null
      $scope.existingUser = false
    }
    //printing helper 
    $scope.arrayToString = function(string){
        return string.join(", ");
    };
    

}