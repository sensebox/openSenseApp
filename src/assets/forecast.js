////to read json data 
var request = require("request")
var url = "https://api.opensensemap.org/boxes/:593bcd656ccf3b0011791f5a/data/593bcd656ccf3b0011791f5b?from-date=2018-11-10T21:43:49.575Z&to-date=2018-11-11T21:46:12.907Z&download=true&format=json"

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        //console.log(body) // Print the json response
        //console.log(typeof response)
        let {PythonShell} = require('python-shell')
        var pyshell = new PythonShell('forecast2.py');

        pyshell.send(JSON.stringify(response));

        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
        });
        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                throw err;
            };
            console.log('finished');
        });
    }
})





