// Beauty system for nails and makeup
// Manages nail polish colors and makeup application (lipstick + eyeshadow)

// NAIL POLISH COLOR PALETTE
// 8 vibrant colors for nail art
// These colors appear on finger nails in character renderer
const nailColors = [
    { name: 'Pink', color: '#FF69B4' },
    { name: 'Red', color: '#E74C3C' },
    { name: 'Purple', color: '#9B59B6' },
    { name: 'Blue', color: '#3498DB' },
    { name: 'Green', color: '#2ECC71' },
    { name: 'Yellow', color: '#F1C40F' },
    { name: 'Orange', color: '#E67E22' },
    { name: 'Black', color: '#2C3E50' }
];

// LIPSTICK COLOR PALETTE
// Includes 'none' option to remove lipstick
// Colors are applied to mouth in character renderer, making lips more prominent
const lipstickColors = [
    { name: 'None', color: 'none' },        // Default/natural lip color
    { name: 'Pink', color: '#FF69B4' },     // Bright pink
    { name: 'Red', color: '#DC143C' },      // Classic red
    { name: 'Mauve', color: '#9B6B7B' },    // Subtle mauve
    { name: 'Berry', color: '#8B0A50' },    // Deep berry
    { name: 'Nude', color: '#C9A084' }      // Natural nude
];

// EYESHADOW COLOR PALETTE
// Includes 'none' option for no eyeshadow
// Applied as semi-transparent overlay above eyes for subtle makeup effect
const eyeshadowColors = [
    { name: 'None', color: 'none' },        // No eyeshadow
    { name: 'Brown', color: '#8B4513' },    // Natural brown
    { name: 'Purple', color: '#9B59B6' },   // Bold purple
    { name: 'Blue', color: '#4A90E2' },     // Bright blue
    { name: 'Green', color: '#50C878' },    // Emerald green
    { name: 'Gold', color: '#FFD700' }      // Shimmery gold
];

// NAIL SALON UI LOADER
// Creates color picker interface for selecting nail polish
function loadNails(container) {
    container.innerHTML = '';

    // Activity header
    const intro = document.createElement('div');
    intro.className = 'activity-intro';
    intro.innerHTML = `<h3>Nail Salon</h3><p>Paint your nails!</p>`;
    container.appendChild(intro);

    // Color selection section
    const section = document.createElement('div');
    section.className = 'customization-section';
    section.innerHTML = '<h3>Nail Color</h3>';

    // Create grid of circular color buttons
    const grid = document.createElement('div');
    grid.className = 'color-grid';

    nailColors.forEach(nail => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';

        // Fill button with the actual nail polish color for preview
        btn.style.backgroundColor = nail.color;
        btn.title = nail.name;

        // On click: update nail color in state and refresh UI
        // This triggers character re-render with new nail color
        btn.onclick = () => {
            updateState('character.nails.color', nail.color);
            loadNails(container); // Reload to show active state
        };

        // Highlight currently selected color with active ring
        if (nail.color === gameState.character.nails.color) {
            btn.classList.add('active');
        }

        grid.appendChild(btn);
    });

    section.appendChild(grid);
    container.appendChild(section);
}

// MAKEUP UI LOADER
// Creates interface for both lipstick and eyeshadow selection
function loadMakeup(container) {
    container.innerHTML = '';

    // Activity header
    const intro = document.createElement('div');
    intro.className = 'activity-intro';
    intro.innerHTML = `<h3>Makeup</h3><p>Apply your makeup!</p>`;
    container.appendChild(intro);

    // LIPSTICK SECTION
    const lipSection = document.createElement('div');
    lipSection.className = 'customization-section';
    lipSection.innerHTML = '<h3>Lipstick</h3>';

    const lipGrid = document.createElement('div');
    lipGrid.className = 'color-grid';

    lipstickColors.forEach(lip => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';

        // Special visual for 'none' option: diagonal red line through white
        // This is universal symbol for "remove" or "none"
        if (lip.color === 'none') {
            btn.style.background = 'linear-gradient(45deg, white 45%, red 45%, red 55%, white 55%)';
        } else {
            // Show actual lipstick color
            btn.style.backgroundColor = lip.color;
        }

        btn.title = lip.name;

        // Update lipstick color in state
        // Character renderer checks this to modify mouth color and stroke width
        btn.onclick = () => {
            updateState('character.makeup.lipstick', lip.color);
            loadMakeup(container);
        };

        // Mark active selection
        if (lip.color === gameState.character.makeup.lipstick) {
            btn.classList.add('active');
        }

        lipGrid.appendChild(btn);
    });

    lipSection.appendChild(lipGrid);
    container.appendChild(lipSection);

    // EYESHADOW SECTION
    const shadowSection = document.createElement('div');
    shadowSection.className = 'customization-section';
    shadowSection.innerHTML = '<h3>Eyeshadow</h3>';

    const shadowGrid = document.createElement('div');
    shadowGrid.className = 'color-grid';

    eyeshadowColors.forEach(shadow => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';

        // Special visual for 'none' option (same as lipstick)
        if (shadow.color === 'none') {
            btn.style.background = 'linear-gradient(45deg, white 45%, red 45%, red 55%, white 55%)';
        } else {
            // Show actual eyeshadow color
            btn.style.backgroundColor = shadow.color;
        }

        btn.title = shadow.name;

        // Update eyeshadow color in state
        // Character renderer adds semi-transparent ellipses above eyes when set
        btn.onclick = () => {
            updateState('character.makeup.eyeshadow', shadow.color);
            loadMakeup(container);
        };

        // Highlight current selection
        if (shadow.color === gameState.character.makeup.eyeshadow) {
            btn.classList.add('active');
        }

        shadowGrid.appendChild(btn);
    });

    shadowSection.appendChild(shadowGrid);
    container.appendChild(shadowSection);
}
