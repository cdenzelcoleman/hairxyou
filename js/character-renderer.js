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

    // GRAPHICS ENHANCEMENT: Define gradient and filter definitions for enhanced visuals
    const defs = createSVGElement('defs', {});
    svg.appendChild(defs);

    // Create lighting effects once for the entire character
    createLightingEffects(defs);

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
 * GRAPHICS ENHANCEMENT: Creates lighting effects, gradients, and filters
 * This function sets up reusable SVG definitions for enhanced visuals
 * MONSTER HIGH STYLE: Added bold outlines, glossy effects, sparkle patterns
 */
function createLightingEffects(defs) {
    // Drop shadow filter for depth (used on all major elements)
    const dropShadow = createSVGElement('filter', { id: 'dropShadow' });
    const feGaussianBlur = createSVGElement('feGaussianBlur', {
        in: 'SourceAlpha',
        stdDeviation: '3'
    });
    const feOffset = createSVGElement('feOffset', {
        dx: '2',
        dy: '4',
        result: 'offsetblur'
    });
    const feFlood = createSVGElement('feFlood', {
        'flood-color': '#000000',
        'flood-opacity': '0.3'
    });
    const feComposite1 = createSVGElement('feComposite', {
        in2: 'offsetblur',
        operator: 'in'
    });
    const feMerge = createSVGElement('feMerge', {});
    const feMergeNode1 = createSVGElement('feMergeNode', {});
    const feMergeNode2 = createSVGElement('feMergeNode', { in: 'SourceGraphic' });

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    dropShadow.appendChild(feGaussianBlur);
    dropShadow.appendChild(feOffset);
    dropShadow.appendChild(feFlood);
    dropShadow.appendChild(feComposite1);
    dropShadow.appendChild(feMerge);
    defs.appendChild(dropShadow);

    // Inner shadow for subtle depth on skin
    const innerShadow = createSVGElement('filter', { id: 'innerShadow' });
    const feGaussianBlur2 = createSVGElement('feGaussianBlur', {
        in: 'SourceAlpha',
        stdDeviation: '2'
    });
    const feOffset2 = createSVGElement('feOffset', {
        dx: '0',
        dy: '2'
    });
    const feComposite2 = createSVGElement('feComposite', {
        in2: 'SourceAlpha',
        operator: 'arithmetic',
        k2: '-1',
        k3: '1'
    });
    const feColorMatrix = createSVGElement('feColorMatrix', {
        type: 'matrix',
        values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'
    });
    innerShadow.appendChild(feGaussianBlur2);
    innerShadow.appendChild(feOffset2);
    innerShadow.appendChild(feComposite2);
    innerShadow.appendChild(feColorMatrix);
    defs.appendChild(innerShadow);

    // Soft glow effect for highlights
    const softGlow = createSVGElement('filter', { id: 'softGlow' });
    const feGaussianBlur3 = createSVGElement('feGaussianBlur', {
        stdDeviation: '2',
        result: 'coloredBlur'
    });
    const feMerge2 = createSVGElement('feMerge', {});
    const feMergeNode3 = createSVGElement('feMergeNode', { in: 'coloredBlur' });
    const feMergeNode4 = createSVGElement('feMergeNode', { in: 'SourceGraphic' });
    feMerge2.appendChild(feMergeNode3);
    feMerge2.appendChild(feMergeNode4);
    softGlow.appendChild(feGaussianBlur3);
    softGlow.appendChild(feMerge2);
    defs.appendChild(softGlow);

    // MONSTER HIGH STYLE: Sparkle pattern for hair and clothes
    const sparklePattern = createSVGElement('pattern', {
        id: 'sparklePattern',
        width: '50',
        height: '50',
        patternUnits: 'userSpaceOnUse'
    });

    // Create small sparkle stars at random positions
    const sparklePositions = [
        {x: 5, y: 8, size: 2},
        {x: 25, y: 15, size: 3},
        {x: 40, y: 5, size: 1.5},
        {x: 15, y: 35, size: 2.5},
        {x: 35, y: 40, size: 2}
    ];

    sparklePositions.forEach(pos => {
        const sparkle = createSVGElement('circle', {
            cx: pos.x,
            cy: pos.y,
            r: pos.size,
            fill: 'white',
            opacity: '0.7'
        });
        sparklePattern.appendChild(sparkle);

        // Add star shape for variety
        const star = createSVGElement('polygon', {
            points: `${pos.x+10},${pos.y-1} ${pos.x+11},${pos.y+2} ${pos.x+14},${pos.y+2} ${pos.x+12},${pos.y+4} ${pos.x+13},${pos.y+7} ${pos.x+10},${pos.y+5} ${pos.x+7},${pos.y+7} ${pos.x+8},${pos.y+4} ${pos.x+6},${pos.y+2} ${pos.x+9},${pos.y+2}`,
            fill: 'white',
            opacity: '0.6'
        });
        sparklePattern.appendChild(star);
    });

    defs.appendChild(sparklePattern);

    // MONSTER HIGH STYLE: Glossy shine gradient for lips and nails
    const glossGradient = createSVGElement('linearGradient', {
        id: 'glossGradient',
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%'
    });

    const glossStop1 = createSVGElement('stop', {
        offset: '0%',
        'stop-color': 'white',
        'stop-opacity': '0.9'
    });
    const glossStop2 = createSVGElement('stop', {
        offset: '50%',
        'stop-color': 'white',
        'stop-opacity': '0.3'
    });
    const glossStop3 = createSVGElement('stop', {
        offset: '100%',
        'stop-color': 'white',
        'stop-opacity': '0'
    });

    glossGradient.appendChild(glossStop1);
    glossGradient.appendChild(glossStop2);
    glossGradient.appendChild(glossStop3);
    defs.appendChild(glossGradient);
}

/**
 * Helper function to create a skin gradient for realistic shading
 * This creates a radial gradient that adds depth to skin tones
 */
function createSkinGradient(defs, id, baseColor) {
    const gradient = createSVGElement('radialGradient', {
        id: id,
        cx: '40%',  // Light source from upper left
        cy: '30%',
        r: '80%'
    });

    // Lighter highlight in the center (where light hits)
    const stop1 = createSVGElement('stop', {
        offset: '0%',
        'stop-color': lightenColor(baseColor, 15),
        'stop-opacity': '1'
    });

    // Base color in the middle
    const stop2 = createSVGElement('stop', {
        offset: '60%',
        'stop-color': baseColor,
        'stop-opacity': '1'
    });

    // Darker shade at the edges (shadow areas)
    const stop3 = createSVGElement('stop', {
        offset: '100%',
        'stop-color': darkenColor(baseColor, 12),
        'stop-opacity': '1'
    });

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
}

/**
 * Helper function to lighten a hex color by a percentage
 */
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Helper function to darken a hex color by a percentage
 */
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * MONSTER HIGH STYLE: Helper function to boost color saturation
 * Makes colors more vibrant and vivid for that dress-up game look
 */
function boostSaturation(color, percent) {
    // Convert hex to RGB
    const num = parseInt(color.replace("#",""), 16);
    let r = (num >> 16) / 255;
    let g = (num >> 8 & 0x00FF) / 255;
    let b = (num & 0x0000FF) / 255;

    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    // Boost saturation
    s = Math.min(1, s * (1 + percent / 100));

    // Convert back to RGB
    let r2, g2, b2;
    if (s === 0) {
        r2 = g2 = b2 = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r2 = hue2rgb(p, q, h + 1/3);
        g2 = hue2rgb(p, q, h);
        b2 = hue2rgb(p, q, h - 1/3);
    }

    // Convert back to hex
    const R = Math.round(r2 * 255);
    const G = Math.round(g2 * 255);
    const B = Math.round(b2 * 255);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Renders the body (torso) of the character.
 * ENHANCED: Now with gradient shading for depth and realistic lighting
 * MONSTER HIGH STYLE: Bold black outline for that cartoon/anime look
 *
 * Position: Center-bottom of canvas (x=200, y=480)
 * Size: rx=80 (width), ry=100 (height)
 */
function renderBody(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for body with lighting
    createSkinGradient(defs, 'bodyGradient', state.appearance.skinTone);

    const body = createSVGElement('ellipse', {
        cx: '200',      // Horizontal center of 400px canvas
        cy: '480',      // Lower in canvas (body below head)
        rx: '80',       // Width radius - makes body wider
        ry: '100',      // Height radius - makes body taller vertically
        fill: 'url(#bodyGradient)',  // ENHANCED: Use gradient instead of flat color
        stroke: '#000000',           // MONSTER HIGH: Bold black outline
        'stroke-width': '4',         // MONSTER HIGH: 4px thick outline
        filter: 'url(#dropShadow)',  // ENHANCED: Add drop shadow for depth
        id: 'body'
    });
    svg.appendChild(body);
}

/**
 * Renders the neck connecting head to body.
 * ENHANCED: Now with gradient shading for depth
 * MONSTER HIGH STYLE: Bold black outline
 *
 * Position: x=180, y=360 (between head at ~280 and body at ~480)
 */
function renderNeck(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for neck
    createSkinGradient(defs, 'neckGradient', state.appearance.skinTone);

    const neck = createSVGElement('rect', {
        x: '180',       // Slightly left of center (200-20)
        y: '360',       // Between head and body vertically
        width: '40',    // Narrow width for realistic neck
        height: '50',   // Connects head (ends ~390) to body (starts ~380)
        fill: 'url(#neckGradient)',  // ENHANCED: Use gradient
        stroke: '#000000',            // MONSTER HIGH: Bold black outline
        'stroke-width': '3',          // MONSTER HIGH: 3px outline
        id: 'neck'
    });
    svg.appendChild(neck);
}

/**
 * Renders the head (face base) of the character.
 * ENHANCED: Now with gradient shading and subtle texture for realistic skin
 * MONSTER HIGH STYLE: Bold black outline and rounder proportions
 *
 * Position: Center-top of canvas (x=200, y=280)
 * Size: rx=90, ry=110 (taller than wide for natural head shape)
 */
function renderHead(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for head with top-down lighting
    createSkinGradient(defs, 'headGradient', state.appearance.skinTone);

    const head = createSVGElement('ellipse', {
        cx: '200',      // Horizontal center
        cy: '280',      // Upper portion of canvas
        rx: '95',       // MONSTER HIGH: Slightly wider for cuter proportions
        ry: '115',      // MONSTER HIGH: Slightly taller for rounder face
        fill: 'url(#headGradient)',  // ENHANCED: Use gradient for depth
        stroke: '#000000',            // MONSTER HIGH: Bold black outline
        'stroke-width': '4',          // MONSTER HIGH: 4px thick outline
        filter: 'url(#dropShadow)',  // ENHANCED: Add shadow for depth
        id: 'head'
    });
    svg.appendChild(head);

    // ENHANCED: Add subtle rim lighting on the left side of face
    const rimLight = createSVGElement('ellipse', {
        cx: '140',      // Left side of face
        cy: '280',
        rx: '15',       // Thin vertical strip
        ry: '80',
        fill: 'white',
        opacity: '0.15' // Very subtle highlight
    });
    svg.appendChild(rimLight);
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
    // ENHANCED: Added shadows, gradients, and better depth
    // MONSTER HIGH STYLE: 40% BIGGER eyes with bold outlines and glossy shine

    // Left eye shadow - creates depth under the eye
    const leftEyeShadow = createSVGElement('ellipse', {
        cx: '170',
        cy: '272',
        rx: '22',       // MONSTER HIGH: 40% bigger (16 * 1.4 = 22.4)
        ry: '27',       // MONSTER HIGH: 40% bigger (19 * 1.4 = 26.6)
        fill: 'black',
        opacity: '0.12' // MONSTER HIGH: Slightly darker shadow
    });
    svg.appendChild(leftEyeShadow);

    // Right eye shadow
    const rightEyeShadow = createSVGElement('ellipse', {
        cx: '230',
        cy: '272',
        rx: '22',       // MONSTER HIGH: 40% bigger
        ry: '27',       // MONSTER HIGH: 40% bigger
        fill: 'black',
        opacity: '0.12'
    });
    svg.appendChild(rightEyeShadow);

    // Left eye white
    const leftEyeWhite = createSVGElement('ellipse', {
        cx: '170',      // Left side of face
        cy: '270',      // Eye level
        rx: '21',       // MONSTER HIGH: 40% bigger (15 * 1.4 = 21)
        ry: '25',       // MONSTER HIGH: 40% bigger (18 * 1.4 = 25.2)
        fill: 'white',
        stroke: '#000000',              // MONSTER HIGH: Bold black outline
        'stroke-width': '3'             // MONSTER HIGH: 3px outline
    });
    svg.appendChild(leftEyeWhite);

    // Right eye white
    const rightEyeWhite = createSVGElement('ellipse', {
        cx: '230',      // Right side of face (60px apart for spacing)
        cy: '270',      // Same level as left eye
        rx: '21',       // MONSTER HIGH: 40% bigger
        ry: '25',       // MONSTER HIGH: 40% bigger
        fill: 'white',
        stroke: '#000000',              // MONSTER HIGH: Bold black outline
        'stroke-width': '3'             // MONSTER HIGH: 3px outline
    });
    svg.appendChild(rightEyeWhite);

    // ENHANCED: Create iris gradients for depth
    const defs = svg.querySelector('defs');
    const irisGradient = createSVGElement('radialGradient', {
        id: 'irisGradient',
        cx: '40%',
        cy: '40%'
    });
    const irisStop1 = createSVGElement('stop', {
        offset: '0%',
        'stop-color': '#6B3A1E'
    });
    const irisStop2 = createSVGElement('stop', {
        offset: '70%',
        'stop-color': '#4A2511'
    });
    const irisStop3 = createSVGElement('stop', {
        offset: '100%',
        'stop-color': '#2C1508'
    });
    irisGradient.appendChild(irisStop1);
    irisGradient.appendChild(irisStop2);
    irisGradient.appendChild(irisStop3);
    defs.appendChild(irisGradient);

    // Left iris (colored part of eye - brown with gradient)
    const leftIris = createSVGElement('circle', {
        cx: '170',
        cy: '272',      // Slightly lower than white for positioning
        r: '14',        // MONSTER HIGH: Bigger iris (10 * 1.4 = 14)
        fill: 'url(#irisGradient)',  // ENHANCED: Use gradient for depth
        filter: 'url(#innerShadow)'  // ENHANCED: Add inner shadow
    });
    svg.appendChild(leftIris);

    // Right iris
    const rightIris = createSVGElement('circle', {
        cx: '230', cy: '272',
        r: '14',        // MONSTER HIGH: Bigger iris
        fill: 'url(#irisGradient)',  // ENHANCED: Use gradient
        filter: 'url(#innerShadow)'
    });
    svg.appendChild(rightIris);

    // Left pupil (black center with subtle gradient)
    const leftPupil = createSVGElement('circle', {
        cx: '170', cy: '272',
        r: '7',         // MONSTER HIGH: Bigger pupil (5 * 1.4 = 7)
        fill: 'black'
    });
    svg.appendChild(leftPupil);

    // Right pupil
    const rightPupil = createSVGElement('circle', {
        cx: '230', cy: '272',
        r: '7',         // MONSTER HIGH: Bigger pupil
        fill: 'black'
    });
    svg.appendChild(rightPupil);

    // MONSTER HIGH STYLE: HUGE glossy highlight - the signature anime eye shine!
    const leftHighlight = createSVGElement('ellipse', {
        cx: '174',      // Slightly offset from center
        cy: '266',      // Upper part of eye
        rx: '8',        // MONSTER HIGH: HUGE oval highlight
        ry: '12',       // MONSTER HIGH: Tall oval for that anime sparkle
        fill: 'white',
        opacity: '0.95',
        filter: 'url(#softGlow)'  // ENHANCED: Add soft glow
    });
    svg.appendChild(leftHighlight);

    const rightHighlight = createSVGElement('ellipse', {
        cx: '234', cy: '266',
        rx: '8',        // MONSTER HIGH: HUGE oval highlight
        ry: '12',       // MONSTER HIGH: Tall oval
        fill: 'white',
        opacity: '0.95',
        filter: 'url(#softGlow)'
    });
    svg.appendChild(rightHighlight);

    // MONSTER HIGH STYLE: Add secondary sparkle for extra cuteness
    const leftHighlight2 = createSVGElement('circle', {
        cx: '166',
        cy: '277',
        r: '3',         // MONSTER HIGH: Bigger secondary highlight
        fill: 'white',
        opacity: '0.8'
    });
    svg.appendChild(leftHighlight2);

    const rightHighlight2 = createSVGElement('circle', {
        cx: '226',
        cy: '277',
        r: '3',         // MONSTER HIGH: Bigger secondary highlight
        fill: 'white',
        opacity: '0.8'
    });
    svg.appendChild(rightHighlight2);

    // EYELASHES - Three lines per eye extending upward
    // MONSTER HIGH STYLE: Thicker, more dramatic lashes
    // Loop creates 3 lashes per eye, evenly spaced
    for(let i = 0; i < 3; i++) {
        // Left eye lashes
        const leftLash = createSVGElement('line', {
            x1: 155 + (i * 7),  // Start x (spaced wider for bigger eyes)
            y1: '255',          // Start y (adjusted for bigger eyes)
            x2: 153 + (i * 7),  // End x (slightly inward for curve)
            y2: '248',          // End y (longer lashes)
            stroke: 'black',
            'stroke-width': '4',        // MONSTER HIGH: Thicker lashes (was 2)
            'stroke-linecap': 'round'  // Rounded ends
        });
        svg.appendChild(leftLash);

        // Right eye lashes (mirror of left)
        const rightLash = createSVGElement('line', {
            x1: 238 + (i * 7),  // Starts further right
            y1: '255',
            x2: 236 + (i * 7),
            y2: '248',
            stroke: 'black',
            'stroke-width': '4',        // MONSTER HIGH: Thicker lashes
            'stroke-linecap': 'round'
        });
        svg.appendChild(rightLash);
    }

    // NOSE - ENHANCED: Better rendering with shadow and gradient
    // Create nose shadow for depth
    const noseShadow = createSVGElement('ellipse', {
        cx: '200',
        cy: '305',      // Below nose for shadow
        rx: '10',
        ry: '6',
        fill: 'black',
        opacity: '0.08' // Very subtle shadow
    });
    svg.appendChild(noseShadow);

    // Nose with gradient for realistic shading
    const nose = createSVGElement('ellipse', {
        cx: '200',      // Center of face
        cy: '300',      // Below eyes
        rx: '8',        // Small width
        ry: '12',       // Taller than wide
        fill: darkenColor(state.appearance.skinTone, 8),  // ENHANCED: Slightly darker than skin
        opacity: '0.6'  // Slightly see-through for subtle effect
    });
    svg.appendChild(nose);

    // ENHANCED: Add nose highlight for dimension
    const noseHighlight = createSVGElement('ellipse', {
        cx: '198',
        cy: '297',
        rx: '3',
        ry: '5',
        fill: 'white',
        opacity: '0.3'  // Subtle shine on nose bridge
    });
    svg.appendChild(noseHighlight);

    // MOUTH - ENHANCED: Better rendering with gradients and shadows
    // MONSTER HIGH STYLE: Fuller lips with glossy shine
    // Color and thickness change if lipstick is applied
    const mouthColor = (state.makeup.lipstick && state.makeup.lipstick !== 'none')
        ? boostSaturation(state.makeup.lipstick, 30)  // MONSTER HIGH: Boost saturation
        : '#8B4513';             // Default brown/neutral
    const mouthWidth = (state.makeup.lipstick && state.makeup.lipstick !== 'none')
        ? '8'   // MONSTER HIGH: Even thicker for fuller lips
        : '4';  // MONSTER HIGH: Thicker default

    // ENHANCED: Add mouth shadow underneath for depth
    const mouthShadow = createSVGElement('path', {
        d: 'M 180 332 Q 200 347 220 332',
        stroke: 'black',
        'stroke-width': mouthWidth,
        fill: 'none',
        'stroke-linecap': 'round',
        opacity: '0.15'  // Subtle shadow
    });
    svg.appendChild(mouthShadow);

    // Main mouth - Path creates a smile curve using quadratic bezier (Q)
    const mouth = createSVGElement('path', {
        d: 'M 180 330 Q 200 345 220 330',  // Start 180, curve down to 345, end 220
        stroke: mouthColor,
        'stroke-width': mouthWidth,
        fill: 'none',              // No fill, just outline
        'stroke-linecap': 'round',  // Rounded ends
        filter: state.makeup.lipstick !== 'none' ? 'url(#softGlow)' : 'none'  // ENHANCED: Glow for lipstick
    });
    svg.appendChild(mouth);

    // MONSTER HIGH STYLE: Always add glossy lip shine for that polished look!
    const lipShine = createSVGElement('ellipse', {
        cx: '200',
        cy: '337',      // Center of lower lip
        rx: '12',       // MONSTER HIGH: Bigger shine spot
        ry: '4',        // MONSTER HIGH: Taller shine
        fill: 'url(#glossGradient)',  // MONSTER HIGH: Use gloss gradient
        opacity: state.makeup.lipstick !== 'none' ? '0.7' : '0.4'  // More shine with lipstick
    });
    svg.appendChild(lipShine);

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
 * MONSTER HIGH STYLE: Glossy nails with shine and bold outlines
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
        // MONSTER HIGH: Boost nail color saturation
        const nailColor = boostSaturation(state.nails.color, 40);

        const nail = createSVGElement('ellipse', {
            cx: pos.x,
            cy: pos.y,
            rx: '5',        // MONSTER HIGH: Slightly bigger
            ry: '7',        // MONSTER HIGH: Slightly taller
            fill: nailColor,  // Use boosted color
            stroke: '#000000',          // MONSTER HIGH: Bold black outline
            'stroke-width': '2'         // MONSTER HIGH: 2px outline
        });
        svg.appendChild(nail);

        // MONSTER HIGH: Add glossy shine on each nail
        const nailShine = createSVGElement('ellipse', {
            cx: pos.x,
            cy: pos.y - 2,  // Top of nail
            rx: '2',
            ry: '3',
            fill: 'white',
            opacity: '0.7'  // Glossy effect
        });
        svg.appendChild(nailShine);
    });
}

/**
 * Helper function to get outfit data (colors and IDs).
 * Takes outfit IDs and returns the corresponding outfit objects.
 * MONSTER HIGH STYLE: Boosted color saturation for vibrant outfits
 *
 * This data structure maps outfit IDs to colors.
 * Each outfit has an id and color property.
 */
function getOutfitData(topId, bottomId) {
    // Outfit database - maps IDs to properties
    // MONSTER HIGH: All colors are more saturated and vibrant
    const allOutfits = {
        // T-shirts
        'tshirt-pink': { id: 'tshirt-pink', color: boostSaturation('#FF69B4', 30) },
        'tshirt-purple': { id: 'tshirt-purple', color: boostSaturation('#9B59B6', 30) },
        'tshirt-blue': { id: 'tshirt-blue', color: boostSaturation('#3498DB', 30) },
        'tshirt-yellow': { id: 'tshirt-yellow', color: boostSaturation('#F1C40F', 30) },
        // Dresses
        'dress-red': { id: 'dress-red', color: boostSaturation('#E74C3C', 30) },
        'dress-green': { id: 'dress-green', color: boostSaturation('#2ECC71', 30) },
        // Bottoms
        'jeans': { id: 'jeans', color: boostSaturation('#2C3E50', 20) },
        'skirt-pink': { id: 'skirt-pink', color: boostSaturation('#FF69B4', 30) },
        'skirt-purple': { id: 'skirt-purple', color: boostSaturation('#9B59B6', 30) },
        'shorts-blue': { id: 'shorts-blue', color: boostSaturation('#3498DB', 30) }
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
