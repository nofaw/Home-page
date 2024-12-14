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
        const siteStructure = {
    'home': {
        url: '/',
        title: 'Trang chủ',
        content: null
    },

    'assets': {
        url: '/assets',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'exness': {
        url: '/assets/exness',
        title: 'Mở tài khoản giao dịch',
        content: null
    },

    'news': {
        url: '/news',
        title: 'Tin tức',
        content: null
    },

    'apps': {
        url: '/apps',
        title: 'Ứng dụng giao dịch',
        content: null
    },

    'events': {
        url: '/events',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'ema': {
        url: '/assets/ema',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'forex': {
        url: '/assets/forex',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'indicators': {
        url: '/assets/indicators',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'meta': {
        url: '/assets/meta',
        title: 'Dữ liệu kiến thức',
        content: null
    },
 
    'risk': {
        url: '/assets/risk',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'support': {
        url: '/assets/support',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'trend': {
        url: '/assets/trend',
        title: 'Dữ liệu kiến thức',
        content: null
    },

    'cpi': {
        url: '/events/cpi',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'fed': {
        url: '/events/fed',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'fomc': {
        url: '/events/fomc',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'gdp': {
        url: '/events/gdp',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'ism': {
        url: '/events/ism',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'ppi': {
        url: '/events/ppi',
        title: 'Sự kiện kinh tế',
        content: null
    },

    'nonfarm': {
        url: '/events/nonfarm',
        title: 'Sự kiện kinh tế',
        content: null
    }

};

// Lưu trữ cache
const pageCache = new Map();

// Hàm tải nội dung trang
async function fetchPageContent(url) {
    if (pageCache.has(url)) {
        return pageCache.get(url);
    }
    
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Lấy nội dung chính
        const content = doc.querySelector('.main-content')?.textContent || '';
        const title = doc.querySelector('title')?.textContent || '';
        const description = doc.querySelector('meta[name="description"]')?.content || '';
        
        const pageData = {
            title,
            description,
            content: content.toLowerCase(),
            url
        };
        
        pageCache.set(url, pageData);
        return pageData;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

// Hàm tìm kiếm
async function searchContent(query) {
    query = query.toLowerCase();
    const results = [];
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    loadingIndicator.style.display = 'block';
    
    // Tìm kiếm trong tất cả các trang
    for (const page of Object.values(siteStructure)) {
        const pageData = await fetchPageContent(page.url);
        if (pageData && (
            pageData.title.toLowerCase().includes(query) ||
            pageData.description.toLowerCase().includes(query) ||
            pageData.content.includes(query)
        )) {
            results.push({
                title: pageData.title,
                url: page.url,
                snippet: generateSnippet(pageData.content, query)
            });
        }
    }
    
    loadingIndicator.style.display = 'none';
    return results;
}

// Tạo đoạn trích cho kết quả tìm kiếm
function generateSnippet(content, query) {
    const snippetLength = 150;
    const index = content.indexOf(query);
    if (index === -1) return '';
    
    const start = Math.max(0, index - snippetLength / 2);
    const end = Math.min(content.length, index + query.length + snippetLength / 2);
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet.replace(
        new RegExp(query, 'gi'),
        match => `<span class="search-highlight">${match}</span>`
    );
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(results, query) {
    const container = document.querySelector('.search-results-container');
    const content = document.querySelector('.search-results-content');
    const stats = document.querySelector('.search-stats');
    
    content.innerHTML = '';
    stats.textContent = `Tìm thấy ${results.length} kết quả cho "${query}"`;
    
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result-item';
        resultElement.innerHTML = `
            <a href="${result.url}" class="search-result-title">${result.title}</a>
            <div class="search-result-snippet">${result.snippet}</div>
            <div class="search-result-url">${window.location.origin}${result.url}</div>
        `;
        content.appendChild(resultElement);
    });
    
    container.style.display = 'block';
}

// Khởi tạo tìm kiếm
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const closeButton = document.querySelector('.close-search');
    const searchContainer = document.querySelector('.search-results-container');
    
    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }
        
        const results = await searchContent(query);
        displaySearchResults(results, query);
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') performSearch();
    });
    
    closeButton.addEventListener('click', () => {
        searchContainer.style.display = 'none';
    });
    
    // Đóng khi click outside
    searchContainer.addEventListener('click', e => {
        if (e.target === searchContainer) {
            searchContainer.style.display = 'none';
        }
    });
    
    // Đóng khi nhấn ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && searchContainer.style.display === 'block') {
            searchContainer.style.display = 'none';
        }
    });
}

// Khởi tạo khi trang load xong
document.addEventListener('DOMContentLoaded', initializeSearch);
