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
uniform vec2 u_block;
uniform float u_time;

out vec4 color_out;

void main() {
    float time = u_time / 10000.;

    vec2 c = gl_FragCoord.xy / u_dimensions;
    c.y = 1. - c.y;
    c *= u_img_dimensions;

    float strength = 1.;//00. * abs(sin(time));

    vec2 final = c;
    final.x += u_img_dimensions.x / strength * sin(time + floor(c.y / u_block.y));
    final.x = float(int(final.x) % int(u_img_dimensions.x));

    final.y += u_img_dimensions.y / strength * sin(time + floor(c.x / u_block.x));
    final.y = float(int(final.y) % int(u_img_dimensions.y));

    vec4 color = texelFetch(u_texture, ivec2(final), 0);
    color_out = color;
}
