// Theme toggle functionality
function initTheme() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-outline-secondary ms-2';
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = '<i class="fas fa-moon me-1"></i> Dark Mode';

    // Insert theme toggle button after navbar-toggler
    const navbarToggler = document.querySelector('.navbar-toggler');
    navbarToggler.parentNode.insertBefore(themeToggle, navbarToggler.nextSibling);

    const icon = themeToggle.querySelector('i');
    const root = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(!isDark);
    });
}

function updateThemeButton(isDark) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun me-1' : 'fas fa-moon me-1';
    themeToggle.innerHTML = `${icon.outerHTML} ${isDark ? 'Light' : 'Dark'} Mode`;
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);