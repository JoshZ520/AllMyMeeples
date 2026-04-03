const selection = new Set();
let ownedIds = new Set();
let allGames = [];
let filteredGames = [];
let currentPage = 1;
const itemsPerPage = 12;

const searchInput = document.getElementById('search-games');
const playersSelect = document.getElementById('filter-players');
const playtimeSelect = document.getElementById('filter-playtime');
const categorySelect = document.getElementById('filter-category');
const mechanicSelect = document.getElementById('filter-mechanic');
const sortSelect = document.getElementById('sort-by');

// Toggle filters
const toggleFiltersBtn = document.getElementById('toggle-filters');
const filtersContainer = document.getElementById('filters-container');

toggleFiltersBtn.addEventListener('click', () => {
  const isHidden = filtersContainer.style.display === 'none';
  filtersContainer.style.display = isHidden ? 'grid' : 'none';
  toggleFiltersBtn.textContent = isHidden ? 'Hide Filters' : 'Show Filters';
});

async function loadOwnedGames() {
  try {
    const response = await fetch('/api/shelf');
    if (response.status === 401) {
      // User not logged in - collection count element won't exist
      return;
    }

    const games = await response.json();
    ownedIds = new Set(games.map(game => String(game.id)));
    
    const collectionCount = document.getElementById('collection-count');
    if (collectionCount) {
      collectionCount.textContent = games.length;
    }
  } catch (error) {
    console.error('Error loading shelf:', error);
  }
}

function updateBulkActions() {
  const bulkActions = document.getElementById('bulk-actions');
  const selectedCount = document.getElementById('selected-count');

  selectedCount.textContent = selection.size;
  bulkActions.style.display = selection.size >= 2 ? 'flex' : 'none';
}

function renderGames(games) {
  const container = document.getElementById('games-container');

  selection.clear();
  updateBulkActions();

  if (games.length === 0) {
    container.innerHTML = '<p>No games match your filters.</p>';
    return;
  }

  container.innerHTML = games.map(game => {
    const isOwned = ownedIds.has(String(game.id));
    const categoryClass = game.categories && game.categories[0] 
      ? 'category-' + game.categories[0].toLowerCase().replace(/\s+/g, '-')
      : '';
    return `
      <article class="card browse-card ${isOwned ? 'owned' : ''} ${categoryClass}" data-game-id="${game.id}" data-detail-url="/games/${game.id}">
        <div class="card-flip">
          <div class="card-inner">
            <div class="card-face card-front">
              <div class="card-badges">
                ${isOwned ? '<span class="badge owned">Owned</span>' : ''}
              </div>
              <img src="${game.image_url}" alt="${game.title}">
              <h3><a href="/games/${game.id}">${game.title}</a></h3>
              <p class="card-meta">
                ${game.min_players}-${game.max_players} players | ${game.playtime_minutes} min
              </p>
              <p><strong>Rating:</strong> ⭐ ${game.rating || 'N/A'}</p>
            </div>
            <div class="card-face card-back">
              <p class="card-meta">Description</p>
              <p>${game.description || 'No description available.'}</p>
              <p class="card-meta">
                ${game.min_players}-${game.max_players} players | ${game.playtime_minutes} min
              </p>
              <a class="button secondary full-width" href="/games/${game.id}">View details</a>
            </div>
          </div>
        </div>
        <div class="card-actions">
          <button class="button primary add-single" ${isOwned ? 'disabled' : ''}>
            ${isOwned ? 'On shelf' : 'Add to shelf'}
          </button>
          <button class="button secondary select-btn" ${isOwned ? 'disabled' : ''}>Select</button>
        </div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.browse-card').forEach(card => {
    const addButton = card.querySelector('.add-single');
    const selectButton = card.querySelector('.select-btn');
    const gameId = card.dataset.gameId;

    card.addEventListener('click', (event) => {
      if (event.target.closest('button, a, input, textarea, select, label')) {
        return;
      }
      const detailUrl = card.dataset.detailUrl;
      if (detailUrl) {
        window.location.href = detailUrl;
      }
    });

    if (!addButton.disabled) {
      addButton.addEventListener('click', () => addGameToShelf(gameId, addButton));
    }

    if (!selectButton.disabled) {
      selectButton.addEventListener('click', () => toggleSelection(card, selectButton));
    }
  });
}

function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();
  const playersValue = Number(playersSelect.value || 0);
  const playtimeValue = Number(playtimeSelect.value || 0);
  const categoryValue = categorySelect.value;
  const mechanicValue = mechanicSelect.value;

  filteredGames = allGames.filter(game => {
    const textMatch = !searchText ||
      game.title.toLowerCase().includes(searchText) ||
      (game.description || '').toLowerCase().includes(searchText);

    const playersMatch = !playersValue ||
      (game.min_players <= playersValue && game.max_players >= playersValue);

    const playtimeMatch = !playtimeValue || game.playtime_minutes <= playtimeValue;

    const categoryMatch = !categoryValue ||
      (game.categories && game.categories.includes(categoryValue));

    const mechanicMatch = !mechanicValue ||
      (game.mechanics && game.mechanics.includes(mechanicValue));

    return textMatch && playersMatch && playtimeMatch && categoryMatch && mechanicMatch;
  });

  const sortValue = sortSelect.value;

  filteredGames.sort((a, b) => {
    switch (sortValue) {
        case 'title-asc':
            return a.title.localeCompare(b.title);
        case 'title-desc':
            return b.title.localeCompare(a.title);
        case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
        case 'playtime-desc':
            return (b.playtime_minutes || 0) - (a.playtime_minutes || 0);
        case 'playtime-asc':
        default:
            return (a.playtime_minutes || 0) - (b.playtime_minutes || 0);
    }
  });

  currentPage = 1;
  renderCurrentPage();
}

function renderCurrentPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const gamesToShow = filteredGames.slice(startIndex, endIndex);
  
  renderGames(gamesToShow);
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination() {
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginationTop = document.getElementById('pagination-top');
  const paginationBottom = document.getElementById('pagination-bottom');
  
  if (totalPages <= 1) {
    paginationTop.innerHTML = '';
    paginationBottom.innerHTML = '';
    return;
  }

  let html = '<div class="pagination-controls">';
  
  // Previous button
  html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">← Previous</button>`;
  
  // Page numbers
  html += '<div class="pagination-pages">';
  
  // Always show first page
  if (currentPage > 3) {
    html += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
    if (currentPage > 4) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }
  
  // Show pages around current page
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  
  // Always show last page
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
    html += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }
  
  html += '</div>';
  
  // Next button
  html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next →</button>`;
  
  html += '</div>';
  
  paginationTop.innerHTML = html;
  paginationBottom.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  renderCurrentPage();
}

// Make changePage available globally
window.changePage = changePage;

function toggleSelection(card, button) {
  const gameId = card.dataset.gameId;

  if (selection.has(gameId)) {
    selection.delete(gameId);
    card.classList.remove('selected');
    button.textContent = 'Select';
  } else {
    selection.add(gameId);
    card.classList.add('selected');
    button.textContent = 'Selected';
  }

  updateBulkActions();
}

async function addGameToShelf(gameId, button) {
  try {
    const response = await fetch(`/api/games/${gameId}/shelf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return;
    }

    if (response.ok) {
      button.textContent = '✓ Added';
      button.disabled = true;
      button.classList.add('button-disabled');
      ownedIds.add(String(gameId));
      await loadOwnedGames();
    } else {
      const error = await response.json();
      alert(error.message || 'This game is already on your shelf');
    }
  } catch (error) {
    console.error('Error adding to shelf:', error);
    alert('Failed to add game to shelf');
  }
}

async function addSelectedToShelf() {
  const ids = Array.from(selection);
  for (const gameId of ids) {
    await addGameToShelf(gameId, document.querySelector(`[data-game-id="${gameId}"] .add-single`));
  }
  selection.clear();
  document.querySelectorAll('.browse-card.selected').forEach(card => {
    card.classList.remove('selected');
    const selectBtn = card.querySelector('.select-btn');
    if (selectBtn && !selectBtn.disabled) {
      selectBtn.textContent = 'Select';
    }
  });
  updateBulkActions();
}

async function loadGames() {
  try {
    await loadOwnedGames();

    const response = await fetch('/api/games');
    allGames = await response.json();
    applyFilters();

    document.getElementById('bulk-add').addEventListener('click', addSelectedToShelf);
    searchInput.addEventListener('input', applyFilters);
    playersSelect.addEventListener('change', applyFilters);
    playtimeSelect.addEventListener('change', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    mechanicSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  } catch (error) {
    console.error('Error loading games:', error);
    document.getElementById('games-container').innerHTML = '<p>Error loading games</p>';
  }
}

loadGames();
