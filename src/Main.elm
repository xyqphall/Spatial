module Main exposing (main)

import Angle
import Browser exposing (element)
import Browser.Events exposing (onAnimationFrameDelta, onKeyDown, onKeyUp)
import Html exposing (Html)
import Html.Attributes exposing (style)
import Json.Decode as Decode
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


type alias KeyState =
    List Key


type alias World =
    { player : Sprite
    , keyState : KeyState
    , enemies : List Sprite
    , enemiesProjectiles : List Sprite
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
            , keyState = []
            , enemies = []
            , enemiesProjectiles = []
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


update : Msg -> World -> ( World, Cmd Msg )
update msg world =
    case msg of
        TimePassed delta ->
            updateOnTimePassed delta world

        Key keyAction ->
            updateOnKeyAction keyAction world


updateOnTimePassed : Float -> World -> ( World, Cmd msg )
updateOnTimePassed delta world =
    ( world, Cmd.none )


updateOnKeyAction keyAction world =
    let
        nextKeyState =
            case keyAction of
                Press k ->
                    k :: List.filter (\k2 -> k2 /= k) world.keyState

                Release k ->
                    List.filter (\k2 -> k2 /= k) world.keyState
    in
    ( { world | keyState = nextKeyState }, Cmd.none )


type Msg
    = TimePassed Float
    | Key KeyAction


subscriptions : World -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Sub.map Key <| onKeyDown (Decode.map Press keyDecoder)
        , Sub.map Key <| onKeyUp (Decode.map Release keyDecoder)
        , onAnimationFrameDelta TimePassed
        ]


type Key
    = Left
    | Right
    | Up
    | Down
    | Other


type KeyAction
    = Press Key
    | Release Key


keyDecoder : Decode.Decoder Key
keyDecoder =
    Decode.map toDirection (Decode.field "key" Decode.string)


toDirection : String -> Key
toDirection string =
    case string of
        "ArrowLeft" ->
            Left

        "ArrowRight" ->
            Right

        "ArrowUp" ->
            Up

        "ArrowDown" ->
            Down

        _ ->
            Other
