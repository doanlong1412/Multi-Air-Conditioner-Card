# ❄️ Multi Air Conditioner Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
![version](https://img.shields.io/badge/version-1.7-blue)
![HA](https://img.shields.io/badge/Home%20Assistant-2023.1+-green)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

> 🇬🇧 **English version:** [README.md](README.md)

Card tùy chỉnh cho Home Assistant Lovelace — điều khiển điều hòa nhiều phòng với đồng hồ nhiệt độ động, điều chỉnh quạt & hướng gió, tab chọn phòng, chế độ Eco, hẹn giờ tắt/bật, cảm biến môi trường và trình chỉnh sửa giao diện trực quan hỗ trợ tới 8 phòng.

**Không cần plugin bổ sung. Hoạt động độc lập, cấu hình hoàn toàn qua giao diện chỉnh sửa tích hợp.**

---

## 📸 Xem trước


### 🎬 Demo
![Demo](assets/preview.gif)

### 🖼️ Screenshot
![Preview](assets/preview.png)


---

## 🎛️ Visual Config Editor

![Multi AC Card Editor](assets/editor-preview.png)

---

## ✨ Tính năng (v1.7)

### 🎨 Hiển thị & Giao diện
- ❄️ **Đồng hồ nhiệt độ** — vòng cung động với màu sắc thay đổi theo nhiệt độ: xanh dương (lạnh) → xanh lơ → xanh lá → cam → đỏ (nóng)
- 🔵 **Vòng nhiệt độ cài đặt** — vòng cung mỏng bên trong đồng hồ hiển thị nhiệt độ mục tiêu, màu theo chế độ HVAC đang hoạt động
- 🏠 **Ảnh phòng** — ảnh riêng từng phòng (mặc định hoặc URL tùy chỉnh) kèm badge ON/OFF và nhiệt độ + độ ẩm trực tiếp với màu tương ứng
- 📊 **Khối trạng thái** — tình trạng hoạt động, chỉ số PM2.5, nhiệt độ ngoài trời, độ ẩm và điện năng tiêu thụ
- 🕐 **Đồng hồ thực** — hiển thị ngày giờ theo thời gian thực với lời chào theo buổi trong ngày
- 🌿 **Badge Eco** — bật/tắt chế độ Eco trực tiếp từ đầu card

### 🖥️ Ba chế độ hiển thị
- **Full** — bố cục hai cột đầy đủ với tất cả các panel hiển thị (mặc định)
- **Lite** — bố cục hai cột gọn nhẹ, ẩn ảnh phòng, phù hợp cho dashboard nhỏ hoặc điện thoại
- **Super Lite** ⚡ — bố cục một cột siêu gọn với đồng hồ lớn, điều chỉnh nhiệt độ, chọn chế độ và chọn phòng; lý tưởng cho widget, sidebar hoặc không gian hẹp

### 🔀 Chuyển chế độ ngay trên card
Chuyển giữa Full / Lite / Super Lite **trực tiếp ngay trên card** mà không cần mở editor. Các chấm tròn của chế độ đang chọn nay **nhảy lên xuống theo sóng lệch pha** — Full có 3 chấm nhảy lần lượt từ trái sang phải, Lite có 2, Super Lite có 1 — giúp nhận biết ngay chế độ đang dùng.

### ✨ Kiểu Popup (Super Lite)
Khi dùng chế độ **Super Lite**, ô chọn chế độ HVAC và chọn phòng hỗ trợ 3 kiểu tương tác — cấu hình trong editor:
- **Normal** — dropdown `<select>` gốc (tương thích tốt nhất, nhất quán trên iOS/Android)
- **Effect** — popup kính tùy chỉnh với animation mở/đóng kiểu lò xo
- **Wave** — cùng kiểu popup kính nhưng với animation gợn sóng khi mở

### 🎛️ Bố cục Super Lite
Trong chế độ **Super Lite**, hàng điều chỉnh nhiệt độ có 2 nút tắt tắt nhanh chuyên dụng:
- **Nút tốc độ quạt** — nằm bên trái nút `−` (giảm nhiệt); nhấn để chuyển mức quạt
- **Nút hướng gió** — nằm bên phải nút `+` (tăng nhiệt); nhấn để chuyển chế độ xoay
- **Nút Chọn chế độ và Chọn phòng** mở rộng ra hết chiều rộng card để dễ thao tác trên màn hình hẹp

### 🎛️ Tùy chỉnh hiển thị từng thành phần
Mỗi phần của card có thể bật/tắt riêng lẻ ngay trong editor:
- Lời chào, nút chế độ HVAC (Cool / Heat / Dry / Fan từng nút riêng), bảng quạt, bảng hướng gió, thanh Eco/Fav/Clean, khối trạng thái & cảm biến, nhiệt độ ngoài trời, độ ẩm, công suất, nút hẹn giờ, nút tắt tất cả
- **Nhiệt độ/Độ ẩm phòng** (Super Lite) — bật để hiển thị nhiệt độ & độ ẩm của phòng đang chọn trên header thay vì dữ liệu ngoài trời
- **Tiêu thụ điện phòng** (Super Lite) — bật để hiển thị mức điện tiêu thụ cạnh độ ẩm trên header
- **Nút Quạt / Hướng gió** (Super Lite) — bật/tắt từng nút riêng lẻ

### ❄️ Điều khiển nhiều phòng (tối đa 8 phòng)
- **Tab chọn phòng** (Full / Lite) — hiển thị MDI icon, tên, nhiệt độ và badge ON/OFF; luôn hiện 4 hàng, cuộn để xem thêm. Nhấn tab sẽ hiện **tooltip thông minh** với nhiệt độ, độ ẩm và trạng thái hoạt động
- **Dropdown chọn phòng** (Super Lite) — dropdown gọn / popup kính liệt kê tất cả phòng với nhiệt độ và badge ON/OFF; icon hiển thị dạng `ha-icon` MDI
- **Điều khiển HVAC từng phòng** — các nút chế độ Làm lạnh / Sưởi / Hút ẩm / Quạt với màu trạng thái
- **Điều chỉnh nhiệt độ** — nút `+` / `−` để đặt nhiệt độ mong muốn
- **Tốc độ quạt** — chuyển đổi Tự động / Thấp / Vừa / Cao với SVG cánh quạt động và biểu đồ cột
- **Hướng gió** — chỉ cycle qua các chế độ thực sự được hỗ trợ bởi entity (đọc thuộc tính `swing_modes`)
- **Ảnh phòng tùy chỉnh** — mỗi phòng hỗ trợ URL ảnh tùy chỉnh, tự động dùng ảnh mặc định nếu không có

### 🌡️ Cảm biến môi trường từng phòng
Mỗi phòng hỗ trợ cảm biến nhiệt độ, độ ẩm và điện năng riêng độc lập với entity điều hòa:
- `entities[n].temp_entity` — ghi đè nhiệt độ hiển thị của phòng
- `entities[n].humidity_entity` — ghi đè độ ẩm hiển thị của phòng
- `entities[n].power_entity` — cảm biến tiêu thụ điện riêng từng phòng; giá trị tự cập nhật khi chuyển phòng trên cả 3 chế độ
- Hiển thị trong badge ảnh phòng (Full/Lite) và trong header Super Lite

### ⚡ Tiêu thụ điện — Từng phòng & Tùy chọn đơn vị
- Mỗi phòng có entity điện riêng (`entities[n].power_entity`) — giá trị tự đổi khi chuyển phòng trên Full, Lite và Super Lite
- `power_entity` toàn cục là fallback khi phòng không có sensor riêng
- **Tùy chọn đơn vị** trong editor: chọn **kW** (dùng nguyên giá trị sensor) hoặc **W** (tự convert — giá trị ≥ 1000 W hiển thị dạng kW)
- Super Lite: giá trị điện hiển thị cạnh độ ẩm ở góc trái header; toggle bằng `show_sl_room_power`

### 🎨 Icon phòng MDI
Icon phòng nay dùng hệ thống **Material Design Icons** (`mdi:*`) thay vì emoji, đồng nhất với phong cách icon gốc của Home Assistant:
- Icon mặc định: `mdi:sofa`, `mdi:bed`, `mdi:silverware-fork-knife`, `mdi:briefcase`, `mdi:shower`, `mdi:teddy-bear`, `mdi:dumbbell`, `mdi:archive`
- Được render dạng `<ha-icon>` xuyên suốt card — tab phòng (Full/Lite), nút chọn phòng (Super Lite), danh sách popup (Effect & Wave), native select (chỉ hiện tên)
- Người dùng có thể nhập bất kỳ `mdi:tên-icon` nào trong ô **MDI Icon** của editor; emoji vẫn được chấp nhận như fallback

### 🎇 Hiệu ứng canvas theo chế độ HVAC (Mới trong v1.7)
Mỗi nút chế độ HVAC khi được kích hoạt sẽ phát ra **hiệu ứng canvas động** chạy từ nút đến tâm vòng tròn nhiệt độ — lặp lại mỗi 10 giây (có thể cấu hình):

| Chế độ | Đường đi | Hiệu ứng kết thúc |
|--------|----------|-------------------|
| ❄️ **Làm lạnh** | 5 bông tuyết + vệt sáng | Bùng nổ tinh thể băng + giọt nước |
| 🔥 **Sưởi** | 4 tia nhiệt rung zigzag | Than hồng bắn ra + vầng hào quang lan rộng |
| 💧 **Hút ẩm** | 18 giọt sương uốn lượn | Đám sương nở to rồi xoáy vào trong (hút ẩm) |
| 🌀 **Quạt** | 5 luồng gió song song cong | Lốc xoáy 3 vòng to dần rồi tan biến |

Cả 4 chế độ cũng **giữ animation icon sau khi chọn** (xoay, nhấp nhảy, nảy, rung) — trước đây chỉ có Auto mới có tính năng này.

**Thời gian lặp lại** cấu hình trong editor qua thanh trượt *Lặp lại bông tuyết (giây)* (2–15 giây, mặc định 10 giây) — áp dụng cho cả 4 chế độ.

### ⚡ Nút Tắt Tất Cả — Thiết kế lại (Mới trong v1.7)
Nút Tắt Tất Cả nay nổi bật hẳn so với các nút khác:
- **Gradient đỏ rực** — `rgba(220,38,38)` thay thế kiểu mờ nhạt cũ
- **Hiệu ứng 3D nổi lên** — `box-shadow` nhiều lớp mô phỏng nút vật lý nổi trên mặt card
- **Hover:** nút nổi cao hơn; **Nhấn/tap:** nút chìm xuống vật lý
- **Animation thở nhẹ** — ánh sáng đỏ thở vào ra liên tục để thu hút sự chú ý
- Phiên bản Lite cũng được cập nhật tương tự

### 🌿 Eco & Tác vụ nhanh
- **Bật/tắt Eco** — kích hoạt chế độ Eco/preset cho điều hòa phòng đang chọn
- **Chip tác vụ nhanh** — nút Eco, Fav, Clean (chỉ chế độ Full)

### ⏱️ Hẹn giờ
- **Hẹn giờ từng phòng** — 8 mốc thời gian: `30p · 1h · 1.5h · 2h · 3h · 4h · 6h · 8h` + ô nhập số phút tùy ý
- **Hẹn tắt hoặc hẹn bật** — chọn timer sẽ tắt hay bật điều hòa
- **Đếm ngược trực tiếp** — thời gian còn lại hiển thị ngay trên nút hẹn giờ
- **Timer bền vững** — lưu vào localStorage, khôi phục sau khi tải lại trang

### 🌐 11 ngôn ngữ
- 🇻🇳 Tiếng Việt / 🇬🇧 English / 🇩🇪 Deutsch / 🇫🇷 Français / 🇳🇱 Nederlands
- 🇵🇱 Polski / 🇸🇪 Svenska / 🇭🇺 Magyar / 🇨🇿 Čeština / 🇮🇹 Italiano / 🇵🇹 Português
- **Ảnh cờ quốc gia thật** qua flagcdn.com

### 🎨 Tùy chỉnh giao diện
- **16 preset gradient nền** — Default, Night, Sunset, Forest, Aurora, Desert, Ocean, Cherry, Volcano, Galaxy, Ice, Olive, Slate, Rose, Teal, Custom
- **3 bộ chọn màu** — Nhấn, Chữ, Màu nền tùy chỉnh

---

## 📦 Cài đặt

### Cách 1 — HACS (khuyến nghị)

**Bước 1:** Thêm Custom Repository vào HACS:

[![Open HACS Repository](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=doanlong1412&repository=multi-air-conditioner-card&category=plugin)

> Nếu nút không hoạt động:
> **HACS → Frontend → ⋮ → Custom repositories**
> → URL: `https://github.com/doanlong1412/multi-air-conditioner-card` → Type: **Dashboard** → Add

**Bước 2:** Tìm **Multi Air Conditioner Card** → **Install**

**Bước 3:** Hard-reload trình duyệt (`Ctrl+Shift+R`)

---

### Cách 2 — Thủ công

1. Tải [`multi-air-conditioner-card.js`](https://github.com/doanlong1412/multi-air-conditioner-card/releases/latest)
2. Sao chép vào `/config/www/multi-air-conditioner-card.js`
3. Vào **Settings → Dashboards → Resources** → **Add resource**:
   ```
   URL:  /local/multi-air-conditioner-card.js
   Type: JavaScript module
   ```
4. Hard-reload trình duyệt (`Ctrl+Shift+R`)

---

## ⚙️ Cấu hình Card

### Bước 1 — Thêm card vào dashboard

```yaml
type: custom:multi-air-conditioner-card
```

Sau khi thêm, nhấn **✏️ Edit** để mở Config Editor.

### Bước 2 — Các phần trong Config Editor

| # | Phần | Nội dung |
|---|------|----------|
| 1 | 🌐 **Ngôn ngữ** | 11 ngôn ngữ với ảnh cờ thật |
| 2 | 🖥️ **Chế độ hiển thị** | Full / Lite / Super Lite |
| 3 | ✨ **Kiểu Popup** | Normal / Effect / Wave (chỉ Super Lite) |
| 4 | 👁️ **Tùy chọn hiển thị** | Bật/tắt từng thành phần riêng lẻ; tùy chọn đơn vị điện (kW / W) |
| 5 | 🔢 **Số phòng** | Thanh trượt chọn 1–8 phòng |
| 6 | ❄️ **Điều hòa** | Entity, tên, MDI icon, ảnh URL, cảm biến nhiệt độ / độ ẩm / điện năng từng phòng |
| 7 | 📡 **Cảm biến môi trường** | PM2.5, nhiệt độ ngoài trời, độ ẩm, điện năng (global fallback) |
| 8 | 🎨 **Màu sắc** | Màu nhấn, màu chữ |
| 9 | 🎨 **Màu nền** | 16 preset + bộ chọn hai màu tùy chỉnh |

---

## 🔌 Tham chiếu thực thể

### Thực thể từng phòng (tối đa 8 phòng)

| Config key | Loại | Mô tả |
|---|---|---|
| `entities[n].entity_id` | `climate` | Entity điều hòa ✅ |
| `entities[n].label` | string | Tên hiển thị của phòng |
| `entities[n].icon` | string | MDI icon, ví dụ `mdi:sofa` (emoji vẫn được chấp nhận) |
| `entities[n].area` | string | Diện tích phòng (ví dụ: `25 m²`) |
| `entities[n].image` | string | URL ảnh phòng tùy chỉnh (tuỳ chọn) |
| `entities[n].temp_entity` | `sensor` | Cảm biến nhiệt độ phòng (nếu điều hòa không có) |
| `entities[n].humidity_entity` | `sensor` | Cảm biến độ ẩm phòng (nếu điều hòa không có) |
| `entities[n].power_entity` | `sensor` | Cảm biến tiêu thụ điện riêng từng phòng |

### Cảm biến môi trường (tuỳ chọn)

| Config key | Loại | Mô tả |
|---|---|---|
| `pm25_entity` | `sensor` | Cảm biến bụi mịn PM2.5 |
| `outdoor_temp_entity` | `sensor` | Cảm biến nhiệt độ ngoài trời |
| `humidity_entity` | `sensor` | Cảm biến độ ẩm ngoài trời |
| `power_entity` | `sensor` | Cảm biến điện năng toàn cục (fallback) |

---

## ⚙️ Tham chiếu cấu hình đầy đủ

| Config key | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `language` | string | `vi` | `vi`/`en`/`de`/`fr`/`nl`/`pl`/`sv`/`hu`/`cs`/`it`/`pt` |
| `view_mode` | string | `full` | `full` · `lite` · `super_lite` |
| `popup_style` | string | `normal` | Kiểu selector Super Lite: `normal` · `effect` · `wave` |
| `room_count` | number | `4` | Số phòng hiển thị (1–8) |
| `owner_name` | string | `Smart Home` | Tên chủ nhà hiển thị trong lời chào |
| `cool_anim_speed` | number | `10000` | Thời gian lặp animation HVAC tính bằng ms (2000–15000) |
| `show_greet` | boolean | `true` | Hiện lời chào |
| `show_cool` | boolean | `true` | Hiện nút chế độ Làm lạnh |
| `show_heat` | boolean | `true` | Hiện nút chế độ Sưởi |
| `show_dry` | boolean | `true` | Hiện nút chế độ Hút ẩm |
| `show_fan_only` | boolean | `true` | Hiện nút chế độ Quạt |
| `show_fan` | boolean | `true` | Hiện bảng tốc độ quạt (Full/Lite) |
| `show_swing` | boolean | `true` | Hiện bảng hướng gió (Full/Lite) |
| `show_preset_bar` | boolean | `true` | Hiện thanh Eco / Fav / Clean |
| `show_status` | boolean | `true` | Hiện khối trạng thái & cảm biến |
| `show_outdoor_temp` | boolean | `true` | Hiện chỉ số nhiệt độ ngoài trời |
| `show_humidity` | boolean | `true` | Hiện chỉ số độ ẩm |
| `show_power` | boolean | `true` | Hiện chỉ số điện năng |
| `show_all_off` | boolean | `true` | Hiện nút Tắt tất cả |
| `show_timer` | boolean | `true` | Hiện nút hẹn giờ |
| `show_room_env` | boolean | `false` | Super Lite: hiện nhiệt độ & độ ẩm phòng trên header |
| `show_sl_fan` | boolean | `true` | Super Lite: hiện nút tắt quạt nhanh |
| `show_sl_swing` | boolean | `true` | Super Lite: hiện nút hướng gió nhanh |
| `show_sl_room_power` | boolean | `true` | Super Lite: hiện điện năng phòng trên header |
| `power_unit` | string | `kw` | Đơn vị điện: `kw` hoặc `w` (tự convert ≥ 1000 W → kW) |
| `background_preset` | string | `default` | Tên preset gradient |
| `bg_color1` | hex | `#001e2b` | Màu gradient tùy chỉnh 1 (trên trái) |
| `bg_color2` | hex | `#12c6f3` | Màu gradient tùy chỉnh 2 (dưới phải) |
| `accent_color` | hex | `#00ffcc` | Màu nhấn / glow |
| `text_color` | hex | `#ffffff` | Màu chữ chính |
| `entities` | array | — | Danh sách đối tượng phòng (xem bên trên) |
| `pm25_entity` | entity | — | Cảm biến PM2.5 |
| `outdoor_temp_entity` | entity | — | Cảm biến nhiệt độ ngoài trời |
| `humidity_entity` | entity | — | Cảm biến độ ẩm |
| `power_entity` | entity | — | Cảm biến điện năng toàn cục (fallback) |

---

## 📝 Ví dụ YAML đầy đủ

```yaml
type: custom:multi-air-conditioner-card
language: vi
view_mode: full
room_count: 4
owner_name: Nhà Của Tôi
power_unit: kw          # kw | w
cool_anim_speed: 10000  # ms giữa các lần animation (2000–15000)

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
  - entity_id: climate.dieu_hoa_living
    label: Phòng khách
    area: "25 m²"
    icon: mdi:sofa
    image: "https://example.com/photos/living.jpg"     # tuỳ chọn: ảnh phòng riêng
    temp_entity: sensor.nhiet_do_phong_khach            # tuỳ chọn: cảm biến nhiệt độ phòng
    humidity_entity: sensor.do_am_phong_khach           # tuỳ chọn: cảm biến độ ẩm phòng
    power_entity: sensor.dien_phong_khach               # tuỳ chọn: cảm biến điện phòng
  - entity_id: climate.bed_air_conditioning
    label: Phòng ngủ
    area: "18 m²"
    icon: mdi:bed
    power_entity: sensor.dien_phong_ngu
  - entity_id: climate.kitchen_air_conditioning
    label: Phòng ăn
    area: "20 m²"
    icon: mdi:silverware-fork-knife
  - entity_id: climate.dieu_hoa_office
    label: Văn phòng
    area: "15 m²"
    icon: mdi:briefcase

pm25_entity: sensor.pm25
outdoor_temp_entity: sensor.outdoor_temperature
humidity_entity: sensor.outdoor_humidity
power_entity: sensor.ac_power_kwh                       # fallback toàn cục
```

### Ví dụ Super Lite

```yaml
type: custom:multi-air-conditioner-card
language: vi
view_mode: super_lite
popup_style: effect         # normal | effect | wave
show_room_env: true         # hiện nhiệt độ/độ ẩm phòng trên header
show_sl_room_power: true    # hiện tiêu thụ điện phòng trên header
show_sl_fan: true           # nút quạt bên trái nút −
show_sl_swing: true         # nút hướng gió bên phải nút +
power_unit: w               # hiện theo W, tự convert ≥ 1000 W sang kW
room_count: 4
entities:
  - entity_id: climate.dieu_hoa_living
    label: Phòng khách
    icon: mdi:sofa
    temp_entity: sensor.nhiet_do_phong_khach
    humidity_entity: sensor.do_am_phong_khach
    power_entity: sensor.dien_phong_khach
  - entity_id: climate.bed_air_conditioning
    label: Phòng ngủ
    icon: mdi:bed
    power_entity: sensor.dien_phong_ngu
```

### Ví dụ chế độ Lite

```yaml
type: custom:multi-air-conditioner-card
language: vi
view_mode: lite
room_count: 4
entities:
  - entity_id: climate.dieu_hoa_living
    label: Phòng khách
    icon: mdi:sofa
  - entity_id: climate.bed_air_conditioning
    label: Phòng ngủ
    icon: mdi:bed
```

---

## 🖥️ Tương thích

| | |
|---|---|
| Home Assistant | 2023.1+ |
| Lovelace | Dashboard mặc định & tùy chỉnh |
| Thiết bị | Mobile & Desktop |
| Phụ thuộc | Không — hoàn toàn độc lập |
| Trình duyệt | Chrome, Firefox, Safari, Edge |

---

## 📋 Lịch sử thay đổi

### v1.7
- 🎇 **Hiệu ứng canvas theo chế độ HVAC** — mỗi chế độ đang hoạt động phát ra animation canvas lặp lại từ nút đến tâm đồng hồ nhiệt:
  - ❄️ Làm lạnh: vệt bông tuyết + bùng nổ tinh thể băng kèm giọt nước
  - 🔥 Sưởi: tia nhiệt rung zigzag + than hồng bắn ra + vầng hào quang lan rộng
  - 💧 Hút ẩm: giọt sương uốn lượn + đám sương nở rồi xoáy hút vào trong
  - 🌀 Quạt: luồng gió song song + lốc xoáy 3 vòng to dần rồi tan biến
- ✨ **Giữ animation icon sau khi chọn chế độ** — Cool, Heat, Dry, Fan duy trì animation (xoay, nhấp nhảy, nảy, rung) sau khi chọn, không chỉ khi hover; mỗi chế độ có kiểu và tốc độ riêng
- 🎯 **Chấm tròn chuyển chế độ nhảy lệch pha** — các chấm của chế độ đang chọn nhảy lên xuống theo sóng từ trái sang phải (lệch 180 ms) giúp nhận biết ngay chế độ hiện tại
- 🟥 **Thiết kế lại nút Tắt Tất Cả** — gradient đỏ rực, hiệu ứng 3D nổi lên nhiều lớp, nhấn xuống vật lý khi tap, animation thở nhẹ liên tục; phiên bản Lite cũng được cập nhật
- 🐛 **Sửa lỗi bông tuyết biến mất giữa chừng** — thêm bộ bảo vệ frame-delta để ngăn phase animation bị skip khi tab trình duyệt bị ẩn rồi focus lại

### v1.6
- 🔀 **Chuyển chế độ ngay trên card** — chuyển giữa Full / Lite / Super Lite trực tiếp từ header mà không cần mở editor
- 🎨 **Icon phòng MDI** — tất cả icon phòng nay dùng chuỗi `mdi:*` và render dạng `<ha-icon>`
- ⚡ **Cảm biến điện từng phòng** — `entities[n].power_entity` riêng mỗi phòng
- 🔢 **Tùy chọn đơn vị điện** — kW hoặc W, tự convert ≥ 1000 W
- 📍 **Chỉ số điện trên Super Lite** — toggle bằng `show_sl_room_power`
- 🐛 Sửa lỗi cánh quạt, scale nhấp nháy, tooltip nháy loạn

### v1.5
- 🎛️ **Thiết kế lại hàng điều nhiệt Super Lite**

### v1.4
- ⚡ Chế độ **Super Lite** mới
- ✨ **Kiểu Popup** — Normal / Effect / Wave
- 🌡️ Cảm biến nhiệt độ / độ ẩm từng phòng
- 🏠 Ảnh phòng tùy chỉnh
- 🔵 Vòng nhiệt độ cài đặt bên trong

### v1.3
- 🖥️ Chế độ **Lite** mới
- 👁️ **Tùy chỉnh hiển thị từng thành phần**

### v1.2
- 🇵🇹 Ngôn ngữ mới — Português (tổng 11 ngôn ngữ)
- 🌡️ Màu nhiệt độ động trên đồng hồ
- ⏱️ Nâng cấp hẹn giờ
- 🔢 Tab phòng to hơn

### v1.1
- 🔢 Số phòng có thể cấu hình
- 🌐 Hỗ trợ 10 ngôn ngữ với ảnh cờ thật
- 🎨 16 preset gradient nền
- 🎛️ Trình chỉnh sửa trực quan đầy đủ

### v1.0
- 🚀 Phát hành lần đầu — card điều khiển 4 điều hòa

---

## 📄 Giấy phép

MIT License — miễn phí sử dụng, chỉnh sửa và phân phối.
Nếu bạn thấy hữu ích, hãy ⭐ **star repo** nhé!

---

## 🙏 Credits

Thiết kế và phát triển bởi **[@doanlong1412](https://github.com/doanlong1412)** từ 🇻🇳 Việt Nam.
