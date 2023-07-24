function create_top_section () {
    text_sprite_money = create_label("", 3, 3)
    text_sprite_fossil_price = create_label("", 12, 3)
    text_sprite_fossils_per_second = create_label("", 21, 3)
}
function create_ui () {
    create_top_section()
    create_main_icon()
    create_towers()
}
function create_label (text: string, top: number, left: number) {
    local_text_sprite = textsprite.create(text, 0, 15)
    local_text_sprite.top = top
    local_text_sprite.left = left
    local_text_sprite.setFlag(SpriteFlag.Ghost, true)
    local_text_sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    return local_text_sprite
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_main_icon.overlapsWith(sprite_cursor)) {
        click_main_icon()
    }
})
function short_scale_divider (num: number) {
    for (let index = 0; index <= short_scale_names.length; index++) {
        if (num < 10 ** ((index + 1) * 3) || index == short_scale_names.length - 1) {
            return 10 ** (index * 3)
        }
    }
    return 0
}
function create_towers () {
    create_tower("Miner", 0.1, 34, 48, assets.image`miner_icon`, assets.image`miner_icon_selected`)
}
function create_main_icon () {
    sprite_main_icon = sprites.create(assets.image`shovel`, SpriteKind.Player)
    sprite_main_icon.left = 10
    sprite_main_icon.y = 85
}
function update_top_bar_text () {
    text_sprite_money.setText("Money: $" + round_to(money / short_scale_divider(money), 2) + short_scale_name(money))
    text_sprite_fossil_price.setText("Price: $" + round_to(fossil_price / short_scale_divider(fossil_price), 2) + short_scale_name(fossil_price))
    text_sprite_fossils_per_second.setText("F/s: " + round_to(fossils_per_second / short_scale_divider(fossils_per_second), 3) + short_scale_name(fossils_per_second))
}
function create_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor_pixel`, SpriteKind.Player)
    sprite_cursor.setFlag(SpriteFlag.Invisible, true)
    sprite_cursor.setFlag(SpriteFlag.StayInScreen, true)
    sprite_cursor_image = sprites.create(assets.image`cursor_image`, SpriteKind.Player)
    sprite_cursor_image.setFlag(SpriteFlag.Ghost, true)
    sprite_cursor_image.z = 100
}
function round_to (num: number, places: number) {
    return Math.round(num * 10 ** places) / 10 ** places
}
function short_scale_name (num: number) {
    for (let index = 0; index <= short_scale_names.length; index++) {
        if (num < 10 ** ((index + 1) * 3) || index == short_scale_names.length - 1) {
            return short_scale_names[index]
        }
    }
    return 1
}
function click_main_icon () {
    big_icon_until = game.runtime() + 100
    money += fossil_price
}
function update_tower_text (text_sprite_in_list: TextSprite[]) {
    local_text_sprite = text_sprite_in_list[0]
    local_text_sprite.setText(" [" + sprites.readDataNumber(local_text_sprite, "count") + "] " + sprites.readDataString(local_text_sprite, "name") + "")
    if (sprite_cursor.overlapsWith(local_text_sprite)) {
        local_text_sprite.setIcon(sprites.readDataImage(local_text_sprite, "icon_hover"))
    } else {
        local_text_sprite.setIcon(sprites.readDataImage(local_text_sprite, "icon"))
    }
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor)
    } else {
        controller.moveSprite(sprite_cursor, 0, 0)
    }
}
function create_tower (name: string, speed: number, top: number, left: number, icon: Image, icon_hover: Image) {
    if (!(sprites_towers)) {
        sprites_towers = []
    }
    local_text_sprite = textsprite.create("", 0, 15)
    local_text_sprite.setFlag(SpriteFlag.Ghost, false)
    local_text_sprite.top = top
    local_text_sprite.left = left
    sprites.setDataString(local_text_sprite, "name", name)
    sprites.setDataNumber(local_text_sprite, "speed", speed)
    sprites.setDataNumber(local_text_sprite, "count", 0)
    sprites.setDataImageValue(local_text_sprite, "icon", icon)
    sprites.setDataImageValue(local_text_sprite, "icon_hover", icon_hover)
    update_tower_text([local_text_sprite])
    sprites_towers.push(local_text_sprite)
}
let sprites_towers: TextSprite[] = []
let big_icon_until = 0
let sprite_cursor_image: Sprite = null
let sprite_cursor: Sprite = null
let sprite_main_icon: Sprite = null
let local_text_sprite: TextSprite = null
let text_sprite_fossils_per_second: TextSprite = null
let text_sprite_fossil_price: TextSprite = null
let text_sprite_money: TextSprite = null
let short_scale_names: string[] = []
let fossils_per_second = 0
let fossil_price = 0
let money = 0
money = 0
fossil_price = 1
fossils_per_second = 0
// https://en.wikipedia.org/wiki/Long_and_short_scales
// https://en.wikipedia.org/wiki/Names_of_large_numbers
short_scale_names = [
"",
"k",
" million",
" billion",
" trillion",
" quadrillion",
" quintillion",
" sextillion",
" septillion",
" octillion",
" nonillion",
" decillion",
" undecillion",
" duodecillion",
" tredecillion",
" quattuordecillion",
" quindecillion",
" sexdecillion",
" septendecillion",
" octodecillion",
" novemdecillion",
" vigintillion"
]
scene.setBackgroundColor(14)
scene.setBackgroundImage(assets.image`background`)
create_cursor()
enable_cursor(true)
create_ui()
game.onUpdate(function () {
    sprite_cursor_image.top = sprite_cursor.top
    sprite_cursor_image.left = sprite_cursor.left
    if (game.runtime() < big_icon_until) {
        sprite_main_icon.sx = 1.5
        sprite_main_icon.sy = 1.5
    } else if (sprite_main_icon.overlapsWith(sprite_cursor)) {
        sprite_main_icon.sx = 1.25
        sprite_main_icon.sy = 1.25
    } else {
        sprite_main_icon.sx = 1
        sprite_main_icon.sy = 1
    }
    update_top_bar_text()
    for (let value of sprites_towers) {
        update_tower_text([value])
    }
})
