class Webcam extends Provider {
    async setup() {
        this.setup_ctx();
        this.video = document.createElement("video");

        const constraints = {
            video: {
                mandatory: {
                    maxWidth: 320,
                    maxHeight: 180
                }
            }
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = stream;
            this.video.play();
        } catch (err) {
            alert("Error initializing webcam!");
        }
    }

    tick() {
        if (!this.video.paused && !this.video.ended)
            this.ctx.drawImage(
                this.video, 0, 0, ...this.dimensions
            );
    }
}

register_provider({name: 'Webcam', description: 'Use your webcam!'});
