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
uniform sampler2D u_texture;
uniform float u_r;
uniform float u_theta;
uniform float u_size;
uniform bool u_reset;

out vec4 color_out;

void main() {
    vec3 color = vec3(0.);
    // vec2 c = gl_FragCoord.xy / u_dimensions;
    // c.y = 1. - c.y;
    // c -= 0.5;
    // c *= 2;
    vec2 c = gl_FragCoord.xy;
    c -= u_dimensions / 2.;

    vec2 target = u_r * vec2(sin(u_theta), cos(u_theta));
    if (length(target - c) < u_size)
        color = vec3(1.);

    color_out = max(
        texelFetch(u_texture, ivec2(gl_FragCoord.xy), 0), vec4(color, 1.));
}
