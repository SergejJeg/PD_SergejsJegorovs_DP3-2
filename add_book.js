document.getElementById('addBookForm').addEventListener('submit', function (event) {
  event.preventDefault();
  loadBookData();
});

document.addEventListener('DOMContentLoaded', async function () {
  // Fetch genres and populate the select element
  const genresSelect = document.getElementById('genres');
  try {
    const response = await fetch('http://localhost:3000/api/genres');
    const genres = await response.json();

    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genresSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    alert('An error occurred while fetching genres.');
  }
});

async function loadBookData() {
  const bookName = document.getElementById('bookName').value;
  const description = document.getElementById('description').value;
  const bookImageInput = document.getElementById('bookImage');
  const text = document.getElementById('text').value;
  const author = localStorage.getItem('username');
  const genresSelect = document.getElementById('genres');
  const selectedGenres = Array.from(genresSelect.selectedOptions).map(option => option.value);

  if (bookImageInput && bookImageInput.files.length > 0) {
    const file = bookImageInput.files[0];
    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const bookImage = reader.result;
		await addBook(bookName, description, author, bookImage, text, selectedGenres);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('An error occurred while processing the image.');
      }
    };

    reader.readAsDataURL(file);
  } else {
    alert('Please select a profile icon to upload.');
  }
}

async function addBook(name, description, author, image, text, genres) {
  const bookData = {
    name, 
	description, 
	author, 
	image, 
	text,
    genres
  };

  try {
    const response = await fetch('http://localhost:3000/api/add-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Book created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error creating book:', error);
    alert('An error occurred while creating the book.');
  }
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
  loadUserIcon();
}

window.onload = load;