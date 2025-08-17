// VinShik Dashboard JavaScript
// Production-ready interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeSidebar();
    initializeCards();
    initializeNotifications();
    initializeResponsiveFeatures();
    initializeAnimations();
});

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
    const toggleBtn = document.createElement('button');
    
    // Create mobile toggle button
    toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    `;
    toggleBtn.className = 'mobile-menu-toggle fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
    document.body.appendChild(toggleBtn);

    // Sidebar toggle functionality
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-open');
        document.body.classList.toggle('sidebar-overlay');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 1024 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('sidebar-open');
            document.body.classList.remove('sidebar-overlay');
        }
    });

    // Active state management
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update content based on selection
            updateMainContent(this.textContent.trim());
        });
    });
}

// Card interactions
function initializeCards() {
    const cards = document.querySelectorAll('.cards-container article');
    
    cards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });

        // Add click functionality
        card.addEventListener('click', function() {
            const title = this.querySelector('p').textContent;
            showDetailModal(title);
        });
    });
}

// Notification system
function initializeNotifications() {
    const notificationBtn = document.querySelector('button[aria-label="Messages"]');
    const notificationDot = notificationBtn.querySelector('span');
    
    // Simulate notification updates
    setInterval(() => {
        const hasNotification = Math.random() > 0.7;
        notificationDot.style.display = hasNotification ? 'block' : 'none';
    }, 30000);
}

// Responsive features
function initializeResponsiveFeatures() {
    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('sidebar-open');
            document.body.classList.remove('sidebar-overlay');
        }
    });

    // Touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const sidebar = document.querySelector('.sidebar');
        if (touchEndX - touchStartX > 50 && window.innerWidth < 1024) {
            sidebar.classList.add('sidebar-open');
            document.body.classList.add('sidebar-overlay');
        }
        if (touchStartX - touchEndX > 50 && window.innerWidth < 1024) {
            sidebar.classList.remove('sidebar-open');
            document.body.classList.remove('sidebar-overlay');
        }
    }
}

// Animation system
function initializeAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.cards-container article').forEach(card => {
        observer.observe(card);
    });

    // Add CSS animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Content update functions
function updateMainContent(section) {
    const contentArea = document.querySelector('section.flex-1');
    const title = contentArea.querySelector('h1');
    
    // Update title based on section
    switch(section) {
        case 'Home':
            title.innerHTML = 'Welcome back, Julie <span aria-label="waving hand" role="img">👋</span>';
            break;
        case 'Calendar':
            title.innerHTML = 'Calendar Overview <span aria-label="calendar" role="img">📅</span>';
            loadCalendarContent();
            break;
        case 'Map':
            title.innerHTML = 'Service Locations <span aria-label="map" role="img">🗺️</span>';
            loadMapContent();
            break;
        case 'Clients':
            title.innerHTML = 'Client Management <span aria-label="users" role="img">👥</span>';
            loadClientsContent();
            break;
        default:
            title.innerHTML = `${section} <span aria-label="section icon" role="img">📊</span>`;
    }
}

// Modal functionality
function showDetailModal(title) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <h3 class="text-lg font-semibold mb-4">${title} Details</h3>
            <p class="text-gray-600 mb-4">Detailed information about ${title.toLowerCase()} will be displayed here.</p>
            <button class="close-modal bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            document.body.removeChild(modal);
        }
    });
}

// Utility functions
function loadCalendarContent() {
    // Placeholder for calendar functionality
    console.log('Loading calendar...');
}

function loadMapContent() {
    // Placeholder for map functionality
    console.log('Loading map...');
}

function loadClientsContent() {
    // Placeholder for clients functionality
    console.log('Loading clients...');
}

// Data simulation
function updateCardData() {
    const cards = document.querySelectorAll('.cards-container article');
    cards.forEach(card => {
        const value = card.querySelector('.font-extrabold');
        if (value) {
            const currentValue = parseFloat(value.textContent.replace(/[^0-9.]/g, ''));
            const newValue = (currentValue + (Math.random() - 0.5) * 1000).toFixed(1);
            value.textContent = newValue + 'k';
        }
    });
}

// Initialize data updates every 30 seconds
setInterval(updateCardData, 30000);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeSidebar,
        initializeCards,
        updateCardData
    };
}
