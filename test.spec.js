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