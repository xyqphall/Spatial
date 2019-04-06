describe("emitter", () => {
    const get_old_particles = (state) => state
    it("creates particles when the predicate is true", () => {
        const should_spawn_particle = () => true;
        const spawn_particle = () => "PARTICLE";
        const em = emitter(
            should_spawn_particle,
            spawn_particle,
            get_old_particles
        );
        const old_particles = [];
        const particles_after = em(old_particles);
        chai.expect(particles_after).to.contain("PARTICLE")
    })
    it("does not create particles when the predicate is false", () => {
        const should_spawn_particle = () => false;
        const spawn_particle = () => "PARTICLE";
        const em = emitter(
            should_spawn_particle,
            spawn_particle,
            get_old_particles
        );
        const old_particles = [];
        const particles_after = em(old_particles);
        chai.expect(particles_after).to.not.contain("PARTICLE")
    })
    it("keeps old particles when creating new ones", () => {
        const should_spawn_particle = () => true;
        const spawn_particle = () => "PARTICLE";
        const em = emitter(
            should_spawn_particle,
            spawn_particle,
            get_old_particles
        );
        const old_particles = ["OLD-PARTICLE"];
        const particles_after = em(old_particles);
        chai.expect(particles_after).to.contain("OLD-PARTICLE")
    })
    it("keeps old particles unchanged when no particle should spawn", () => {
        const should_spawn_particle = () => false;
        const spawn_particle = () => "PARTICLE";
        const em = emitter(
            should_spawn_particle,
            spawn_particle,
            get_old_particles
        );
        const old_particles = ["OLD-PARTICLE"];
        const particles_after = em(old_particles);
        chai.expect(particles_after).to.equal(old_particles)
    })
});

describe("move", () => {
    it("adds speed to current position after a second", () => {
        let move_for_one_second = move(1)
        chai.expect(move_for_one_second({
            speed: {x: 1, y: 1},
            position: {x: 0, y: 0},
        }).position).to.be.deep.equal({x: 1, y: 1})
        chai.expect(move_for_one_second({
            speed: {x: 1, y: 3},
            position: {x: 3, y: 2},
        }).position).to.be.deep.equal({x: 4, y: 5})
    })
    it("adds speed proportional to the time passed", () => {
        let object = {
            speed: {x: 1, y: 3},
            position: {x: 3, y: 2},
        }
        chai.expect(
            move(2)(object).position
        ).to.be.deep.equal({x: 5, y: 8})
    })
    it("preserves speed", () => {
        let object = {
            speed: {x: 1, y: 3},
            position: {x: 3, y: 2},
        }
        chai.expect(
            move(2)(object).speed
        ).to.be.deep.equal({x: 1, y: 3})
    })
})

describe("point", () => {
    it("can be added to another point", () => {
        const p = point(1, 2).add(point(3, 4))
        chai.expect(p.x).to.equal(4)
        chai.expect(p.y).to.equal(6)
    })
})
describe("sprite", () => {
    it('has position', () => {
        const s = sprite(
            point(1, 2),
            point(3,4),
            "new Image()"
        )
        chai.expect(s.position.x).to.equal(1)
    });
    it('has speed', () => {
        const s = sprite(
            point(1, 2),
            point(3,4),
            "new Image()"
        )
        chai.expect(s.speed.x).to.equal(3)
    });
    it('has image', () => {
        const s = sprite(
            point(1, 2),
            point(3,4),
            "new Image()"
        )
        chai.expect(s.image).to.equal("new Image()")
    });
    it('teleports', () => {
        const s = sprite(
            point(1, 2),
            point(3,4),
            "new Image()"
        ).teleport(point(12, 43))
        chai.expect(s.position.x).to.equal(12)
        chai.expect(s.position.y).to.equal(43)
    });
})