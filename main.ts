namespace SpriteKind {
    export const Tower = SpriteKind.create()
}
function format_money (money: number) {
    return "$" + round_to(money / short_scale_divider(money), 2) + short_scale_name(money)
}
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
    if (cursor_enabled) {
        if (sprite_main_icon.overlapsWith(sprite_cursor)) {
            click_main_icon()
        } else {
            for (let value of text_sprites_towers) {
                if (sprite_cursor.overlapsWith(value)) {
                    show_tower_menu([value])
                }
            }
        }
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
    text_sprites_towers = []
    create_tower("Assistant", 0.1, 47, 48, assets.image`assistant_icon`, assets.image`assistant_icon_selected`, 10)
    create_tower("Paleontologist", 0.5, 47, 70, assets.image`paleontologist_icon`, assets.image`paleontologist_icon_selected`, 50)
}
function show_tower_menu (tower_in_list: Sprite[]) {
    enable_cursor(false)
    local_sprite = tower_in_list[0]
    menu_items_tower = [miniMenu.createMenuItem("Cancel"), miniMenu.createMenuItem("Buy 1 (" + format_money(calculate_buy_price(tower_in_list, 1)) + ")"), miniMenu.createMenuItem("Buy...")]
    if (sprites.readDataNumber(local_sprite, "count") > 0) {
        menu_items_tower.push(miniMenu.createMenuItem("Sell 1 (" + format_money(calculate_sell_price(tower_in_list, 1)) + ")"))
        menu_items_tower.push(miniMenu.createMenuItem("Sell..."))
    }
    menu_tower = miniMenu.createMenuFromArray(menu_items_tower)
    menu_tower.setTitle("" + sprites.readDataString(local_sprite, "name") + " (" + sprites.readDataNumber(local_sprite, "count") + ")")
    menu_tower.left = 45
    menu_tower.top = 31
    menu_tower.setDimensions(115, 89)
    menu_tower.setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menu_tower.setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, images.colorBlock(15))
    menu_tower.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, images.colorBlock(1))
    menu_tower.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, images.colorBlock(15))
    menu_tower.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, images.colorBlock(14))
    menu_tower.setMenuStyleProperty(miniMenu.MenuStyleProperty.BackgroundColor, images.colorBlock(1))
    menu_tower.onButtonPressed(controller.A, function (selection, selectedIndex) {
        last_menu_index = selectedIndex
        if (selectedIndex == 0) {
            sprites.destroy(menu_tower)
            timer.background(function () {
                pauseUntil(() => !(controller.A.isPressed()))
                enable_cursor(true)
            })
            return
        } else if (selectedIndex == 1) {
            try_buy_tower(tower_in_list[0], 1)
            sprites.destroy(menu_tower)
            show_tower_menu(tower_in_list)
        } else if (selectedIndex == 2) {
            while (true) {
                local_quantity = game.askForNumber("Purchase amount: (Blank to cancel)", 6)
                if (is_nan(local_quantity) || local_quantity == 0) {
                    break;
                }
                if (local_quantity < 0 || Math.round(local_quantity) != local_quantity) {
                    game.showLongText("Quantity must be a natural number!", DialogLayout.Bottom)
                    continue;
                }
                if (try_buy_tower(tower_in_list[0], local_quantity)) {
                    break;
                }
            }
            sprites.destroy(menu_tower)
            show_tower_menu(tower_in_list)
        }
    })
    menu_tower.setButtonEventsEnabled(false)
    for (let index = 0; index < last_menu_index; index++) {
        menu_tower.moveSelection(miniMenu.MoveDirection.Down)
    }
    timer.background(function () {
        pauseUntil(() => !(controller.A.isPressed()))
        menu_tower.setButtonEventsEnabled(true)
    })
}
function create_main_icon () {
    sprite_main_icon = sprites.create(assets.image`shovel`, SpriteKind.Player)
    sprite_main_icon.left = 10
    sprite_main_icon.y = 85
}
function update_top_bar_text () {
    text_sprite_money.setText("Money: " + format_money(money))
    text_sprite_fossil_price.setText("Price: " + format_money(fossil_price))
    text_sprite_fossils_per_second.setText("F/s: " + round_to(fossils_per_second / short_scale_divider(fossils_per_second), 3) + short_scale_name(fossils_per_second))
}
function is_nan (num: number) {
    return num != num
}
function create_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor_pixel`, SpriteKind.Player)
    sprite_cursor.setFlag(SpriteFlag.Invisible, true)
    sprite_cursor.setFlag(SpriteFlag.StayInScreen, true)
    sprite_cursor_image = sprites.create(assets.image`cursor_image`, SpriteKind.Player)
    sprite_cursor_image.setFlag(SpriteFlag.Ghost, true)
    sprite_cursor_image.z = 100
}
function calculate_sell_price (tower_in_list: Sprite[], count: number) {
    local_sprite = tower_in_list[0]
    local_sum = 0
    for (let index = 0; index <= count - 1; index++) {
        local_sum += primitive_tower_price(sprites.readDataNumber(local_sprite, "price"), sprites.readDataNumber(local_sprite, "count") - 1 - index)
    }
    return local_sum
}
function update_tower_button (text_sprite_in_list: Sprite[]) {
    local_sprite = text_sprite_in_list[0]
    local_sprite.sayText(sprites.readDataNumber(local_sprite, "count"))
    if (sprite_cursor.overlapsWith(local_sprite)) {
        local_sprite.setImage(sprites.readDataImage(local_sprite, "icon_hover"))
    } else {
        local_sprite.setImage(sprites.readDataImage(local_sprite, "icon"))
    }
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
function primitive_tower_price (price: number, index: number) {
    return Math.round(price + sprites.readDataNumber(local_sprite, "count") ** 1.25)
}
function click_main_icon () {
    big_icon_until = game.runtime() + 100
    money += fossil_price
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor)
    } else {
        controller.moveSprite(sprite_cursor, 0, 0)
    }
    sprite_cursor_image.setFlag(SpriteFlag.Invisible, !(en))
    cursor_enabled = en
}
function calculate_buy_price (tower_in_list: Sprite[], count: number) {
    local_sprite = tower_in_list[0]
    local_sum = 0
    for (let index = 0; index <= count - 1; index++) {
        local_sum += primitive_tower_price(sprites.readDataNumber(local_sprite, "price"), sprites.readDataNumber(local_sprite, "count") + index)
    }
    return local_sum
}
function create_tower (name: string, speed: number, top: number, left: number, icon: Image, icon_hover: Image, price: number) {
    local_sprite = sprites.create(icon, SpriteKind.Tower)
    local_sprite.setFlag(SpriteFlag.Ghost, false)
    local_sprite.top = top
    local_sprite.left = left
    sprites.setDataString(local_sprite, "name", name)
    sprites.setDataNumber(local_sprite, "speed", speed)
    sprites.setDataNumber(local_sprite, "count", 0)
    sprites.setDataNumber(local_sprite, "price", price)
    sprites.setDataImageValue(local_sprite, "icon", icon)
    sprites.setDataImageValue(local_sprite, "icon_hover", icon_hover)
    update_tower_button([local_sprite])
    text_sprites_towers.push(local_sprite)
}
function try_buy_tower (tower: Sprite, count: number) {
    local_price = calculate_buy_price([tower], count)
    if (money >= local_price) {
        money += local_price * -1
        sprites.changeDataNumberBy(tower, "count", count)
        return true
    } else {
        game.showLongText("Not enough money! (Price of " + format_money(local_price) + ")", DialogLayout.Bottom)
        return false
    }
}
let local_price = 0
let big_icon_until = 0
let local_sum = 0
let sprite_cursor_image: Sprite = null
let local_quantity = 0
let last_menu_index = 0
let menu_tower: miniMenu.MenuSprite = null
let menu_items_tower: miniMenu.MenuItem[] = []
let local_sprite: Sprite = null
let text_sprites_towers: Sprite[] = []
let sprite_cursor: Sprite = null
let sprite_main_icon: Sprite = null
let cursor_enabled = false
let local_text_sprite: TextSprite = null
let text_sprite_fossils_per_second: TextSprite = null
let text_sprite_fossil_price: TextSprite = null
let text_sprite_money: TextSprite = null
let short_scale_names: string[] = []
let fossils_per_second = 0
let fossil_price = 0
let money = 0
stats.turnStats(true)
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
    for (let value of text_sprites_towers) {
        update_tower_button([value])
    }
})
