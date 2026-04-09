# ❄️ Multi Air Conditioner Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
![version](https://img.shields.io/badge/version-1.7-blue)
![HA](https://img.shields.io/badge/Home%20Assistant-2023.1+-green)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

> 🇻🇳 **Phiên bản tiếng Việt:** [README_vi.md](README_vi.md)

A custom Home Assistant Lovelace card for multi-room air conditioner control — live temperature dial, fan & swing controls, per-room status tabs, eco mode, timer scheduling, environment sensors, and a full visual editor with up to 8 rooms.

**No extra plugins required. Works standalone, fully configurable through the built-in UI editor.**

---

## 📸 Preview

![Multi AC Card Preview](assets/preview.png)

---

## 🎛️ Visual Config Editor

![Multi AC Card Editor](assets/editor-preview.png)

---

## ✨ Features (v1.5)

### 🎨 Display & Interface
- ❄️ **Temperature dial** — animated arc gauge with dynamic colour glow: blue (cold) → cyan → green → orange → red (hot)
- 🔵 **Set-point inner ring** — a second thin arc inside the dial shows the target temperature, coloured by the active HVAC mode
- 🏠 **Room photo panel** — per-room image (default or custom URL) with live ON/OFF overlay badge and colour-matched temperature + humidity badge
- 📊 **Status block** — running state, air quality indicator, PM2.5 ring, outdoor temperature, humidity and power consumption
- 🕐 **Live clock** — real-time date and time display with greeting by time of day
- 🌿 **Eco mode badge** — toggle eco/preset mode directly from the card header

### 🖥️ Three View Modes
- **Full** — complete two-column layout with all panels visible (default)
- **Lite** — compact two-column layout, room photo hidden, ideal for smaller dashboards or mobile
- **Super Lite** ⚡ — ultra-compact single-column layout featuring a large dial, temperature control, HVAC mode selector and room selector; perfect for widgets, sidebars or very narrow spaces

### ✨ Super Lite Popup Style
When using **Super Lite** mode, the HVAC mode and room selectors support three interaction styles — configurable in the editor:
- **Normal** — native `<select>` dropdown (most compatible, consistent on iOS/Android)
- **Effect** — custom glass-style popup with spring open/close animation
- **Wave** — same glass popup with a wave-ripple entrance animation

### 🎛️ Super Lite Layout
In **Super Lite** mode the temperature control row now has dedicated **Fan speed** and **Airflow** shortcut buttons:
- **Fan speed button** — sits to the left of the `−` (decrease) button; tap to cycle fan levels
- **Airflow button** — sits to the right of the `+` (increase) button; tap to cycle swing modes
- **Mode and Room selectors** scale to full card width for maximum legibility on narrow screens

### 🎛️ Per-element Visibility Toggles
Every section of the card can be individually shown or hidden directly from the editor:
- Greeting row, HVAC mode buttons (Cool / Heat / Dry / Fan individually), fan speed panel, airflow panel, Eco/Fav/Clean bar, status & sensor block, outdoor temperature, humidity, power, timer button, turn-all-off button
- **Room Temp / Humidity** (Super Lite) — toggle to show the selected room's temperature and humidity in the Super Lite header instead of outdoor sensor data
- **Room Power** (Super Lite) — toggle to show the selected room's power consumption next to humidity in the header
- **Fan speed / Airflow buttons** (Super Lite) — show or hide individually

### ❄️ Multi-Room Control (up to 8 rooms)
- **Room selector tabs** (Full / Lite) — shows MDI icon, name, current temperature and ON/OFF badge; always displays 4 rows, scrollable for more
- **Room selector dropdown** (Super Lite) — compact dropdown / glass popup listing all rooms with live temperature and ON/OFF badge; icons render as `ha-icon` MDI icons
- **Per-room HVAC control** — Cool / Heat / Dry / Fan Only mode buttons with colour-coded active state
- **Temperature set** — `+` / `−` buttons to adjust set-point
- **Fan speed** — cycle through Auto / Low / Medium / High with animated fan blade SVG and bar chart
- **Swing direction** — cycles only through modes actually supported by the entity (reads `swing_modes` attribute)
- **Custom room image** — each room supports a custom photo URL, falling back to built-in defaults

### 🌡️ Per-Room Environment Sensors
Each room supports dedicated temperature, humidity and **power** sensors independent of the AC entity:
- `entities[n].temp_entity` — override the room's displayed temperature (useful when the AC reports no `current_temperature`)
- `entities[n].humidity_entity` — override the room's displayed humidity
- `entities[n].power_entity` — **new** per-room power consumption sensor; automatically switches when changing rooms in all three view modes
- Displayed in the room photo badge (Full/Lite) and in the Super Lite header

### ⚡ Power Consumption — Per-Room & Unit Toggle
- Each room has its own power entity (`entities[n].power_entity`) — displayed value updates automatically when switching rooms in Full, Lite and Super Lite modes
- **Unit selector** in the editor: choose **kW** (sensor value used as-is) or **W** (auto-converts — values ≥ 1000 W display as kW)
- Super Lite: power value shown inline next to humidity in the top-left header area
- `show_sl_room_power` toggle to enable/disable this indicator

### 🎨 MDI Room Icons
Room icons now use the **Material Design Icons** system (`mdi:*`) instead of emoji, matching the native Home Assistant icon style:
- Default icons: `mdi:sofa`, `mdi:bed`, `mdi:silverware-fork-knife`, `mdi:briefcase`, `mdi:shower`, `mdi:teddy-bear`, `mdi:dumbbell`, `mdi:archive`
- Rendered as `<ha-icon>` throughout the card — tabs (Full/Lite), button label (Super Lite), popup items (Effect & Wave), and native select (label-only)
- Users can enter any `mdi:icon-name` in the **MDI Icon** field of the visual editor; emoji still accepted as fallback

### 🌿 Eco & Quick Actions
- **Eco toggle** — activates eco/preset mode on the selected room's AC unit
- **Quick-action chips** — Eco, Fav, Clean shortcut buttons (Full mode only)

### ⏱️ Timer Scheduling
- **Per-room timer** — 8 preset durations: `30m · 1h · 1.5h · 2h · 3h · 4h · 6h · 8h` + free custom-minute input
- **Schedule on or off** — choose whether the timer turns the AC on or off
- **Countdown display** — live countdown shown on the timer button
- **Persistent timers** — state saved to localStorage, restored after page reload

### 🌐 Multi-language Support (11 languages)
- 🇻🇳 Tiếng Việt / 🇬🇧 English / 🇩🇪 Deutsch / 🇫🇷 Français / 🇳🇱 Nederlands
- 🇵🇱 Polski / 🇸🇪 Svenska / 🇭🇺 Magyar / 🇨🇿 Čeština / 🇮🇹 Italiano / 🇵🇹 Português
- **Real country flag images** in language selector (via flagcdn.com)

### 🎨 Visual Customisation
- **16 background gradient presets** — Default, Night, Sunset, Forest, Aurora, Desert, Ocean, Cherry, Volcano, Galaxy, Ice, Olive, Slate, Rose, Teal, Custom
- **3 colour pickers** — Accent, Text, Background custom colours

---

## 📦 Installation

### Option 1 — HACS (recommended)

**Step 1:** Add Custom Repository to HACS:

[![Open HACS Repository](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=doanlong1412&repository=multi-air-conditioner-card&category=plugin)

> If the button doesn't work, add manually:
> **HACS → Frontend → ⋮ → Custom repositories**
> → URL: `https://github.com/doanlong1412/multi-air-conditioner-card` → Type: **Dashboard** → Add

**Step 2:** Search for **Multi Air Conditioner Card** → **Install**

**Step 3:** Hard-reload your browser (`Ctrl+Shift+R`)

---

### Option 2 — Manual

1. Download [`multi-air-conditioner-card.js`](https://github.com/doanlong1412/multi-air-conditioner-card/releases/latest)
2. Copy to `/config/www/multi-air-conditioner-card.js`
3. Go to **Settings → Dashboards → Resources** → **Add resource**:
   ```
   URL:  /local/multi-air-conditioner-card.js
   Type: JavaScript module
   ```
4. Hard-reload your browser (`Ctrl+Shift+R`)

---

## ⚙️ Card Configuration

### Step 1 — Add the card to your dashboard

```yaml
type: custom:multi-air-conditioner-card
```

After adding the card, click **✏️ Edit** to open the Config Editor.

### Step 2 — Config Editor sections

| # | Section | Contents |
|---|---------|----------|
| 1 | 🌐 **Language** | 11 languages with real flag images |
| 2 | 🖥️ **View mode** | Full / Lite / Super Lite layout |
| 3 | ✨ **Popup style** | Normal / Effect / Wave (Super Lite only) |
| 4 | 👁️ **Visibility** | Toggle individual sections on or off; power unit selector (kW / W) |
| 5 | 🔢 **Room count** | Slider to set 1–8 rooms |
| 6 | ❄️ **Air Conditioners** | Entity picker, display name, MDI icon, custom image URL, per-room temperature / humidity / power sensors |
| 7 | 📡 **Environment Sensors** | PM2.5, outdoor temperature, humidity, power |
| 8 | 🎨 **Colors** | Accent, text colours |
| 9 | 🎨 **Background** | 16 gradient presets + custom two-colour picker |

---

## 🔌 Entity Reference

### Room entities (per room, up to 8)

| Config key | Entity type | Description |
|---|---|---|
| `entities[n].entity_id` | `climate` | AC unit entity ✅ |
| `entities[n].label` | string | Display name for the room |
| `entities[n].icon` | string | MDI icon string, e.g. `mdi:sofa` (emoji also accepted) |
| `entities[n].area` | string | Room area label (e.g. `25 m²`) |
| `entities[n].image` | string | Custom room photo URL (optional) |
| `entities[n].temp_entity` | `sensor` | Room temperature sensor (if AC has none) |
| `entities[n].humidity_entity` | `sensor` | Room humidity sensor (if AC has none) |
| `entities[n].power_entity` | `sensor` | **New** — per-room power consumption sensor |

### Environment sensors (optional)

| Config key | Entity type | Description |
|---|---|---|
| `pm25_entity` | `sensor` | PM2.5 fine dust sensor |
| `outdoor_temp_entity` | `sensor` | Outdoor temperature sensor |
| `humidity_entity` | `sensor` | Outdoor humidity sensor |
| `power_entity` | `sensor` | Global AC power consumption sensor (fallback) |

---

## ⚙️ Full Config Reference

| Config key | Type | Default | Description |
|---|---|---|---|
| `language` | string | `vi` | `vi`/`en`/`de`/`fr`/`nl`/`pl`/`sv`/`hu`/`cs`/`it`/`pt` |
| `view_mode` | string | `full` | `full` · `lite` · `super_lite` |
| `popup_style` | string | `normal` | Super Lite selector style: `normal` · `effect` · `wave` |
| `room_count` | number | `4` | Number of rooms to display (1–8) |
| `owner_name` | string | `Smart Home` | Owner name shown in greeting |
| `show_greet` | boolean | `true` | Show greeting row |
| `show_cool` | boolean | `true` | Show Cool mode button |
| `show_heat` | boolean | `true` | Show Heat mode button |
| `show_dry` | boolean | `true` | Show Dry mode button |
| `show_fan_only` | boolean | `true` | Show Fan Only mode button |
| `show_fan` | boolean | `true` | Show fan speed panel (Full/Lite) |
| `show_swing` | boolean | `true` | Show airflow direction panel (Full/Lite) |
| `show_preset_bar` | boolean | `true` | Show Eco / Fav / Clean bar |
| `show_status` | boolean | `true` | Show status & sensor block |
| `show_outdoor_temp` | boolean | `true` | Show outdoor temperature metric |
| `show_humidity` | boolean | `true` | Show humidity metric |
| `show_power` | boolean | `true` | Show power consumption metric |
| `show_all_off` | boolean | `true` | Show turn-all-off button |
| `show_timer` | boolean | `true` | Show timer button |
| `show_room_env` | boolean | `false` | Super Lite: show selected room temp & humidity in header |
| `show_sl_fan` | boolean | `true` | Super Lite: show fan speed shortcut button |
| `show_sl_swing` | boolean | `true` | Super Lite: show airflow shortcut button |
| `show_sl_room_power` | boolean | `true` | Super Lite: show per-room power in header |
| `power_unit` | string | `kw` | Power display unit: `kw` or `w` (auto-converts ≥ 1000 W → kW) |
| `background_preset` | string | `default` | Gradient preset name |
| `bg_color1` | hex | `#001e2b` | Custom gradient colour 1 (top-left) |
| `bg_color2` | hex | `#12c6f3` | Custom gradient colour 2 (bottom-right) |
| `accent_color` | hex | `#00ffcc` | Accent / glow colour |
| `text_color` | hex | `#ffffff` | Primary text colour |
| `entities` | array | — | List of room objects (see above) |
| `pm25_entity` | entity | — | PM2.5 sensor |
| `outdoor_temp_entity` | entity | — | Outdoor temperature sensor |
| `humidity_entity` | entity | — | Outdoor humidity sensor |
| `power_entity` | entity | — | Global power consumption sensor (fallback) |

---

## 📝 Full YAML example

```yaml
type: custom:multi-air-conditioner-card
language: en
view_mode: full
room_count: 4
owner_name: My Home
power_unit: kw          # kw | w

background_preset: default
accent_color: "#00ffcc"
text_color: "#ffffff"

show_greet: true
show_cool: true
show_heat: true
show_dry: true
show_fan_only: true
show_fan: true
show_swing: true
show_preset_bar: true
show_status: true
show_outdoor_temp: true
show_humidity: true
show_power: true
show_all_off: true
show_timer: true

entities:
  - entity_id: climate.living_room_ac
    label: Living Room
    area: "25 m²"
    icon: mdi:sofa
    image: "https://example.com/photos/living.jpg"     # optional custom photo
    temp_entity: sensor.living_room_temperature        # optional room sensor
    humidity_entity: sensor.living_room_humidity       # optional room sensor
    power_entity: sensor.living_room_ac_power          # optional per-room power
  - entity_id: climate.bedroom_ac
    label: Bedroom
    area: "18 m²"
    icon: mdi:bed
    power_entity: sensor.bedroom_ac_power
  - entity_id: climate.kitchen_ac
    label: Kitchen
    area: "20 m²"
    icon: mdi:silverware-fork-knife
  - entity_id: climate.office_ac
    label: Office
    area: "15 m²"
    icon: mdi:briefcase

pm25_entity: sensor.pm25
outdoor_temp_entity: sensor.outdoor_temperature
humidity_entity: sensor.outdoor_humidity
power_entity: sensor.ac_power_kwh                      # global fallback
```

### Super Lite example

```yaml
type: custom:multi-air-conditioner-card
language: en
view_mode: super_lite
popup_style: effect         # normal | effect | wave
show_room_env: true         # show room temp/humidity in header
show_sl_room_power: true    # show per-room power in header
show_sl_fan: true           # fan speed button left of −
show_sl_swing: true         # airflow button right of +
power_unit: w               # display as W, auto-convert ≥ 1000 W to kW
room_count: 4
entities:
  - entity_id: climate.living_room_ac
    label: Living Room
    icon: mdi:sofa
    temp_entity: sensor.living_room_temperature
    humidity_entity: sensor.living_room_humidity
    power_entity: sensor.living_room_ac_power
  - entity_id: climate.bedroom_ac
    label: Bedroom
    icon: mdi:bed
    power_entity: sensor.bedroom_ac_power
```

### Lite mode example

```yaml
type: custom:multi-air-conditioner-card
language: en
view_mode: lite
room_count: 4
entities:
  - entity_id: climate.living_room_ac
    label: Living Room
    icon: mdi:sofa
  - entity_id: climate.bedroom_ac
    label: Bedroom
    icon: mdi:bed
```

---

## 🖥️ Compatibility

| | |
|---|---|
| Home Assistant | 2023.1+ |
| Lovelace | Default & custom dashboards |
| Devices | Mobile & Desktop |
| Dependencies | None — fully standalone |
| Browsers | Chrome, Firefox, Safari, Edge |

---

## 📋 Changelog

### v1.5
- 🎨 **MDI room icons** — all room icons now use `mdi:*` strings and render as native `<ha-icon>` elements throughout the card (tabs, popups, button labels); emoji still accepted as fallback; users can enter any MDI icon in the editor
- 🐛 **Fan blade fix** — fixed an issue where the fan blade SVG would not render when the fan level index was ≥ 4 (Low-Mid and above), caused by an undersized blade-count array

- ⚡ **Per-room power sensor** — each room has its own `entities[n].power_entity`; the displayed value updates automatically when switching rooms in all three view modes
- 🔢 **Power unit selector** — choose **kW** or **W** in the editor; values ≥ 1000 W auto-convert to kW
- 📍 **Super Lite power indicator** — power reading shown inline next to humidity in the header top-left; toggle with `show_sl_room_power`

- 🎛️ **Super Lite layout redesign** — fan speed button moved to the left of `−`; airflow button moved to the right of `+`; mode and room selectors now scale to full card width

### v1.4
- ⚡ New **Super Lite** view mode — ultra-compact single-column layout with large dial, temperature control, HVAC mode selector and room selector
- ✨ **Popup style selector** (Super Lite) — choose between Normal (native), Effect (glass + spring animation) or Wave (glass + wave animation) for mode and room dropdowns
- 🌡️ **Per-room temperature sensor** — set a dedicated `temp_entity` per room to override `current_temperature` when the AC entity doesn't provide it
- 💧 **Per-room humidity sensor** — set a dedicated `humidity_entity` per room for accurate indoor humidity display
- 🏠 **Custom room photo** — set a custom image URL per room via `entities[n].image`
- 🔵 **Set-point inner ring** — thin arc inside the temperature dial shows the target set-point temperature, coloured by active HVAC mode
- 💧 **Room humidity in photo badge** — humidity value now displayed alongside temperature in the room photo corner (Full/Lite modes)
- 👁️ **show_room_env** toggle — Super Lite header can show selected room's own temperature & humidity instead of outdoor sensor data
- 🔧 **Swing mode fix** — swing cycle now reads `swing_modes` attribute from the entity, preventing "invalid swing mode" errors on ACs with limited swing options
- 🐛 Bug fixes and layout improvements

### v1.3
- 🖥️ New **Lite view mode** — compact layout ideal for mobile or sidebar dashboards
- 👁️ **Per-element visibility toggles** — show/hide greeting, each HVAC mode button, fan, swing, Eco bar, status block, metrics, timer and all-off button individually
- 🐛 Bug fixes and stability improvements

### v1.2
- 🇵🇹 New language — Português (11 languages total)
- 🌡️ Dynamic temperature colour on dial — blue (cold) → cyan → green → orange → red (hot)
- ⏱️ Timer overhaul — 8 preset durations (30m · 1h · 1.5h · 2h · 3h · 4h · 6h · 8h) + free custom-minute input
- 🔢 Room tabs enlarged — always shows 4 rooms, scrollable when more than 4

### v1.1
- 🔢 Configurable room count — 1 to 8 rooms via editor slider
- 🌐 10-language support with real flag images
- 🎨 16 background gradient presets
- 🎛️ Full visual editor — entity pickers, accordion sections, 3-layer colour picker
- 🐛 Focus fix — text inputs no longer lose focus while typing

### v1.0
- 🚀 Initial release — 4-room AC control card

---

## 📄 License

MIT License — free to use, modify, and distribute.
If you find this useful, please ⭐ **star the repo**!

---

## 🙏 Credits

Designed and developed by **[@doanlong1412](https://github.com/doanlong1412)** from 🇻🇳 Vietnam.
