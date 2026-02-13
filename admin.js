// Angel Art World - Admin Portal JavaScript
// Handles Authorization, Product CRUD, and Inventory

// ===== CONFIGURATION =====
const STORAGE_KEY = 'angelArtWorld_products';
const AUTH_KEY = 'angelArtWorld_auth';
const ADMIN_EMAIL = 'sharmaashmit2327@gmail.com'; // Authorized Email

// ===== STATE =====
let currentProducts = [];
let editingProductId = null;
let deletingProductId = null;
let isAuthenticated = false;

// ===== AUTHORIZATION LOGIC =====

function checkAuth() {
    const session = JSON.parse(localStorage.getItem(AUTH_KEY));
    // Check if session exists and is still valid (optional: add expiry)
    if (session && session.email === ADMIN_EMAIL && session.isLoggedIn) {
        isAuthenticated = true;
        document.getElementById('adminContent').classList.remove('hidden');
        document.getElementById('loginOverlay').classList.add('hidden');
        return true;
    } else {
        showLoginScreen();
        return false;
    }
}

function showLoginScreen() {
    document.getElementById('adminContent').classList.add('hidden');
    const overlay = document.getElementById('loginOverlay');
    overlay.classList.remove('hidden');
    
    // Check if a password has been set yet
    const savedPwd = localStorage.getItem('admin_pwd_hash');
    
    overlay.innerHTML = `
        <div class="bg-noir p-8 rounded-lg border border-gold/30 w-full max-max-w-md shadow-2xl">
            <h2 class="text-2xl font-bold text-gold mb-6 text-center">Admin Access</h2>
            <form id="loginForm" class="space-y-4">
                <div>
                    <label class="block text-gray-400 text-sm mb-1">Email</label>
                    <input type="email" id="loginEmail" required class="w-full bg-black border border-gray-700 rounded p-2 text-white" value="${ADMIN_EMAIL}" readonly>
                </div>
                <div>
                    <label class="block text-gray-400 text-sm mb-1">${savedPwd ? 'Password' : 'Set Admin Password'}</label>
                    <input type="password" id="loginPassword" required class="w-full bg-black border border-gray-700 rounded p-2 text-white" placeholder="••••••••">
                </div>
                <button type="submit" class="w-full bg-gold text-black font-bold py-2 rounded hover:bg-gold/80 transition">
                    ${savedPwd ? 'Login' : 'Initialize Admin Account'}
                </button>
            </form>
            <p id="loginError" class="text-red-500 text-sm mt-4 text-center hidden">Invalid Credentials</p>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    const savedPwd = localStorage.getItem('admin_pwd_hash');

    if (email !== ADMIN_EMAIL) {
        errorMsg.textContent = "Unauthorized Email Address";
        errorMsg.classList.remove('hidden');
        return;
    }

    // First time setup
    if (!savedPwd) {
        localStorage.setItem('admin_pwd_hash', btoa(password)); // Simple encoding for demo
        showNotification('Password set successfully!', 'success');
    } else {
        // Verification
        if (btoa(password) !== savedPwd) {
            errorMsg.textContent = "Incorrect Password";
            errorMsg.classList.remove('hidden');
            return;
        }
    }

    // Grant access
    const session = { email: ADMIN_EMAIL, isLoggedIn: true, timestamp: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    location.reload(); // Refresh to initialize the app
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    location.reload();
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authorization First
    if (!checkAuth()) return;

    // 2. If Auth passes, load products
    currentProducts = getProducts();
    
    renderProductsTable();
    updateDashboardStats();
    initEventListeners();
    
    // Add logout listener if button exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ... [Rest of your existing CRUD and Utility functions remain the same] ...