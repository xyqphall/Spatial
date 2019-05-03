const expect = chai.expect
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
    it("adds velocity to current position after a second", () => {
        let move_for_one_second = move(1)
        const p1 = move_for_one_second(sprite(point(0, 0), point(1, 1))).position
        const p2 = move_for_one_second(sprite(point(3, 2), point(1, 3))).position
        chai.expect(p1.x).to.equal(1)
        chai.expect(p1.y).to.equal(1)
        chai.expect(p2.x).to.equal(4)
        chai.expect(p2.y).to.equal(5)
    })
    it("adds velocity proportional to the time passed", () => {
        let object = sprite(point(3, 2), point(1, 3))
        const position = move(2)(object).position
        chai.expect(position.x).to.equal(5)
        chai.expect(position.y).to.equal(8)
    })
    it("preserves velocity", () => {
        let object = sprite(point(3, 2), point(1, 3))
        const speed = move(2)(object).velocity
        chai.expect(speed.x).to.equal(1)
        chai.expect(speed.y).to.equal(3)
    })
})

describe("point", () => {
    it("can be added to another point", () => {
        const p = point(1, 2).add(point(3, 4))
        chai.expect(p.x).to.equal(4)
        chai.expect(p.y).to.equal(6)
    })
    it("can be multiplied by a number", () => {
        const p = point(1, 2).multiply(3)
        chai.expect(p.x).to.equal(3)
        chai.expect(p.y).to.equal(6)
    })
})
describe("sprite", () => {
    const s = sprite(
        point(1, 2),
        point(3,4),
        "new Image()"
    )
    it('has position', () => {
        chai.expect(s.position.x).to.equal(1)
    });
    it('has velocity', () => {
        chai.expect(s.velocity.x).to.equal(3)
    });
    it('has image', () => {
        chai.expect(s.image).to.equal("new Image()")
    });
    it('teleports', () => {
        const teleported = s.teleport(point(12, 43))
        chai.expect(teleported.position.x).to.equal(12)
        chai.expect(teleported.position.y).to.equal(43)
    });
    it('moves', () => {
        const moved = s.move(point(12, 43))
        chai.expect(moved.position.x).to.equal(13)
        chai.expect(moved.position.y).to.equal(45)
    });
    it('accelerate to velocities', function () {
        const accelerated = s.accelerateTo(point(12, 43))
        chai.expect(accelerated.velocity.x).to.equal(12)
        chai.expect(accelerated.velocity.y).to.equal(43)
    });
})

describe("player", () => {
    const ship = sprite(point(0, 0), point(1, 1), "image")
    const shot = sprite(point(0, 0), point(1, 1), "shot-image")
    const _player = player(ship, shot, [], 0, false)

    it('starts firing right away if cool-down have passed', () => {
        const firing_player = _player.start_firing(100)

        chai.expect(firing_player.is_firing).to.equal(true)
        chai.expect(firing_player.next_fire).to.equal(100)
    })
    it('starts firing cool-down have passed if it have not passed', () => {
        const p = player(ship, shot, [], 100, false)

        const firing_player = p.start_firing(0)

        chai.expect(firing_player.is_firing).to.equal(true)
        chai.expect(firing_player.next_fire).to.equal(100)
    });
    it('should stop firing', () => {
        const firing_player = _player.stop_firing()

        chai.expect(firing_player.is_firing).to.equal(false)
        chai.expect(firing_player.next_fire).to.equal(0)
    })
    it('fires two shots', () => {
        const after = _player.fire()

        chai.expect(after.shots.length).to.equal(2)
        chai.expect(after.shots[0].image).to.equal(shot.image)
        chai.expect(after.shots[1].image).to.equal(shot.image)
    });
    it('fires shots from its cannons', () => {
        const after = _player.fire()

        const shots = after.shots
        const positions = shots
            .map(x => x.position)
            .sort((a, b) => a.y - b.y);
        chai.expect(positions[0].x).to.equal(120)
        chai.expect(positions[1].x).to.equal(120)
        // 41 is the projectile height
        // 200 is the ship height

        // -10 means that default shot should be 10 pixels above the ship
        // since the middle of the shot is 20.5 the "cannons" middle
        // is 10.5 into the ship
        chai.expect(positions[0].y).to.equal(0 + 10 - 20)
        chai.expect(positions[1].y).to.equal(200 - 10 - 20)
    });
    it('increase cool-down when it fires', () => {
        // TODO: test correct projectiles
        const after = _player.fire()

        expect(after.next_fire).to.equal(500)
    });
    it('moves all sprites', () => {
        const time_delta = 1;
        const after = _player.fire().update(time_delta)
        expect(after.ship.position.x).to.equal(1)
        expect(after.ship.position.y).to.equal(1)
        expect(after.shots[0].position.x).to.equal(121)
        expect(after.shots[0].position.y).to.equal(-9)
        expect(after.shots[1].position.x).to.equal(121)
        expect(after.shots[1].position.y).to.equal(171)
    });
})