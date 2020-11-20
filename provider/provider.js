/**
 * A class defining how to interact with a source for a kaleidoscope
 */

class Provider {
    constructor(dimensions) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = dimensions[0];
        this.canvas.height = dimensions[1];
        this.dimensions = [...dimensions];
    }

    setup_ctx() {
        this.ctx = this.canvas.getContext("2d");
    }

    setup() {}

    get_source() { /* returns an canvas that could be used with a Kaleidoscope */
        return this.canvas;
    }

    tick() {} // update the state of the canvas
}

// Some convenience functions for providers
function get_provider(obj) {
    const p = new obj([200, 200]);
    p.setup();
    console.log(p.get_source());
    // document.body.appendChild(g.get_source());

    function f() {
        // console.log("!");
        p.tick();
        requestAnimationFrame(f);
    }
    requestAnimationFrame(f);

    return p.get_source();
}

async function get_el(params) {
    const src = params.get("src");
    if (src) {
        const img = new Image();
        img.src = src;
        await new Promise(r => {img.onload = r;});
        return img;
    }

    const provider = params.get("provider");
    return get_provider(provider ? eval(provider) : Glass);
}
