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
   Converts the SVG character to a PNG image and downloads it.

   HOW SAVING WORKS - Step by step:

   1. SVG SERIALIZATION:
      - Get the SVG element from the DOM
      - Use XMLSerializer to convert SVG DOM tree into a string
      - This string contains all the SVG markup (paths, circles, colors, etc.)

   2. CANVAS CONVERSION:
      - Create an invisible canvas element (not added to page)
      - Canvas is like a bitmap drawing surface - needed because browsers
        can't directly save SVG as PNG
      - Set canvas dimensions to match SVG (400x600)

   3. BLOB CREATION:
      - Create a Blob (Binary Large Object) from the SVG string
      - Think of a Blob as a file-like object in memory
      - Specify MIME type as 'image/svg+xml' so browser knows it's SVG
      - Create a temporary URL pointing to this blob using createObjectURL

   4. IMAGE LOADING:
      - Create an Image object and load the SVG blob into it
      - This converts the SVG into a rasterized (pixel-based) image
      - We wait for img.onload before proceeding (asynchronous!)

   5. DRAWING TO CANVAS:
      - Fill canvas with white background (SVG might be transparent)
      - Draw the rasterized image onto the canvas
      - Now we have a pixel-based bitmap on the canvas
      - Clean up the blob URL (free memory)

   6. PNG EXPORT:
      - Use canvas.toBlob() to convert canvas pixels to PNG blob
      - toBlob is async, so we use a callback function
      - PNG blob is the actual downloadable file

   7. DOWNLOAD TRIGGER:
      - Create a temporary <a> link element (not added to page)
      - Set href to a URL pointing to the PNG blob
      - Set download attribute with timestamped filename
      - Programmatically click the link to trigger browser download
      - Show success message to user
*/
function saveCharacter() {
    // Step 1: Get SVG element and serialize it to string
    const svg = document.getElementById('character');
    if (!svg) return; // Safety check - exit if SVG not found

    // XMLSerializer converts DOM elements to string representation
    // This gives us the raw SVG markup we need
    const svgData = new XMLSerializer().serializeToString(svg);

    // Step 2: Create an off-screen canvas for conversion
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d'); // Get 2D drawing context

    // Match canvas size to SVG dimensions (from viewBox)
    canvas.width = 400;
    canvas.height = 600;

    // Step 3: Create blob from SVG string
    const img = new Image(); // Will hold the rasterized SVG
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob); // Create temporary URL for blob

    // Step 4: Load SVG into image (async operation)
    img.onload = function() {
        // Step 5: Draw to canvas
        // Fill with white first so transparent areas aren't black
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the loaded image onto the canvas
        // This converts vector SVG to raster pixels
        ctx.drawImage(img, 0, 0);

        // Clean up - revoke the blob URL to free memory
        URL.revokeObjectURL(url);

        // Step 6: Convert canvas to PNG blob
        canvas.toBlob(function(blob) {
            // Step 7: Trigger download
            // Create temporary link element to trigger download
            const link = document.createElement('a');
            link.download = `hairxyou-character-${Date.now()}.png`; // Timestamped filename
            link.href = URL.createObjectURL(blob); // Point to PNG blob
            link.click(); // Programmatically click to download

            // Show success message to user
            showSaveMessage();
        });
    };

    // Start the loading process by setting image source
    img.src = url;
}

/* ====================================
   SHOW SAVE MESSAGE FUNCTION
   ====================================

   Displays a temporary success message after saving.
   Message slides down from top, stays for 2 seconds, then fades out.
*/
function showSaveMessage() {
    // Create message element
    const message = document.createElement('div');
    message.className = 'save-message';
    message.textContent = '✅ Character saved!';
    document.body.appendChild(message);

    // Remove message after 2.5 seconds (2s visible + 0.5s fade)
    setTimeout(() => {
        message.classList.add('fade-out'); // Trigger fade animation
        setTimeout(() => message.remove(), 500); // Remove from DOM after fade
    }, 2000);
}
