const searchInput = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');
const resultsContainer = document.getElementById('results-container');

let timer;

searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    const query = searchInput.value.trim();
    
    if (!query) {
        dropdown.style.display = 'none';
        return;
    }
    
    timer = setTimeout(() => searchRepos(query), 400);
});

async function searchRepos(query) {
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
        const data = await response.json();
        showDropdown(data.items);
    } catch (error) {
        console.error('Error:', error);
        dropdown.style.display = 'none';
    }
}

function showDropdown(repos) {
    dropdown.innerHTML = '';
    
    if (!repos || repos.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    repos.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = repo.full_name;
        
        item.addEventListener('click', () => {
            addRepo(repo);
            searchInput.value = '';
            dropdown.style.display = 'none';
        });
        
        dropdown.appendChild(item);
    });
    
    dropdown.style.display = 'block';
}

function addRepo(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    card.innerHTML = `
        <div class="repo-info">
            <div>Name: ${repo.name}</div>
            <div>Owner: ${repo.owner.login}</div>
            <div>Stars: ${repo.stargazers_count}</div>
        </div>
        <button class="delete-btn"></button>
    `;
    
    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.remove();
    });
    
    resultsContainer.prepend(card);
}

document.addEventListener('click', (e) => {
    if (e.target !== searchInput && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});