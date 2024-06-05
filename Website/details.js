async function fetchBookDetails(bookId) {
    try {
        const username = localStorage.getItem('username');
        const response = await fetch(`http://localhost:3000/api/book/${bookId}?username=${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch book details');
        }
        const book = await response.json();
        
        const userData = await getUserData();
        
        renderBookDetails(book, userData);
    } catch (error) {
        console.error(error);
    }
}

function renderBookDetails(book, userData) {
    const detailsContainer = document.getElementById('bookDetailsContainer');
    const imageUrl = book.image ? `data:image/png;base64,${book.image}` : 'placeholder.png';
    const favoriteButtonText = book.isFavorite ? 'Unfavorite' : 'Favorite';
    var booktext = "ㅤ" + book.text.replace(/\n/g, "<br />ㅤ");

    const username = localStorage.getItem('username');
    const isAdmin = userData.isAdmin;
    const isAuthor = book.author === username;

    const deleteButtonHtml = (isAuthor || isAdmin) ? `<button id="deleteButton" class="delete-button" onclick="deleteBook(${book.id})">Delete</button>` : '';

    detailsContainer.innerHTML = `
        <div class="book-details">
            <img src="${imageUrl}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Genres:</strong> ${book.genres.join(', ')}</p>
                <button id="favoriteButton" onclick="toggleFavorite(${book.id})">${favoriteButtonText}</button> <!-- Set the initial button text -->
                <button onclick="showBookText()">Read Book</button>
            </div>
            <div class="button-container">
                ${deleteButtonHtml} <!-- Add delete button here -->
            </div>
        </div>
        <div id="bookTextContainer" class="book-text-container" style="display:none;">
            <button onclick="closeBookText()">Close</button>
            <div class="book-text-content">${booktext}</div>
        </div>
    `;
}

async function deleteBook(bookId) {
    const confirmDelete = confirm('Are you sure you want to delete this book?');
	const username = localStorage.getItem('username');
	const password = localStorage.getItem('password');
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:3000/api/delete-book/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                alert('Book deleted successfully');
            } else {
                throw new Error('Failed to delete book');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting book');
        }
    }
}

async function toggleFavorite(bookId) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Please log in to add to favorites.');
        return;
    }

    try {
        let response;
        if (document.getElementById('favoriteButton').innerText === 'Favorite') {
            response = await fetch('http://localhost:3000/api/favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ book_id: bookId, user: username }),
            });
        } else {
            response = await fetch('http://localhost:3000/api/unfavorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ book_id: bookId, user: username }),
            });
        }

        if (response.ok) {
            const newFavoriteStatus = document.getElementById('favoriteButton').innerText === 'Favorite' ? 'Unfavorite' : 'Favorite';
            document.getElementById('favoriteButton').innerText = newFavoriteStatus;
        } else {
            throw new Error('Failed to update favorite status');
        }
    } catch (error) {
        console.error(error);
        alert('Error updating favorite status');
    }
}

function showBookText() {
    const bookTextContainer = document.getElementById('bookTextContainer');
    bookTextContainer.style.display = 'block';
}

function closeBookText() {
    const bookTextContainer = document.getElementById('bookTextContainer');
    bookTextContainer.style.display = 'none';
}

async function addToFavorites(bookId) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Please log in to add to favorites.');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ book_id: bookId, user: username }),
        });
        
        if (response.ok) {
            alert('Book added to favorites!');
            document.getElementById('favoriteButton').innerText = 'Unfavorite';
            document.getElementById('favoriteButton').onclick = () => removeFromFavorites(bookId);
        } else {
            throw new Error('Failed to add book to favorites');
        }
    } catch (error) {
        console.error(error);
        alert('Error adding book to favorites');
    }
}

async function removeFromFavorites(bookId) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Please log in to remove from favorites.');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/unfavorite', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ book_id: bookId, user: username }),
        });
        
        if (response.ok) {
            alert('Book removed from favorites!');
            document.getElementById('favoriteButton').innerText = 'Favorite';
            document.getElementById('favoriteButton').onclick = () => addToFavorites(bookId);
        } else {
            throw new Error('Failed to remove book from favorites');
        }
    } catch (error) {
        console.error(error);
        alert('Error removing book from favorites');
    }
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

async function getUserData() {
	const username = localStorage.getItem('username');
	const password = localStorage.getItem('password');

	try {
		const response = await fetch('http://localhost:3000/api/user', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return {
			username: data.username,
			profileImage: `data:image/png;base64,${data.profile_image}`,
			isAdmin: data.isAdmin,
			adminpanel: data.adminpanel
		};
	} catch (error) {
		console.error('Error fetching user data:', error);
		alert('An error occurred while fetching user data.');
	}
}

const params = new URLSearchParams(window.location.search);
const bookId = params.get('id');

async function load() {
    fetchBookDetails(bookId);
	checkLoginStatus();
	loadUserIcon();
}

window.onload = load;