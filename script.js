// Global variables
let currentStream = null;
let currentImageData = null;
let images = JSON.parse(localStorage.getItem('matchaImages') || '[]');

// DOM elements
const elements = {
    // Navigation
    navTabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Camera
    cameraBtn: document.getElementById('cameraBtn'),
    cameraPreview: document.getElementById('cameraPreview'),
    video: document.getElementById('video'),
    captureBtn: document.getElementById('captureBtn'),
    closeCamera: document.getElementById('closeCamera'),
    
    // File upload
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    
    // Image preview
    imagePreview: document.getElementById('imagePreview'),
    previewImage: document.getElementById('previewImage'),
    retakeBtn: document.getElementById('retakeBtn'),
    
    // Rating
    analyzeBtn: document.getElementById('analyzeBtn'),
    ratingResult: document.getElementById('ratingResult'),
    scoreValue: document.getElementById('scoreValue'),
    gradeBadge: document.getElementById('gradeBadge'),
    confidenceBadge: document.getElementById('confidenceBadge'),
    confidenceText: document.getElementById('confidenceText'),
    explanationText: document.getElementById('explanationText'),
    
    // Rating factors
    colorProgress: document.getElementById('colorProgress'),
    colorScore: document.getElementById('colorScore'),
    textureProgress: document.getElementById('textureProgress'),
    textureScore: document.getElementById('textureScore'),
    frothProgress: document.getElementById('frothProgress'),
    frothScore: document.getElementById('frothScore'),
    consistencyProgress: document.getElementById('consistencyProgress'),
    consistencyScore: document.getElementById('consistencyScore'),
    
    // Actions
    saveBtn: document.getElementById('saveBtn'),
    shareBtn: document.getElementById('shareBtn'),
    
    // Gallery
    galleryGrid: document.getElementById('galleryGrid'),
    emptyGallery: document.getElementById('emptyGallery'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    exportBtn: document.getElementById('exportBtn'),
    
    // Statistics
    totalPhotos: document.getElementById('totalPhotos'),
    avgRating: document.getElementById('avgRating'),
    bestRating: document.getElementById('bestRating'),
    daysActive: document.getElementById('daysActive'),
    ratingChart: document.getElementById('ratingChart'),
    trendChart: document.getElementById('trendChart'),
    tipsGrid: document.getElementById('tipsGrid'),
    
    // Loading and modals
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    imageModal: document.getElementById('imageModal'),
    modalImage: document.getElementById('modalImage'),
    modalTitle: document.getElementById('modalTitle'),
    modalRating: document.getElementById('modalRating'),
    modalDate: document.getElementById('modalDate'),
    closeModal: document.querySelector('.close-modal'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateGallery();
    updateStatistics();
});

// Initialize the application
function initializeApp() {
    // Check if this is the first visit
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
        localStorage.setItem('firstVisit', new Date().toISOString());
        showToast('Welcome to Matcha Quality Rater! Start by capturing your first matcha photo.', 'info');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    elements.navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Camera functionality
    elements.cameraBtn.addEventListener('click', openCamera);
    elements.captureBtn.addEventListener('click', capturePhoto);
    elements.closeCamera.addEventListener('click', closeCamera);
    
    // File upload
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('drop', handleDrop);
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Image preview
    elements.retakeBtn.addEventListener('click', retakePhoto);
    elements.analyzeBtn.addEventListener('click', analyzeImage);
    elements.saveBtn.addEventListener('click', saveImage);
    elements.shareBtn.addEventListener('click', shareImage);
    
    // Gallery
    elements.searchInput.addEventListener('input', filterGallery);
    elements.sortSelect.addEventListener('change', sortGallery);
    elements.exportBtn.addEventListener('click', exportReport);
    
    // Modal
    elements.closeModal.addEventListener('click', closeImageModal);
    elements.imageModal.addEventListener('click', (e) => {
        if (e.target === elements.imageModal) closeImageModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Navigation functions
function switchTab(tabName) {
    // Update active tab
    elements.navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Show active content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    // Update gallery if switching to gallery tab
    if (tabName === 'gallery') {
        updateGallery();
    } else if (tabName === 'stats') {
        updateStatistics();
    }
}

// Camera functions
async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            } 
        });
        
        currentStream = stream;
        elements.video.srcObject = stream;
        elements.cameraPreview.classList.remove('hidden');
        
        showToast('Camera opened successfully!', 'success');
    } catch (error) {
        console.error('Error accessing camera:', error);
        showToast('Unable to access camera. Please check permissions.', 'error');
    }
}

function closeCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    elements.cameraPreview.classList.add('hidden');
}

function capturePhoto() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = elements.video.videoWidth;
    canvas.height = elements.video.videoHeight;
    
    context.drawImage(elements.video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    displayImagePreview(imageData);
    
    closeCamera();
}

// File upload functions
function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        displayImagePreview(imageData);
    };
    reader.readAsDataURL(file);
}

// Image preview functions
function displayImagePreview(imageData) {
    currentImageData = imageData;
    elements.previewImage.src = imageData;
    elements.imagePreview.classList.remove('hidden');
    elements.ratingResult.classList.add('hidden');
    
    // Scroll to preview
    elements.imagePreview.scrollIntoView({ behavior: 'smooth' });
}

function retakePhoto() {
    elements.imagePreview.classList.add('hidden');
    elements.ratingResult.classList.add('hidden');
    currentImageData = null;
}

// AI Analysis functions
async function analyzeImage() {
    if (!currentImageData) {
        showToast('No image to analyze.', 'error');
        return;
    }
    
    showLoading('Analyzing matcha quality...');
    
    // Simulate AI analysis with realistic delays
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic ratings
    const ratings = generateMatchaRatings();
    
    // Update UI with results
    updateRatingDisplay(ratings);
    
    hideLoading();
    elements.ratingResult.classList.remove('hidden');
    
    showToast('Analysis complete!', 'success');
}

function generateMatchaRatings() {
    // Generate realistic matcha quality ratings
    const colorVibrancy = 7 + Math.random() * 3; // 7-10
    const powderTexture = 6 + Math.random() * 3; // 6-9
    const frothQuality = 6 + Math.random() * 3; // 6-9
    const consistency = 6 + Math.random() * 3; // 6-9
    
    const overallScore = (colorVibrancy + powderTexture + frothQuality + consistency) / 4;
    
    const confidence = overallScore > 8 ? 'High' : overallScore > 6 ? 'Medium' : 'Low';
    
    const grade = overallScore >= 9 ? 'A' : 
                  overallScore >= 8 ? 'B' : 
                  overallScore >= 7 ? 'C' : 
                  overallScore >= 6 ? 'D' : 'F';
    
    const explanations = {
        excellent: "This matcha shows exceptional quality with vibrant color, fine texture, and excellent froth formation. The consistency is perfect for traditional preparation.",
        good: "This matcha displays good quality characteristics with a natural green color and decent texture. The froth quality is satisfactory with room for improvement.",
        average: "This matcha shows average quality with moderate color vibrancy and texture. The froth formation could be improved with better preparation techniques.",
        poor: "This matcha appears to have quality issues with dull color and coarse texture. Consider using different preparation methods or higher quality powder."
    };
    
    let explanation;
    if (overallScore >= 8.5) explanation = explanations.excellent;
    else if (overallScore >= 7) explanation = explanations.good;
    else if (overallScore >= 6) explanation = explanations.average;
    else explanation = explanations.poor;
    
    return {
        overallScore: Math.round(overallScore * 10) / 10,
        colorVibrancy: Math.round(colorVibrancy * 10) / 10,
        powderTexture: Math.round(powderTexture * 10) / 10,
        frothQuality: Math.round(frothQuality * 10) / 10,
        consistency: Math.round(consistency * 10) / 10,
        grade,
        confidence,
        explanation
    };
}

function updateRatingDisplay(ratings) {
    // Update overall score and grade
    elements.scoreValue.textContent = ratings.overallScore;
    elements.gradeBadge.textContent = ratings.grade;
    elements.confidenceText.textContent = `${ratings.confidence} Confidence`;
    
    // Update factor scores and progress bars
    elements.colorScore.textContent = ratings.colorVibrancy;
    elements.colorProgress.style.width = `${ratings.colorVibrancy * 10}%`;
    
    elements.textureScore.textContent = ratings.powderTexture;
    elements.textureProgress.style.width = `${ratings.powderTexture * 10}%`;
    
    elements.frothScore.textContent = ratings.frothQuality;
    elements.frothProgress.style.width = `${ratings.frothQuality * 10}%`;
    
    elements.consistencyScore.textContent = ratings.consistency;
    elements.consistencyProgress.style.width = `${ratings.consistency * 10}%`;
    
    // Update explanation
    elements.explanationText.textContent = ratings.explanation;
    
    // Update confidence badge color
    const confidenceColors = {
        'High': 'var(--light-green)',
        'Medium': 'var(--pale-green)',
        'Low': '#ffc107'
    };
    elements.confidenceBadge.style.background = confidenceColors[ratings.confidence];
}

// Save and share functions
function saveImage() {
    if (!currentImageData) {
        showToast('No image to save.', 'error');
        return;
    }
    
    const imageData = {
        id: Date.now(),
        data: currentImageData,
        date: new Date().toISOString(),
        rating: {
            score: parseFloat(elements.scoreValue.textContent),
            grade: elements.gradeBadge.textContent,
            colorVibrancy: parseFloat(elements.colorScore.textContent),
            powderTexture: parseFloat(elements.textureScore.textContent),
            frothQuality: parseFloat(elements.frothScore.textContent),
            consistency: parseFloat(elements.consistencyScore.textContent),
            confidence: elements.confidenceText.textContent.split(' ')[0],
            explanation: elements.explanationText.textContent
        }
    };
    
    images.unshift(imageData);
    localStorage.setItem('matchaImages', JSON.stringify(images));
    
    showToast('Image saved to gallery!', 'success');
    switchTab('gallery');
}

function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: 'My Matcha Quality Assessment',
            text: `I rated my matcha ${elements.scoreValue.textContent}/10 (Grade ${elements.gradeBadge.textContent})!`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const text = `Matcha Quality: ${elements.scoreValue.textContent}/10 (Grade ${elements.gradeBadge.textContent})`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Rating copied to clipboard!', 'success');
        });
    }
}

// Gallery functions
function updateGallery() {
    if (images.length === 0) {
        elements.galleryGrid.innerHTML = '';
        elements.emptyGallery.classList.remove('hidden');
        return;
    }
    
    elements.emptyGallery.classList.add('hidden');
    
    const filteredImages = filterImages(images);
    const sortedImages = sortImages(filteredImages);
    
    elements.galleryGrid.innerHTML = sortedImages.map(image => createGalleryItem(image)).join('');
    
    // Add click listeners to gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => openImageModal(item.dataset.id));
    });
    
    // Add delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteImage(btn.dataset.id);
        });
    });
}

function createGalleryItem(image) {
    const date = new Date(image.date).toLocaleDateString();
    return `
        <div class="gallery-item" data-id="${image.id}">
            <img src="${image.data}" alt="Matcha assessment">
            <div class="gallery-item-info">
                <div class="gallery-item-header">
                    <div class="gallery-item-score">
                        <span class="score-number">${image.rating.score}</span>
                        <span class="score-grade">${image.rating.grade}</span>
                    </div>
                    <button class="btn btn-secondary delete-btn" data-id="${image.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="gallery-item-date">${date}</div>
                <div class="gallery-item-actions">
                    <button class="btn btn-primary" onclick="openImageModal(${image.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterImages(images) {
    const searchTerm = elements.searchInput.value.toLowerCase();
    if (!searchTerm) return images;
    
    return images.filter(image => {
        const score = image.rating.score.toString();
        const grade = image.rating.grade.toLowerCase();
        const date = new Date(image.date).toLocaleDateString();
        const explanation = image.rating.explanation.toLowerCase();
        
        return score.includes(searchTerm) || 
               grade.includes(searchTerm) || 
               date.includes(searchTerm) ||
               explanation.includes(searchTerm);
    });
}

function sortImages(images) {
    const sortBy = elements.sortSelect.value;
    
    return images.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'rating-desc':
                return b.rating.score - a.rating.score;
            case 'rating-asc':
                return a.rating.score - b.rating.score;
            default:
                return 0;
        }
    });
}

function filterGallery() {
    updateGallery();
}

function sortGallery() {
    updateGallery();
}

function deleteImage(imageId) {
    if (confirm('Are you sure you want to delete this image?')) {
        images = images.filter(img => img.id !== parseInt(imageId));
        localStorage.setItem('matchaImages', JSON.stringify(images));
        updateGallery();
        updateStatistics();
        showToast('Image deleted successfully.', 'success');
    }
}

function openImageModal(imageId) {
    const image = images.find(img => img.id === parseInt(imageId));
    if (!image) return;
    
    elements.modalImage.src = image.data;
    elements.modalTitle.textContent = `Matcha Quality Assessment`;
    elements.modalRating.innerHTML = `
        <span class="score-number">${image.rating.score}</span>
        <span class="score-grade">${image.rating.grade}</span>
    `;
    elements.modalDate.textContent = new Date(image.date).toLocaleDateString();
    
    elements.imageModal.classList.remove('hidden');
}

function closeImageModal() {
    elements.imageModal.classList.add('hidden');
}

// Statistics functions
function updateStatistics() {
    if (images.length === 0) {
        elements.totalPhotos.textContent = '0';
        elements.avgRating.textContent = '0.0';
        elements.bestRating.textContent = '0.0';
        elements.daysActive.textContent = '0';
        return;
    }
    
    // Calculate statistics
    const totalPhotos = images.length;
    const avgRating = (images.reduce((sum, img) => sum + img.rating.score, 0) / totalPhotos).toFixed(1);
    const bestRating = Math.max(...images.map(img => img.rating.score)).toFixed(1);
    
    // Calculate days active
    const firstDate = new Date(images[images.length - 1].date);
    const lastDate = new Date(images[0].date);
    const daysActive = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Update UI
    elements.totalPhotos.textContent = totalPhotos;
    elements.avgRating.textContent = avgRating;
    elements.bestRating.textContent = bestRating;
    elements.daysActive.textContent = daysActive;
    
    // Update charts
    updateRatingChart();
    updateTrendChart();
    updateTips();
}

function updateRatingChart() {
    const ratingRanges = {
        '9-10': 0, '8-9': 0, '7-8': 0, '6-7': 0, '0-6': 0
    };
    
    images.forEach(img => {
        const score = img.rating.score;
        if (score >= 9) ratingRanges['9-10']++;
        else if (score >= 8) ratingRanges['8-9']++;
        else if (score >= 7) ratingRanges['7-8']++;
        else if (score >= 6) ratingRanges['6-7']++;
        else ratingRanges['0-6']++;
    });
    
    elements.ratingChart.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
            ${Object.entries(ratingRanges).map(([range, count]) => `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="min-width: 60px; font-weight: 500;">${range}</span>
                    <div style="flex: 1; height: 20px; background: var(--gray-200); border-radius: 10px; overflow: hidden;">
                        <div style="width: ${(count / images.length) * 100}%; height: 100%; background: var(--gradient-secondary);"></div>
                    </div>
                    <span style="min-width: 30px; text-align: right;">${count}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function updateTrendChart() {
    const recentImages = images.slice(0, 10).reverse();
    
    if (recentImages.length === 0) {
        elements.trendChart.innerHTML = '<p>No data available</p>';
        return;
    }
    
    const maxScore = Math.max(...recentImages.map(img => img.rating.score));
    const minScore = Math.min(...recentImages.map(img => img.rating.score));
    const range = maxScore - minScore || 1;
    
    elements.trendChart.innerHTML = `
        <div style="display: flex; align-items: end; justify-content: space-between; height: 200px; padding: 1rem 0;">
            ${recentImages.map((img, index) => {
                const height = ((img.rating.score - minScore) / range) * 100;
                return `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: ${height}%; background: var(--gradient-primary); border-radius: 4px; min-height: 4px;"></div>
                        <span style="font-size: 0.8rem; color: var(--gray-600);">${img.rating.score}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateTips() {
    const avgScore = images.reduce((sum, img) => sum + img.rating.score, 0) / images.length;
    
    const tips = [];
    
    if (avgScore < 7) {
        tips.push({
            icon: 'fas fa-lightbulb',
            title: 'Improve Color Vibrancy',
            text: 'Try using higher quality matcha powder and ensure proper storage in a cool, dark place.'
        });
        tips.push({
            icon: 'fas fa-tint',
            title: 'Better Water Temperature',
            text: 'Use water at 70-80°C (158-176°F) for optimal matcha preparation and color preservation.'
        });
    }
    
    if (images.some(img => img.rating.powderTexture < 7)) {
        tips.push({
            icon: 'fas fa-magic',
            title: 'Improve Powder Texture',
            text: 'Use a fine-mesh sieve to break up clumps and ensure smooth, consistent powder texture.'
        });
    }
    
    if (images.some(img => img.rating.frothQuality < 7)) {
        tips.push({
            icon: 'fas fa-whisk',
            title: 'Better Frothing Technique',
            text: 'Use a bamboo whisk (chasen) with quick, light strokes in a zig-zag pattern for better froth.'
        });
    }
    
    if (tips.length === 0) {
        tips.push({
            icon: 'fas fa-star',
            title: 'Excellent Quality!',
            text: 'Your matcha preparation is consistently high quality. Keep up the great work!'
        });
    }
    
    elements.tipsGrid.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <h4><i class="${tip.icon}"></i> ${tip.title}</h4>
            <p>${tip.text}</p>
        </div>
    `).join('');
}

// Export functions
function exportReport() {
    if (images.length === 0) {
        showToast('No data to export.', 'error');
        return;
    }
    
    const report = {
        title: 'Matcha Quality Assessment Report',
        generated: new Date().toISOString(),
        summary: {
            totalPhotos: images.length,
            averageRating: (images.reduce((sum, img) => sum + img.rating.score, 0) / images.length).toFixed(1),
            bestRating: Math.max(...images.map(img => img.rating.score)).toFixed(1),
            worstRating: Math.min(...images.map(img => img.rating.score)).toFixed(1)
        },
        assessments: images.map(img => ({
            date: img.date,
            score: img.rating.score,
            grade: img.rating.grade,
            factors: {
                colorVibrancy: img.rating.colorVibrancy,
                powderTexture: img.rating.powderTexture,
                frothQuality: img.rating.frothQuality,
                consistency: img.rating.consistency
            },
            explanation: img.rating.explanation
        }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `matcha-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Report exported successfully!', 'success');
}

// Utility functions
function showLoading(message) {
    elements.loadingText.textContent = message;
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function handleKeyboard(e) {
    if (e.key === 'Escape') {
        if (!elements.imageModal.classList.contains('hidden')) {
            closeImageModal();
        }
        if (!elements.cameraPreview.classList.contains('hidden')) {
            closeCamera();
        }
    }
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 