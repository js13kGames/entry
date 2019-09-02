
const glyphs = [
    ...new Array(48),                                 // misc chars
    new Path2D('M3 .5 6 4 3 7.5 0 4Z'),               // 0
    new Path2D('M1 2 3 .5 3 8'),                      // 1
    new Path2D('M0 2 3 0 5 2 .5 7.5 5.5 7.5'),        // ...
    new Path2D('M1 .5 5 2 3 4 5 6 1 7.5'),
    new Path2D('M3 .5 .5 6 5 6 M3 4 3 8'),
    new Path2D('M5 .5 1.5 .5 .5 4 5 4 4 7.5 0 7.5'),
    new Path2D('M5.5 .5 3 .5 .5 7.5 5 7.5 5 4 2 4'),
    new Path2D('M1 .5 6 .5 3 8'),
    new Path2D('M1 2.5 3 .5 5 2.5 1 6 3 8 5 6Z'),
    new Path2D('M.5 7.5 3 7.5 5.5 .5 1 .5 1 4 4.5 4') // 9
];

export function renderText(props) {
    props.context.save();
    props.context.translate(props.x, props.y);
    props.context.scale(2, 2);
    props.context.strokeStyle = props.color || '#fff';
    props.context.lineWidth = 1;

    [...props.text.toString()].forEach((c, i) => {
        if (i) {
            props.context.translate(6.5, 0);
        }
        props.context.stroke(glyphs[c.charCodeAt(0)]);
    });

    props.context.restore();
}
