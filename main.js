function loadImage(src) {
    const image = new Image();
    image.src = src
    return image
}

window.onload = function () {
    const display = document.getElementById("display")
    const DISPLAY_WIDTH = display.clientWidth;
    const DISPLAY_HEIGHT = display.clientHeight;

    const bg_bplanet_1 = loadImage('images/BG_BPlanet_1.png')
    const bg_bplanet_2 = loadImage('images/BG_BPlanet_2.png')
    const bg_bplanet_3 = loadImage('images/BG_BPlanet_3.png')
    const bg_bplanet_4 = loadImage('images/BG_BPlanet_4.png')
    const bg_splanet_1 = loadImage('images/BG_SPlanet_1.png')
    const bg_splanet_2 = loadImage('images/BG_SPlanet_2.png')
    const bg_cloud_1 = loadImage('images/BG_Cloud_1.png')
    const bg_cloud_2 = loadImage('images/BG_Cloud_2.png')
    const bg_cloud_3 = loadImage('images/BG_Cloud_3.png')
    const ship_image = loadImage('images/Ship.png')
    const projectile_default = loadImage('images/Projectile_Default.png')

    const big_planet_velocity = point(-20, 0)
    const big_planets = [
        sprite(point(-200, 400,), big_planet_velocity, bg_bplanet_3),
        sprite(point(DISPLAY_WIDTH / 2, 200,), big_planet_velocity, bg_bplanet_2),
        sprite(point(DISPLAY_WIDTH, -200,), big_planet_velocity, bg_bplanet_1),
        sprite(point(DISPLAY_WIDTH * 1.5, 200,), big_planet_velocity, bg_bplanet_4),
    ]
    const planets = [
        sprite(point(DISPLAY_WIDTH / 2, 200,), point(-10, 0), bg_splanet_1),
        sprite(point(DISPLAY_WIDTH / 4, 400,), point(-10, 0), bg_splanet_2),
        sprite(point(DISPLAY_WIDTH * 0.75, 600,), point(-10, 0), bg_splanet_1),
        sprite(point(DISPLAY_WIDTH, 200,), point(-10, 0), bg_splanet_2),
    ]
    const clouds = [
        sprite(point(DISPLAY_WIDTH, DISPLAY_HEIGHT / 4,), point(-40, 0,), bg_cloud_1),
        sprite(point(0, 0,), point(-40, 0,), bg_cloud_2),
        sprite(point(DISPLAY_WIDTH / 4, DISPLAY_HEIGHT / 2,), point(-40, 0,), bg_cloud_3),
    ]
    const DEFAULT_PROJECTILE = sprite(
        point(0, 0),
        point(DISPLAY_WIDTH / 2, 0),
        projectile_default
    )

    const ship_sprite = sprite(
        point(0, DISPLAY_HEIGHT / 2),
        point(0, 0),
        ship_image
    );
    const init_world = {
        time: performance.now(),
        background: {
            big_planets,
            planets,
            clouds,
        },
        player: player(
            ship_sprite,
            DEFAULT_PROJECTILE,
            [],
            0,
            false
        )
    }

    const ctx = display.getContext("2d")

    function update_background(old_world, next_world) {
        const time_delta = (next_world.time - old_world.time) / 1000
        const move_delta = move(time_delta)
        const background = old_world.background
        return {
            ...next_world,
            background: {
                ...background,
                clouds: background.clouds.map(move_delta),
                big_planets: background.big_planets.map(move_delta),
                planets: background.planets.map(move_delta),
            }
        }
    }
    function update_time(old_world, time) {
        return {...old_world, time}

    }
    const new_top_shot = ship => DEFAULT_PROJECTILE.teleport(
        point(ship.position.x + 120, ship.position.y - 10,)
    )

    const new_bottom_shot = ship => DEFAULT_PROJECTILE.teleport(
        point(ship.position.x + 120, ship.position.y + ship.image.height - 35)
    )

    function player_fire(new_world) {
        return {
            ...new_world,
            player: new_world.player.fire()
        }
    }

    function handle_player_fire(new_world) {
        if (new_world.player.is_firing) {
            if (new_world.player.next_fire <= new_world.time) {
                return player_fire(new_world)
            }
        }
        return new_world
    }

    function update_player(old_world, new_world) {
        const time_delta = (new_world.time - old_world.time) / 1000
        const move_delta = move(time_delta)
        const world_with_handled_player_fire = handle_player_fire(new_world)
        const _player = world_with_handled_player_fire.player;
        const ship = move_delta(_player.ship);
        const shots = _player.shots.map(move_delta);
        return {
            ...world_with_handled_player_fire,
            player: player(ship, _player.shot, shots, _player.next_fire, _player.is_firing)
        }
    }

    function update(old_world, time) {
        const world_1 = update_time(old_world, time)
        const world_2 = update_background(old_world, world_1)
        return update_player(old_world, world_2)

    }
    function draw_moving_background(world) {
        world.background.planets.forEach(draw_sprite)
        world.background.big_planets.forEach(draw_sprite)
        world.background.clouds.forEach(draw_sprite)
    }

    function draw_sprite(sprite) {
        ctx.drawImage(sprite.image, sprite.position.x, sprite.position.y)
    }

    function draw_player(world) {
        world.player.shots.forEach(draw_sprite)
        draw_sprite(world.player.ship)
    }

    function draw(world) {
        ctx.clearRect(0, 0, DISPLAY_WIDTH, display.clientHeight)
        draw_moving_background(world)
        draw_player(world)
    }

    function handle_input(world, input) {
        const _player = world.player;
        if (input === "FIRE-ON") {
            return {
                ...world,
                player: _player.start_firing(world.time)
            }
        } else if (input === "FIRE-OFF") {
            return {
                ...world,
                player: _player.stop_firing()
            }
        } else if (input === "MOVE-NORTH") {
            let ship = _player.ship.accelerateTo(point(0, -DISPLAY_HEIGHT/2));
            return {
                ...world,
                player: player(ship, _player.shot, _player.shots, _player.next_fire, _player.is_firing)
            }
        } else if (input === "MOVE-SOUTH") {
            let ship = _player.ship.accelerateTo(point(0, DISPLAY_HEIGHT/2));
            return {
                ...world,
                player: player(ship, _player.shot, _player.shots, _player.next_fire, _player.is_firing)
            }
        } else if (input === "MOVE-EAST") {
            let ship = _player.ship.accelerateTo(point(DISPLAY_HEIGHT/2, 0));
            return {
                ...world,
                player: player(ship, _player.shot, _player.shots, _player.next_fire, _player.is_firing)
            }
        } else if (input === "MOVE-WEST") {
            let ship = _player.ship.accelerateTo(point(-DISPLAY_HEIGHT / 2, 0));
            return {
                ...world,
                player: player(ship, _player.shot, _player.shots, _player.next_fire, _player.is_firing)
            }
        } else if (input === "STOP-MOVE") {
            let ship = _player.ship.accelerateTo(point(0, 0));
            return {
                ...world,
                player: player(ship, _player.shot, _player.shots, _player.next_fire, _player.is_firing)
            }
        }
        return world
    }

    const tick = world => time => {
        const reduced_world = input_queue.reduce(handle_input, world)
        input_queue = [];
        const next_world = update(reduced_world, time)
        draw(next_world);
        window.requestAnimationFrame(tick(next_world))
    };
    let input_queue = []

    document.addEventListener("keydown", event => {
        if (event.code === "Space") {
            input_queue.push("FIRE-ON")
        } else if (event.code === "ArrowUp") {
            input_queue.push("MOVE-NORTH")
        } else if (event.code === "ArrowDown") {
            input_queue.push("MOVE-SOUTH")
        } else if (event.code === "ArrowRight") {
            input_queue.push("MOVE-EAST")
        } else if (event.code === "ArrowLeft") {
            input_queue.push("MOVE-WEST")
        }
    })
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
    document.addEventListener("keyup", event => {
        if (event.code === "Space") {
            input_queue.push("FIRE-OFF")
        } else if (arrowKeys.indexOf(event.code) !== -1) {
            input_queue.push("STOP-MOVE")
        }
    })

    tick(init_world)(performance.now())
}

