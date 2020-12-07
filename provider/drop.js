class Drop extends Provider {
    setup() {
        this.setup_ctx();
        this.el = document.createElement("div");
        document.getElementById("ui").appendChild(this.el);

        this.fileSelect = document.createElement("input");
        this.fileSelect.type = "file";
        this.fileSelect.accept = "image/*";
        this.fileSelect.addEventListener("change", this.uploadImage.bind(this));
        this.el.appendChild(this.fileSelect);
        this.img = document.createElement('img')
        this.img.src = "../images/blank.png";
        this.needsUpdate = false;
    }

    uploadImage() {
        alert("Uploaded file!");
        let file = this.fileSelect.files[0];
        let reader = new FileReader();
        const that = this;
        reader.readAsDataURL(file)
        reader.onloadend = function() {
            alert("Loaded!");
            that.img.src = reader.result
            that.needsUpdate = true;
        }
    }

    tick() {
        if (!this.needsUpdate)
            return;

        this.needsUpdate = false;
        this.ctx.drawImage(this.img, 0, 0, this.dimensions[0], this.dimensions[1]);
    }
}

register_provider({name: 'Drop', description: 'Supply your own image!'});
