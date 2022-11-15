/* eslint-disable max-len */
let refinedResults = null;

$('.sev_check').click(function() {
  $('.sev_check').not(this).prop('checked', false);
});

function showVal(value) {
  if (value==='1') {
    return getDates(7);
  }
  if (value=== '2') {
    return getDates(30);
  }
  if (value=== '3') {
    return getSeason(new Date());
  }
  if (value=== '4') {
    return getDates(365);
  }
  if (value=== '5' ) {
    // return to onload state
    map.data.addGeoJson(geoData);
  }
}
function clearRefinedResults() {
  refinedResults = structuredClone(geoData);
}

function getDate() {
  return new Date();
}

function getSeasonMonths(date) {
  const seasonsMonths= {
    0: 3,
    1: 3,
    2: 1,
    3: 1,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 2,
    9: 2,
    10: 2,
    11: 3,
  };
  return seasonsMonths[date.getMonth()];
}

function winterSeasonHelper(date, obj) {
  if ((currDate.getMonth()) === 11) {
    seasonDateRange['end'] = new Date( currDate.getFullYear()+1, 1, 28);
  } else {
    seasonDateRange['start'] = new Date( currDate.getFullYear()-1, 11, 1);
  }
}

function getSeasonDateRange(currDate, index) {
  const seasonsDates = {
    3: { // winter  DEC - FEB
      'start': new Date( currDate.getFullYear(), 11, 1),
      'end': new Date( currDate.getFullYear(), 1, 28),
    },
    1: { // spring  MAR-MAY
      'start': new Date( currDate.getFullYear(), 2, 1),
      'end': new Date( currDate.getFullYear(), 4, 31),
    },
    0: { // summer  JUN-AUG
      'start': new Date( currDate.getFullYear(), 5, 1),
      'end': new Date( currDate.getFullYear(), 7, 31),
    },
    2: { // autmn  SEP-NOV
      'start': new Date( currDate.getFullYear(), 8, 1),
      'end': new Date( currDate.getFullYear(), 10, 30),
    },
  };
  return seasonsDates[index];
}


function getSeason(date) {
  clearRefinedResults();
  const currDate = getDate();
  const seasonsMonths = getSeasonMonths(currDate);
  let seasonDateRange = getSeasonDateRange(currDate, seasonsMonths);
  if (seasonsMonths == 3) {
    seasonDateRange = winterSeasonHelper(currDate, seasonDateRange);
  }
  filter(seasonDateRange['start'].toISOString(), seasonDateRange['end'].toISOString());
}

function getFeatures() {
  return refinedResults.features;
}

function clearMap() {
  map.data.forEach(function(feature) {
    map.data.remove(feature);
  });
}

function setMap(results) {
  map.data.addGeoJson(results);
}

function setFeatures(feat) {
  refinedResults.features = feat;
  clearMap();
  setMap(refinedResults);
}

function filter(start, end ) {
  const features = getFeatures();
  features.slice().reverse().forEach(function(element, index, object) {
    const date = element['properties'].date;
    if (!(date >= start && date <= end)) {
      features.splice(object.length - 1 - index, 1);
    }
  });
  setFeatures(features);
}

function getDates(int) {
  clearRefinedResults();
  const now = getDate().toISOString();
  const week = new Date(getDate().getFullYear(), getDate().getMonth(), getDate().getDate() - int).toISOString();
  return filter(week, now);
}

