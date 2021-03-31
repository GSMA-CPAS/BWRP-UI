'use strict';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require(global.GLOBAL_ROOT + '/swagger.json');
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + '/services/AbstractService');
const cheerio = require('cheerio');

class SwaggerService extends AbstractService {
  constructor(serviceName, serviceConfig, app, database) {
    super(serviceName, serviceConfig, app, database);
    this.registerRequestHandler();
  }

  registerRequestHandler() {
    const options = {
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        requestInterceptor: (req) => {
          const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
          if (csrfTokenElement) {
            const csrfToken = csrfTokenElement.getAttribute('content');
            if (csrfToken) {
              req.headers['x-csrf-token'] = csrfToken;
            }
          }
          return req;
        }
      }
    };
    this.getRouter().use('/', swaggerUi.serve);
    this.getRouter().get('/', (req, res) => {
      const html = swaggerUi.generateHTML(swaggerDocument, options);
      if (req.csrfToken) {
        const $ = cheerio.load(html);
        $('head').append('<meta name="csrf-token" content="' + req.csrfToken() + '">');
        res.send($.html());
      } else {
        res.send(html);
      }
    });
  }
}

module.exports = SwaggerService;
