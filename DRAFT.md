### Notes

Gradient Color


Multiple Shapes
Bend Shape
Glow Color

    vec3 color = vec3(0.0);
    float alpha = 0.5; // 1.8
    float widthFactor = 2.0; // 5.0 higher is thinner
    float blur = 100.0; // 900.0
    sd *= widthFactor;
    col = alpha * color * exp(-blur * sd * sd);


### Misc

[2d sdf example](https://www.shadertoy.com/view/4dfXDn)
