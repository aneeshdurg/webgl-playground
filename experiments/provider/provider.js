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

    async setup() {}

    get_source() { /* returns an canvas that could be used with a Kaleidoscope */
        return this.canvas;
    }

    tick() {} // update the state of the canvas
}

// Some convenience functions for providers
async function get_provider(obj) {
    const p = new obj([1000, 1000]);
    await p.setup();
    console.log(p.get_source());
    // document.body.appendChild(g.get_source());

    function f(time) {
        // console.log("!");
        p.tick(time);
        requestAnimationFrame(f);
    }
    requestAnimationFrame(f);

    return p.get_source();
}

async function get_el(params, key, defaultProvider) {
    key = key || "src";
    defaultProvider = defaultProvider || Glass;
    const src = params.get(key);
    if (src) {
        const img = new Image();
        img.src = src;
        await new Promise(r => {img.onload = r;});
        return img;
    }

    const provider = params.get("provider");
    return await get_provider(provider ? eval(provider) : defaultProvider);
}


const ALLPROVIDERS = [
    "dots.js",
    "drop.js",
    "glass.js",
    "orbs.js",
];

async function loadAllProviders(root) {
    const waiters = ALLPROVIDERS.map(src => new Promise((resolve) => {
        function resolver() {
            console.log("Loaded", root + src);
            resolve();
        }
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = root + src;
        script.onreadystatechange = resolver;
        script.onload = resolver;
        document.head.appendChild(script);
    }));

    for (let waiter of waiters)
        await waiter;
}
