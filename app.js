// Global database object
let database = null;

// Load the database when the page loads
document.addEventListener('DOMContentLoaded', loadDatabase);

async function loadDatabase() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    
    try {
        // In development, use a relative path
        // For GitHub Pages, use the full path from your repository root
        const response = await fetch('/database.json');
        if (!response.ok) {
            throw new Error('Failed to load database');
        }
        
        database = await response.json();
        loadingEl.style.display = 'none';
        showAll();
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error loading database: ${err.message}`;
    }
}

function displayUsers(users) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (users.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        const skillsHtml = user.skills
            .map(skill => `<span class="skill-tag">${skill}</span>`)
            .join('');
        
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>City: ${user.city}</p>
            <div class="skills-list">${skillsHtml}</div>
        `;
        
        resultsDiv.appendChild(userCard);
    });
}

function searchUsers() {
    if (!database) return;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = database.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.city.toLowerCase().includes(searchTerm) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
    
    displayUsers(filteredUsers);
}

function showAll() {
    if (!database) return;
    
    document.getElementById('searchInput').value = '';
    displayUsers(database.users);
}

// Add event listener for search input (search as you type)
document.getElementById('searchInput').addEventListener('input', searchUsers);