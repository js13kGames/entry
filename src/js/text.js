
const glyphs = {
    zero:  new Path2D('M3 .5 6 4 3 7.5 0 4Z'),
    one:   new Path2D('M1 2 3 .5 3 8'),
    two:   new Path2D('M0 2 3 0 5 2 .5 7.5 5.5 7.5'),
    three: new Path2D('M1 .5 5 2 3 4 5 6 1 7.5'),
    four:  new Path2D('M3 .5 .5 6 5 6 M3 4 3 8'),
    five:  new Path2D('M5 .5 1.5 .5 .5 4 5 4 4 7.5 0 7.5'),
    six:   new Path2D('M5.5 .5 3 .5 .5 7.5 5 7.5 5 4 2 4'),
    seven: new Path2D('M1 .5 6 .5 3 8'),
    eight: new Path2D('M1 2.5 3 .5 5 2.5 1 6 3 8 5 6Z'),
    nine:  new Path2D('M.5 7.5 3 7.5 5.5 .5 1 .5 1 4 4.5 4')
};

export function renderText(props) {
    var path;

    props.context.save();
    props.context.translate(props.x, props.y);
    props.context.scale(2, 2);
    props.context.strokeStyle = props.color || '#fff';
    props.context.lineWidth = 1;

    [...props.text.toString()].forEach((char, i) => {
        var path;
        if (i) {
            props.context.translate(6.5, 0);
        }
        if (glyphs[char]) {
            path = glyphs[char];
        } else {
            switch(char) {
                case '0': path = glyphs.zero;  break;
                case '1': path = glyphs.one;   break;
                case '2': path = glyphs.two;   break;
                case '3': path = glyphs.three; break;
                case '4': path = glyphs.four;  break;
                case '5': path = glyphs.five;  break;
                case '6': path = glyphs.six;   break;
                case '7': path = glyphs.seven; break;
                case '8': path = glyphs.eight; break;
                case '9': path = glyphs.nine;  break;
            }
        }
        props.context.stroke(path);
    });

    props.context.restore();
}
