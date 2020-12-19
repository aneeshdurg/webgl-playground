class Voronoi {
    dimensions = [1000, 1000];

    constructor(canvas, img, fragShader) {
        this.img = img;

        this.img_dimensions = [img.width || img.videoWidth, img.height || img.videoHeight];

        this.dimensions = [1000, 1000];
        // this.world_dimensions = this.dimensions.map(x => x / 2);
        this.world_dimensions = [this.dimensions[0], this.dimensions[1]];

        canvas.width = this.dimensions[0];
        canvas.height = this.dimensions[1];
        this.gl = canvas.getContext("webgl2"/*, {premultipliedAlpha: false}*/);
        if (!this.gl)
            throw new Error("Could not initialize webgl2 context! Does your browser support webgl2?");
        enableGlExts(this.gl);

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fragShader]);
        const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, bufferArrays);
        setupProgram(this.gl, this.programInfo, bufferInfo);

        this.food_fbs = new FrameBufferManager(this.gl, this.world_dimensions);
        this.microbe_fbs = new FrameBufferManager(this.gl, this.world_dimensions);

        // TODO replace this img with a food generator
        this.tex = createTexture(this.gl, this.img_dimensions, img);
    }

    render(time) {
        const stages = {
            FOOD_UPDATE: 0,
            MICROBE_MOVEMENT: 1,
            RENDER: 2,
        };

        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.world_dimensions,
            u_render: false,
        });

        this.food_fbs.bind_dst();
        twgl.setUniforms(this.programInfo, {
            u_img_dimensions: this.img_dimensions,
            u_texture_img: this.tex,
            u_texture: this.food_fbs.src(),
            u_stage: stages.FOOD_UPDATE,
        });
        render(this.gl);
        this.food_fbs.flipflop();

        let should_spawn = false;
        let spawn_pt = [0, 0];
        let spawn_color = [0, 0, 0];
        if (Math.random() > 0) {
            should_spawn = true;
            spawn_pt = [
                Math.floor(Math.random() * this.world_dimensions[0]),
                Math.floor(Math.random() * this.world_dimensions[1]),
            ];

            // TODO have a set of predefined colors
            spawn_color = [Math.random(), Math.random(), Math.random()];
            // spawn_color = [1, 0, 0];
            console.log("Spawning", spawn_pt, spawn_color);
        }

        this.microbe_fbs.bind_dst();
        twgl.setUniforms(this.programInfo, {
            // u_img_dimensions: this.world_dimensions, // dimensions of food_fbs
            u_texture_img: this.food_fbs.src(),
            u_texture: this.microbe_fbs.src(),
            u_should_spawn: should_spawn,
            u_spawn_pt: spawn_pt,
            u_spawn_color: spawn_color,
            u_stage: stages.MICROBE_MOVEMENT,
        });
        render(this.gl);
        this.microbe_fbs.flipflop();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        twgl.setUniforms(this.programInfo, {
            u_dimensions: this.dimensions,
            u_texture: this.microbe_fbs.src(),
            u_stage: stages.RENDER,
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
