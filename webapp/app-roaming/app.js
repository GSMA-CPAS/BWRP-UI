/* eslint-disable camelcase */
'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

exports.init = async (app, router, database, logger, config) => {
  // curl -X GET /api/app-roaming/tadig/codes
  router.get('/tadig/codes', async (req, res) => {
    try {
      const result = await database.query(
        'SELECT * FROM tadig_codes ORDER BY code',
      );
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
  // curl -X POST /api/app-roaming/tadig/codes -d '{"code":"myCode","operator":"myOperator","country":"myCountry","region":"myRegion","op_group":"myGroup","mcc_mnc":"myMCCMNC"}' -H "Content-Type: application/json"
  router.post('/tadig/codes', async (req, res) => {
    const {code, operator, country, region, op_group, mcc_mnc} = req.body;
    try {
      await database.query(
        'INSERT INTO tadig_codes SET code=?, operator=?, country=?,region=?, op_group=?, mcc_mnc=?',
        [code, operator, country, region, op_group, mcc_mnc],
      );
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
  // curl -X PUT /api/app-roaming/tadig/codes/1 -d '{"code":"myCode","operator":"myOperator","country":"myCountry","region":"myRegion","op_group":"myGroup","mcc_mnc":"myMCCMNC"}' -H "Content-Type: application/json"
  router.put('/tadig/codes/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
      await database.query('UPDATE tadig_codes SET ? WHERE id=?', [data, id]);
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::PUT/tadig/codes/:id] failed to update tadig code - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  // curl -X DELETE /api/app-roaming/tadig/codes/1
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
  // curl -X GET /api/app-roaming/tadig/groups
  router.get('/tadig/groups', async (req, res) => {
    try {
      const result = await database.query(
        'SELECT * FROM tadig_groups ORDER BY name',
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
  // curl -X GET /api/app-roaming/tadig/groups/1
  router.get('/tadig/groups/:id', async (req, res) => {
    const tadigGroupId = req.params.id;
    try {
      const result = await database.query(
        'SELECT tc.code, tc.operator, tc.country, tc.region, tc.op_group, tc.mcc_mnc, tgr.tadig_code_id FROM tadig_groups_relation tgr INNER JOIN tadig_codes tc ON tgr.tadig_code_id=tc.id WHERE tgr.tadig_group_id=?',
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
  //  curl -X POST /api/app-roaming/tadig/groups -d '{"name":"Europe"}' -H "Content-Type: application/json"
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
  // curl -X PUT /api/app-roaming/tadig/groups/1 -d '{"name":"myName"}' -H "Content-Type: application/json"
  router.put('/tadig/groups/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    try {
      await database.query('UPDATE tadig_groups SET name=? WHERE id=?', [name, id]);
      res.json({success: true});
    } catch (error) {
      logger.error(
          '[app-roaming::PUT/tadig/groups/:id] failed to update tadig group - %s',
          error.message,
      );
      res.status(500).json({
        status: 500,
        code: 'ERR_INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      });
    }
  });
  // curl -X POST /api/app-roaming/tadig/groups/1/codes -d '[1,2]' -H "Content-Type: application/json"
  router.post('/tadig/groups/:id/codes', async (req, res) => {
    const tadigGroupId = req.params.id;
    const tadigCodeIds = req.body;
    const values = [];
    for (const tadigCodeId of tadigCodeIds) {
      if (tadigCodeId != null) {
        values.push([tadigGroupId, tadigCodeId]);
      }
    }
    try {
      if (values.length > 0) {
        await database.query(
            'INSERT INTO tadig_groups_relation (tadig_group_id, tadig_code_id) VALUES ?',
            [values],
        );
      }
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
  //  curl -X DELETE /api/app-roaming/tadig/groups/1/codes -d '[3,4]' -H "Content-Type: application/json"
  router.delete('/tadig/groups/:id/codes', async (req, res) => {
    const tadigGroupId = req.params.id;
    const tadigCodeIds = req.body;
    const values = [];
    for (const tadigCodeId of tadigCodeIds) {
      if (tadigCodeId != null) {
        values.push([tadigCodeId]);
      }
    }
    try {
      if (values.length > 0) {
        await database.query(
            'DELETE FROM tadig_groups_relation WHERE tadig_group_id=? AND tadig_code_id IN (?)',
            [tadigGroupId, values],
        );
      }
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
  //  curl -X DELETE /api/app-roaming/tadig/groups/1
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

const importTadigCodes = (database, logger) => {
  const csvData = [];
  fs.createReadStream(path.resolve(__dirname, 'tadig_codes.csv'))
    .pipe(
      csv.parse({
        headers: true,
      }),
    )
    .on('error', (error) => {
      logger.error(
        '[app-roaming::init] Failed to parse tadig_codes.csv - ' +
          error.message,
      );
    })
    .on('data', (row) => {
      csvData.push(Object.values(row));
    })
    .on('end', (rowCount) => {
      database
        .query(
          'INSERT INTO tadig_codes (code, operator, country, region, op_group, mcc_mnc) VALUES ?',
          [csvData],
        )
        .then(
          (result) => {
            logger.info(
              '[app-roaming::init] tadig codes have been imported successfully!',
            );
          },
          (error) => {
            logger.error(
              '[app-roaming::init] Failed to import tadig codes - ' +
                error.message(),
            );
          },
        );
    });
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
            '`id` INT AUTO_INCREMENT, ' +
            '`code` VARCHAR(64) NOT NULL, ' +
            '`operator` VARCHAR(128) NOT NULL, ' +
            '`country` VARCHAR(128) NOT NULL, ' +
            '`region` VARCHAR(128) NOT NULL, ' +
            '`op_group` VARCHAR(128) NOT NULL, ' +
            '`mcc_mnc` VARCHAR(64) NOT NULL, ' +
            'PRIMARY KEY (id), ' +
            'CONSTRAINT uc_code UNIQUE (code))',
        );
        logger.info(
          '[app-roaming::init] table %s has been created successfully!',
          tableName,
        );
        importTadigCodes(database, logger);
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
            '`id` INT AUTO_INCREMENT, ' +
            '`name` VARCHAR(100) NOT NULL, ' +
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
            '`tadig_code_id` INT, ' +
            '`tadig_group_id` INT, ' +
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
