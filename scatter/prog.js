class Scatter {
    dimensions = [1000, 1000];

    constructor(canvas, img, fragShader) {
        this.img = img;

        this.img_dimensions = [img.width || img.videoWidth, img.height || img.videoHeight];

        this.dimensions = [1000, 1000];

        canvas.width = this.dimensions[0];
        canvas.height = this.dimensions[1];
        this.gl = canvas.getContext("webgl2"/*, {premultipliedAlpha: false}*/);
        if (!this.gl)
            throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");
        enableGlExts(this.gl);

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        setupProgram(this.gl, this.programInfo, bufferInfo);

        this.tex = createTexture(this.gl, this.img_dimensions, img);
    }

    render(time) {
        // TODO only use one number for dimensions and always assume square
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_img_dimensions: this.img_dimensions,
            u_texture: this.tex,
            u_time: time,
        });

        render(this.gl);
    }

    updateTexture() {
        updateTexture(
            this.gl,
            this.img_dimensions,
            this.tex,
            this.img
        );
    }
}

async function scatter_main(canvas, img, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    const obj = new Scatter(canvas, img, fragShader);
    function f(time) {
        obj.render(time);
        requestAnimationFrame(f);
    }

    if (img.tagName === "VIDEO" || img.tagName == "CANVAS") {
        obj.enableSrcRotation = false;
        setInterval(() => {
            obj.updateTexture();
        }, 5);
    }

    requestAnimationFrame(f);

    window.obj = obj;
}
