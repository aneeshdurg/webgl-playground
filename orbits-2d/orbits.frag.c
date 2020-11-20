#version 300 es
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif


#define PI 3.14159265358979

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_i;
uniform int u_n;

out vec4 color_out;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);

    float time = u_time / 500.;
    vec2 pt = 0.4 * vec2(cos(time), sin(time)) + 0.5;
    if (length(st - pt) < 0.05)
        color += vec3(1., 0., 0.);

    for (int i = 0; i < 100; i++) {
        time -= 0.01;
        pt = 0.4 * vec2(cos(time), sin(time)) + 0.5;
        if (length(st - pt) < 0.05 * sin(time * 2.)) {
            color -= vec3(0.05, 0., 0.);
            color += vec3(0., 0., 0.1);
        }
    }

    for (int i = 0; i < 100; i++) {
        time -= 0.01;
        pt = 0.5 * sin(time) * vec2(cos(2. * time), sin(2. * time)) + 0.5;
        if (length(st - pt) < 0.05)
            color += vec3(0., abs(0.5 * sin(time / 2.)) + 0.5, 0.);
    }

    for (int i = 0; i < 100; i++) {
        time -= 0.01;
        pt = 0.5 * sin(time) * vec2(cos(2. * time), sin(2. * time)) + 0.5;
        if (length(st - pt) < 0.05)
            color += vec3(1., 0., 1.);
    }

    for (int i = 0; i < 100; i++) {
        time -= 0.01;
        pt = 0.5 * sin(time) * vec2(cos(2. * time), sin(2. * time)) + 0.5;
        if (length(st - pt) < 0.05)
            color += vec3(0.0, 0.2, 1.);
    }

    color_out = vec4(color, 1.);
}
