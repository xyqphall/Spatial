window.onload = function () {
    var planet_img = new Image()
    planet_img.src = 'BG_BPlanet_1.png'

    var display = document.getElementById("display")
    var ctx = display.getContext("2d")

    function draw_moving_background() {
        ctx.drawImage(planet_img,100,200)
    }

    function draw(time) {
        ctx.clearRect(0, 0, display.clientWidth, display.clientWidth)
        draw_moving_background()
        window.requestAnimationFrame(draw)
    }
    draw()
}
