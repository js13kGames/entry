
const glyphs = [
    // ...new Array(33) is nicer but doesn't zip as well (~7 B)
    '','','','','','','','','','','',
    '','','','','','','','','','','',
    '','','','','','','','','','','',
    '5 0 5 9 M5 12 5 14',            // !
    '',                              // "
    '',                              // #
    '',                              // $
    '1 5 1 2 4 2 4 5Z M2 15 9 0 M7 10 10 10 10 13 7 13Z',// %
    '',                              // &
    '',                              // '
    '',                              // (
    '',                              // )
    '',                              // *
    '',                              // +
    '6 12 4 15',                     // ,
    '3 6 8 6',                       // -
    '',                              // .
    '2 15 8 0',                      // /
    '6 0 11 7 6 14 1 7Z M6 6 6 8',   // 0
    '2 4 6 1 6 14',                  // 1
    '0 4 6 0 10 4 1 13 11 13',       // 2
    '2 0 10 3 6 7 10 11 2 13',       // 3
    '6 1 1 11 10 11 M6 7 6 15',      // 4
    '10 1 3 1 1 7 10 7 8 13 0 13',   // 5
    '11 1 6 1 1 13 10 13 10 7 4 7',  // 6
    '3 1 11 1 6 14',                 // 7
    '2 4 6 0 10 4 2 10 6 14 10 10Z', // 8
    '1 13 6 13 11 1 2 1 2 7 9 7',    // 9
    '',                              // :
    '',                              // ;
    '10 4 2 8 10 12',                // <
    '2 6 10 6 M2 10 10 10',          // =
    '2 4 10 8 2 12',                 // >
    '',                              // ?
    '',                              // @
    '1 14 5 2 10 14 M3 9 8 9',       // A
    '3 13 3 0 10 3 4 7 10 10Z',      // B
    '9 1 5 1 3 3 3 11 5 13 9 13',    // C
    '3 13 3 1 7 1 9 4 9 10 7 13Z',   // D
    '9 13 3 13 3 1 9 1 M3 7 7 7',    // E
    '3 14 3 1 9 1 M3 7 7 7',         // F
    '7 1 2 4 2 11 6 13 9 9 5 9',     // G
    '2 14 2 0 M9 14 9 0 M2 8 9 8',   // H
    '3 13 9 13 M3 1 9 1 M6 13 6 1',  // I
    '2 11 6 14 9 11 9 1 4 1',        // J
    '3 14 3 0 M9 2 4 8 9 14',        // K
    '4 0 4 13 9 13',                 // L
    '2 14 2 2 6 6 10 2 10 14',       // M
    '2 14 2 2 9 12 9 0',             // N
    '6 0 11 7 6 14 1 7Z',            // 0
    '3 14 3 1 10 1 9 7 3 7',         // P
    '5 1 10 7 5 13 0 7Z M9 13 5 8',  // Q
    '3 14 3 1 10 1 9 7 4 7 10 13',   // R
    '10 1 3 1 1 7 10 7 8 13 0 13',   // S
    '6 14 6 1 M2 1 10 1',            // T
    '3 0 3 12 6 14 9 12 9 0',        // U
    '3 1 3 7 6 13 9 7 9 1',          // V
    '1 0 3 12 6 5 9 12 11 0',        // W
    '2 0 10 14 M10 0 2 14',          // X
    '6 14 6 8 M2 1 6 8 10 1',        // Y
    '1 1 9 1 2 13 10 13',            // Z
    '8 0 4 0 4 14 8 14',             // [
    '8 15 2 0',                      // \
    '3 0 7 0 7 14 3 14',             // ]
].map(path => new Path2D('M' + path));

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

    if (props.alignCenter) {
        yAlign = -8.5 * size;
        xAlign = -props.text.toString().length * 6.5 * size;
    }

    if (props.alignBottom) {
        // Approx height of text
        yAlign = -17 * size;
    }

    if (props.alignRight) {
        // Approx width of text
        xAlign = -props.text.toString().length * 13 * size;
    }

    props.context.translate(props.x + xAlign, props.y + yAlign);

    props.context.scale(size, size);
    props.context.strokeStyle = props.color || '#fff';
    props.context.lineWidth = 1.5;
    drawText(props);
    props.context.restore();
}
