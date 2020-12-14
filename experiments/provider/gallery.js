class Gallery extends Provider {
    async setup() {
        console.log("!!!");
        this.setup_ctx();
        this.container = document.createElement("div");
        document.getElementById("ui").appendChild(this.container);
        this.container.innerHTML = "<br>Gallery:<br>";

        this.el = document.createElement("div");
        this.container.appendChild(this.el);

        this.el.style.width = "90%";
        this.el.style.height = "100px";
        this.el.style.overflow = "auto";
        this.el.style.border = "solid 2px";
        this.el.style.marginLeft = "5%";

        const images = JSON.parse(await getFile("../images/allimages.json"));
        const img_style = "padding-left: 1em";

        for (const src of images) {
            if (!src)
                continue;

            const img = document.createElement("img");
            img.height = 100;
            img.width = 100;
            img.src = src;
            img.style = img_style;

            this.el.appendChild(img);
            img.onclick = () => {
                console.log(img.src);
                this.ctx.drawImage(img, 0, 0, this.dimensions[0], this.dimensions[1]);
            };
        }
    }
}

register_provider({name: 'Gallery', description: 'Select an image from a gallery'});
