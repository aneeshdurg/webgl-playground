#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
precision highp int;
#else
precision mediump float;
precision mediump int;
#endif

#define PI 3.1415926538
#define GOLDEN_RATIO 1.6180339887

uniform vec2 u_dimensions;
uniform float u_radius;
uniform int u_grid_size;
uniform float u_time;

out vec4 color_out;

void main() {
    vec2 coords = gl_FragCoord.xy;
    ivec2 idx = ivec2(floor(coords / float(u_grid_size)));
    int seconds = int(floor(u_time))/1000;
    if (seconds % 2 == 0) {
        float dir = ((seconds % 4) == 0) ? 1. : -1.;
        float delta =  2. * float(u_grid_size) * u_time / 1000.;
        if (idx.y % 2 == 0)
            coords.x += dir * delta;
        // else
        //     coords.x -= delta / 2.;
    } else {
        float dir = ((seconds % 4) == 1) ? 1. : -1.;
        float delta =  2. * float(u_grid_size) * u_time / 1000.;
        if (idx.x % 2 == 0)
            coords.y += dir * delta;
        // else
        //     coords.y -= delta / 2.;
    }

    vec2 c = (coords - vec2(ivec2(coords) % u_grid_size)) +
        float(u_grid_size) / 2.;
    idx = ivec2(floor(coords / float(u_grid_size)));
    if (length(c - coords) < u_radius)
        color_out = vec4(
            vec3(
                idx.x % 2 == 0 ? 1. : 0.,
                0.,
                idx.y % 2 == 0 ? 1. : 0.),
            1.);
     else
        color_out = vec4(1.);
}
