// Hair Styling Activity Module
// This module handles both instant styling (afro, locs, wash-and-go) and
// interactive protective styling (braids, cornrows, twists) where users click sections

// Configuration object for all available hairstyles
// interactive: false = instant style change, no clicking required
// interactive: true = user must click each section to complete the style
// sections: number of clickable hair sections for interactive styles
const hairstyles = {
    'afro': { name: 'Afro', icon: '🌟', interactive: false },
    'box-braids': { name: 'Box Braids', icon: '💫', interactive: true, sections: 12 },
    'cornrows': { name: 'Cornrows', icon: '✨', interactive: true, sections: 8 },
    'two-strand-twists': { name: 'Two Strand Twists', icon: '🌀', interactive: true, sections: 16 },
    'flat-twists': { name: 'Flat Twists', icon: '💝', interactive: true, sections: 6 },
    'locs': { name: 'Locs', icon: '🔒', interactive: false },
    'wash-and-go': { name: 'Wash and Go', icon: '💧', interactive: false }
};

// Track the current styling session
// When user selects an interactive style, this stores the style details
let currentStyling = null;

// Array tracking which sections have been clicked and completed
// For example, if user clicked sections 0, 2, and 5, this would be [0, 2, 5]
let completedSections = [];

/**
 * Load the hair styling interface into the tool panel
 * Creates a grid of style cards for each hairstyle option
 *
 * @param {HTMLElement} container - The tool panel content div
 */
function loadHairStyling(container) {
    container.innerHTML = '';

    // Add intro section with activity description
    const intro = document.createElement('div');
    intro.className = 'activity-intro';
    intro.innerHTML = `<h3>Hair Styling</h3><p>Create beautiful hairstyles!</p>`;
    container.appendChild(intro);

    // Create grid container for style option cards
    const stylesContainer = document.createElement('div');
    stylesContainer.className = 'styles-grid';

    // Generate a clickable card for each hairstyle
    Object.entries(hairstyles).forEach(([id, style]) => {
        const card = document.createElement('button');
        card.className = 'style-card';
        card.innerHTML = `
            <span class="style-icon">${style.icon}</span>
            <span class="style-name">${style.name}</span>
        `;
        // When clicked, determine if style is instant or interactive
        card.onclick = () => selectHairstyle(id, style);
        stylesContainer.appendChild(card);
    });

    container.appendChild(stylesContainer);

    // Create instruction area (hidden initially)
    // This will show progress for interactive styles only
    const instructionArea = document.createElement('div');
    instructionArea.id = 'stylingInstructions';
    instructionArea.className = 'instruction-area';
    instructionArea.style.display = 'none'; // Hidden until interactive style is selected
    container.appendChild(instructionArea);
}

/**
 * Handle hairstyle selection
 * Routes to either instant application or interactive section-by-section styling
 *
 * @param {string} styleId - The ID of the selected style (e.g., 'box-braids')
 * @param {object} style - The style configuration object
 */
function selectHairstyle(styleId, style) {
    if (style.interactive) {
        // Interactive styles: user must click sections to complete
        // Examples: box braids, cornrows, two-strand twists
        startInteractiveStyling(styleId, style);
    } else {
        // Instant styles: immediately apply to character
        // Examples: afro, locs, wash-and-go
        // This updates game state which triggers character re-render
        updateState('character.hair.style', styleId);
    }
}

/**
 * Initialize an interactive styling session
 * Sets up the UI for section-by-section hair styling (braiding/twisting)
 *
 * How it works:
 * 1. Store current styling info so we can track progress
 * 2. Reset completed sections array
 * 3. Show instruction panel with progress bar
 * 4. Replace hair SVG with clickable sections
 *
 * @param {string} styleId - The style being applied
 * @param {object} style - Style configuration with sections count
 */
function startInteractiveStyling(styleId, style) {
    // Store current styling session details
    currentStyling = { id: styleId, style: style };

    // Reset progress - no sections completed yet
    completedSections = [];

    // Get instruction area to show progress
    const instructions = document.getElementById('stylingInstructions');
    if (!instructions) return;

    // Show instruction panel with progress tracking
    instructions.style.display = 'block';
    instructions.innerHTML = `
        <p><strong>${style.name}</strong></p>
        <p>Click sections of hair to style them!</p>
        <div class="progress-bar">
            <div class="progress-fill" id="stylingProgress" style="width: 0%"></div>
        </div>
        <p class="section-count"><span id="sectionsComplete">0</span> / ${style.sections}</p>
    `;

    // Replace hair with clickable sections
    // Each section represents a braid/twist/cornrow to be styled
    createHairSections(style.sections);
}

/**
 * Create clickable hair sections in the SVG
 * Replaces the normal hair rendering with vertical rectangular sections
 * Each section represents one braid, twist, or cornrow to be completed
 *
 * Visual design:
 * - Sections are vertical rectangles arranged horizontally across the head
 * - Dashed stroke indicates "not yet styled"
 * - Lower opacity until clicked
 * - Each section is independently clickable
 *
 * @param {int} count - Number of sections to create (12 for box braids, 8 for cornrows, etc.)
 */
function createHairSections(count) {
    const hairGroup = document.getElementById('hairGroup');
    if (!hairGroup) return;

    // Clear existing hair rendering
    hairGroup.innerHTML = '';

    // Layout calculations
    const baseY = 180; // Top of hair sections (y-coordinate)
    const totalWidth = 280; // Total width to distribute sections across
    const sectionWidth = totalWidth / count; // Width of each individual section

    // Create each section as a clickable rectangle
    for (let i = 0; i < count; i++) {
        // Calculate x position for this section
        // Sections are evenly distributed from left to right
        const x = 70 + (i * sectionWidth);

        // Create rectangle SVG element for this section
        const section = createSVGElement('rect', {
            x: x,
            y: baseY,
            width: sectionWidth - 5, // Small gap between sections
            height: 200, // Length of hair
            fill: gameState.character.hair.color, // Use character's hair color
            stroke: '#fff', // White border
            'stroke-width': '2',
            'stroke-dasharray': '5,5', // Dashed border = "not styled yet"
            opacity: '0.7', // Semi-transparent until styled
            class: 'hair-section'
        });

        // Make section interactive
        section.style.cursor = 'pointer'; // Show hand cursor on hover

        // Add click handler - when clicked, this section gets "styled"
        section.addEventListener('click', () => styleSection(i, section));

        hairGroup.appendChild(section);
    }
}

/**
 * Handle clicking a hair section
 * This is where the interactive styling magic happens!
 *
 * When a section is clicked:
 * 1. Mark it as completed (prevent double-clicking)
 * 2. Update visual appearance (solid, not dashed)
 * 3. Play a subtle animation (bounce effect)
 * 4. Update progress bar
 * 5. Check if all sections are done
 *
 * @param {int} sectionIndex - Which section was clicked (0-based index)
 * @param {SVGElement} sectionElement - The SVG rect element that was clicked
 */
function styleSection(sectionIndex, sectionElement) {
    // Prevent styling the same section twice
    if (completedSections.includes(sectionIndex)) return;

    // Mark this section as completed
    completedSections.push(sectionIndex);

    // Visual feedback: section is now "styled"
    sectionElement.setAttribute('opacity', '1'); // Full opacity = styled
    sectionElement.setAttribute('stroke-dasharray', '0'); // Solid border = complete

    // Subtle animation: section briefly moves down then back up
    // This gives satisfying click feedback
    const originalY = parseFloat(sectionElement.getAttribute('y'));
    sectionElement.style.transition = 'all 0.5s ease';
    sectionElement.setAttribute('y', originalY + 10); // Move down
    setTimeout(() => sectionElement.setAttribute('y', originalY), 100); // Move back

    // Update progress bar
    // Calculate percentage: (completed / total) * 100
    const progress = (completedSections.length / currentStyling.style.sections) * 100;
    const progressBar = document.getElementById('stylingProgress');
    const completeSpan = document.getElementById('sectionsComplete');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (completeSpan) completeSpan.textContent = completedSections.length;

    // Check if styling is complete (all sections clicked)
    if (completedSections.length === currentStyling.style.sections) {
        completeStyling();
    }
}

/**
 * Called when all sections have been styled
 * Finalizes the hairstyle and updates the character
 *
 * Flow:
 * 1. Show success message
 * 2. Update game state with new hairstyle
 * 3. Character re-renders automatically (state.js triggers renderCharacter)
 * 4. Hide instruction panel after brief delay
 * 5. Reset styling session
 */
function completeStyling() {
    const instructions = document.getElementById('stylingInstructions');
    if (!instructions) return;

    // Show success message
    instructions.innerHTML = `
        <p class="success-message">✅ ${currentStyling.style.name} complete!</p>
        <p>Your hair looks amazing!</p>
    `;

    // Update character state with completed style
    // This triggers hair-system.js to render the final hairstyle
    // The proper braids/twists/cornrows will now show instead of sections
    updateState('character.hair.style', currentStyling.id);

    // Auto-hide instruction panel after 2 seconds
    setTimeout(() => {
        instructions.style.display = 'none';
        currentStyling = null; // Clear session
    }, 2000);
}
