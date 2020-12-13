#version 300 es

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
    vec2 st = 2. * gl_FragCoord.xy/u_resolution.xy - 1.;
    vec3 color = vec3(0.);

    float angle = atan(st.y, st.x);
    float angle_idk =  angle + PI / (2. * PI);
    // color = (vec3(angle) + PI) / (2. * PI);

    float time = u_time / 500.;
    float division = PI / (20. + 10. * sin(time / 10.));

    float line_1 = floor(angle / division) * division;
    float line_2 = ceil(angle / division) * division;

    float clock = sin(time + line_1 + line_2);
    float r = abs(0.05 * sin(time));
    if (sign(angle) == -1.)
        clock *= -1.;

    vec2 pt = vec2(cos(line_1), sin(line_1)) * clock;
    if (length(st - pt) < r)
        color = vec3(abs(angle_idk), 0., r * 20.);

    pt = vec2(cos(line_2), sin(line_2)) * clock;
    if (length(st - pt) < r)
        color = vec3(abs(angle_idk), r * 20., 0.);
    //}


    //vec2 pt = 0.4 * vec2(cos(time), sin(time)) + 0.5;

    color_out = vec4(color, 1.);
}
