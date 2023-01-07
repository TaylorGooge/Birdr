function submitForm(event){
    event.preventDefault();
    const data = {
        username: document.getElementById('signUpUserName').value,
        firstname: document.getElementById('signUpNameFirst').value,
        lastname: document.getElementById('signUpNameLast').value,
        email: document.getElementById('signUpMail').value,
        password:document.getElementById('signUpPassword').value,
    }
    alert('called')
    fetch('http://localhost:1337/api/auth/local/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
       localStorage.setItem('token', data.jwt);
       localStorage.setItem('user', JSON.stringify(data.user))
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}