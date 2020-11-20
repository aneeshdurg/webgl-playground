class Orbs extends Provider {
    constructor(dimensions) {
        super(dimensions);
        this.obj = new FloatingOrbs(this.canvas);
    }

    tick() {
        this.obj.tick();
    }
}
