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
uniform vec2 u_img_dimensions;
uniform sampler2D u_texture_img;
uniform sampler2D u_texture;
uniform bool u_render;

out vec4 color_out;

void main() {
    vec2 coords = gl_FragCoord.xy;
    vec2 c = coords / u_dimensions;
    c.y = 1. - c.y;
    c *= u_img_dimensions;

    if (u_render) {
        // (x, y, distance, valid)
        vec4 color = texelFetch(u_texture, ivec2(coords), 0);
        vec2 params = color.xy / u_dimensions;
        vec4 original = texelFetch(u_texture_img, ivec2(c), 0);
        if (color.a == 0.) {
            color_out = original;
            return;
        }

        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                if (i==0 && j ==0)
                    continue;
                ivec2 offset = ivec2(i, j);
                vec4 pt = texelFetch(u_texture, ivec2(coords) + offset, 0);
                if (pt.a == 0. || length(pt.xy - color.xy) > 5.) {
                    color_out = vec4(params.x, 0., params.y, 1.);
                    break;
                }
            }
        }

        color_out += texelFetch(u_texture_img, ivec2(c), 0) / 4.;
        color_out.a = 1.;
        return;
    }

    // (x, y, distance, valid)
    vec4 color = texelFetch(u_texture, ivec2(coords), 0);
    vec4 target = texelFetch(u_texture_img, ivec2(c), 0);
    const vec3 lum = vec3(0.3, 0.59, 0.11);
    if (dot(lum, target.rgb) > 0.9)
        color = vec4(c.x, c.y, 0., 1.);

    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            if (i==0 && j ==0)
                continue;
            ivec2 offset = ivec2(i, j);
            vec4 pt = texelFetch(u_texture, ivec2(coords) + offset, 0);
            if (pt.a == 1.) {
                float distToSelf = length(c.xy - pt.xy);
                if (color.a == 0. || distToSelf < color.b)
                color = vec4(pt.xy, distToSelf, 1.);
            }
        }
    }

    color_out = color;
}
