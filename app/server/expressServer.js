const http = require('http');
const fs = require('fs');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const jsYaml = require('js-yaml');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const OpenApiValidator = require('express-openapi-validator');
const logger = require('./logger');
const config = require('./config');

const routes = require('./routes/plans');
const connect = require('./services/database');

class ExpressServer {
  constructor(port, openApiYaml) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;
    try {
      this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
    } catch (e) {
      logger.error('failed to start Express Server', e.message);
    }
    this.setupMiddleware();
    // setup router
    this.app.use(`/api/v1`, routes)
  }

  setupMiddleware() {
    // this.setupAllowedMedia();
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '14MB' }));
    this.app.use(express.json());
    this.app.use(express.text());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    //Simple test to see that the server is up and responding
    // this.app.get('/hello', (req, res) => res.send(`Hello World. path: ${this.openApiPath}`));
    //Send the openapi document *AS GENERATED BY THE GENERATOR*
    this.app.get('/openapi', (req, res) => res.sendFile((path.join(__dirname, 'api', 'openapi.yaml'))));
    //View the openapi document in a visual interface. Should be able to test from this page
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));

    // // OpenApiValidator middleware
    // this.app.use(
    //   OpenApiValidator.middleware({
    //     apiSpec: this.openApiPath,
    //     validateResponses: true,
    //     // operationHandlers: path.join(__dirname),
    //   }),
    // );
  }

  launch() {
      // // eslint-disable-next-line no-unused-vars
      // this.app.use((err, req, res, next) => {
      //   // format errors
      //   res.status(err.status || 500).json({
      //     message: err.message || err,
      //     errors: err.errors || '',
      //   });
      // });

      console.log("Connecting....")
      try {
        connect().then(() => {
          http.createServer(this.app).listen(this.port);
          console.log(`Listening on port ${this.port}`);
        });
      } catch (err) {
        console.log("DB connection failed, terminating server")
        throw err;
      }

  }


  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;