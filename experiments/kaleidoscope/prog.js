class Kaleidoscope {
    dimensions = [1000, 1000];
    target_dimensions = [50, 150];
    select_pos = [0, 0];
    hex_size = 200;

    enableSrcRotation = false;
    src_delta = 0.01;
    enableDstRotation = false;
    dst_delta = 0.04;

    enableWander = true;

    display_edges = false;

    constructor(canvas, img, fragShader, mousecontrols) {
        this.img = img;

        this.img_dimensions = [img.width || img.videoWidth, img.height || img.videoHeight];

        //const rect = canvas.getBoundingClientRect();
        //this.dimensions = [rect.width, rect.height];
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

        this.select_pos = this.img_dimensions.map(x => x / 2);

        const that = this;

        let velocity = [0, 0];
        let velCounter = 99;

        if (this.enableWander) {
            if (!mousecontrols) {
                setInterval(() => {
                    that.select_pos[0] += velocity[0];
                    that.select_pos[1] += velocity[1];

                    let needs_new_vel = false;
                    if (that.select_pos[0] > that.img_dimensions[0]) {
                        needs_new_vel = true;
                        that.select_pos[0] = that.img_dimensions[0];
                    } else if (that.select_pos[0] < 0) {
                        needs_new_vel = true;
                        that.select_pos[0] = 0;
                    } else if (that.select_pos[1] > that.img_dimensions[1]) {
                        needs_new_vel = true;
                        that.select_pos[1] = that.img_dimensions[1];
                    } else if (that.select_pos[1] < 0) {
                        needs_new_vel = true;
                        that.select_pos[1] = 0;
                    }

                    if (needs_new_vel)
                        console.log("*", ...that.select_pos, "\n", ...that.target_dimensions, "\n", ...that.img_dimensions);

                    velCounter++;
                    if (needs_new_vel)
                        velCounter = 100;

                    if (velCounter != 100)
                        return;
                    velCounter = 0;
                    velocity = [Math.random() - 0.5, Math.random() - 0.5]
                    velocity = velocity.map(x => 3 * x);
                    // const velocityMag =
                    //     Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
                    // velocity = velocity.map(x => x * 0.1 / velocityMag);

                    // console.log(that.select_pos);
                }, 50);
            } else {
                canvas.addEventListener("mousemove", e => {
                    const rect = e.target.getBoundingClientRect();
                    that.select_pos = [
                        that.img_dimensions[0] * (e.clientX - rect.left) / rect.width,
                        that.img_dimensions[1] * (e.clientY - rect.top) / rect.height
                    ];
                });
            }
        }

        window.setPos = (x, y) => {
            that.select_pos = [x, y];
        }

        canvas.addEventListener("click", e => {
            that.update();
        });

        this.target_dimensions = [this.img_dimensions[0] / 2, this.img_dimensions[1] / 2];

        this.tex = createTexture(this.gl, this.img_dimensions, img);

        this.src_angle = 0;
        this.dst_angle = 0;
        setInterval(() => {
            function update_angle(angle, delta) {
                let newangle = angle + delta;
                if (newangle >= 360)
                    newangle -= 360;
                return newangle;
            }
            that.src_angle = update_angle(that.src_angle, that.src_delta);
            that.dst_angle = update_angle(that.dst_angle, that.dst_delta);
        }, 10);
    }

    render() {
        // TODO only use one number for dimensions and always assume square
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_img_dimensions: this.img_dimensions,
            u_texture: this.tex,
            u_target_dimensions: this.target_dimensions,
            u_select_pos: this.select_pos,
            u_hex_size: this.hex_size,
            u_src_angle: this.enableSrcRotation ? this.src_angle : 0,
            u_dst_angle: this.enableDstRotation ? this.dst_angle : 0,
            u_display_edges: this.display_edges,
        });

        render(this.gl);

        // this.update();
    }

    updateTexture() {
        updateTexture(
            this.gl,
            this.img_dimensions,
            this.tex,
            this.img
        );
    }

    update() {
        this.hex_size /= 2;
    }
}

async function kaleidoscope_main(canvas, img, mode, root) {
    root = root || ".";

    await loadTwgl();

    const fragShader = await getFile(root + "/compute.frag.c");
    const scope = new Kaleidoscope(canvas, img, fragShader, mode !== "RANDOM");
    function f() {
        scope.render();
        requestAnimationFrame(f);
    }

    if (img.tagName === "VIDEO" || img.tagName == "CANVAS") {
        scope.enableSrcRotation = false;
        setInterval(() => {
            scope.updateTexture();
        }, 5);
    }

    f();

    window.scope = scope;
}
