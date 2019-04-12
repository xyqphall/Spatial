global.emitter = (should_spawn_particle, spawn_particle, get_old_particles) =>
    (world) => {
        const old_particles = get_old_particles(world)
        if (should_spawn_particle()) {
            return old_particles.concat([spawn_particle()])
        } else {
            return old_particles
        }
    }

global.move = seconds_passed => a_sprite =>
    a_sprite.move(a_sprite.distance(seconds_passed))

global.point = (x, y) => ({
    x, y,
    add: other => point(x + other.x, y + other.y),
    multiply: k => point(x * k, y * k),
})

global.sprite = (position, speed, image) => {
    const teleport = position => sprite(position, speed, image)
    const move = distance => teleport(position.add(distance))
    const distance = seconds => speed.multiply(seconds)
    return {
        position, speed, image,
        teleport,
        move,
        distance,
    }
}