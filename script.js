let opened = false;
var width = window.innerWidth;
var height = window.innerHeight;

function ShowCatalog() {
  const catalog = document.getElementById("catalog");
  if (opened) {
    opened = false;
    catalog.style.left = `calc(80px - 10%)`;
  } else {
    opened = true;
    catalog.style.left = `80px`;
  }
}

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

async function searchBooks() {
  const selectedGenres = [];
  document.querySelectorAll('.genre-checkbox:checked').forEach(checkbox => {
    selectedGenres.push(checkbox.value);
  });

  const authorSearchInput = document.getElementById('authorSearchInput').value; // Assuming you have an input field with id "authorSearchInput" for entering author name
  const searchData = {
    genres: selectedGenres,
    author: authorSearchInput // Include author name in the request body
  };

  const response = await fetch('http://localhost:3000/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData), // Send the search data to the server
  });

  const books = await response.json();
  const bookList = document.getElementById('genreBooks');
  bookList.innerHTML = '';

  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    const imageUrl = book.image ? `data:image/png;base64,${book.image}` : 'placeholder.png';
    bookDiv.innerHTML = `
      <img src="${imageUrl}" alt="${book.title}">
      <a href="#" onclick="showBookDetails(${book.id})">${book.title}</a>
    `;
    bookList.appendChild(bookDiv);
  });

  bookList.style.display = 'block';
}

async function showBookDetails(bookId) {
  window.location.href = `book_details.html?id=${bookId}`;
}

function checkLoginStatus() {
  const username = localStorage.getItem('username');
  const loginLink = document.querySelector('a[href="login.html"]');
  const signupLink = document.querySelector('a[href="signup.html"]');

  if (username) {
    const userDisplay = document.createElement('div');
    userDisplay.textContent = `Welcome, ${username}`;
    userDisplay.style.position = 'absolute';
    userDisplay.style.top = '30px';
    userDisplay.style.left = '91%';
    userDisplay.style.fontSize = '1.5em';
    userDisplay.style.fontFamily = "'Fraunces', serif";

    loginLink.style.display = 'none';
    signupLink.style.display = 'none';
    document.body.appendChild(userDisplay);
  }
}

async function loadUserIcon() {
  const username = localStorage.getItem('username');
  if (username) {
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
  checkLoginStatus();
  fetchGenres();
  searchBooks();
  loadUserIcon();
}

window.onload = load;
