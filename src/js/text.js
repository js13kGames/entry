
const glyphs = [
    ...new Array(48),                             // misc chars
    new Path2D('M6 1 12 8 6 15 0 8Z'),            // 0
    new Path2D('M2 4 6 1 6 16'),                  // 1
    new Path2D('M0 4 6 0 10 4 1 15 11 15'),       // ...
    new Path2D('M2 1 10 4 6 8 10 12 2 15'),
    new Path2D('M6 1 1 12 10 12 M6 8 6 16'),
    new Path2D('M10 1 3 1 1 8 10 8 8 15 0 15'),
    new Path2D('M11 1 6 1 1 15 10 15 10 8 4 8'),
    new Path2D('M2 1 12 1 6 16'),
    new Path2D('M2 5 6 1 10 5 2 12 6 16 10 12Z'),
    new Path2D('M1 15 6 15 11 1 2 1 2 8 9 8')     // 9
];

export function renderText(props) {
    props.context.save();
    props.context.scale(props.scale, props.scale);
    props.context.translate(props.x, props.y);
    props.context.strokeStyle = props.color;
    props.context.lineWidth = 1.5;

    [...props.text.toString()].forEach((c, i) => {
        if (i) {
            props.context.translate(6.5, 0);
        }
        props.context.stroke(glyphs[c.charCodeAt(0)]);
    });

    props.context.restore();
}
