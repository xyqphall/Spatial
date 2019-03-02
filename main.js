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
    const ship = loadImage('images/Ship.png')

    const big_planet_speed = {x: -20, y: 0}
    const big_planets = [
        {
            speed: big_planet_speed,
            position: {x: -200, y: 400,},
            image: bg_bplanet_3,
        },
        {
            speed: big_planet_speed,
            position: {x: DISPLAY_WIDTH / 2, y:200,},
            image: bg_bplanet_2,
        },
        {
            speed: big_planet_speed,
            position: {x: DISPLAY_WIDTH, y:-200,},
            image: bg_bplanet_1,
        },
        {
            speed: big_planet_speed,
            position: {x: DISPLAY_WIDTH * 1.5, y:200,},
            image: bg_bplanet_4,
        },
    ]
    const planets = [
        {
            speed: {x: -10, y: 0},
            position: {x: DISPLAY_WIDTH / 2, y: 200,},
            image: bg_splanet_1,
        },
        {
            speed: {x: -10, y: 0},
            position: {x: DISPLAY_WIDTH / 4, y: 400,},
            image: bg_splanet_2,
        },
        {
            speed: {x: -10, y: 0},
            position: {x: DISPLAY_WIDTH * 0.75, y: 600,},
            image: bg_splanet_1,
        },
        {
            speed: {x: -10, y: 0},
            position: {x: DISPLAY_WIDTH, y: 200,},
            image: bg_splanet_2,
        },
    ]
    const clouds = [
        {
            speed: {x: -40, y: 0,},
            position: {
                x: DISPLAY_WIDTH,
                y: DISPLAY_HEIGHT / 4,
            },
            image: bg_cloud_1,
        },
        {
            speed: {x: -40, y: 0,},
            position: {
                x: 0,
                y: 0,
            },
            image: bg_cloud_2,
        },
        {
            speed: {x: -40, y: 0,},
            position: {
                x: DISPLAY_WIDTH / 4,
                y: DISPLAY_HEIGHT / 2,
            },
            image: bg_cloud_3,
        },
    ]
    const init_world = {
        time: performance.now(),
        background: {
            big_planets,
            planets,
            clouds,
        },
        player: {
            position: {
                x: 0,
                y: DISPLAY_HEIGHT / 2,
            },
            image: ship,
        }
    }

    const ctx = display.getContext("2d")

    function update_background(old_world, next_world) {
        const time_delta = (next_world.time - old_world.time) / 1000
        const background = old_world.background
        const move_delta = move(time_delta)
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
    function update(old_world, time) {
        const next_world = update_time(old_world, time)
        return update_background(old_world, next_world)

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
        draw_sprite(world.player)
    }

    function draw(world) {
        ctx.clearRect(0, 0, DISPLAY_WIDTH, display.clientHeight)
        draw_moving_background(world)
        draw_player(world)
    }

    const tick = world => time => {
        const next_world = update(world, time)
        draw(next_world);
        window.requestAnimationFrame(tick(next_world))
    };
    tick(init_world)(performance.now())
}

