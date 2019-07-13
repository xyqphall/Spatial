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

global.player = (ship, shot, shots, next_fire, is_firing, move_orders) => ({
    ship, shot, shots, next_fire, is_firing,
    start_firing: at_time =>
        player(ship, shot, shots, Math.max(at_time, next_fire), true, move_orders),
    fire: () => player(
        ship,
        shot,
        [
            ...shots,
            shot.teleport(ship.position.add(point(120, - 10))),
            shot.teleport(ship.position.add(point(120, 170))),
        ],
        next_fire + 500,
        is_firing,
        move_orders
    ),
    stop_firing: () => player(ship, shot, shots, next_fire, false, move_orders),
    update: time_delta => {
        const update = move(time_delta);
        return player(
            update(ship),
            shot,
            shots.map(update),
            next_fire,
            is_firing,
            move_orders
        )
    },
    move_north: () =>
        player(ship.accelerateTo(point(0, -540)), shot, shots, next_fire, is_firing, move_orders + 1),
    move_south: () =>
        player(ship.accelerateTo(point(0, 540)), shot, shots, next_fire, is_firing, move_orders + 1),
    move_east: () =>
        player(ship.accelerateTo(point(540, 0)), shot, shots, next_fire, is_firing, move_orders + 1),
    move_west: () =>
        player(ship.accelerateTo(point(-540, 0)), shot, shots, next_fire, is_firing, move_orders + 1),
    stop_moving: () => {
        const _move_orders = move_orders - 1;
        if (_move_orders === 0) {
            return player(
                ship.accelerateTo(point(0, 0)),
                shot,
                shots,
                next_fire,
                is_firing,
                _move_orders
            );
        } else {
            return player(
                ship,
                shot,
                shots,
                next_fire,
                is_firing,
                _move_orders
            );
        }
    },
})