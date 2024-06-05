async function searchBooks() {
    const username = localStorage.getItem('username');
    
    if (!username) {
        console.error('No user logged in');
        return;
    }
  
    const response = await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
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
            <a href="book_details.html?id=${book.id}">${book.title}</a>
        `;
        bookList.appendChild(bookDiv);
    });
  
    bookList.style.display = 'block';
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
    searchBooks();
    loadUserIcon();
}
  
window.onload = load;
