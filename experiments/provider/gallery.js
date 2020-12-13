class Gallery extends Provider {
    setup() {
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

        const images = [
            "../images/AneeshDurg-LakeValhalla.jpg",
            "../images/Composition_A_by_Piet_Mondrian_Galleria_Nazionale_d'Arte_Moderna_e_Contemporanea.jpg",
            "../images/blank.png",
            "../images/ken-cheung-Z2M2KkdNLWQ-unsplash.jpg",
            "../images/pexels-anni-roenkae-3110502.jpg",
            "../images/pexels-nika-akin-3598435.jpg",
            "../images/pexels-steve-johnson-1266808.jpg",
            "../images/pexels-yaroslav-shuraev-1834393.jpg",
            "../images/test0.jpg",
            "../images/test10.jpg",
            "../images/test11.jpg",
            "../images/test3.jpg",
            "../images/test4.jpg",
        ];

        const img_style = "padding-left: 1em";

        for (const src of images) {
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
