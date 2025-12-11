// NFT Data - connecting images with their metadata
const nftData = [
    {
        id: 1,
        author: "Bektassova Anel",
        description: "carefree",
        image: "images/1.png",
        metadataFile: "metadata/1.json"
    },
    {
        id: 2,
        author: "Bektassova Anel",
        description: "playful",
        image: "images/2.png",
        metadataFile: "metadata/2.json"
    },
    {
        id: 3,
        author: "Bektassova Anel",
        description: "sad",
        image: "images/3.png",
        metadataFile: "metadata/3.json"
    },
    {
        id: 4,
        author: "Bektassova Anel",
        description: "worried",
        image: "images/4.png",
        metadataFile: "metadata/4.json"
    },
    {
        id: 5,
        author: "Bektassova Anel",
        description: "curious",
        image: "images/5.png",
        metadataFile: "metadata/5.json"
    },
    {
        id: 6,
        author: "Bektassova Anel",
        description: "respectful",
        image: "images/6.png",
        metadataFile: "metadata/6.json"
    },
    {
        id: 7,
        author: "Bektassova Anel",
        description: "puzzled",
        image: "images/7.png",
        metadataFile: "metadata/7.json"
    },
    {
        id: 8,
        author: "Bektassova Anel",
        description: "happy",
        image: "images/8.png",
        metadataFile: "metadata/8.json"
    },
    {
        id: 9,
        author: "Bektassova Anel",
        description: "angry",
        image: "images/9.png",
        metadataFile: "metadata/9.json"
    },
    {
        id: 10,
        author: "Bektassova Anel",
        description: "lost",
        image: "images/10.png",
        metadataFile: "metadata/10.json"
    }
];

// Store loaded metadata
let nftMetadata = {};

// Initialize the application
function init() {
    renderGallery();
    setupEventListeners();
    loadAllMetadata();
}

// Load all metadata files
async function loadAllMetadata() {
    for (const nft of nftData) {
        try {
            const response = await fetch(nft.metadataFile);
            if (response.ok) {
                const metadata = await response.json();
                nftMetadata[nft.id] = metadata;
            } else {
                // Fallback to basic info if metadata file not found
                nftMetadata[nft.id] = {
                    author: nft.author,
                    description: nft.description,
                    image: nft.image
                };
            }
        } catch (error) {
            console.warn(`Could not load metadata for NFT ${nft.id}:`, error);
            nftMetadata[nft.id] = {
                author: nft.author,
                description: nft.description,
                image: nft.image
            };
        }
    }
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
                <h3>No NFTs found</h3>
                <p>Try adjusting your search</p>
            </div>
        `;
        return;
    }
    
    filteredNFTs.forEach(nft => {
        const card = createNFTCard(nft);
        gallery.appendChild(card);
    });
}

// Create an NFT card element
function createNFTCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    card.dataset.id = nft.id;
    
    card.innerHTML = `
        <div class="nft-image">
            <img src="${nft.image}" alt="${nft.description}" loading="lazy">
            <button class="info-btn" title="View Metadata">
                <i class="fas fa-info-circle"></i>
            </button>
            <div class="image-overlay">
                <i class="fas fa-expand-alt"></i>
            </div>
        </div>
        <div class="nft-info">
            <div class="nft-name">${nft.description}</div>
            <div class="nft-author">By: ${nft.author}</div>
            <div class="nft-id">ID: ${nft.id}</div>
        </div>
    `;
    
    // Add click events
    const imageContainer = card.querySelector('.nft-image');
    const infoBtn = card.querySelector('.info-btn');
    
    // Click image to enlarge
    imageContainer.addEventListener('click', (e) => {
        if (e.target !== infoBtn && !infoBtn.contains(e.target)) {
            showImageModal(nft);
        }
    });
    
    // Click info button for metadata
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering image click
        showMetadataModal(nft);
    });
    
    return card;
}

// Show image modal
function showImageModal(nft) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalImageTitle');
    const modalDesc = document.getElementById('modalImageDesc');
    
    modalImage.src = nft.image;
    modalImage.alt = nft.description;
    modalTitle.textContent = nft.description;
    modalDesc.textContent = `By: ${nft.author}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show metadata modal
function showMetadataModal(nft) {
    const modal = document.getElementById('metadataModal');
    const basicInfo = document.getElementById('basicInfo');
    const rawJSON = document.getElementById('rawJSON');
    
    const metadata = nftMetadata[nft.id] || {
        author: nft.author,
        description: nft.description,
        image: nft.image
    };
    
    // Populate basic info
    basicInfo.innerHTML = `
        <div class="info-item">
            <div class="info-label">Description / Emotion</div>
            <div class="info-value">${metadata.description}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Author</div>
            <div class="info-value">${metadata.author || metadata.name || 'Unknown'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Image URL</div>
            <div class="info-value">${metadata.image}</div>
        </div>
        <div class="info-item">
            <div class="info-label">NFT ID</div>
            <div class="info-value">${nft.id}</div>
        </div>
    `;
    
    // Show raw JSON
    rawJSON.textContent = JSON.stringify(metadata, null, 2);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modals
function closeModals() {
    document.getElementById('imageModal').style.display = 'none';
    document.getElementById('metadataModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Get filtered NFTs based on search
function getFilteredNFTs() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) return nftData;
    
    return nftData.filter(nft => {
        return nft.author.toLowerCase().includes(searchTerm) ||
               nft.description.toLowerCase().includes(searchTerm);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', () => {
        renderGallery();
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        renderGallery();
    });
    
    // Sort by
    const sortBy = document.getElementById('sortBy');
    sortBy.addEventListener('change', () => {
        if (sortBy.value === 'name') {
            nftData.sort((a, b) => a.description.localeCompare(b.description));
        } else {
            nftData.sort((a, b) => a.id - b.id);
        }
        renderGallery();
    });
    
    // Reset filters
    const resetFilters = document.getElementById('resetFilters');
    resetFilters.addEventListener('click', () => {
        searchInput.value = '';
        sortBy.value = 'id';
        nftData.sort((a, b) => a.id - b.id);
        renderGallery();
    });
    
    // Close modal buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const imageModal = document.getElementById('imageModal');
        const metadataModal = document.getElementById('metadataModal');
        
        if (e.target === imageModal) {
            closeModals();
        }
        if (e.target === metadataModal) {
            closeModals();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);