class LightSource {
    position = [0.0, 0.0];
    velocity = [0.0, 0.0];

    constructor() {
        this.setVelocity();
    }

    setVelocity() {
        const velocity = [0.0, 0.0];

        let mag = 0
        while (mag == 0) {
            velocity[0] = 2 * Math.random() - 1.0;
            velocity[1] = 2 * Math.random() - 1.0;
            mag = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
        }

        velocity[0] *= 0.01 / mag;
        velocity[1] *= 0.01 / mag;

        this.velocity = velocity;
    }

    update() {
        if (Math.abs(this.position[0]) == 1.0 || Math.abs(this.position[1]) == 1.0)
            this.setVelocity();

        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];

        if (this.position[0] > 1.0)
            this.position[0] = 1.0;
        if (this.position[0] < -1.0)
            this.position[0] = -1.0;
        if (this.position[1] > 1.0)
            this.position[1] = 1.0;
        if (this.position[1] < -1.0)
            this.position[1] = -1.0;
    }
}

class FloatingOrbs {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2"/*, {premultipliedAlpha: false}*/);
        if (!this.gl)
            throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");
        enableGlExts(this.gl);

        const fragShader = `
            #version 300 es
            #ifdef GL_FRAGMENT_PRECISION_HIGH
            precision highp float;
            precision highp int;
            #else
            precision mediump float;
            precision mediump int;
            #endif

            out vec4 color_out;

            uniform vec2 u_red;
            uniform vec2 u_green;
            uniform vec2 u_blue;

            void main() {
                vec2 coords = (gl_FragCoord.xy / 500.0) - vec2(1.0, 1.0);
                color_out = vec4(
                    1.0 - length(coords - u_red) / 2.0,
                    1.0 - length(coords - u_green) / 2.0,
                    1.0 - length(coords - u_blue) / 2.0,
                    1.0
                );

                return;
            }`;

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        setupProgram(this.gl, this.programInfo, bufferInfo);

        this.red_light = new LightSource();
        this.green_light = new LightSource();
        this.blue_light = new LightSource();
    }

    tick() {
        twgl.setUniforms(this.programInfo, {
            u_red: this.red_light.position,
            u_green: this.green_light.position,
            u_blue: this.blue_light.position,
        });
        render(this.gl);

        this.red_light.update();
        this.green_light.update();
        this.blue_light.update();
    }
}

async function floating_orbs_main(canvas) {
    await loadTwgl();
    const dimensions = [1000, 1000];

    canvas.width = dimensions[0];
    canvas.height = dimensions[1];
    const orbs = new FloatingOrbs(canvas);

    function run() {
        orbs.tick();
        requestAnimationFrame(run);
    }

    run();
}
