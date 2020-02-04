module Main exposing (main)

import Angle
import Browser exposing (element)
import Html exposing (Html)
import Html.Attributes exposing (style)
import Point2d exposing (Point2d)
import Quantity exposing (Unitless, float)
import Rectangle2d exposing (Rectangle2d)
import TypedSvg exposing (image, svg)
import TypedSvg.Attributes exposing (height, transform, viewBox, width, xlinkHref)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (Transform(..), num)
import Vector2d exposing (Vector2d)


screenWidth =
    1920


screenHeight =
    1200


playerWidth =
    308


playerHeight =
    200


main =
    element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Sprite =
    { imageUrl : String
    , imageDimensions : Vector2d Unitless ()
    , rectangle : Rectangle2d Unitless ()
    }


type alias World =
    { player : Sprite
    , enemies : List Sprite
    , enemieProjectiles : List Sprite
    , playerProjectiles : List Sprite
    }


spawn : String -> Float -> Float -> Point2d Unitless () -> Sprite
spawn imageUrl spriteWidth spriteHeight center =
    let
        imageDimensions : Vector2d Unitless ()
        imageDimensions =
            Vector2d.unitless spriteWidth spriteHeight

        rectangle : Rectangle2d Unitless ()
        rectangle =
            Rectangle2d.withDimensions
                ( float spriteWidth, float spriteHeight )
                (Angle.degrees 0)
                center
    in
    { imageUrl = imageUrl
    , imageDimensions = imageDimensions
    , rectangle = rectangle
    }


spawnShip =
    spawn "/images/ship.png" playerWidth playerHeight


init : () -> ( World, Cmd msg )
init () =
    let
        player : Sprite
        player =
            spawnShip <|
                Point2d.unitless
                    (playerWidth / 2)
                    (screenHeight / 2)

        world : World
        world =
            { player = player
            , enemies = []
            , enemieProjectiles = []
            , playerProjectiles = []
            }
    in
    ( world, Cmd.none )


view : World -> Html msg
view { player } =
    svg
        [ width <| num screenWidth
        , height <| num screenHeight
        , viewBox 0 0 screenWidth screenHeight
        , style "background" "url(/images/BG_Main.png)"
        ]
        [ renderSprite player ]


renderSprite : Sprite -> Svg msg
renderSprite { imageUrl, rectangle, imageDimensions } =
    let
        imageWidth =
            Quantity.toFloat <| Vector2d.xComponent imageDimensions

        imageHeight =
            Quantity.toFloat <| Vector2d.yComponent imageDimensions

        centerPoint =
            Rectangle2d.centerPoint rectangle

        transX =
            Quantity.toFloat <| Point2d.xCoordinate centerPoint

        transY =
            Quantity.toFloat <| Point2d.yCoordinate centerPoint
    in
    image
        [ xlinkHref imageUrl
        , width <| num <| imageWidth
        , height <| num <| imageHeight
        , transform <|
            [ Translate
                (transX - imageWidth / 2)
                (transY - imageHeight / 2)
            ]
        ]
        []


update : msg -> World -> ( World, Cmd msg )
update _ world =
    ( world, Cmd.none )


subscriptions : World -> Sub msg
subscriptions _ =
    Sub.none
