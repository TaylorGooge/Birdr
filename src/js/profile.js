/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
window.addEventListener('load', () => {
  getLogged();
});

function deleteThis(object) {
  let id = object.id;
  id = id.split(' ');
  id = id[0];
  fetch('/deleteEntry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  })
      .then((response) => {
        if (response.status == 200) {
          getLogged();
        }
      });
}

function getLogged() {
  fetch(`/getlogged?email=${email}&userName=${userName}`, {
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
          let table = $('#profile-table').DataTable( {
            data: data,
            rowId: 'id',
            columns: [
              {data: 'id'},
              {data: 'userID'},
              {data: 'birdID'},
              {data: 'englishName'},
              {data: 'date'},
            ],
            columnDefs: [
              {
                  target: 0,
                  visible: false,
                  searchable: false,
              },
              {
                target: 1,
                visible: false,
                searchable: false,
              },
              {
                target: 2,
                visible: false,
                searchable: false,
              },
              {
                target: 4,
                render:  function(data) {return moment(data, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY ')}
              }
            ],
          } );
          $('#profile-table tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                delNode = null
            } else {
                table.$('tr.selected').removeClass('selected');
                delNode = (this.id)
                $(this).addClass('selected');
            }
          });
        $('#button').click(function () {
          deleteThis(delNode);
          table.row('.selected').remove().draw(false);
        });
        });
      });
}
let delNode = null

function deleteThis(id) {
  fetch('/deleteEntry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  })
      .then((response) => {
        if (response.status != 200) {
          return $('#errorModal').modal('show');
        }
        delNode = null;
        return $('#deleteBirdModal').modal('show');
      });
}


