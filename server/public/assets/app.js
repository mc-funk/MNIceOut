/**
 * Created by gamezorz on 5/26/15.
 */
//Leaflet code
var map = L.map('map').setView([51.505, -0.09], 13);

//L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//    maxZoom: 18,
//    id: 'mc-funk.f3871617',
//    accessToken: 'pk.eyJ1IjoibWMtZnVuayIsImEiOiJlMmVmNGU4YjI4ZDA5OTlmY2Y0N2Q1ODgwZGY3YjdiYSJ9.4oC-L5IUabXNY0wYIDI5UQ'
//}).addTo(map);


var queryYear = 0;
var query="";
var lakeData = {};
var numLakes = 0;
var i = 0;

//TODO: ensure correct timespan
$(document).ready(function() {
    $("#getData").on("click", function() {
        console.log("getData click worked");
        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            jsonpCallback: 'getIceOut',
            crossDomain: true,
            url: 'http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/?callback=getIceOut',
            success: function (data, textStatus, jqXHR) {
                //process lake-level data
                processLakeData(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            },
            complete: function (jqXHR, textStatus) {
                console.log("getData() Ajax Get Complete:", textStatus);
                yearLoop();
            }
        });
    });
});

function getIceOut() {
    console.log("Callback function called")
}

function processLakeData(medianData) {
    /*Takes in and parses data returned from API query with no year specified, which returns median data.*/
    console.log("Median data: ", medianData);
    var thisLake;
    var lakeName = 0;
    lakeData = {};
    numLakes = 0;

    /*Loop through array of lake data.
     //ord lake-level data that is repeated in every entry for a given lake.*/
    for (i = 0; i < medianData.results.length; i++) {
        /*console.log("For loop entered");*/
        thisLake = medianData.results[i];
        lakeName = thisLake["name"];
        /*console.log("lakeName: ", lakeName);*/
        lakeData[lakeName] = {
            name: lakeName,
            firstYear: thisLake["ice_out_first_year"],
            lastYear: thisLake["ice_out_last_year"],
            allYears: [],
            entries: thisLake["ice_out_number_of_entries"],
            lat: thisLake["lat"],
            lon: thisLake["lon"],
            sentinel: thisLake["sentinel_lake"],
            median: thisLake["ice_out_median_since_1950"],
            lakeId: thisLake["id"]
        };
        numLakes++;
    }
    console.log("lake data: ", lakeData);
    console.log("There are " + numLakes + " lakes")
}

function yearLoop() {
    var j;
    var startYear = 1850;
    var endYear = 1855;
    for (j = startYear; j <= endYear; j++) {
        (function(q){
            setTimeout(function(){
                var loopQuery = "?year=" + q + "&callback=getIceOut";
                console.log("yearLoop active for " + q);
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonpCallback: 'getIceOut',
                    crossDomain: true,
                    url: 'http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/' + loopQuery,
                    success: function (data, textStatus, jqXHR) {
                        //clearData();
                        console.log("success achieved for: " + q);
                        console.log("in success: ", data);
                        //process year-level data for that year
                        processYearData(data, q);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    },
                    complete: function (jqXHR, textStatus) {
                        console.log("getData() Ajax Get Complete for year " + q + ":", textStatus);
                    }
                });

            }, (1000 * (q - startYear)))
        })(j);
    }
}

function getYearData(thisQuery, thisYear) {
    console.log("getYearData called for ", thisQuery, " ", thisYear);
}

function processYearData(yearData, year) {
    console.log("yearData: ", yearData);
    errorCheck = yearData["status"];
    if (errorCheck != "ERROR") {
        console.log("yearData processed for year " + year + "; " + yearData.length + " lakes processed");
        for (i = 0; i < yearData.results.length; i++) {
            /*console.log("For loop entered");*/
            thisLake = yearData.results[i];
            lakeName = thisLake["name"];
            thisIceOut = thisLake["ice_out_date"];
            /*console.log("lakeName: ", lakeName);*/
            lakeData[lakeName]["allYears"].append([year, thisIceOut]);
        }
        console.log("Lake data after year: ", lakeData);
    }
}
