const form = document.querySelector('.auth-form');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const errorEl = document.getElementById('register-error');

function setError(message) {
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError() {
  if (errorEl) {
    errorEl.textContent = '';
  }
}

function validatePasswords() {
  const password = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();

  if (password.length > 0 && password.length < 6) {
    setError('Password must be at least 6 characters.');
    return false;
  }

  if (confirm.length > 0 && password !== confirm) {
    setError('Passwords do not match.');
    return false;
  }

  clearError();
  return true;
}

passwordInput.addEventListener('input', validatePasswords);
confirmInput.addEventListener('input', validatePasswords);

form.addEventListener('submit', (event) => {
  const isValid = validatePasswords();
  if (!form.checkValidity() || !isValid) {
    event.preventDefault();
    if (!errorEl.textContent) {
      setError('Please fix the errors above.');
    }
  }
});
