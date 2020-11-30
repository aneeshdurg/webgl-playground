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
    float time = u_time / 1000.;

    vec2 c = gl_FragCoord.xy / u_dimensions;
    c.y = 1. - c.y;
    c = 2. * c - 1.;

    float r = length(c);
    float theta = atan(c.y, c.x);

    theta += r * time * sin(time / 2.);
    c = r * vec2(cos(theta), sin(theta));
    c = (c + 1.)/2.;

    c *= u_img_dimensions;

    vec4 color = texelFetch(u_texture, ivec2(c), 0);
    color_out = color;
}
