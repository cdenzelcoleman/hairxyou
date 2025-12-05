/**
 * Character Renderer Module
 *
 * This module handles the SVG rendering of the character.
 * It takes the gameState and translates it into visual SVG elements.
 *
 * The character is rendered in layers from back to front:
 * 1. Body (torso)
 * 2. Neck (connects head to body)
 * 3. Head (face base)
 * 4. Facial Features (eyes, nose, mouth, etc.)
 * 5. Hair (rendered on top, can be styled differently)
 * 6. Outfit (clothing on the body)
 * 7. Nails (small detail on hands)
 */

/**
 * Main render function - called whenever the character state changes.
 * This clears the SVG and redraws all character components in the correct order.
 */
function renderCharacter() {
    const svg = document.getElementById('character');
    if (!svg) return;

    // Get current character state from global gameState
    const state = gameState.character;

    // Clear previous rendering - start fresh each time
    svg.innerHTML = '';

    // Render in correct z-order (back to front)
    // Body parts first, then details on top
    renderBody(svg, state);
    renderNeck(svg, state);
    renderHead(svg, state);
    renderFacialFeatures(svg, state);
    renderHair(svg, state);
    renderOutfit(svg, state);
    renderNails(svg, state);
}

/**
 * Renders the body (torso) of the character.
 * Uses an ellipse positioned at the lower part of the SVG canvas.
 *
 * Position: Center-bottom of canvas (x=200, y=480)
 * Size: rx=80 (width), ry=100 (height)
 */
function renderBody(svg, state) {
    const body = createSVGElement('ellipse', {
        cx: '200',      // Horizontal center of 400px canvas
        cy: '480',      // Lower in canvas (body below head)
        rx: '80',       // Width radius - makes body wider
        ry: '100',      // Height radius - makes body taller vertically
        fill: state.appearance.skinTone,  // Use character's skin color
        id: 'body'
    });
    svg.appendChild(body);
}

/**
 * Renders the neck connecting head to body.
 * Simple rectangle positioned between head and body.
 *
 * Position: x=180, y=360 (between head at ~280 and body at ~480)
 */
function renderNeck(svg, state) {
    const neck = createSVGElement('rect', {
        x: '180',       // Slightly left of center (200-20)
        y: '360',       // Between head and body vertically
        width: '40',    // Narrow width for realistic neck
        height: '50',   // Connects head (ends ~390) to body (starts ~380)
        fill: state.appearance.skinTone,  // Same color as skin
        id: 'neck'
    });
    svg.appendChild(neck);
}

/**
 * Renders the head (face base) of the character.
 * Larger ellipse positioned in upper-middle of canvas.
 *
 * Position: Center-top of canvas (x=200, y=280)
 * Size: rx=90, ry=110 (taller than wide for natural head shape)
 */
function renderHead(svg, state) {
    const head = createSVGElement('ellipse', {
        cx: '200',      // Horizontal center
        cy: '280',      // Upper portion of canvas
        rx: '90',       // Width radius
        ry: '110',      // Height radius - taller for head shape
        fill: state.appearance.skinTone,
        id: 'head'
    });
    svg.appendChild(head);
}

/**
 * Renders all facial features (eyes, nose, mouth, etc.)
 * This is the most complex render function with many elements.
 *
 * Features rendered:
 * - Eyeshadow (if makeup applied)
 * - Eyes (whites, irises, pupils, highlights)
 * - Eyelashes (3 per eye)
 * - Nose
 * - Mouth (color changes with lipstick)
 * - Cheeks (pink blush effect)
 */
function renderFacialFeatures(svg, state) {
    // EYESHADOW (only if makeup is applied)
    // Positioned above eyes as subtle colored ellipses
    if (state.makeup.eyeshadow && state.makeup.eyeshadow !== 'none') {
        const leftEyeshadow = createSVGElement('ellipse', {
            cx: '170', cy: '265',   // Above left eye
            rx: '20', ry: '10',     // Wide and short ellipse
            fill: state.makeup.eyeshadow,
            opacity: '0.6'          // Semi-transparent for makeup effect
        });
        svg.appendChild(leftEyeshadow);

        const rightEyeshadow = createSVGElement('ellipse', {
            cx: '230', cy: '265',   // Above right eye (symmetrical)
            rx: '20', ry: '10',
            fill: state.makeup.eyeshadow,
            opacity: '0.6'
        });
        svg.appendChild(rightEyeshadow);
    }

    // EYES - Built in layers: white -> iris -> pupil -> highlight
    // Left eye white
    const leftEyeWhite = createSVGElement('ellipse', {
        cx: '170',      // Left side of face
        cy: '270',      // Eye level
        rx: '15',       // Width of eye
        ry: '18',       // Height slightly taller
        fill: 'white'
    });
    svg.appendChild(leftEyeWhite);

    // Right eye white
    const rightEyeWhite = createSVGElement('ellipse', {
        cx: '230',      // Right side of face (60px apart for spacing)
        cy: '270',      // Same level as left eye
        rx: '15', ry: '18',
        fill: 'white'
    });
    svg.appendChild(rightEyeWhite);

    // Left iris (colored part of eye - brown)
    const leftIris = createSVGElement('circle', {
        cx: '170',
        cy: '272',      // Slightly lower than white for positioning
        r: '10',        // Smaller than white, sits inside
        fill: '#4A2511' // Brown color
    });
    svg.appendChild(leftIris);

    // Right iris
    const rightIris = createSVGElement('circle', {
        cx: '230', cy: '272', r: '10',
        fill: '#4A2511'
    });
    svg.appendChild(rightIris);

    // Left pupil (black center)
    const leftPupil = createSVGElement('circle', {
        cx: '170', cy: '272',
        r: '5',         // Smaller than iris
        fill: 'black'
    });
    svg.appendChild(leftPupil);

    // Right pupil
    const rightPupil = createSVGElement('circle', {
        cx: '230', cy: '272', r: '5',
        fill: 'black'
    });
    svg.appendChild(rightPupil);

    // Eye highlights (white dots that make eyes look shiny/alive)
    const leftHighlight = createSVGElement('circle', {
        cx: '172',      // Slightly offset from center
        cy: '270',      // Upper part of eye
        r: '3',         // Small dot
        fill: 'white'
    });
    svg.appendChild(leftHighlight);

    const rightHighlight = createSVGElement('circle', {
        cx: '232', cy: '270', r: '3',
        fill: 'white'
    });
    svg.appendChild(rightHighlight);

    // EYELASHES - Three lines per eye extending upward
    // Loop creates 3 lashes per eye, evenly spaced
    for(let i = 0; i < 3; i++) {
        // Left eye lashes
        const leftLash = createSVGElement('line', {
            x1: 160 + (i * 5),  // Start x (spaced 5px apart)
            y1: '260',          // Start y (at top of eye)
            x2: 158 + (i * 5),  // End x (slightly inward for curve)
            y2: '255',          // End y (5px above start)
            stroke: 'black',
            'stroke-width': '2',
            'stroke-linecap': 'round'  // Rounded ends
        });
        svg.appendChild(leftLash);

        // Right eye lashes (mirror of left)
        const rightLash = createSVGElement('line', {
            x1: 240 + (i * 5),  // Starts further right
            y1: '260',
            x2: 238 + (i * 5),
            y2: '255',
            stroke: 'black',
            'stroke-width': '2',
            'stroke-linecap': 'round'
        });
        svg.appendChild(rightLash);
    }

    // NOSE - Simple ellipse in center of face
    const nose = createSVGElement('ellipse', {
        cx: '200',      // Center of face
        cy: '300',      // Below eyes
        rx: '8',        // Small width
        ry: '12',       // Taller than wide
        fill: state.appearance.skinTone,
        opacity: '0.8'  // Slightly see-through for subtle effect
    });
    svg.appendChild(nose);

    // MOUTH - Curved path that smiles
    // Color and thickness change if lipstick is applied
    const mouthColor = (state.makeup.lipstick && state.makeup.lipstick !== 'none')
        ? state.makeup.lipstick  // Use lipstick color if applied
        : '#8B4513';             // Default brown/neutral
    const mouthWidth = (state.makeup.lipstick && state.makeup.lipstick !== 'none')
        ? '5'   // Thicker line with lipstick
        : '3';  // Normal line without

    // Path creates a smile curve using quadratic bezier (Q)
    const mouth = createSVGElement('path', {
        d: 'M 180 330 Q 200 345 220 330',  // Start 180, curve down to 345, end 220
        stroke: mouthColor,
        'stroke-width': mouthWidth,
        fill: 'none',              // No fill, just outline
        'stroke-linecap': 'round'  // Rounded ends
    });
    svg.appendChild(mouth);

    // CHEEKS - Pink blush effect on sides of face
    const leftCheek = createSVGElement('ellipse', {
        cx: '155',      // Left side
        cy: '305',      // Cheek level (below eyes, above mouth)
        rx: '18',       // Width
        ry: '12',       // Height (wider than tall)
        fill: '#FF69B4', // Hot pink
        opacity: '0.3'  // Very transparent for blush effect
    });
    svg.appendChild(leftCheek);

    const rightCheek = createSVGElement('ellipse', {
        cx: '245',      // Right side (symmetrical)
        cy: '305', rx: '18', ry: '12',
        fill: '#FF69B4',
        opacity: '0.3'
    });
    svg.appendChild(rightCheek);
}

/**
 * Renders the character's hair.
 * Creates a group for hair elements and calls specialized hair rendering functions.
 *
 * Hair is complex and has its own system (hair-system.js) for different textures.
 * If that system exists, it's used. Otherwise, a default afro is rendered.
 */
function renderHair(svg, state) {
    // Create a group element to hold all hair elements together
    const hairGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hairGroup.setAttribute('id', 'hairGroup');

    // Check if advanced hair system exists (added in later task)
    if (typeof renderHairByTexture === 'function') {
        // Use the advanced system with different textures and styles
        renderHairByTexture(hairGroup, state);
    } else {
        // Default simple afro - large ellipse on top of head
        const defaultHair = createSVGElement('ellipse', {
            cx: '200',      // Centered
            cy: '200',      // Above head (head is at 280)
            rx: '110',      // Wider than head for volume
            ry: '100',      // Round shape
            fill: state.hair.color
        });
        hairGroup.appendChild(defaultHair);
    }

    svg.appendChild(hairGroup);
}

/**
 * Renders the character's outfit (top and bottom).
 * Gets outfit data based on current outfit IDs and draws rectangles/shapes.
 *
 * Tops are rendered as rectangles on the body.
 * If it's a dress, an additional shape extends downward.
 * Bottoms are only shown if not wearing a dress.
 */
function renderOutfit(svg, state) {
    // Get the color and type info for current outfit items
    const outfitData = getOutfitData(state.outfit.top, state.outfit.bottom);

    // Render top (t-shirt or dress top)
    if (outfitData.top) {
        const top = createSVGElement('rect', {
            x: '140',       // Left edge (20px from body center-60px from body left)
            y: '390',       // Start below neck
            width: '120',   // Width to cover body
            height: '90',   // Height of shirt
            fill: outfitData.top.color,
            rx: '10'        // Rounded corners
        });
        svg.appendChild(top);

        // If wearing a dress, add the bottom part
        if (outfitData.top.id.includes('dress')) {
            // Path creates a trapezoid shape for dress bottom
            const dressBottom = createSVGElement('path', {
                d: 'M 140 480 L 130 540 L 270 540 L 260 480 Z',
                // Start at top-left, go to bottom-left, bottom-right, top-right, close
                fill: outfitData.top.color
            });
            svg.appendChild(dressBottom);
        }
    }

    // Render bottom (pants/skirt) only if not wearing a dress
    if (outfitData.bottom && !outfitData.top.id.includes('dress')) {
        const bottom = createSVGElement('rect', {
            x: '150',       // Narrower than top
            y: '480',       // Start where top ends
            width: '100',   // Narrower width
            height: '70',   // Height of pants/skirt
            fill: outfitData.bottom.color,
            rx: '8'
        });
        svg.appendChild(bottom);
    }
}

/**
 * Renders the character's nails.
 * Small ellipses positioned at hand locations.
 *
 * Shows 4 nails (2 per hand) at the sides of the body.
 */
function renderNails(svg, state) {
    // Array of nail positions (x, y coordinates)
    const nailPositions = [
        { x: 140, y: 480 },  // Left hand nail 1
        { x: 150, y: 475 },  // Left hand nail 2
        { x: 260, y: 480 },  // Right hand nail 1
        { x: 250, y: 475 }   // Right hand nail 2
    ];

    // Create a small ellipse for each nail position
    nailPositions.forEach(pos => {
        const nail = createSVGElement('ellipse', {
            cx: pos.x,
            cy: pos.y,
            rx: '4',        // Small width
            ry: '6',        // Slightly taller (oval shape)
            fill: state.nails.color,  // Use chosen nail color
            stroke: 'rgba(0,0,0,0.2)',  // Subtle dark outline
            'stroke-width': '1'
        });
        svg.appendChild(nail);
    });
}

/**
 * Helper function to get outfit data (colors and IDs).
 * Takes outfit IDs and returns the corresponding outfit objects.
 *
 * This data structure maps outfit IDs to colors.
 * Each outfit has an id and color property.
 */
function getOutfitData(topId, bottomId) {
    // Outfit database - maps IDs to properties
    const allOutfits = {
        // T-shirts
        'tshirt-pink': { id: 'tshirt-pink', color: '#FF69B4' },
        'tshirt-purple': { id: 'tshirt-purple', color: '#9B59B6' },
        'tshirt-blue': { id: 'tshirt-blue', color: '#3498DB' },
        'tshirt-yellow': { id: 'tshirt-yellow', color: '#F1C40F' },
        // Dresses
        'dress-red': { id: 'dress-red', color: '#E74C3C' },
        'dress-green': { id: 'dress-green', color: '#2ECC71' },
        // Bottoms
        'jeans': { id: 'jeans', color: '#2C3E50' },
        'skirt-pink': { id: 'skirt-pink', color: '#FF69B4' },
        'skirt-purple': { id: 'skirt-purple', color: '#9B59B6' },
        'shorts-blue': { id: 'shorts-blue', color: '#3498DB' }
    };

    // Return object with top and bottom data
    return {
        top: allOutfits[topId],
        bottom: allOutfits[bottomId]
    };
}

/**
 * Utility function to create SVG elements with attributes.
 *
 * SVG elements must be created with the SVG namespace.
 * This function simplifies creating elements and setting multiple attributes.
 *
 * @param {string} type - SVG element type (e.g., 'circle', 'rect', 'path')
 * @param {object} attributes - Key-value pairs of attributes to set
 * @returns {SVGElement} The created SVG element
 */
function createSVGElement(type, attributes) {
    // Create element in SVG namespace (required for SVG)
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);

    // Set all provided attributes
    for (let [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    return element;
}
