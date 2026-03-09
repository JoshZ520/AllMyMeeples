async function loadShelf() {
  try {
    const response = await fetch('/api/shelf');

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return;
    }

    const games = await response.json();
    const container = document.getElementById('shelf-games');
    const emptyState = document.getElementById('empty-shelf');

    if (games.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    container.innerHTML = games.map(game => `
      <article class="card">
        <img src="${game.image_url}" alt="${game.title}">
        <h3>${game.title}</h3>
        <p class="card-meta">
          ${game.min_players}-${game.max_players} players | ${game.playtime_minutes} min
        </p>
        <p>${game.description || 'A great game to play.'}</p>
        <p><strong>Rating:</strong> ⭐ ${game.rating || 'N/A'}</p>
        <button class="button primary full-width" data-game-id="${game.id}">
          Remove from Shelf
        </button>
      </article>
    `).join('');

    container.querySelectorAll('button[data-game-id]').forEach(button => {
      button.addEventListener('click', () => {
        removeFromShelf(button.dataset.gameId);
      });
    });
  } catch (error) {
    console.error('Error loading shelf:', error);
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
