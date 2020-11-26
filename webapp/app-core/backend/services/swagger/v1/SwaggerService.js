'use strict';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require(global.GLOBAL_ROOT + '/swagger.json');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');

class SwaggerService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    this.getRouter().use('/', swaggerUi.serve);
    this.getRouter().get('/', swaggerUi.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
    }));
  }
}

module.exports = SwaggerService;
