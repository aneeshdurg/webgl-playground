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

uniform sampler2D u_texture;
uniform vec2 u_dimensions;
uniform vec2 u_img_dimensions;
uniform float u_time;

out vec4 color_out;

void main() {
    vec2 c = gl_FragCoord.xy / u_dimensions;
    c.y = 1. - c.y;
    c *= u_img_dimensions;

    vec4 color = texelFetch(u_texture, ivec2(c), 0);

    float time = u_time / 100.;
    float t = 0.;//sin(time / 10.);
    float strength = 100. * t + 10.;
    vec3 adjust = abs(sin(time * color.rgb) / strength);
    color_out = vec4(color.rgb + adjust, 1.);
}
