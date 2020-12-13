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
    if (angle < 0.)
        angle = PI + angle;
    // color = (vec3(angle) + PI) / (2. * PI);

    float time = u_time / 500.;
    float division = PI / 100.;

    float line_1 = floor(angle / division) * division;
    float line_2 = ceil(angle / division) * division;

    float clock = sin(time);
    float r = abs(0.05 * sin(time));

    float clock_1 = sin(time + floor(angle / division) / (PI / division));
    float r_1 = abs(0.05 * clock_1);
    vec2 pt = vec2(cos(line_1), sin(line_1)) * clock_1;
    if (length(st - pt) < r_1)
        color = vec3(abs(angle_idk), 0., r * 20.);

    float clock_2 = sin(time + ceil(angle / division) / (PI / division));
    float r_2 = abs(0.05 * clock_2);
    pt = vec2(cos(line_2), sin(line_2)) * clock_2;
    if (length(st - pt) < r_2)
        color = vec3(abs(angle_idk), 0., r * 20.);

    color_out = vec4(color, 1.);
}
