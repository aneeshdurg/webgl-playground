#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_rand;

out vec4 color_out;

const float blocksize = 20.;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898 + u_rand,78.233 + u_rand)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main(){
    float t = u_time / 10000.;

    vec2 coords = floor(gl_FragCoord.xy / blocksize);
    float c = noise(coords);
    float rnd = abs(sin(c));

    float val = max(rnd, abs(sin(2. * t)));
    vec2 center = coords * blocksize + blocksize / 2.;
    if (length(gl_FragCoord.xy - center) < (val * blocksize))
        color_out = vec4(vec3(1.), 1.0);
    else
        color_out = vec4(vec3(0.), 1.0);
}
