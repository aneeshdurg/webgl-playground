class Tixy {
    dimensions = [2000, 2000];
    gridSize = 20;

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
            u_grid_size: this.gridSize,
            u_time: t,
            u_i: window.i || 0,
            u_n: window.n || 3
        });

        render(this.gl);
    }
}

async function tixy_main(canvas, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/tixy.frag.c");
    const tixy = new Tixy(canvas, fragShader);
    function f(t) {
        if (t)
            tixy.render(t);
        requestAnimationFrame(f);
    }
    f();
}
