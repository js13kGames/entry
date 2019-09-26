
export default () => {
    return {
        // rof: 5,
        // ror: 4,
        turnRate: 8,
        // radius: 8,
        mass: 4,
        thrust: 8,
        ammo: 5,
        maxSpeed: 8,
        lines: {
            body: [
                // Center 'pill'
                [ -5, -2,  1, -2 ],
                [  1, -2,  2, -1 ],
                [  2, -1,  2,  1 ],
                [  2,  1,  1,  2 ],
                [  1,  2, -5,  2 ],
                [ -5,  2, -6,  1 ],
                [ -6,  1, -6, -1 ],
                [ -6, -1, -5,  2 ]
            ],
            detail: [
                // Outer lines of left wing
                [ -9, -3, -5, -8 ],
                [ -5, -8,  1, -8 ],
                [  1, -8,  9, -3 ],
                [  9, -3, -9, -3 ],
                // Inside lines of left wing
                [ -5, -8, -3, -2 ],
                [  1, -8, -1, -2 ],
                // Outer lines of right wing
                [ -9,  3, -5,  8 ],
                [ -5,  8,  1,  8 ],
                [  1,  8,  9,  3 ],
                [  9,  3, -9,  3 ],
                // Inner lines of right wing
                [ -5,  8, -3,  2 ],
                [  1,  8, -1,  2 ]
            ],
            thrust: [
                [ -7, -1, -8,  0 ],
                [ -8,  0, -7,  1 ]
            ],
            hitbox: [
                [ -9, -3 ],
                [ -5, -8 ],
                [  1, -8 ],
                [  9, -3 ],
                [  9,  3 ],
                [  1,  8 ],
                [ -5,  8 ],
                [ -9,  3 ]
            ]
        }
    }
}
