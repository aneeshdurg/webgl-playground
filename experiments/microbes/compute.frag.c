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
uniform int u_stage;

// microbe params
uniform bool u_should_spawn;
uniform vec2 u_spawn_pt;
uniform vec3 u_spawn_color;

out vec4 color_out;

void voronoi() {
    vec2 coords = gl_FragCoord.xy;
    vec2 c = coords / u_dimensions;
    c.y = 1. - c.y;
    c *= u_img_dimensions;

    // (x, y, distance, valid)
    vec4 color = texelFetch(u_texture, ivec2(coords), 0);
    vec4 target = texelFetch(u_texture_img, ivec2(c), 0);
    const vec3 lum = vec3(0.3, 0.59, 0.11);
    if (dot(lum, target.rgb) > 0.9)
        color = vec4(c.x, c.y, 0., 1.);
    else if (color.a == 1.) {
        vec4 src = texelFetch(u_texture_img, ivec2(color.rg), 0);
        if (dot(lum, src.rgb) <= 0.9) {
            // invalidate known best color
            color.a = 0.;
        }
    }

    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            if (i==0 && j ==0)
                continue;
            ivec2 offset = ivec2(i, j);
            vec4 pt = texelFetch(u_texture, ivec2(coords) + offset, 0);
            if (pt.a == 1.) {
                float distToSelf = length(c.xy - pt.xy);
                vec4 src = texelFetch(u_texture_img, ivec2(pt.rg), 0);
                if (dot(lum, src.rgb) > 0.9) {
                    if (color.a == 0. || distToSelf < color.b)
                        color = vec4(pt.xy, distToSelf, 1.);
                }
            }
        }
    }

    color_out = color;
}

void microbe_movement() {
    vec2 coords = gl_FragCoord.xy;
    vec4 color = texelFetch(u_texture, ivec2(coords), 0);

    vec4 food = texelFetch(u_texture_img, ivec2(coords), 0);
    if (color.a > 0.) {
        vec4 food = texelFetch(u_texture_img, ivec2(coords), 0);
        // if (food.a != 0. && food.b >= 1.)
             color = vec4(0.);
    }

    if (u_should_spawn && ivec2(coords) == ivec2(u_spawn_pt)) {
        color.rgb = u_spawn_color;
        color.a = 100.;
    }

    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            if (i==0 && j ==0)
                continue;
             // ivec2 offset = ivec2(i, j);
             ivec2 offset = ivec2(i, j);
             ivec2 c = ivec2(coords) + offset;
             vec4 pt = texelFetch(u_texture, c, 0);
             if (pt.a == 0.)
                 continue;

             vec4 food = texelFetch(u_texture_img, c, 0);
             if (food.a == 0.)
                  continue;

             vec2 foodpos = u_dimensions * (food.rg / u_img_dimensions);

             vec2 foodvec = foodpos - vec2(c);
             if (sign(foodvec) == vec2(offset))
                color += pt;
             //foodvec /= length(foodvec);
             // // foodvec is the velocity of the microbe @ c we want to check if
             // // our current point (coords) is on the way

             // vec2 selfvec = u_dimensions * foodpos - coords;
             // selfvec /= length(selfvec);
             // float angle = acos(dot(foodvec, selfvec));
             // if (angle == 0.)

             // TODO decrement ttl in a
        }
    }

    color_out = color;
}

void main() {
    switch(u_stage) {
    case 0:
        voronoi();
        break;
    case 1:
        microbe_movement();
        break;
    case 2:
        vec2 coords = gl_FragCoord.xy;

        // FOOD: (x, y, distance, valid)
        vec4 color = texelFetch(u_texture_img, ivec2(coords), 0);
        color_out.rgb = vec3(color.a > 0. ? 1. / (color.b * color.b) : 0.);

        color = texelFetch(u_texture, ivec2(coords), 0);
        color_out.rgb += color.rgb;

        color_out.a = 1.;
        break;
    default:
        // invalid state - assign color_out for the compiler to be happy.
        color_out = vec4(0.);
    }
}
