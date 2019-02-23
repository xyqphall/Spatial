const emitter = (should_spawn_particle, spawn_particle, get_old_particles) =>
    (world) => {
        const old_particles = get_old_particles(world)
        if (should_spawn_particle()) {
            return old_particles.concat([spawn_particle()])
        } else {
            return old_particles
        }
    }
