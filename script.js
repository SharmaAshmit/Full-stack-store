// Angel Art World - Main JavaScript
// Handles product display, form submission, and UI interactions

// ===== CONFIGURATION =====
const STORAGE_KEY = 'angelArtWorld_products';

// ===== DEFAULT PRODUCTS DATA =====
// Initialize with sample products if none exist
const defaultProducts = [
    {
        id: '1',
        name: 'Premium Cotton Canvas',
        sku: 'CAN-001',
        category: 'canvases',
        categoryName: 'Professional Canvases',
        description: 'Triple-primed, museum-quality cotton canvas. Perfect surface tension for oils and acrylics.',
        stock: 150,
        minStock: 20,
        unit: 'rolls',
        icon: 'layers'
    },
    {
        id: '2',
        name: 'Kolinsky Sable Brush Set',
        sku: 'BRU-001',
        category: 'brushes',
        categoryName: 'Fine Art Brushes',
        description: 'Hand-crafted brushes from premium Kolinsky sable hair. Exceptional spring and control.',
        stock: 85,
        minStock: 15,
        unit: 'sets',
        icon: 'brush'
    },
    {
        id: '3',
        name: 'Artist Grade Oil Pigments',
        sku: 'PIG-001',
        category: 'pigments',
        categoryName: 'Pigments & Oils',
        description: 'Highly concentrated pigments with superior lightfastness. Rich, vibrant colors.',
        stock: 220,
        minStock: 30,
        unit: 'tubes',
        icon: 'palette'
    },
    {
        id: '4',
        name: 'Professional Graphite Set',
        sku: 'SKE-001',
        category: 'sketching',
        categoryName: 'Sketching Tools',
        description: 'Premium graphite pencils ranging from 9H to 9B. Smooth, consistent laydown.',
        stock: 5,
        minStock: 10,
        unit: 'sets',
        icon: 'pen-tool'
    }
];

// ===== UTILITY FUNCTIONS =====

// Get products from localStorage or return defaults
function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored products:', e);
            return defaultProducts;
        }
    }
    // Initialize with defaults on first visit
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

// Get stock status
function getStockStatus(product) {
    if (product.stock === 0) {
        return { status: 'Out of Stock', class: 'bg-red-900/30 text-red-400 border-red-700' };
    } else if (product.stock <= product.minStock) {
        return { status: 'Low Stock', class: 'bg-yellow-900/30 text-yellow-400 border-yellow-700' };
    } else {
        return { status: 'In Stock', class: 'bg-green-900/30 text-green-400 border-green-700' };
    }
}

// ===== PRODUCT DISPLAY =====

// Group products by category
function groupProductsByCategory(products) {
    const grouped = {};
    products.forEach(product => {
        if (!grouped[product.category]) {
            grouped[product.category] = {
                name: product.categoryName,
                products: []
            };
        }
        grouped[product.category].products.push(product);
    });
    return grouped;
}

// Render products on the main page
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    const products = getProducts();
    const grouped = groupProductsByCategory(products);

    productGrid.innerHTML = '';

    // Render products grouped by category
    Object.keys(grouped).forEach(categoryKey => {
        const category = grouped[categoryKey];
        
        // Get one product from this category to display as representative
        const representativeProduct = category.products[0];
        const stockStatus = getStockStatus(representativeProduct);
        
        const card = document.createElement('div');
        card.className = 'product-card bg-noir-light p-8 rounded-lg border border-noir-lighter cursor-pointer';
        card.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="mb-6">
                    <i data-lucide="${representativeProduct.icon || 'package'}" class="w-16 h-16 text-gold mb-4"></i>
                </div>
                <h4 class="text-2xl font-semibold mb-3">${category.name}</h4>
                <p class="text-gray-400 mb-4 flex-grow">${representativeProduct.description}</p>
                <div class="space-y-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-400">Available Items:</span>
                        <span class="font-semibold text-gold">${category.products.length}</span>
                    </div>
                    <div class="pt-3 border-t border-noir-lighter">
                        <span class="inline-block px-3 py-1 rounded text-xs font-semibold border ${stockStatus.class}">
                            ${stockStatus.status}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        productGrid.appendChild(card);
    });

    // Re-initialize Lucide icons for dynamically added content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ===== FORM HANDLING =====

// Handle inquiry form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner mx-auto"></div>';
    submitBtn.disabled = true;
    
    // Simulate form submission (in production, this would send to a server)
    setTimeout(() => {
        // Store inquiry in localStorage for demo purposes
        const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        inquiries.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        
        // Show success message
        const messageDiv = document.getElementById('formMessage');
        messageDiv.className = 'mt-4 text-center p-4 bg-green-900/30 text-green-400 border border-green-700 rounded';
        messageDiv.textContent = 'Thank you for your inquiry! We will contact you within 24 hours.';
        messageDiv.classList.remove('hidden');
        
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }, 1500);
}

// ===== MOBILE MENU =====

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking on a link
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// ===== SMOOTH SCROLL =====

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed header
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    // Render products
    renderProducts();
    
    // Initialize form handler
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ===== EXPORT FOR ADMIN USE =====
window.angelArtWorld = {
    getProducts,
    STORAGE_KEY,
    defaultProducts
};
