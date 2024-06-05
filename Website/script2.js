document.getElementById('signupForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    
        const result = await response.json();
    
        if (response.ok) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            window.location.href = 'main.html';
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering the user.');
    }
});

document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    
        const result = await response.json();
    
        if (response.ok) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            window.location.href = 'main.html';
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in the user.');
    }
});
