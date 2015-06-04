/**
 * Created by gamezorz on 5/26/15.
 */
//Leaflet code
//var map = L.map('map').setView([51.505, -0.09], 13);
//
//L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//    maxZoom: 18,
//    id: 'mc-funk.f3871617',
//    accessToken: 'pk.eyJ1IjoibWMtZnVuayIsImEiOiJlMmVmNGU4YjI4ZDA5OTlmY2Y0N2Q1ODgwZGY3YjdiYSJ9.4oC-L5IUabXNY0wYIDI5UQ'
//}).addTo(map);


//var queryYear = 0;
//var query="";
var lakeData = {}, numLakes = 0, thisLake, lakeName = 0, i = 0, dQualArray = [],
    earliestYear = [], numEntries = [], dectiles = [], medianDifferences = [];
//Initialize to stat and end dates for analysis
var startYear = 1850, endYear = 1855;

//TODO: ensure correct timespan
$(document).ready(function() {
    $("#getData").on("click", function() {
        /*console.log("getData click worked");*/
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
                /*console.log("getData() Ajax Get Complete:", textStatus);*/
                yearLoop();
            }
        });
    });
});

function getIceOut() {
    /*console.log("Callback function called")*/
}

function processLakeData(medianData) {
    /*Takes in and parses data returned from API query with no year specified, which returns median data.*/
    /*console.log("Median data: ", medianData);*/
    lakeData = {};
    numLakes = 0;

    /*Loop through array of lake data.
     Record lake-level data that is repeated in every entry for a given lake.*/
    for (i = 0; i < medianData.results.length; i++) {
        /*console.log("For loop entered");*/
        thisLake = medianData.results[i];
        lakeName = thisLake["name"];
        var dataQuality = getDataQuality(thisLake);
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
            lakeId: thisLake["id"],
            dQuality: dataQuality
        };
        numLakes++;
        dQualArray.push(dataQuality);
        //earliestYear.push(thisLake["ice_out_first_year"]);
        //numEntries.push(thisLake["ice_out_number_of_entries"]);
    }
    dectiles = calcDectiles(dQualArray);
    /*console.log("dectiles after calc: " + dectiles);*/
    //processYear(earliestYear);
    for (var k = 0; k < medianData.results.length; k++) {
        /*console.log("Loop entered at: " + k);*/
        thisLake = medianData.results[k];
        lakeName = thisLake["name"];
        /*console.log("lakeData[lakeName][dQuality]" + lakeData[lakeName]["dQuality"]);*/
        lakeData[lakeName]["dectile"] = getDectile(lakeData[lakeName]["dQuality"]);
    }
    //processDataQuartiles(numEntries);
    /*console.log("lake data: ", lakeData);
    console.log("There are " + numLakes + " lakes");*/
}

function yearLoop() {
    var j;
    for (j = startYear; j <= endYear; j++) {
        (function(q){
            setTimeout(function(){
                var loopQuery = "?year=" + q + "&callback=getIceOut";
                //console.log("yearLoop active for " + q);
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonpCallback: 'getIceOut',
                    crossDomain: true,
                    url: 'http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1/' + loopQuery,
                    success: function (data, textStatus, jqXHR) {
                        //clearData();
                       /* console.log("success achieved for: " + q);*/
                        //console.log("in success: ", data);
                        //process year-level data for that year
                        processYearData(data, q);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    },
                    complete: function (jqXHR, textStatus) {
                        if (q == endYear) {
                            console.log("Lake data after year: ", lakeData);
                            console.log("Median data array: ", medianDifferences.sort(sortNumber))
                        }
                    }
                });
            }, (1000 * (q - startYear)))
        })(j);
    }
}

//function getYearData(thisQuery, thisYear) {
//    console.log("getYearData called for ", thisQuery, " ", thisYear);
//}

function processYearData(yearData, year) {
    //console.log("yearData: ", yearData);
    var errorCheck = yearData["status"];
    if (errorCheck != "ERROR") {
        console.log("yearData processed for year " + year + "; " + yearData.results.length + " lakes processed");
        for (i = 0; i < yearData.results.length; i++) {
            thisLake = yearData.results[i];
            lakeName = thisLake["name"];
            thisIceOut = thisLake["ice_out_date"];
            thisMedian = thisLake[""];
            medianDiff = getMedianDiff(thisIceOut, thisLake["ice_out_median_since_1950"]);
            medianDifferences.push(medianDiff);
            lakeData[lakeName]["allYears"].push([year, thisIceOut, medianDiff]);
            writeToDb(thisLake, year);
        }
    }
}

function writeToDb (thisLake, year) {
    var lake;
    var iceOutDate;
    var iceOutMedian;
    var medianDiff;
    var dQuartile;

    lake = thisLake["name"];
    iceOutDate = thisLake["ice_out_date"];
    iceOutMedian = thisLake["ice_out_median_since_1950"];
    //console.log("IceOutMedian: ", iceOutMedian);
    //medianDiff = getMedianDiff(iceOutDate, iceOutMedian);
    //dQuartile = getDectile(lakeData[lakeName]["dQuality"]);

   /* console.log("Lake: " + lake + " Year: " + year + " IceOutDate: " + iceOutDate + " IceOutMedian: " + iceOutMedian + " MedianDiff: " + medianDiff + " dQuartile: " + dQuartile);*/
}

function getMedianDiff(iceOutDate, iceOutMedian) {
    var month = iceOutDate.slice(5, 7);
    var day = iceOutDate.slice(8);
    //console.log("month, day: " + month + " " + day);

    var medianMonth = iceOutMedian.slice(5, 7);
    var medianDay = iceOutMedian.slice(8);
    //console.log("Median month, day: " + medianMonth + " " + medianDay);

    var calcIce = "2015-" + month + "-" + day;
    var calcMedian = "2015-" + medianMonth + "-" + medianDay;

    var dateDiff = Date.parse(calcIce) - Date.parse(calcMedian);
    var dateDiv = dateDiff/86400000/365;

    /*console.log("Median Diff %: " + precise_round((dateDiv * 100),1)+ "%");*/
    return precise_round((dateDiv * 100),1);

    //console.log(parsedIceOut - parsedMedian);
    //console.log((parsedIceOut - parsedMedian)/parsedMedian);
    //return precise_round((((parsedIceOut - parsedMedian)/parsedMedian) * 100),1);
}
//TODO: ensure endYear-startYear is used
function getDataQuality(thisLake) {
    var possibleYears = 172; //endYear - startYear;
    var entries = thisLake["ice_out_number_of_entries"];
    //console.log(precise_round(((entries / possibleYears) * 100),1));
    return precise_round(((entries / possibleYears) * 100),1);
}

function calcDectiles(array) {
    sortedArray = array.sort(sortNumber);
    /*console.log("sorted array: " + sortedArray);*/
    var dectile = sortedArray.length/10;
    return [array[dectile], array[dectile*2], array[dectile*3], array[dectile*4], array[dectile*5], array[dectile*6], array[dectile*7], array[dectile*8], array[dectile*9], 100];
}

function getDectile(dQuality) {
    for (var l=0; l < dectiles.length + 1; l++) {
        /*console.log("dquality: " + dQuality);*/
        if (dQuality < dectiles[l]) {
            /*console.log("Dectile calculated: " + (l+1) +  "with dquality " + lakeData[lakeName]["dQuality"]);*/
            return l + 1;
        }
    }
}

//Round based on number and desired number of decimals to round to
//From: http://stackoverflow.com/questions/1726630/javascript-formatting-number-with-exactly-two-decimals
function precise_round(num,decimals){
    return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
}

//Facilitate numerical instead of alpha array.sort(): http://stackoverflow.com/questions/1063007/arr-sort-does-not-sort-integers-correctly
function sortNumber(a,b) {return a - b; }

//Helper function created solely to track down inconsistencies in API data (takes in first_date)
// function processYear(array) {
//    sortedArray = array.sort();
//    console.log("sorted array: " + sortedArray);
//}