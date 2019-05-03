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
    const accelerateTo = amount => sprite(position, amount, image)
    return {
        position, velocity: speed, image,
        teleport,
        move,
        distance,
        accelerateTo,
    }
}

global.player = (ship, shot, shots, next_fire, is_firing) => ({
    ship, shots, next_fire, is_firing,
    start_firing: at_time => player(ship, shot, shots, Math.max(at_time, next_fire), true),
    fire: () => player(
        ship,
        shot,
        [
            ...shots,
            shot.teleport(point(120, - 10)),
            shot.teleport(point(120, 170)),
        ],
        next_fire + 500,
        is_firing
    ),
    stop_firing: () => player(ship, shot, shots, next_fire, false),
    update: time_delta => {
        const update = move(time_delta);
        return player(
            update(ship),
            shot,
            shots.map(update),
            next_fire,
            is_firing
        )
    },
})