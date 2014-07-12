var express = require('express');
var dustjs =  require('adaro');

var app = express();

app.engine('dust', dustjs.dust());
app.set('view engine', 'dust');
