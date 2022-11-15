/* eslint-disable max-len */
const express = require('express');
const chartRouter = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const moment = require('moment');
const axios = require('axios');

// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});


chartRouter.get('/top10species', function(req, res, next) {
  db.query(
      `SELECT
            COUNT(*) as 'Count',
            defaultdb.birdcodes.englishName,
            defaultdb.birdcodes.scientificName,
            defaultdb.birdcodes.fourCode,
            defaultdb.birdcodes.sixCode
            FROM defaultdb.birdSighting
            INNER JOIN defaultdb.birdcodes ON birdSighting.birdID = birdcodes.birdID
            GROUP BY birdSighting.birdID
            ORDER BY COUNT(*) DESC
            LIMIT 10;`,
      function(error, results) {
        if (error) {
          res.status(401).json({error: 'Couldn\'t complete request- user information is invalid or empty'});
        } else {
          const obj = [['English Name', 'Count']];
          for (let i = 0; i < results.length; i++) {
            const temp = [results[i].englishName, results[i].Count];
            obj.push(temp);
          }
          res.send(obj);
        }
      });
});

chartRouter.get('/top10group', function(req, res, next) {
  db.query(
      `SELECT
        COUNT(*) as 'Count',
        defaultdb.bird_categories.name
        FROM defaultdb.birdSighting
        INNER JOIN defaultdb.birdcodes ON birdSighting.birdID = birdcodes.birdID
        INNER JOIN defaultdb.bird_categories on birdcodes.birdGroup = defaultdb.bird_categories.id
        GROUP BY birdSighting.birdID
        ORDER BY COUNT(*) DESC
        LIMIT 10;
        `,
      function(error, results) {
        if (error) {
          res.status(401).json({error: 'Couldn\'t complete request'});
        } else {
          const obj = [['English Name', 'Count']];
          for (let i = 0; i < results.length; i++) {
            const temp = [results[i].name, results[i].Count];
            obj.push(temp);
          }
          res.send(obj);
        }
      });
});

chartRouter.get('/birdrlocations', function(req, res, next) {
  db.query('SELECT DISTINCT coordA, coordB, locality, state from defaultdb.birdSighting', function(error, results ) {
    if (error) {
      res.status(401).json({error: 'Couldn\'t complete request'});
    } else {
      const obj = [['Lat', 'Lng', 'City']];
      for (let i = 0; i < results.length; i++) {
        const temp = [parseFloat(results[i].coordB), parseFloat(results[i].coordA), results[i].locality];
        obj.push(temp);
      }
      res.send(obj);
    }
  });
});

module.exports = chartRouter;
