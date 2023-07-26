namespace SpriteKind {
    export const Tower = SpriteKind.create()
}
/**
 * "Efficiency": (delta F/s / price)
 * 
 * Assistant: 0.01
 * 
 * Paleontologist: 0.01
 * 
 * Mining team: 0.025
 * 
 * Excavator: 0.05
 */
function create_upgrades () {
    upgrades = [
    "Slightly bigger fossils | Slightly bigger fossils yield double the amount. | $50 | price*=2",
    "Somewhat bigger fossils | Somewhat bigger fossils yield double the amount. | $100 | price*=2",
    "Assistant raises | Your assistants work twice as hard. | $75 | assistant*=2",
    "Assistant bonuses | Bonuses encourage the assistants to work twice as hard. | $150 | assistant*=2",
    "Manual cleaning | Fossils manually clicked earn double. | $150 | click*=2",
    "Coffee and tea stations | Caffeine increases assistant speed by 50%. | $100 | assistant*=1.5",
    "Upgraded tools | Paleontologist's speed increased by 25%. | $200 | paleontologist*=1.25",
    "Assistant to the assistant | The assistants offload the even more boring work to their assistants, doubling their speed. | $300 | assistant*=2",
    "Bigger fossils | Bigger fossils yield double the amount. | $400 | price*=2",
    "Paleontology PhD | Fossils manually clicked earn quadruple. | $800 | click*=4",
    "Assistant to the paleontologist | Paleontologist's speed increased by 50%. | $400 | paleontologist*=1.5",
    "Even bigger fossils | Even bigger fossils yield quadruple the amount. | $800 | price*=4",
    "Verification | Fossils manually clicked are verified and earn quadruple. | $1600 | click*=4",
    "Haste I | Mining team speed increased by 20%. | $500 | mining_team*=1.2",
    "Haste II | Mining team speed increased by 20%. | $750 | mining_team*=1.2",
    "Iron tools | Mining team speed increased by 50%. | $1000 | mining_team*=1.5",
    "Enhanced hydraulics | Excavator speed increased by 50%. | $3000 | excavator*=1.5",
    "Overvolt | Excavators are overvolted; speed increased by 25%. | $2500 | excavator*=1.5",
    "Upgraded cooling | Excavator speed increased by 25%. | $2500 | excavator*=1.5",
    "Round-the-clock shifts | Excavators run 24/7; speed tripled. | $6000 | excavator*=3"
    ]
    sprite_upgrades_button = sprites.create(assets.image`upgrades_button`, SpriteKind.Player)
    sprite_upgrades_button.left = 48
    sprite_upgrades_button.bottom = 118
}
function format_money (money: number) {
    return "$" + round_to(money / short_scale_divider(money), 2) + short_scale_name(money)
}
function show_upgrades_menu () {
    enable_cursor(false)
    menu_items_upgrades = [miniMenu.createMenuItem("Cancel")]
    menu_upgrades = miniMenu.createMenuFromArray(menu_items_upgrades)
    menu_upgrades.setTitle("Upgrades")
    menu_upgrades.left = 45
    menu_upgrades.top = 31
    menu_upgrades.setDimensions(115, 89)
    menu_upgrades.setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menu_upgrades.setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, images.colorBlock(15))
    menu_upgrades.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, images.colorBlock(1))
    menu_upgrades.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, images.colorBlock(15))
    menu_upgrades.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, images.colorBlock(14))
    menu_upgrades.setMenuStyleProperty(miniMenu.MenuStyleProperty.BackgroundColor, images.colorBlock(1))
    menu_upgrades.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selection.includes("Cancel")) {
            sprites.destroy(menu_upgrades)
            timer.background(function () {
                pauseUntil(() => !(controller.A.isPressed()))
                enable_cursor(true)
            })
            return
        }
    })
    menu_upgrades.setButtonEventsEnabled(false)
    timer.background(function () {
        pauseUntil(() => !(controller.A.isPressed()))
        menu_upgrades.setButtonEventsEnabled(true)
    })
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
    create_upgrades()
}
function create_label (text: string, top: number, left: number) {
    local_text_sprite = textsprite.create(text, 0, 15)
    local_text_sprite.top = top
    local_text_sprite.left = left
    local_text_sprite.setFlag(SpriteFlag.Ghost, !(DEBUG))
    local_text_sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    return local_text_sprite
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (cursor_enabled) {
        if (sprite_cursor.overlapsWith(sprite_main_icon)) {
            click_main_icon()
        } else if (sprite_cursor.overlapsWith(sprite_upgrades_button)) {
            show_upgrades_menu()
        } else {
            for (let value of sprites_towers) {
                if (sprite_cursor.overlapsWith(value)) {
                    show_tower_menu([value])
                }
            }
        }
    }
})
function try_sell_tower (tower: Sprite, count: number) {
    if (sprites.readDataNumber(tower, "count") >= count) {
        money += calculate_sell_price([tower], count)
        sprites.changeDataNumberBy(tower, "count", count * -1)
        return true
    } else {
        game.showLongText("Not enough towers!", DialogLayout.Bottom)
        return false
    }
}
function short_scale_divider (num: number) {
    for (let index = 0; index <= short_scale_names.length; index++) {
        if (num < 10 ** ((index + 1) * 3) || index == short_scale_names.length - 1) {
            return 10 ** (index * 3)
        }
    }
    return 0
}
function create_towers () {
    sprites_towers = []
    create_tower("Assistant", 0.1, 47, 48, assets.image`assistant_icon`, assets.image`assistant_icon_selected`, 10)
    create_tower("Paleontologist", 0.5, 47, 70, assets.image`paleontologist_icon`, assets.image`paleontologist_icon_selected`, 50)
    create_tower("Mining team", 5, 47, 92, assets.image`mining_team_icon`, assets.image`mining_team_icon_selected`, 200)
    create_tower("Excavator", 50, 47, 114, assets.image`excavator_icon`, assets.image`excavator_icon_selected`, 1000)
}
function show_tower_menu (tower_in_list: Sprite[]) {
    enable_cursor(false)
    local_sprite = tower_in_list[0]
    menu_items_tower = [
    miniMenu.createMenuItem("Cancel"),
    miniMenu.createMenuItem("Buy 1 (" + format_money(calculate_buy_price(tower_in_list, 1)) + ")"),
    miniMenu.createMenuItem("Buy..."),
    miniMenu.createMenuItem("Buy max")
    ]
    if (sprites.readDataNumber(local_sprite, "count") > 0) {
        menu_items_tower.push(miniMenu.createMenuItem("Sell 1 (" + format_money(calculate_sell_price(tower_in_list, 1)) + ")"))
        menu_items_tower.push(miniMenu.createMenuItem("Sell..."))
        menu_items_tower.push(miniMenu.createMenuItem("Sell all"))
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
        if (selection.includes("Cancel")) {
            sprites.destroy(menu_tower)
            timer.background(function () {
                pauseUntil(() => !(controller.A.isPressed()))
                enable_cursor(true)
            })
            return
        } else if (selection.includes("Buy 1")) {
            try_buy_tower(tower_in_list[0], 1, true)
        } else if (selection.includes("Buy...")) {
            while (true) {
                local_quantity = game.askForNumber("Purchase amount: (Blank to cancel)", 6)
                if (is_nan(local_quantity) || local_quantity == 0) {
                    break;
                }
                if (local_quantity < 0 || Math.round(local_quantity) != local_quantity) {
                    game.showLongText("Quantity must be a natural number!", DialogLayout.Bottom)
                    continue;
                }
                if (try_buy_tower(tower_in_list[0], local_quantity, true)) {
                    break;
                }
            }
        } else if (selection.includes("Buy max")) {
            menu_tower.setButtonEventsEnabled(false)
            local_buy = 1
            local_started = sprites.readDataNumber(tower_in_list[0], "count")
            while (try_buy_tower(tower_in_list[0], local_buy, false)) {
                local_buy += 1
            }
            for (let index = 0; index < local_buy; index++) {
                local_buy += -1
                if (try_buy_tower(tower_in_list[0], local_buy, false)) {
                    break;
                }
            }
            game.showLongText("Bought " + (sprites.readDataNumber(tower_in_list[0], "count") - local_started) + " towers.", DialogLayout.Bottom)
        } else if (selection.includes("Sell 1")) {
            try_sell_tower(tower_in_list[0], 1)
        } else if (selection.includes("Sell...")) {
            while (true) {
                local_quantity = game.askForNumber("Sell amount: (Blank to cancel)", 6)
                if (is_nan(local_quantity) || local_quantity == 0) {
                    break;
                }
                if (local_quantity < 0 || Math.round(local_quantity) != local_quantity) {
                    game.showLongText("Quantity must be a natural number!", DialogLayout.Bottom)
                    continue;
                }
                if (try_sell_tower(tower_in_list[0], local_quantity)) {
                    break;
                }
            }
        } else if (selection.includes("Sell all")) {
            local_started = sprites.readDataNumber(tower_in_list[0], "count")
            try_sell_tower(tower_in_list[0], sprites.readDataNumber(tower_in_list[0], "count"))
            game.showLongText("Sold " + local_started + " towers.", DialogLayout.Bottom)
        }
        sprites.destroy(menu_tower)
        show_tower_menu(tower_in_list)
    })
    menu_tower.setButtonEventsEnabled(false)
    if (last_menu_index < menu_items_tower.length) {
        for (let index = 0; index < last_menu_index; index++) {
            menu_tower.moveSelection(miniMenu.MoveDirection.Down)
        }
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
function recalculate_fossils_per_sec () {
    fossils_per_second = 0
    for (let value of sprites_towers) {
        fossils_per_second += sprites.readDataNumber(value, "count") * sprites.readDataNumber(value, "speed")
    }
}
function primitive_tower_price (price: number, index: number) {
    return Math.round(price + index ** 1.25)
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
    sprites_towers.push(local_sprite)
}
function try_buy_tower (tower: Sprite, count: number, show_msgs: boolean) {
    local_price = calculate_buy_price([tower], count)
    if (money >= local_price) {
        money += local_price * -1
        sprites.changeDataNumberBy(tower, "count", count)
        return true
    } else {
        if (show_msgs) {
            game.showLongText("Not enough money! (Price of " + format_money(local_price) + ")", DialogLayout.Bottom)
        }
        return false
    }
}
let last_money_update = 0
let local_price = 0
let big_icon_until = 0
let local_sum = 0
let sprite_cursor_image: Sprite = null
let local_started = 0
let local_buy = 0
let local_quantity = 0
let last_menu_index = 0
let menu_tower: miniMenu.MenuSprite = null
let menu_items_tower: miniMenu.MenuItem[] = []
let local_sprite: Sprite = null
let sprites_towers: Sprite[] = []
let sprite_main_icon: Sprite = null
let sprite_cursor: Sprite = null
let cursor_enabled = false
let local_text_sprite: TextSprite = null
let text_sprite_fossils_per_second: TextSprite = null
let text_sprite_fossil_price: TextSprite = null
let text_sprite_money: TextSprite = null
let menu_upgrades: miniMenu.MenuSprite = null
let menu_items_upgrades: miniMenu.MenuItem[] = []
let sprite_upgrades_button: Sprite = null
let upgrades: string[] = []
let short_scale_names: string[] = []
let fossils_per_second = 0
let fossil_price = 0
let money = 0
let DEBUG = false
DEBUG = true
stats.turnStats(true)
money = 0
if (DEBUG) {
    money = 10000000000
}
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
if (DEBUG) {
    scene.setBackgroundColor(2)
    scene.backgroundImage().replace(1, 2)
}
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
    recalculate_fossils_per_sec()
    money += fossils_per_second * ((game.runtime() - last_money_update) / 1000) * fossil_price
    last_money_update = game.runtime()
    update_top_bar_text()
    for (let value of sprites_towers) {
        update_tower_button([value])
    }
    if (sprite_cursor.overlapsWith(sprite_upgrades_button)) {
        sprite_upgrades_button.setImage(assets.image`upgrades_button_selected`)
    } else {
        sprite_upgrades_button.setImage(assets.image`upgrades_button`)
    }
})
