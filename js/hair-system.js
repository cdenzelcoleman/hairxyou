/**
 * Hair Texture System
 *
 * This module defines 6 hair textures (4C-3A) and 7 hairstyles with authentic representations.
 * Each texture has properties that affect how the hair is rendered visually.
 *
 * Hair Texture Properties:
 * - coilTightness: 0-1 scale indicating how tight the curl pattern is (higher = tighter coils)
 * - volume: Multiplier for how much space the hair takes up (Type 4 hair has more volume)
 * - description: Plain language description of the texture
 */

const hairTextures = {
    '4c': {
        name: 'Type 4C',
        coilTightness: 0.95,    // Tightest coil pattern - very tightly coiled
        volume: 1.5,            // Maximum volume - 4C hair has the most shrinkage and volume
        description: 'Tight, densely packed coils'
    },
    '4b': {
        name: 'Type 4B',
        coilTightness: 0.85,    // Very tight Z-pattern coils
        volume: 1.4,            // High volume with less definition than 4C
        description: 'Z-pattern coils'
    },
    '4a': {
        name: 'Type 4A',
        coilTightness: 0.75,    // Tight but more defined S-pattern
        volume: 1.3,            // High volume with more defined coil pattern
        description: 'Defined S-pattern coils'
    },
    '3c': {
        name: 'Type 3C',
        coilTightness: 0.65,    // Tight corkscrew curls - transition between coily and curly
        volume: 1.2,            // Moderate-high volume
        description: 'Tight corkscrew curls'
    },
    '3b': {
        name: 'Type 3B',
        coilTightness: 0.55,    // Medium curls with bounce
        volume: 1.15,           // Moderate volume with springy ringlets
        description: 'Springy ringlets'
    },
    '3a': {
        name: 'Type 3A',
        coilTightness: 0.45,    // Loosest curl pattern - large, loose curls
        volume: 1.1,            // Least volume, more elongated curls
        description: 'Loose curls'
    }
};

/**
 * Main hair rendering dispatcher
 * Routes to appropriate rendering function based on current hairstyle
 *
 * @param {SVGElement} hairGroup - The SVG group element to append hair elements to
 * @param {Object} state - Character state containing hair properties (texture, style, color)
 */
function renderHairByTexture(hairGroup, state) {
    // Get texture properties to modify rendering based on hair type
    const texture = hairTextures[state.hair.texture];
    const style = state.hair.style;

    // Route to appropriate styling function based on current hairstyle
    switch(style) {
        case 'afro':
            renderAfro(hairGroup, state, texture);
            break;
        case 'wash-and-go':
            renderWashAndGo(hairGroup, state, texture);
            break;
        case 'box-braids':
            renderBoxBraids(hairGroup, state);
            break;
        case 'cornrows':
            renderCornrows(hairGroup, state);
            break;
        case 'two-strand-twists':
            renderTwoStrandTwists(hairGroup, state);
            break;
        case 'flat-twists':
            renderFlatTwists(hairGroup, state);
            break;
        case 'locs':
            renderLocs(hairGroup, state);
            break;
        default:
            // Default to afro if style not recognized
            renderAfro(hairGroup, state, texture);
    }
}

/**
 * Renders an afro hairstyle with texture-specific properties
 * ENHANCED: Now with gradients, highlights, and depth for level 5 graphics
 * MONSTER HIGH STYLE: Bold outlines, glossy shine, and sparkle effects
 *
 * How it works:
 * 1. Creates a base ellipse for the overall afro shape with gradient
 * 2. Adds shadow layer for depth
 * 3. Adds texture detail circles around the perimeter to show coil definition
 * 4. Adds highlight strands for realistic shine
 * 5. Tighter textures (4C) = more texture circles, more volume
 * 6. Looser textures (3A) = fewer texture circles, less volume
 *
 * SVG positioning notes:
 * - Center point (200, 200) is at top of head
 * - rx/ry define width/height of ellipse
 * - Volume multiplier makes 4C hair significantly bigger than 3A
 *
 * @param {SVGElement} hairGroup - SVG group to append elements to
 * @param {Object} state - Character state with hair.color property
 * @param {Object} texture - Texture properties (coilTightness, volume)
 */
function renderAfro(hairGroup, state, texture) {
    const baseSize = 100;  // Base radius for afro

    // Calculate actual size based on texture - 4C hair will be 150px, 3A will be 110px
    const volume = baseSize * texture.volume;

    // Calculate number of texture detail circles - tighter textures get more detail
    // 4C (0.95 tightness) = ~14 circles, 3A (0.45 tightness) = ~7 circles
    const coilCount = Math.floor(15 * texture.coilTightness);

    // ENHANCED: Get defs for gradient creation
    const svg = hairGroup.ownerSVGElement;
    const defs = svg.querySelector('defs');

    // MONSTER HIGH: Boost hair color saturation
    const vibrantColor = boostSaturation(state.hair.color, 35);

    // ENHANCED: Create hair gradient with highlights and shadows
    const hairGradient = createSVGElement('radialGradient', {
        id: 'afroGradient',
        cx: '35%',  // Light from upper left
        cy: '25%',
        r: '75%'
    });

    const lightColor = lightenColor(vibrantColor, 30);  // MONSTER HIGH: Brighter highlight
    const baseColor = vibrantColor;
    const darkColor = darkenColor(vibrantColor, 15);    // Shadow color

    const gradStop1 = createSVGElement('stop', {
        offset: '0%',
        'stop-color': lightColor,
        'stop-opacity': '1'
    });
    const gradStop2 = createSVGElement('stop', {
        offset: '50%',
        'stop-color': baseColor,
        'stop-opacity': '1'
    });
    const gradStop3 = createSVGElement('stop', {
        offset: '100%',
        'stop-color': darkColor,
        'stop-opacity': '1'
    });

    hairGradient.appendChild(gradStop1);
    hairGradient.appendChild(gradStop2);
    hairGradient.appendChild(gradStop3);
    defs.appendChild(hairGradient);

    // ENHANCED: Add shadow underneath hair for depth
    const afroShadow = createSVGElement('ellipse', {
        cx: '200',
        cy: '205',              // Slightly below main afro
        rx: volume * 1.02,
        ry: volume * 0.92,
        fill: 'black',
        opacity: '0.2',
        filter: 'url(#dropShadow)'
    });
    hairGroup.appendChild(afroShadow);

    // Create the main afro base shape with gradient
    const afroBase = createSVGElement('ellipse', {
        cx: '200',              // Centered horizontally in 400px viewBox
        cy: '200',              // Positioned at top of head
        rx: volume,             // Width influenced by texture volume
        ry: volume * 0.9,       // Slightly shorter vertically for natural afro shape
        fill: 'url(#afroGradient)',  // ENHANCED: Use gradient instead of flat color
        stroke: '#000000',           // MONSTER HIGH: Bold black outline
        'stroke-width': '3',         // MONSTER HIGH: 3px outline
        filter: 'url(#dropShadow)'   // ENHANCED: Add drop shadow
    });
    hairGroup.appendChild(afroBase);

    // Add texture detail circles around the perimeter to show coil definition
    // These circles create visual texture and make different hair types distinguishable
    for (let i = 0; i < coilCount; i++) {
        // Distribute circles evenly around the perimeter (360 degrees)
        const angle = (i / coilCount) * Math.PI * 2;

        // Position circles 70% out from center (0.7 * volume)
        // This puts them on the outer edge where texture is most visible
        const distance = volume * 0.7;

        // Calculate x,y coordinates using polar-to-cartesian conversion
        const x = 200 + Math.cos(angle) * distance;
        const y = 200 + Math.sin(angle) * distance;

        // Create texture detail circle
        // Size based on coilTightness - tighter coils = smaller individual circles
        const coil = createSVGElement('circle', {
            cx: x,
            cy: y,
            r: 12 * texture.coilTightness,  // 4C = ~11px circles, 3A = ~5px circles
            fill: state.hair.color,
            opacity: '0.6'  // Semi-transparent so they blend with base
        });
        hairGroup.appendChild(coil);
    }

    // MONSTER HIGH STYLE: Add BIG glossy shine spots for that polished look
    const shineSpots = [
        {x: 180, y: 180, rx: 30, ry: 40},  // Top left shine
        {x: 220, y: 185, rx: 25, ry: 35},  // Top right shine
        {x: 200, y: 210, rx: 20, ry: 30}   // Center shine
    ];

    shineSpots.forEach(spot => {
        const shine = createSVGElement('ellipse', {
            cx: spot.x,
            cy: spot.y,
            rx: spot.rx,
            ry: spot.ry,
            fill: 'white',
            opacity: '0.35',  // MONSTER HIGH: Prominent glossy effect
            filter: 'url(#softGlow)'
        });
        hairGroup.appendChild(shine);
    });

    // ENHANCED: Add highlight strands for shine and dimension
    const highlightCount = Math.floor(8 * texture.volume);
    for (let i = 0; i < highlightCount; i++) {
        const angle = (i / highlightCount) * Math.PI * 2;
        const distance = volume * 0.5;  // Closer to center than texture circles
        const x = 200 + Math.cos(angle) * distance;
        const y = 200 + Math.sin(angle) * distance;

        const highlight = createSVGElement('ellipse', {
            cx: x,
            cy: y,
            rx: 8,
            ry: 18,
            fill: lightColor,
            opacity: '0.25',
            transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`  // Rotate to follow hair direction
        });
        hairGroup.appendChild(highlight);
    }

    // MONSTER HIGH STYLE: Add subtle sparkles to hair
    const sparkleCount = Math.floor(12 * texture.volume / 1.3);
    for (let i = 0; i < sparkleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = volume * (0.3 + Math.random() * 0.5);
        const x = 200 + Math.cos(angle) * distance;
        const y = 200 + Math.sin(angle) * distance;

        const sparkle = createSVGElement('circle', {
            cx: x,
            cy: y,
            r: 2 + Math.random() * 2,
            fill: 'white',
            opacity: 0.6 + Math.random() * 0.3
        });
        hairGroup.appendChild(sparkle);
    }
}

/**
 * Renders a wash-and-go style showing defined curl/coil patterns
 *
 * How it works:
 * 1. Draws individual curl strands using SVG paths
 * 2. Each curl is a wavy line from scalp downward
 * 3. Curl width varies by texture - looser textures = thicker curls
 * 4. Top volume ellipse represents the crown area
 *
 * SVG path syntax:
 * - M x y: Move to starting point
 * - Q x1 y1 x2 y2: Quadratic curve (control point, end point)
 * - Creates S-curve pattern that looks like hanging curls
 *
 * @param {SVGElement} hairGroup - SVG group to append to
 * @param {Object} state - Character state
 * @param {Object} texture - Texture properties affecting curl width and volume
 */
function renderWashAndGo(hairGroup, state, texture) {
    const curlCount = 8;        // Number of curl strands to render
    const curlWidth = 20;       // Base width for curl strands

    // Draw individual curl strands across the head
    for (let i = 0; i < curlCount; i++) {
        // Space curls evenly from x=130 to x=290 (roughly ear-to-ear)
        const x = 130 + (i * 20);

        // Create S-shaped path representing a curl hanging down
        // Q creates quadratic curves for natural-looking curl waves
        // Path goes: start at scalp (180) -> curve right (220) -> curve back left (260) -> curve right (300) -> end (340)
        const curlPath = createSVGElement('path', {
            d: `M ${x} 180 Q ${x + 10} 220 ${x} 260 Q ${x - 10} 300 ${x} 340`,
            stroke: state.hair.color,
            // Stroke width varies by texture - looser curls (3A) appear thicker
            // 4C: 20 * (1 - 0.285) = ~14px, 3A: 20 * (1 - 0.135) = ~17px
            'stroke-width': curlWidth * (1 - texture.coilTightness * 0.3),
            fill: 'none',                   // No fill - just the stroke line
            'stroke-linecap': 'round'       // Rounded ends for natural look
        });
        hairGroup.appendChild(curlPath);
    }

    // Add top volume area to show hair at the crown
    // This fills the gap at the top where curls originate
    const topVolume = createSVGElement('ellipse', {
        cx: '200',                          // Centered horizontally
        cy: '190',                          // Slightly above curl start points
        rx: 95,                             // Wide enough to cover curl origins
        ry: 70 * texture.volume,            // Height scales with texture volume
        fill: state.hair.color
    });
    hairGroup.appendChild(topVolume);
}

/**
 * Renders box braids - a protective style with individual braids
 * ENHANCED: Now with gradients, highlights, and depth
 * MONSTER HIGH STYLE: Bold outlines and glossy shine on braids
 *
 * How it works:
 * 1. Creates 12 vertical braids across the head
 * 2. Each braid has 6 segments stacked vertically
 * 3. Segments alternate slight left/right offset to show braid texture
 * 4. Adds highlights and shadows for realistic depth
 * 5. Top ellipse covers the scalp where braids originate
 *
 * SVG positioning:
 * - Braids spaced 20px apart horizontally
 * - Each segment is 28px tall with 30px vertical spacing
 * - Offset creates the woven texture appearance
 *
 * @param {SVGElement} hairGroup - SVG group to append to
 * @param {Object} state - Character state with hair.color
 */
function renderBoxBraids(hairGroup, state) {
    const braidCount = 12;      // Number of individual braids
    const braidWidth = 8;       // Width of each braid in pixels
    const startY = 200;         // Y position where braids start (below scalp)

    // ENHANCED: Get defs and create gradient
    const svg = hairGroup.ownerSVGElement;
    const defs = svg.querySelector('defs');

    // MONSTER HIGH: Boost hair color saturation
    const vibrantColor = boostSaturation(state.hair.color, 35);

    const braidGradient = createSVGElement('linearGradient', {
        id: 'braidGradient',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%'
    });

    const lightColor = lightenColor(vibrantColor, 25);  // MONSTER HIGH: Brighter highlights
    const darkColor = darkenColor(vibrantColor, 15);

    braidGradient.appendChild(createSVGElement('stop', {
        offset: '0%',
        'stop-color': darkColor
    }));
    braidGradient.appendChild(createSVGElement('stop', {
        offset: '50%',
        'stop-color': vibrantColor
    }));
    braidGradient.appendChild(createSVGElement('stop', {
        offset: '100%',
        'stop-color': lightColor
    }));
    defs.appendChild(braidGradient);

    // Create each individual braid
    for (let i = 0; i < braidCount; i++) {
        // Space braids evenly across head (x: 90 to 310)
        const x = 90 + (i * 20);
        const segments = 6;     // Number of segments per braid

        // Create segments for this braid (stacked vertically)
        for (let j = 0; j < segments; j++) {
            // Calculate vertical position for this segment
            const y = startY + (j * 30);

            // Alternate offset left/right to show woven texture
            // Even segments (j=0,2,4): offset 0, Odd segments (j=1,3,5): offset 3px right
            const offset = (j % 2) * 3;

            // ENHANCED: Add shadow behind each segment for depth
            const shadow = createSVGElement('rect', {
                x: x - braidWidth / 2 + offset + 1,
                y: y + 2,
                width: braidWidth,
                height: 28,
                fill: 'black',
                opacity: '0.15',
                rx: '3'
            });
            hairGroup.appendChild(shadow);

            // Create rectangular segment with gradient
            const segment = createSVGElement('rect', {
                x: x - braidWidth / 2 + offset,     // Center on x, add offset
                y: y,
                width: braidWidth,
                height: 28,                         // Slightly shorter than spacing for gap
                fill: 'url(#braidGradient)',        // ENHANCED: Use gradient
                rx: '3',                            // Rounded corners (3px radius)
                stroke: '#000000',                  // MONSTER HIGH: Bold black outline
                'stroke-width': '2'                 // MONSTER HIGH: 2px outline
            });
            hairGroup.appendChild(segment);

            // MONSTER HIGH: Add BIGGER glossy highlight on braid
            const highlight = createSVGElement('rect', {
                x: x - braidWidth / 2 + offset + braidWidth * 0.6,
                y: y + 3,
                width: braidWidth * 0.3,  // MONSTER HIGH: Wider shine
                height: 22,                // MONSTER HIGH: Taller shine
                fill: 'white',
                opacity: '0.6',            // MONSTER HIGH: More prominent
                rx: '1'
            });
            hairGroup.appendChild(highlight);
        }
    }

    // ENHANCED: Add shadow at roots for depth
    const rootShadow = createSVGElement('ellipse', {
        cx: '200',
        cy: '195',
        rx: '102',
        ry: '62',
        fill: 'black',
        opacity: '0.15'
    });
    hairGroup.appendChild(rootShadow);

    // Add scalp coverage with gradient
    const scalpGradient = createSVGElement('radialGradient', {
        id: 'scalpGradient',
        cx: '40%',
        cy: '30%'
    });
    scalpGradient.appendChild(createSVGElement('stop', {
        offset: '0%',
        'stop-color': lightenColor(state.hair.color, 15)
    }));
    scalpGradient.appendChild(createSVGElement('stop', {
        offset: '100%',
        'stop-color': state.hair.color
    }));
    defs.appendChild(scalpGradient);

    const top = createSVGElement('ellipse', {
        cx: '200',      // Centered on head
        cy: '190',      // Just above braid start (y=200)
        rx: '100',      // Wide enough to cover all braid origins
        ry: '60',       // Moderate height for natural scalp coverage
        fill: 'url(#scalpGradient)',  // ENHANCED: Use gradient
        stroke: '#000000',             // MONSTER HIGH: Bold black outline
        'stroke-width': '3',           // MONSTER HIGH: 3px outline
        filter: 'url(#dropShadow)'    // ENHANCED: Add shadow
    });
    hairGroup.appendChild(top);

    // MONSTER HIGH: Add sparkles to braids for that magical touch
    for (let i = 0; i < 15; i++) {
        const x = 90 + Math.random() * 220;  // Random x across braids
        const y = 200 + Math.random() * 180; // Random y along braids
        const sparkle = createSVGElement('circle', {
            cx: x,
            cy: y,
            r: 1.5 + Math.random() * 1.5,
            fill: 'white',
            opacity: 0.6 + Math.random() * 0.3
        });
        hairGroup.appendChild(sparkle);
    }
}

/**
 * Renders cornrows - braids close to the scalp in straight-back pattern
 *
 * How it works:
 * 1. Creates 8 rows running vertically down the head
 * 2. Each row is a thick line (12px) with texture detail
 * 3. Texture marks added perpendicular to rows to show braid pattern
 * 4. Diagonal texture lines create the woven appearance
 *
 * SVG details:
 * - Main row: thick vertical line (stroke)
 * - Texture: short diagonal lines every 20px
 * - Lines go from upper left to lower right of row
 *
 * @param {SVGElement} hairGroup - SVG group to append to
 * @param {Object} state - Character state
 */
function renderCornrows(hairGroup, state) {
    const rowCount = 8;         // Number of cornrows
    const startY = 180;         // Where cornrows start at scalp

    // Create each cornrow
    for (let i = 0; i < rowCount; i++) {
        // Space rows evenly across head (x: 100 to 275)
        const x = 100 + (i * 25);

        // Create main cornrow line - thick vertical stroke
        const path = createSVGElement('path', {
            d: `M ${x} ${startY} L ${x} ${startY + 200}`,  // Straight line down
            stroke: state.hair.color,
            'stroke-width': '12',                           // Thick line for braid
            fill: 'none',
            'stroke-linecap': 'round'                       // Rounded ends
        });
        hairGroup.appendChild(path);

        // Add texture detail to show braid pattern
        const segments = 10;    // Number of texture marks per row
        for (let j = 0; j < segments; j++) {
            // Space texture marks evenly down the row
            const y = startY + (j * 20);

            // Create small diagonal line across the cornrow
            // Goes from 3px left to 3px right, angled downward
            const texture = createSVGElement('line', {
                x1: x - 3,                      // Left side of row
                y1: y,                          // Top of texture mark
                x2: x + 3,                      // Right side of row
                y2: y + 10,                     // Bottom (angled down)
                stroke: state.hair.color,
                'stroke-width': '2',            // Thin line
                opacity: '0.7'                  // Semi-transparent for subtle effect
            });
            hairGroup.appendChild(texture);
        }
    }
}

/**
 * Renders two-strand twists - a popular protective style
 *
 * How it works:
 * 1. Creates 16 individual twists hanging down
 * 2. Each twist is a wavy path with alternating curves
 * 3. Curves switch left/right to simulate twisted rope texture
 * 4. Top ellipse covers scalp area
 *
 * SVG path curves:
 * - Q creates quadratic curves (1 control point)
 * - Alternates curves left (-5) and right (+5)
 * - Creates S-wave pattern characteristic of twists
 *
 * @param {SVGElement} hairGroup - SVG group to append to
 * @param {Object} state - Character state
 */
function renderTwoStrandTwists(hairGroup, state) {
    const twistCount = 16;      // Number of individual twists
    const twistWidth = 6;       // Width of each twist strand

    // Create each individual twist
    for (let i = 0; i < twistCount; i++) {
        // Space twists across head (x: 80 to 305)
        const x = 80 + (i * 15);

        // Create wavy path for twist using quadratic curves
        // Pattern: start -> curve left -> back to center -> curve right -> center -> end
        // This creates the rope-like twisted appearance
        const twist = createSVGElement('path', {
            d: `M ${x} 190 Q ${x - 5} 250 ${x} 310 Q ${x + 5} 370 ${x} 430`,
            stroke: state.hair.color,
            'stroke-width': twistWidth,
            fill: 'none',
            'stroke-linecap': 'round'
        });
        hairGroup.appendChild(twist);
    }

    // Add top coverage for scalp where twists originate
    const top = createSVGElement('ellipse', {
        cx: '200',      // Centered
        cy: '190',      // At twist origins
        rx: '95',       // Cover all twist starting points
        ry: '55',       // Moderate height
        fill: state.hair.color
    });
    hairGroup.appendChild(top);
}

/**
 * Renders flat twists - twists close to the scalp
 *
 * How it works:
 * 1. Creates 6 thick curved paths
 * 2. Curves follow scalp contour
 * 3. Wider strokes (15px) show twists lying flat
 * 4. Cubic bezier curves (C) for smooth, natural curves
 *
 * SVG path C command:
 * - C x1 y1, x2 y2, x y
 * - Two control points for smooth S-curves
 * - Creates flowing, natural scalp-hugging shape
 *
 * @param {SVGElement} hairGroup - SVG group to append to
 * @param {Object} state - Character state
 */
function renderFlatTwists(hairGroup, state) {
    const twistCount = 6;       // Fewer, thicker twists

    // Create each flat twist
    for (let i = 0; i < twistCount; i++) {
        // Space across head (x: 120 to 270)
        const x = 120 + (i * 30);

        // Create curved path using cubic bezier for smooth curves
        // C command provides two control points for natural S-curve
        const twist = createSVGElement('path', {
            d: `M ${x} 180 C ${x - 10} 220, ${x + 10} 260, ${x} 300`,
            stroke: state.hair.color,
            'stroke-width': '15',               // Thick stroke for flat-lying twist
            fill: 'none',
            'stroke-linecap': 'round'
        });
        hairGroup.appendChild(twist);
    }

    // Add scalp base coverage
    const scalp = createSVGElement('ellipse', {
        cx: '200',      // Centered
        cy: '185',      // Just above twist starts
        rx: '95',       // Cover twist origins
        ry: '50',       // Flatter than other styles
        fill: state.hair.color
    });
    hairGroup.appendChild(scalp);
}

/**
 * Renders locs (dreadlocks) - mature locked hair
 *
 * How it works:
 * 1. Creates 20 individual locs hanging down
 * 2. Each loc is a thick wavy path
 * 3. Waviness varies by index to create natural variation
 * 4. Some locs curve left, some right, some straighter
 *
 * SVG positioning:
 * - Locs spaced 13px apart horizontally
 * - Long vertical paths (190 to 550)
 * - Waviness based on modulo 3 pattern: left, straight, right
 *
 * @param {SVGElement} hairGroup - SVG group to append to
 * @param {Object} state - Character state
 */
function renderLocs(hairGroup, state) {
    const locCount = 20;        // Number of individual locs
    const locWidth = 8;         // Width of each loc

    // Create each individual loc
    for (let i = 0; i < locCount; i++) {
        // Space locs across head (x: 70 to 317)
        const x = 70 + (i * 13);

        // Calculate waviness pattern - varies by index
        // i%3 = 0: waviness -1 (curves left)
        // i%3 = 1: waviness 0 (straighter)
        // i%3 = 2: waviness 1 (curves right)
        const waviness = (i % 3) - 1;

        // Create wavy path for loc using quadratic curves
        // Waviness * 8 creates the horizontal offset
        // Pattern alternates curve direction for natural loc movement
        const loc = createSVGElement('path', {
            d: `M ${x} 190 Q ${x + (waviness * 8)} 280 ${x} 370 Q ${x - (waviness * 8)} 460 ${x} 550`,
            stroke: state.hair.color,
            'stroke-width': locWidth,
            fill: 'none',
            'stroke-linecap': 'round'
        });
        hairGroup.appendChild(loc);
    }

    // Add top scalp coverage where locs originate
    const top = createSVGElement('ellipse', {
        cx: '200',      // Centered
        cy: '190',      // At loc origins
        rx: '100',      // Cover all loc starting points
        ry: '50',       // Moderate height
        fill: state.hair.color
    });
    hairGroup.appendChild(top);
}
