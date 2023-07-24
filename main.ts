function create_top_section () {
    text_sprite_money = create_label("Money: $" + money, 3, 3)
    text_sprite_fossils = create_label("Fossils: " + fossils, 12, 3)
    text_sprite_fossils_per_second = create_label("Fossils/second: " + fossils_per_second, 21, 3)
}
function create_ui () {
    create_top_section()
    create_main_icon()
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
function create_main_icon () {
    sprite_main_icon = sprites.create(assets.image`shovel`, SpriteKind.Player)
    sprite_main_icon.left = 10
    sprite_main_icon.y = 85
}
function create_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor_pixel`, SpriteKind.Player)
    sprite_cursor.setFlag(SpriteFlag.Invisible, true)
    sprite_cursor.setFlag(SpriteFlag.StayInScreen, true)
    sprite_cursor_image = sprites.create(assets.image`cursor_image`, SpriteKind.Player)
    sprite_cursor_image.setFlag(SpriteFlag.Ghost, true)
    sprite_cursor_image.z = 100
}
function click_main_icon () {
    big_icon_until = game.runtime() + 100
    fossils += 1
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor)
    } else {
        controller.moveSprite(sprite_cursor, 0, 0)
    }
}
let big_icon_until = 0
let sprite_cursor_image: Sprite = null
let sprite_cursor: Sprite = null
let sprite_main_icon: Sprite = null
let local_text_sprite: TextSprite = null
let text_sprite_fossils_per_second: TextSprite = null
let text_sprite_fossils: TextSprite = null
let text_sprite_money: TextSprite = null
let fossils_per_second = 0
let fossils = 0
let money = 0
money = 100
fossils = 100
fossils_per_second = 0
scene.setBackgroundColor(14)
scene.setBackgroundImage(assets.image`background`)
create_cursor()
enable_cursor(true)
create_ui()
game.onUpdate(function () {
    sprite_cursor_image.top = sprite_cursor.top
    sprite_cursor_image.left = sprite_cursor.left
    text_sprite_money.setText("Money: $" + money)
    text_sprite_fossils.setText("Fossils: " + fossils)
    text_sprite_fossils_per_second.setText("Fossils/second: " + fossils_per_second)
})
forever(function () {
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
})
