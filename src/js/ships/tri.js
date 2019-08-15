
export default () => {
    return {
        rof: 8,
        model: [
            [ -3, -5 ],
            [ 12,  0 ],
            [ -3,  5 ]
        ],
        turnRate: 5,
        drawShape: function() {
            this.context.beginPath();
            this.context.moveTo(-3, -5);
            this.context.lineTo(12, 0);
            this.context.lineTo(-3, 5);
            this.context.lineTo(-1, 0);
            this.context.closePath();
            this.context.stroke();
        },
        shipShape: new Path2D('M-3 -5 L12 0 L-3 5 L-1 0 Z')
    }
}
