class Chaos {
    dimensions = [2000, 2000];

    constructor(canvas, fragShader) {
        canvas.width = this.dimensions[0];
        canvas.height = this.dimensions[1];

        this.gl = canvas.getContext("webgl2"/*, {premultipliedAlpha: false}*/);
        if (!this.gl)
            throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        setupProgram(this.gl, this.programInfo, bufferInfo);
    }

    render(t) {
        // TODO only use one number for dimensions and always assume square
        twgl.setUniforms(this.programInfo, {
            u_resolution: this.dimensions,
            u_time: t,
            u_rand: Math.random()
        });

        render(this.gl);
    }
}

async function chaos_main(canvas, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    console.log(fragShader);
    const chaos = new Chaos(canvas, fragShader);
    function f(t) {
        if (t)
            chaos.render(t);
        requestAnimationFrame(f);
    }
    f();
}
