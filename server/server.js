var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
 
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
 

app.get('/checkname/:name', function(req, res){
 
    //////////
    var list = []
    var request = require("request")
    var url = "https://api.opensensemap.org/statistics/descriptive?boxid=593bcd656ccf3b0011791f5a&&phenomenon=Temperatur&from-date=2018-12-10T00:01:01.930Z&to-date=2019-01-14T22:59:59.930Z&download=true&format=json&window=3600000&operation=arithmeticMean"
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            //console.log(response) // Print the json response
            //console.log(typeof response)
            //console.log(body)
            let {PythonShell} = require('python-shell')
            var pyshell = new PythonShell('forecast.py');

            pyshell.send(JSON.stringify(body));
            //pyshell.send(JSON.stringify([1,2,3,4,5]));

            pyshell.on('message', function (message) {
                list.push(message.substr(11,15))
            });
            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err){
                    throw err;
                };
                res.json(list);
            });
        }
    })
});
 
app.listen(process.env.PORT || 8080);