# SPARQL router [0.3.0](https://github.com/ColinMaudry/sparql-router/issues?utf8=%E2%9C%93&q=is%3Aissue+milestone%3A0.3.0+)

#### A NodeJS/Express application to serve canned SPARQL queries to the world.

| [master](https://github.com/ColinMaudry/sparql-router) ([**demo**](https://queery.link/api))|  [develop](https://github.com/ColinMaudry/sparql-router/tree/develop) ([**demo**](https://sparql-router.herokuapp.com/api))|
| ------------- | ------------- |
| [![Build Status](https://travis-ci.org/ColinMaudry/sparql-router.svg?branch=master)](https://travis-ci.org/ColinMaudry/sparql-router)  [![Coverage Status](https://coveralls.io/repos/github/ColinMaudry/sparql-router/badge.svg?branch=master)](https://coveralls.io/github/ColinMaudry/sparql-router?branch=master) | [![Build Status](https://travis-ci.org/ColinMaudry/sparql-router.svg?branch=develop)](https://travis-ci.org/ColinMaudry/sparql-router)   [![Coverage Status](https://coveralls.io/repos/github/ColinMaudry/sparql-router/badge.svg?branch=develop)](https://coveralls.io/github/ColinMaudry/sparql-router?branch=develop) |


## Description

[SPARQL](https://en.wikipedia.org/wiki/SPARQL) is the query language to retrieve data from RDF triple stores. I often had the issue that fellow developers or data fanatics asked for data that was in a triple store, but they don't know SPARQL.

This server application solves the issue:

1. You write the query and gives it a name (e.g. `biggest-asian-cities`)
2. You save it under /tables, /graphs or /update, depending on the query type (SELECT, CONSTRUCT, DESCRIBE, SPARQL Update)
3. You give the URL to your fellow developer, picking the right format for their usage:
	- `http:/yourhost/api/tables/biggest-asian-cities.csv` for manipulations as a spreadsheet
	- `http:/yourhost/api/tables/biggest-asian-cities.json` as input for a Web app
	- `http:/yourhost/api/tables/biggest-asian-cities.xml` if they are into XML
4. They get fresh updated results from the store every time they hit the URL!

![Create a query](https://www.lucidchart.com/publicSegments/view/0ea72916-0669-4b70-b388-dae7973c51b6/image.png)

![Get query results](https://www.lucidchart.com/publicSegments/view/7a81dea2-5876-49b1-b6fe-4d9771da152a/image.png)

## Features

- Exposes SPARQL queries as simple URLs, with choice of result format
- A canned query is a simple file located in `/public/api/tables`, `/public/api/graphs` or `/public/api/ask` depending on the query type (SELECT, CONSTRUCT, DESCRIBE, SPARQL Update)
- Beside using FTP and SSH, you can POST a new canned query to `/api/tables/{query-name}`, `/api/graphs/{query-name}` or `/api/ask/{query-name}`
- For more query reuse, possibility to populate variable values in the query by passing parameters
- Supports content negotiation (via the `Accept` HTTP header)
- Possibility to GET or POST a SPARQL query on `/api/sparql` and get the results, without saving it

[A screenshot of the tests as overview of the features](test/tests.png).

[Configuration](https://github.com/ColinMaudry/sparql-router/wiki/Configuring-SPARQL-router) and [detailed usage documentation](https://github.com/ColinMaudry/sparql-router/wiki/Using-SPARQL-router)

**[Upcoming features](https://github.com/ColinMaudry/sparql-router/issues?q=is%3Aissue+is%3Aopen+-label%3Abug)**

**[Known issues](https://github.com/ColinMaudry/sparql-router/issues?q=is%3Aissue+is%3Aopen+label%3Abug)**

Now it's still jut a useful middleman between your RDF data and your data consumers, but the objective is to develop an open platform to share SPARQL queries on any endpoint. With [a nice UI](https://github.com/ColinMaudry/sparql-router-ui).

## Demo

- Master/stable: http://queery.link/api
- Develop/test: https://sparql-router.herokuapp.com/api

## Requirements

- [NodeJS (4.x, 5.x, 6.x) and NPM](https://nodejs.org/en/download/stable/) must be installed. They are also available in most Linux package managers as `nodejs` and `npm`.
- An RDF triple store that supports SPARQL 1.1 and JSON-LD output.

## Installation

```bash
git clone https://github.com/ColinMaudry/sparql-router.git --depth=1
cd sparql-router
npm install --production
```

SPARQL router is also available as an [NPM package](https://www.npmjs.com/package/sparql-router).

## Configuration

[On the wiki](https://github.com/ColinMaudry/sparql-router/wiki/Configuring-SPARQL-router).

### Test

I haven't found a proper way to mock a triple store for testing purposes. I consequently use a remote triple store. That means the tests only work if the machine has Internet access.

The configuration used for the tests is stored in `config/test.json`.

To run the tests:

```bash
npm test
```

[Overview of the tests](test/tests.png).

Tests rely on [mocha](http://mochajs.org/) and
[supertest](https://www.npmjs.com/package/supertest).

## Start it

Using `config/default.json` configuration file:

```
npm start
```

Using `config/myconfig.json` configuration file:

```
NODE_ENV=myconfig npm start
```

Start in debug mode:

```
DEBUG=functions,routes npm start
```

### Resilient deployment

If you want the app to restart automatically after fatal errors, I suggest you use [forever](https://github.com/foreverjs/forever).

When forever is installed globally, run the following command in the `sparql-router` folder:

```bash
forever bin/www
```

## Use it

See this wiki page for detailed instructions: [Using SPARQL router](https://github.com/ColinMaudry/sparql-router/wiki/Using-SPARQL-router)

The API documentation can be found [here](https://sparql-router.herokuapp.com/api) (development version). If you're running the app, at `/api`.

### Actions that require authentication

The actions that are not read-only on the canned queries or the data require [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).

- HTTP POST to create or update a query
- HTTP DELETE to delete a query

## Similar software

If SPARQL router doesn't match your requirements, you can have a look at these solutions:

- [The Datatank](https://github.com/tdt/) (PHP5) "The DataTank is open source software, which you can use to transform any dataset into an HTTP API."
- [BASIL](https://github.com/the-open-university/basil) (Java) " BASIL is designed as middleware system that mediates between SPARQL endpoints and applications. With BASIL you can build Web APIs on top of SPARQL endpoints."

## Change log

#### 0.3.0

- An arbitrary endpoint can be passed with canned queries (upon creation or update) and with passthrough queries
- Metadata (name, author) can be passed with canned queries (new and updates) and with passthrough queries. Creation and modification dates are added automatically
- The system endpoint stores the canned queries metadata
- The default endpoint is the endpoint that is used if no endpoint is provided by the client
- Added support for ASK queries on `/api/ask`
- Started work on UI, using VueJS (just wireframes for now)
- Updated the [API documentation](http://queery.link/api) accordingly

##### 0.2.2

- Added extra info upon app startup (used config, endpoint, app URL, etc.)
- App authentication can be disabled in configuration
- README mentions the Datatank and BASIL alternatives
- Added an `npm start` command for commodity

##### 0.2.1

- Improved installation instructions
- Added pictures to explain how this thing works
- Improved information about the demo

#### 0.2.0

- Support for SPARQL Update queries (requires authentication)
- Possibility to populate query variable values via URL parameters! ([#10](https://github.com/ColinMaudry/sparql-router/issues/10))
- Queries created and updated via HTTP POST are tested before creation/update
- Possibility to setup user:password for the configured endpoint (Basic authentication)
- The URL of the query is returned when creating or updating a query
- Tested on Fuseki 2.x, [Dydra](http://dydra.com), [Stardog 4.0.5](http://stardog.com/), [OpenLink Virtuoso (LOD cache)](http://lod.openlinksw.com/sparql)
- More useful error messages
- Applied NodeJS security best practices (with [helmet](https://www.npmjs.com/package/helmet))

#### 0.1.0

- Enabled canned queries
- Extension (.csv, .xml, etc.) defines the format returned by the endpoint
- Passthrough queries via `/sparql`
- Create new canned queries by HTTP POST, SSH or FTP
- Basic auth for POST and DELETE
- API doc written in Swagger
- Support for HTTPS endpoints
- CORS support

## License

MIT license

If you use it, I'd really appreciate a public statements such as [a tweet](https://twitter.com/intent/tweet?text=Wow%2C%20thanks%20%40CMaudry%20for%20making%20SPARQL%20router!%20https%3A%2F%2Fgithub.com%2FColinMaudry%2Fsparql-router%20%23SPARQL)!
