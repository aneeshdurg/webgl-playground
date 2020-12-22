class Plotter {
    dimensions = [1000, 1000];

    needs_reset = false;
    reset_time = 0;

    past = [];
    n = 0;

    callback = (t, n, past) => 0;

    constructor(canvas, code_el, fragShader) {
        this.code_el = code_el;
        this.code_el.onchange = this.codechange.bind(this);
        this.codechange();
        // this.img = img;

        // this.img_dimensions = [img.width || img.videoWidth, img.height || img.videoHeight];

        // this.dimensions = [1000, 1000];

        // canvas.width = this.dimensions[0];
        // canvas.height = this.dimensions[1];
        // this.gl = canvas.getContext("webgl2"/*, {premultipliedAlpha: false}*/);
        // if (!this.gl)
        //     throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");
        // enableGlExts(this.gl);

        // this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        // const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        // setupProgram(this.gl, this.programInfo, bufferInfo);

        // this.tex = createTexture(this.gl, this.img_dimensions, img);
    }

    codechange() {
        try {
            const callback = eval('(t, n, past) => ' + this.code_el.value);
            this.callback = callback;
        } catch(err) {
            return;
        }

        this.past = [];
        this.n = 0;
        this.needs_reset = true;
    }

    render(time) {
        if (this.needs_reset) {
            this.reset_time = time;
            this.needs_reset = false;
        }

        this.past.unshift(this.callback(time - this.reset_time, this.n++, this.past));
        if (window.should_log) {
            console.log(this.past[0]);
        }
        // twgl.setUniforms(this.programInfo, {
        //     u_dimensions: this.dimensions,
        //     u_img_dimensions: this.img_dimensions,
        //     u_block: [this.block, this.block],
        //     u_texture: this.tex,
        //     u_time: time,
        // });

        // render(this.gl);
    }
}

async function plotter_main(canvas, code_el, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    const obj = new Plotter(canvas, code_el, fragShader);
    function f(time) {
        obj.render(time);
        requestAnimationFrame(f);
    }
    requestAnimationFrame(f);

    window.obj = obj;
}
