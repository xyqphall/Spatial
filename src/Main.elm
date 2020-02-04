module Main exposing (main)

import Browser exposing (element)
import Html.Attributes exposing (style)
import TypedSvg exposing (svg)
import TypedSvg.Attributes exposing (height, viewBox, width)
import TypedSvg.Types exposing (num)


screenWidth =
    1920


screenHeight =
    1200


main =
    element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init () =
    ( (), Cmd.none )


view () =
    svg
        [ width <| num screenWidth
        , height <| num screenHeight
        , viewBox 0 0 screenWidth screenHeight
        , style "background" "url(/images/BG_Main.png)"
        ]
        []


update () () =
    ( (), Cmd.none )


subscriptions () =
    Sub.none
