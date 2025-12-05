/* ====================================
   APP INITIALIZATION
   ====================================

   This file handles the main application startup.
   It runs when the page fully loads and initializes all game components.
*/

/* Wait for the DOM (HTML page) to fully load before running initialization code */
document.addEventListener('DOMContentLoaded', () => {
    console.log('HairXYou initialized!');

    /* Initialize the activity menu (left sidebar buttons)
       This function is defined in activities.js
       Check if it exists before calling to prevent errors if file not loaded yet */
    if (typeof initializeActivityMenu === 'function') {
        initializeActivityMenu();
    }

    /* Render the character for the first time
       This function is defined in character-renderer.js
       Uses the default state from state.js */
    if (typeof renderCharacter === 'function') {
        renderCharacter();
    }

    /* Set up the save button click handler */
    document.getElementById('saveBtn').addEventListener('click', saveCharacter);
});

/* ====================================
   SAVE CHARACTER FUNCTION
   ====================================

   Called when user clicks the "Save My Character" button.
   Currently just logs a message - full implementation coming in Task 10.

   Future functionality:
   - Convert SVG to PNG image
   - Download the image to user's computer
   - Show success message
*/
function saveCharacter() {
    console.log('Save character feature coming soon...');
}
