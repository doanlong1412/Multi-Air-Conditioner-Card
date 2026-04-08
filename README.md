# ❄️ Multi Air Conditioner Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
![version](https://img.shields.io/badge/version-1.3-blue)
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

## ✨ Features (v1.3)

### 🎨 Display & Interface
- ❄️ **Temperature dial** — animated arc gauge with dynamic colour glow: blue (cold) → cyan → green → orange → red (hot)
- 🏠 **Room photo panel** — per-room image with live ON/OFF overlay badge and colour-matched temperature badge
- 📊 **Status block** — running state, air quality indicator, PM2.5 ring, outdoor temperature, humidity and power consumption
- 🕐 **Live clock** — real-time date and time display with greeting by time of day
- 🌿 **Eco mode badge** — toggle eco/preset mode directly from the card header

### 🖥️ Two View Modes
- **Full** — complete layout with all panels visible (default)
- **Lite** — compact layout that hides the left panel, showing only room tabs, power button, timer and all-off button — ideal for smaller dashboards or mobile

### 🎛️ Per-element Visibility Toggles
Every section of the card can be individually shown or hidden directly from the editor:
- Greeting row, HVAC mode buttons (Cool / Heat / Dry / Fan individually), fan speed panel, airflow panel, Eco/Fav/Clean bar, status & sensor block, outdoor temperature, humidity, power, timer button, turn-all-off button

### ❄️ Multi-Room Control (up to 8 rooms)
- **Room selector tabs** — shows icon, name, current temperature and ON/OFF badge; always displays 4 rooms, scrollable for more
- **Per-room HVAC control** — Cool / Heat / Dry / Fan Only mode buttons with colour-coded active state
- **Temperature set** — `+` / `−` buttons to adjust set-point
- **Fan speed** — cycle through Auto / Low / Medium / High with animated fan blade SVG and bar chart
- **Swing direction** — cycle through Fixed / Up-Down / Left-Right / Both with animated wave SVG

### 🌿 Eco & Quick Actions
- **Eco toggle** — activates eco/preset mode on the selected room's AC unit
- **Quick-action chips** — Eco, Fav, Clean shortcut buttons

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
| 2 | 🖥️ **View mode** | Full or Lite layout |
| 3 | 🔢 **Room count** | Slider to set 1–8 rooms |
| 4 | ❄️ **Air Conditioners** | Entity picker, display name and icon per room |
| 5 | 📡 **Environment Sensors** | PM2.5, outdoor temperature, humidity, power |
| 6 | 👁️ **Visibility** | Toggle individual sections on or off |
| 7 | 🎨 **Colors** | Accent, text colours |
| 8 | 🎨 **Background** | 16 gradient presets + custom two-colour picker |

---

## 🔌 Entity Reference

### Room entities (per room, up to 8)

| Config key | Entity type | Description |
|---|---|---|
| `entities[n].entity_id` | `climate` | AC unit entity ✅ |
| `entities[n].label` | string | Display name for the room |
| `entities[n].icon` | string | Emoji icon for the room tab |
| `entities[n].area` | string | Room area label (e.g. `25 m²`) |

### Environment sensors (optional)

| Config key | Entity type | Description |
|---|---|---|
| `pm25_entity` | `sensor` | PM2.5 fine dust sensor |
| `outdoor_temp_entity` | `sensor` | Outdoor temperature sensor |
| `humidity_entity` | `sensor` | Outdoor humidity sensor |
| `power_entity` | `sensor` | AC power consumption (kW) |

---

## ⚙️ Full Config Reference

| Config key | Type | Default | Description |
|---|---|---|---|
| `language` | string | `vi` | `vi`/`en`/`de`/`fr`/`nl`/`pl`/`sv`/`hu`/`cs`/`it`/`pt` |
| `view_mode` | string | `full` | `full` = complete layout · `lite` = compact layout |
| `room_count` | number | `4` | Number of rooms to display (1–8) |
| `owner_name` | string | `Smart Home` | Owner name shown in greeting |
| `show_greet` | boolean | `true` | Show greeting row |
| `show_cool` | boolean | `true` | Show Cool mode button |
| `show_heat` | boolean | `true` | Show Heat mode button |
| `show_dry` | boolean | `true` | Show Dry mode button |
| `show_fan_only` | boolean | `true` | Show Fan Only mode button |
| `show_fan` | boolean | `true` | Show fan speed panel |
| `show_swing` | boolean | `true` | Show airflow direction panel |
| `show_preset_bar` | boolean | `true` | Show Eco / Fav / Clean bar |
| `show_status` | boolean | `true` | Show status & sensor block |
| `show_outdoor_temp` | boolean | `true` | Show outdoor temperature metric |
| `show_humidity` | boolean | `true` | Show humidity metric |
| `show_power` | boolean | `true` | Show power consumption metric |
| `show_all_off` | boolean | `true` | Show turn-all-off button |
| `show_timer` | boolean | `true` | Show timer button |
| `background_preset` | string | `default` | Gradient preset name |
| `bg_color1` | hex | `#001e2b` | Custom gradient colour 1 (top-left) |
| `bg_color2` | hex | `#12c6f3` | Custom gradient colour 2 (bottom-right) |
| `accent_color` | hex | `#00ffcc` | Accent / glow colour |
| `text_color` | hex | `#ffffff` | Primary text colour |
| `entities` | array | — | List of room objects (see above) |
| `pm25_entity` | entity | — | PM2.5 sensor |
| `outdoor_temp_entity` | entity | — | Outdoor temperature sensor |
| `humidity_entity` | entity | — | Outdoor humidity sensor |
| `power_entity` | entity | — | Power consumption sensor |

---

## 📝 Full YAML example

```yaml
type: custom:multi-air-conditioner-card
language: en
view_mode: full
room_count: 4
owner_name: My Home

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
    icon: 🛋
  - entity_id: climate.bedroom_ac
    label: Bedroom
    area: "18 m²"
    icon: 🛌
  - entity_id: climate.kitchen_ac
    label: Kitchen
    area: "20 m²"
    icon: 🍳
  - entity_id: climate.office_ac
    label: Office
    area: "15 m²"
    icon: 💼

pm25_entity: sensor.pm25
outdoor_temp_entity: sensor.outdoor_temperature
humidity_entity: sensor.outdoor_humidity
power_entity: sensor.ac_power_kwh
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
    icon: 🛋
  - entity_id: climate.bedroom_ac
    label: Bedroom
    icon: 🛌
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
