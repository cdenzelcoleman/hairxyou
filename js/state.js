/* ====================================
   GAME STATE MANAGEMENT
   ====================================

   This file manages all game state in a single centralized object.
   This makes it easy to:
   - Track all character properties in one place
   - Update state consistently
   - Save/load state later
   - Debug what's happening in the game
*/

/* Main game state object - holds all character data and current activity */
const gameState = {
    /* Character properties organized by category */
    character: {
        /* Physical appearance properties */
        appearance: {
            skinTone: '#8D5524',    // Default medium-tan skin tone (hex color)
            faceShape: 'oval'        // Face shape - could be used for future variations
        },

        /* Hair properties - most complex part of character */
        hair: {
            texture: '4c',           // Hair texture type: 4c, 4b, 4a, 3c, 3b, 3a
            length: 'medium',        // Length: short, medium, long (for future use)
            moisture: 100,           // Hair moisture level (0-100) - affects rendering
            style: 'afro',           // Current hairstyle (see hair-system.js for all styles)
            color: '#1A1A1A'         // Hair color (default: black)
        },

        /* Outfit/clothing properties */
        outfit: {
            top: 'tshirt-pink',      // ID of top clothing item
            bottom: 'jeans',         // ID of bottom clothing item
            shoes: 'sneakers'        // ID of shoes item - rendered on feet
        },

        /* Nail polish properties */
        nails: {
            color: '#FF69B4',        // Nail color (default: pink)
            length: 'medium'         // Nail length (for future use)
        },

        /* Makeup properties */
        makeup: {
            lipstick: 'none',        // Lipstick color or 'none'
            eyeshadow: 'none'        // Eyeshadow color or 'none'
        }
    },

    /* Current activity being shown - corresponds to activity IDs in activities.js */
    currentActivity: null
};

/* ====================================
   STATE UPDATE FUNCTION
   ====================================

   Updates a nested property in gameState using dot notation.
   Automatically triggers character re-render after update.

   Example usage:
   updateState('character.hair.color', '#FF0000')
   updateState('character.appearance.skinTone', '#D4A574')
*/
function updateState(path, value) {
    // Split the path into individual keys
    // Example: 'character.hair.color' becomes ['character', 'hair', 'color']
    const keys = path.split('.');

    // Start at the root of gameState
    let current = gameState;

    // Navigate to the parent of the property we want to update
    // Stop before the last key since we'll set that separately
    for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
    }

    // Set the final property to the new value
    current[keys[keys.length - 1]] = value;

    // Automatically re-render the character to reflect the change
    // Check if renderCharacter function exists first (it's defined in character-renderer.js)
    if (typeof renderCharacter === 'function') {
        renderCharacter();
    }
}

/* ====================================
   STATE GETTER FUNCTION
   ====================================

   Retrieves a nested property from gameState using dot notation.

   Example usage:
   const currentHairColor = getState('character.hair.color')
   const skinTone = getState('character.appearance.skinTone')
*/
function getState(path) {
    // Split the path into individual keys
    const keys = path.split('.');

    // Start at the root of gameState
    let current = gameState;

    // Navigate through each key to get to the final value
    for (let key of keys) {
        current = current[key];
    }

    // Return the value at that path
    return current;
}
