class Webcam extends Provider {
    async setup() {
        this.setup_ctx();
        this.video = document.createElement("video");

        const constraints = {
            video: {
                mandatory: {
                    maxWidth:  this.dimensions[0],
                    maxHeight: this.dimensions[1]
                }
            }
        }

        await new Promise((r) => {
            navigator.getUserMedia(
                constraints,
                (stream) => {
                    this.video.srcObject = stream;
                    this.video.play();
                    r();
                },
                function(){
                    alert("webcam init failed!");
                }
            );
        });
    }

    tick() {
        if (!this.video.paused && !this.video.ended)
            this.ctx.drawImage(
                this.video, 0, 0, ...this.dimensions
            );
    }
}

register_provider({name: 'Webcam', description: 'Use your webcam!'});
