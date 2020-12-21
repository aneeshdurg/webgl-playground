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
uniform vec2 u_target_dimensions;
uniform vec2 u_select_pos;

uniform float u_hex_size;
uniform float u_src_angle;
uniform float u_dst_angle;

uniform bool u_display_edges;

out vec4 color_out;

vec4 get_color_from_triangle(float r, float theta) {
    // theta = [-pi/4, pi/4]
    // r = [0, 1]
    if (theta < 0.)
        theta = -theta;

    float src_x = r * cos(theta); // (between 0, 1)
    float src_y = r * sin(theta); // (between -1, 1)

    float target_x =
        u_select_pos.x + ((src_y + 1.) / 2.) * u_target_dimensions.x;
    float target_y = u_select_pos.y + src_x * u_target_dimensions.y;

    // float target_y = src_x * u_img_dimensions.x;
    // float target_x = ((src_y + src_x) / (2. * src_x)) * u_img_dimensions.y;
    // return texelFetch(u_texture, ivec2(u_img_dimensions.x / 2., target_y), 0);

    vec2 centered = vec2(target_x, target_y) - u_target_dimensions / 2.;

    float target_r = length(centered);
    float target_theta = atan(centered.y, centered.x);
    target_theta += PI * u_src_angle / 180.;

    vec2 final =
        target_r * vec2(cos(target_theta), sin(target_theta)) +
        u_target_dimensions / 2.;

    if (u_display_edges) {
        if (theta < 0.005 || theta > (PI / 6. - 0.005))
            return vec4(0., 0., 0., 1.);
    }

    return texelFetch(u_texture, ivec2(final), 0);
}

float isGEq(float a, float b) {
    return sign(sign(a - b) + 1.0);
}

vec2 get_hex_origin(vec2 coords, float hex_size) {
    float n = max(hex_size, 0.01);
    float halfn = n / 2.0;

    float sqrt3 = 1.732;

    float W = sqrt3 * n;
    float halfW = W/2.0;

    float H = 3.0 * halfn;

    float xidx = floor(coords.x / W);
    float yidx = floor(coords.y / H);

    // Get top left corner of bounding square
    vec2 o = vec2(W * xidx, H * yidx);

    // transform coordinates to make square begin at origin
    vec2 t = coords - o;

    // Hexagon targets in transformed space
    vec2 vertA = vec2(0.0, 0.0);
    vec2 vertB = vec2(W, 0.0);
    vec2 vertC = vec2(halfW, H);

    vec2 vertInvalid = vec2(-1.0, 0.0);

    // pattern alternates every other row
    if (mod(yidx, 2.0) != 0.0) {
        t.y = H - t.y;
    }

    float xLeHalfW = isGEq(halfW, t.x);
    float yLehalfN = isGEq(halfn, t.y);
    float yGeN = isGEq(t.y, n);

    float yt = t.y - halfn;
    float xt = (t.x - halfW) / sqrt3;
    float xnt = (halfW - t.x) / sqrt3;

    float xntGeYt = isGEq(xnt, yt);
    float xtGeYt = isGEq(xt, yt);

    vec2 hex =
        yLehalfN * (
             xLeHalfW * vertA +
             (1.0 - xLeHalfW) * vertB) +
        yGeN * vertC +
        (1.0 - yLehalfN) * (1.0 - yGeN) * (
             xLeHalfW * (
                xntGeYt * vertA +
                (1.0 - xntGeYt) * vertC) +
             (1.0 - xLeHalfW) * (
                xtGeYt * vertB +
                (1.0 - xtGeYt) * vertC));

    if (mod(yidx, 2.0) != 0.0) {
        hex.y = H - hex.y;
    }

   hex += o;

   return hex;
}

vec2 get_coords() {
    vec2 rotated = gl_FragCoord.xy - (u_dimensions / 2.);

    float r = length(rotated);
    float theta = atan(rotated.y, rotated.x);
    theta += PI * u_dst_angle / 180.;

    return r * vec2(cos(theta), sin(theta)) + (u_dimensions / 2.);
}

void main() {
    vec2 c = get_coords();

    // c /= u_dimensions;
    // color_out = vec4(c, 0.0, 1.0);
    // return;

    vec2 hex = get_hex_origin(c, u_hex_size);
    vec2 coords = c - hex;

    // convert to polar coords
    float r = length(coords) / u_hex_size;
    float theta = atan(coords.y, coords.x);

    if (theta < (-1. * PI / 6.))
        theta += 2. * PI;

    if (theta > (PI / 6.) && theta <= (PI / 2.))
        theta -= PI / 3.;
    else if (theta > (PI / 2.) && theta <= (5. * PI / 6.))
        theta -= 2. * PI / 3.;
    else if (theta > (5. * PI / 6.) && theta <= (7. * PI / 6.))
        theta -= PI;
    else if (theta > (7. * PI / 6.) && theta <= (9. * PI / 6.))
        theta -= 4. * PI / 3.;
    else if (theta > (9. * PI / 6.) && theta <= (11. * PI / 6.))
        theta -= 5. * PI / 3.;
    //else
    color_out = get_color_from_triangle(r, theta);
}
