const app = require('express')();
const server = app.listen(3000, function(){
  console.log('listening webapi on *:3000');
});

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));