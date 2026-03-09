const selection = new Set();
let ownedIds = new Set();
let allGames = [];

const searchInput = document.getElementById('search-games');
const playersSelect = document.getElementById('filter-players');
const playtimeSelect = document.getElementById('filter-playtime');
const sortSelect = document.getElementById('sort-by');

async function loadOwnedGames() {
  try {
    const response = await fetch('/api/shelf');
    if (response.status === 401) {
      document.getElementById('collection-count').textContent = '--';
      document.getElementById('login-hint').style.display = 'block';
      return;
    }

    const games = await response.json();
    ownedIds = new Set(games.map(game => String(game.id)));
    document.getElementById('collection-count').textContent = games.length;
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
    return `
      <article class="card browse-card ${isOwned ? 'owned' : ''}" data-game-id="${game.id}">
        <div class="card-badges">
          ${isOwned ? '<span class="badge owned">Owned</span>' : ''}
        </div>
        <img src="${game.image_url}" alt="${game.title}">
        <h3>${game.title}</h3>
        <p class="card-meta">
          ${game.min_players}-${game.max_players} players | ${game.playtime_minutes} min
        </p>
        <p>${game.description || ''}</p>
        <p><strong>Rating:</strong> ⭐ ${game.rating || 'N/A'}</p>
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

  const filtered = allGames.filter(game => {
    const textMatch = !searchText ||
      game.title.toLowerCase().includes(searchText) ||
      (game.description || '').toLowerCase().includes(searchText);

    const playersMatch = !playersValue ||
      (game.min_players <= playersValue && game.max_players >= playersValue);

    const playtimeMatch = !playtimeValue || game.playtime_minutes <= playtimeValue;

    return textMatch && playersMatch && playtimeMatch;
  });

  const sortValue = sortSelect.value;

  filtered.sort((a, b) => {
    switch (sortValue) {
        case 'title-desc':
            return b.title.localeCompare(a.title);
        case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
        case 'playtime-asc':
            return (a.playtime_minutes || 0) - (b.playtime_minutes || 0);
        case 'playtime-desc':
            return (b.playtime_minutes || 0) - (a.playtime_minutes || 0);
        default:
            return a.title.localeCompare(b.title);
    }
  });

  renderGames(filtered);
}

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
    sortSelect.addEventListener('change', applyFilters);
  } catch (error) {
    console.error('Error loading games:', error);
    document.getElementById('games-container').innerHTML = '<p>Error loading games</p>';
  }
}

loadGames();
