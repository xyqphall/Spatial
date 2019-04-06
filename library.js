global.emitter = (should_spawn_particle, spawn_particle, get_old_particles) =>
    (world) => {
        const old_particles = get_old_particles(world)
        if (should_spawn_particle()) {
            return old_particles.concat([spawn_particle()])
        } else {
            return old_particles
        }
    }

global.move = second_passed => object => ({
    ...object,
    position: {
        x: object.position.x + object.speed.x * second_passed,
        y: object.position.y + object.speed.y * second_passed,
    }
})

global.point = (x, y) => ({
    x, y,
    add: other => point(x + other.x, y + other.y)
})

global.sprite = (position, speed, image) => ({
    position, speed, image,
    teleport: position => sprite(position, speed, image)
})