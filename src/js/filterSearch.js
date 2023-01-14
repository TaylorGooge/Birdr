/* eslint-disable max-len */
$(document).ready(function() {
  fetch('/getgroups', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
      .then((response) => {
        if (!response.ok) {
          return document.getElementById("errorButton").click();
        }
        response.json().then((data) => {
          if (data.length > 0 ) {
            const select = document.getElementById('functionalGroup');
            // eslint-disable-next-line guard-for-in
            for ( const property in data) {
              const opt = document.createElement('option');
              opt.value = `${data[property].id}`;
              opt.innerText = `${data[property].name}`;
              select.appendChild(opt);
            }
          }
        });
      });


  $('.search-select-basic-single').select2({dropdownAutoWidth : true});
});

window.addEventListener('load', () => {
  // eslint-disable-next-line max-len
  document.getElementById('search-submitBird').addEventListener('click', function(e) {
    e.preventDefault();
    if (document.getElementById('functionalGroup').value == 0 && document.getElementById('speciesSearch').value == 0 ) {
      return document.getElementById("errorButton").click();
    }
    searchBird();
  });
  document.getElementById('search-submitBird-1').addEventListener('click', function(e) {
    e.preventDefault();
    if (document.getElementById('functionalGroup').value == 0 && document.getElementById('speciesSearch').value == 0 ) {
      return document.getElementById("errorButton").click();
    }
    searchBird();
  });

});

function searchBird() {
  const id= document.getElementById('speciesSearch').value !=0 ? document.getElementById('speciesSearch').value : false;
  const group = document.getElementById('functionalGroup').value!= 0 ? document.getElementById('functionalGroup').value : false;
  let url;
  if (id) {
    url = `/searchBird?id=${id}`;
  } else {
    url = `/searchBird?group=${group}`;
  }
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
      .then((response) => {
        if (!response.ok) {
          return document.getElementById("errorButton").click();
        }
        response.json().then((data) => {
          if (data.length == 0 ) {
            return document.getElementById("noResultsButton").click();
          }
          const geoData2 = toGeoJson(data);
          // clear map and form
          document.getElementById('functionalGroup').value = 0
          document.getElementById('speciesSearch').value = 0
          clearMap();
          // set new map markers
          setMap(geoData2);
          geoData = geoData2;
        });
      });
}

function clearResults(){
  clearMap();

  fetch('/getloggedall', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
      .then((response) => {
        if (!response.ok) {
          return document.getElementById("errorButton").click();
        }
        response.json().then((data) => {
          if (data.length == 0 ) {
            return document.getElementById("noResultsButton").click();
          }
          const geoData2 = toGeoJson(data);
          // set new map markers
          setMap(geoData2);
          geoData = geoData2;
        });
      });
}
