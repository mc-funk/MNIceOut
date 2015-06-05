/**
 * Created by gamezorz on 5/26/15.
 */
var myApp = angular.module('myApp',['smart-table']);
var map = L.map('map').setView([46.0, -94.0], 6);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mc-funk.f3871617',
    accessToken: 'pk.eyJ1IjoibWMtZnVuayIsImEiOiJlMmVmNGU4YjI4ZDA5OTlmY2Y0N2Q1ODgwZGY3YjdiYSJ9.4oC-L5IUabXNY0wYIDI5UQ'
}).addTo(map);

//var queryYear = 0;
//var query="";
/*$(document).ready(function() {
    $("#getData").on("click", function() {
        $http.get('/cats').then(function (response) {
            if (response.status !== 200) {
                throw new Error('Failed to fetch cats from the API');
            }
            $scope.rowCollection = response.data;
            return response.data;
        });
    });
});*/
/*//TODO: ensure correct timespan*/
myApp.controller('basicsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.rowCollection =[];

    function getLakes() {
        console.log("GetLakes called");
        return $http.get('/iceout').success(function(data, status){
            console.log("http callback called");
            if(status !== 200) {
                throw new Error('Failed to fetch lakes from the API');
            }
            console.log(data);
            $scope.rowCollection = data;
            return data;
        });
    }

    getLakes();
}]);

//Helper function created solely to track down inconsistencies in API data (takes in first_date)
// function processYear(array) {
//    sortedArray = array.sort();
//    console.log("sorted array: " + sortedArray);
//}