var express = require('express');
var router = express.Router();

var queryYear = "";

router.get('/', function(req, res, next) {
        queryYear = req.query.q;
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

            });

        //http://services.dnr.state.mn.us/api/climatology/ice_out_by_year/v1?year={integer}&callback={string}

    });

module.exports = router;