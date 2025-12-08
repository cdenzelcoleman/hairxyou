// Fashion system for outfit selection
// This module manages tops (including dresses), bottoms, and shoes selection
// Dresses are special tops that hide bottoms when worn

// Outfit catalog - each item has an ID, display name, and base color
// Tops include regular shirts and full-length dresses
// Colors use hex codes for consistent rendering
const outfits = {
    tops: [
        { id: 'tshirt-pink', name: 'Pink T-Shirt', color: '#FF69B4' },
        { id: 'tshirt-purple', name: 'Purple T-Shirt', color: '#9B59B6' },
        { id: 'tshirt-blue', name: 'Blue T-Shirt', color: '#3498DB' },
        { id: 'tshirt-yellow', name: 'Yellow T-Shirt', color: '#F1C40F' },
        { id: 'dress-red', name: 'Red Dress', color: '#E74C3C' },
        { id: 'dress-green', name: 'Green Dress', color: '#2ECC71' }
    ],
    bottoms: [
        { id: 'jeans', name: 'Jeans', color: '#2C3E50' },
        { id: 'skirt-pink', name: 'Pink Skirt', color: '#FF69B4' },
        { id: 'skirt-purple', name: 'Purple Skirt', color: '#9B59B6' },
        { id: 'shorts-blue', name: 'Blue Shorts', color: '#3498DB' }
    ],
    shoes: [
        { id: 'sneakers', name: 'White Sneakers', color: '#FFFFFF' },
        { id: 'boots-black', name: 'Black Boots', color: '#000000' },
        { id: 'sandals-pink', name: 'Pink Sandals', color: '#FF69B4' },
        { id: 'heels-red', name: 'Red Heels', color: '#E74C3C' }
    ]
};

// Main UI loader for dress up activity
// Creates three sections: tops, bottoms, and shoes
function loadDressUp(container) {
    container.innerHTML = '';

    // Activity header with instructions
    const intro = document.createElement('div');
    intro.className = 'activity-intro';
    intro.innerHTML = `<h3>Dress Up</h3><p>Choose your complete outfit!</p>`;
    container.appendChild(intro);

    // TOPS SECTION
    const topsSection = document.createElement('div');
    topsSection.className = 'customization-section';
    topsSection.innerHTML = '<h3>Tops</h3>';

    const topsGrid = document.createElement('div');
    topsGrid.className = 'outfit-grid';

    // Create a button for each top option
    // Each button shows a preview using the item's color as background
    outfits.tops.forEach(top => {
        const btn = document.createElement('button');
        btn.className = 'outfit-btn';

        // Generate gradient background: starts with item color, ends with darker shade
        // This gives a nice 3D effect to the outfit buttons
        btn.style.background = `linear-gradient(135deg, ${top.color} 0%, ${adjustColor(top.color, -20)} 100%)`;
        btn.innerHTML = `<span>${top.name}</span>`;

        // On click: update state and reload UI to reflect active selection
        btn.onclick = () => {
            updateState('character.outfit.top', top.id);
            loadDressUp(container);
        };

        // Mark currently selected outfit with active class
        if (top.id === gameState.character.outfit.top) {
            btn.classList.add('active');
        }

        topsGrid.appendChild(btn);
    });

    topsSection.appendChild(topsGrid);
    container.appendChild(topsSection);

    // BOTTOMS SECTION
    const bottomsSection = document.createElement('div');
    bottomsSection.className = 'customization-section';
    bottomsSection.innerHTML = '<h3>Bottoms</h3>';

    const bottomsGrid = document.createElement('div');
    bottomsGrid.className = 'outfit-grid';

    // Create buttons for bottom options similar to tops
    outfits.bottoms.forEach(bottom => {
        const btn = document.createElement('button');
        btn.className = 'outfit-btn';

        // Same gradient technique for visual appeal
        btn.style.background = `linear-gradient(135deg, ${bottom.color} 0%, ${adjustColor(bottom.color, -20)} 100%)`;
        btn.innerHTML = `<span>${bottom.name}</span>`;

        // Update bottoms selection in state
        btn.onclick = () => {
            updateState('character.outfit.bottom', bottom.id);
            loadDressUp(container);
        };

        // Highlight current selection
        if (bottom.id === gameState.character.outfit.bottom) {
            btn.classList.add('active');
        }

        bottomsGrid.appendChild(btn);
    });

    bottomsSection.appendChild(bottomsGrid);
    container.appendChild(bottomsSection);

    // SHOES SECTION
    const shoesSection = document.createElement('div');
    shoesSection.className = 'customization-section';
    shoesSection.innerHTML = '<h3>Shoes</h3>';

    const shoesGrid = document.createElement('div');
    shoesGrid.className = 'outfit-grid';

    // Create buttons for shoe options similar to tops and bottoms
    outfits.shoes.forEach(shoe => {
        const btn = document.createElement('button');
        btn.className = 'outfit-btn';

        // Same gradient technique for visual appeal
        btn.style.background = `linear-gradient(135deg, ${shoe.color} 0%, ${adjustColor(shoe.color, -20)} 100%)`;
        btn.innerHTML = `<span>${shoe.name}</span>`;

        // Update shoes selection in state
        btn.onclick = () => {
            updateState('character.outfit.shoes', shoe.id);
            loadDressUp(container);
        };

        // Highlight current selection
        if (shoe.id === gameState.character.outfit.shoes) {
            btn.classList.add('active');
        }

        shoesGrid.appendChild(btn);
    });

    shoesSection.appendChild(shoesGrid);
    container.appendChild(shoesSection);
}

// Color adjustment utility for creating gradients
// Takes a hex color and adds/subtracts from RGB values to darken or lighten
// Used to create depth in outfit button backgrounds
// @param color - hex color string like '#FF69B4'
// @param amount - positive to lighten, negative to darken (e.g., -20 for darker)
// @return adjusted hex color string
function adjustColor(color, amount) {
    // Convert hex to decimal number
    const num = parseInt(color.replace('#', ''), 16);

    // Extract RGB components using bit shifting
    // >> 16 gets red, >> 8 & 0x00FF gets green, & 0x0000FF gets blue
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));

    // Recombine RGB into hex, use bit shifting to reassemble
    // Pad to ensure 6 characters (e.g., '00FF00' not 'FF00')
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
