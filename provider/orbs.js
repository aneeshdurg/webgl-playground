class Orbs extends Provider {
    async setup() {
        await new Promise((resolve) => {
            function resolver() {
                console.log("Loaded floating_orbs");
                resolve();
            }
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "../floating_orbs/prog.js";
            script.onreadystatechange = resolver;
            script.onload = resolver;
            document.head.appendChild(script);
        });
        this.obj = new FloatingOrbs(this.canvas);
    }

    tick() {
        this.obj.tick();
    }
}


register_provider({name: 'Orbs', description: 'Floating orbs of colored light'});
