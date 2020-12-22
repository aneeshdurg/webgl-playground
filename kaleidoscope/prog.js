class Kaleidoscope {
    dimensions = [1000, 1000];
    target_dimensions = [50, 150];
    select_pos = [0, 0];
    hex_size = 200;

    // state for the random camera mode
    velocity = [0, 0];
    velCounter = 99;
    randomTimer = null;

    mousehandler = null;

    constructor(canvas, img, fragShader) {
        this.img = img;
        this.canvas = canvas;

        this.dimensions = [1000, 1000];

        canvas.width = this.dimensions[0];
        canvas.height = this.dimensions[1];
        this.gl = canvas.getContext("webgl2");
        if (!this.gl)
            throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");
        enableGlExts(this.gl);

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        setupProgram(this.gl, this.programInfo, bufferInfo);

        this.select_pos = this.img_dimensions().map(x => x / 2);

        // TODO add a better way to modify this
        canvas.addEventListener("click", e => { this.hex_size /= 2; });

        // TODO provide a way to modify target_dimensions
        this.target_dimensions = [this.img_dimensions()[0] / 2, this.img_dimensions()[1] / 2];

        this.tex = createTexture(this.gl, this.img_dimensions(), img);
    }

    toggleMode(mode) {
        // TODO introduce more camera modes
        if (mode === "mouse") {
            if (this.randomTimer)
                clearInterval(this.randomTimer);

            this.mousehandler = this.movementhandler.bind(this);
            this.canvas.addEventListener("mousemove", this.mousehandler);
            this.canvas.addEventListener("touchmove", this.mousehandler);
        } else {
            if (this.mousehandler) {
                this.canvas.removeEventListener("mousemove", this.mousehandler);
                this.canvas.removeEventListener("touchmove", this.mousehandler);
                this.mousehandler = null;
            }
            this.randomTimer = setInterval(() => {this.random_select_pos()}, 50);
        }
    }

    movementhandler(e) {
        const target = e.target;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        const rect = target.getBoundingClientRect();
        this.select_pos = [
            this.img_dimensions()[0] * (clientX - rect.left) / rect.width,
            this.img_dimensions()[1] * (clientY - rect.top) / rect.height
        ];
    }

    random_select_pos() {
        // TODO make this camera stop going out of bounds
        this.select_pos[0] += this.velocity[0];
        this.select_pos[1] += this.velocity[1];

        let needs_new_vel = false;
        if (this.select_pos[0] > this.img_dimensions()[0]) {
            needs_new_vel = true;
            this.select_pos[0] = this.img_dimensions()[0];
        } else if (this.select_pos[0] < 0) {
            needs_new_vel = true;
            this.select_pos[0] = 0;
        } else if (this.select_pos[1] > this.img_dimensions()[1]) {
            needs_new_vel = true;
            this.select_pos[1] = this.img_dimensions()[1];
        } else if (this.select_pos[1] < 0) {
            needs_new_vel = true;
            this.select_pos[1] = 0;
        }

        this.velCounter++;
        if (needs_new_vel)
            this.velCounter = 100;

        if (this.velCounter != 100)
            return;
        this.velCounter = 0;
        this.velocity = [Math.random() - 0.5, Math.random() - 0.5]
        this.velocity = this.velocity.map(x => 3 * x);
    }

    img_dimensions() {
        return [this.img.width || this.img.videoWidth, this.img.height || this.img.videoHeight];
    }

    render() {
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_img_dimensions: this.img_dimensions(),
            u_texture: this.tex,
            u_target_dimensions: this.target_dimensions,
            u_select_pos: this.select_pos,
            u_hex_size: this.hex_size,
        });

        render(this.gl);
    }

    updateTexture() {
        updateTexture(
            this.gl,
            this.img_dimensions(),
            this.tex,
            this.img
        );
    }
}

async function kaleidoscope_main(canvas, img, modeselector, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    const obj = new Kaleidoscope(canvas, img, fragShader);
    obj.toggleMode(modeselector.value);
    modeselector.onchange = () => { obj.toggleMode(modeselector.value); }

    if (img.tagName === "VIDEO" || img.tagName == "CANVAS") {
        setInterval(() => {
            obj.updateTexture();
        }, 5);
    }

    function f() {
        obj.render();
        requestAnimationFrame(f);
    }
    f();

    window.obj = obj;
}
