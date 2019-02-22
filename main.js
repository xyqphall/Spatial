window.onload = function () {
    var planet_img = new Image()
    planet_img.src = 'BG_BPlanet_1.png'
    planet_img.onload = draw_moving_background
    var display = document.getElementById("display")
    var ctx = display.getContext("2d")
    draw_moving_background() 
    function draw_moving_background() {
        ctx.drawImage(planet_img,100,200)
    }
}
