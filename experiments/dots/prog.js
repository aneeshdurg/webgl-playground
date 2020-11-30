class Dots {
    dimensions = [1000, 1000];
    radius = 5;
    gridSize = 20;

    constructor(canvas, fragShader) {
        canvas.width = this.dimensions[0];
        canvas.height = this.dimensions[1];

        this.gl = canvas.getContext("webgl2"/*, {premultipliedAlpha: false}*/);
        if (!this.gl)
            throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");
        enableGlExts(this.gl);

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        setupProgram(this.gl, this.programInfo, bufferInfo);
    }

    render(t) {
        // TODO only use one number for dimensions and always assume square
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_radius: this.radius,
            u_grid_size: this.gridSize,
            u_time: t,
        });

        render(this.gl);
    }
}

async function dots_main(canvas, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/dots.frag.c");
    const dots = new Dots(canvas, fragShader);
    function f(t) {
        if (t)
            dots.render(t);
        requestAnimationFrame(f);
    }
    f();
}
