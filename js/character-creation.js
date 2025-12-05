// Character Creation Module
// This module handles all character customization options including skin tones, hair textures, and hair colors

// Define available skin tones - representing the diverse spectrum of Black skin
// Each tone has a descriptive name and hex color value
const skinTones = [
    { name: 'Light', color: '#F4D3B5' },
    { name: 'Light Medium', color: '#D4A574' },
    { name: 'Medium', color: '#C68642' },
    { name: 'Medium Tan', color: '#A67C52' },
    { name: 'Tan', color: '#8D5524' },
    { name: 'Dark', color: '#6B4423' },
    { name: 'Deep', color: '#4A2F1F' },
    { name: 'Rich Deep', color: '#2D1B12' }
];

// Define available hair colors - natural and popular dyed colors
const hairColors = [
    { name: 'Black', color: '#1A1A1A' },
    { name: 'Dark Brown', color: '#3D2817' },
    { name: 'Brown', color: '#5C3A21' },
    { name: 'Light Brown', color: '#7D5A3B' },
    { name: 'Auburn', color: '#6B2C1F' },
    { name: 'Burgundy', color: '#800020' },
    { name: 'Blonde', color: '#C4A052' },
    { name: 'Gray', color: '#808080' }
];

/**
 * Main function to load the character creation UI
 * @param {HTMLElement} container - The tool panel container element to populate with UI
 *
 * This function builds the entire character creation interface with three sections:
 * 1. Skin tone selector (color grid)
 * 2. Hair texture selector (option buttons)
 * 3. Hair color selector (color grid)
 */
function loadCharacterCreation(container) {
    // Clear any existing content in the container
    container.innerHTML = '';

    // === SKIN TONE SECTION ===
    // Create a section wrapper for organization and styling
    const skinSection = document.createElement('div');
    skinSection.className = 'customization-section';
    skinSection.innerHTML = '<h3>Skin Tone</h3>';

    // Create grid container for color buttons
    // Using CSS Grid for responsive layout (4 columns)
    const skinGrid = document.createElement('div');
    skinGrid.className = 'color-grid';

    // Loop through each skin tone option and create a button
    skinTones.forEach(tone => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        // Set button background to the actual color for visual preview
        btn.style.backgroundColor = tone.color;
        // Use title attribute for accessibility - shows on hover
        btn.title = tone.name;
        // Click handler updates character state and passes button for active styling
        btn.onclick = () => selectSkinTone(tone.color, btn);

        // Check if this is the currently selected skin tone
        // If so, mark it as active (shows selection indicator)
        if (tone.color === gameState.character.appearance.skinTone) {
            btn.classList.add('active');
        }

        skinGrid.appendChild(btn);
    });

    skinSection.appendChild(skinGrid);
    container.appendChild(skinSection);

    // === HAIR TEXTURE SECTION ===
    // Hair texture options come from hairTextures object defined in hair-system.js
    const textureSection = document.createElement('div');
    textureSection.className = 'customization-section';
    textureSection.innerHTML = '<h3>Hair Texture</h3>';

    // Create grid for texture option buttons
    // Using 2-column grid for text-based buttons
    const textureGrid = document.createElement('div');
    textureGrid.className = 'option-grid';

    // Loop through hair textures (4C, 4B, 4A, 3C, 3B, 3A)
    Object.entries(hairTextures).forEach(([id, texture]) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        // Display the friendly name (e.g., "Type 4C")
        btn.textContent = texture.name;
        // Pass both id and button element, plus grid for removing active class from siblings
        btn.onclick = () => selectHairTexture(id, btn, textureGrid);

        // Mark currently selected texture as active
        if (id === gameState.character.hair.texture) {
            btn.classList.add('active');
        }

        textureGrid.appendChild(btn);
    });

    textureSection.appendChild(textureGrid);
    container.appendChild(textureSection);

    // === HAIR COLOR SECTION ===
    const colorSection = document.createElement('div');
    colorSection.className = 'customization-section';
    colorSection.innerHTML = '<h3>Hair Color</h3>';

    // Create grid for hair color buttons (similar to skin tone grid)
    const colorGrid = document.createElement('div');
    colorGrid.className = 'color-grid';

    hairColors.forEach(hairColor => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        // Set background to show the actual color
        btn.style.backgroundColor = hairColor.color;
        btn.title = hairColor.name;
        // Pass grid reference so we can remove active class from siblings
        btn.onclick = () => selectHairColor(hairColor.color, btn, colorGrid);

        // Mark currently selected hair color as active
        if (hairColor.color === gameState.character.hair.color) {
            btn.classList.add('active');
        }

        colorGrid.appendChild(btn);
    });

    colorSection.appendChild(colorGrid);
    container.appendChild(colorSection);
}

/**
 * Handle skin tone selection
 * @param {string} color - The hex color value of selected skin tone
 * @param {HTMLElement} button - The button element that was clicked
 *
 * This function:
 * 1. Removes active class from all skin tone buttons
 * 2. Adds active class to clicked button (visual feedback)
 * 3. Updates global game state which triggers character re-render
 */
function selectSkinTone(color, button) {
    // Get parent grid to find all sibling buttons
    const grid = button.parentElement;
    // Remove active class from all buttons in this grid
    grid.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    // Update state using the global updateState function from state.js
    // This will automatically trigger renderCharacter() to show changes immediately
    updateState('character.appearance.skinTone', color);
}

/**
 * Handle hair texture selection
 * @param {string} textureId - The texture ID (e.g., '4c', '3b')
 * @param {HTMLElement} button - The button that was clicked
 * @param {HTMLElement} grid - The grid container (to clear other selections)
 *
 * Updates the hair texture which affects how the hair is rendered
 * Different textures have different coil tightness and volume properties
 */
function selectHairTexture(textureId, button, grid) {
    // Remove active state from all texture buttons
    grid.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
    // Mark clicked button as active
    button.classList.add('active');
    // Update state - this triggers character re-render with new texture
    updateState('character.hair.texture', textureId);
}

/**
 * Handle hair color selection
 * @param {string} color - The hex color value of selected hair color
 * @param {HTMLElement} button - The button that was clicked
 * @param {HTMLElement} grid - The grid container (to clear other selections)
 *
 * Changes the hair color which is applied to all hair rendering functions
 */
function selectHairColor(color, button, grid) {
    // Remove active from all color buttons in grid
    grid.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    // Mark clicked button as active for visual feedback
    button.classList.add('active');
    // Update state - triggers immediate re-render with new hair color
    updateState('character.hair.color', color);
}
