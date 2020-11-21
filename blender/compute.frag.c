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

uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform vec2 u_dimensions;
uniform vec2 u_img_dimensions_1;
uniform vec2 u_img_dimensions_2;
uniform float u_time;

out vec4 color_out;

void main() {
    vec2 c = gl_FragCoord.xy / u_dimensions;
    c.y = 1. - c.y;

    float time = u_time / 1000.;

    vec4 v1 = texelFetch(u_texture_1, ivec2(c * u_img_dimensions_1), 0);
    vec4 v2 = texelFetch(u_texture_2, ivec2(c * u_img_dimensions_2), 0);

    vec3 lum = vec3(0.3, 0.59, 0.11);
    float clk = sin(time * (2. - dot(lum, v1.rgb) - dot(lum, v2.rgb)));
    vec4 color = vec4(0.);
    color = v1 * abs(clk) + v2 * (1. - abs(clk));
    color_out = color;
}
