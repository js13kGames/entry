import { renderText, drawText } from './text';

export class Menu {
    constructor(props) {
        this.context = props.context;
        this.color = props.color;
        this.items = [];
        this.x = props.x;
        this.y = props.y;

        props.items.forEach((item, i) => {
            this.items.push(new MenuItem({
                ...item,
                parent: this,
                x: 0,
                y: i * 24
            }));
        });

        this.items[0].focus = true;
        this.focus = 0;
    }

    next() {
        if (this.debounce > 0) {
            return;
        }

        if (++this.focus === this.items.length) {
            this.focus = 0;
        }

        this.debounce = 10;
        this.items.forEach((item, i) => {
            item.focus = i === this.focus ? true : false;
        });
    }

    prev() {
        if (this.debounce > 0) {
            return;
        }

        if (--this.focus < 0) {
            this.focus = this.items.length - 1;
        }

        this.debounce = 10;
        this.items.forEach((item, i) => {
            item.focus = i === this.focus ? true : false;
        });
    }

    update() {
        this.debounce--;
    }

    render(scale) {
        this.items.forEach(item => item.render(scale));
    }
}

export class MenuItem {
    constructor(props) {
        this.color = props.color || '#fff';
        this.focus = false;
        this.text = props.text;
        this.x = props.x;
        this.y = props.y;
        this.parent = props.parent;
        this.context = props.parent.context;

        if (props.options) {
            this.options = props.options;
            this.selected = props.default;
            this.selectedIndex = props.options.indexOf(props.default);
        }
    }

    render(scale) {
        this.context.save();
        this.context.scale(scale, scale);
        this.context.translate(this.x + this.parent.x, this.y + this.parent.y);
        this.context.lineWidth = 1.5;

        if (!this.focus) {
            this.context.strokeStyle = this.color + '9'; // Add transparency
        } else {
            this.context.strokeStyle = this.color;
        }

        if (this.options) {
            if (this.focus) {
                drawText({
                    text: '< ' + this.text + ' >',
                    context: this.context}
                );
            } else {
                drawText({
                    text: '< ' + this.text + ' >',
                    context: this.context
                });
            }
        } else {
            if (this.focus) {
                drawText({text: '> ' + this.text, context: this.context});
            } else {
                drawText({text: '  ' + this.text, context: this.context});
            }
        }

        this.context.restore();
    }
}
