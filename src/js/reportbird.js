/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
window.addEventListener('load', () => {
  // block below gets all vendor ids, calls a function to build the vendor id dropdowns, and calls
  // a similiar function for all item ids.
  const req = new XMLHttpRequest();
  req.open('GET', '/getbirds', true);
  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      const res = JSON.parse(req.responseText);
      buildBirdDropDown(res, 'birdName', 'bird-select-basic-single');
      buildBirdDropDown(res, 'speciesSearch', 'dropdown-basic-single');
    } else {
      return document.getElementById("errorButton").click();
    }
  });
  req.send();

  document.getElementById('submitBird').addEventListener('click', function(e) {
    e.preventDefault();
    if (document.getElementById('birdName').value == '0') {
      return document.getElementById("errorButton").click();
    }
    recordBird();
  });
});

function buildBirdDropDown(data, id, sselector) {
  // this function builds the vendor id dropdowns
  const dropDowns = document.getElementById(id);
  for (let i=0; i < data.length; i++) {
    const opt = document.createElement('option');
    opt.innerText = data[i].englishName + ' ' + data[i].fourCode + ' ' + data[i].scientificName + ' ' + data[i].sixCode;
    opt.setAttribute('value', data[i].birdID);
    dropDowns.appendChild(opt);
  }
  $(`.${sselector}`).select2({dropdownAutoWidth : true});
}

function recordBird() {
  // //get location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(foundLocation, noLocation, {timeout: 30000000000, enableHighAccuracy: false, maximumAge: 75000});
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function foundLocation(pos) {
  let params = {  email: email,
    coordA: pos.coords.longitude,
    coordB: pos.coords.latitude,
    bird: document.getElementById('birdName').value,
  }
  fetch('/postBird', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      coordA: pos.coords.longitude,
      coordB: pos.coords.latitude,
      bird: document.getElementById('birdName').value,
    }),
  }) 
      .then((response) => {
        if (!response.ok) {
          return document.getElementById("errorButton").click();
        } else {
          return document.getElementById("successButton").click();
        }
      });
}

function noLocation(err) {
  if (err.code == 1) {
    alert('Error: Access is denied!');
  } else if ( err.code == 2) {
    alert('Error: Position is unavailable!');
  }
}
