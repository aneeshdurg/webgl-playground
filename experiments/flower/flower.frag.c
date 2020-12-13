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
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    float t = u_time / 1000.;
    int N = int(floor(abs(10. * sin(t))));//u_n;

    //float i = u_i;//2. * floor(4.*cos(t / 8.)) + 1.;
    float i = 2. * floor(float(N) * cos(t / 8.)) + 1.;
    //float cond = sign(sign(a - i*PI/float(2*N)) + 1.);
    //cond *= sign(sign((i+2.)*PI/float(2*N) - a) + 1.);
    //cond *= sign(sign(a - 1.5 * PI / float(N)) + 1.);
    float factor = 1.0;
    if (i == float(-2 * N - 1) || i == float(2 * N - 1)) {
        if (a >= float(2*N - 1)*PI/float(2*N) && float(2*N + 1)*PI/float(2*N) >= a)
            factor -= sin(t);
        else if (a >= float(-2*N-1)*PI/float(2*N) && float(-2*N+1)*PI/float(2*N) >= a)
            factor -= sin(t);
    } else if (a >= i*PI/float(2*N) && (i+2.)*PI/float(2*N) >= a)
        factor -= sin(t);

    factor=1.;
    float f = factor*abs(cos(a*float(N)));
    // f = abs(cos(a*3.));
    // f = abs(cos(a*2.5))*.5+.3;
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    color = vec3( 1.-smoothstep(f,f+0.02,r) );

    color_out = vec4(color, 1.0);
}
