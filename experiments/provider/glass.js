class BouncingShape {
    position = [-1, -1];
    velocity = [0, 0];

    setVelocity() {
        this.velocity[0] = 2 * Math.random() - 1;
        this.velocity[1] = 2 * Math.random() - 1;

        const mag = Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[1] * this.velocity[1]);

        const target_mag = this.params.vel || 0.5;
        this.velocity = this.velocity.map(x => target_mag * x / mag);
        // console.log("v", this.velocity);
    }

    constructor(dimensions, params) {
        this.params = params;

        this.position = [0, 0];
        this.velocity = [0, 0];

        this.position[0] = Math.floor(Math.random() * dimensions[0]);
        this.position[1] = Math.floor(Math.random() * dimensions[1]);

        this.setVelocity();
    }

    update_pos() {
        return [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];
    }

    draw(ctx) { } // Draw the shape onto the ctx

    tick(ctx, dimensions) {
        this.draw(ctx);
        // console.log("b", this.position, this.velocity);
        let newpos = this.update_pos();
        // console.log("a", newpos);
        let i = 0;
        while (newpos[0] < 0 || newpos[0] > dimensions[0] || newpos[1] < 0 || newpos[1] > dimensions[1]) {
            this.setVelocity();
            newpos = this.update_pos();
        }

        this.position = newpos;

    }
}

class Square extends BouncingShape {
    draw(ctx) {
        ctx.fillStyle = this.params.color;
        ctx.fillRect(this.position[0], this.position[1], this.params.width, this.params.height);
    }
}


class Star extends BouncingShape {
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI/spikes;

        ctx.beginPath();
        ctx.moveTo(cx,cy-outerRadius)
        for(let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x,y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x,y)
            rot += step
        }
        ctx.lineTo(cx,cy-outerRadius);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.params.color_outer;
        ctx.stroke();
        ctx.fillStyle = this.params.color_inner;
        ctx.fill();
    }

    draw(ctx) {
        //ctx.fillStyle = this.params.color;
        // ctx.fillRect(this.position[0], this.position[1], 10, 10);
        this.drawStar(ctx, this.position[0], this.position[1], 5, 10 * this.params.factor, 5 * this.params.factor);
    }
}

class Glass extends Provider {
    setup() {
        this.setup_ctx();
        const h = this.canvas.height / 200;
        const w = this.canvas.width / 200;

        const params_and_counts = [
            {
                params:  {color: "#FF000050", vel: 0.1, width: 10 * w, height: 10 * h},
                count: 5,
            },
            {
                params:  {color: "#00FF0050", vel: 0.1, width: 10 * w, height: 10 * h},
                count: 5,
            },
            {
                params:  {color: "#0000FF50", vel: 0.1, width: 10 * w, height: 10 * h},
                count: 5,
            },
            {
                params:  {color: "#FFFF0050", vel: 0.2, width: 20 * w, height: 10 * h},
                count: 10,
            },
            {
                params:  {color: "#FF00FF50", vel: 0.2, width: 10 * w, height: 20 * h},
                count: 10,
            },
            {
                params:  {color: "#00FFFF50", vel: 0.2, width: 5 * w, height: 25 * h},
                count: 10,
            },
            {
                params:  {color: "#59F8E8", vel: 0.1, width: 15 * w, height: 15 * h},
                count: 10,
            },
            {
                params:  {color: "#EC368D", vel: 0.2, width: 10 * w, height: 15 * h},
                count: 10,
            }
        ]

        this.shapes = [];
        for (let param_and_count of params_and_counts)
            for (let i = 0; i < param_and_count.count; i++)
                this.shapes.push(new Square(this.dimensions, param_and_count.params));

        for (let i = 0; i < 10; i++) {
            this.shapes.push(new Star(this.dimensions, {
                color_outer: "#FF00FF50",
                color_inner: "#0000FF50",
                factor: Math.max(w, h),
                vel: 0.2
            }));
        }
    }

    tick() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let shape of this.shapes)
            shape.tick(this.ctx, this.dimensions);
    }
}
