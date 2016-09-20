var config = require('config');
var debug = require('debug')('routes');

module.exports  = function(request,response,next) {
  var query = "";
  request.sparqlQuery = {};

  if (request.body && request.body.query) {
    debug("Request JSON body: " + JSON.stringify(request.body));
          if (request.body.query.length > config.get('app.maxQueryLength')) {
            response.status(413)
            .send("Query text over " + config.get('app.maxQueryLength') + " bytes is not allowed.\n")
          } else {
                request.sparqlQuery = request.body;
                next();
          } //end of else
  } else if (request.query.query) {
          query = request.query.query;
          if (query.length > config.get('app.maxQueryLength')) {
            response.status(413)
            .send("Query text over " + config.get('app.maxQueryLength') + " bytes is not allowed.\n")
          } else {
                request.sparqlQuery = request.query;
                next();
          } //end of else
  }
  else {
    var message = "You must pass your SPARQL query either as a JSON object, with 'Content-Type: application/json' header:\n\n"
    + "Example: {\"query\": \"select * where {?s ?p ?o} limit 10\", \"endpoint\":\"http://somedomain.net/sparql\"}\n\n"
    + "or as URL encoded parameters:\n\n"
    + "Example: " + siteRootUrl + request.path + "?query=" + encodeURIComponent("?select * where {?s ?p ?o} limit 10")
    + "&endpoint=" + encodeURIComponent("http://somedomain.net/sparql") + "\n\n"
    + "In any case, if no endpoint URL is provided, the default endpoint will be used.";
    response.status(400)
    .send(message)
  }
}
