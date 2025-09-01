// Resume Preview JavaScript

// Preview state
let currentZoom = 100;
let currentTemplate = 'professional';

// Initialize preview
function initializePreview() {
    setupPreviewControls();
    loadResumePreview();
    setupDownloadHandlers();
    calculateATSScore();
}

// Setup preview controls
function setupPreviewControls() {
    // Template selection
    const templateOptions = document.querySelectorAll('input[name="template"]');
    templateOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            currentTemplate = e.target.value;
            updateTemplateStyle();
            updateTemplateSelection();
        });
    });
    
    // Zoom controls
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 150) {
                currentZoom += 25;
                updateZoom();
            }
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 50) {
                currentZoom -= 25;
                updateZoom();
            }
        });
    }
    
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

// Update template selection UI
function updateTemplateSelection() {
    const templateOptions = document.querySelectorAll('.template-option');
    templateOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.value === currentTemplate) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Update template style
function updateTemplateStyle() {
    const resumePreview = document.getElementById('resumePreview');
    
    // Remove existing template classes
    resumePreview.classList.remove('template-professional', 'template-modern', 'template-classic');
    
    // Add new template class
    resumePreview.classList.add(`template-${currentTemplate}`);
    
    // Apply template-specific styles
    applyTemplateStyles(currentTemplate);
}

// Apply template-specific styles
function applyTemplateStyles(template) {
    const resumePage = document.querySelector('.resume-page');
    const resumeName = document.querySelector('.resume-name');
    const sectionTitles = document.querySelectorAll('.section-title');
    
    switch (template) {
        case 'modern':
            resumePage.style.fontFamily = "'Inter', sans-serif";
            resumePage.style.fontSize = '10pt';
            resumeName.style.color = '#10b981';
            sectionTitles.forEach(title => {
                title.style.color = '#10b981';
                title.style.backgroundColor = '#f0fdf4';
                title.style.padding = '0.5rem';
                title.style.borderRadius = '4px';
                title.style.border = 'none';
            });
            break;
            
        case 'classic':
            resumePage.style.fontFamily = "'Times New Roman', serif";
            resumePage.style.fontSize = '12pt';
            resumeName.style.color = '#000';
            sectionTitles.forEach(title => {
                title.style.color = '#000';
                title.style.backgroundColor = 'transparent';
                title.style.padding = '0';
                title.style.borderRadius = '0';
                title.style.borderBottom = '2px solid #000';
                title.style.fontWeight = 'bold';
            });
            break;
            
        default: // professional
            resumePage.style.fontFamily = "'Times New Roman', serif";
            resumePage.style.fontSize = '11pt';
            resumeName.style.color = '#2563eb';
            sectionTitles.forEach(title => {
                title.style.color = '#2563eb';
                title.style.backgroundColor = 'transparent';
                title.style.padding = '0';
                title.style.borderRadius = '0';
                title.style.borderBottom = '1px solid #2563eb';
            });
            break;
    }
}

// Update zoom
function updateZoom() {
    const resumePreview = document.getElementById('resumePreview');
    const zoomLevel = document.getElementById('zoomLevel');
    
    resumePreview.style.transform = `scale(${currentZoom / 100})`;
    resumePreview.style.transformOrigin = 'top center';
    zoomLevel.textContent = `${currentZoom}%`;
    
    // Adjust container height to accommodate zoom
    const previewContent = document.querySelector('.preview-content');
    if (currentZoom !== 100) {
        previewContent.style.paddingBottom = `${(currentZoom - 100) * 0.1}rem`;
    } else {
        previewContent.style.paddingBottom = '2rem';
    }
}

// Load resume preview
function loadResumePreview() {
    const resumeData = App.currentResume || getSampleData();
    
    populatePreview(resumeData);
}

// Get sample data for preview
function getSampleData() {
    return {
        personal: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/johndoe',
            website: 'johndoe.dev'
        },
        summary: {
            jobTitle: 'Software Engineer',
            summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Proven track record of delivering scalable web applications and leading development teams. Passionate about creating innovative solutions and mentoring junior developers.'
        },
        experience: [
            {
                id: '1',
                title: 'Senior Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                startDate: '2020-01',
                endDate: '2024-01',
                current: false,
                description: '• Led development of microservices architecture serving 1M+ users\n• Reduced system latency by 40% through optimization initiatives\n• Mentored 5 junior developers and conducted code reviews\n• Implemented CI/CD pipelines reducing deployment time by 60%'
            },
            {
                id: '2',
                title: 'Software Engineer',
                company: 'StartupXYZ',
                location: 'San Francisco, CA',
                startDate: '2018-06',
                endDate: '2020-01',
                current: false,
                description: '• Developed RESTful APIs using Node.js and Express\n• Built responsive web applications with React and TypeScript\n• Collaborated with product team to define technical requirements\n• Maintained 95% test coverage across all services'
            }
        ],
        education: [
            {
                id: '1',
                institution: 'University of California, Berkeley',
                degree: 'Bachelor of Science',
                field: 'Computer Science',
                location: 'Berkeley, CA',
                graduationDate: '2018-05',
                gpa: '3.8/4.0'
            }
        ],
        skills: [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 
            'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Git', 'Agile'
        ],
        achievements: [
            {
                id: '1',
                title: 'AWS Certified Solutions Architect',
                issuer: 'Amazon Web Services',
                date: '2023-03',
                description: 'Professional-level certification in designing distributed systems on AWS'
            },
            {
                id: '2',
                title: 'Best Innovation Award',
                issuer: 'Tech Corp',
                date: '2022-12',
                description: 'Recognized for developing innovative machine learning solution that improved user engagement by 25%'
            }
        ]
    };
}

// Populate preview with resume data
function populatePreview(data) {
    populateHeader(data.personal, data.summary);
    populateSummary(data.summary);
    populateExperience(data.experience);
    populateEducation(data.education);
    populateSkills(data.skills);
    populateAchievements(data.achievements);
    
    // Hide empty sections
    hideEmptySections(data);
}

// Populate header
function populateHeader(personal, summary) {
    const nameElement = document.getElementById('previewName');
    const titleElement = document.getElementById('previewTitle');
    const contactElement = document.getElementById('previewContact');
    
    // Name
    const fullName = `${personal.firstName || ''} ${personal.lastName || ''}`.trim();
    nameElement.textContent = fullName || 'Your Name';
    
    // Title
    titleElement.textContent = summary.jobTitle || 'Your Professional Title';
    
    // Contact information
    const contactParts = [];
    if (personal.email) contactParts.push(personal.email);
    if (personal.phone) contactParts.push(personal.phone);
    if (personal.location) contactParts.push(personal.location);
    if (personal.linkedin) contactParts.push(personal.linkedin);
    if (personal.website) contactParts.push(personal.website);
    
    contactElement.innerHTML = contactParts.join(' <span>•</span> ');
}

// Populate summary
function populateSummary(summary) {
    const summaryElement = document.getElementById('previewSummary');
    const summarySection = document.getElementById('summarySection');
    
    if (summary.summary) {
        summaryElement.textContent = summary.summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
}

// Populate experience
function populateExperience(experience) {
    const experienceContainer = document.getElementById('previewExperience');
    const experienceSection = document.getElementById('experienceSection');
    
    if (!experience || experience.length === 0) {
        experienceSection.style.display = 'none';
        return;
    }
    
    experienceSection.style.display = 'block';
    experienceContainer.innerHTML = '';
    
    experience.forEach(exp => {
        if (!exp.title && !exp.company) return;
        
        const expElement = document.createElement('div');
        expElement.className = 'experience-item';
        
        const startDate = exp.startDate ? formatDate(exp.startDate) : '';
        const endDate = exp.current ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : '');
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate);
        
        expElement.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${exp.title}</div>
                    <div class="item-company">${exp.company}</div>
                </div>
                <div class="item-date">${dateRange}</div>
            </div>
            ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
            ${exp.description ? `<div class="item-description">${formatDescription(exp.description)}</div>` : ''}
        `;
        
        experienceContainer.appendChild(expElement);
    });
}

// Populate education
function populateEducation(education) {
    const educationContainer = document.getElementById('previewEducation');
    const educationSection = document.getElementById('educationSection');
    
    if (!education || education.length === 0) {
        educationSection.style.display = 'none';
        return;
    }
    
    educationSection.style.display = 'block';
    educationContainer.innerHTML = '';
    
    education.forEach(edu => {
        if (!edu.institution && !edu.degree) return;
        
        const eduElement = document.createElement('div');
        eduElement.className = 'education-item';
        
        const graduationDate = edu.graduationDate ? formatDate(edu.graduationDate) : '';
        const degreeField = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;
        
        eduElement.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${degreeField}</div>
                    <div class="item-company">${edu.institution}</div>
                </div>
                <div class="item-date">${graduationDate}</div>
            </div>
            ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
            ${edu.gpa ? `<div class="item-description">GPA: ${edu.gpa}</div>` : ''}
        `;
        
        educationContainer.appendChild(eduElement);
    });
}

// Populate skills
function populateSkills(skills) {
    const skillsContainer = document.getElementById('previewSkills');
    const skillsSection = document.getElementById('skillsSection');
    
    if (!skills || skills.length === 0) {
        skillsSection.style.display = 'none';
        return;
    }
    
    skillsSection.style.display = 'block';
    skillsContainer.innerHTML = '';
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.textContent = skill;
        skillsContainer.appendChild(skillElement);
    });
}

// Populate achievements
function populateAchievements(achievements) {
    const achievementsContainer = document.getElementById('previewAchievements');
    const achievementsSection = document.getElementById('achievementsSection');
    
    if (!achievements || achievements.length === 0) {
        achievementsSection.style.display = 'none';
        return;
    }
    
    achievementsSection.style.display = 'block';
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        if (!achievement.title) return;
        
        const achElement = document.createElement('div');
        achElement.className = 'achievement-item';
        
        const date = achievement.date ? formatDate(achievement.date) : '';
        
        achElement.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${achievement.title}</div>
                    ${achievement.issuer ? `<div class="item-company">${achievement.issuer}</div>` : ''}
                </div>
                <div class="item-date">${date}</div>
            </div>
            ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
        `;
        
        achievementsContainer.appendChild(achElement);
    });
}

// Hide empty sections
function hideEmptySections(data) {
    const sections = [
        { element: 'summarySection', condition: data.summary?.summary },
        { element: 'experienceSection', condition: data.experience?.length > 0 },
        { element: 'educationSection', condition: data.education?.length > 0 },
        { element: 'skillsSection', condition: data.skills?.length > 0 },
        { element: 'achievementsSection', condition: data.achievements?.length > 0 }
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section.element);
        if (element) {
            element.style.display = section.condition ? 'block' : 'none';
        }
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString + '-01'); // Add day for month input
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    } catch (error) {
        return dateString;
    }
}

// Format description with bullet points
function formatDescription(description) {
    if (!description) return '';
    
    // Convert line breaks to HTML
    const formatted = description
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // If line starts with bullet point, create list item
            if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                return `<li>${line.substring(1).trim()}</li>`;
            }
            return `<p>${line}</p>`;
        })
        .join('');
    
    // Wrap list items in ul
    if (formatted.includes('<li>')) {
        return `<ul>${formatted.replace(/<p>(.*?)<\/p>/g, '')}</ul>`;
    }
    
    return formatted;
}

// Setup download handlers
function setupDownloadHandlers() {
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadDocxBtn = document.getElementById('downloadDocxBtn');
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', downloadPDF);
    }
    
    if (downloadDocxBtn) {
        downloadDocxBtn.addEventListener('click', downloadDOCX);
    }
}

// Download PDF
function downloadPDF() {
    Utils.showLoading(document.getElementById('downloadPdfBtn'));
    
    // Simulate PDF generation
    setTimeout(() => {
        Utils.hideLoading(document.getElementById('downloadPdfBtn'));
        Utils.showNotification('PDF download started', 'success');
        
        // In a real implementation, this would generate and download a PDF
        console.log('Generating PDF...');
    }, 2000);
}

// Download DOCX
function downloadDOCX() {
    Utils.showLoading(document.getElementById('downloadDocxBtn'));
    
    // Simulate DOCX generation
    setTimeout(() => {
        Utils.hideLoading(document.getElementById('downloadDocxBtn'));
        Utils.showNotification('DOCX download started', 'success');
        
        // In a real implementation, this would generate and download a DOCX
        console.log('Generating DOCX...');
    }, 2000);
}

// Calculate ATS Score
function calculateATSScore() {
    const resumeData = App.currentResume || getSampleData();
    
    let score = 0;
    let maxScore = 100;
    
    // Personal information (20 points)
    if (resumeData.personal?.firstName && resumeData.personal?.lastName) score += 5;
    if (resumeData.personal?.email) score += 5;
    if (resumeData.personal?.phone) score += 5;
    if (resumeData.personal?.location) score += 5;
    
    // Summary (15 points)
    if (resumeData.summary?.summary && resumeData.summary.summary.length > 50) score += 15;
    
    // Experience (25 points)
    if (resumeData.experience?.length > 0) {
        const validExperience = resumeData.experience.filter(exp => exp.title && exp.company);
        score += Math.min(25, validExperience.length * 12.5);
    }
    
    // Education (15 points)
    if (resumeData.education?.length > 0) {
        const validEducation = resumeData.education.filter(edu => edu.institution && edu.degree);
        score += Math.min(15, validEducation.length * 15);
    }
    
    // Skills (15 points)
    if (resumeData.skills?.length >= 5) score += 15;
    else if (resumeData.skills?.length > 0) score += resumeData.skills.length * 3;
    
    // Achievements (10 points)
    if (resumeData.achievements?.length > 0) score += 10;
    
    // Update score display
    const atsScoreElement = document.getElementById('atsScore');
    if (atsScoreElement) {
        atsScoreElement.textContent = Math.round(score);
        
        // Color coding
        if (score >= 80) {
            atsScoreElement.style.color = '#10b981'; // Green
        } else if (score >= 60) {
            atsScoreElement.style.color = '#f59e0b'; // Yellow
        } else {
            atsScoreElement.style.color = '#ef4444'; // Red
        }
    }
    
    return Math.round(score);
}

// Refresh preview (called from other modules)
function refreshPreview() {
    loadResumePreview();
    calculateATSScore();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initializePreview,
        refreshPreview,
        downloadPDF,
        downloadDOCX
    };
}