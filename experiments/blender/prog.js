class Scatter {
    dimensions = [1000, 1000];

    constructor(canvas, img_1, img_2, fragShader, mousecontrols) {
        this.img_1 = img_1;
        this.img_dimensions_1 = [img_1.width || img_1.videoWidth, img_1.height || img_1.videoHeight];

        this.img_2 = img_2;

        this.img_dimensions_2 = [img_2.width || img_2.videoWidth, img_2.height || img_2.videoHeight];

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

        this.tex_1 = createTexture(this.gl, this.img_dimensions_1, img_1);
        this.tex_2 = createTexture(this.gl, this.img_dimensions_2, img_2);
    }

    render(time) {
        // TODO only use one number for dimensions and always assume square
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_img_dimensions_1: this.img_dimensions_1,
            u_img_dimensions_2: this.img_dimensions_2,
            u_texture_1: this.tex_1,
            u_texture_2: this.tex_2,
            u_time: time,
        });

        render(this.gl);
    }

    updateTexture() {
        updateTexture(
            this.gl,
            this.img_dimensions_1,
            this.tex_1,
            this.img_1
        );

        updateTexture(
            this.gl,
            this.img_dimensions_2,
            this.tex_2,
            this.img_2
        );
    }
}

async function scatter_main(canvas, img_1, img_2, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    const obj = new Scatter(canvas, img_1, img_2, fragShader);
    function f(time) {
        obj.render(time);
        requestAnimationFrame(f);
    }

    if (img_1.tagName === "VIDEO" || img_1.tagName == "CANVAS") {
        setInterval(() => {
            obj.updateTexture();
        }, 5);
    } else if (img_2.tagName === "VIDEO" || img_2.tagName == "CANVAS") {
        setInterval(() => {
            obj.updateTexture();
        }, 5);
    }

    requestAnimationFrame(f);

    window.obj = obj;
}
