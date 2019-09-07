
const glyphs = [
    ...new Array(48),                             // misc (incl. space)
    new Path2D('M6 1 12 8 6 15 0 8Z'),            // 0
    new Path2D('M2 4 6 1 6 16'),                  // 1
    new Path2D('M0 4 6 0 10 4 1 15 11 15'),       // 2
    new Path2D('M2 1 10 4 6 8 10 12 2 15'),       // 3
    new Path2D('M6 1 1 12 10 12 M6 8 6 16'),      // 4
    new Path2D('M10 1 3 1 1 8 10 8 8 15 0 15'),   // 5
    new Path2D('M11 1 6 1 1 15 10 15 10 8 4 8'),  // 6
    new Path2D('M2 1 12 1 6 16'),                 // 7
    new Path2D('M2 5 6 1 10 5 2 12 6 16 10 12Z'), // 8
    new Path2D('M1 15 6 15 11 1 2 1 2 8 9 8'),    // 9
    new Path2D(''),                               // :
    new Path2D(''),                               // ;
    new Path2D('M10 4 2 8 10 12'),                // <
    new Path2D('M2 6 10 6 M2 10 10 10'),          // =
    new Path2D('M2 4 10 8 2 12'),                 // >
    new Path2D(''),                               // ?
    new Path2D(''),                               // @
    new Path2D('M1 15 5 2 10 15 M3 10 8 10'),     // A
    new Path2D('M3 15 3 1 10 4 4 8 10 11Z'),      // B
    new Path2D('M8 1 4 5 4 12 8 15'),             // C
    new Path2D('M3 15 3 1 10 4 10 12Z'),          // D
    new Path2D('M9 15 3 15 3 1 9 1 M3 8 7 8'),    // E
    new Path2D('M3 16 3 1 9 1 M3 8 7 8'),         // F
    new Path2D('M7 1 2 5 2 12 7 15 10 10 6 10'),  // G
    new Path2D('M2 16 2 1 M9 16 9 1 M2 9 9 9'),   // H
    new Path2D('M3 15 9 15 M3 1 9 1 M6 15 6 1'),  // I
    new Path2D('M2 11 5 15 9 11 9 1 4 1'),        // J
    new Path2D('M3 16 2 0 M9 2 3 8 11 15'),       // K
    new Path2D('M2 1 2 15 9 15'),                 // L
    new Path2D('M1 16 1 1 5 6 9 1 9 16'),         // M
    new Path2D('M1 16 1 2 9 14 9 0'),             // N
    new Path2D('M6 1 12 8 6 15 0 8Z'),            // 0
    new Path2D('M3 16 3 1 10 1 9 8 3 8'),         // P
    new Path2D('M6 1 12 8 6 15 0 8Z M11 15 6 9'), // Q
    new Path2D('M3 16 3 1 10 1 9 8 4 8 10 15'),   // R
    new Path2D('M10 1 3 1 1 8 10 8 8 15 0 15'),   // S
    new Path2D('M6 15 6 1 M2 1 10 1'),            // T
    new Path2D('M3 1 3 13 6 15 9 13 9 1'),        // U
    new Path2D('M3 1 6 14 9 1'),                  // V
    new Path2D('M0 1 2 14 5 4 8 14 10 1'),        // W
    new Path2D('M2 0 10 16 M10 0 2 16'),          // X
    new Path2D('M6 15 6 9 M2 1 6 9 10 1'),        // Y
    new Path2D('M1 1 9 1 2 15 10 15'),            // Z
];

export function drawText(props) {
    [...props.text.toString()].forEach((c, i) => {
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
    props.context.save();
    props.context.scale(props.scale, props.scale);
    props.context.translate(props.x, props.y);
    props.context.strokeStyle = props.color;
    props.context.lineWidth = 1;
    drawText(props);
    props.context.restore();
}
