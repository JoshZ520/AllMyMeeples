async function loadShelf() {
  const container = document.getElementById('shelf-games');
  const emptyState = document.getElementById('empty-shelf');
  
  try {
    const response = await fetch('/api/shelf');

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const games = await response.json();

    if (games.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';

    container.innerHTML = games.map(game => {
      const categoryClass = game.categories && game.categories[0] 
        ? 'category-' + game.categories[0].toLowerCase().replace(/\s+/g, '-')
        : '';
      return `
        <article class="card collection-card ${categoryClass}" data-detail-url="/games/${game.id}">
          <div class="card-flip">
            <div class="card-inner">
              <div class="card-face card-front">
                <img src="${game.image_url}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p class="card-meta">
                  ${game.min_players}-${game.max_players} players | ${game.playtime_minutes} min
                </p>
                <p><strong>Rating:</strong> ⭐ ${game.rating || 'N/A'}</p>
              </div>
              <div class="card-face card-back">
                <p class="card-meta">Description</p>
                <p>${game.description || 'A great game to play.'}</p>
                <p class="card-meta">
                  ${game.min_players}-${game.max_players} players | ${game.playtime_minutes} min
                </p>
                <a class="button secondary full-width" href="/games/${game.id}">View details</a>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button class="button primary full-width" data-game-id="${game.id}">
              Remove from Shelf
            </button>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('button, a, input, textarea, select, label')) {
          return;
        }
        const detailUrl = card.dataset.detailUrl;
        if (detailUrl) {
          window.location.href = detailUrl;
        }
      });
    });

    container.querySelectorAll('button[data-game-id]').forEach(button => {
      button.addEventListener('click', () => {
        removeFromShelf(button.dataset.gameId);
      });
    });
  } catch (error) {
    console.error('Error loading shelf:', error);
    const container = document.getElementById('shelf-games');
    const emptyState = document.getElementById('empty-shelf');
    container.style.display = 'none';
    emptyState.innerHTML = `
      <p>Unable to load your collection. Please try refreshing the page.</p>
      <p><a href="/browse" class="button primary">Browse all games</a></p>
    `;
    emptyState.style.display = 'block';
  }
}

async function removeFromShelf(gameId) {
  try {
    const response = await fetch(`/api/games/${gameId}/shelf`, {
      method: 'DELETE'
    });

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return;
    }

    if (response.ok) {
      showStatus('Game removed from shelf!', 'success');
      loadShelf();
    } else {
      showStatus('Failed to remove game', 'error');
    }
  } catch (error) {
    console.error('Error removing from shelf:', error);
    showStatus('Error removing game', 'error');
  }
}

function showStatus(message, type) {
  const status = document.getElementById('collection-status');
  const statusMessage = document.getElementById('status-message');
  statusMessage.textContent = message;
  status.className = `collection-status ${type}`;
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

loadShelf();
