/* eslint-disable max-len */
const mysql = require('mysql');
require('dotenv').config();


// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});

/* eslint-disable max-len */
function toGeoJson(data) {
  const outGeoJson = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i =0; i < data.length; i++) {
    const coordA = parseFloat(data[i]['coordA']);
    const coordB = parseFloat(data[i]['coordB']);
    const tempObj = {};
    tempObj['properties'] = data[i];
    tempObj['type']= 'Feature';
    tempObj['geometry']= {'type': 'Point', 'coordinates': [coordA, coordB]};
    outGeoJson['features'].push(tempObj);
  }
  return outGeoJson;
}

function trimArray(array) {
  array.forEach((element, index) => {
    array[index] = element.trim();
  });
  return;
}

function fallBackQuery(req, date, id) {
  db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, req.body.bird,
    req.body.coordA, req.body.coordB, date], function(error, results) {
    if (error) {
      res.status(401).json({error: 'Couldn\'t complete request- issue with birdSighting'});
      throw error;
    }
    return;
  });
}

function reverseLocQuery(req, date, locationInfo, id) {
  db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date, locality, country, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, req.body.bird,
    req.body.coordA, req.body.coordB, date, `${locationInfo[0]}`, `${locationInfo[2]}`, `${locationInfo[1]}`], function(error, results) {
    if (error) {
      res.status(401).json({error: 'Couldn\'t complete request- issue with birdSighting'});
      throw error;
    }
    return;
  });
}

function callLocHelper(url, id, req, date){
  axios.get(url)
          .then(function(response) {
            try {
              const locationInfo = response.data['results'][0]['formatted_address'];
              locationInfo = locationInfo.split(',');
              helpers.trimArray(locationInfo);
              helpers.reverseLocQuery(req, date, locationInfo, id);
            } catch {
              try {
                let locationInfo = response.data['plus_code']['compound_code'];
                locationInfo = locationInfo.slice(9);
                locationInfo = locationInfo.split(',');
                helpers.trimArray(locationInfo);
                helpers.reverseLocQuery(req, date, locationInfo, id);
              } catch {
                helpers.fallBackQuery(req, date, id);
              }
            }
          });

}

module.exports = {toGeoJson, trimArray, reverseLocQuery, fallBackQuery, callLocHelper};
