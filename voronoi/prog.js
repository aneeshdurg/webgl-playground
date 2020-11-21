class Voronoi {
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

        this.fbs = new FrameBufferManager(this.gl, this.dimensions);
        this.tex = createTexture(this.gl, this.img_dimensions, img);
    }

    render(time) {
        this.fbs.bind_dst();
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_img_dimensions: this.img_dimensions,
            u_texture_img: this.tex,
            u_texture: this.fbs.src(),
            u_render: false,
        });
        render(this.gl);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        twgl.setUniforms(this.programInfo, {
            u_texture: this.fbs.dst(),
            u_render: true
        });
        render(this.gl);

        this.fbs.flipflop();
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

async function voronoi_main(canvas, img, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    const obj = new Voronoi(canvas, img, fragShader);
    function f(time) {
        obj.render(time);
        requestAnimationFrame(f);
    }

    if (img.tagName === "VIDEO" || img.tagName == "CANVAS") {
        setTimeout(() => {
            setInterval(() => {
                obj.updateTexture();
            }, 500);
        }, 500);
    }

    requestAnimationFrame(f);

    window.obj = obj;
}
