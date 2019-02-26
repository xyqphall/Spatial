window.onload = function () {
    var display = document.getElementById("display")
    const DISPLAY_WIDTH = display.clientWidth;

    const bg_bplanet_1 = new Image();
    bg_bplanet_1.src = 'images/BG_BPlanet_1.png'

    const bg_bplanet_2 = new Image();
    bg_bplanet_2.src = 'images/BG_BPlanet_2.png'

    const init_world = {
        time: performance.now(),
        background_planets: [
            {
                position: {x: DISPLAY_WIDTH, y:-200,},
                image: bg_bplanet_1,
            },
            {
                position: {x: DISPLAY_WIDTH / 2, y:200,},
                image: bg_bplanet_2,
            },
        ]
    }

    var ctx = display.getContext("2d")
    function update_background(old_world, next_world) {
        const time_diff = (next_world.time - old_world.time) / 1000
        const background_planets = old_world.background_planets
        return {
            ...next_world,
            background_planets: background_planets.map(planet => ({
                ...planet,
                position: {
                    ...planet.position,
                    x: planet.position.x - 10 * time_diff,
                },
            }))
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
        const background_planets = world.background_planets
        for(let planet of background_planets) {
            ctx.drawImage(planet.image, planet.position.x, planet.position.y)
        }

    }
    function draw(world) {
        ctx.clearRect(0, 0, DISPLAY_WIDTH, display.clientHeight)
        draw_moving_background(world)
    }

    const tick = world => time => {
        const next_world = update(world, time)
        draw(next_world);
        window.requestAnimationFrame(tick(next_world))
    };
    tick(init_world)(performance.now())
}

