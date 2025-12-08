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
    renderNeck(svg, state);
    renderHead(svg, state);
    renderBody(svg, state);
    renderLegs(svg, state);  // Legs behind outfit
    renderOutfit(svg, state);  // Outfit covers body
    renderArms(svg, state);  // Arms on top so hands show
    renderFacialFeatures(svg, state);
    renderHair(svg, state);
    renderNails(svg, state);  // Nails on fingertips
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
 * CHIBI STYLE: Small, rounded body for cute proportions
 *
 * Position: Center of canvas (x=200, y=450)
 * Size: Smaller body to emphasize big head (chibi style)
 */
function renderBody(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for body with lighting
    createSkinGradient(defs, 'bodyGradient', state.appearance.skinTone);

    // CHIBI BODY: Small, round, cute torso
    const body = createSVGElement('ellipse', {
        cx: '200',      // Horizontal center
        cy: '450',      // Below head
        rx: '60',       // Smaller, rounder body
        ry: '70',       // Compact torso
        fill: 'url(#bodyGradient)',
        stroke: '#000000',
        'stroke-width': '4',
        filter: 'url(#dropShadow)',
        id: 'body'
    });
    svg.appendChild(body);
}

/**
 * Renders the character's arms with hands and fingers.
 * MONSTER HIGH STYLE: Bold outlines, gradients, and glossy effects
 *
 * Each arm consists of:
 * - Upper arm (shoulder to elbow)
 * - Lower arm (elbow to wrist)
 * - Hand (palm)
 * - 5 fingers per hand
 *
 * Arms are positioned at the sides of the body
 */
function renderArms(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for arms using skin tone
    createSkinGradient(defs, 'armGradient', state.appearance.skinTone);

    // CHIBI LEFT ARM - Short, stubby, cute arm
    const leftArmPath = createSVGElement('path', {
        d: 'M 135 450 Q 115 490 105 525 L 120 530 Q 125 495 145 455 Z',
        // Short stubby arm for chibi proportions
        fill: 'url(#armGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(leftArmPath);

    // CHIBI Left hand - round, chubby hand
    const leftHand = createSVGElement('ellipse', {
        cx: '112',      // Center of hand
        cy: '540',      // Below arm
        rx: '20',       // Chubby hand width
        ry: '24',       // Round hand height
        fill: 'url(#armGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(leftHand);

    // CHIBI RIGHT ARM - Short, stubby, cute arm
    const rightArmPath = createSVGElement('path', {
        d: 'M 265 450 Q 285 490 295 525 L 280 530 Q 275 495 255 455 Z',
        // Short stubby arm for chibi proportions
        fill: 'url(#armGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(rightArmPath);

    // CHIBI Right hand - round, chubby hand
    const rightHand = createSVGElement('ellipse', {
        cx: '288',      // Center of hand
        cy: '540',      // Below arm
        rx: '20',       // Chubby hand width
        ry: '24',       // Round hand height
        fill: 'url(#armGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(rightHand);
}

/**
 * Renders the character's legs with feet.
 * MONSTER HIGH STYLE: Bold outlines, gradients, and glossy effects
 *
 * Each leg consists of:
 * - Upper leg/thigh (hip to knee)
 * - Lower leg/calf (knee to ankle)
 * - Foot (with rounded toe area)
 *
 * Legs extend from the bottom of the body
 */
function renderLegs(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for legs using skin tone
    createSkinGradient(defs, 'legGradient', state.appearance.skinTone);

    // CHIBI LEFT LEG - Short, stubby, cute leg
    const leftLegPath = createSVGElement('path', {
        d: 'M 170 520 L 168 620 L 192 620 L 190 520 Z',
        // Short stubby leg for chibi proportions
        fill: 'url(#legGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(leftLegPath);

    // CHIBI Left foot - round, chubby foot
    const leftFoot = createSVGElement('ellipse', {
        cx: '180',      // Center of foot
        cy: '635',      // Below short leg
        rx: '28',       // Chubby foot length
        ry: '15',       // Round foot height
        fill: 'url(#legGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(leftFoot);

    // CHIBI RIGHT LEG - Short, stubby, cute leg
    const rightLegPath = createSVGElement('path', {
        d: 'M 210 520 L 208 620 L 232 620 L 230 520 Z',
        // Short stubby leg for chibi proportions
        fill: 'url(#legGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(rightLegPath);

    // CHIBI Right foot - round, chubby foot
    const rightFoot = createSVGElement('ellipse', {
        cx: '220',      // Center of foot
        cy: '635',      // Below short leg
        rx: '28',       // Chubby foot length
        ry: '15',       // Round foot height
        fill: 'url(#legGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        filter: 'url(#dropShadow)'
    });
    svg.appendChild(rightFoot);
}

/**
 * Renders the neck connecting head to body.
 * CHIBI STYLE: Short, cute neck
 *
 * Position: Between head and body
 */
function renderNeck(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for neck
    createSkinGradient(defs, 'neckGradient', state.appearance.skinTone);

    // CHIBI NECK: Short and cute
    const neck = createSVGElement('rect', {
        x: '175',       // Centered
        y: '410',       // Between head (ends ~450) and body (starts ~380)
        width: '50',    // Wider for chibi proportions
        height: '35',   // Short neck
        fill: 'url(#neckGradient)',
        stroke: '#000000',
        'stroke-width': '3',
        id: 'neck'
    });
    svg.appendChild(neck);
}

/**
 * Renders the head (face base) of the character.
 * CHIBI STYLE: Large head for cute proportions (head is ~40% of body height)
 *
 * Position: Center of canvas (x=200, y=330)
 * Size: Big round head for chibi look
 */
function renderHead(svg, state) {
    const defs = svg.querySelector('defs');

    // Create gradient for head with top-down lighting
    createSkinGradient(defs, 'headGradient', state.appearance.skinTone);

    // CHIBI HEAD: Large, round, prominent head
    const head = createSVGElement('ellipse', {
        cx: '200',      // Horizontal center
        cy: '330',      // Higher up, more prominent
        rx: '110',      // CHIBI: Much bigger head
        ry: '120',      // CHIBI: Round and large
        fill: 'url(#headGradient)',
        stroke: '#000000',
        'stroke-width': '4',
        filter: 'url(#dropShadow)',
        id: 'head'
    });
    svg.appendChild(head);

    // Add subtle rim lighting on the left side of face
    const rimLight = createSVGElement('ellipse', {
        cx: '130',      // Left side of face
        cy: '330',
        rx: '18',       // Thin vertical strip
        ry: '90',
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
            cx: '165', cy: '310',   // Above left eye (adjusted for new head position)
            rx: '25', ry: '12',     // Larger for chibi eyes
            fill: state.makeup.eyeshadow,
            opacity: '0.6'
        });
        svg.appendChild(leftEyeshadow);

        const rightEyeshadow = createSVGElement('ellipse', {
            cx: '235', cy: '310',   // Above right eye
            rx: '25', ry: '12',
            fill: state.makeup.eyeshadow,
            opacity: '0.6'
        });
        svg.appendChild(rightEyeshadow);
    }

    // EYES - Built in layers: white -> iris -> pupil -> highlight
    // ENHANCED: Added shadows, gradients, and better depth
    // MONSTER HIGH STYLE: 40% BIGGER eyes with bold outlines and glossy shine

    // CHIBI Left eye shadow - creates depth under the eye
    const leftEyeShadow = createSVGElement('ellipse', {
        cx: '165',
        cy: '327',      // Adjusted for new head position
        rx: '28',       // CHIBI: Even bigger eyes!
        ry: '32',
        fill: 'black',
        opacity: '0.12'
    });
    svg.appendChild(leftEyeShadow);

    // CHIBI Right eye shadow
    const rightEyeShadow = createSVGElement('ellipse', {
        cx: '235',
        cy: '327',      // Adjusted for new head position
        rx: '28',       // CHIBI: Even bigger eyes!
        ry: '32',
        fill: 'black',
        opacity: '0.12'
    });
    svg.appendChild(rightEyeShadow);

    // CHIBI Left eye white - HUGE eyes for cute look
    const leftEyeWhite = createSVGElement('ellipse', {
        cx: '165',      // Left side of face
        cy: '325',      // Lower on face for chibi look
        rx: '26',       // CHIBI: HUGE eyes!
        ry: '30',
        fill: 'white',
        stroke: '#000000',
        'stroke-width': '3'
    });
    svg.appendChild(leftEyeWhite);

    // CHIBI Right eye white - HUGE eyes
    const rightEyeWhite = createSVGElement('ellipse', {
        cx: '235',      // Right side of face (70px apart)
        cy: '325',      // Same level as left eye
        rx: '26',       // CHIBI: HUGE eyes!
        ry: '30',
        fill: 'white',
        stroke: '#000000',
        'stroke-width': '3'
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
        cx: '235', cy: '327',
        r: '14',        // MONSTER HIGH: Bigger iris
        fill: 'url(#irisGradient)',  // ENHANCED: Use gradient
        filter: 'url(#innerShadow)'
    });
    svg.appendChild(rightIris);

    // Left pupil (black center with subtle gradient)
    const leftPupil = createSVGElement('circle', {
        cx: '165', cy: '327',
        r: '7',         // MONSTER HIGH: Bigger pupil (5 * 1.4 = 7)
        fill: 'black'
    });
    svg.appendChild(leftPupil);

    // Right pupil
    const rightPupil = createSVGElement('circle', {
        cx: '235', cy: '327',
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
        cx: '239', cy: '319',
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
            x1: 145 + (i * 7),  // Start x (spaced wider for bigger eyes)
            y1: '305',          // Start y (adjusted for bigger eyes)
            x2: 153 + (i * 7),  // End x (slightly inward for curve)
            y2: '298',          // End y (longer lashes)
            stroke: 'black',
            'stroke-width': '4',        // MONSTER HIGH: Thicker lashes (was 2)
            'stroke-linecap': 'round'  // Rounded ends
        });
        svg.appendChild(leftLash);

        // Right eye lashes (mirror of left)
        const rightLash = createSVGElement('line', {
            x1: 228 + (i * 7),  // Starts further right
            y1: '305',
            x2: 236 + (i * 7),
            y2: '298',
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
        cy: '350',      // Below eyes
        rx: '8',        // Small width
        ry: '12',       // Taller than wide
        fill: darkenColor(state.appearance.skinTone, 8),  // ENHANCED: Slightly darker than skin
        opacity: '0.6'  // Slightly see-through for subtle effect
    });
    svg.appendChild(nose);

    // ENHANCED: Add nose highlight for dimension
    const noseHighlight = createSVGElement('ellipse', {
        cx: '198',
        cy: '347',
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
        d: 'M 175 382 Q 200 397 220 332',
        stroke: 'black',
        'stroke-width': mouthWidth,
        fill: 'none',
        'stroke-linecap': 'round',
        opacity: '0.15'  // Subtle shadow
    });
    svg.appendChild(mouthShadow);

    // Main mouth - Path creates a smile curve using quadratic bezier (Q)
    const mouth = createSVGElement('path', {
        d: 'M 175 380 Q 200 395 220 330',  // Start 180, curve down to 345, end 220
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
        cy: '387',      // Center of lower lip
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
 * Renders the character's outfit (top, bottom, sleeves, and shoes).
 * MONSTER HIGH STYLE: Full clothing with sleeves and shoes
 *
 * Outfits now include:
 * - Top/dress body covering torso
 * - Sleeves covering arms
 * - Pants/skirt covering legs
 * - Shoes covering feet
 */
function renderOutfit(svg, state) {
    // Get the color and type info for current outfit items
    const outfitData = getOutfitData(state.outfit.top, state.outfit.bottom, state.outfit.shoes);

    // RENDER TOP (t-shirt or dress body)
    if (outfitData.top) {
        const topColor = outfitData.top.color;

        // CHIBI shirt - covers rounded body
        const top = createSVGElement('ellipse', {
            cx: '200',      // Center on body
            cy: '450',      // Match chibi body position
            rx: '65',       // Match chibi body size
            ry: '75',       // Cover chibi body
            fill: topColor,
            stroke: '#000000',
            'stroke-width': '3',
            filter: 'url(#dropShadow)'
        });
        svg.appendChild(top);

        // CHIBI LEFT SLEEVE - short, cute sleeve
        const leftSleeve = createSVGElement('path', {
            d: 'M 135 450 Q 120 480 115 510 L 125 515 Q 128 485 143 455 Z',
            fill: topColor,
            stroke: '#000000',
            'stroke-width': '2'
        });
        svg.appendChild(leftSleeve);

        // CHIBI RIGHT SLEEVE - short, cute sleeve
        const rightSleeve = createSVGElement('path', {
            d: 'M 265 450 Q 280 480 285 510 L 275 515 Q 272 485 257 455 Z',
            fill: topColor,
            stroke: '#000000',
            'stroke-width': '2'
        });
        svg.appendChild(rightSleeve);

        // If wearing a dress, add the dress skirt part
        if (outfitData.top.id.includes('dress')) {
            // CHIBI Dress skirt - cute short skirt
            const dressSkirt = createSVGElement('path', {
                d: 'M 155 520 L 140 610 L 260 610 L 245 520 Z',
                // Start at waist, flare to wider bottom
                fill: topColor,
                stroke: '#000000',
                'stroke-width': '3'
            });
            svg.appendChild(dressSkirt);
        }
    }

    // RENDER BOTTOM (pants/skirt) only if not wearing a dress
    if (outfitData.bottom && !outfitData.top.id.includes('dress')) {
        const bottomColor = outfitData.bottom.color;

        // Check if it's pants or a skirt
        if (outfitData.bottom.id.includes('jeans') || outfitData.bottom.id.includes('shorts')) {
            // CHIBI PANTS - cover short legs
            // Left pant leg
            const leftPantLeg = createSVGElement('path', {
                d: 'M 170 520 L 168 620 L 192 620 L 190 520 Z',
                fill: bottomColor,
                stroke: '#000000',
                'stroke-width': '3'
            });
            svg.appendChild(leftPantLeg);

            // Right pant leg
            const rightPantLeg = createSVGElement('path', {
                d: 'M 210 520 L 208 620 L 232 620 L 230 520 Z',
                fill: bottomColor,
                stroke: '#000000',
                'stroke-width': '3'
            });
            svg.appendChild(rightPantLeg);
        } else {
            // CHIBI SKIRT - cute short skirt
            const skirt = createSVGElement('path', {
                d: 'M 165 520 L 155 605 L 245 605 L 235 520 Z',
                fill: bottomColor,
                stroke: '#000000',
                'stroke-width': '3',
                filter: 'url(#dropShadow)'
            });
            svg.appendChild(skirt);
        }
    }

    // RENDER SHOES - covering chibi feet
    if (outfitData.shoes) {
        const shoeColor = outfitData.shoes.color;

        // CHIBI Left shoe - covers chubby foot
        const leftShoe = createSVGElement('ellipse', {
            cx: '180',      // Left foot position
            cy: '635',      // Chibi foot level
            rx: '30',       // Chubby shoe length
            ry: '17',       // Shoe height
            fill: shoeColor,
            stroke: '#000000',
            'stroke-width': '3',
            filter: 'url(#dropShadow)'
        });
        svg.appendChild(leftShoe);

        // Left shoe detail (laces/stripe)
        const leftShoeDetail = createSVGElement('ellipse', {
            cx: '180',
            cy: '635',
            rx: '20',       // Inner detail
            ry: '10',
            fill: lightenColor(shoeColor, 20),
            stroke: '#000000',
            'stroke-width': '1'
        });
        svg.appendChild(leftShoeDetail);

        // CHIBI Right shoe - covers chubby foot
        const rightShoe = createSVGElement('ellipse', {
            cx: '220',      // Right foot position
            cy: '635',      // Chibi foot level
            rx: '30',       // Chubby shoe length
            ry: '17',       // Shoe height
            fill: shoeColor,
            stroke: '#000000',
            'stroke-width': '3',
            filter: 'url(#dropShadow)'
        });
        svg.appendChild(rightShoe);

        // Right shoe detail (laces/stripe)
        const rightShoeDetail = createSVGElement('ellipse', {
            cx: '220',
            cy: '635',
            rx: '20',       // Inner detail
            ry: '10',
            fill: lightenColor(shoeColor, 20),
            stroke: '#000000',
            'stroke-width': '1'
        });
        svg.appendChild(rightShoeDetail);
    }
}

/**
 * Renders the character's nails as colored highlights on hands.
 * MONSTER HIGH STYLE: Glossy nails with shine and bold outlines
 *
 * Shows nail polish as decorative elements on hands
 */
function renderNails(svg, state) {
    // MONSTER HIGH: Boost nail color saturation
    const nailColor = boostSaturation(state.nails.color, 40);

    // CHIBI Left hand nail accents - bottom of chubby hand
    const leftNails = createSVGElement('ellipse', {
        cx: '112',
        cy: '557',      // Bottom of chibi hand
        rx: '14',       // Wider nail area for chibi
        ry: '7',        // Taller nail area
        fill: nailColor,
        stroke: '#000000',
        'stroke-width': '2',
        opacity: '0.9'
    });
    svg.appendChild(leftNails);

    // Left nail shine
    const leftNailShine = createSVGElement('ellipse', {
        cx: '112',
        cy: '555',
        rx: '9',
        ry: '4',
        fill: 'white',
        opacity: '0.6'
    });
    svg.appendChild(leftNailShine);

    // CHIBI Right hand nail accents - bottom of chubby hand
    const rightNails = createSVGElement('ellipse', {
        cx: '288',
        cy: '557',      // Bottom of chibi hand
        rx: '14',       // Wider nail area for chibi
        ry: '7',        // Taller nail area
        fill: nailColor,
        stroke: '#000000',
        'stroke-width': '2',
        opacity: '0.9'
    });
    svg.appendChild(rightNails);

    // Right nail shine
    const rightNailShine = createSVGElement('ellipse', {
        cx: '288',
        cy: '555',
        rx: '9',
        ry: '4',
        fill: 'white',
        opacity: '0.6'
    });
    svg.appendChild(rightNailShine);
}

/**
 * Helper function to get outfit data (colors and IDs).
 * Takes outfit IDs and returns the corresponding outfit objects.
 * MONSTER HIGH STYLE: Boosted color saturation for vibrant outfits
 *
 * This data structure maps outfit IDs to colors.
 * Each outfit has an id and color property.
 */
function getOutfitData(topId, bottomId, shoesId) {
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
        'shorts-blue': { id: 'shorts-blue', color: boostSaturation('#3498DB', 30) },
        // Shoes
        'sneakers': { id: 'sneakers', color: boostSaturation('#FFFFFF', 0) },  // White sneakers
        'boots-black': { id: 'boots-black', color: '#000000' },  // Black boots
        'sandals-pink': { id: 'sandals-pink', color: boostSaturation('#FF69B4', 30) },  // Pink sandals
        'heels-red': { id: 'heels-red', color: boostSaturation('#E74C3C', 30) }  // Red heels
    };

    // Return object with top, bottom, and shoes data
    return {
        top: allOutfits[topId],
        bottom: allOutfits[bottomId],
        shoes: allOutfits[shoesId]
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
