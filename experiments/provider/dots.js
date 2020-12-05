class Dots extends Provider {
    setup() {
        this.setup_ctx();
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.lastTick = 0;
    }

    tick(time) {
        if ((time - this.lastTick) < 1000)
            return;

        this.lastTick = time;
        const radius = 1;

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.beginPath();
        const x = radius + Math.random() * (this.canvas.width - (2 * radius));
        const y = radius + Math.random() * (this.canvas.height - (2 * radius));
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

register_provider({name: 'Dots', description: 'Generate random dots'});
