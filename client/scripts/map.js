/**
 * Created by gamezorz on 5/26/15.
 */
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mc-funk.f3871617',
    accessToken: 'pk.eyJ1IjoibWMtZnVuayIsImEiOiJlMmVmNGU4YjI4ZDA5OTlmY2Y0N2Q1ODgwZGY3YjdiYSJ9.4oC-L5IUabXNY0wYIDI5UQ'
}).addTo(map);

var queryYear = "";

function getIceOut() {
    console.log("Callback function called")
}

function processData(rawData) {
    console.log("processData data: ", rawData)
}

$(document).ready(function() {
    $("#getData").on("click", function(){
        console.log("getData click worked");
        //TEMP VALUE: queryYear should be set by user input
        queryYear = 1843;
        if (queryYear.toString().length == 4) {
            while (queryYear < 2015) {
                queryYear = "?year=" + queryYear + "&callback=getIceOut"
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonpCallback: 'getIceOut',
                    crossDomain: true,
                    url: 'http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/' + queryYear,
                    success: function (data, textStatus, jqXHR) {
                        //clearData();
                        console.log("in success: ", data);
                        processData(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    },
                    complete: function (jqXHR, textStatus) {
                        console.log("getData() Ajax Get Complete:", textStatus);
                    }
                });
            }
        }else{
            console.log("Invaid Year Call: " + queryYear)
        }
        console.log("queryYear: ", queryYear);
        });
    });