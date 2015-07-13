/**
 * Created by gamezorz on 5/26/15.
 */
var map = L.map('map').setView([46.0, -94.0], 6);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mc-funk.f3871617',
    accessToken: 'pk.eyJ1IjoibWMtZnVuayIsImEiOiJlMmVmNGU4YjI4ZDA5OTlmY2Y0N2Q1ODgwZGY3YjdiYSJ9.4oC-L5IUabXNY0wYIDI5UQ'
}).addTo(map);

function callback(data) {
    console.log("Yup, callback data: ", data);
}
var myApp = angular.module('myApp',['ngRoute', 'ngResource', 'smart-table']);

myApp.factory("LakeData", function($resource) {
    return $resource (
        'http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/',
        {callback: 'JSON_CALLBACK'},
        {get: {method: 'JSONP'}}
    );
});

myApp.factory("YearData", function($resource) {
    return {
        year: function(queryYear) {
            return $resource(
                'http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/',
                {q: queryYear},
                {callback: 'JSON_CALLBACK'},
                {get: {method: 'JSONP'}}
            );
        }
    };
});


myApp.controller('safeCtrl', [LakeData, YearData, $scope, function (LakeData, YearData, $scope) {
    var retrieveLakeData = function($scope) {
        $scope.lakeData = LakeData();
        console.log("lakeData: ", $scope.lakeData);
    };

    var retrieveYearData = function($scope) {
        $scope.yearData = YearData.year($scope.yearSearched);
        console.log("yearData: ", $scope.yearData);
    };

    $scope.yearSearched = 1873;

    retrieveLakeData();
    retrieveYearData();

   /* $scope.dnr = $resource('http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/', {callback:'callback'}, {get:{method:'JSONP'}});
    console.log($scope.dnr.get());
    $scope.dnrResults = $scope.dnr.get();
    $scope.dnrResults.$promise.then(function(data) {
        console.log("after promise data:", data);
        $scope.testData = data.results[0];
    }, function(err) {
        console.log("Something went wrong with the .get STILL");
    });
    $scope.yearResults = $scope.dnr.get({q: $scope.yearSearched});
    console.log($scope.yearResults);
    $scope.testfunc = function(results) {
        $scope.dnrResults = results;
        console.log("scope dnrResults: ", $scope.dnrResults);
        $scope.testData = results.results[0];
        console.log("results[0]: ", $scope.testData);
    }*/
}]);
