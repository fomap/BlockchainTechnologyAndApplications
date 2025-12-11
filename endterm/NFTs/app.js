// NFT Data with image references
const nftData = [
    {
        id: 1,
        name: "Alice Johnson",
        program: "Computer Science",
        grade: "A+",
        graduationDate: "2023-05-15",
        tokenId: "CS2023-001",
        image: "images/1.png",
        university: "MIT",
        description: "Graduated with honors in Computer Science"
    },
    {
        id: 2,
        name: "Bob Smith",
        program: "Business Administration",
        grade: "A",
        graduationDate: "2023-05-16",
        tokenId: "BA2023-002",
        image: "images/2.png",
        university: "Harvard",
        description: "Specialized in Entrepreneurship"
    },
    {
        id: 3,
        name: "Carol Davis",
        program: "Data Science",
        grade: "A+",
        graduationDate: "2023-05-17",
        tokenId: "DS2023-003",
        image: "images/3.png",
        university: "Stanford",
        description: "Focus on Machine Learning and AI"
    },
    {
        id: 4,
        name: "David Wilson",
        program: "Engineering",
        grade: "B+",
        graduationDate: "2023-05-18",
        tokenId: "EN2023-004",
        image: "images/4.png",
        university: "Caltech",
        description: "Mechanical Engineering major"
    },
    {
        id: 5,
        name: "Emma Brown",
        program: "Computer Science",
        grade: "A",
        graduationDate: "2023-05-19",
        tokenId: "CS2023-005",
        image: "images/5.png",
        university: "Stanford",
        description: "Specialized in Software Engineering"
    },
    {
        id: 6,
        name: "Frank Miller",
        program: "Cybersecurity",
        grade: "A-",
        graduationDate: "2023-05-20",
        tokenId: "CY2023-006",
        image: "images/6.png",
        university: "Carnegie Mellon",
        description: "Network Security expert"
    },
    {
        id: 7,
        name: "Grace Taylor",
        program: "Business Administration",
        grade: "B+",
        graduationDate: "2023-05-21",
        tokenId: "BA2023-007",
        image: "images/7.png",
        university: "Wharton",
        description: "Finance and Investment specialization"
    },
    {
        id: 8,
        name: "Henry Clark",
        program: "Data Science",
        grade: "A",
        graduationDate: "2023-05-22",
        tokenId: "DS2023-008",
        image: "images/8.png",
        university: "MIT",
        description: "Big Data Analytics focus"
    },
    {
        id: 9,
        name: "Ivy Martinez",
        program: "Engineering",
        grade: "A+",
        graduationDate: "2023-05-23",
        tokenId: "EN2023-009",
        image: "images/9.png",
        university: "Georgia Tech",
        description: "Electrical Engineering with Robotics"
    },
    {
        id: 10,
        name: "Jack Lee",
        program: "Computer Science",
        grade: "A-",
        graduationDate: "2023-05-24",
        tokenId: "CS2023-010",
        image: "images/10.png",
        university: "UC Berkeley",
        description: "Computer Graphics and Game Development"
    }
];

// DOM Elements
let currentView = 'grid';
let currentFilters = {
    search: '',
    program: '',
    grade: ''
};

// Initialize the application
function init() {
    renderGallery();
    populateFilters();
    setupEventListeners();
    updateStats();
}

// Render the NFT gallery
function renderGallery() {
    const gallery = document.getElementById('nftGallery');
    const filteredNFTs = getFilteredNFTs();
    
    gallery.innerHTML = '';
    
    if (filteredNFTs.length === 0) {
        gallery.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No certificates found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    filteredNFTs.forEach(nft => {
        const card = createNFTCard(nft);
        gallery.appendChild(card);
    });
    
    updateStats();
}

// Create an NFT card element
function createNFTCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    card.dataset.id = nft.id;
    
    const imageUrl = nft.image || `images/${(nft.id % 10) + 1}.png`;
    
    card.innerHTML = `
        <div class="nft-image">
            <img src="${imageUrl}" alt="${nft.name}'s Certificate" loading="lazy">
            <div class="certificate-badge">
                <i class="fas fa-certificate"></i> NFT
            </div>
            <div class="token-id">${nft.tokenId}</div>
        </div>
        <div class="nft-info">
            <div class="graduate-name">
                <i class="fas fa-user-graduate"></i>
                ${nft.name}
            </div>
            <div class="program">
                <i class="fas fa-book"></i>
                ${nft.program}
            </div>
            <div class="details">
                <i class="fas fa-university"></i>
                ${nft.university}
            </div>
            <div class="details">
                <i class="fas fa-calendar-alt"></i>
                Graduated: ${formatDate(nft.graduationDate)}
            </div>
            <div class="grade">
                <i class="fas fa-star"></i>
                Grade: ${nft.grade}
            </div>
            ${nft.description ? `<div class="details" style="margin-top: 15px; font-style: italic;">
                <i class="fas fa-quote-left"></i>
                ${nft.description}
            </div>` : ''}
        </div>
    `;
    
    // Add click effect
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
        showNFTDetails(nft);
    });
    
    return card;
}

// Show NFT details (simple alert for now)
function showNFTDetails(nft) {
    const details = `
        🎓 ${nft.name}
        📚 ${nft.program} - ${nft.university}
        ⭐ Grade: ${nft.grade}
        📅 ${formatDate(nft.graduationDate)}
        🔖 Token ID: ${nft.tokenId}
        
        ${nft.description}
    `;
    
    // In a real app, you would show a modal here
    console.log('NFT Details:', details);
    alert(`🎓 ${nft.name}\n📚 ${nft.program}\n⭐ Grade: ${nft.grade}\n📅 ${formatDate(nft.graduationDate)}`);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get filtered NFTs based on current filters
function getFilteredNFTs() {
    return nftData.filter(nft => {
        // Search filter
        const searchTerm = currentFilters.search.toLowerCase();
        const matchesSearch = !searchTerm || 
            nft.name.toLowerCase().includes(searchTerm) ||
            nft.program.toLowerCase().includes(searchTerm) ||
            nft.grade.toLowerCase().includes(searchTerm) ||
            nft.university.toLowerCase().includes(searchTerm) ||
            nft.tokenId.toLowerCase().includes(searchTerm);
        
        // Program filter
        const matchesProgram = !currentFilters.program || nft.program === currentFilters.program;
        
        // Grade filter
        const matchesGrade = !currentFilters.grade || nft.grade === currentFilters.grade;
        
        return matchesSearch && matchesProgram && matchesGrade;
    });
}

// Populate filter dropdowns
function populateFilters() {
    const programFilter = document.getElementById('programFilter');
    const gradeFilter = document.getElementById('gradeFilter');
    
    // Get unique programs and grades
    const programs = [...new Set(nftData.map(nft => nft.program))].sort();
    const grades = [...new Set(nftData.map(nft => nft.grade))].sort((a, b) => {
        // Custom sort for grades
        const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
        return gradeOrder.indexOf(a) - gradeOrder.indexOf(b);
    });
    
    // Add program options
    programs.forEach(program => {
        const option = document.createElement('option');
        option.value = program;
        option.textContent = program;
        programFilter.appendChild(option);
    });
    
    // Add grade options
    grades.forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        gradeFilter.appendChild(option);
    });
}

// Update statistics
function updateStats() {
    const filteredNFTs = getFilteredNFTs();
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    const activeFilters = document.getElementById('activeFilters');
    
    showingCount.textContent = filteredNFTs.length;
    totalCount.textContent = nftData.length;
    
    // Update active filters display
    const filters = [];
    if (currentFilters.search) filters.push(`Search: "${currentFilters.search}"`);
    if (currentFilters.program) filters.push(`Program: ${currentFilters.program}`);
    if (currentFilters.grade) filters.push(`Grade: ${currentFilters.grade}`);
    
    activeFilters.textContent = filters.length > 0 ? filters.join(', ') : 'None';
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        renderGallery();
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        currentFilters.search = '';
        renderGallery();
    });
    
    // Program filter
    const programFilter = document.getElementById('programFilter');
    programFilter.addEventListener('change', (e) => {
        currentFilters.program = e.target.value;
        renderGallery();
    });
    
    // Grade filter
    const gradeFilter = document.getElementById('gradeFilter');
    gradeFilter.addEventListener('change', (e) => {
        currentFilters.grade = e.target.value;
        renderGallery();
    });
    
    // Reset filters
    const resetFilters = document.getElementById('resetFilters');
    resetFilters.addEventListener('click', () => {
        searchInput.value = '';
        programFilter.value = '';
        gradeFilter.value = '';
        
        currentFilters = {
            search: '',
            program: '',
            grade: ''
        };
        
        renderGallery();
    });
    
    // View options
    const viewGrid = document.getElementById('viewGrid');
    const viewList = document.getElementById('viewList');
    const gallery = document.getElementById('nftGallery');
    
    viewGrid.addEventListener('click', () => {
        currentView = 'grid';
        gallery.classList.remove('list-view');
        viewGrid.classList.add('active');
        viewList.classList.remove('active');
    });
    
    viewList.addEventListener('click', () => {
        currentView = 'list';
        gallery.classList.add('list-view');
        viewList.classList.add('active');
        viewGrid.classList.remove('active');
    });
    
    // Debounce search for better performance
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderGallery();
        }, 300);
    });
}

// Generate more NFTs (if needed)
function generateMoreNFTs(count) {
    const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Emily', 'Chris', 'Katie'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Moore'];
    const programs = ['Computer Science', 'Business Administration', 'Data Science', 'Engineering', 'Cybersecurity', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Economics'];
    const universities = ['MIT', 'Harvard', 'Stanford', 'Caltech', 'UC Berkeley', 'Carnegie Mellon', 'Princeton', 'Yale', 'Columbia', 'UChicago'];
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
    
    const currentYear = 2023;
    const startId = nftData.length + 1;
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const program = programs[Math.floor(Math.random() * programs.length)];
        const grade = grades[Math.floor(Math.random() * grades.length)];
        const university = universities[Math.floor(Math.random() * universities.length)];
        const graduationDate = `${currentYear}-05-${String(15 + (i % 15)).padStart(2, '0')}`;
        const programCode = program.split(' ').map(w => w[0]).join('');
        const tokenId = `${programCode}${currentYear}-${String(startId + i).padStart(3, '0')}`;
        
        nftData.push({
            id: startId + i,
            name: `${firstName} ${lastName}`,
            program: program,
            grade: grade,
            graduationDate: graduationDate,
            tokenId: tokenId,
            image: `images/${((startId + i - 1) % 10) + 1}.png`,
            university: university,
            description: `Graduated with distinction in ${program}`
        });
    }
    
    // Reinitialize with new data
    init();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { nftData, getFilteredNFTs };
}