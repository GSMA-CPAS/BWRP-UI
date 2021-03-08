'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MySQLSessionStore = require('express-mysql-session')(expressSession);
const history = require('connect-history-api-fallback');
const csrf = require('csurf');
const helmet = require('helmet');
const fs = require('fs');

const Database = require('mysqlw');
const config = require('config');
const sessionConfig = config.get('session');
const databaseConnection = config.get('database').connection;

global.GLOBAL_ROOT = path.resolve(__dirname);
global.GLOBAL_BACKEND_ROOT = path.resolve(__dirname + '/backend');

const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAuthenticated;
const ensureAdminAuthenticated = require(global.GLOBAL_BACKEND_ROOT + '/libs/middlewares').ensureAdminAuthenticated;

const logger = require(global.GLOBAL_BACKEND_ROOT + '/libs/logger')(config);
const errorHandler = require(global.GLOBAL_BACKEND_ROOT + '/libs/errorhandler');
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + '/ErrorCodes');

const app = express();

app.use(history({
  verbose: false,
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: function(context) {
        return context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/app\/.*$/,
      to: function(context) {
        return context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/proxy\/.*$/,
      to: function(context) {
        return context.parsedUrl.pathname;
      }
    }
  ]
}));

app.use(/^\/(?!proxy).*$/, express.json({limit: '10mb'}));
app.use(/^\/(?!proxy).*$/, express.urlencoded({extended: true}));

app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        imgSrc: ['\'self\'', 'data:']
      }
    })
);

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '');
app.use(express.static(path.join(__dirname, '/dist')));

const csrfProtection = csrf({cookie: true});
app.use(cookieParser());

if (app.get('env') !== 'production') {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', ['POST', 'PUT', 'GET', 'DELETE']);
    next();
  });
}

const sessionStore = new MySQLSessionStore({
  host: databaseConnection.host,
  port: databaseConnection.port,
  user: databaseConnection.user,
  password: databaseConnection.password,
  database: databaseConnection.database,
  checkExpirationInterval: sessionConfig.checkExpirationInterval,
  expiration: sessionConfig.timeout
});

app.use(expressSession({
  secret: sessionConfig.secret,
  name: sessionConfig.name,
  store: sessionStore,
  resave: sessionConfig.resave,
  saveUninitialized: sessionConfig.saveUninitialized,
  rolling: sessionConfig.rolling,
  cookie: sessionConfig.cookie
}));

if (sessionConfig.cookie.secure === true) {
  app.set('trust proxy', 1); // trust first proxy
} else {
  if (app.get('env') === 'production' && sessionConfig.cookie.secure === false) {
    logger.warn('*******************************************************');
    logger.warn('* WARNING - using insecure cookies in production mode *');
    logger.warn('*******************************************************');
  }
}

(async function() {
  const database = new Database(config.get('database'));
  const services = config.get('services');

  // LOAD SERVICES

  for (const serviceName in services) {
    if (Object.prototype.hasOwnProperty.call(services, serviceName)) {
      const serviceConfig = config.get('services.' + serviceName);
      if (serviceConfig.enabled === true) {
        const serviceClassPath = global.GLOBAL_BACKEND_ROOT + '/services' + serviceConfig.classPath;
        try {
          fs.statSync(serviceClassPath + '.js');
          const ServiceClass = require(serviceClassPath);
          const appService = await new ServiceClass(serviceName, serviceConfig, app, database);
          if (serviceConfig.route) {
            let csrfProtectionEnabled = serviceConfig.csrfProtectionEnabled;
            if (csrfProtectionEnabled === undefined) {
              csrfProtectionEnabled = true;
            }
            /* if (csrfProtectionEnabled) { // TODO
                app.use(serviceConfig.route, csrfProtection, (req, res, next) => {
                    app.locals.csrfToken = req.csrfToken();
                    next();
                });
            }*/
            if (csrfProtectionEnabled) {
              app.use(serviceConfig.route, csrfProtection, appService.getRouter());
            } else {
              app.use(serviceConfig.route, appService.getRouter());
            }
            logger.info('[%s] service successfully started - route <%s>, csrfProtection=%s, class path <%s>', serviceName, serviceConfig.route, csrfProtectionEnabled, serviceClassPath);
          } else {
            logger.error('[%s] failed to start service <%s> - route must be specified in config file', serviceName, serviceName);
            process.exit(1);
          }
        } catch (error) {
          logger.error('[%s] failed to start service <%s> - %s', serviceName, serviceName, error.message);
          process.exit(1);
        }
      }
    }
  }

  // LOAD APPS

  const moduleApps = config.get('apps');
  for (const moduleAppName in moduleApps) {
    if (!Object.prototype.hasOwnProperty.call(moduleApps, moduleAppName)) continue;
    const appConfig = config.get('apps.' + moduleAppName);
    if (appConfig.enabled) {
      const packageName = appConfig.packageName;
      try {
        if (typeof require(packageName).onLoad === 'function') {
          const router = new express.Router();
          await require(packageName).onLoad(app, router, database, logger, appConfig.config);
          app.use('/api/' + packageName, (appConfig.adminOnly) ? ensureAdminAuthenticated : ensureAuthenticated, router);
        }
        app.use('/app/' + packageName, express.static(path.join(__dirname, '/node_modules/' + packageName + '/dist')));
        logger.info('[%s] app successfully loaded', packageName);
      } catch (error) {
        logger.error('[%s] failed to load app - %s', packageName, error.message);
      }
    }
  }

  // ERROR HANDLING

  // 404
  /* app.use(function(req, res, next) {
      return res.json({error: '404'});
  });*/

  // 500
  app.use(function(err, req, res, next) {
    if (err) {
      if (err.code === 'EBADCSRFTOKEN') {
        // return res.status(403).json({status: 403, message: "Invalid csrf token"});
        return errorHandler(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_FORBIDDEN,
          message: 'Invalid csrf token'
        })));
      } else {
        return errorHandler(res, new Error(JSON.stringify({
          code: ErrorCodes.ERR_INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error'
        })));
      }
    } else {
      next();
    }
  });

  // HTTP SERVER

  let httpServer = app;
  httpServer = httpServer.listen(app.get('port'), app.get('host'), () => {
    logger.info('[Server] server running in mode %s - %j', app.get('env'), httpServer.address() );
  });
})();
