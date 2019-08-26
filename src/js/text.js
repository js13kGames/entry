
export function renderText(props) {
    var ctx = props.context;
    var path;

    ctx.save();
    ctx.translate(props.x, props.y);
    ctx.strokeStyle = props.color || '#fff';
    ctx.lineWidth = 2;

    [...props.text.toString()].forEach((char, i) => {
        if (!i) {
            ctx.moveTo(props.x, props.y);
        } else {
            ctx.moveTo(props.x + i * 20, props.y);
        }
        switch(char) {
            case '0':
                ctx.stroke(new Path2D(`
                    M 3 1, 7 5, 3 9, 0 5Z
                `));
                break;
        }
    });

    ctx.restore();

}
