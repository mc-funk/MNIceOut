var express = require('express');
var router = express.Router();

var queryYear = "";

router.get('/', function(req, res, next) {
        queryYear = req.query.q || 0;
        console.log("/iceout called");
        if (queryYear.toString().length == 4) {
            queryYear = "?year=" + year + "&callback=getIceOut"
        } else {
            queryYear = "?callback=getIceOut"
        }
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                url: "http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1" + queryYear,
                complete: function() {
                    console.log("Ajax call complete");
                },
                success: function(data) {
                    processData(data);
                },
                error: function(xhr, status) {
                    console.log("Error : ", xhr, " ", status);
                }
            });


        //http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1?year={integer}&callback={string}

    });
function getIceOut() {
    console.log("Callback function called")
}

function processData(data) {
    console.log("processData data: ", data)
}

module.exports = router;