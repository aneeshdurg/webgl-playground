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

vec4 do_3d_circle(
    vec3 ray,
    vec3 pt,
    float radius,
    vec4 color_and_min_z,
    vec3 new_color
) {

    const vec3 lightsource = vec3(0.0, 0.0, 3.);

    if (color_and_min_z.a != -1.0 && pt.z > color_and_min_z.a)
        return color_and_min_z;

    vec3 zpt = (ray / ray.z) * pt.z;
    if (length(zpt - pt) < radius) {
        float r = length(zpt - lightsource) * 2.5;
        float light = 1.0 / (r * r + 1.);
        return vec4(light * new_color, pt.z);
    }

    return color_and_min_z;
}

vec4 do_3d_circle_soft(
    vec3 ray,
    vec3 pt,
    float radius,
    vec4 color_and_min_z,
    vec3 new_color
) {

    const vec3 lightsource = vec3(0.0, 0.0, 3.);

    if (color_and_min_z.a != -1.0 && pt.z > color_and_min_z.a)
        return color_and_min_z;

    vec3 zpt = (ray / ray.z) * pt.z;
    //if (length(zpt - pt) < radius) {
        float r = length(zpt - pt) * 10.;
        float light = 1.0 / (r * r + 1.);
        float z = (r / 10.) <= radius ? pt.z : color_and_min_z.a;
        return vec4(light * new_color, z);
    //}

    return color_and_min_z;
}

void main(){

    vec2 st = 2. * (gl_FragCoord.xy/u_resolution.xy) - 1.;

    float time = u_time / 1000.;
    vec3 camera_pos = vec3(0., 0., -2.);

    vec4 color_and_min_z = vec4(vec3(0.), -1.0);

    vec3 ray = camera_pos - vec3(st, 0.);

    float radius = 0.1;// * abs(sin(time));
    color_and_min_z = do_3d_circle(
        ray,
        vec3(0., 0., 3.),
        radius / 4.,
        color_and_min_z,
        vec3(1., 1., 1.)
    );

    float time_1 = time * 2.5;
    color_and_min_z = do_3d_circle(
        ray,
        vec3(0.5 * cos(time_1), 0.5 * sin(time_1), 3.),
        radius,
        color_and_min_z,
        vec3(1., 0.25, 0.25)
    );

    float time_2 = time * 2.5;
    color_and_min_z = do_3d_circle(
        ray,
        vec3(0., 0.5 * sin(time_2 + PI / 2.), 3. + 0.5 * cos(time_2 + PI / 2.)),
        radius,
        color_and_min_z,
        vec3(0.25, 1., 0.25)
    );

    float time_3 = time * 2.;
    color_and_min_z = do_3d_circle(
        ray,
        vec3(0.5 * sin(time_3 + PI / 4.), 0., 3. + 0.5 * cos(time_3 + PI / 4.)),
        radius,
        color_and_min_z,
        vec3(0.25, 0.25, 1.)
    );

    color_out = vec4(color_and_min_z.xyz, 1.);
}
