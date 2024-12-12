// Load components
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('/components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header').innerHTML = data;
            initializeMenu();
            initializeSearch();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header').innerHTML = 'Error loading header';
        });

    // Load footer
    fetch('/components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            document.getElementById('footer').innerHTML = 'Error loading footer';
        });
});

// Menu functionality
function initializeMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.nav-overlay');
    const body = document.body;
    let scrollPosition = 0;

    function toggleMenu() {
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        menuIcon.textContent = navMenu.classList.contains('active') ? '×' : '☰';
        
        if (navMenu.classList.contains('active')) {
            // Save current scroll position
            scrollPosition = window.pageYOffset;
            // Add class to lock scroll
            body.classList.add('menu-open');
            // Fix position at current scroll
            body.style.top = `-${scrollPosition}px`;
        } else {
            // Remove scroll lock
            body.classList.remove('menu-open');
            // Restore scroll position
            body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }
    }

    // Menu toggle event listeners
    menuIcon?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && 
            !menuIcon.contains(e.target) && 
            navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        
        if (!query) {
            alert('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }

        let matchCount = 0;
        let firstMatch = null;

        contentElements.forEach(element => {
            element.style.backgroundColor = '';
            if (element.textContent.toLowerCase().includes(query)) {
                element.style.backgroundColor = 'yellow';
                matchCount++;
                if (!firstMatch) firstMatch = element;
            }
        });

        if (matchCount > 0) {
            alert(`Tìm thấy ${matchCount} kết quả`);
            firstMatch.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        } else {
            alert('Không tìm thấy kết quả nào');
        }
    }

    // Search button click
    searchButton?.addEventListener('click', performSearch);

    // Search on Enter key
    searchInput?.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

// Handle loading errors
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

// Prevent zooming on mobile devices
document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });
