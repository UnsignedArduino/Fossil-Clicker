function create_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor_pixel`, SpriteKind.Player)
    sprite_cursor.setFlag(SpriteFlag.Invisible, true)
    sprite_cursor.setFlag(SpriteFlag.StayInScreen, true)
    sprite_cursor_image = sprites.create(assets.image`cursor_image`, SpriteKind.Player)
    sprite_cursor_image.setFlag(SpriteFlag.Ghost, true)
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor)
    } else {
        controller.moveSprite(sprite_cursor, 0, 0)
    }
}
let sprite_cursor_image: Sprite = null
let sprite_cursor: Sprite = null
scene.setBackgroundColor(14)
create_cursor()
enable_cursor(true)
game.onUpdate(function () {
    sprite_cursor_image.top = sprite_cursor.top
    sprite_cursor_image.left = sprite_cursor.left
})
