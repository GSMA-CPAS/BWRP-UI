'use strict';

exports.init = async (app, router, database, logger, config) => {
  // curl -X GET http://localhost:3000/api/app-roaming/tadig/codes
  router.get('/tadig/codes', async (req, res) => {
    try {
      const result = await database.query('SELECT * FROM tadig_codes');
      res.json(result);
    } catch (error) {
      logger.error(
          '[app-roaming::GET/tadig/codes] failed to query tadig codes - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  //  curl -X POST http://localhost:3000/api/app-roaming/tadig/codes -d '{"code":"AEE"}' -H "Content-Type: application/json"
  router.post('/tadig/codes', async (req, res) => {
    try {
      await database.query('INSERT INTO tadig_codes SET code=?', [
        req.body.code,
      ]);
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::POST/tadig/codes] failed to insert tadig code - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  //  curl -X DELETE http://localhost:3000/api/app-roaming/tadig/codes/1
  router.delete('/tadig/codes/:id', async (req, res) => {
    const id = req.params.id;
    try {
      await database.query('DELETE FROM tadig_codes WHERE id=?', [id]);
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::POST/tadig/codes] failed to delete tadig code - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  // curl -X GET http://localhost:3000/api/app-roaming/tadig/groups
  router.get('/tadig/groups', async (req, res) => {
    try {
      const result = await database.query('SELECT * FROM tadig_groups');
      res.json(result);
    } catch (error) {
      logger.error(
          '[app-roaming::GET/tadig/groups] failed to query tadig groups - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  // curl -X GET http://localhost:3000/api/app-roaming/tadig/groups/1
  router.get('/tadig/groups/:id', async (req, res) => {
    const tadigGroupId = req.params.id;
    try {
      const result = await database.query(
          'SELECT tc.code, tgr.tadig_code_id FROM tadig_groups_relation tgr INNER JOIN tadig_codes tc ON tgr.tadig_code_id=tc.id WHERE tgr.tadig_group_id=?',
          [tadigGroupId],
      );
      res.json(result);
    } catch (error) {
      logger.error(
          '[app-roaming::GET/tadig/groups] failed to query tadig groups - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  //  curl -X POST http://localhost:3000/api/app-roaming/tadig/groups -d '{"name":"Europe"}' -H "Content-Type: application/json"
  router.post('/tadig/groups', async (req, res) => {
    try {
      await database.query('INSERT INTO tadig_groups SET name=?', [
        req.body.name,
      ]);
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::POST/tadig/groups] failed to insert tadig group - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  //  curl -X POST http://localhost:3000/api/app-roaming/tadig/groups/1/codes -d '[1,2]' -H "Content-Type: application/json"
  router.post('/tadig/groups/:id/codes', async (req, res) => {
    const tadigGroupId = req.params.id;
    const tadigCodeIds = req.body;
    const values = [];
    for (const tadigCodeId of tadigCodeIds) {
      values.push([tadigGroupId, tadigCodeId]);
    }
    try {
      await database.query(
          'INSERT INTO tadig_groups_relation (tadig_group_id, tadig_code_id) VALUES ?',
          [values],
      );
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::POST/tadig/groups] failed to insert tadig group code relation - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  //  curl -X DELETE http://localhost:3000/api/app-roaming/tadig/groups/1/codes -d '[3,4]' -H "Content-Type: application/json"
  router.delete('/tadig/groups/:id/codes', async (req, res) => {
    const tadigGroupId = req.params.id;
    const tadigCodeIds = req.body;
    const values = [];
    for (const tadigCodeId of tadigCodeIds) {
      values.push([tadigCodeId]);
    }
    try {
      await database.query(
          'DELETE FROM tadig_groups_relation WHERE tadig_group_id=? AND tadig_code_id IN (?)',
          [tadigGroupId, values],
      );
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::POST/tadig/groups] failed to insert tadig group code relation - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  //  curl -X DELETE http://localhost:3000/api/app-roaming/tadig/groups/1
  router.delete('/tadig/groups/:id', async (req, res) => {
    const id = req.params.id;
    try {
      await database.query('DELETE FROM tadig_groups WHERE id=?', [id]);
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::POST/tadig/groups] failed to delete tadig group - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  // initialize tadig tables
  await initTableTadigCodes(database, logger);
  await initTableTadigGroups(database, logger);
  await initTableTadigGroupsRelation(database, logger);
};

const initTableTadigCodes = async (database, logger) => {
  const tableName = 'tadig_codes';
  try {
    await database.query('describe ' + tableName);
    return false;
  } catch (error) {
    if (error.errno === 1146) {
      try {
        await database.query(
            'CREATE TABLE IF NOT EXISTS ' +
            tableName +
            ' (' +
            'id INT AUTO_INCREMENT, ' +
            'code VARCHAR(100) NOT NULL, ' +
            'PRIMARY KEY (id), ' +
            'CONSTRAINT uc_code UNIQUE (code))',
        );
        logger.info(
            '[app-roaming::init] table %s has been created successfully!',
            tableName,
        );
      } catch (error) {
        logger.error(
            '[app-roaming::init] failed to create %s table - %s ',
            tableName,
            JSON.stringify(error),
        );
      }
    } else {
      logger.error(
          '[app-roaming::init] Error checking database - %s ',
          JSON.stringify(error),
      );
    }
  }
};

const initTableTadigGroups = async (database, logger) => {
  const tableName = 'tadig_groups';
  try {
    await database.query('describe ' + tableName);
    return false;
  } catch (error) {
    if (error.errno === 1146) {
      try {
        await database.query(
            'CREATE TABLE IF NOT EXISTS ' +
            tableName +
            ' (' +
            'id INT AUTO_INCREMENT, ' +
            'name VARCHAR(100) NOT NULL, ' +
            'PRIMARY KEY (id), ' +
            'CONSTRAINT uc_name UNIQUE (name))',
        );
        logger.info(
            '[app-roaming::init] table %s has been created successfully!',
            tableName,
        );
      } catch (error) {
        logger.error(
            '[app-roaming::init] failed to create %s table - %s ',
            tableName,
            JSON.stringify(error),
        );
      }
    } else {
      logger.error(
          '[app-roaming::init] Error checking database - %s ',
          JSON.stringify(error),
      );
    }
  }
};

const initTableTadigGroupsRelation = async (database, logger) => {
  const tableName = 'tadig_groups_relation';
  try {
    await database.query('describe ' + tableName);
    return false;
  } catch (error) {
    if (error.errno === 1146) {
      try {
        await database.query(
            'CREATE TABLE IF NOT EXISTS ' +
            tableName +
            ' (' +
            'tadig_code_id INT, ' +
            'tadig_group_id INT, ' +
            'PRIMARY KEY (tadig_code_id, tadig_group_id), ' +
            'FOREIGN KEY (tadig_code_id) REFERENCES tadig_codes(id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
            'FOREIGN KEY (tadig_group_id) REFERENCES tadig_groups(id) ON DELETE CASCADE ON UPDATE CASCADE)',
        );
        logger.info(
            '[app-roaming::init] table %s has been created successfully!',
            tableName,
        );
      } catch (error) {
        logger.error(
            '[app-roaming::init] failed to create %s table - %s ',
            tableName,
            JSON.stringify(error),
        );
      }
    } else {
      logger.error(
          '[app-roaming::init] Error checking database - %s ',
          JSON.stringify(error),
      );
    }
  }
};
