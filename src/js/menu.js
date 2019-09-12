import { renderText, drawText } from './text';

export class Menu {
    constructor(props) {
        this.context = props.context;
        this.color = props.color || '#fff';
        this.items = [];
        this.x = props.x;
        this.y = props.y;

        props.items.forEach((item, i) => {
            this.items.push({
                text: item.text,
                y: i * 24
            });
        });

        this.items[0].focus = true;
        this.focus = 0;
    }

    next() {
        if (++this.focus === this.items.length) {
            this.focus = 0;
        }

        this.items.forEach((item, i) => {
            item.focus = i === this.focus ? true : false;
        });
    }

    prev() {
        if (--this.focus < 0) {
            this.focus = this.items.length - 1;
        }

        this.items.forEach((item, i) => {
            item.focus = i === this.focus ? true : false;
        });
    }

    render(scale) {
        this.items.forEach(item => {
            this.context.save();
            this.context.scale(scale, scale);
            this.context.translate(this.x, this.y + item.y);
            this.context.lineWidth = 1.5;

            if (item.focus) {
                this.context.strokeStyle = this.color;
                drawText({text: '> ' + item.text, context: this.context});
            } else {
                this.context.strokeStyle = this.color + '9';  // Transparency
                drawText({text: '  ' + item.text, context: this.context});
            }

            this.context.restore();
        });
    }
}
