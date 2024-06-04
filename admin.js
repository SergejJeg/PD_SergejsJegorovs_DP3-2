async function fetchGenres() {
  const response = await fetch('http://localhost:3000/api/genres');
  const genres = await response.json();
  const genreContainer = document.getElementById('genreContainer');
  genreContainer.innerHTML = '';

  genres.forEach(genre => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `genre-${genre.id}`;
    checkbox.value = genre.id;
    checkbox.className = 'genre-checkbox';

    const label = document.createElement('label');
    label.htmlFor = `genre-${genre.id}`;
    label.textContent = genre.name;

    genreContainer.appendChild(checkbox);
    genreContainer.appendChild(label);
    genreContainer.appendChild(document.createElement('br'));
  });
}

async function addGenre() {
    const genre = document.getElementById('genreNameInput').value;
	const username = localStorage.getItem('username');
	const password = localStorage.getItem('password');
	try {
    const response = await fetch('http://localhost:3000/api/add-genre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ genre,
			admin: username,
			password })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Genre created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error creating genre:', error);
    alert('An error occurred while creating the genre.');
  }
  fetchGenres();
}

async function deleteGenres() {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const selectedGenres = [];
  document.querySelectorAll('.genre-checkbox:checked').forEach(checkbox => {
    selectedGenres.push(checkbox.value);
  });
  
  if (selectedGenres.length === 0) {
	  alert('Please select genres to delete.');
  } else {
	  try {
		const response = await fetch('http://localhost:3000/api/remove-genres', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			genres: selectedGenres,
			admin: username,
			password
		  })
		});

		const result = await response.json();

		if (response.ok) {
		  alert('Genres deleted successfully!');
		} else {
		  alert(`Error: ${result.error}`);
		}
	  } catch (error) {
		console.error('Error creating genre:', error);
		alert('An error occurred while deleting the genres.');
	  }
	  fetchGenres();
  }
}

async function fetchUsers() {
  const response = await fetch('http://localhost:3000/api/users');
  const users = await response.json();
  const usersContainer = document.getElementById('usersContainer');
  usersContainer.innerHTML = '';

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user';

    const userName = document.createElement('span');
    userName.textContent = user.username;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Ban';
    deleteButton.className = 'delete-button'; // Adding a class for styling

    // Adding a confirmation dialog when the delete button is clicked
    deleteButton.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
        deleteUser(user.id);
      }
    });

    userDiv.appendChild(userName);
    userDiv.appendChild(deleteButton);

    usersContainer.appendChild(userDiv);
  });
}


async function deleteUser(userId) {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  try {
    const response = await fetch(`http://localhost:3000/api/delete-user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        admin: username,
        password
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert('User deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('An error occurred while deleting the user.');
  }
  fetchUsers();
}


async function loadUserIcon() {
  const username = localStorage.getItem('username');
  if (username) {
	 document.getElementById('userDisplay').textContent = `Welcome, ${username}`;
    try {
      const response = await fetch(`http://localhost:3000/api/user/${username}/image`);
      if (response.ok) {
        const imageData = await response.json();
        const imageUrl = imageData.profile_image ? `data:image/png;base64,${imageData.profile_image}` : 'default_user_icon.png';
        const iconImg = document.querySelector('.Icon img');
        iconImg.src = imageUrl;
      } else {
        console.error('Failed to fetch user icon:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user icon:', error);
    }
  }
}

async function load() {
  fetchGenres();
  fetchUsers();
  loadUserIcon();
}

window.onload = load;