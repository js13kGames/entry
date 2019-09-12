
export default () => {
    return {
        // rof: 4,
        // ror: 4,
        turnRate: 4,
        // radius: 8,
        mass: 9,
        thrust: 9,
        ammo: 8,
        maxSpeed: 4,
        lines: {
            body: [
                [ -4, -9, -1, -9 ],
                [ -1, -9,  5, -3 ],
                [  5, -3,  5,  3 ],
                [  5,  3, -1,  9 ],
                [ -1,  9, -4,  9 ],
                [ -4,  9, -4, -9 ]
            ],
            detail: [
                [ -1, -9, -4, -5 ],
                [ -4, -5,  5, -3 ],
                [  5, -3,  2,  0 ],
                [ -4, -5,  2,  0 ],
                [  2,  0, -4,  5 ],
                [  2,  0,  5,  3 ],
                [ -4,  5,  5,  3 ],
                [ -4,  5, -1,  9 ]
            ],
            thrust: [
                [ -4, -3, -6, -2 ],
                [ -6, -2, -4, -1 ],
                [ -4,  3, -6,  2 ],
                [ -6,  2, -4,  1 ]
            ]
        }
    }
}
