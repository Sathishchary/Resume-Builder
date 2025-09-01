// Templates Page JavaScript

// Sample template data
const templatesData = [
    {
        id: 'modern-professional',
        name: 'Modern Professional',
        description: 'Clean and modern design perfect for corporate and tech roles. Features a blue accent color and structured layout.',
        industry: 'technology',
        style: 'modern',
        color: 'blue',
        popular: true,
        premium: false,
        tags: ['ATS-friendly', 'Modern', 'Corporate'],
        previewImage: 'assets/images/templates/modern-professional.png'
    },
    {
        id: 'classic-elegant',
        name: 'Classic Elegant',
        description: 'Timeless design that works well for traditional industries like finance, law, and consulting.',
        industry: 'business',
        style: 'classic',
        color: 'black',
        popular: false,
        premium: false,
        tags: ['Traditional', 'Professional', 'Clean'],
        previewImage: 'assets/images/templates/classic-elegant.png'
    },
    {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        description: 'Bold and creative template for designers, artists, and creative professionals. Showcases your personality.',
        industry: 'creative',
        style: 'creative',
        color: 'purple',
        popular: true,
        premium: true,
        tags: ['Creative', 'Colorful', 'Portfolio'],
        previewImage: 'assets/images/templates/creative-portfolio.png'
    },
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        description: 'Simple and clean design that focuses on content. Perfect for any industry.',
        industry: '',
        style: 'minimal',
        color: 'black',
        popular: false,
        premium: false,
        tags: ['Minimal', 'Clean', 'Versatile'],
        previewImage: 'assets/images/templates/minimal-clean.png'
    },
    {
        id: 'healthcare-professional',
        name: 'Healthcare Professional',
        description: 'Professional template designed specifically for healthcare workers and medical professionals.',
        industry: 'healthcare',
        style: 'modern',
        color: 'green',
        popular: false,
        premium: false,
        tags: ['Healthcare', 'Professional', 'Trust'],
        previewImage: 'assets/images/templates/healthcare-professional.png'
    },
    {
        id: 'education-academic',
        name: 'Education Academic',
        description: 'Academic-focused template perfect for teachers, professors, and education professionals.',
        industry: 'education',
        style: 'classic',
        color: 'blue',
        popular: false,
        premium: false,
        tags: ['Academic', 'Education', 'Professional'],
        previewImage: 'assets/images/templates/education-academic.png'
    },
    {
        id: 'finance-executive',
        name: 'Finance Executive',
        description: 'Executive-level template for finance and banking professionals. Conveys authority and expertise.',
        industry: 'finance',
        style: 'classic',
        color: 'black',
        popular: false,
        premium: true,
        tags: ['Executive', 'Finance', 'Authority'],
        previewImage: 'assets/images/templates/finance-executive.png'
    },
    {
        id: 'tech-developer',
        name: 'Tech Developer',
        description: 'Modern template designed for software developers and tech professionals. Highlights technical skills.',
        industry: 'technology',
        style: 'modern',
        color: 'blue',
        popular: true,
        premium: false,
        tags: ['Developer', 'Tech', 'Skills-focused'],
        previewImage: 'assets/images/templates/tech-developer.png'
    }
];

// Global variables
let filteredTemplates = [...templatesData];
let currentFilters = {
    industry: '',
    style: '',
    color: ''
};

// Initialize templates page
function initializeTemplates() {
    renderTemplates();
    setupFilters();
    setupModal();
    loadTemplatePreviewImages();
}

// Render templates
function renderTemplates() {
    const container = document.getElementById('templatesContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    // Show loading
    loadingSpinner.classList.remove('hidden');
    container.innerHTML = '';
    noResults.classList.add('hidden');
    
    // Simulate loading delay
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
        
        if (filteredTemplates.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }
        
        filteredTemplates.forEach((template, index) => {
            const templateCard = createTemplateCard(template);
            container.appendChild(templateCard);
            
            // Animate cards in
            setTimeout(() => {
                templateCard.classList.add('fade-in');
            }, index * 100);
        });
    }, 500);
}

// Create template card
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = `template-card ${template.popular ? 'popular' : ''}`;
    card.setAttribute('data-template-id', template.id);
    
    card.innerHTML = `
        ${template.premium ? '<div class="premium-badge">Premium</div>' : ''}
        <div class="template-preview-img">
            <img src="${template.previewImage}" alt="${template.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="template-placeholder" style="display: none;">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p>Template Preview</p>
            </div>
            <div class="template-overlay">
                <div class="overlay-buttons">
                    <button class="btn btn-secondary btn-preview" onclick="previewTemplate('${template.id}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        Preview
                    </button>
                    <button class="btn btn-primary" onclick="useTemplate('${template.id}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Use Template
                    </button>
                </div>
            </div>
        </div>
        <div class="template-info">
            <h3 class="template-name">${template.name}</h3>
            <p class="template-description">${template.description}</p>
            <div class="template-tags">
                ${template.industry ? `<span class="template-tag industry">${capitalizeFirst(template.industry)}</span>` : ''}
                ${template.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
            </div>
            <div class="template-actions">
                <button class="btn btn-preview" onclick="previewTemplate('${template.id}')">Preview</button>
                <button class="btn btn-primary btn-use" onclick="useTemplate('${template.id}')">Use Template</button>
            </div>
        </div>
    `;
    
    return card;
}

// Setup filters
function setupFilters() {
    const industryFilter = document.getElementById('industryFilter');
    const styleFilter = document.getElementById('styleFilter');
    const colorFilter = document.getElementById('colorFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    industryFilter.addEventListener('change', () => {
        currentFilters.industry = industryFilter.value;
        applyFilters();
    });
    
    styleFilter.addEventListener('change', () => {
        currentFilters.style = styleFilter.value;
        applyFilters();
    });
    
    colorFilter.addEventListener('change', () => {
        currentFilters.color = colorFilter.value;
        applyFilters();
    });
    
    clearFilters.addEventListener('click', () => {
        industryFilter.value = '';
        styleFilter.value = '';
        colorFilter.value = '';
        currentFilters = { industry: '', style: '', color: '' };
        applyFilters();
    });
}

// Apply filters
function applyFilters() {
    filteredTemplates = templatesData.filter(template => {
        const matchesIndustry = !currentFilters.industry || template.industry === currentFilters.industry;
        const matchesStyle = !currentFilters.style || template.style === currentFilters.style;
        const matchesColor = !currentFilters.color || template.color === currentFilters.color;
        
        return matchesIndustry && matchesStyle && matchesColor;
    });
    
    renderTemplates();
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('templateModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    const overlay = modal.querySelector('.modal-overlay');
    const useTemplateBtn = document.getElementById('useTemplateBtn');
    
    function closeModalHandler() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    closeModal.addEventListener('click', closeModalHandler);
    cancelModal.addEventListener('click', closeModalHandler);
    overlay.addEventListener('click', closeModalHandler);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalHandler();
        }
    });
    
    useTemplateBtn.addEventListener('click', () => {
        const templateId = useTemplateBtn.getAttribute('data-template-id');
        if (templateId) {
            useTemplate(templateId);
            closeModalHandler();
        }
    });
}

// Preview template
function previewTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) return;
    
    const modal = document.getElementById('templateModal');
    const modalTitle = document.getElementById('modalTitle');
    const templatePreview = document.getElementById('templatePreview');
    const templateName = document.getElementById('templateName');
    const templateDescription = document.getElementById('templateDescription');
    const templateTags = document.getElementById('templateTags');
    const useTemplateBtn = document.getElementById('useTemplateBtn');
    
    // Set modal content
    modalTitle.textContent = `${template.name} Preview`;
    templateName.textContent = template.name;
    templateDescription.textContent = template.description;
    
    // Set preview image
    templatePreview.innerHTML = `
        <img src="${template.previewImage}" alt="${template.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="template-placeholder" style="display: none;">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>Template Preview</p>
        </div>
    `;
    
    // Set tags
    templateTags.innerHTML = `
        ${template.industry ? `<span class="template-tag industry">${capitalizeFirst(template.industry)}</span>` : ''}
        ${template.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
        ${template.premium ? '<span class="template-tag" style="background: #fbbf24; color: white;">Premium</span>' : ''}
    `;
    
    // Set use template button
    useTemplateBtn.setAttribute('data-template-id', templateId);
    useTemplateBtn.innerHTML = template.premium ? 
        '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Upgrade to Use' :
        '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Use This Template';
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Use template
function useTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) {
        Utils.showNotification('Template not found', 'error');
        return;
    }
    
    if (template.premium && !App.currentUser?.isPremium) {
        Utils.showNotification('This template requires a premium subscription', 'warning');
        // Here you would typically show upgrade modal
        return;
    }
    
    // Save selected template to app state
    App.selectedTemplate = template;
    saveUserData();
    
    Utils.showNotification(`Selected ${template.name} template`, 'success');
    
    // Redirect to builder
    setTimeout(() => {
        window.location.href = 'builder.html';
    }, 1000);
}

// Load template preview images (placeholder function)
function loadTemplatePreviewImages() {
    // In a real application, this would load actual template preview images
    // For now, we'll use placeholder images or generate them dynamically
    console.log('Loading template preview images...');
}

// Utility function
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Search functionality (can be added later)
function searchTemplates(query) {
    const searchResults = templatesData.filter(template => 
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    filteredTemplates = searchResults;
    renderTemplates();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initializeTemplates, 
        previewTemplate, 
        useTemplate,
        searchTemplates,
        templatesData 
    };
}