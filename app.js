Parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

		
var app = angular.module('app', ['ngTouch', 'ui.grid']);

app.controller('MainCtrl', ['$scope', function ($scope) {
		    var signupQuery = new Parse.Query("Signup");   
			signupQuery.select("name", "job_title", "point_value", "cash_value", "meal_ticket", "display_order");
			signupQuery.ascending("display_order");
				var results = new Array();
        signupQuery.find({
            success: function (signupResults) {
                for (var index = 0; index < signupResults.length; index++) {
                    
					var objectTxt = JSON.stringify(signupResults[index]);
					var signup = JSON.parse(objectTxt);
                    results.push(signup);
                }
            }
        });
$scope.myData = results;
/*		
  $scope.myData = [
    {
        "firstName": "Cox",
        "lastName": "Carney",
        "company": "Enormo",
        "employed": true
    },
    {
        "firstName": "Lorraine",
        "lastName": "Wise",
        "company": "Comveyer",
        "employed": false
    },
    {
        "firstName": "Nancy",
        "lastName": "Waters",
        "company": "Fuelton",
        "employed": false
    }
];
*/
}]);
