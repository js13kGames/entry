
const glyphs = [
    ...new Array(33),                             // ctr chars
    new Path2D('M5 0 5 9 M5 12 5 14'),            // !
    ...new Array(14),                             // specials
    new Path2D('M6 0 11 7 6 14 1 7Z M6 6 6 8'),   // 0
    new Path2D('M2 4 6 1 6 14'),                  // 1
    new Path2D('M0 4 6 0 10 4 1 13 11 13'),       // 2
    new Path2D('M2 0 10 3 6 7 10 11 2 13'),       // 3
    new Path2D('M6 1 1 11 10 11 M6 7 6 15'),      // 4
    new Path2D('M10 1 3 1 1 7 10 7 8 13 0 13'),   // 5
    new Path2D('M11 1 6 1 1 13 10 13 10 7 4 7'),  // 6
    new Path2D('M3 1 11 1 6 14'),                 // 7
    new Path2D('M2 4 6 0 10 4 2 10 6 14 10 10Z'), // 8
    new Path2D('M1 13 6 13 11 1 2 1 2 7 9 7'),    // 9
    new Path2D(''),                               // :
    new Path2D(''),                               // ;
    new Path2D('M10 4 2 8 10 12'),                // <
    new Path2D('M2 6 10 6 M2 10 10 10'),          // =
    new Path2D('M2 4 10 8 2 12'),                 // >
    new Path2D(''),                               // ?
    new Path2D(''),                               // @
    new Path2D('M1 14 5 2 10 14 M3 9 8 9'),       // A
    new Path2D('M3 13 3 0 10 3 4 7 10 10Z'),      // B
    new Path2D('M9 1 5 1 3 3 3 11 5 13 9 13'),    // C
    new Path2D('M3 13 3 1 7 1 9 4 9 10 7 13Z'),   // D
    new Path2D('M9 13 3 13 3 1 9 1 M3 7 7 7'),    // E
    new Path2D('M3 14 3 1 9 1 M3 7 7 7'),         // F
    new Path2D('M7 1 2 4 2 11 6 13 9 9 5 9'),     // G
    new Path2D('M2 14 2 0 M9 14 9 0 M2 8 9 8'),   // H
    new Path2D('M3 13 9 13 M3 1 9 1 M6 13 6 1'),  // I
    new Path2D('M2 11 6 14 9 11 9 1 4 1'),        // J
    new Path2D('M3 14 3 0 M9 2 4 8 9 14'),        // K
    new Path2D('M4 0 4 13 9 13'),                 // L
    new Path2D('M2 14 2 2 6 6 10 2 10 14'),       // M
    new Path2D('M2 14 2 2 9 12 9 0'),             // N
    new Path2D('M6 0 11 7 6 14 1 7Z'),            // 0
    new Path2D('M3 14 3 1 10 1 9 7 3 7'),         // P
    new Path2D('M6 1 11 7 6 13 1 7Z M10 13 6 8'), // Q
    new Path2D('M3 14 3 1 10 1 9 7 4 7 10 13'),   // R
    new Path2D('M10 1 3 1 1 7 10 7 8 13 0 13'),   // S
    new Path2D('M6 14 6 1 M2 1 10 1'),            // T
    new Path2D('M3 0 3 12 6 14 9 12 9 0'),        // U
    new Path2D('M3 1 3 7 6 13 9 7 9 1'),          // V
    new Path2D('M1 0 3 12 6 5 9 12 11 0'),        // W
    new Path2D('M2 0 10 14 M10 0 2 14'),          // X
    new Path2D('M6 14 6 8 M2 1 6 8 10 1'),        // Y
    new Path2D('M1 1 9 1 2 13 10 13'),            // Z
];

export function drawText(props) {
    [...props.text.toString().toUpperCase()].forEach((c, i) => {
        var glyph = glyphs[c.charCodeAt(0)];

        // If not the 1st character, translate to be positioned after the 1st
        if (i) {
            props.context.translate(13, 0);
        }

        // If glyph found in font, print it
        if (glyph) {
            props.context.stroke(glyph);
        }
    });
}

export function renderText(props) {
    let size = props.size || 1;
    props.context.save();
    props.context.scale(props.scale, props.scale);

    var xAlign = yAlign = 0;

    if (props.alignBottom) {
        yAlign = -17 * size; // Approx height of text
    }

    if (props.alignRight) {
        xAlign = -props.text.length * 13 * size; // Approx width of text
    }

    props.context.translate(props.x + xAlign, props.y + yAlign);

    props.context.scale(size, size);
    props.context.strokeStyle = props.color;
    props.context.lineWidth = 1.5;
    drawText(props);
    props.context.restore();
}
