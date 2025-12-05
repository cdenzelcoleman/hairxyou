// Activities Module
// This file manages the activity menu system - the main navigation for the game
// It creates buttons for each activity and handles switching between them

// Activity definitions - each activity has a name, icon, and description
// These are the 6 main sections of the game that users can interact with
const activities = {
    'character-creation': {
        name: 'Create Character',
        icon: '👤',
        description: 'Customize your character'
    },
    'hair-care': {
        name: 'Hair Care',
        icon: '🚿',
        description: 'Wash, condition, detangle'
    },
    'hair-styling': {
        name: 'Hair Styling',
        icon: '💇🏾‍♀️',
        description: 'Create beautiful styles'
    },
    'dress-up': {
        name: 'Dress Up',
        icon: '👗',
        description: 'Choose outfits'
    },
    'nails': {
        name: 'Nail Salon',
        icon: '💅🏾',
        description: 'Paint nails'
    },
    'makeup': {
        name: 'Makeup',
        icon: '💄',
        description: 'Apply makeup'
    }
};

// Initialize the activity menu when the page loads
// This function is called from app.js after the DOM is ready
function initializeActivityMenu() {
    // Get the menu container element where we'll add our buttons
    const menu = document.getElementById('activityMenu');
    if (!menu) return;

    // Add a heading to the activity menu
    menu.innerHTML = '<h2>Activities</h2>';

    // Create a container div to hold all the activity buttons
    // This allows us to style them separately from the heading
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'activity-buttons';

    // Loop through each activity and create a button for it
    // Object.entries() converts the activities object into [key, value] pairs
    for (let [id, activity] of Object.entries(activities)) {
        // Create a button element for this activity
        const button = document.createElement('button');
        button.className = 'activity-btn';

        // Store the activity ID in a data attribute so we can reference it later
        button.dataset.activity = id;

        // Set the button's inner HTML with icon and name
        // Using template literal for clean multi-line HTML
        button.innerHTML = `
            <span class="activity-icon">${activity.icon}</span>
            <span class="activity-name">${activity.name}</span>
        `;

        // Add click handler - when clicked, switch to this activity
        // We use an arrow function to maintain context and pass the activity ID
        button.onclick = () => switchActivity(id);

        // Add the button to our button container
        buttonContainer.appendChild(button);
    }

    // Add the button container to the menu
    menu.appendChild(buttonContainer);
}

// Switch to a different activity when a button is clicked
// This function handles the visual state and loading the activity's content
function switchActivity(activityId) {
    // Update the game state to track which activity is currently active
    gameState.currentActivity = activityId;

    // Remove the 'active' class from all activity buttons
    // This ensures only one button is highlighted at a time
    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add the 'active' class to the button that was just clicked
    // We find the button using its data-activity attribute
    const activeBtn = document.querySelector(`[data-activity="${activityId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Load the content for this activity in the tool panel
    loadActivityPanel(activityId);
}

// Load the appropriate content panel for the selected activity
// Each activity will have its own module that provides a loading function
function loadActivityPanel(activityId) {
    // Get references to the tool panel elements
    const title = document.getElementById('toolPanelTitle');
    const content = document.getElementById('toolPanelContent');

    // Update the panel title to show the current activity name
    if (title) {
        title.textContent = activities[activityId].name;
    }

    // If we can't find the content container, exit early
    if (!content) return;

    // Switch statement to load the appropriate activity module
    // Each case checks if the loading function exists before calling it
    // If not, shows a "Coming soon..." message as a placeholder
    switch(activityId) {
        case 'character-creation':
            // Check if the character creation module has loaded
            if (typeof loadCharacterCreation === 'function') {
                loadCharacterCreation(content);
            } else {
                content.innerHTML = '<p>Coming soon...</p>';
            }
            break;
        case 'hair-care':
            // Check if the hair care module has loaded
            if (typeof loadHairCare === 'function') {
                loadHairCare(content);
            } else {
                content.innerHTML = '<p>Coming soon...</p>';
            }
            break;
        case 'hair-styling':
            // Check if the hair styling module has loaded
            if (typeof loadHairStyling === 'function') {
                loadHairStyling(content);
            } else {
                content.innerHTML = '<p>Coming soon...</p>';
            }
            break;
        case 'dress-up':
            // Check if the dress up module has loaded
            if (typeof loadDressUp === 'function') {
                loadDressUp(content);
            } else {
                content.innerHTML = '<p>Coming soon...</p>';
            }
            break;
        case 'nails':
            // Check if the nails module has loaded
            if (typeof loadNails === 'function') {
                loadNails(content);
            } else {
                content.innerHTML = '<p>Coming soon...</p>';
            }
            break;
        case 'makeup':
            // Check if the makeup module has loaded
            if (typeof loadMakeup === 'function') {
                loadMakeup(content);
            } else {
                content.innerHTML = '<p>Coming soon...</p>';
            }
            break;
    }
}
