var express = require('express');
var app = express();

app.use(express.static(__dirname + '/www'));

app.get('/', function(request, response) {
  response.sendfile('index.html', {root: __dirname + '/www'});
});

var server = app.listen(process.env.PORT || 5000);