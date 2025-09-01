// Resume Builder JavaScript

// Resume data structure
const resumeData = {
    personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
    },
    summary: {
        jobTitle: '',
        summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    achievements: []
};

// Current state
let currentSection = 'personal';
let autoSaveEnabled = true;
let autoSaveTimeout = null;

// Initialize builder
function initializeBuilder() {
    setupSectionNavigation();
    setupFormHandlers();
    setupAutoSave();
    setupDynamicSections();
    setupAIAssistant();
    loadResumeData();
    updateProgress();
    
    // Add first items for dynamic sections
    addExperienceItem();
    addEducationItem();
    addAchievementItem();
}

// Setup section navigation
function setupSectionNavigation() {
    const navSections = document.querySelectorAll('.nav-section');
    const prevBtn = document.getElementById('prevSectionBtn');
    const nextBtn = document.getElementById('nextSectionBtn');
    
    navSections.forEach(section => {
        section.addEventListener('click', () => {
            const sectionName = section.getAttribute('data-section');
            switchToSection(sectionName);
        });
    });
    
    prevBtn.addEventListener('click', navigatePrevious);
    nextBtn.addEventListener('click', navigateNext);
}

// Switch to section
function switchToSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-section').forEach(nav => {
        nav.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Update section title
    const sectionTitle = document.getElementById('sectionTitle');
    const titles = {
        personal: 'Personal Information',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
        achievements: 'Achievements & Certifications'
    };
    sectionTitle.textContent = titles[sectionName] || sectionName;
    
    // Update current section
    currentSection = sectionName;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update AI suggestions
    updateAISuggestions(sectionName);
}

// Setup form handlers
function setupFormHandlers() {
    // Personal form
    const personalForm = document.getElementById('personalForm');
    if (personalForm) {
        personalForm.addEventListener('input', handlePersonalInput);
    }
    
    // Summary form
    const summaryForm = document.getElementById('summaryForm');
    if (summaryForm) {
        summaryForm.addEventListener('input', handleSummaryInput);
        
        // Character counter for summary
        const summaryTextarea = document.getElementById('summary');
        const charCount = summaryTextarea.parentElement.querySelector('.character-count');
        summaryTextarea.addEventListener('input', () => {
            const length = summaryTextarea.value.length;
            charCount.textContent = `${length} / 300 characters`;
            charCount.style.color = length > 300 ? '#ef4444' : 'var(--text-muted)';
        });
    }
    
    // Skills form
    setupSkillsHandler();
}

// Handle personal information input
function handlePersonalInput(event) {
    const field = event.target;
    resumeData.personal[field.name] = field.value;
    scheduleAutoSave();
    updateProgress();
}

// Handle summary input
function handleSummaryInput(event) {
    const field = event.target;
    resumeData.summary[field.name] = field.value;
    scheduleAutoSave();
    updateProgress();
}

// Setup skills handler
function setupSkillsHandler() {
    const skillInput = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkillBtn');
    
    if (skillInput && addSkillBtn) {
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
        
        addSkillBtn.addEventListener('click', addSkill);
    }
}

// Add skill
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skillsContainer = document.getElementById('skillsContainer');
    const skillText = skillInput.value.trim();
    
    if (skillText && !resumeData.skills.includes(skillText)) {
        resumeData.skills.push(skillText);
        
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skillText}
            <button type="button" class="remove-skill" onclick="removeSkill('${skillText}')">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
        
        skillsContainer.appendChild(skillTag);
        skillInput.value = '';
        scheduleAutoSave();
        updateProgress();
    }
}

// Remove skill
function removeSkill(skillText) {
    const index = resumeData.skills.indexOf(skillText);
    if (index > -1) {
        resumeData.skills.splice(index, 1);
        
        // Remove from DOM
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            if (tag.textContent.trim().replace('×', '').trim() === skillText) {
                tag.remove();
            }
        });
        
        scheduleAutoSave();
        updateProgress();
    }
}

// Setup dynamic sections
function setupDynamicSections() {
    // Experience
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperienceItem);
    }
    
    // Education
    const addEducationBtn = document.getElementById('addEducationBtn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', addEducationItem);
    }
    
    // Achievements
    const addAchievementBtn = document.getElementById('addAchievementBtn');
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', addAchievementItem);
    }
}

// Add experience item
function addExperienceItem() {
    const container = document.getElementById('experienceContainer');
    const index = resumeData.experience.length;
    
    const experienceItem = {
        id: Utils.generateId(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    };
    
    resumeData.experience.push(experienceItem);
    
    const itemElement = document.createElement('div');
    itemElement.className = 'dynamic-item';
    itemElement.setAttribute('data-id', experienceItem.id);
    itemElement.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Experience ${index + 1}</span>
            <div class="item-actions">
                <button type="button" class="btn btn-secondary btn-icon drag-handle">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-danger btn-icon" onclick="removeExperienceItem('${experienceItem.id}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
        <form class="resume-form">
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Job Title *</label>
                    <input type="text" class="form-input" name="title" placeholder="e.g., Software Engineer" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Company *</label>
                    <input type="text" class="form-input" name="company" placeholder="e.g., Tech Corp" required>
                </div>
            </div>
            
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-input" name="location" placeholder="e.g., San Francisco, CA">
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" name="current" style="margin-right: 0.5rem;">
                        I currently work here
                    </label>
                </div>
            </div>
            
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="month" class="form-input" name="startDate">
                </div>
                <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="month" class="form-input" name="endDate">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-input form-textarea" name="description" rows="4" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
        </form>
    `;
    
    container.appendChild(itemElement);
    
    // Add event listeners
    const form = itemElement.querySelector('form');
    form.addEventListener('input', (e) => handleExperienceInput(e, experienceItem.id));
    
    // Handle current job checkbox
    const currentCheckbox = form.querySelector('input[name="current"]');
    const endDateInput = form.querySelector('input[name="endDate"]');
    
    currentCheckbox.addEventListener('change', () => {
        endDateInput.disabled = currentCheckbox.checked;
        if (currentCheckbox.checked) {
            endDateInput.value = '';
        }
        handleExperienceInput({ target: currentCheckbox }, experienceItem.id);
    });
}

// Handle experience input
function handleExperienceInput(event, itemId) {
    const field = event.target;
    const item = resumeData.experience.find(exp => exp.id === itemId);
    
    if (item) {
        if (field.type === 'checkbox') {
            item[field.name] = field.checked;
        } else {
            item[field.name] = field.value;
        }
        scheduleAutoSave();
        updateProgress();
    }
}

// Remove experience item
function removeExperienceItem(itemId) {
    const index = resumeData.experience.findIndex(exp => exp.id === itemId);
    if (index > -1) {
        resumeData.experience.splice(index, 1);
        
        const element = document.querySelector(`[data-id="${itemId}"]`);
        if (element) {
            element.remove();
        }
        
        scheduleAutoSave();
        updateProgress();
    }
}

// Add education item
function addEducationItem() {
    const container = document.getElementById('educationContainer');
    const index = resumeData.education.length;
    
    const educationItem = {
        id: Utils.generateId(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        graduationDate: '',
        gpa: ''
    };
    
    resumeData.education.push(educationItem);
    
    const itemElement = document.createElement('div');
    itemElement.className = 'dynamic-item';
    itemElement.setAttribute('data-id', educationItem.id);
    itemElement.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Education ${index + 1}</span>
            <div class="item-actions">
                <button type="button" class="btn btn-secondary btn-icon drag-handle">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-danger btn-icon" onclick="removeEducationItem('${educationItem.id}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
        <form class="resume-form">
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Institution *</label>
                    <input type="text" class="form-input" name="institution" placeholder="e.g., University of California" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Degree *</label>
                    <input type="text" class="form-input" name="degree" placeholder="e.g., Bachelor of Science" required>
                </div>
            </div>
            
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Field of Study</label>
                    <input type="text" class="form-input" name="field" placeholder="e.g., Computer Science">
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-input" name="location" placeholder="e.g., Berkeley, CA">
                </div>
            </div>
            
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Graduation Date</label>
                    <input type="month" class="form-input" name="graduationDate">
                </div>
                <div class="form-group">
                    <label class="form-label">GPA (Optional)</label>
                    <input type="text" class="form-input" name="gpa" placeholder="e.g., 3.8/4.0">
                </div>
            </div>
        </form>
    `;
    
    container.appendChild(itemElement);
    
    // Add event listeners
    const form = itemElement.querySelector('form');
    form.addEventListener('input', (e) => handleEducationInput(e, educationItem.id));
}

// Handle education input
function handleEducationInput(event, itemId) {
    const field = event.target;
    const item = resumeData.education.find(edu => edu.id === itemId);
    
    if (item) {
        item[field.name] = field.value;
        scheduleAutoSave();
        updateProgress();
    }
}

// Remove education item
function removeEducationItem(itemId) {
    const index = resumeData.education.findIndex(edu => edu.id === itemId);
    if (index > -1) {
        resumeData.education.splice(index, 1);
        
        const element = document.querySelector(`[data-id="${itemId}"]`);
        if (element) {
            element.remove();
        }
        
        scheduleAutoSave();
        updateProgress();
    }
}

// Add achievement item
function addAchievementItem() {
    const container = document.getElementById('achievementsContainer');
    const index = resumeData.achievements.length;
    
    const achievementItem = {
        id: Utils.generateId(),
        title: '',
        issuer: '',
        date: '',
        description: ''
    };
    
    resumeData.achievements.push(achievementItem);
    
    const itemElement = document.createElement('div');
    itemElement.className = 'dynamic-item';
    itemElement.setAttribute('data-id', achievementItem.id);
    itemElement.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Achievement ${index + 1}</span>
            <div class="item-actions">
                <button type="button" class="btn btn-secondary btn-icon drag-handle">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-danger btn-icon" onclick="removeAchievementItem('${achievementItem.id}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
        <form class="resume-form">
            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Title *</label>
                    <input type="text" class="form-input" name="title" placeholder="e.g., AWS Certified Solutions Architect" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Issuer</label>
                    <input type="text" class="form-input" name="issuer" placeholder="e.g., Amazon Web Services">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="month" class="form-input" name="date">
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-input form-textarea" name="description" rows="3" placeholder="Brief description of the achievement..."></textarea>
            </div>
        </form>
    `;
    
    container.appendChild(itemElement);
    
    // Add event listeners
    const form = itemElement.querySelector('form');
    form.addEventListener('input', (e) => handleAchievementInput(e, achievementItem.id));
}

// Handle achievement input
function handleAchievementInput(event, itemId) {
    const field = event.target;
    const item = resumeData.achievements.find(ach => ach.id === itemId);
    
    if (item) {
        item[field.name] = field.value;
        scheduleAutoSave();
        updateProgress();
    }
}

// Remove achievement item
function removeAchievementItem(itemId) {
    const index = resumeData.achievements.findIndex(ach => ach.id === itemId);
    if (index > -1) {
        resumeData.achievements.splice(index, 1);
        
        const element = document.querySelector(`[data-id="${itemId}"]`);
        if (element) {
            element.remove();
        }
        
        scheduleAutoSave();
        updateProgress();
    }
}

// Setup auto-save
function setupAutoSave() {
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    if (autoSaveToggle) {
        autoSaveToggle.addEventListener('click', toggleAutoSave);
    }
}

// Toggle auto-save
function toggleAutoSave() {
    autoSaveEnabled = !autoSaveEnabled;
    const toggle = document.getElementById('autoSaveToggle');
    
    if (autoSaveEnabled) {
        toggle.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            Auto-save: ON
        `;
        toggle.classList.remove('btn-secondary');
        toggle.classList.add('btn-primary');
    } else {
        toggle.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Auto-save: OFF
        `;
        toggle.classList.remove('btn-primary');
        toggle.classList.add('btn-secondary');
    }
}

// Schedule auto-save
function scheduleAutoSave() {
    if (!autoSaveEnabled) return;
    
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    
    autoSaveTimeout = setTimeout(() => {
        saveResumeData();
        showAutoSaveIndicator();
    }, 2000);
}

// Show auto-save indicator
function showAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'autosave-indicator';
    indicator.textContent = 'Auto-saved';
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.classList.add('show'), 100);
    setTimeout(() => {
        indicator.classList.remove('show');
        setTimeout(() => document.body.removeChild(indicator), 300);
    }, 2000);
}

// Update progress
function updateProgress() {
    const sections = ['personal', 'summary', 'experience', 'education', 'skills', 'achievements'];
    let completedSections = 0;
    let totalProgress = 0;
    
    sections.forEach(section => {
        const completion = getSectionCompletion(section);
        const indicator = document.getElementById(`${section}-indicator`);
        
        if (completion >= 100) {
            completedSections++;
            indicator.classList.add('complete');
            indicator.classList.remove('partial');
        } else if (completion > 0) {
            indicator.classList.add('partial');
            indicator.classList.remove('complete');
        } else {
            indicator.classList.remove('complete', 'partial');
        }
        
        totalProgress += completion;
    });
    
    const overallProgress = Math.round(totalProgress / sections.length);
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    progressFill.style.width = `${overallProgress}%`;
    progressPercent.textContent = `${overallProgress}%`;
}

// Get section completion percentage
function getSectionCompletion(section) {
    switch (section) {
        case 'personal':
            const requiredPersonal = ['firstName', 'lastName', 'email'];
            const filledPersonal = requiredPersonal.filter(field => resumeData.personal[field]).length;
            return Math.round((filledPersonal / requiredPersonal.length) * 100);
            
        case 'summary':
            return resumeData.summary.summary ? 100 : 0;
            
        case 'experience':
            if (resumeData.experience.length === 0) return 0;
            const validExperience = resumeData.experience.filter(exp => exp.title && exp.company).length;
            return Math.round((validExperience / resumeData.experience.length) * 100);
            
        case 'education':
            if (resumeData.education.length === 0) return 0;
            const validEducation = resumeData.education.filter(edu => edu.institution && edu.degree).length;
            return Math.round((validEducation / resumeData.education.length) * 100);
            
        case 'skills':
            return resumeData.skills.length > 0 ? 100 : 0;
            
        case 'achievements':
            return resumeData.achievements.length > 0 ? 100 : 0;
            
        default:
            return 0;
    }
}

// Navigation
function navigatePrevious() {
    const sections = ['personal', 'summary', 'experience', 'education', 'skills', 'achievements'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
        switchToSection(sections[currentIndex - 1]);
    }
}

function navigateNext() {
    const sections = ['personal', 'summary', 'experience', 'education', 'skills', 'achievements'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        switchToSection(sections[currentIndex + 1]);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const sections = ['personal', 'summary', 'experience', 'education', 'skills', 'achievements'];
    const currentIndex = sections.indexOf(currentSection);
    const prevBtn = document.getElementById('prevSectionBtn');
    const nextBtn = document.getElementById('nextSectionBtn');
    
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === sections.length - 1;
    
    if (currentIndex === sections.length - 1) {
        nextBtn.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Preview Resume
        `;
    } else {
        nextBtn.innerHTML = `
            Next
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
        `;
    }
}

// Setup AI assistant
function setupAIAssistant() {
    const aiSuggestBtn = document.getElementById('aiSuggestBtn');
    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener('click', getAISuggestions);
    }
}

// Get AI suggestions
function getAISuggestions() {
    const aiSuggestions = document.getElementById('aiSuggestions');
    const currentData = getCurrentSectionData();
    
    // Show loading
    aiSuggestions.innerHTML = `
        <div class="ai-thinking">
            <div class="spinner"></div>
            Generating AI suggestions...
        </div>
    `;
    
    // Simulate AI processing
    setTimeout(() => {
        const suggestions = generateSuggestions(currentSection, currentData);
        displaySuggestions(suggestions);
    }, 2000);
}

// Generate suggestions based on section and data
function generateSuggestions(section, data) {
    const suggestions = {
        personal: [
            "Add a professional email address for better credibility",
            "Include your LinkedIn profile to showcase your network",
            "Consider adding your location if relevant to the job"
        ],
        summary: [
            "Start with your years of experience and key skills",
            "Mention 2-3 quantifiable achievements",
            "Include industry-specific keywords for ATS optimization"
        ],
        experience: [
            "Use action verbs to start each bullet point",
            "Quantify your achievements with numbers and percentages",
            "Focus on accomplishments rather than just responsibilities"
        ],
        education: [
            "Include relevant coursework if you're a recent graduate",
            "Add your GPA if it's 3.5 or higher",
            "Mention any academic honors or distinctions"
        ],
        skills: [
            "Group skills by category (Technical, Soft Skills, etc.)",
            "Include both hard and soft skills relevant to your field",
            "Add skill levels if appropriate (Beginner, Intermediate, Expert)"
        ],
        achievements: [
            "Include certifications relevant to your industry",
            "Add awards, publications, or notable projects",
            "Mention volunteer work that demonstrates leadership"
        ]
    };
    
    return suggestions[section] || ["Complete this section to get personalized suggestions"];
}

// Display suggestions
function displaySuggestions(suggestions) {
    const aiSuggestions = document.getElementById('aiSuggestions');
    
    aiSuggestions.innerHTML = suggestions.map(suggestion => 
        `<div class="ai-suggestion-item">${suggestion}</div>`
    ).join('');
}

// Update AI suggestions for section
function updateAISuggestions(section) {
    const aiSuggestions = document.getElementById('aiSuggestions');
    const suggestions = generateSuggestions(section, getCurrentSectionData());
    displaySuggestions(suggestions);
}

// Get current section data
function getCurrentSectionData() {
    return resumeData[currentSection] || {};
}

// Save resume data
function saveResumeData() {
    App.currentResume = resumeData;
    saveUserData();
}

// Load resume data
function loadResumeData() {
    if (App.currentResume) {
        Object.assign(resumeData, App.currentResume);
        populateForm();
    }
}

// Populate form with loaded data
function populateForm() {
    // Personal information
    Object.keys(resumeData.personal).forEach(key => {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input && resumeData.personal[key]) {
            input.value = resumeData.personal[key];
        }
    });
    
    // Summary
    Object.keys(resumeData.summary).forEach(key => {
        const input = document.querySelector(`input[name="${key}"], textarea[name="${key}"]`);
        if (input && resumeData.summary[key]) {
            input.value = resumeData.summary[key];
        }
    });
    
    // Skills
    resumeData.skills.forEach(skill => {
        const skillsContainer = document.getElementById('skillsContainer');
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" class="remove-skill" onclick="removeSkill('${skill}')">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
        skillsContainer.appendChild(skillTag);
    });
    
    updateProgress();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initializeBuilder,
        resumeData,
        addSkill,
        removeSkill,
        removeExperienceItem,
        removeEducationItem,
        removeAchievementItem
    };
}