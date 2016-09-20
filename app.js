var expose = require('express-expose');
var passport = require('passport');
var cors = require('express-cors');
var express = require('express');
var config = require('config');
var helmet = require('helmet');
var debug = require('debug')('routes');
var fs = require('fs');
var app = express();

var apiDoc = require('./lib/routes/apiDoc');
var sparql = require('./lib/routes/sparql');
var cannedQueries = require('./lib/routes/cannedQueries');


//My functions
var functions = require('./lib/functions');

/*
MIT License (MIT)

Copyright (c) 2016 Colin Maudry (http://colin.maudry.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

//Update API documentation configuration
var apiConfigFile = "./public/api/swagger.json";
var apiConfig = require(apiConfigFile);
var publicAppConfig = config.get('app.public');
apiConfig.host = publicAppConfig.hostname + functions.getPort(publicAppConfig);
apiConfig.schemes = [];
apiConfig.schemes.push(publicAppConfig.scheme);
fs.writeFile(apiConfigFile, JSON.stringify(apiConfig, null, 4), function (err) {
  if (err) return console.log(err);
  debug('Writing API configuration to ' + apiConfigFile);
});

//Update Hydra context with actual URL
var hydraContextFile = "./public/api/hydra.jsonld";
siteRootUrl = functions.getSiteRootUrl();
fs.readFile(hydraContextFile,'utf8', function (err, data) {
  if (err) {throw err} else {
    var hydraContext = JSON.parse(data);
    hydraContext["@base"] = siteRootUrl + "/api/hydra.jsonld#";
    hydraContext["@id"] = siteRootUrl + "/api/hydra.jsonld";
    fs.writeFile(hydraContextFile, JSON.stringify(hydraContext, null, 4), function (err) {
      if (err) return console.log(err);
      debug('Writing Hydra context to ' + hydraContextFile);
    });
  };
});

// System endpoint
var systemEndpointConfig = config.get('endpoints.system');
var defaultEndpointConfig = config.get('endpoints.default');
var systemEndpointPort = functions.getPort(systemEndpointConfig);
var defaultEndpointPort = functions.getPort(defaultEndpointConfig);

systemEndpointUpdate = systemEndpointConfig.scheme + "://" + systemEndpointConfig.hostname + systemEndpointPort + systemEndpointConfig.updatePath;
systemEndpointQuery = systemEndpointConfig.scheme + "://" + systemEndpointConfig.hostname + systemEndpointPort + systemEndpointConfig.queryPath ;
defaultEndpointUpdate = defaultEndpointConfig.scheme + "://" + defaultEndpointConfig.hostname + defaultEndpointPort + defaultEndpointConfig.updatePath ;
defaultEndpointQuery = defaultEndpointConfig.scheme + "://" + defaultEndpointConfig.hostname + defaultEndpointPort + defaultEndpointConfig.queryPath ;

app.set('case sensitive routing', false);
app.set('strict routing', false);
app.set('views', './lib/views');
app.set('view engine', 'pug');
app = expose(app);

//Mapping content-types with file extensions
express.static.mime.define({'application/sparql-query': ['rq']});
express.static.mime.define({'application/sparql-update': ['ru']});
express.static.mime.define({'application/ld+json': ['jsonld']});

//Security
app.use(helmet());

app.get('/', function(request,response) {
  debug(request.url + " .get");
	// response.expose('var siteRootUrl = "' + siteRootUrl + '";');
	// response.render('index', { layout: false });
  response.redirect(307,'/api');
});

app.use(function(req, res, next) {
	//CORS support
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	//Set app root directory
	req.appRoot = __dirname;

  next();
});

app.param('type', function (req, res, next, type) {
	req.savedparams = {};
  req.savedparams.type = type;
  next();
});

app.use('/api', apiDoc);
app.use('/api/:type(tables|graphs|ask|update)', cannedQueries);
app.use('/api/:sparql(sparql|query)', sparql);
app.use(express.static('public'));
app.use(function(err, req, res, next) {
  debug(req.url + " Mayday!")
  console.error(err.stack);
  res.status(500).send('Something broke! Please contact the developer.');
});

module.exports = app;
