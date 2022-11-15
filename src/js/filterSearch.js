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
          return $('#errorModal').modal('show');
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
    if (document.getElementById('functionalGroup').value == '0' && document.getElementById('speciesSearch').value == '0' ) {
      return $('#errorModal').modal('show');
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
          return $('#errorModal').modal('show');
        }
        response.json().then((data) => {
          if (data.length == 0 ) {
            return $('#searchNoResults').modal('show');
          }
          const geoData2 = toGeoJson(data);
          // clear map and form
          clearMap();
          $('#searchForm').get(0).reset();
          // set new map markers
          setMap(geoData2);
          geoData = geoData2;
          // reset slider
          resetSliderVal();
        });
      });
}
