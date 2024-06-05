document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userData = await getUserData();
        displayUserData(userData);

        document.getElementById('profileIcon').addEventListener('change', handleProfileIconChange);
        document.getElementById('updateProfileIcon').addEventListener('click', updateProfileIcon);
        document.getElementById('updatePassword').addEventListener('click', updatePassword);

        if (userData.isAdmin) {
            document.getElementById('adminPanel').style.display = 'block';
        }

        document.getElementById('viewFavorites').addEventListener('click', () => {
            window.location.href = 'favorites.html';
        });

        document.getElementById('adminPanel').addEventListener('click', () => {
            window.location.href = userData.adminpanel;
        });

        document.getElementById('addBookButton').addEventListener('click', () => {
            window.location.href = 'add_book.html';
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading the user profile.');
    }
});

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

function displayUserData(userData) {
    document.getElementById('usernameLabel').textContent = userData.username;

    const profileImage = document.getElementById('profileImage');
    profileImage.src = userData.profileImage;
    profileImage.style.display = 'block';
}

function handleProfileIconChange(event) {
    const profileImage = document.getElementById('profileImage');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function updateProfileIcon() {
    const username = document.getElementById('usernameLabel').textContent;
    const fileInput = document.getElementById('profileIcon');

    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async function () {
            try {
                const imageData = reader.result;
                await updateProfileIconData(username, imageData);
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

async function updateProfileIconData(username, imageData) {
    const profileData = {
        username,
        imageData
    };

    try {
        const response = await fetch('http://localhost:3000/api/update-profile-icon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Profile icon updated successfully!');
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error updating profile icon:', error);
        alert('An error occurred while updating the profile icon.');
    }
}

async function updatePassword() {
    const username = document.getElementById('usernameLabel').textContent;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    if (!currentPassword || !newPassword) {
        alert('Please enter both current and new passwords.');
        return;
    }

    try {
        await updatePasswordData(username, currentPassword, newPassword);
    } catch (error) {
        console.error('Error updating password:', error);
        alert('An error occurred while updating the password.');
    }
}

async function updatePasswordData(username, currentPassword, newPassword) {
    const passwordData = {
        username,
        currentPassword,
        newPassword
    };

    try {
        const response = await fetch('http://localhost:3000/api/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Password updated successfully!');
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error updating password:', error);
        alert('An error occurred while updating the password.');
    }
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'main.html';
}

document.getElementById('logoutButton').addEventListener('click', logout);
