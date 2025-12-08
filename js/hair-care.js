// Hair Care Activity Module
// Handles interactive hair care routine with clickable steps

// State tracking for current hair care activity
// currentHairCareStep: tracks which step (wet, shampoo, condition, etc.) is active
// careClicks: counts how many times user has clicked the hair during current step
let currentHairCareStep = null;
let careClicks = 0;
const CLICKS_NEEDED = 5; // Number of clicks required to complete each step

// Main function to load the hair care UI into the tool panel
// Called by activities.js when user clicks "Hair Care" button
function loadHairCare(container) {
    container.innerHTML = '';

    // Create intro section with activity title and description
    const intro = document.createElement('div');
    intro.className = 'activity-intro';
    intro.innerHTML = `
        <h3>Hair Care Routine</h3>
        <p>Take care of your hair!</p>
    `;
    container.appendChild(intro);

    // Define all hair care steps with their icons
    // Each step represents a real hair care routine action
    const steps = [
        { id: 'wet', name: 'Wet Hair', icon: '💧' },
        { id: 'shampoo', name: 'Shampoo', icon: '🧴' },
        { id: 'condition', name: 'Condition', icon: '✨' },
        { id: 'detangle', name: 'Detangle', icon: '🪮' },
        { id: 'rinse', name: 'Rinse', icon: '🚿' }
    ];

    // Create container for step buttons
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'steps-container';

    // Generate a button for each step
    steps.forEach(step => {
        const btn = document.createElement('button');
        btn.className = 'step-btn';
        btn.innerHTML = `
            <span class="step-icon">${step.icon}</span>
            <span class="step-name">${step.name}</span>
        `;
        // When clicked, start this hair care step
        btn.onclick = () => startHairCareStep(step.id, step.name);
        stepsContainer.appendChild(btn);
    });

    container.appendChild(stepsContainer);

    // Create instruction area that will show interactive instructions
    // This area updates dynamically as the user interacts with the activity
    const instructionArea = document.createElement('div');
    instructionArea.id = 'hairCareInstructions';
    instructionArea.className = 'instruction-area';
    instructionArea.innerHTML = '<p>Choose a step to begin!</p>';
    container.appendChild(instructionArea);
}

// Starts a specific hair care step when user clicks a step button
// Sets up the UI for interactive clicking and tracks progress
function startHairCareStep(stepId, stepName) {
    // Store which step is currently active
    currentHairCareStep = stepId;
    // Reset click counter for this new step
    careClicks = 0;

    // Get the instruction area to update with step-specific instructions
    const instructions = document.getElementById('hairCareInstructions');
    if (!instructions) return;

    // Update instructions with:
    // - Current step name
    // - Instructions to click the hair
    // - Progress bar (starts at 0%)
    instructions.innerHTML = `
        <p><strong>${stepName}</strong></p>
        <p>Click on the hair ${CLICKS_NEEDED} times!</p>
        <div class="progress-bar">
            <div class="progress-fill" id="hairCareProgress" style="width: 0%"></div>
        </div>
    `;

    // Make the hair clickable for this activity
    enableHairInteraction();
}

// Makes the hair element on the SVG clickable
// Sets up cursor styling and click handler
function enableHairInteraction() {
    // Find the hair element in the SVG (rendered by hair-system.js)
    const hairGroup = document.getElementById('hairGroup');
    if (!hairGroup) return;

    // Change cursor to pointer to indicate it's clickable
    hairGroup.style.cursor = 'pointer';
    // Attach click handler - each click will call handleHairCareClick
    hairGroup.onclick = handleHairCareClick;
}

// Handles each click on the hair during a hair care step
// Updates progress bar, shows sparkle animation, checks for completion
function handleHairCareClick(e) {
    // Only process clicks if a step is currently active
    if (!currentHairCareStep) return;

    // Increment click counter
    careClicks++;
    // Calculate progress percentage (e.g., 3 clicks out of 5 = 60%)
    const progress = (careClicks / CLICKS_NEEDED) * 100;
    const progressBar = document.getElementById('hairCareProgress');

    // Update progress bar visual - animate width from current to new percentage
    if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    // Show sparkle effect at click location for satisfying visual feedback
    // clientX and clientY give us the exact mouse click position
    addSparkleEffect(e.clientX, e.clientY);

    // Check if step is complete (reached required number of clicks)
    if (careClicks >= CLICKS_NEEDED) {
        completeHairCareStep();
    }
}

// Called when user completes a hair care step (5 clicks reached)
// Shows success message and resets the activity
function completeHairCareStep() {
    const instructions = document.getElementById('hairCareInstructions');
    if (!instructions) return;

    // Display success message with checkmark
    instructions.innerHTML = `
        <p class="success-message">✅ Step complete!</p>
        <p>Choose another step or switch activities!</p>
    `;

    // Disable hair clicking until another step is started
    const hairGroup = document.getElementById('hairGroup');
    if (hairGroup) {
        hairGroup.style.cursor = 'default'; // Reset cursor
        hairGroup.onclick = null; // Remove click handler
    }

    // Reset step tracking
    currentHairCareStep = null;
    // Update character state - set moisture to 100% (fully moisturized hair)
    updateState('character.hair.moisture', 100);
}

// Creates and animates a sparkle emoji at the click position
// Provides immediate visual feedback that the click was registered
function addSparkleEffect(x, y) {
    // Create a new div element for the sparkle
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle'; // CSS class handles animation
    // Position at exact click coordinates
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.textContent = '✨'; // Sparkle emoji
    // Add to page (will be positioned absolutely)
    document.body.appendChild(sparkle);

    // Remove sparkle after animation completes (1 second)
    // This prevents DOM from filling up with sparkle elements
    setTimeout(() => sparkle.remove(), 1000);
}
