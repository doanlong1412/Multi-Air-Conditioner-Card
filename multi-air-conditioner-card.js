/**
 * Multi Air Conditioner Card
 * v1.7.2 Designed by @doanlong1412 from 🇻🇳 Vietnam
 * HACS-compatible Web Component
 *
 * ─── What's new in v1.7.2 ─────────────────────────────────────────────────
 * 📐 Long-label overflow fix — fc-label (VENTILATORSNELHEID / LUCHTRICHTING)
 *    nay tự xuống dòng thay vì tràn ra ngoài card; letter-spacing giảm nhẹ;
 *    fan-card/swing-card có overflow:hidden; hdr-title, rt-header, sl-title
 *    cũng được chặn overflow với text-overflow:ellipsis
 * 🏢 System-aware Turn On — bật điều hòa qua climate.turn_on (HA core service)
 *    thay vì hardcode set_hvac_mode:cool; integration/hệ thống tập trung
 *    (Mitsubishi City Multi, v.v.) tự quyết định mode Heat/Cool đúng;
 *    chỉ dùng set_hvac_mode khi user đã từng chọn mode cụ thể trong card
 * 🔧 Swing no-stuck fix — khi swing_mode hiện tại không nằm trong danh sách
 *    swing_modes hỗ trợ của entity (idx = -1), cycle reset về đầu danh sách
 *    thay vì bị kẹt; áp dụng cho Full/Lite và Super Lite
 * 🔄 Smart power restore — nút "Tap to turn on" bật lại đúng chế độ HVAC
 *    đã ghi nhớ; lưu vào localStorage → survive reload trang + thiết bị khác
 *    cùng domain; cập nhật khi đổi mode bất kỳ (heat/dry/fan/auto/cool/off)
 * 💨 Per-device fan filter — fan-card & Super Lite chỉ hiển thị các mức lưu
 *    lượng mà entity thực sự hỗ trợ (fan_modes attribute); thiết bị ít mức
 *    sẽ không thấy các chế độ không áp dụng; tỉ lệ bar chart & blade count
 *    tự động điều chỉnh theo số lượng mức thực tế
 * 💨 Extended fan speed — added Low/Auto, High/Auto, Quiet alongside existing
 *    8 levels; entity-supported modes are shown automatically; fan SVG blade
 *    count & bar fill adapted; Quiet has slow-spin icon animation
 * 🔄 Auto HVAC mode — new Auto mode (Auto/Heat/Cool/Dry/Fan) with animated
 *    rotating icon (mdi:autorenew); hidden by default — enable via the
 *    "Auto mode" toggle in Display Options (same as other modes)
 * 🔢 Vertical airflow numeric positions — swing now supports positions 1–6
 *    for ACs that use numeric levels; if entity only reports off/vertical
 *    the card shows only those two options; numeric labels are localised
 * All three view modes (Full / Lite / Super Lite) updated consistently
 * 🐛 Scale flicker fix — debounced ResizeObserver + double-rAF + chỉ set style
 *    khi giá trị thực sự thay đổi; bỏ CSS transition trên transform để tránh
 *    vòng lặp layout trên mobile
 * 🐛 Tooltip nháy loạn fix — tooltip hiện 5s rồi tự ẩn (mobile); dùng timer
 *    có clear/reset khi tap lại; double-rAF đảm bảo định vị chính xác;
 *    cleanup timer trong disconnectedCallback tránh memory leak
 * 🎨 MDI room icons — all room icons now use mdi:* strings and render as native <ha-icon> elements throughout the card (tabs, popups, button labels); emoji still accepted as fallback; users can enter any MDI icon in the editor
 * 🐛 Fan blade fix — fixed an issue where the fan blade SVG would not render when the fan level index was ≥ 4 (Low-Mid and above), caused by an undersized blade-count array
 * ⚡ Per-room power sensor — each room has its own entities[n].power_entity; the displayed value updates automatically when switching rooms in all three view modes
 * 🔢 Power unit selector — choose kW or W in the editor; values ≥ 1000 W auto-convert to kW
 * 📍 Super Lite power indicator — power reading shown inline next to humidity in the header top-left; toggle with show_sl_room_power
 * 
 * ─── What's new in v1.4 ───────────────────────────────────────────────────────
 * ✨ Popup style option (Super Lite) — Normal (native select, iOS/Android consistent)
 *    vs Effect (custom glass popup with spring animation, same style as room picker)
 * ─── What's new in v1.2 ───────────────────────────────────────────────────────
 * 🇵🇹 New language — Português (11 languages total)
 * 🌡️ Dynamic temperature colour on dial — blue (cold) → cyan → green → orange → red (hot)
 * ⏱️ Timer overhaul — 8 preset durations (30m · 1h · 1.5h · 2h · 3h · 4h · 6h · 8h) + free custom-minute input
 * 🔢 Room tabs enlarged — always shows 4 rooms, scrollable when more than 4
 * 🐛 Bug fixes and stability improvements
 * ─── What's new in v1.1 ───────────────────────────────────────────────────────
 *  🌐 10 languages — full editor + card UI translation
 *  🎨 16 background gradient presets (same as Gate Card)
 *  🎛  Visual Editor y hệt Gate Card: ha-entity-picker, accordion,
 *      color picker 3-layer, CSS-only toggle, bg preset grid
 *  🐛 Focus fix — text inputs không mất focus khi gõ
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── i18n ─────────────────────────────────────────────────────────────────────
const AC_TRANSLATIONS = {
  vi: {
    lang: 'Tiếng Việt', flag: 'vn',
    cardTitle: 'Điều Hòa Không Khí',
    cardSub:   'Nhà Thông Minh',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Chào buổi sáng,';
      if (h>=11 && h<13) return 'Chào buổi trưa,';
      if (h>=13 && h<18) return 'Chào buổi chiều,';
      if (h>=18 && h<21) return 'Chào buổi tối,';
      return 'Chúc ngủ ngon,';
    },
    tempLabel: 'NHIỆT ĐỘ',
    selectRoom: 'CHỌN PHÒNG',
    modeLabel: 'CHẾ ĐỘ',
    statusLabel: 'TRẠNG THÁI',
    statusOn: 'ĐANG CHẠY', statusOff: 'TẮT',
    airGood: 'Chất lượng không khí tốt', outdoorLabel: 'Ngoài trời', pressOn: 'Nhấn nguồn để bật',
    dustLabel: 'Bụi mịn',
    fanLabel: 'Tốc độ quạt', swingLabel: 'Hướng gió',
    allOff: 'Tắt tất cả', allOffSub: 'Nhấn để tắt mọi phòng',
    tapOff: 'Nhấn để tắt', tapOn: 'Nhấn để bật',
    confirmOff: '⚠ Tắt tất cả?', confirmSub: function(n) { return 'Sẽ tắt ' + n + ' điều hòa cùng lúc'; },
    cancel: 'Hủy', doOff: '⏻ Tắt hết',
    overlayOn: 'ĐANG BẬT', overlayOff: 'TẮT',
    modes: { cool:'Làm lạnh', heat:'Sưởi', dry:'Hút ẩm', fan_only:'Quạt', auto:'Tự động', off:'Tắt' },
    fans:   ['Tự động','Min','Thấp','Thấp-Vừa','Vừa','Vừa-Cao','Cao','Max','Thấp/Tự động','Cao/Tự động','Êm ái'],
    swings: ['Cố định','Lên xuống','Trái phải','Tất cả','Vị trí 1','Vị trí 2','Vị trí 3','Vị trí 4','Vị trí 5','Vị trí 6'],
    comfort: { dry:'Không khí khô ráo', fan_only:'Gió nhẹ mát mẻ', off:'Đang tắt' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Lạnh buốt, mặc thêm áo nhé!';
      if (t<=23) return 'Nhiệt độ lý tưởng, thư giãn thôi';
      if (t<=27) return 'Cảm giác dễ chịu, thoải mái';
      if (t<=31) return 'Hơi ấm, cần làm mát thêm';
      return 'Quá nóng! Hãy điều chỉnh nhiệt độ';
    },
    timerBtn: 'Hẹn giờ',
    timerTitle: '⏰ Hẹn giờ',
    timerOff: '⏹ Hẹn tắt', timerOn: '▶ Hẹn bật',
    timerMinPlaceholder: 'Nhập phút...', timerMinUnit: 'phút',
    timerDelete: 'Xóa hẹn', timerConfirm: 'Xác nhận',
    edViewMode: '🖥 Chế độ hiển thị',
    edViewModeFull: 'Full — Đầy đủ',
    edViewModeLite: 'Lite — Gọn nhẹ',
    edPopupStyle: '✨ Kiểu popup (Super Lite)',
    edPopupNormal: 'Normal',
    edPopupEffect: 'Effect',
    edPopupWave: 'Wave',
    edPresetBar: '🎛 Thanh tùy chọn (Eco / Fav / Clean)',
    edPresetBarDesc: 'Hiện dòng Eco · Fav · Clean',
    bgLabel: 'Màu nền gradient', bgPresets: 'Preset',
    colorLabel: 'Màu sắc', accentColor: 'Màu nhấn (accent)', textColor: 'Màu chữ',
    color1: 'Màu 1 (trên trái)', color2: 'Màu 2 (dưới phải)',
    edLang: 'Ngôn ngữ',
    edEntities: 'Thực thể (Entity)',
    edOwnerName: '👤 Tên hiển thị (Smart Home)',
    edDisplay: '👁 Tùy chọn hiển thị',
    edShowGreet: 'Lời chào', edShowGreetDesc: 'Hiện chào buổi sáng/chiều/tối',
    edShowCool: '❄ Làm lạnh (Cool)', edShowHeat: '🔥 Sưởi (Heat)',
    edShowDry: '💧 Hút ẩm (Dry)', edShowFanOnly: '🌀 Quạt (Fan)', edShowAuto: '🔄 Tự động (Auto)',
    edShowFan: 'Tốc độ quạt', edShowFanDesc: 'Hiện bảng điều chỉnh tốc độ quạt',
    edShowSwing: 'Hướng gió', edShowSwingDesc: 'Hiện bảng điều chỉnh hướng gió',
    edShowPreset: 'Thanh Eco/Fav/Clean', edShowPresetDesc: 'Hiện dòng Eco · Fav · Clean',
    edShowStatus: 'Bảng trạng thái', edShowStatusDesc: 'Hiện khối trạng thái & cảm biến bên phải',
    edShowAllOff: 'Nút Tắt tất cả', edShowAllOffDesc: 'Hiện nút tắt toàn bộ điều hòa',
    edShowTimer: 'Nút Hẹn giờ', edShowTimerDesc: 'Hiện nút hẹn giờ tắt/bật',
    edShowRoomEnv: 'Nhiệt độ/Độ ẩm phòng', edShowRoomEnvDesc: 'Hiện nhiệt độ & độ ẩm phòng đang chọn (Super Lite)',
    edShowSlFan: '💨 Tốc độ quạt (Super Lite)', edShowSlFanDesc: 'Hiện nút quạt trong Super Lite',
    edShowSlSwing: '🔄 Hướng gió (Super Lite)', edShowSlSwingDesc: 'Hiện nút hướng gió trong Super Lite',
    edShowSlRoomPower: '⚡ Tiêu thụ điện phòng (Super Lite)', edShowSlRoomPowerDesc: 'Hiện mức tiêu thụ điện phòng đang chọn',
    edPowerUnit: '⚡ Đơn vị công suất', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Đơn vị nhiệt độ', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Lặp lại bông tuyết (giây)', edCoolAnimSpeedDesc: 'Thời gian chờ giữa các lần bông tuyết bay (2–15s)',
    edShowOutdoorTemp: 'Nhiệt độ ngoài trời', edShowHumidity: 'Độ ẩm', edShowPower: 'Công suất (kW)',
    edRoomCountLabel: function(n) { return '🏠 Số lượng phòng (1–8, mặc định 4)'; },
    edRoomsHeader: function(n) { return '❄ Điều hòa (' + n + ' phòng)'; },
    edRooms: '❄ Điều hòa',
    edSensors: '📡 Cảm biến môi trường',
    edColors: 'Màu sắc',
    edBg: 'Màu nền',
    edBgAlpha: '🔆 Độ trong suốt nền', edBgTransparent: 'Trong suốt', edBgSolid: 'Đặc',
    edColorsAdvanced: '🎨 Màu sắc nâng cao',
    edColorsDefault: 'Để trống = dùng màu mặc định. Áp dụng realtime khi chọn.',
    edColorsReset: '↩ Đặt lại tất cả màu về mặc định',
    edColorsSecHeader: '📌 Header & Lời chào',
    edColorsDial: '🌡 Vòng tròn nhiệt độ',
    edColorsModeCtrl: '⚡ Chế độ & Điều khiển',
    edColorsStatusRoom: '🏠 Trạng thái & Tab phòng',
    edAcEntity: '❄ Entity điều hòa (climate.*)',
    edAcName: '🏷 Tên hiển thị',
    edAcIcon: '🎨 MDI Icon (vd: mdi:sofa)',
    edAcImage: '🖼 Ảnh phòng (URL)',
    edRoomTempEntity: '🌡 Cảm biến nhiệt độ phòng (nếu điều hòa không có)',
    edRoomHumidityEntity: '💧 Cảm biến độ ẩm phòng (nếu điều hòa không có)',
    edRoomPowerEntity: '⚡ Cảm biến tiêu thụ điện phòng (sensor.*)',
    edPm25: '🌫 Bụi mịn PM2.5',
    edOutdoorTemp: '🌡 Nhiệt độ ngoài trời',
    edHumidity: '💧 Độ ẩm ngoài trời',
    edPower: '⚡ Tiêu thụ điện (kW)',
    rooms: ['Phòng khách','Phòng ngủ','Phòng ăn','Văn phòng'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  en: {
    lang: 'English', flag: 'gb',
    cardTitle: 'Air Conditioning',
    cardSub:   'Smart Home',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Good morning,';
      if (h>=11 && h<13) return 'Good noon,';
      if (h>=13 && h<18) return 'Good afternoon,';
      if (h>=18 && h<21) return 'Good evening,';
      return 'Good night,';
    },
    tempLabel: 'TEMPERATURE',
    selectRoom: 'SELECT ROOM',
    modeLabel: 'MODE',
    statusLabel: 'STATUS',
    statusOn: 'RUNNING', statusOff: 'OFF',
    airGood: 'Air quality is good', outdoorLabel: 'Outdoor', pressOn: 'Press power to turn on',
    dustLabel: 'Fine dust',
    fanLabel: 'Fan speed', swingLabel: 'Airflow',
    allOff: 'Turn all off', allOffSub: 'Tap to turn off all rooms',
    tapOff: 'Tap to turn off', tapOn: 'Tap to turn on',
    confirmOff: '⚠ Turn all off?', confirmSub: function(n) { return 'Will turn off ' + n + ' AC units at once'; },
    cancel: 'Cancel', doOff: '⏻ Turn all off',
    overlayOn: 'ON', overlayOff: 'OFF',
    modes: { cool:'Cool', heat:'Heat', dry:'Dry', fan_only:'Fan', auto:'Auto', off:'Off' },
    fans:   ['Auto','Min','Low','Low-Mid','Medium','High-Mid','High','Max','Low/Auto','High/Auto','Quiet'],
    swings: ['Fixed','Up/Down','Left/Right','Both','Position 1','Position 2','Position 3','Position 4','Position 5','Position 6'],
    comfort: { dry:'Dry and comfortable', fan_only:'Light fresh breeze', off:'Currently off' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Very cold, grab a jacket!';
      if (t<=23) return 'Ideal temperature, relax';
      if (t<=27) return 'Comfortable and pleasant';
      if (t<=31) return 'A bit warm, cool down more';
      return 'Too hot! Adjust the temperature';
    },
    timerBtn: 'Timer',
    bgLabel: 'Gradient background',
    timerTitle: '⏰ Timer',
    timerOff: '⏹ Schedule off', timerOn: '▶ Schedule on',
    timerMinPlaceholder: 'Enter minutes...', timerMinUnit: 'min',
    timerDelete: 'Delete timer', timerConfirm: 'Confirm',
    edViewMode: '🖥 Display mode',
    edViewModeFull: 'Full — Complete view',
    edViewModeLite: 'Lite — Compact view',
    edPopupStyle: '✨ Popup style (Super Lite)',
    edPopupNormal: 'Normal',
    edPopupEffect: 'Effect',
    edPopupWave: 'Wave',
    edPresetBar: '🎛 Preset bar (Eco / Fav / Clean)',
    edPresetBarDesc: 'Show Eco · Fav · Clean row', bgPresets: 'Preset',
    colorLabel: 'Colors', accentColor: 'Accent color', textColor: 'Text color',
    color1: 'Color 1 (top left)', color2: 'Color 2 (bottom right)',
    edLang: 'Language',
    edEntities: 'Entities',
    edOwnerName: '👤 Display name (Smart Home)',
    edDisplay: '👁 Display options',
    edShowGreet: 'Greeting', edShowGreetDesc: 'Show morning/afternoon/evening greeting',
    edShowCool: '❄ Cool mode', edShowHeat: '🔥 Heat mode',
    edShowDry: '💧 Dry mode', edShowFanOnly: '🌀 Fan mode', edShowAuto: '🔄 Auto mode',
    edShowFan: 'Fan speed', edShowFanDesc: 'Show fan speed control panel',
    edShowSwing: 'Airflow', edShowSwingDesc: 'Show airflow direction panel',
    edShowPreset: 'Eco/Fav/Clean bar', edShowPresetDesc: 'Show Eco · Fav · Clean row',
    edShowStatus: 'Status panel', edShowStatusDesc: 'Show status & sensor block on the right',
    edShowAllOff: 'Turn all off button', edShowAllOffDesc: 'Show the turn-all-off button',
    edShowTimer: 'Timer button', edShowTimerDesc: 'Show the timer button',
    edShowRoomEnv: 'Room Temp / Humidity', edShowRoomEnvDesc: 'Show selected room temp & humidity (Super Lite)',
    edShowSlFan: '💨 Fan speed (Super Lite)', edShowSlFanDesc: 'Show fan button in Super Lite',
    edShowSlSwing: '🔄 Airflow (Super Lite)', edShowSlSwingDesc: 'Show airflow button in Super Lite',
    edShowSlRoomPower: '⚡ Room power (Super Lite)', edShowSlRoomPowerDesc: 'Show selected room power consumption',
    edPowerUnit: '⚡ Power unit', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Temperature unit', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Snowflake repeat (seconds)', edCoolAnimSpeedDesc: 'Wait time between snowflake animations (2–15s)',
    edShowOutdoorTemp: 'Outdoor temperature', edShowHumidity: 'Humidity', edShowPower: 'Power (kW)',
    edRoomCountLabel: function(n) { return '🏠 Number of rooms (1–8, default 4)'; },
    edRoomsHeader: function(n) { return '❄ Air Conditioners (' + n + ' rooms)'; },
    edRooms: '❄ Air Conditioners',
    edSensors: '📡 Environment Sensors',
    edColors: 'Colors',
    edBg: 'Background',
    edBgAlpha: '🔆 Background opacity', edBgTransparent: 'Transparent', edBgSolid: 'Solid',
    edColorsAdvanced: '🎨 Advanced colors',
    edColorsDefault: 'Leave blank = use default color. Applied in real time.',
    edColorsReset: '↩ Reset all colors to default',
    edColorsSecHeader: '📌 Header & Greeting',
    edColorsDial: '🌡 Temperature dial',
    edColorsModeCtrl: '⚡ Modes & Controls',
    edColorsStatusRoom: '🏠 Status & Room tabs',
    edAcEntity: '❄ AC entity (climate.*)',
    edAcName: '🏷 Display name',
    edAcIcon: '🎨 MDI Icon (vd: mdi:sofa)',
    edAcImage: '🖼 Ảnh phòng (URL)',
    edRoomTempEntity: '🌡 Room temperature sensor (if AC has none)',
    edRoomHumidityEntity: '💧 Room humidity sensor (if AC has none)',
    edRoomPowerEntity: '⚡ Room power sensor (sensor.*)',
    edPm25: '🌫 Fine dust PM2.5',
    edOutdoorTemp: '🌡 Outdoor temperature',
    edHumidity: '💧 Outdoor humidity',
    edPower: '⚡ Power consumption (kW)',
    rooms: ['Living room','Bedroom','Dining room','Office'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  de: {
    lang: 'Deutsch', flag: 'de',
    cardTitle: 'Klimaanlage',
    cardSub:   'Smart Home',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Guten Morgen,';
      if (h>=11 && h<13) return 'Guten Tag,';
      if (h>=13 && h<18) return 'Guten Nachmittag,';
      if (h>=18 && h<21) return 'Guten Abend,';
      return 'Gute Nacht,';
    },
    tempLabel: 'TEMPERATUR',
    selectRoom: 'RAUM WÄHLEN',
    modeLabel: 'MODUS',
    statusLabel: 'STATUS',
    statusOn: 'LÄUFT', statusOff: 'AUS',
    airGood: 'Luftqualität gut', outdoorLabel: 'Außen', pressOn: 'Einschalten drücken',
    dustLabel: 'Feinstaub',
    fanLabel: 'Lüfterstufe', swingLabel: 'Luftrichtung',
    allOff: 'Alle ausschalten', allOffSub: 'Alle Räume ausschalten',
    tapOff: 'Zum Ausschalten', tapOn: 'Zum Einschalten',
    confirmOff: '⚠ Alle ausschalten?', confirmSub: function(n) { return n + ' Klimaanlagen gleichzeitig ausschalten'; },
    cancel: 'Abbrechen', doOff: '⏻ Alle aus',
    overlayOn: 'AN', overlayOff: 'AUS',
    modes: { cool:'Kühlen', heat:'Heizen', dry:'Entfeuchten', fan_only:'Lüfter', auto:'Automatisch', off:'Aus' },
    fans:   ['Auto','Min','Niedrig','Niedrig-Mittel','Mittel','Mittel-Hoch','Hoch','Max','Niedrig/Auto','Hoch/Auto','Leise'],
    swings: ['Fest','Auf/Ab','Links/Rechts','Alle','Position 1','Position 2','Position 3','Position 4','Position 5','Position 6'],
    comfort: { dry:'Trockene Luft', fan_only:'Angenehme Brise', off:'Ausgeschaltet' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Sehr kalt, zieh etwas an!';
      if (t<=23) return 'Ideale Temperatur, entspann dich';
      if (t<=27) return 'Angenehm und komfortabel';
      if (t<=31) return 'Etwas warm, mehr kühlen';
      return 'Zu heiß! Temperatur anpassen';
    },
    timerBtn: 'Timer',
    bgLabel: 'Verlaufshintergrund',
    timerTitle: '⏰ Timer',
    timerOff: '⏹ Zeitplan aus', timerOn: '▶ Zeitplan an',
    timerMinPlaceholder: 'Minuten eingeben...', timerMinUnit: 'Min',
    timerDelete: 'Timer löschen', timerConfirm: 'Bestätigen',
    edViewMode: '🖥 Anzeigemodus',
    edViewModeFull: 'Full — Vollansicht',
    edViewModeLite: 'Lite — Kompaktansicht',
    edPopupStyle: '✨ Popup-Stil (Super Lite)',
    edPopupNormal: 'Normal',
    edPopupEffect: 'Effekt',
    edPopupWave: 'Welle',
    edPresetBar: '🎛 Voreinstellungsleiste (Eco / Fav / Clean)',
    edPresetBarDesc: 'Eco · Fav · Clean-Zeile anzeigen', bgPresets: 'Voreinstellung',
    colorLabel: 'Farben', accentColor: 'Akzentfarbe', textColor: 'Textfarbe',
    color1: 'Farbe 1 (oben links)', color2: 'Farbe 2 (unten rechts)',
    edLang: 'Sprache',
    edEntities: 'Entitäten',
    edOwnerName: '👤 Anzeigename (Smart Home)',
    edDisplay: '👁 Anzeigeoptionen',
    edShowGreet: 'Begrüßung', edShowGreetDesc: 'Morgen-/Abendgruß anzeigen',
    edShowCool: '❄ Kühlen', edShowHeat: '🔥 Heizen',
    edShowDry: '💧 Entfeuchten', edShowFanOnly: '🌀 Lüfter', edShowAuto: '🔄 Automatisch',
    edShowFan: 'Lüfterdrehzahl', edShowFanDesc: 'Lüftersteuerung anzeigen',
    edShowSwing: 'Luftrichtung', edShowSwingDesc: 'Luftrichtungssteuerung anzeigen',
    edShowPreset: 'Eco/Fav/Clean-Leiste', edShowPresetDesc: 'Eco · Fav · Clean-Zeile anzeigen',
    edShowStatus: 'Statusblock', edShowStatusDesc: 'Status- & Sensorblock rechts anzeigen',
    edShowAllOff: 'Alle-aus-Schaltfläche', edShowAllOffDesc: 'Alle-ausschalten-Schaltfläche anzeigen',
    edShowTimer: 'Timer-Schaltfläche', edShowTimerDesc: 'Timer-Schaltfläche anzeigen',
    edShowRoomEnv: 'Raum Temp/Luftfeuchte', edShowRoomEnvDesc: 'Raumtemp. & Luftfeuchte (Super Lite)',
    edShowSlFan: '💨 Lüftergeschwindigkeit (Super Lite)', edShowSlFanDesc: 'Lüftertaste in Super Lite anzeigen',
    edShowSlSwing: '🔄 Luftrichtung (Super Lite)', edShowSlSwingDesc: 'Luftrichtungstaste in Super Lite anzeigen',
    edShowSlRoomPower: '⚡ Raumleistung (Super Lite)', edShowSlRoomPowerDesc: 'Raumverbrauch der gewählten Zone anzeigen',
    edPowerUnit: '⚡ Leistungseinheit', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Temperatureinheit', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Schneeflocke wiederholen (s)', edCoolAnimSpeedDesc: 'Wartezeit zwischen Animationen (2–15s)',
    edShowOutdoorTemp: 'Außentemperatur', edShowHumidity: 'Luftfeuchtigkeit', edShowPower: 'Leistung (kW)',
    edRoomCountLabel: function(n) { return '🏠 Anzahl der Räume (1–8, Standard 4)'; },
    edRoomsHeader: function(n) { return '❄ Klimaanlagen (' + n + ' Räume)'; },
    edRooms: '❄ Klimaanlagen',
    edSensors: '📡 Umgebungssensoren',
    edColors: 'Farben',
    edBg: 'Hintergrund',
    edBgAlpha: '🔆 Hintergrundtransparenz', edBgTransparent: 'Transparent', edBgSolid: 'Deckend',
    edColorsAdvanced: '🎨 Erweiterte Farben',
    edColorsDefault: 'Leer lassen = Standardfarbe. Wird in Echtzeit übernommen.',
    edColorsReset: '↩ Alle Farben zurücksetzen',
    edColorsSecHeader: '📌 Header & Begrüßung',
    edColorsDial: '🌡 Temperaturanzeige',
    edColorsModeCtrl: '⚡ Modi & Steuerung',
    edColorsStatusRoom: '🏠 Status & Raumtabs',
    edAcEntity: '❄ Klimaanlage-Entity (climate.*)',
    edRoomTempEntity: '🌡 Raumtemperatursensor (falls Klimaanlage keinen hat)',
    edRoomHumidityEntity: '💧 Raumfeuchtigkeitssensor (falls Klimaanlage keinen hat)',
    edRoomPowerEntity: '⚡ Raumleistungssensor (sensor.*)',
    edAcName: '🏷 Anzeigename',
    edAcIcon: '🎨 MDI Icon (z.B. mdi:sofa)',
    edAcImage: '🖼 Raumfoto (URL)',
    edPm25: '🌫 Feinstaub PM2.5',
    edOutdoorTemp: '🌡 Außentemperatur',
    edHumidity: '💧 Außenluftfeuchtigkeit',
    edPower: '⚡ Stromverbrauch (kW)',
    rooms: ['Wohnzimmer','Schlafzimmer','Esszimmer','Büro'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  fr: {
    lang: 'Français', flag: 'fr',
    cardTitle: 'Climatisation',
    cardSub:   'Maison Intelligente',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Bonjour,';
      if (h>=11 && h<13) return 'Bonne journée,';
      if (h>=13 && h<18) return 'Bon après-midi,';
      if (h>=18 && h<21) return 'Bonsoir,';
      return 'Bonne nuit,';
    },
    tempLabel: 'TEMPÉRATURE',
    selectRoom: 'CHOISIR PIÈCE',
    modeLabel: 'MODE',
    statusLabel: 'STATUT',
    statusOn: 'EN MARCHE', statusOff: 'ÉTEINT',
    airGood: 'Qualité de l\'air bonne', outdoorLabel: 'Extérieur', pressOn: 'Appuyer pour allumer',
    dustLabel: 'Particules fines',
    fanLabel: 'Vitesse ventilateur', swingLabel: 'Direction d\'air',
    allOff: 'Tout éteindre', allOffSub: 'Éteindre toutes les pièces',
    tapOff: 'Appuyer pour éteindre', tapOn: 'Appuyer pour allumer',
    confirmOff: '⚠ Tout éteindre?', confirmSub: function(n) { return 'Éteindra ' + n + ' climatiseurs à la fois'; },
    cancel: 'Annuler', doOff: '⏻ Tout éteindre',
    overlayOn: 'ALLUMÉ', overlayOff: 'ÉTEINT',
    modes: { cool:'Refroidir', heat:'Chauffer', dry:'Déshumidifier', fan_only:'Ventilateur', auto:'Automatique', off:'Éteint' },
    fans:   ['Auto','Min','Faible','Faible-Moyen','Moyen','Moyen-Élevé','Élevé','Max','Faible/Auto','Élevé/Auto','Silencieux'],
    swings: ['Fixe','Haut/Bas','Gauche/Droite','Tous','Position 1','Position 2','Position 3','Position 4','Position 5','Position 6'],
    comfort: { dry:'Air sec et confortable', fan_only:'Brise légère et fraîche', off:'Actuellement éteint' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Très froid, mettez une veste!';
      if (t<=23) return 'Température idéale, détendez-vous';
      if (t<=27) return 'Confortable et agréable';
      if (t<=31) return 'Un peu chaud, refroidir davantage';
      return 'Trop chaud! Ajustez la température';
    },
    timerBtn: 'Minuterie',
    timerTitle: '⏰ Minuterie',
    timerOff: '⏹ Programmer arrêt', timerOn: '▶ Programmer allumage',
    timerMinPlaceholder: 'Entrer minutes...', timerMinUnit: 'min',
    timerDelete: 'Supprimer minuterie', timerConfirm: 'Confirmer',
    edViewMode: '🖥 Mode d\'affichage',
    edViewModeFull: 'Full — Vue complète',
    edViewModeLite: 'Lite — Vue compacte',
    edPopupStyle: '✨ Style popup (Super Lite)',
    edPopupNormal: 'Normal',
    edPopupEffect: 'Effet',
    edPopupWave: 'Vague',
    edPresetBar: '🎛 Barre de préréglages (Eco / Fav / Clean)',
    edPresetBarDesc: 'Afficher la ligne Eco · Fav · Clean',
    bgLabel: 'Dégradé de fond', bgPresets: 'Préréglage',
    colorLabel: 'Couleurs', accentColor: 'Couleur d\'accent', textColor: 'Couleur du texte',
    color1: 'Couleur 1 (haut gauche)', color2: 'Couleur 2 (bas droite)',
    edLang: 'Langue',
    edEntities: 'Entités',
    edOwnerName: '👤 Nom affiché (Maison Intelligente)',
    edDisplay: '👁 Options d\'affichage',
    edShowGreet: 'Salutation', edShowGreetDesc: 'Afficher la salutation matin/soir',
    edShowCool: '❄ Refroidir', edShowHeat: '🔥 Chauffer',
    edShowDry: '💧 Déshumidifier', edShowFanOnly: '🌀 Ventilateur', edShowAuto: '🔄 Auto',
    edShowFan: 'Vitesse ventilateur', edShowFanDesc: 'Afficher le panneau de vitesse',
    edShowSwing: 'Direction d\'air', edShowSwingDesc: 'Afficher le panneau de direction',
    edShowPreset: 'Barre Eco/Fav/Clean', edShowPresetDesc: 'Afficher la ligne Eco · Fav · Clean',
    edShowStatus: 'Bloc de statut', edShowStatusDesc: 'Afficher le bloc statut & capteurs',
    edShowAllOff: 'Bouton Tout éteindre', edShowAllOffDesc: 'Afficher le bouton tout éteindre',
    edShowTimer: 'Bouton minuterie', edShowTimerDesc: 'Afficher le bouton minuterie',
    edShowRoomEnv: 'Temp/Humidité pièce', edShowRoomEnvDesc: 'Afficher temp. & humidité de la pièce (Super Lite)',
    edShowSlFan: '💨 Vitesse ventilateur (Super Lite)', edShowSlFanDesc: 'Afficher bouton ventilateur en Super Lite',
    edShowSlSwing: '🔄 Direction air (Super Lite)', edShowSlSwingDesc: 'Afficher bouton direction en Super Lite',
    edShowSlRoomPower: '⚡ Consommation pièce (Super Lite)', edShowSlRoomPowerDesc: 'Afficher la consommation de la pièce sélectionnée',
    edPowerUnit: '⚡ Unité puissance', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Unité de température', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Répétition flocon (s)', edCoolAnimSpeedDesc: 'Délai entre les animations (2–15s)',
    edShowOutdoorTemp: 'Température extérieure', edShowHumidity: 'Humidité', edShowPower: 'Puissance (kW)',
    edRoomCountLabel: function(n) { return '🏠 Nombre de pièces (1–8, défaut 4)'; },
    edRoomsHeader: function(n) { return '❄ Climatiseurs (' + n + ' pièces)'; },
    edRooms: '❄ Climatiseurs',
    edSensors: '📡 Capteurs environnementaux',
    edColors: 'Couleurs',
    edBg: 'Arrière-plan',
    edBgAlpha: '🔆 Opacité du fond', edBgTransparent: 'Transparent', edBgSolid: 'Opaque',
    edColorsAdvanced: '🎨 Couleurs avancées',
    edColorsDefault: 'Laisser vide = couleur par défaut. Appliqué en temps réel.',
    edColorsReset: '↩ Réinitialiser toutes les couleurs',
    edColorsSecHeader: '📌 En-tête & Salutation',
    edColorsDial: '🌡 Cadran de température',
    edColorsModeCtrl: '⚡ Modes & Contrôles',
    edColorsStatusRoom: '🏠 Statut & Onglets pièces',
    edAcEntity: '❄ Entité clim. (climate.*)',
    edRoomTempEntity: '🌡 Capteur température pièce (si clim. n\'en a pas)',
    edRoomHumidityEntity: '💧 Capteur humidité pièce (si clim. n\'en a pas)',
    edRoomPowerEntity: '⚡ Capteur consommation pièce (sensor.*)',
    edAcName: '🏷 Nom affiché',
    edAcIcon: '🎨 Icône MDI (ex: mdi:sofa)',
    edAcImage: '🖼 Photo pièce (URL)',
    edPm25: '🌫 Particules fines PM2.5',
    edOutdoorTemp: '🌡 Température extérieure',
    edHumidity: '💧 Humidité extérieure',
    edPower: '⚡ Consommation (kW)',
    rooms: ['Salon','Chambre','Salle à manger','Bureau'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  nl: {
    lang: 'Nederlands', flag: 'nl',
    cardTitle: 'Airconditioning',
    cardSub:   'Slim Huis',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Goedemorgen,';
      if (h>=11 && h<13) return 'Goedemiddag,';
      if (h>=13 && h<18) return 'Goedemiddag,';
      if (h>=18 && h<21) return 'Goedenavond,';
      return 'Goedenacht,';
    },
    tempLabel: 'TEMPERATUUR',
    selectRoom: 'KAMER KIEZEN',
    modeLabel: 'MODUS',
    statusLabel: 'STATUS',
    statusOn: 'ACTIEF', statusOff: 'UIT',
    airGood: 'Luchtkwaliteit goed', outdoorLabel: 'Buiten', pressOn: 'Druk om in te schakelen',
    dustLabel: 'Fijnstof',
    fanLabel: 'Ventilatorsnelheid', swingLabel: 'Luchtrichting',
    allOff: 'Alles uitschakelen', allOffSub: 'Alle kamers uitschakelen',
    tapOff: 'Tik om uit te schakelen', tapOn: 'Tik om in te schakelen',
    confirmOff: '⚠ Alles uitschakelen?', confirmSub: function(n) { return n + ' airconditioners tegelijk uitschakelen'; },
    cancel: 'Annuleren', doOff: '⏻ Alles uit',
    overlayOn: 'AAN', overlayOff: 'UIT',
    modes: { cool:'Koelen', heat:'Verwarmen', dry:'Ontvochtigen', fan_only:'Ventilator', auto:'Automatisch', off:'Uit' },
    fans:   ['Auto','Min','Laag','Laag-Medium','Medium','Medium-Hoog','Hoog','Max','Laag/Auto','Hoog/Auto','Stil'],
    swings: ['Vast','Op/Neer','Links/Rechts','Alle','Positie 1','Positie 2','Positie 3','Positie 4','Positie 5','Positie 6'],
    comfort: { dry:'Droge lucht', fan_only:'Lichte frisse bries', off:'Momenteel uit' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Erg koud, trek iets aan!';
      if (t<=23) return 'Ideale temperatuur, ontspan';
      if (t<=27) return 'Aangenaam en comfortabel';
      if (t<=31) return 'Iets warm, meer koelen';
      return 'Te heet! Temperatuur aanpassen';
    },
    timerBtn: 'Timer',
    bgLabel: 'Verloopachtergrond',
    timerTitle: '⏰ Timer',
    timerOff: '⏹ Schema uit', timerOn: '▶ Schema aan',
    timerMinPlaceholder: 'Minuten invoeren...', timerMinUnit: 'min',
    timerDelete: 'Timer verwijderen', timerConfirm: 'Bevestigen',
    edViewMode: '🖥 Weergavemodus',
    edViewModeFull: 'Full — Volledige weergave',
    edViewModeLite: 'Lite — Compacte weergave',
    edPopupStyle: '✨ Popup-stijl (Super Lite)',
    edPopupNormal: 'Normaal',
    edPopupEffect: 'Effect',
    edPopupWave: 'Golf',
    edPresetBar: '🎛 Voorkeuzeknoppenbalk (Eco / Fav / Clean)',
    edPresetBarDesc: 'Eco · Fav · Clean-rij weergeven', bgPresets: 'Voorinstelling',
    colorLabel: 'Kleuren', accentColor: 'Accentkleur', textColor: 'Tekstkleur',
    color1: 'Kleur 1 (linksboven)', color2: 'Kleur 2 (rechtsonder)',
    edLang: 'Taal',
    edEntities: 'Entiteiten',
    edOwnerName: '👤 Weergavenaam (Slim Huis)',
    edDisplay: '👁 Weergaveopties',
    edShowGreet: 'Begroeting', edShowGreetDesc: 'Ochtend-/avondgroet weergeven',
    edShowCool: '❄ Koelen', edShowHeat: '🔥 Verwarmen',
    edShowDry: '💧 Ontvochtigen', edShowFanOnly: '🌀 Ventilator', edShowAuto: '🔄 Auto',
    edShowFan: 'Ventilatorsnelheid', edShowFanDesc: 'Ventilatorregeling weergeven',
    edShowSwing: 'Luchtrichting', edShowSwingDesc: 'Luchtrichtingsregeling weergeven',
    edShowPreset: 'Eco/Fav/Clean-balk', edShowPresetDesc: 'Eco · Fav · Clean-rij weergeven',
    edShowStatus: 'Statusblok', edShowStatusDesc: 'Status- & sensorblok rechts weergeven',
    edShowAllOff: 'Alles-uit-knop', edShowAllOffDesc: 'Alles-uitschakelknop weergeven',
    edShowTimer: 'Timerknop', edShowTimerDesc: 'Timerknop weergeven',
    edShowRoomEnv: 'Kamer Temp/Vochtigheid', edShowRoomEnvDesc: 'Kamertemp. & vochtigheid tonen (Super Lite)',
    edShowSlFan: '💨 Ventilatorsnelheid (Super Lite)', edShowSlFanDesc: 'Ventilatorknop tonen in Super Lite',
    edShowSlSwing: '🔄 Luchtrichting (Super Lite)', edShowSlSwingDesc: 'Luchtrichtingsknop tonen in Super Lite',
    edShowSlRoomPower: '⚡ Kamerverbruik (Super Lite)', edShowSlRoomPowerDesc: 'Verbruik geselecteerde kamer tonen',
    edPowerUnit: '⚡ Vermogenseenheid', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Temperatuureenheid', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Sneeuwvlok herhalen (s)', edCoolAnimSpeedDesc: 'Wachttijd tussen animaties (2–15s)',
    edShowOutdoorTemp: 'Buitentemperatuur', edShowHumidity: 'Vochtigheid', edShowPower: 'Vermogen (kW)',
    edRoomCountLabel: function(n) { return '🏠 Aantal kamers (1–8, standaard 4)'; },
    edRoomsHeader: function(n) { return '❄ Airconditioners (' + n + ' kamers)'; },
    edRooms: '❄ Airconditioners',
    edSensors: '📡 Omgevingssensoren',
    edColors: 'Kleuren',
    edBg: 'Achtergrond',
    edBgAlpha: '🔆 Achtergrondtransparantie', edBgTransparent: 'Transparant', edBgSolid: 'Ondoorzichtig',
    edColorsAdvanced: '🎨 Geavanceerde kleuren',
    edColorsDefault: 'Leeg laten = standaardkleur. Direct toegepast.',
    edColorsReset: '↩ Alle kleuren terugzetten',
    edColorsSecHeader: '📌 Koptekst & Begroeting',
    edColorsDial: '🌡 Temperatuurmeter',
    edColorsModeCtrl: '⚡ Modi & Bediening',
    edColorsStatusRoom: '🏠 Status & Kamer-tabs',
    edAcEntity: '❄ AC-entiteit (climate.*)',
    edRoomTempEntity: '🌡 Kamertemperatuursensor (als AC dit niet heeft)',
    edRoomHumidityEntity: '💧 Kamerluchtvochtigheidssensor (als AC dit niet heeft)',
    edRoomPowerEntity: '⚡ Kamer vermogenssensor (sensor.*)',
    edAcName: '🏷 Weergavenaam',
    edAcIcon: '🎨 MDI Icoon (bijv. mdi:sofa)',
    edAcImage: '🖼 Kamerafoto (URL)',
    edPm25: '🌫 Fijnstof PM2.5',
    edOutdoorTemp: '🌡 Buitentemperatuur',
    edHumidity: '💧 Buitenvochtigheid',
    edPower: '⚡ Stroomverbruik (kW)',
    rooms: ['Woonkamer','Slaapkamer','Eetkamer','Kantoor'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  pl: {
    lang: 'Polski', flag: 'pl',
    cardTitle: 'Klimatyzacja',
    cardSub:   'Inteligentny Dom',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Dzień dobry,';
      if (h>=11 && h<13) return 'Dobry dzień,';
      if (h>=13 && h<18) return 'Dzień dobry,';
      if (h>=18 && h<21) return 'Dobry wieczór,';
      return 'Dobranoc,';
    },
    tempLabel: 'TEMPERATURA',
    selectRoom: 'WYBIERZ POKÓJ',
    modeLabel: 'TRYB',
    statusLabel: 'STATUS',
    statusOn: 'DZIAŁA', statusOff: 'WYŁ',
    airGood: 'Jakość powietrza dobra', outdoorLabel: 'Outdoor', pressOn: 'Naciśnij aby włączyć',
    dustLabel: 'Pył zawieszony',
    fanLabel: 'Prędkość wentylatora', swingLabel: 'Kierunek przepływu',
    allOff: 'Wyłącz wszystkie', allOffSub: 'Naciśnij aby wyłączyć wszystkie pokoje',
    tapOff: 'Naciśnij aby wyłączyć', tapOn: 'Naciśnij aby włączyć',
    confirmOff: '⚠ Wyłączyć wszystkie?', confirmSub: function(n) { return 'Wyłączy ' + n + ' klimatyzatorów naraz'; },
    cancel: 'Anuluj', doOff: '⏻ Wyłącz wszystkie',
    overlayOn: 'WŁ', overlayOff: 'WYŁ',
    modes: { cool:'Chłodzenie', heat:'Ogrzewanie', dry:'Osuszanie', fan_only:'Wentylator', auto:'Auto', off:'Wyłącz' },
    fans:   ['Auto','Min','Niski','Niski-Średni','Średni','Średni-Wysoki','Wysoki','Max','Niski/Auto','Wysoki/Auto','Cichy'],
    swings: ['Stały','Góra/Dół','Lewo/Prawo','Wszystkie','Pozycja 1','Pozycja 2','Pozycja 3','Pozycja 4','Pozycja 5','Pozycja 6'],
    comfort: { dry:'Suche powietrze', fan_only:'Lekka świeża bryza', off:'Aktualnie wyłączone' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Bardzo zimno, ubierz się!';
      if (t<=23) return 'Idealna temperatura, zrelaksuj się';
      if (t<=27) return 'Wygodnie i przyjemnie';
      if (t<=31) return 'Trochę ciepło, więcej chłodzić';
      return 'Zbyt gorąco! Dostosuj temperaturę';
    },
    timerBtn: 'Timer',
    bgLabel: 'Tło gradientowe',
    timerTitle: '⏰ Timer',
    timerOff: '⏹ Zaplanuj wyłączenie', timerOn: '▶ Zaplanuj włączenie',
    timerMinPlaceholder: 'Wprowadź minuty...', timerMinUnit: 'min',
    timerDelete: 'Usuń timer', timerConfirm: 'Potwierdź',
    edViewMode: '🖥 Tryb wyświetlania',
    edViewModeFull: 'Full — Pełny widok',
    edViewModeLite: 'Lite — Widok kompaktowy',
    edPopupStyle: '✨ Styl okienka (Super Lite)',
    edPopupNormal: 'Normalny',
    edPopupEffect: 'Efekt',
    edPopupWave: 'Fala',
    edPresetBar: '🎛 Pasek presetu (Eco / Fav / Clean)',
    edPresetBarDesc: 'Pokaż wiersz Eco · Fav · Clean', bgPresets: 'Ustawienie wstępne',
    colorLabel: 'Kolory', accentColor: 'Kolor akcentu', textColor: 'Kolor tekstu',
    color1: 'Kolor 1 (lewy górny)', color2: 'Kolor 2 (prawy dolny)',
    edLang: 'Język',
    edEntities: 'Encje',
    edOwnerName: '👤 Nazwa wyświetlana (Inteligentny Dom)',
    edDisplay: '👁 Opcje wyświetlania',
    edShowGreet: 'Powitanie', edShowGreetDesc: 'Pokaż powitanie rano/wieczorem',
    edShowCool: '❄ Chłodzenie', edShowHeat: '🔥 Ogrzewanie',
    edShowDry: '💧 Osuszanie', edShowFanOnly: '🌀 Wentylator', edShowAuto: '🔄 Auto',
    edShowFan: 'Prędkość wentylatora', edShowFanDesc: 'Pokaż panel prędkości wentylatora',
    edShowSwing: 'Kierunek przepływu', edShowSwingDesc: 'Pokaż panel kierunku przepływu',
    edShowPreset: 'Pasek Eco/Fav/Clean', edShowPresetDesc: 'Pokaż wiersz Eco · Fav · Clean',
    edShowStatus: 'Blok statusu', edShowStatusDesc: 'Pokaż blok statusu i czujników po prawej',
    edShowAllOff: 'Przycisk wyłącz wszystkie', edShowAllOffDesc: 'Pokaż przycisk wyłącz wszystkie',
    edShowTimer: 'Przycisk timera', edShowTimerDesc: 'Pokaż przycisk timera',
    edShowRoomEnv: 'Temp/Wilgotność pokoju', edShowRoomEnvDesc: 'Pokaż temp. i wilgotność pokoju (Super Lite)',
    edShowSlFan: '💨 Prędkość wentylatora (Super Lite)', edShowSlFanDesc: 'Pokaż przycisk wentylatora w Super Lite',
    edShowSlSwing: '🔄 Kierunek powietrza (Super Lite)', edShowSlSwingDesc: 'Pokaż przycisk kierunku w Super Lite',
    edShowSlRoomPower: '⚡ Moc pokoju (Super Lite)', edShowSlRoomPowerDesc: 'Pokaż zużycie wybranego pokoju',
    edPowerUnit: '⚡ Jednostka mocy', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Jednostka temperatury', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Powtarzanie płatka śniegu (s)', edCoolAnimSpeedDesc: 'Czas oczekiwania między animacjami (2–15s)',
    edShowOutdoorTemp: 'Temperatura zewnętrzna', edShowHumidity: 'Wilgotność', edShowPower: 'Moc (kW)',
    edRoomCountLabel: function(n) { return '🏠 Liczba pokojów (1–8, domyślnie 4)'; },
    edRoomsHeader: function(n) { return '❄ Klimatyzatory (' + n + ' pokoje)'; },
    edRooms: '❄ Klimatyzatory',
    edSensors: '📡 Czujniki środowiskowe',
    edColors: 'Kolory',
    edBg: 'Tło',
    edBgAlpha: '🔆 Przezroczystość tła', edBgTransparent: 'Przezroczyste', edBgSolid: 'Nieprzezroczyste',
    edColorsAdvanced: '🎨 Zaawansowane kolory',
    edColorsDefault: 'Zostaw puste = kolor domyślny. Stosowane w czasie rzeczywistym.',
    edColorsReset: '↩ Resetuj wszystkie kolory',
    edColorsSecHeader: '📌 Nagłówek & Powitanie',
    edColorsDial: '🌡 Wskaźnik temperatury',
    edColorsModeCtrl: '⚡ Tryby & Sterowanie',
    edColorsStatusRoom: '🏠 Status & Zakładki pokojów',
    edAcEntity: '❄ Encja klimatyzatora (climate.*)',
    edRoomTempEntity: '🌡 Czujnik temperatury pokoju (jeśli AC nie ma)',
    edRoomHumidityEntity: '💧 Czujnik wilgotności pokoju (jeśli AC nie ma)',
    edRoomPowerEntity: '⚡ Czujnik mocy pokoju (sensor.*)',
    edAcName: '🏷 Nazwa wyświetlana',
    edAcIcon: '🎨 MDI Ikona (np. mdi:sofa)',
    edAcImage: '🖼 Zdjęcie pokoju (URL)',
    edPm25: '🌫 Pył zawieszony PM2.5',
    edOutdoorTemp: '🌡 Temperatura zewnętrzna',
    edHumidity: '💧 Wilgotność zewnętrzna',
    edPower: '⚡ Zużycie energii (kW)',
    rooms: ['Salon','Sypialnia','Jadalnia','Biuro'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  sv: {
    lang: 'Svenska', flag: 'se',
    cardTitle: 'Luftkonditionering',
    cardSub:   'Smart Hem',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'God morgon,';
      if (h>=11 && h<13) return 'God dag,';
      if (h>=13 && h<18) return 'God eftermiddag,';
      if (h>=18 && h<21) return 'God kväll,';
      return 'God natt,';
    },
    tempLabel: 'TEMPERATUR',
    selectRoom: 'VÄLJ RUM',
    modeLabel: 'LÄGE',
    statusLabel: 'STATUS',
    statusOn: 'IGÅNG', statusOff: 'AV',
    airGood: 'Luftkvalitet bra', pressOn: 'Tryck för att slå på',
    dustLabel: 'Fint damm',
    fanLabel: 'Fläkthastighet', swingLabel: 'Luftriktning',
    allOff: 'Stäng av alla', allOffSub: 'Stäng av alla rum',
    tapOff: 'Tryck för att stänga av', tapOn: 'Tryck för att slå på',
    confirmOff: '⚠ Stäng av alla?', confirmSub: function(n) { return 'Stänger av ' + n + ' AC-enheter'; },
    cancel: 'Avbryt', doOff: '⏻ Stäng av alla',
    overlayOn: 'PÅ', overlayOff: 'AV',
    modes: { cool:'Kyla', heat:'Värme', dry:'Avfuktning', fan_only:'Fläkt', auto:'Auto', off:'Av' },
    fans:   ['Auto','Min','Låg','Låg-Medel','Medel','Medel-Hög','Hög','Max','Låg/Auto','Hög/Auto','Tyst'],
    swings: ['Fast','Upp/Ned','Vänster/Höger','Alla','Position 1','Position 2','Position 3','Position 4','Position 5','Position 6'],
    comfort: { dry:'Torr luft', fan_only:'Lätt fräsch bris', off:'För närvarande av' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Mycket kallt, ta på dig något!';
      if (t<=23) return 'Idealisk temperatur, koppla av';
      if (t<=27) return 'Bekväm och trevlig';
      if (t<=31) return 'Lite varmt, kyl mer';
      return 'För varmt! Justera temperaturen';
    },
    timerBtn: 'Timer',
    bgLabel: 'Gradientbakgrund',
    timerTitle: '⏰ Timer',
    timerOff: '⏹ Schemalägg av', timerOn: '▶ Schemalägg på',
    timerMinPlaceholder: 'Ange minuter...', timerMinUnit: 'min',
    timerDelete: 'Ta bort timer', timerConfirm: 'Bekräfta',
    edViewMode: '🖥 Visningsläge',
    edViewModeFull: 'Full — Fullständig vy',
    edViewModeLite: 'Lite — Kompakt vy',
    edPopupStyle: '✨ Popup-stil (Super Lite)',
    edPopupNormal: 'Normal',
    edPopupEffect: 'Effekt',
    edPopupWave: 'Våg',
    edPresetBar: '🎛 Förinställningsfält (Eco / Fav / Clean)',
    edPresetBarDesc: 'Visa Eco · Fav · Clean-rad', bgPresets: 'Förinställning',
    colorLabel: 'Färger', accentColor: 'Accentfärg', textColor: 'Textfärg',
    color1: 'Färg 1 (övre vänster)', color2: 'Färg 2 (nedre höger)',
    edLang: 'Språk',
    edEntities: 'Entiteter',
    edOwnerName: '👤 Visningsnamn (Smart Hem)',
    edDisplay: '👁 Visningsalternativ',
    edShowGreet: 'Hälsning', edShowGreetDesc: 'Visa morgon-/kvällshälsning',
    edShowCool: '❄ Kyla', edShowHeat: '🔥 Värme',
    edShowDry: '💧 Torr', edShowFanOnly: '🌀 Fläkt', edShowAuto: '🔄 Auto',
    edShowFan: 'Fläkthastighet', edShowFanDesc: 'Visa fläkthastighetspanel',
    edShowSwing: 'Luftriktning', edShowSwingDesc: 'Visa luftriktningspanel',
    edShowPreset: 'Eco/Fav/Clean-fält', edShowPresetDesc: 'Visa Eco · Fav · Clean-rad',
    edShowStatus: 'Statusblock', edShowStatusDesc: 'Visa status- & sensorblock till höger',
    edShowAllOff: 'Stäng av alla-knapp', edShowAllOffDesc: 'Visa stäng av alla-knapp',
    edShowTimer: 'Timerknapp', edShowTimerDesc: 'Visa timerknapp',
    edShowRoomEnv: 'Rumstemperatur/Luftfuktighet', edShowRoomEnvDesc: 'Visa rumstemperatur & luftfuktighet (Super Lite)',
    edShowSlFan: '💨 Fläkthastighet (Super Lite)', edShowSlFanDesc: 'Visa fläktknapp i Super Lite',
    edShowSlSwing: '🔄 Luftriktning (Super Lite)', edShowSlSwingDesc: 'Visa luftriktningsknapp i Super Lite',
    edShowSlRoomPower: '⚡ Rumseffekt (Super Lite)', edShowSlRoomPowerDesc: 'Visa elförbrukning för valt rum',
    edPowerUnit: '⚡ Effektenhet', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Temperaturenhet', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Upprepa snöflingan (s)', edCoolAnimSpeedDesc: 'Väntetid mellan animationer (2–15s)',
    edShowOutdoorTemp: 'Utomhustemperatur', edShowHumidity: 'Luftfuktighet', edShowPower: 'Effekt (kW)',
    edRoomCountLabel: function(n) { return '🏠 Antal rum (1–8, standard 4)'; },
    edRoomsHeader: function(n) { return '❄ Luftkonditioneringar (' + n + ' rum)'; },
    edRooms: '❄ Luftkonditioneringar',
    edSensors: '📡 Miljösensorer',
    edColors: 'Färger',
    edBg: 'Bakgrund',
    edBgAlpha: '🔆 Bakgrundstransparens', edBgTransparent: 'Transparent', edBgSolid: 'Ogenomskinlig',
    edColorsAdvanced: '🎨 Avancerade färger',
    edColorsDefault: 'Lämna tomt = standardfärg. Tillämpas i realtid.',
    edColorsReset: '↩ Återställ alla färger',
    edColorsSecHeader: '📌 Rubrik & Hälsning',
    edColorsDial: '🌡 Temperaturmätare',
    edColorsModeCtrl: '⚡ Lägen & Styrning',
    edColorsStatusRoom: '🏠 Status & Rumflikar',
    edAcEntity: '❄ AC-entitet (climate.*)',
    edRoomTempEntity: '🌡 Rumstemperatursensor (om AC saknar det)',
    edRoomHumidityEntity: '💧 Rumsfuktighetssensor (om AC saknar det)',
    edRoomPowerEntity: '⚡ Rumseffektsensor (sensor.*)',
    edAcName: '🏷 Visningsnamn',
    edAcIcon: '🎨 MDI Ikon (t.ex. mdi:sofa)',
    edAcImage: '🖼 Rumsfoto (URL)',
    edPm25: '🌫 Fint damm PM2.5',
    edOutdoorTemp: '🌡 Utomhustemperatur',
    edHumidity: '💧 Utomhusfuktighet',
    edPower: '⚡ Elförbrukning (kW)',
    rooms: ['Vardagsrum','Sovrum','Matsal','Kontor'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  hu: {
    lang: 'Magyar', flag: 'hu',
    cardTitle: 'Légkondicionáló',
    cardSub:   'Okos Otthon',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Jó reggelt,';
      if (h>=11 && h<13) return 'Jó napot,';
      if (h>=13 && h<18) return 'Jó napot,';
      if (h>=18 && h<21) return 'Jó estét,';
      return 'Jó éjszakát,';
    },
    tempLabel: 'HŐMÉRSÉKLET',
    selectRoom: 'SZOBA VÁLASZTÁSA',
    modeLabel: 'MÓD',
    statusLabel: 'ÁLLAPOT',
    statusOn: 'MŰKÖDİK', statusOff: 'KI',
    airGood: 'Levegőminőség jó', pressOn: 'Nyomja meg a bekapcsoláshoz',
    dustLabel: 'Finom por',
    fanLabel: 'Ventilátorsebesség', swingLabel: 'Légáramlás iránya',
    allOff: 'Mindet kikapcsolni', allOffSub: 'Összes szoba kikapcsolása',
    tapOff: 'Érintse ki a kikapcsoláshoz', tapOn: 'Érintse meg a bekapcsoláshoz',
    confirmOff: '⚠ Mindet kikapcsolni?', confirmSub: function(n) { return n + ' légkondicionálót kapcsol ki egyszerre'; },
    cancel: 'Mégse', doOff: '⏻ Mindet ki',
    overlayOn: 'BE', overlayOff: 'KI',
    modes: { cool:'Hűtés', heat:'Fűtés', dry:'Párátlanítás', fan_only:'Ventilátor', auto:'Auto', off:'Ki' },
    fans:   ['Auto','Min','Alacsony','Alacsony-Közepes','Közepes','Közepes-Magas','Magas','Max','Alacsony/Auto','Magas/Auto','Csendes'],
    swings: ['Rögzített','Fel/Le','Bal/Jobb','Mindkettő','1. pozíció','2. pozíció','3. pozíció','4. pozíció','5. pozíció','6. pozíció'],
    comfort: { dry:'Száraz levegő', fan_only:'Könnyű friss szellő', off:'Jelenleg kikapcsolt' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Nagyon hideg, vegyél fel valamit!';
      if (t<=23) return 'Ideális hőmérséklet, pihenj';
      if (t<=27) return 'Kényelmes és kellemes';
      if (t<=31) return 'Kicsit meleg, jobban hűteni';
      return 'Túl meleg! Állítsa be a hőmérsékletet';
    },
    timerBtn: 'Időzítő',
    timerTitle: '⏰ Időzítő',
    timerOff: '⏹ Kikapcsolás ütemezése', timerOn: '▶ Bekapcsolás ütemezése',
    timerMinPlaceholder: 'Adja meg a perceket...', timerMinUnit: 'perc',
    timerDelete: 'Időzítő törlése', timerConfirm: 'Megerősítés',
    edViewMode: '🖥 Megjelenítési mód',
    edViewModeFull: 'Full — Teljes nézet',
    edViewModeLite: 'Lite — Kompakt nézet',
    edPopupStyle: '✨ Felugró ablak stílus (Super Lite)',
    edPopupNormal: 'Normál',
    edPopupEffect: 'Effekt',
    edPopupWave: 'Hullám',
    edPresetBar: '🎛 Beállítássáv (Eco / Fav / Clean)',
    edPresetBarDesc: 'Eco · Fav · Clean sor megjelenítése',
    bgLabel: 'Gradiens háttér', bgPresets: 'Előbeállítás',
    colorLabel: 'Színek', accentColor: 'Kiemelőszín', textColor: 'Szövegszín',
    color1: 'Szín 1 (bal felső)', color2: 'Szín 2 (jobb alsó)',
    edLang: 'Nyelv',
    edEntities: 'Entitások',
    edOwnerName: '👤 Megjelenítési név (Okos Otthon)',
    edDisplay: '👁 Megjelenítési beállítások',
    edShowGreet: 'Üdvözlet', edShowGreetDesc: 'Reggeli/esti köszöntő megjelenítése',
    edShowCool: '❄ Hűtés', edShowHeat: '🔥 Fűtés',
    edShowDry: '💧 Szárítás', edShowFanOnly: '🌀 Ventilátor', edShowAuto: '🔄 Auto',
    edShowFan: 'Ventilátor sebesség', edShowFanDesc: 'Ventilátor vezérlőpanel megjelenítése',
    edShowSwing: 'Légáramlás', edShowSwingDesc: 'Légáramlás panel megjelenítése',
    edShowPreset: 'Eco/Fav/Clean sáv', edShowPresetDesc: 'Eco · Fav · Clean sor megjelenítése',
    edShowStatus: 'Állapot panel', edShowStatusDesc: 'Állapot és szenzor blokk megjelenítése',
    edShowAllOff: 'Mindent kikapcsol gomb', edShowAllOffDesc: 'Mindent kikapcsol gomb megjelenítése',
    edShowTimer: 'Időzítő gomb', edShowTimerDesc: 'Időzítő gomb megjelenítése',
    edShowRoomEnv: 'Szoba hőmérséklet/páratartalom', edShowRoomEnvDesc: 'Szoba hőmérséklet & páratartalom mutatása (Super Lite)',
    edShowSlFan: '💨 Ventilátor sebesség (Super Lite)', edShowSlFanDesc: 'Ventilátor gomb mutatása Super Lite-ban',
    edShowSlSwing: '🔄 Légáramlat (Super Lite)', edShowSlSwingDesc: 'Légáramlat gomb mutatása Super Lite-ban',
    edShowSlRoomPower: '⚡ Szoba fogyasztás (Super Lite)', edShowSlRoomPowerDesc: 'Kiválasztott szoba fogyasztásának mutatása',
    edPowerUnit: '⚡ Teljesítményegység', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Hőmérsékleti egység', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Hópehely ismétlése (s)', edCoolAnimSpeedDesc: 'Várakozási idő animációk között (2–15s)',
    edShowOutdoorTemp: 'Kültéri hőmérséklet', edShowHumidity: 'Páratartalom', edShowPower: 'Teljesítmény (kW)',
    edRoomCountLabel: function(n) { return '🏠 Szobák száma (1–8, alapértelmezett 4)'; },
    edRoomsHeader: function(n) { return '❄ Légkondicionáló (' + n + ' szoba)'; },
    edRooms: '❄ Légkondicionáló',
    edSensors: '📡 Környezeti érzékelők',
    edColors: 'Színek',
    edBg: 'Háttér',
    edBgAlpha: '🔆 Háttér átlátszósága', edBgTransparent: 'Átlátszó', edBgSolid: 'Átlátszatlan',
    edColorsAdvanced: '🎨 Speciális színek',
    edColorsDefault: 'Hagyja üresen = alapszín. Azonnal érvényes.',
    edColorsReset: '↩ Összes szín visszaállítása',
    edColorsSecHeader: '📌 Fejléc & Üdvözlés',
    edColorsDial: '🌡 Hőmérséklet-tárcsa',
    edColorsModeCtrl: '⚡ Módok & Vezérlés',
    edColorsStatusRoom: '🏠 Állapot & Szobafülek',
    edAcEntity: '❄ Légkondicionáló entitás (climate.*)',
    edRoomTempEntity: '🌡 Szobahőmérséklet-érzékelő (ha AC nem rendelkezik)',
    edRoomHumidityEntity: '💧 Szobapáratartalom-érzékelő (ha AC nem rendelkezik)',
    edRoomPowerEntity: '⚡ Szoba fogyasztásmérő (sensor.*)',
    edAcName: '🏷 Megjelenítési név',
    edAcIcon: '🎨 MDI Ikon (t.ex. mdi:sofa)',
    edAcImage: '🖼 Rumsfoto (URL)',
    edPm25: '🌫 Finom por PM2.5',
    edOutdoorTemp: '🌡 Kültéri hőmérséklet',
    edHumidity: '💧 Kültéri páratartalom',
    edPower: '⚡ Energiafogyasztás (kW)',
    rooms: ['Nappali','Hálószoba','Étkező','Iroda'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  cs: {
    lang: 'Čeština', flag: 'cz',
    cardTitle: 'Klimatizace',
    cardSub:   'Chytrý Dům',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Dobré ráno,';
      if (h>=11 && h<13) return 'Dobrý den,';
      if (h>=13 && h<18) return 'Dobré odpoledne,';
      if (h>=18 && h<21) return 'Dobrý večer,';
      return 'Dobrou noc,';
    },
    tempLabel: 'TEPLOTA',
    selectRoom: 'VYBRAT MÍSTNOST',
    modeLabel: 'REŽIM',
    statusLabel: 'STAV',
    statusOn: 'BĚŽÍ', statusOff: 'VYPNUTO',
    airGood: 'Kvalita vzduchu dobrá', pressOn: 'Stiskněte pro zapnutí',
    dustLabel: 'Jemný prach',
    fanLabel: 'Rychlost ventilátoru', swingLabel: 'Směr proudění',
    allOff: 'Vše vypnout', allOffSub: 'Vypnout všechny místnosti',
    tapOff: 'Stiskněte pro vypnutí', tapOn: 'Stiskněte pro zapnutí',
    confirmOff: '⚠ Vše vypnout?', confirmSub: function(n) { return 'Vypne ' + n + ' klimatizací najednou'; },
    cancel: 'Zrušit', doOff: '⏻ Vše vypnout',
    overlayOn: 'ZAP', overlayOff: 'VYP',
    modes: { cool:'Chlazení', heat:'Topení', dry:'Odvlhčování', fan_only:'Ventilátor', auto:'Auto', off:'Vypnout' },
    fans:   ['Auto','Min','Nízká','Nízká-Střední','Střední','Střední-Vysoká','Vysoká','Max','Nízká/Auto','Vysoká/Auto','Tichý'],
    swings: ['Pevný','Nahoru/Dolů','Vlevo/Vpravo','Vše','Pozice 1','Pozice 2','Pozice 3','Pozice 4','Pozice 5','Pozice 6'],
    comfort: { dry:'Suchý vzduch', fan_only:'Lehký svěží vánek', off:'Momentálně vypnuto' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Velmi chladno, oblečte se!';
      if (t<=23) return 'Ideální teplota, relaxujte';
      if (t<=27) return 'Pohodlné a příjemné';
      if (t<=31) return 'Trochu teplo, více chladit';
      return 'Příliš horko! Nastavte teplotu';
    },
    timerBtn: 'Časovač',
    timerTitle: '⏰ Časovač',
    timerOff: '⏹ Naplánovat vypnutí', timerOn: '▶ Naplánovat zapnutí',
    timerMinPlaceholder: 'Zadejte minuty...', timerMinUnit: 'min',
    timerDelete: 'Smazat časovač', timerConfirm: 'Potvrdit',
    edViewMode: '🖥 Režim zobrazení',
    edViewModeFull: 'Full — Úplné zobrazení',
    edViewModeLite: 'Lite — Kompaktní zobrazení',
    edPopupStyle: '✨ Styl vyskakovacího okna (Super Lite)',
    edPopupNormal: 'Normální',
    edPopupEffect: 'Efekt',
    edPopupWave: 'Vlna',
    edPresetBar: '🎛 Panel předvoleb (Eco / Fav / Clean)',
    edPresetBarDesc: 'Zobrazit řádek Eco · Fav · Clean',
    bgLabel: 'Přechodové pozadí', bgPresets: 'Předvolba',
    colorLabel: 'Barvy', accentColor: 'Barva zvýraznění', textColor: 'Barva textu',
    color1: 'Barva 1 (vlevo nahoře)', color2: 'Barva 2 (vpravo dole)',
    edLang: 'Jazyk',
    edEntities: 'Entity',
    edOwnerName: '👤 Zobrazovaný název (Chytrý Dům)',
    edDisplay: '👁 Možnosti zobrazení',
    edShowGreet: 'Pozdrav', edShowGreetDesc: 'Zobrazit ranní/večerní pozdrav',
    edShowCool: '❄ Chlazení', edShowHeat: '🔥 Topení',
    edShowDry: '💧 Sušení', edShowFanOnly: '🌀 Ventilátor', edShowAuto: '🔄 Auto',
    edShowFan: 'Rychlost ventilátoru', edShowFanDesc: 'Zobrazit panel rychlosti ventilátoru',
    edShowSwing: 'Směr vzduchu', edShowSwingDesc: 'Zobrazit panel směru vzduchu',
    edShowPreset: 'Lišta Eco/Fav/Clean', edShowPresetDesc: 'Zobrazit řádek Eco · Fav · Clean',
    edShowStatus: 'Stavový blok', edShowStatusDesc: 'Zobrazit blok stavu a senzorů vpravo',
    edShowAllOff: 'Tlačítko vše vypnout', edShowAllOffDesc: 'Zobrazit tlačítko vše vypnout',
    edShowTimer: 'Tlačítko časovače', edShowTimerDesc: 'Zobrazit tlačítko časovače',
    edShowRoomEnv: 'Teplota/vlhkost místnosti', edShowRoomEnvDesc: 'Zobrazit teplotu & vlhkost místnosti (Super Lite)',
    edShowSlFan: '💨 Rychlost ventilátoru (Super Lite)', edShowSlFanDesc: 'Zobrazit tlačítko ventilátoru v Super Lite',
    edShowSlSwing: '🔄 Směr vzduchu (Super Lite)', edShowSlSwingDesc: 'Zobrazit tlačítko směru v Super Lite',
    edShowSlRoomPower: '⚡ Spotřeba místnosti (Super Lite)', edShowSlRoomPowerDesc: 'Zobrazit spotřebu vybrané místnosti',
    edPowerUnit: '⚡ Jednotka výkonu', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Jednotka teploty', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Opakování sněhové vločky (s)', edCoolAnimSpeedDesc: 'Čekání mezi animacemi (2–15s)',
    edShowOutdoorTemp: 'Venkovní teplota', edShowHumidity: 'Vlhkost', edShowPower: 'Výkon (kW)',
    edRoomCountLabel: function(n) { return '🏠 Počet místností (1–8, výchozí 4)'; },
    edRoomsHeader: function(n) { return '❄ Klimatizace (' + n + ' místností)'; },
    edRooms: '❄ Klimatizace',
    edSensors: '📡 Senzory prostředí',
    edColors: 'Barvy',
    edBg: 'Pozadí',
    edBgAlpha: '🔆 Průhlednost pozadí', edBgTransparent: 'Průhledné', edBgSolid: 'Neprůhledné',
    edColorsAdvanced: '🎨 Pokročilé barvy',
    edColorsDefault: 'Ponechte prázdné = výchozí barva. Aplikuje se v reálném čase.',
    edColorsReset: '↩ Obnovit všechny barvy',
    edColorsSecHeader: '📌 Záhlaví & Pozdrav',
    edColorsDial: '🌡 Teplotní ciferník',
    edColorsModeCtrl: '⚡ Režimy & Ovládání',
    edColorsStatusRoom: '🏠 Stav & Karty místností',
    edAcEntity: '❄ Entita klimatizace (climate.*)',
    edRoomTempEntity: '🌡 Senzor teploty v místnosti (pokud AC nemá)',
    edRoomHumidityEntity: '💧 Senzor vlhkosti v místnosti (pokud AC nemá)',
    edRoomPowerEntity: '⚡ Senzor spotřeby místnosti (sensor.*)',
    edAcName: '🏷 Zobrazovaný název',
    edAcIcon: '🎨 MDI Ikona (np. mdi:sofa)',
    edAcImage: '🖼 Zdjęcie pokoju (URL)',
    edPm25: '🌫 Jemný prach PM2.5',
    edOutdoorTemp: '🌡 Venkovní teplota',
    edHumidity: '💧 Venkovní vlhkost',
    edPower: '⚡ Spotřeba energie (kW)',
    rooms: ['Obývací pokoj','Ložnice','Jídelna','Kancelář'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  it: {
    lang: 'Italiano', flag: 'it',
    cardTitle: 'Condizionatore',
    cardSub:   'Casa Intelligente',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Buongiorno,';
      if (h>=11 && h<13) return 'Buon pomeriggio,';
      if (h>=13 && h<18) return 'Buon pomeriggio,';
      if (h>=18 && h<21) return 'Buonasera,';
      return 'Buonanotte,';
    },
    tempLabel: 'TEMPERATURA',
    selectRoom: 'SELEZIONA STANZA',
    modeLabel: 'MODALITÀ',
    statusLabel: 'STATO',
    statusOn: 'IN FUNZIONE', statusOff: 'SPENTO',
    airGood: 'Qualità dell\'aria buona', outdoorLabel: 'Outdoor', pressOn: 'Premi per accendere',
    dustLabel: 'Polvere fine',
    fanLabel: 'Velocità ventilatore', swingLabel: 'Direzione flusso',
    allOff: 'Spegni tutti', allOffSub: 'Spegni tutte le stanze',
    tapOff: 'Premi per spegnere', tapOn: 'Premi per accendere',
    confirmOff: '⚠ Spegnere tutto?', confirmSub: function(n) { return 'Spegnerà ' + n + ' condizionatori contemporaneamente'; },
    cancel: 'Annulla', doOff: '⏻ Spegni tutti',
    overlayOn: 'ACCESO', overlayOff: 'SPENTO',
    modes: { cool:'Raffreddamento', heat:'Riscaldamento', dry:'Deumidificazione', fan_only:'Ventilatore', auto:'Automatico', off:'Spento' },
    fans:   ['Auto','Min','Bassa','Bassa-Media','Media','Media-Alta','Alta','Max','Bassa/Auto','Alta/Auto','Silenzioso'],
    swings: ['Fisso','Su/Giù','Sinistra/Destra','Tutti','Posizione 1','Posizione 2','Posizione 3','Posizione 4','Posizione 5','Posizione 6'],
    comfort: { dry:'Aria secca', fan_only:'Brezza leggera e fresca', off:'Attualmente spento' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Molto freddo, mettiti qualcosa!';
      if (t<=23) return 'Temperatura ideale, rilassati';
      if (t<=27) return 'Comodo e piacevole';
      if (t<=31) return 'Un po\' caldo, raffreddare di più';
      return 'Troppo caldo! Regola la temperatura';
    },
    timerBtn: 'Timer',
    bgLabel: 'Sfondo sfumato',
    timerTitle: '⏰ Timer',
    timerOff: '⏹ Programma spegnimento', timerOn: '▶ Programma accensione',
    timerMinPlaceholder: 'Inserisci minuti...', timerMinUnit: 'min',
    timerDelete: 'Elimina timer', timerConfirm: 'Conferma',
    edViewMode: '🖥 Modalità display',
    edViewModeFull: 'Full — Vista completa',
    edViewModeLite: 'Lite — Vista compatta',
    edPopupStyle: '✨ Stile popup (Super Lite)',
    edPopupNormal: 'Normale',
    edPopupEffect: 'Effetto',
    edPopupWave: 'Onda',
    edPresetBar: '🎛 Barra preset (Eco / Fav / Clean)',
    edPresetBarDesc: 'Mostra riga Eco · Fav · Clean', bgPresets: 'Preimpostazione',
    colorLabel: 'Colori', accentColor: 'Colore accento', textColor: 'Colore testo',
    color1: 'Colore 1 (in alto a sinistra)', color2: 'Colore 2 (in basso a destra)',
    edLang: 'Lingua',
    edEntities: 'Entità',
    edOwnerName: '👤 Nome visualizzato (Casa Intelligente)',
    edDisplay: '👁 Opzioni di visualizzazione',
    edShowGreet: 'Saluto', edShowGreetDesc: 'Mostra saluto mattina/sera',
    edShowCool: '❄ Raffreddamento', edShowHeat: '🔥 Riscaldamento',
    edShowDry: '💧 Deumidificazione', edShowFanOnly: '🌀 Ventilatore', edShowAuto: '🔄 Automatico',
    edShowFan: 'Velocità ventilatore', edShowFanDesc: 'Mostra pannello velocità ventilatore',
    edShowSwing: 'Direzione aria', edShowSwingDesc: 'Mostra pannello direzione aria',
    edShowPreset: 'Barra Eco/Fav/Clean', edShowPresetDesc: 'Mostra riga Eco · Fav · Clean',
    edShowStatus: 'Blocco stato', edShowStatusDesc: 'Mostra blocco stato e sensori a destra',
    edShowAllOff: 'Pulsante spegni tutto', edShowAllOffDesc: 'Mostra pulsante spegni tutto',
    edShowTimer: 'Pulsante timer', edShowTimerDesc: 'Mostra pulsante timer',
    edShowRoomEnv: 'Temp/Umidità stanza', edShowRoomEnvDesc: 'Mostra temp. & umidità stanza (Super Lite)',
    edShowSlFan: '💨 Velocità ventilatore (Super Lite)', edShowSlFanDesc: 'Mostra pulsante ventilatore in Super Lite',
    edShowSlSwing: '🔄 Direzione aria (Super Lite)', edShowSlSwingDesc: 'Mostra pulsante direzione in Super Lite',
    edShowSlRoomPower: '⚡ Consumo stanza (Super Lite)', edShowSlRoomPowerDesc: 'Mostra consumo stanza selezionata',
    edPowerUnit: '⚡ Unità potenza', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Unità di temperatura', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Ripetizione fiocco di neve (s)', edCoolAnimSpeedDesc: 'Attesa tra le animazioni (2–15s)',
    edShowOutdoorTemp: 'Temperatura esterna', edShowHumidity: 'Umidità', edShowPower: 'Potenza (kW)',
    edRoomCountLabel: function(n) { return '🏠 Numero di stanze (1–8, predefinito 4)'; },
    edRoomsHeader: function(n) { return '❄ Condizionatori (' + n + ' stanze)'; },
    edRooms: '❄ Condizionatori',
    edSensors: '📡 Sensori ambientali',
    edColors: 'Colori',
    edBg: 'Sfondo',
    edBgAlpha: '🔆 Trasparenza sfondo', edBgTransparent: 'Trasparente', edBgSolid: 'Opaco',
    edColorsAdvanced: '🎨 Colori avanzati',
    edColorsDefault: 'Lascia vuoto = colore predefinito. Applicato in tempo reale.',
    edColorsReset: '↩ Ripristina tutti i colori',
    edColorsSecHeader: '📌 Intestazione & Saluto',
    edColorsDial: '🌡 Quadrante temperatura',
    edColorsModeCtrl: '⚡ Modalità & Controlli',
    edColorsStatusRoom: '🏠 Stato & Schede stanza',
    edAcEntity: '❄ Entità condizionatore (climate.*)',
    edRoomTempEntity: '🌡 Sensore temperatura stanza (se AC non ce l\'ha)',
    edRoomHumidityEntity: '💧 Sensore umidità stanza (se AC non ce l\'ha)',
    edRoomPowerEntity: '⚡ Sensore potenza stanza (sensor.*)',
    edAcName: '🏷 Nome visualizzato',
    edAcIcon: '🎨 Icona MDI (es. mdi:sofa)',
    edAcImage: '🖼 Foto stanza (URL)',
    edPm25: '🌫 Polvere fine PM2.5',
    edOutdoorTemp: '🌡 Temperatura esterna',
    edHumidity: '💧 Umidità esterna',
    edPower: '⚡ Consumo energetico (kW)',
    rooms: ['Soggiorno','Camera da letto','Sala da pranzo','Ufficio'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
  pt: {
    lang: 'Português', flag: 'pt',
    cardTitle: 'Ar Condicionado',
    cardSub:   'Casa Inteligente',
    greet: function() {
      var h = new Date().getHours();
      if (h>=6  && h<11) return 'Bom dia,';
      if (h>=11 && h<13) return 'Bom dia,';
      if (h>=13 && h<18) return 'Boa tarde,';
      if (h>=18 && h<21) return 'Boa noite,';
      return 'Boa noite,';
    },
    tempLabel: 'TEMPERATURA',
    selectRoom: 'ESCOLHER SALA',
    modeLabel: 'MODO',
    statusLabel: 'ESTADO',
    statusOn: 'A FUNCIONAR', statusOff: 'DESLIGADO',
    airGood: 'Qualidade do ar boa', outdoorLabel: 'Outdoor', pressOn: 'Prima para ligar',
    dustLabel: 'Pó fino',
    fanLabel: 'Velocidade do ventilador', swingLabel: 'Direção do fluxo',
    allOff: 'Desligar todos', allOffSub: 'Desligar todas as salas',
    tapOff: 'Prima para desligar', tapOn: 'Prima para ligar',
    confirmOff: '⚠ Desligar todos?', confirmSub: function(n) { return 'Irá desligar ' + n + ' ar condicionados ao mesmo tempo'; },
    cancel: 'Cancelar', doOff: '⏻ Desligar todos',
    overlayOn: 'LIGADO', overlayOff: 'DESLIGADO',
    modes: { cool:'Arrefecer', heat:'Aquecer', dry:'Desumidificar', fan_only:'Ventilador', auto:'Automático', off:'Desligado' },
    fans:   ['Auto','Min','Baixo','Baixo-Médio','Médio','Médio-Alto','Alto','Max','Baixo/Auto','Alto/Auto','Silencioso'],
    swings: ['Fixo','Cima/Baixo','Esquerda/Direita','Todos','Posição 1','Posição 2','Posição 3','Posição 4','Posição 5','Posição 6'],
    comfort: { dry:'Ar seco e confortável', fan_only:'Brisa leve e fresca', off:'Atualmente desligado' },
    comfortTemp: function(t) {
      t = Math.round(t);
      if (t<=19) return 'Muito frio, vista mais roupa!';
      if (t<=23) return 'Temperatura ideal, relaxe';
      if (t<=27) return 'Confortável e agradável';
      if (t<=31) return 'Um pouco quente, arrefecer mais';
      return 'Demasiado quente! Ajuste a temperatura';
    },
    timerBtn: 'Temporizador',
    timerTitle: '⏰ Temporizador',
    timerOff: '⏹ Agendar desligamento', timerOn: '▶ Agendar ligamento',
    timerMinPlaceholder: 'Inserir minutos...', timerMinUnit: 'min',
    timerDelete: 'Apagar temporizador', timerConfirm: 'Confirmar',
    edViewMode: '🖥 Modo de exibição',
    edViewModeFull: 'Full — Vista completa',
    edViewModeLite: 'Lite — Vista compacta',
    edPopupStyle: '✨ Estilo popup (Super Lite)',
    edPopupNormal: 'Normal',
    edPopupEffect: 'Efeito',
    edPopupWave: 'Onda',
    edPresetBar: '🎛 Barra de predefinições (Eco / Fav / Clean)',
    edPresetBarDesc: 'Mostrar linha Eco · Fav · Clean',
    bgLabel: 'Fundo gradiente', bgPresets: 'Predefinição',
    colorLabel: 'Cores', accentColor: 'Cor de destaque', textColor: 'Cor do texto',
    color1: 'Cor 1 (canto superior esquerdo)', color2: 'Cor 2 (canto inferior direito)',
    edLang: 'Idioma',
    edEntities: 'Entidades',
    edOwnerName: '👤 Nome exibido (Casa Inteligente)',
    edDisplay: '👁 Opções de exibição',
    edShowGreet: 'Saudação', edShowGreetDesc: 'Mostrar saudação manhã/noite',
    edShowCool: '❄ Refrigeração', edShowHeat: '🔥 Aquecimento',
    edShowDry: '💧 Desumidificação', edShowFanOnly: '🌀 Ventilador', edShowAuto: '🔄 Automático',
    edShowFan: 'Velocidade do ventilador', edShowFanDesc: 'Mostrar painel de velocidade',
    edShowSwing: 'Direção do ar', edShowSwingDesc: 'Mostrar painel de direção do ar',
    edShowPreset: 'Barra Eco/Fav/Clean', edShowPresetDesc: 'Mostrar linha Eco · Fav · Clean',
    edShowStatus: 'Bloco de status', edShowStatusDesc: 'Mostrar bloco de status e sensores',
    edShowAllOff: 'Botão desligar tudo', edShowAllOffDesc: 'Mostrar botão desligar tudo',
    edShowTimer: 'Botão temporizador', edShowTimerDesc: 'Mostrar botão temporizador',
    edShowRoomEnv: 'Temp/Humidade do quarto', edShowRoomEnvDesc: 'Mostrar temp. & humidade do quarto (Super Lite)',
    edShowSlFan: '💨 Velocidade do ventilador (Super Lite)', edShowSlFanDesc: 'Mostrar botão ventilador em Super Lite',
    edShowSlSwing: '🔄 Direção do ar (Super Lite)', edShowSlSwingDesc: 'Mostrar botão de direção em Super Lite',
    edShowSlRoomPower: '⚡ Consumo sala (Super Lite)', edShowSlRoomPowerDesc: 'Mostrar consumo da sala selecionada',
    edPowerUnit: '⚡ Unidade de potência', edPowerUnitKw: 'kW', edPowerUnitW: 'W',
    edTempUnit: '🌡 Unidade de temperatura', edTempUnitC: '°C — Celsius', edTempUnitF: '°F — Fahrenheit',
    edCoolAnimSpeed: '❄ Repetição do floco de neve (s)', edCoolAnimSpeedDesc: 'Aguardar entre animações (2–15s)',
    edShowOutdoorTemp: 'Temperatura externa', edShowHumidity: 'Humidade', edShowPower: 'Potência (kW)',
    edRoomCountLabel: function(n) { return '🏠 Número de salas (1–8, padrão 4)'; },
    edRoomsHeader: function(n) { return '❄ Ar Condicionados (' + n + ' salas)'; },
    edRooms: '❄ Ar Condicionados',
    edSensors: '📡 Sensores ambientais',
    edColors: 'Cores',
    edBg: 'Fundo',
    edBgAlpha: '🔆 Transparência do fundo', edBgTransparent: 'Transparente', edBgSolid: 'Sólido',
    edColorsAdvanced: '🎨 Cores avançadas',
    edColorsDefault: 'Deixe em branco = cor padrão. Aplicado em tempo real.',
    edColorsReset: '↩ Repor todas as cores',
    edColorsSecHeader: '📌 Cabeçalho & Saudação',
    edColorsDial: '🌡 Mostrador de temperatura',
    edColorsModeCtrl: '⚡ Modos & Controlos',
    edColorsStatusRoom: '🏠 Estado & Separadores de sala',
    edAcEntity: '❄ Entidade AC (climate.*)',
    edRoomTempEntity: '🌡 Sensor temperatura sala (se AC não tiver)',
    edRoomHumidityEntity: '💧 Sensor humidade sala (se AC não tiver)',
    edRoomPowerEntity: '⚡ Sensor consumo sala (sensor.*)',
    edAcName: '🏷 Nome exibido',
    edAcIcon: '🎨 Ícone MDI (ex: mdi:sofa)',
    edAcImage: '🖼 Foto do quarto (URL)',
    edPm25: '🌫 Pó fino PM2.5',
    edOutdoorTemp: '🌡 Temperatura exterior',
    edHumidity: '💧 Humidade exterior',
    edPower: '⚡ Consumo de energia (kW)',
    rooms: ['Sala de estar','Quarto','Sala de jantar','Escritório'],
    roomIcons: ['mdi:sofa','mdi:bed','mdi:silverware-fork-knife','mdi:briefcase'],
  },
};

// ─── Background presets (y hệt Gate Card) ─────────────────────────────────────
const AC_BG_PRESETS = [
  { id: 'default', label: 'Default',  c1: '#001e2b', c2: '#12c6f3' },
  { id: 'night',   label: 'Night',    c1: '#0d0d1a', c2: '#1a0a3a' },
  { id: 'sunset',  label: 'Sunset',   c1: '#1a0a00', c2: '#ff6b35' },
  { id: 'forest',  label: 'Forest',   c1: '#0a1a0a', c2: '#1a5c1a' },
  { id: 'aurora',  label: 'Aurora',   c1: '#0a0a1a', c2: '#00cc88' },
  { id: 'desert',  label: 'Desert',   c1: '#1a0e00', c2: '#c8860a' },
  { id: 'ocean',   label: 'Ocean',    c1: '#001020', c2: '#0055aa' },
  { id: 'cherry',  label: 'Cherry',   c1: '#1a0010', c2: '#cc2255' },
  { id: 'volcano', label: 'Volcano',  c1: '#1a0500', c2: '#dd3300' },
  { id: 'galaxy',  label: 'Galaxy',   c1: '#080818', c2: '#6633cc' },
  { id: 'ice',     label: 'Ice',      c1: '#0a1828', c2: '#88ddff' },
  { id: 'olive',   label: 'Olive',    c1: '#0e1200', c2: '#7a9a00' },
  { id: 'slate',   label: 'Slate',    c1: '#101820', c2: '#445566' },
  { id: 'rose',    label: 'Rose',     c1: '#1a0808', c2: '#ee6688' },
  { id: 'teal',    label: 'Teal',     c1: '#001818', c2: '#00aa88' },
  { id: 'deep_neon', label: '🔵 Deep Neon', c1: '#020b18', c2: '#00d4ff' },
  { id: 'custom',  label: '✏ Custom', c1: null,      c2: null       },
];

function acPresetGradient(preset, c1, c2, bgAlpha) {
  // bgAlpha: 0-100 (%), dùng để điều chỉnh độ trong suốt của nền
  // Chuyển % → 2 giá trị hex alpha: start = alpha, end = alpha/3 (để tạo gradient fade)
  var alphaPct = (bgAlpha !== undefined && bgAlpha !== null) ? Math.max(0, Math.min(100, parseInt(bgAlpha))) : 80;
  var alphaHex = Math.round(alphaPct * 2.55).toString(16).padStart(2,'0');
  var alphaHex2 = Math.round(alphaPct * 2.55 / 3).toString(16).padStart(2,'0');
  if (preset === 'deep_neon') {
    // deep_neon: áp dụng alpha bằng rgba overlay
    if (alphaPct < 100) {
      var a = (alphaPct / 100).toFixed(2);
      return 'linear-gradient(160deg, rgba(2,11,24,' + a + ') 0%, rgba(4,20,40,' + a + ') 30%, rgba(6,28,53,' + a + ') 60%, rgba(3,14,31,' + a + ') 100%)';
    }
    return 'linear-gradient(160deg, #020b18 0%, #041428 30%, #061c35 60%, #030e1f 100%)';
  }
  const p = AC_BG_PRESETS.find(x => x.id === preset) || AC_BG_PRESETS[0];
  const gc1 = (preset === 'custom' ? c1 : p.c1) || '#001e2b';
  const gc2 = (preset === 'custom' ? c2 : p.c2) || '#12c6f3';
  return 'linear-gradient(135deg, ' + gc1 + alphaHex + ' 0%, ' + gc2 + alphaHex2 + ' 100%)';
}

// ─── Temperature color: 10°C=blue → 22°C=cyan → 26°C=green → 30°C=orange → 35°C=red ──
function acTempColor(temp) {
  var t = Math.max(10, Math.min(35, temp));
  var stops = [
    { t: 10,  r: 59,  g: 130, b: 246 }, // blue
    { t: 18,  r: 34,  g: 211, b: 238 }, // cyan
    { t: 24,  r: 52,  g: 211, b: 153 }, // green
    { t: 28,  r: 251, g: 191, b: 36  }, // amber
    { t: 31,  r: 249, g: 115, b: 22  }, // orange
    { t: 35,  r: 239, g: 68,  b: 68  }, // red
  ];
  var lo = stops[0], hi = stops[stops.length - 1];
  for (var i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i+1].t) { lo = stops[i]; hi = stops[i+1]; break; }
  }
  var f = lo.t === hi.t ? 0 : (t - lo.t) / (hi.t - lo.t);
  var r = Math.round(lo.r + (hi.r - lo.r) * f);
  var g = Math.round(lo.g + (hi.g - lo.g) * f);
  var b = Math.round(lo.b + (hi.b - lo.b) * f);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

const AC_DEFAULT_CONFIG = {
  language: 'vi',
  background_preset: 'default',
  bg_color1: '#001e2b',
  bg_color2: '#12c6f3',
  accent_color: '#00ffcc',
  text_color: '#ffffff',
  room_count: 4,
  popup_style: 'normal',
  bg_alpha: 80,
  color_temp_val: '',
  color_comfort: '',
  color_mode_active: '',
  color_room_on: '',
  color_room_off: '',
  color_status_on: '',
  color_status_off: '',
  color_fan_bar: '',
  color_dial_arc: '',
  color_title: '',
  color_greet_sub: '',
  color_greet_name: '',
  color_dial_lbl: '',
  color_temp_set: '',
  color_eta: '',
  color_mode_lbl: '',
  color_fc_label: '',
  color_fc_val: '',
  color_swing_lbl: '',
  color_power_lbl: '',
  color_timer_lbl: '',
  color_alloff_lbl: '',
  color_room_header: '',
  color_room_name: '',
  color_st_title: '',
  color_st_sub: '',
  temp_unit: 'C',
};

// ─── Temperature unit helpers ─────────────────────────────────────────────────
// haUnit: đơn vị HA entity thực sự trả về ('C' hoặc 'F')
// tUnit:  đơn vị người dùng muốn hiển thị ('C' hoặc 'F')
// Chỉ convert khi haUnit ≠ tUnit
function acCtoF(c) { return Math.round(c * 9/5 + 32 * 10) / 10; }
function acFmtTemp(val, tUnit, haUnit) {
  // haUnit mặc định 'C' nếu không truyền (backward compat)
  var hu = haUnit || 'C';
  if (isNaN(parseFloat(val))) return '--';
  val = parseFloat(val);
  if (hu === tUnit) return val.toFixed(1);                        // đơn vị khớp, không convert
  if (hu === 'C' && tUnit === 'F') return (val * 9/5 + 32).toFixed(1);  // C→F
  if (hu === 'F' && tUnit === 'C') return ((val - 32) * 5/9).toFixed(1); // F→C
  return val.toFixed(1);
}
function acTempUnit(unit) { return unit === 'F' ? '°F' : '°C'; }
// For set temperature (integer steps)
function acFmtSetTemp(val, tUnit, haUnit) {
  var hu = haUnit || 'C';
  if (isNaN(parseFloat(val))) return val;
  val = parseFloat(val);
  if (hu === tUnit) return val;
  if (hu === 'C' && tUnit === 'F') return Math.round(val * 9/5 + 32);
  if (hu === 'F' && tUnit === 'C') return Math.round((val - 32) * 5/9);
  return val;
}
// Reverse: F display value → C for HA service call
function acFtoC(f) { return Math.round((f - 32) * 5/9 * 2) / 2; }

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85', // phòng khách
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85', // phòng ngủ
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=85',    // phòng ăn
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=85', // văn phòng
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=85', // phòng tắm
  'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=900&q=85', // phòng trẻ em
  'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=900&q=85', // phòng gym
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85', // phòng kho/tiện ích
];

const ROOMS_DEFAULT = [
  { id: 'climate.dieu_hoa_living',         label: 'Ph\xf2ng kh\xe1ch', area: '25 m\xb2', icon: 'mdi:sofa' },
  { id: 'climate.bed_air_conditioning',     label: 'Ph\xf2ng ng\u1ee7',  area: '18 m\xb2', icon: 'mdi:bed' },
  { id: 'climate.kitchen_air_conditioning', label: 'Ph\xf2ng \u0103n',   area: '20 m\xb2', icon: 'mdi:silverware-fork-knife' },
  { id: 'climate.dieu_hoa_office',          label: 'V\u0103n ph\xf2ng',  area: '15 m\xb2', icon: 'mdi:briefcase' },
  { id: 'climate.dieu_hoa_bathroom',        label: 'Ph\xf2ng t\u1eafm',  area: '8 m\xb2',  icon: 'mdi:shower' },
  { id: 'climate.dieu_hoa_kids',            label: 'Ph\xf2ng tr\u1ebb',  area: '14 m\xb2', icon: 'mdi:teddy-bear' },
  { id: 'climate.dieu_hoa_gym',             label: 'Ph\xf2ng gym',       area: '20 m\xb2', icon: 'mdi:dumbbell' },
  { id: 'climate.dieu_hoa_utility',         label: 'Kho',                area: '10 m\xb2', icon: 'mdi:archive' },
];
var ROOMS = ROOMS_DEFAULT.slice(0, 4);

const GREET = function() {
  var h = new Date().getHours();
  if (h >= 6  && h < 11) return 'Ch\xe0o bu\u1ed5i s\xe1ng,';   // 06–10
  if (h >= 11 && h < 13) return 'Ch\xe0o bu\u1ed5i tr\u01b0a,';  // 11–12
  if (h >= 13 && h < 18) return 'Ch\xe0o bu\u1ed5i chi\u1ec1u,'; // 13–17
  if (h >= 18 && h < 21) return 'Ch\xe0o bu\u1ed5i t\u1ed1i,';   // 18–20
  return 'Ch\xfac ng\u1ee7 ngon,';                               // 21–05
};

const MODE_CFG = {
  cool:     { lbl: 'L\xe0m l\u1ea1nh', icon: 'mdi:snowflake',      color: '#3b9eff', glow: 'rgba(59,158,255,0.55)'   },
  heat:     { lbl: 'S\u01b0\u1edfi',   icon: '\ud83d\udd25', color: '#ff7b3b', glow: 'rgba(255,123,59,0.55)'  },
  dry:      { lbl: 'H\xfat \u1ea9m',   icon: '\ud83d\udca7', color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  fan_only: { lbl: 'Qu\u1ea1t',        icon: '\ud83c\udf2c', color: '#34d399', glow: 'rgba(52,211,153,0.55)'  },
  auto:     { lbl: 'T\u1ef1 \u0111\u1ed9ng', icon: 'mdi:autorenew', color: '#f59e0b', glow: 'rgba(245,158,11,0.55)' },
  off:      { lbl: 'T\u1eaft',         icon: '\u25cb',       color: '#4b5563', glow: 'rgba(75,85,99,0.3)'     },
};

const FAN_LEVELS  = ['auto','min','low','low_mid','medium','high_mid','high','max','low/auto','high/auto','quiet'];
const FAN_VI      = ['Tự động','Min','Thấp','Thấp-Vừa','Vừa','Vừa-Cao','Cao','Max','Thấp/Tự động','Cao/Tự động','Êm ái'];
const SWING_LEVELS = ['off','vertical','horizontal','both'];
const SWING_VI    = ['C\u1ed1 \u0111\u1ecbnh','L\u00ean xu\u1ed1ng','Tr\xe1i ph\u1ea3i','T\u1ea5t c\u1ea3'];
const SWING_ICONS  = ['\u2014','\u2195','\u2194','\u2716'];
const SWING_NUMERIC = ['1','2','3','4','5','6'];
// Comfort text by temperature range (every 4°C from 16–32)
// 16-19: lạnh buốt, 20-23: dễ chịu, 24-27: ấm áp, 28-31: nóng, 32+: rất nóng
function getTempComfort(temp) {
  var t = Math.round(temp);
  if (t <= 19) return 'L\u1ea1nh bu\u1ed1t, m\u1eb7c th\xeam \xe1o nh\xe9!';
  if (t <= 23) return 'Nhi\u1ec7t \u0111\u1ed9 l\xfd t\u01b0\u1edfng, th\u01b0 gi\xe3n th\xf4i';
  if (t <= 27) return 'C\u1ea3m gi\xe1c d\u1ec5 ch\u1ecbu, tho\u1ea3i m\xe1i';
  if (t <= 31) return 'H\u01a1i \u1ea5m, c\xe2n l\xe0m m\xe1t th\xeam';
  return 'Qu\xe1 n\xf3ng! H\xe3y \u0111i\u1ec1u ch\u1ec9nh nhi\u1ec7t \u0111\u1ed9';
}

const COMFORT    = {
  cool:     '',
  heat:     '',
  dry:      'Kh\xf4ng kh\xed kh\xf4 r\xe1o',
  fan_only: 'Gi\xf3 nh\u1eb9 m\xe1t m\u1ebb',
  off:      '\u0110ang t\u1eaft',
};

// ─── CSS tách riêng – chỉ inject 1 lần ───────────────────────────────────────
const CARD_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
button,a{touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
:host{display:block;font-family:'Sora',sans-serif}
.card{background:linear-gradient(135deg,rgba(180,220,255,0.22) 0%,rgba(120,200,220,0.18) 50%,rgba(100,180,210,0.22) 100%);
  backdrop-filter:blur(28px) saturate(1.6);-webkit-backdrop-filter:blur(28px) saturate(1.6);
  border-radius:28px;overflow:hidden;display:flex;align-items:stretch;width:100%;box-sizing:border-box;
  box-shadow:0 0 0 1px rgba(255,255,255,0.28),0 40px 120px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.45)}
.left{flex:1.22;background:linear-gradient(160deg,rgba(200,235,255,0.18) 0%,rgba(140,210,230,0.12) 100%);
  display:flex;flex-direction:column;padding:16px 16px 14px;gap:8px;
  position:relative;border-right:1px solid rgba(255,255,255,0.2);overflow-x:hidden;overflow-y:visible}
.left::before{content:"";position:absolute;top:-120px;left:-70px;width:380px;height:380px;
  background:radial-gradient(circle,var(--glow) 0%,transparent 65%);pointer-events:none;opacity:0.25}
.hdr{display:flex;align-items:center;justify-content:space-between}
.hdr-brand{display:flex;align-items:center;gap:10px}
.hdr-ico{width:40px;height:40px;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#000));
  border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 24px var(--glow)}
.hdr-title{font-size:11px;font-weight:600;letter-spacing:1px;color:var(--cv-title,rgba(255,255,255,0.85));text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px}
.hdr-sub{font-size:9px;color:rgba(40,80,110,0.5);margin-top:1px}
.hdr-icons{display:flex;gap:12px;align-items:center}
.hdr-vs-row{display:flex;align-items:center;gap:3px}
.hdr-view-switcher{display:flex;align-items:center;gap:3px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:3px 4px}
.hdr-vs-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:5px 8px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,0.4);transition:all 0.2s;line-height:0;display:flex;align-items:center;justify-content:center}
.hdr-vs-btn:hover{color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.25)}
.hdr-vs-btn--active{background:rgba(255,255,255,0.18)!important;color:#ffffff!important;border-color:rgba(255,255,255,0.3)!important;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
@keyframes vsDotBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-3.2px)}}
.hdr-vs-btn--active circle:nth-child(1),.sl-vs-btn--active circle:nth-child(1){animation:vsDotBounce 0.9s ease-in-out infinite;animation-delay:0s;transform-origin:center;transform-box:fill-box}
.hdr-vs-btn--active circle:nth-child(2),.sl-vs-btn--active circle:nth-child(2){animation:vsDotBounce 0.9s ease-in-out infinite;animation-delay:0.18s;transform-origin:center;transform-box:fill-box}
.hdr-vs-btn--active circle:nth-child(3),.sl-vs-btn--active circle:nth-child(3){animation:vsDotBounce 0.9s ease-in-out infinite;animation-delay:0.36s;transform-origin:center;transform-box:fill-box}
.sl-view-switcher{display:flex;align-items:center;justify-content:flex-end;gap:3px;margin-top:4px;margin-bottom:-2px}
.sl-vs-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:5px 8px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,0.4);transition:all 0.2s;line-height:0;display:flex;align-items:center;justify-content:center}
.sl-vs-btn:hover{color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.25)}
.sl-vs-btn--active{background:rgba(255,255,255,0.18)!important;color:#ffffff!important;border-color:rgba(255,255,255,0.3)!important;box-shadow:0 1px 6px rgba(0,0,0,0.3)}
.greet-row{display:flex;align-items:flex-start;justify-content:space-between}
.greet-sub{font-size:11.5px;color:var(--cv-greet-sub,rgba(255,255,255,0.65));font-weight:300}
.greet-name{font-size:22px;font-weight:700;color:var(--cv-greet-name,#ffffff);line-height:1.15;letter-spacing:-0.5px}

.eco-badge{display:inline-flex;align-items:center;gap:4px;padding:5px 13px;border-radius:20px;
  font-size:9.5px;font-weight:600;cursor:pointer;outline:none;transition:all 0.2s;border:none}
.eco-on{background:rgba(52,211,153,0.38);border:1px solid rgba(52,211,153,0.7)!important;color:#ffffff}
.eco-off{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09)!important;color:rgba(255,255,255,0.55)}
.eco-badge:hover{filter:brightness(1.25);transform:scale(1.04)}
.dial-wrap{display:flex;justify-content:center;position:relative;margin:-2px 0 -14px}
.dial-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-26%);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;width:150px;height:150px}
.dial-lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--cv-dial-lbl,rgba(255,255,255,0.55));font-weight:500}
.dial-temp{font-family:'Orbitron',sans-serif;font-size:44px;font-weight:800;color:var(--cv-temp,#ffffff);line-height:1;
  text-shadow:0 0 30px var(--glow),0 0 60px var(--glow);transition:color 0.6s ease}
.dial-deg{font-size:24px;font-weight:400;vertical-align:super;line-height:0}
.dial-feel{font-size:12px;color:var(--cv-comfort,rgba(255,255,255,0.6));margin-top:6px;font-weight:300;text-align:center;
  max-width:130px;line-height:1.45;word-break:break-word;white-space:normal}
.temp-ctrl{display:flex;align-items:center;justify-content:center}
.eta-bar{display:flex;align-items:center;justify-content:center;gap:5px;
  padding:5px 12px;border-radius:20px;
  background:rgba(59,158,255,0.10);border:1px solid rgba(59,158,255,0.25);
  font-size:10px;font-weight:600;color:var(--cv-eta,rgba(180,220,255,0.92));
  letter-spacing:0.2px;text-align:center;animation:etaFadeIn 0.5s ease}
@keyframes etaFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.eta-bar-sl{display:flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 10px;border-radius:16px;
  background:rgba(59,158,255,0.10);border:1px solid rgba(59,158,255,0.22);
  font-size:9.5px;font-weight:600;color:rgba(180,220,255,0.88);
  letter-spacing:0.2px;text-align:center;animation:etaFadeIn 0.5s ease}
.temp-btn{width:40px;height:40px;border-radius:50%;background:rgba(0,20,50,0.25);
  border:1px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.9);font-size:24px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;outline:none;transition:all 0.15s;font-family:'Sora',sans-serif}
.temp-btn:hover{background:rgba(0,30,70,0.4);border-color:var(--accent);color:var(--accent);box-shadow:0 0 18px var(--glow)}
.temp-btn:active{transform:scale(0.88)}
.temp-set{min-width:100px;text-align:center;font-family:'Orbitron',sans-serif;font-size:14px;font-weight:600;color:var(--cv-temp-set,rgba(255,255,255,0.85))}
.mode-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(52px,1fr));gap:7px}
.mode-btn{background:rgba(0,20,50,0.3);border:1px solid rgba(255,255,255,0.25);border-radius:13px;
  padding:9px 3px 7px;display:flex;flex-direction:column;align-items:center;gap:4px;
  cursor:pointer;outline:none;color:rgba(255,255,255,0.75);font-size:8.5px;font-weight:600;
  font-family:'Sora',sans-serif;transition:all 0.22s cubic-bezier(.34,1.56,.64,1);overflow:hidden;position:relative}
.mode-btn:hover{transform:translateY(-2px) scale(1.04);border-color:rgba(255,255,255,0.55);z-index:2}
.mode-btn:active{transform:scale(0.93)}
.mode-btn--active{background:linear-gradient(160deg,color-mix(in srgb,var(--cv-mode-active,var(--bc,var(--accent))) 55%,rgba(0,15,40,0.5)),color-mix(in srgb,var(--cv-mode-active,var(--bc,var(--accent))) 35%,rgba(0,15,40,0.4)));
  border-color:color-mix(in srgb,var(--cv-mode-active,var(--bc,var(--accent))) 80%,transparent);color:#ffffff;
  box-shadow:0 0 24px var(--bg,var(--glow)),inset 0 1px 0 rgba(255,255,255,0.25)}
.mode-icon{font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center;
  transition:transform 0.25s ease,filter 0.25s ease}
.mode-lbl{font-size:8.5px;color:var(--cv-mode-lbl,inherit)}

/* ── Hover: Cool — bông tuyết xoay + sáng ── */
@keyframes modeCoolSpin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.25)}100%{transform:rotate(360deg) scale(1)}}
@keyframes modeCoolGlow{0%,100%{filter:drop-shadow(0 0 4px #3b9eff)}50%{filter:drop-shadow(0 0 12px #3b9eff) drop-shadow(0 0 22px #a8d8ff)}}
.mode-btn[data-hvac="cool"]:hover .mode-icon{animation:modeCoolSpin 1.1s linear infinite,modeCoolGlow 1.1s ease-in-out infinite}
.mode-btn[data-hvac="cool"]:hover{background:rgba(20,60,120,0.5);border-color:#3b9eff;box-shadow:0 4px 20px rgba(59,158,255,0.35),inset 0 0 14px rgba(59,158,255,0.1)}
.mode-btn[data-hvac="cool"].mode-btn--active .mode-icon{animation:modeCoolSpin 1.6s linear infinite,modeCoolGlow 1.6s ease-in-out infinite}

/* ── Hover: Heat — lửa nhảy múa ── */
@keyframes modeHeatFlicker{0%{transform:scale(1) rotate(-3deg)}20%{transform:scale(1.18) rotate(2deg)}40%{transform:scale(1.08) rotate(-2deg)}60%{transform:scale(1.22) rotate(3deg)}80%{transform:scale(1.1) rotate(-1deg)}100%{transform:scale(1) rotate(-3deg)}}
@keyframes modeHeatGlow{0%,100%{filter:drop-shadow(0 0 5px #ff7b3b)}50%{filter:drop-shadow(0 0 14px #ff7b3b) drop-shadow(0 0 26px #ffcc44)}}
.mode-btn[data-hvac="heat"]:hover .mode-icon{animation:modeHeatFlicker 0.7s ease-in-out infinite,modeHeatGlow 0.7s ease-in-out infinite}
.mode-btn[data-hvac="heat"]:hover{background:rgba(80,30,10,0.5);border-color:#ff7b3b;box-shadow:0 4px 20px rgba(255,123,59,0.4),inset 0 0 14px rgba(255,123,59,0.12)}
.mode-btn[data-hvac="heat"].mode-btn--active .mode-icon{animation:modeHeatFlicker 1.1s ease-in-out infinite,modeHeatGlow 1.1s ease-in-out infinite}

/* ── Hover: Dry — giọt nước nảy lên xuống ── */
@keyframes modeDryBounce{0%,100%{transform:translateY(0) scale(1)}30%{transform:translateY(-5px) scale(0.92)}60%{transform:translateY(2px) scale(1.1)}80%{transform:translateY(-2px) scale(0.97)}}
@keyframes modeDryGlow{0%,100%{filter:drop-shadow(0 0 4px #a78bfa)}50%{filter:drop-shadow(0 0 12px #a78bfa) drop-shadow(0 0 20px #d8b4fe)}}
.mode-btn[data-hvac="dry"]:hover .mode-icon{animation:modeDryBounce 1s ease-in-out infinite,modeDryGlow 1s ease-in-out infinite}
.mode-btn[data-hvac="dry"]:hover{background:rgba(50,20,90,0.5);border-color:#a78bfa;box-shadow:0 4px 20px rgba(167,139,250,0.35),inset 0 0 14px rgba(167,139,250,0.1)}
.mode-btn[data-hvac="dry"].mode-btn--active .mode-icon{animation:modeDryBounce 1.4s ease-in-out infinite,modeDryGlow 1.4s ease-in-out infinite}

/* ── Hover: Fan — gió thổi sang phải (shake ngang) ── */
@keyframes modeFanBlow{0%{transform:translateX(0) rotate(0deg)}15%{transform:translateX(3px) rotate(8deg)}30%{transform:translateX(-1px) rotate(-4deg)}50%{transform:translateX(4px) rotate(10deg)}70%{transform:translateX(-2px) rotate(-5deg)}85%{transform:translateX(3px) rotate(6deg)}100%{transform:translateX(0) rotate(0deg)}}
@keyframes modeFanGlow{0%,100%{filter:drop-shadow(0 0 4px #34d399)}50%{filter:drop-shadow(0 0 12px #34d399) drop-shadow(0 0 22px #6ee7b7)}}
.mode-btn[data-hvac="fan_only"]:hover .mode-icon{animation:modeFanBlow 0.9s ease-in-out infinite,modeFanGlow 0.9s ease-in-out infinite}
.mode-btn[data-hvac="fan_only"]:hover{background:rgba(10,60,40,0.5);border-color:#34d399;box-shadow:0 4px 20px rgba(52,211,153,0.35),inset 0 0 14px rgba(52,211,153,0.1)}
.mode-btn[data-hvac="fan_only"].mode-btn--active .mode-icon{animation:modeFanBlow 1.3s ease-in-out infinite,modeFanGlow 1.3s ease-in-out infinite}

/* ── Hover: Auto — xoay tự động + ánh vàng ── */
@keyframes modeAutoSpin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.2)}100%{transform:rotate(360deg) scale(1)}}
@keyframes modeAutoGlow{0%,100%{filter:drop-shadow(0 0 4px #f59e0b)}50%{filter:drop-shadow(0 0 14px #f59e0b) drop-shadow(0 0 26px #fcd34d)}}
.mode-btn[data-hvac="auto"] .mode-icon{animation:modeAutoSpin 2.5s linear infinite,modeAutoGlow 2.5s ease-in-out infinite}
.mode-btn[data-hvac="auto"]:hover .mode-icon{animation:modeAutoSpin 1.0s linear infinite,modeAutoGlow 1.0s ease-in-out infinite}
.mode-btn[data-hvac="auto"]:hover{background:rgba(80,50,5,0.5);border-color:#f59e0b;box-shadow:0 4px 20px rgba(245,158,11,0.4),inset 0 0 14px rgba(245,158,11,0.12)}
.mode-btn[data-hvac="auto"].mode-btn--active .mode-icon{animation:modeAutoSpin 2s linear infinite,modeAutoGlow 2s ease-in-out infinite}

/* ── Cool Active: Trail animation overlay ── */
.dial-wrap{position:relative}

/* ── Hover: dial-temp — phóng to + sáng rực ── */
@keyframes dialTempPulse{0%,100%{filter:brightness(1) drop-shadow(0 0 8px currentColor)}50%{filter:brightness(1.3) drop-shadow(0 0 22px currentColor) drop-shadow(0 0 40px currentColor)}}
.dial-temp{font-size:44px;transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),filter 0.25s ease;cursor:default}
.dial-center:hover .dial-temp,.dial-wrap:hover .dial-temp{transform:scale(1.18);animation:dialTempPulse 1.4s ease-in-out infinite}
.sl-temp-val{transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),filter 0.25s ease;cursor:default}
.sl-dial-center:hover .sl-temp-val,.sl-dial-wrap:hover .sl-temp-val{transform:scale(1.18);animation:dialTempPulse 1.4s ease-in-out infinite}
/* ha-icon bên trong mode-icon inherit animation từ parent */
.mode-icon ha-icon,.mode-icon>*{pointer-events:none;display:inline-flex;}
.fan-swing-row{display:grid;grid-template-columns:3fr 2fr;gap:8px;min-width:0}
.fan-card,.swing-card{background:rgba(0,20,50,0.28);border:1px solid rgba(255,255,255,0.22);
  border-radius:14px;padding:9px 12px;display:flex;flex-direction:column;gap:6px;min-width:0;overflow:hidden}
.fc-head{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:2px}
.fc-label{font-size:8px;letter-spacing:0.8px;text-transform:uppercase;color:var(--cv-fc-label,rgba(255,255,255,0.55));font-weight:700;word-break:break-word;overflow-wrap:break-word;line-height:1.35;max-width:100%}
.fc-val{font-size:10px;color:var(--cv-fc-val,rgba(255,255,255,0.95));font-weight:700;white-space:nowrap;flex-shrink:0;margin-left:4px}
.fan-body{display:flex;align-items:flex-end;gap:10px}
.fan-ico{font-size:22px;opacity:0.9;line-height:1;flex-shrink:0;display:flex;align-items:center;min-width:42px}
@keyframes fanSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fan-bars{display:flex;align-items:flex-end;gap:3px;height:32px}
.fbar{width:6px;border-radius:3px 3px 2px 2px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);transition:all 0.3s;flex-shrink:0}
.fbar.fbar-on{background:var(--cv-fan-bar,var(--accent));border-color:rgba(255,255,255,0.55);box-shadow:0 0 8px var(--glow),0 0 3px rgba(255,255,255,0.3),inset 0 1px 0 rgba(255,255,255,0.35)}
.fan-tap{display:flex;align-items:flex-end;gap:10px;cursor:pointer;outline:none;
  background:none;border:none;padding:0;width:100%}
.swing-body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex:1}
.swing-btn{display:flex;flex-direction:column;align-items:center;gap:4px;
  background:none;border:none;cursor:pointer;outline:none;padding:0;width:100%}
.swing-lbl{font-size:9px;color:var(--cv-swing-lbl,rgba(255,255,255,0.7));font-weight:600}
.chips{display:flex;gap:7px}
.chip{flex:1;background:rgba(0,20,50,0.28);border:1px solid rgba(255,255,255,0.25);
  border-radius:12px;padding:7px 4px;display:flex;align-items:center;justify-content:center;gap:4px;
  cursor:pointer;outline:none;font-size:9px;font-weight:600;font-family:'Sora',sans-serif;
  color:rgba(255,255,255,0.75);transition:all 0.2s;white-space:nowrap}
.chip:hover{background:rgba(0,30,70,0.45);transform:translateY(-1px)}
.chip:active{transform:scale(0.95)}
.chip--g{color:#ffffff;border-color:rgba(52,211,153,0.7)!important;background:rgba(52,211,153,0.35)!important}
.chip--a{color:#ffffff;border-color:rgba(251,191,36,0.7)!important;background:rgba(251,191,36,0.35)!important}
.chip--b{color:#ffffff;border-color:rgba(96,165,250,0.7)!important;background:rgba(96,165,250,0.35)!important}
.power-row{display:flex;align-items:center;gap:12px;background:rgba(0,20,50,0.3);
  border:1px solid rgba(255,255,255,0.25);border-radius:18px;padding:10px 14px;
  cursor:pointer;outline:none;text-align:left;transition:all 0.2s;font-family:'Sora',sans-serif;width:100%}
.power-row:hover{background:rgba(0,30,70,0.45)}
.power-row:active{transform:scale(0.98)}
.pw-btn{width:40px;height:40px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:19px;transition:all 0.35s}
.pw-on{background:linear-gradient(135deg,#3b9eff,#1a5faa);
  box-shadow:0 0 26px rgba(59,158,255,0.7),0 0 50px rgba(59,158,255,0.25);animation:pwP 2.5s ease-in-out infinite}
.pw-off{background:rgba(0,20,50,0.25);border:1px solid rgba(255,255,255,0.5)}
@keyframes pwP{0%,100%{box-shadow:0 0 26px rgba(59,158,255,0.7),0 0 50px rgba(59,158,255,0.25)}50%{box-shadow:0 0 40px rgba(59,158,255,0.95),0 0 70px rgba(59,158,255,0.45)}}
.pw-sub{font-size:9px;color:rgba(255,255,255,0.5);margin-top:2px}
.pw-sub--big{font-size:13px;font-weight:600;color:var(--cv-power-lbl,rgba(255,255,255,0.85));letter-spacing:0.2px}
.confirm-popup{position:fixed;z-index:9999;
  background:rgba(6,10,24,0.98);backdrop-filter:blur(28px) saturate(1.8);-webkit-backdrop-filter:blur(28px) saturate(1.8);
  border:1px solid rgba(255,80,80,0.35);border-radius:20px;padding:18px 16px 14px;width:220px;
  box-shadow:0 8px 48px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.1)}
.cp-title{font-size:13px;font-weight:700;color:#ffffff;text-align:center;margin-bottom:5px}
.cp-sub{font-size:9px;color:rgba(255,150,150,0.75);text-align:center;margin-bottom:14px;letter-spacing:0.3px}
.cp-acts{display:flex;gap:8px}
.cp-cancel{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);
  border-radius:10px;padding:9px;font-size:10px;font-weight:600;font-family:'Sora',sans-serif;
  color:rgba(255,255,255,0.6);cursor:pointer;outline:none;touch-action:manipulation}
.cp-ok{flex:1;background:rgba(255,60,60,0.22);border:1px solid rgba(255,80,80,0.6);
  border-radius:10px;padding:9px;font-size:10px;font-weight:700;font-family:'Sora',sans-serif;
  color:#ff6b6b;cursor:pointer;outline:none;touch-action:manipulation}
.pw-arrow{color:rgba(255,255,255,0.4);font-size:20px}
.right{flex:1;background:linear-gradient(160deg,rgba(160,220,240,0.10) 0%,rgba(100,180,210,0.08) 100%);display:flex;flex-direction:column;position:relative;overflow-x:hidden;overflow-y:visible;min-height:0}
.right--lite{flex:0 0 45%;min-width:0;max-width:none}
.left--lite{flex:0 0 55%}
.card--lite{min-height:0 !important}
.lite-bottom{display:flex;flex-direction:column;gap:6px;padding:8px 8px 10px;margin-top:8px}
.power-row--lite{padding:7px 8px;border-radius:12px;gap:7px}
.power-row--lite .pw-btn{width:32px;height:32px;font-size:16px}
.power-row--lite .pw-sub--big{font-size:11px}
.lite-bottom-row{display:flex;gap:6px}
.lite-small-btn{flex:1;border-radius:12px;padding:8px 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:rgba(0,20,50,0.28);border:1px solid rgba(255,255,255,0.22);cursor:pointer;outline:none;font-family:'Sora',sans-serif;min-width:0}
.lite-small-btn:hover{background:rgba(0,30,70,0.45)}
.lite-small-btn:active{transform:scale(0.96)}
.lite-small-btn .lsb-ico{font-size:16px;line-height:1}
.lite-small-btn .lsb-lbl{font-size:9px;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.3px;text-align:center;white-space:nowrap}
.lite-small-btn .lsb-cd{font-family:'Orbitron',sans-serif;font-size:8px;color:rgba(251,191,36,0.9);min-height:10px}
.lite-small-btn--timer-active{border-color:rgba(251,191,36,0.75)!important;background:rgba(251,191,36,0.12)!important;box-shadow:0 0 12px rgba(251,191,36,0.2)}
.lite-small-btn--alloff{
  background:linear-gradient(145deg,rgba(220,38,38,0.78),rgba(180,15,15,0.85)) !important;
  border-color:rgba(255,120,120,0.5) !important;
  box-shadow:0 4px 0 rgba(100,0,0,0.65),0 6px 14px rgba(220,38,38,0.4),inset 0 1px 0 rgba(255,180,180,0.25) !important;
  transform:translateY(-2px);
  transition:transform 0.12s ease,box-shadow 0.12s ease !important;
  animation:allOffPulseLite 2.4s ease-in-out infinite;
}
@keyframes allOffPulseLite{
  0%,100%{box-shadow:0 4px 0 rgba(100,0,0,0.65),0 6px 14px rgba(220,38,38,0.4),inset 0 1px 0 rgba(255,180,180,0.25),0 0 0 0 rgba(220,38,38,0)}
  50%{box-shadow:0 4px 0 rgba(100,0,0,0.65),0 8px 22px rgba(220,38,38,0.58),inset 0 1px 0 rgba(255,180,180,0.25),0 0 16px 3px rgba(220,38,38,0.25)}
}
.lite-small-btn--alloff:hover{
  background:linear-gradient(145deg,rgba(239,68,68,0.9),rgba(200,25,25,0.92)) !important;
  border-color:rgba(255,150,150,0.65) !important;
  transform:translateY(-4px) !important;
  box-shadow:0 6px 0 rgba(100,0,0,0.65),0 10px 22px rgba(220,38,38,0.55),inset 0 1px 0 rgba(255,200,200,0.35) !important;
  animation:none !important;
}
.lite-small-btn--alloff:active{
  transform:translateY(1px) !important;
  box-shadow:0 1px 0 rgba(100,0,0,0.65),0 3px 8px rgba(220,38,38,0.3),inset 0 2px 3px rgba(0,0,0,0.25) !important;
  animation:none !important;
}
.lite-small-btn--alloff .lsb-ico{color:#ffc0c0;text-shadow:0 0 10px rgba(255,80,80,0.7)}
.lite-small-btn--alloff .lsb-lbl{color:#ffb0b0 !important;font-weight:700 !important;text-shadow:0 1px 4px rgba(255,60,60,0.5)}
.room-image{flex:0 0 185px;position:relative;overflow:hidden}
.room-img-el{width:100%;height:100%;object-fit:cover;transition:opacity 0.6s ease,transform 0.8s ease;display:block}
.room-img-el.fade-out{opacity:0;transform:scale(1.04)}
.room-image::after{content:"";position:absolute;inset:0;
  background:linear-gradient(to bottom,rgba(10,12,16,0.05) 0%,rgba(10,12,16,0) 15%,rgba(10,12,16,0.45) 55%,rgba(10,12,16,0.82) 78%,rgba(10,12,16,1) 100%);
  pointer-events:none;z-index:1}
.room-image::before{content:"";position:absolute;bottom:-1px;left:0;right:0;height:80px;
  background:inherit;filter:blur(18px) brightness(0.4);
  mask-image:linear-gradient(to bottom,transparent 0%,black 60%);
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,black 60%);
  pointer-events:none;z-index:0}
.ac-overlay{position:absolute;top:12px;left:50%;transform:translateX(-50%);
  background:rgba(8,10,20,0.52);backdrop-filter:blur(16px) saturate(1.8);-webkit-backdrop-filter:blur(16px) saturate(1.8);
  border:1px solid rgba(255,255,255,0.18);border-radius:30px;padding:6px 16px;
  display:flex;align-items:center;gap:8px;z-index:3;white-space:nowrap;
  box-shadow:0 8px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.12)}
.ac-led{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.led-on{background:#34d399;box-shadow:0 0 10px #34d399,0 0 20px rgba(52,211,153,0.5);animation:blink 2.5s infinite}
.led-off{background:#4b5563}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
.ac-overlay-txt{font-size:9.5px;font-weight:700;color:rgba(255,255,255,0.85);letter-spacing:1.5px}
.ac-mode-chip{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:var(--accent);
  font-size:8.5px;font-weight:600;padding:2px 9px;border-radius:10px}
.img-temp-badge{position:absolute;bottom:18px;left:14px;z-index:3;
  font-family:'Orbitron',sans-serif;font-size:28px;font-weight:800;
  color:#ffffff;line-height:1;
  text-shadow:0 0 18px var(--glow),0 0 40px var(--glow),0 2px 20px rgba(0,0,0,0.7);
  animation:tempPulse 2.2s ease-in-out infinite}
.img-temp-badge span{font-size:13px;opacity:0.7;font-weight:400}
@keyframes tempPulse{
  0%,100%{text-shadow:0 0 14px var(--glow),0 0 30px var(--glow),0 2px 20px rgba(0,0,0,0.7);opacity:1}
  40%{text-shadow:0 0 28px var(--glow),0 0 60px var(--glow),0 0 90px var(--glow),0 2px 20px rgba(0,0,0,0.6);opacity:1}
  55%{text-shadow:0 0 14px var(--glow),0 0 30px var(--glow),0 2px 20px rgba(0,0,0,0.7);opacity:0.92}
  70%{text-shadow:0 0 22px var(--glow),0 0 50px var(--glow),0 0 75px var(--glow),0 2px 20px rgba(0,0,0,0.6);opacity:1}
  85%{text-shadow:0 0 14px var(--glow),0 0 30px var(--glow),0 2px 20px rgba(0,0,0,0.7);opacity:0.95}
}
.img-room-name{position:absolute;bottom:18px;right:14px;z-index:3;
  font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);text-align:right}
.status-block{padding:8px 12px 6px;display:flex;flex-direction:column;gap:7px;
  background:linear-gradient(to bottom,rgba(10,12,16,0.92) 0%,rgba(10,20,40,0.55) 100%);
  margin-top:-2px}
.status-header{display:flex;align-items:center;justify-content:space-between}
.st-title{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:var(--cv-st-title,rgba(255,255,255,0.55));font-weight:600}
.st-on{font-size:13px;font-weight:700;color:var(--cv-status-on,#34d399);margin-top:2px}
.st-off{font-size:13px;font-weight:700;color:var(--cv-status-off,rgba(255,255,255,0.45));margin-top:2px}
.st-sub{font-size:9.5px;color:var(--cv-st-sub,rgba(255,255,255,0.5));margin-top:1px}
.pm-ring{width:52px;height:52px;border-radius:50%;
  background:radial-gradient(circle,rgba(52,211,153,0.22) 0%,rgba(52,211,153,0.08) 60%,rgba(0,20,50,0.4) 100%);
  border:1.5px solid rgba(52,211,153,0.5);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;
  box-shadow:0 0 18px rgba(52,211,153,0.35),0 0 40px rgba(52,211,153,0.15),inset 0 1px 0 rgba(52,211,153,0.25)}
.pm-val{font-family:'Orbitron',sans-serif;font-size:14px;font-weight:600;color:#34d399;line-height:1.1}
.pm-unit{font-size:7px;color:rgba(52,211,153,0.5);letter-spacing:0.5px}
.metrics{display:flex;gap:5px}
.met{flex:1;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.06);
  border-radius:11px;padding:7px 6px;display:flex;flex-direction:row;align-items:center;gap:5px;justify-content:center}
.met-ico{font-size:16px;line-height:1;flex-shrink:0}
.met-val{font-family:'Orbitron',sans-serif;font-size:11px;font-weight:600;color:#ffffff;white-space:nowrap}
.met-lbl{font-size:7.5px;color:rgba(255,255,255,0.55)}

.room-status-badge{font-size:9px;font-weight:700;letter-spacing:0.3px;padding:3px 8px;border-radius:7px;flex-shrink:0;line-height:1.5;min-width:32px;text-align:center;align-self:center}
.rsb-on{background:color-mix(in srgb,var(--cv-room-on,var(--accent)) 55%,rgba(0,10,30,0.4));color:#ffffff;border:1px solid color-mix(in srgb,var(--cv-room-on,var(--accent)) 80%,transparent)}
.rsb-off{background:rgba(0,20,50,0.25);color:var(--cv-room-off,rgba(255,255,255,0.55));border:1px solid rgba(255,255,255,0.3)}
.all-off-btn{
  margin:0 10px 6px;
  background:linear-gradient(145deg,rgba(220,38,38,0.82),rgba(185,18,18,0.88));
  border:1px solid rgba(255,120,120,0.55);
  border-radius:13px;padding:9px 12px;display:flex;align-items:center;gap:10px;
  cursor:pointer;outline:none;width:calc(100% - 20px);text-align:left;
  font-family:'Sora',sans-serif;
  box-shadow:
    0 6px 0 rgba(120,0,0,0.7),
    0 8px 16px rgba(220,38,38,0.45),
    0 2px 8px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,180,180,0.3),
    inset 0 -1px 0 rgba(0,0,0,0.25);
  transform:translateY(-3px);
  transition:transform 0.12s ease,box-shadow 0.12s ease,background 0.2s;
  position:relative;
  animation:allOffPulse 2.4s ease-in-out infinite;
}
@keyframes allOffPulse{
  0%,100%{box-shadow:0 6px 0 rgba(120,0,0,0.7),0 8px 16px rgba(220,38,38,0.45),0 2px 8px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,180,180,0.3),inset 0 -1px 0 rgba(0,0,0,0.25),0 0 0 0 rgba(220,38,38,0)}
  50%{box-shadow:0 6px 0 rgba(120,0,0,0.7),0 10px 28px rgba(220,38,38,0.65),0 2px 8px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,180,180,0.3),inset 0 -1px 0 rgba(0,0,0,0.25),0 0 22px 4px rgba(220,38,38,0.28)}
}
.all-off-btn:hover{
  background:linear-gradient(145deg,rgba(239,68,68,0.92),rgba(200,28,28,0.95));
  transform:translateY(-5px);
  box-shadow:
    0 8px 0 rgba(120,0,0,0.7),
    0 14px 32px rgba(220,38,38,0.6),
    0 3px 10px rgba(0,0,0,0.45),
    inset 0 1px 0 rgba(255,200,200,0.4),
    inset 0 -1px 0 rgba(0,0,0,0.25);
  animation:none;
}
.all-off-btn:active{
  transform:translateY(2px);
  box-shadow:
    0 2px 0 rgba(120,0,0,0.7),
    0 4px 10px rgba(220,38,38,0.35),
    0 1px 4px rgba(0,0,0,0.3),
    inset 0 2px 4px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,180,180,0.15);
  animation:none;
}
.all-off-ico{width:36px;height:36px;border-radius:50%;
  background:linear-gradient(145deg,rgba(255,100,100,0.35),rgba(200,20,20,0.4));
  border:1px solid rgba(255,150,150,0.5);
  display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;
  box-shadow:0 0 18px rgba(255,60,60,0.5),inset 0 1px 0 rgba(255,200,200,0.3)}
.all-off-info{flex:1}
.all-off-title{font-size:11px;font-weight:700;color:#ffe0e0;text-shadow:0 1px 6px rgba(255,60,60,0.6)}
.all-off-sub{font-size:8.5px;color:rgba(255,200,200,0.7);margin-top:1px}
.all-off-arr{color:rgba(255,180,180,0.75);font-size:18px;text-shadow:0 0 8px rgba(255,80,80,0.5)}
.bottom-row{display:flex;gap:8px}
.power-row{display:flex;align-items:center;gap:10px;background:rgba(0,20,50,0.3);
  border:1px solid rgba(255,255,255,0.25);border-radius:18px;padding:12px 14px;
  cursor:pointer;outline:none;text-align:left;transition:all 0.2s;font-family:'Sora',sans-serif;flex:1.6;min-width:0}
.power-row:hover{background:rgba(0,30,70,0.45)}
.power-row:active{transform:scale(0.98)}
.timer-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:rgba(0,20,50,0.3);border:1px solid rgba(255,255,255,0.22);border-radius:18px;
  padding:10px 8px;cursor:pointer;outline:none;font-family:'Sora',sans-serif;
  transition:all 0.2s;flex:1;min-width:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;position:relative;overflow:visible}
@keyframes timerShake{0%,100%{transform:rotate(0deg) scale(1)}8%{transform:rotate(-18deg) scale(1.12)}16%{transform:rotate(16deg) scale(1.12)}24%{transform:rotate(-12deg) scale(1.08)}32%{transform:rotate(10deg) scale(1.06)}40%{transform:rotate(-6deg) scale(1.03)}50%{transform:rotate(5deg) scale(1.02)}60%,100%{transform:rotate(0deg) scale(1)}}
@keyframes timerGlow{0%,100%{filter:drop-shadow(0 0 3px rgba(251,191,36,0.4))}50%{filter:drop-shadow(0 0 10px rgba(251,191,36,0.9)) drop-shadow(0 0 20px rgba(251,191,36,0.5))}}
.timer-btn:hover{background:rgba(20,15,0,0.5);border-color:rgba(251,191,36,0.6);box-shadow:0 4px 18px rgba(251,191,36,0.25),inset 0 0 12px rgba(251,191,36,0.07)}
.timer-btn:hover .timer-ico{animation:timerShake 0.9s ease-in-out infinite,timerGlow 0.9s ease-in-out infinite;display:inline-block}
.timer-btn--active{border-color:rgba(251,191,36,0.75)!important;background:rgba(251,191,36,0.12)!important;box-shadow:0 0 14px rgba(251,191,36,0.2)}
.timer-ico{font-size:18px;line-height:1;pointer-events:none;transition:filter 0.2s}
.timer-lbl{font-size:7px;font-weight:700;letter-spacing:1px;color:var(--cv-timer-lbl,rgba(255,255,255,0.5));text-transform:uppercase;pointer-events:none}
.timer-cd{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:600;color:rgba(251,191,36,0.9);line-height:1;min-height:13px;pointer-events:none}

/* ── Room tab tooltip ── */
.room-tab{position:relative}
/* Tooltip được inject vào document.body qua JS — dùng position:fixed để thoát khỏi overflow:hidden */
.ac-room-tip{position:fixed;z-index:99999;pointer-events:none;
  background:rgba(6,10,28,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,0.14);border-radius:12px;
  padding:8px 13px;max-width:240px;white-space:normal;line-height:1.5;
  font-size:10.5px;font-weight:500;font-family:'Sora',sans-serif;
  box-shadow:0 4px 24px rgba(0,0,0,0.65),inset 0 1px 0 rgba(255,255,255,0.08);
  opacity:0;transition:opacity 0.15s ease,transform 0.15s ease;
  transform:translateX(-4px)}
.ac-room-tip.tip-visible{opacity:1;transform:translateX(0)}
.ac-room-tip::before{content:'';position:absolute;right:100%;top:50%;transform:translateY(-50%);
  border:6px solid transparent;border-right-color:rgba(255,255,255,0.14)}
.ac-room-tip::after{content:'';position:absolute;right:100%;top:50%;transform:translateY(-50%);
  border:5px solid transparent;border-right-color:rgba(6,10,28,0.97);margin-right:-1px}
.timer-popup{position:fixed;z-index:9999;
  background:rgba(6,10,24,0.98);backdrop-filter:blur(28px) saturate(1.8);-webkit-backdrop-filter:blur(28px) saturate(1.8);
  border:1px solid rgba(255,255,255,0.18);border-radius:20px;padding:15px 13px 13px;width:218px;
  box-shadow:0 8px 48px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.06),inset 0 1px 0 rgba(255,255,255,0.12)}
.tp-title{font-size:8px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);
  font-weight:700;text-align:center;margin-bottom:10px}
.tp-tabs{display:flex;gap:5px;margin-bottom:11px}
.tp-tab{flex:1;padding:7px 4px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.14);
  border-radius:10px;font-size:9px;font-weight:700;font-family:'Sora',sans-serif;
  color:rgba(255,255,255,0.5);cursor:pointer;outline:none;transition:all 0.15s;text-align:center;
  touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}
.tp-tab-off-sel{background:rgba(251,191,36,0.18)!important;border-color:rgba(251,191,36,0.7)!important;color:#fbbf24!important}
.tp-tab-on-sel{background:rgba(52,211,153,0.18)!important;border-color:rgba(52,211,153,0.7)!important;color:#34d399!important}
.tp-hours{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:11px}
.tp-h{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.13);
  border-radius:9px;padding:7px 3px;font-size:10px;font-weight:600;font-family:'Orbitron',sans-serif;
  color:rgba(255,255,255,0.65);cursor:pointer;outline:none;transition:all 0.13s;text-align:center;
  touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}
.tp-h:hover{background:rgba(255,255,255,0.12);color:#fff}
.tp-h-off{background:rgba(251,191,36,0.22)!important;border-color:rgba(251,191,36,0.8)!important;color:#fbbf24!important;box-shadow:0 0 10px rgba(251,191,36,0.25)}
.tp-h-on{background:rgba(52,211,153,0.22)!important;border-color:rgba(52,211,153,0.8)!important;color:#34d399!important;box-shadow:0 0 10px rgba(52,211,153,0.25)}
.tp-acts{display:flex;gap:6px}
.tp-cancel{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.16);
  border-radius:9px;padding:8px;font-size:9px;font-weight:600;font-family:'Sora',sans-serif;
  color:rgba(255,255,255,0.55);cursor:pointer;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}
.tp-del{flex:1;background:rgba(255,60,60,0.08);border:1px solid rgba(255,80,80,0.25);
  border-radius:9px;padding:8px;font-size:9px;font-weight:600;font-family:'Sora',sans-serif;
  color:rgba(255,130,130,0.8);cursor:pointer;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}
.tp-ok{flex:1.3;border-radius:9px;padding:8px;font-size:9px;font-weight:700;font-family:'Sora',sans-serif;
  cursor:pointer;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}
.tp-ok-off{background:rgba(251,191,36,0.2);border:1px solid rgba(251,191,36,0.6);color:#fbbf24}
.tp-ok-on{background:rgba(52,211,153,0.2);border:1px solid rgba(52,211,153,0.6);color:#34d399}
.rt-header{font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:var(--cv-room-header,rgba(255,255,255,0.5));font-weight:600;margin-bottom:4px;margin-top:6px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.room-tabs{padding:0 10px 6px;display:flex;flex-direction:column;gap:4px;flex-shrink:0}
.room-tabs-inner{background:rgba(0,15,40,0.45);border:1px solid rgba(255,255,255,0.16);border-radius:14px;padding:7px;display:flex;flex-direction:column;gap:6px;box-shadow:0 4px 20px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.08)}
.room-tabs-inner.scrollable{max-height:calc(4 * 66px + 3 * 6px + 14px);overflow-y:auto !important;overflow-x:hidden !important;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.25) rgba(0,0,0,0.15)}
.room-tabs-inner.scrollable::-webkit-scrollbar{width:5px}
.room-tabs-inner.scrollable::-webkit-scrollbar-track{background:rgba(0,0,0,0.15);border-radius:4px}
.room-tabs-inner.scrollable::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.25);border-radius:4px}
.room-tab{display:flex;align-items:center;gap:8px;background:rgba(0,20,50,0.28);
  border:1px solid rgba(255,255,255,0.2);border-radius:14px;padding:12px 12px;min-height:58px;
  cursor:pointer;outline:none;text-align:left;transition:background 0.7s ease,border-color 0.2s,box-shadow 0.2s;width:100%;font-family:'Sora',sans-serif;overflow:hidden;box-sizing:border-box}
.room-tab--active.room-tab--on{border-color:color-mix(in srgb,var(--accent) 70%,transparent)!important;box-shadow:0 0 14px color-mix(in srgb,var(--accent) 30%,transparent)}
.room-tab--active.room-tab--off{border-color:rgba(251,191,36,0.5)!important}
.room-tab--running{border-color:color-mix(in srgb,var(--accent) 35%,rgba(255,255,255,0.2))!important}
.room-tab-ico{font-size:20px;line-height:1;flex-shrink:0;width:24px;text-align:center;display:flex;align-items:center;justify-content:center}
.room-tab-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.room-tab-name{font-size:12px;font-weight:600;color:var(--cv-room-name,rgba(255,255,255,0.9));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.room-tab-temp{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.5)}

/* ── Super Lite mode ─────────────────────────────────────────────────────── */
.card--super-lite{display:flex;flex-direction:column;border-radius:22px;min-height:0;width:100%;box-sizing:border-box}
.sl-body{display:flex;flex-direction:column;padding:12px 14px 14px;gap:10px}
.sl-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.sl-title{font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.9);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px}
.sl-badge{display:flex;align-items:center;gap:5px;background:rgba(0,20,50,0.32);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:3px 10px 3px 6px}
.sl-led{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.sl-led-on{background:#34d399;box-shadow:0 0 8px #34d399;animation:blink 2.5s infinite}
.sl-led-off{background:#4b5563}
.sl-badge-txt{font-size:9px;font-weight:700;color:rgba(255,255,255,0.85);letter-spacing:1px}
.sl-dial-wrap{display:flex;justify-content:center;position:relative;margin:-4px 0 -8px;transform:scale(1.12);transform-origin:center top}
.sl-dial-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-46%);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;width:130px}
.sl-temp-lbl{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.5);font-weight:500}
.sl-temp-val{font-family:'Orbitron',sans-serif;font-size:40px;font-weight:800;line-height:1;transition:color 0.6s ease}
.sl-temp-feel{font-size:10px;color:rgba(255,255,255,0.55);margin-top:4px;font-weight:300;text-align:center;max-width:120px;line-height:1.4}
.sl-temp-ctrl{display:flex;align-items:center;justify-content:center;gap:0}
.sl-temp-btn{width:36px;height:36px;border-radius:50%;background:rgba(0,20,50,0.28);
  border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);font-size:22px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;outline:none;transition:all 0.15s;font-family:'Sora',sans-serif}
.sl-temp-btn:hover{background:rgba(0,30,70,0.45);border-color:var(--accent);color:var(--accent)}
.sl-temp-btn:active{transform:scale(0.88)}
.sl-temp-set{min-width:88px;text-align:center;font-family:'Orbitron',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.85)}
.sl-controls{display:flex;gap:8px;align-items:stretch}
.sl-controls--compact .sl-mode-wrap{flex:0 0 30%;min-width:0;position:relative}
.sl-controls--compact .sl-room-wrap{flex:1 1 0;min-width:0;position:relative}
.sl-mode-wrap{flex:0 0 30%;min-width:0;position:relative}
.sl-room-wrap{flex:1 1 0;min-width:0;position:relative}
.sl-fanswing-wrap{display:flex;flex-direction:column;gap:5px;flex:0 0 calc(30% - 8px);min-width:0;align-self:stretch}
.sl-mini-btn{width:100%;background:rgba(0,20,50,0.45);border:1px solid rgba(255,255,255,0.22);border-radius:10px;
  color:#fff;font-family:'Sora',sans-serif;font-size:10px;font-weight:600;
  padding:0 8px;cursor:pointer;outline:none;display:flex;align-items:center;justify-content:space-between;gap:4px;
  transition:all 0.2s;white-space:nowrap;overflow:hidden;box-sizing:border-box;flex:1;min-height:28px}
.sl-mini-btn--inline{width:auto;flex:0 0 auto;min-width:0;max-width:72px;height:28px;border-radius:50px;padding:0 8px;justify-content:center;gap:3px;font-size:9px}
.sl-mini-btn--inline.sl-fan-inline{margin-right:6px}
.sl-mini-btn--inline.sl-swing-inline{margin-left:6px}
.sl-mini-btn:hover{border-color:rgba(255,255,255,0.45);background:rgba(0,30,70,0.55)}
.sl-mini-btn:active{transform:scale(0.94)}
.sl-mini-btn-ico{font-size:13px;line-height:1;flex-shrink:0}
.sl-mini-btn-val{flex:1;overflow:hidden;text-overflow:ellipsis;text-align:right;opacity:0.8}
.sl-select{width:100%;background:rgba(0,20,50,0.45);border:1px solid rgba(255,255,255,0.22);border-radius:12px;
  color:#ffffff;font-family:'Sora',sans-serif;font-size:11px;font-weight:600;
  padding:10px 10px 10px 10px;cursor:pointer;outline:none;appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.5)'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;
  transition:all 0.2s;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.sl-select:hover{border-color:rgba(255,255,255,0.45);background-color:rgba(0,30,70,0.55)}
.sl-select option{background:#0a1a2e;color:#ffffff;font-size:12px}
.sl-select-lbl{font-size:8px;letter-spacing:0.8px;text-transform:uppercase;color:rgba(255,255,255,0.45);
  font-weight:700;margin-bottom:4px;padding-left:2px}
.sl-mode-active{border-color:color-mix(in srgb,var(--accent) 75%,transparent)!important;
  background-color:color-mix(in srgb,var(--accent) 15%,rgba(0,20,50,0.45))!important;
  box-shadow:0 0 14px color-mix(in srgb,var(--accent) 25%,transparent)}
.sl-power-row{display:flex;align-items:center;gap:10px;background:rgba(0,20,50,0.32);
  border:1px solid rgba(255,255,255,0.22);border-radius:14px;padding:10px 14px;
  cursor:pointer;outline:none;transition:all 0.2s;font-family:'Sora',sans-serif;width:100%}
.sl-power-row:hover{background:rgba(0,30,70,0.5)}
.sl-power-row:active{transform:scale(0.98)}
/* ── Custom room dropdown ── */
.sl-room-btn{width:100%;background:rgba(0,20,50,0.45);border:1px solid rgba(255,255,255,0.22);border-radius:12px;
  color:#ffffff;font-family:'Sora',sans-serif;font-size:11px;font-weight:600;
  padding:10px 28px 10px 10px;cursor:pointer;outline:none;
  display:flex;align-items:center;justify-content:space-between;gap:4px;
  transition:all 0.2s;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;
  position:relative;box-sizing:border-box}
.sl-room-btn:hover{border-color:rgba(255,255,255,0.45);background-color:rgba(0,30,70,0.55)}
.sl-room-btn-txt{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.sl-room-btn-arrow{flex-shrink:0;width:10px;height:6px;opacity:0.5;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1)}
.sl-room-btn-arrow.open{transform:rotate(180deg)}
/* Overlay backdrop để blur hoạt động đúng trên mọi platform */
.sl-room-overlay{position:fixed;inset:0;z-index:9990;background:transparent}
.sl-room-popup{
  position:fixed;z-index:9999;
  /* Solid dark base — đảm bảo không bao giờ trong suốt */
  background:linear-gradient(135deg,rgba(6,18,40,0.96) 0%,rgba(12,28,60,0.96) 100%);
  border:1px solid rgba(255,255,255,0.18);
  border-top:1px solid rgba(255,255,255,0.28);
  border-radius:20px;
  /* Blur lên trên overlay */
  backdrop-filter:blur(40px) saturate(1.8);
  -webkit-backdrop-filter:blur(40px) saturate(1.8);
  box-shadow:
    0 2px 0 rgba(255,255,255,0.12) inset,
    0 20px 60px rgba(0,0,0,0.7),
    0 0 0 1px rgba(255,255,255,0.05),
    0 0 80px rgba(59,130,246,0.15);
  overflow:hidden;padding:8px;min-width:200px;
  transform-origin:top center;
  animation:slBubblePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both}
/* Bubble burst: scale vượt qua 1 rồi settle — giống iOS spring */
@keyframes slBubblePop{
  0%  {opacity:0;transform:scale(0.5) translateY(-10px);filter:blur(8px)}
  60% {opacity:1;transform:scale(1.04) translateY(2px);filter:blur(0)}
  80% {transform:scale(0.98) translateY(0)}
  100%{transform:scale(1)   translateY(0)}
}
/* Shimmer line ở top — hiệu ứng glass highlight */
.sl-room-popup::before{
  content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);
  border-radius:50%}
.sl-room-item{display:flex;align-items:center;gap:8px;padding:11px 14px;border-radius:12px;
  cursor:pointer;font-family:'Sora',sans-serif;font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);
  transition:background 0.13s,transform 0.1s;white-space:nowrap;
  /* Stagger animation cho từng item */
  animation:slItemIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both}
.sl-room-item:nth-child(1){animation-delay:0.04s}
.sl-room-item:nth-child(2){animation-delay:0.08s}
.sl-room-item:nth-child(3){animation-delay:0.12s}
.sl-room-item:nth-child(4){animation-delay:0.16s}
.sl-room-item:nth-child(5){animation-delay:0.20s}
.sl-room-item:nth-child(6){animation-delay:0.24s}
.sl-room-item:nth-child(7){animation-delay:0.28s}
.sl-room-item:nth-child(8){animation-delay:0.32s}
@keyframes slItemIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.sl-room-item:hover{background:rgba(255,255,255,0.1);transform:scale(1.01)}
.sl-room-item:active{transform:scale(0.97)}
.sl-room-item.active{background:linear-gradient(90deg,rgba(59,130,246,0.22),rgba(139,92,246,0.14));color:#fff;
  box-shadow:inset 0 0 0 1px rgba(99,179,237,0.2)}
.sl-room-item-badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;flex-shrink:0;letter-spacing:0.5px}
.sl-room-item-badge.on{background:rgba(52,211,153,0.2);color:#34d399;box-shadow:0 0 8px rgba(52,211,153,0.3)}
.sl-room-item-badge.off{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.35)}


/* ======================================================
   DEEP NEON THEME  -  modern, layered, glassmorphism
   ====================================================== */
.card--deep-neon{
  background:linear-gradient(160deg,#020b18 0%,#041428 35%,#061c35 65%,#030e1f 100%) !important;
  border:1px solid rgba(0,180,255,0.18) !important;
  box-shadow:
    0 0 0 1px rgba(0,212,255,0.12),
    0 0 40px rgba(0,120,220,0.18),
    0 40px 120px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(0,212,255,0.15),
    inset 0 -1px 0 rgba(0,80,180,0.08) !important;
  position:relative;overflow:hidden;
}
.card--deep-neon .left{
  background:linear-gradient(160deg,rgba(0,30,70,0.55) 0%,rgba(0,15,45,0.35) 100%) !important;
  border-right:1px solid rgba(0,180,255,0.14) !important;
}
.card--deep-neon .left::before{
  background:radial-gradient(circle,rgba(0,180,255,0.18) 0%,transparent 65%) !important;
  opacity:0.8 !important;
  width:500px !important;height:500px !important;
}
.card--deep-neon .hdr-ico{
  background:linear-gradient(135deg,rgba(0,180,255,0.9),rgba(0,80,200,0.8)) !important;
  box-shadow:0 4px 24px rgba(0,180,255,0.5),0 0 40px rgba(0,120,255,0.25) !important;
}
.card--deep-neon .hdr-title{color:rgba(180,230,255,0.95) !important;letter-spacing:2.5px}
.card--deep-neon .greet-name{
  color:#ffffff !important;
  text-shadow:0 0 20px rgba(0,200,255,0.5),0 0 40px rgba(0,150,255,0.25);
}
.card--deep-neon .dial-wrap{filter:drop-shadow(0 0 24px rgba(0,180,255,0.3))}
.card--deep-neon .sl-dial-wrap{filter:drop-shadow(0 0 24px rgba(0,180,255,0.3))}
.card--deep-neon .dial-temp,.card--deep-neon .sl-temp-val{filter:drop-shadow(0 0 12px currentColor)}
.card--deep-neon .temp-btn,.card--deep-neon .sl-temp-btn{
  background:rgba(0,30,80,0.6) !important;
  border:1px solid rgba(0,180,255,0.3) !important;
  box-shadow:0 0 10px rgba(0,120,255,0.15);
}
.card--deep-neon .temp-btn:hover,.card--deep-neon .sl-temp-btn:hover{
  background:rgba(0,60,140,0.7) !important;
  border-color:rgba(0,212,255,0.7) !important;
  box-shadow:0 0 20px rgba(0,180,255,0.4) !important;
}
.card--deep-neon .mode-btn{
  background:rgba(0,20,60,0.55) !important;
  border:1px solid rgba(0,160,255,0.18) !important;
}
.card--deep-neon .mode-btn:hover{background:rgba(0,40,100,0.7) !important;border-color:rgba(0,200,255,0.45) !important}
.card--deep-neon .right{background:linear-gradient(160deg,rgba(0,20,55,0.45) 0%,rgba(0,10,35,0.3) 100%) !important}
.card--deep-neon .room-image::after{
  background:linear-gradient(to bottom,rgba(2,11,24,0.05) 0%,rgba(2,11,24,0) 15%,rgba(2,11,24,0.5) 55%,rgba(2,11,24,0.88) 78%,rgba(2,11,24,1) 100%) !important;
}
.card--deep-neon .status-block{background:rgba(0,20,55,0.55) !important;border:1px solid rgba(0,160,255,0.15) !important}
.card--deep-neon .metric-chip{
  background:rgba(0,25,65,0.7) !important;
  border:1px solid rgba(0,180,255,0.2) !important;
  box-shadow:0 0 8px rgba(0,100,255,0.12);
}
.card--deep-neon .room-tab{border:1px solid rgba(0,160,255,0.12) !important}
.card--deep-neon .room-tab:not([style]){background:rgba(0,20,55,0.55)}
.card--deep-neon .room-tab--active{
  border-color:rgba(0,200,255,0.4) !important;
  box-shadow:0 0 16px rgba(0,180,255,0.2) !important;
}
.card--deep-neon .room-tab--active:not([style]){background:rgba(0,40,100,0.65)}
.card--deep-neon .power-row{background:rgba(0,25,65,0.6) !important;border:1px solid rgba(0,160,255,0.18) !important}
.card--deep-neon .eco-badge{
  background:rgba(0,40,100,0.7) !important;
  border:1px solid rgba(0,200,255,0.3) !important;
  box-shadow:0 0 12px rgba(0,150,255,0.2);
}
.card--deep-neon .room-tabs-hdr{color:rgba(0,200,255,0.7) !important}
.card--deep-neon .room-tabs-hdr::before,.card--deep-neon .room-tabs-hdr::after{
  background:linear-gradient(90deg,transparent,rgba(0,180,255,0.5),transparent) !important;
}
.card--deep-neon .ac-overlay{
  background:rgba(2,11,24,0.75) !important;
  border:1px solid rgba(0,180,255,0.2) !important;
  box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 20px rgba(0,100,255,0.15) !important;
}
.card--deep-neon.card--super-lite{
  border:1px solid rgba(0,180,255,0.2) !important;
  box-shadow:0 0 0 1px rgba(0,212,255,0.1),0 0 60px rgba(0,100,220,0.2),0 30px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(0,212,255,0.18) !important;
}
.card--deep-neon .sl-badge{background:rgba(0,25,65,0.7) !important;border:1px solid rgba(0,180,255,0.25) !important}
.card--deep-neon .sl-select,.card--deep-neon .sl-room-btn{
  background:rgba(0,20,60,0.65) !important;
  border:1px solid rgba(0,160,255,0.22) !important;
}
.card--deep-neon .sl-select:hover,.card--deep-neon .sl-room-btn:hover{
  background:rgba(0,40,100,0.75) !important;
  border-color:rgba(0,212,255,0.55) !important;
  box-shadow:0 0 14px rgba(0,180,255,0.25) !important;
}
.card--deep-neon .room-tabs-inner{background:rgba(0,15,45,0.55) !important;border:1px solid rgba(0,160,255,0.12) !important}
.card--deep-neon .all-off-row{background:rgba(30,0,0,0.4) !important;border:1px solid rgba(255,80,80,0.2) !important}
.card--deep-neon::before{
  content:'';position:absolute;inset:0;pointer-events:none;border-radius:28px;z-index:0;
  background:
    radial-gradient(ellipse 80% 40% at 50% -5%,rgba(0,180,255,0.09) 0%,transparent 65%),
    radial-gradient(ellipse 50% 25% at 85% 105%,rgba(60,0,255,0.06) 0%,transparent 65%),
    radial-gradient(ellipse 30% 20% at 15% 80%,rgba(0,100,255,0.05) 0%,transparent 70%);
}
.card--deep-neon>*{position:relative;z-index:1}
.card--deep-neon .left::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,180,255,0.3),transparent);
  pointer-events:none;
}

/* -- Auto-scale responsive wrapper -- */
.card-scale-wrap{width:100%;overflow:hidden;border-radius:22px;box-sizing:border-box}
.card-scale-wrap>.card,.card-scale-wrap>.card--super-lite{transform-origin:top left}
`;

class AcControllerCardV2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeIdx   = 0;
    this._hass        = null;
    this._clockInt    = null;
    this._refreshInt  = null;   // interval 10s cập nhật nhiệt độ thực tế + ETA
    this._acTip       = null;   // tooltip element appended to document.body
    this._initialized = false;
    // timers: map roomIdx → { end, mode, hrs, int }
    this._timers           = {};
    this._outsideHandler   = null;
    this._confirmJustOpened = false;
    this._popupJustOpened  = false;
    // Lịch sử nhiệt độ để tính tốc độ giảm: map roomIdx → [{t, temp}, ...]
    this._tempHistory      = {};
    // Khôi phục tempHistory từ localStorage (survive reload)
    try {
      var savedHist = localStorage.getItem('ac_temp_history_v2');
      if (savedHist) {
        var th = JSON.parse(savedHist);
        var nowH = Date.now();
        var selfH = this;
        // Chỉ giữ điểm trong 30 phút gần nhất
        Object.keys(th).forEach(function(idx) {
          var pts = th[idx].filter(function(p) { return (nowH - p.t) < 30 * 60 * 1000; });
          if (pts.length > 0) selfH._tempHistory[idx] = pts;
        });
      }
    } catch(e) {}
    // Khôi phục lastHvacMode từ localStorage (survive reload + thiết bị khác)
    this._lastHvacMode = {};
    try {
      var savedHvac = localStorage.getItem('ac_last_hvac_mode_v1');
      if (savedHvac) this._lastHvacMode = JSON.parse(savedHvac) || {};
    } catch(e) {}

    // Khôi phục timer từ localStorage sau khi reload trang
    try {
      var saved = localStorage.getItem('ac_timer_state_v2');
      if (saved) {
        var ts = JSON.parse(saved);
        var now0 = Date.now();
        var self0 = this;
        Object.keys(ts).forEach(function(idx) {
          var t = ts[idx];
          if (t.end && t.end > now0) {
            self0._timers[idx] = { end: t.end, mode: t.mode || 'off', hrs: t.hrs || null, int: null };
          }
        });
      }
    } catch(e) {}
  }

  // ── FIX: So sánh state trước khi render ──────────────────────────────────
  set hass(h) {
    var prev = this._hass;
    this._hass = h;

    // Lần đầu tiên → phải render full
    if (!this._initialized) {
      this._renderFull();
      return;
    }

    // Chỉ re-render khi state của phòng đang chọn thực sự thay đổi
    var id = ROOMS[this._activeIdx].id;
    var changed = !prev
      || this._stateOf(h, id)   !== this._stateOf(prev, id)
      || this._attrOf(h, id, 'temperature')         !== this._attrOf(prev, id, 'temperature')
      || this._attrOf(h, id, 'current_temperature') !== this._attrOf(prev, id, 'current_temperature')
      || this._attrOf(h, id, 'fan_mode')            !== this._attrOf(prev, id, 'fan_mode')
      || this._attrOf(h, id, 'swing_mode')          !== this._attrOf(prev, id, 'swing_mode')
      || this._attrOf(h, id, 'preset_mode')         !== this._attrOf(prev, id, 'preset_mode');

    // Kiểm tra thêm badge ON/OFF của tất cả phòng (cho room tabs)
    if (!changed) {
      for (var i = 0; i < ROOMS.length; i++) {
        if (this._stateOf(h, ROOMS[i].id) !== this._stateOf(prev, ROOMS[i].id)) {
          changed = true;
          break;
        }
      }
    }

    // FIX v1.5.1: Kiểm tra các sensor entity riêng lẻ (temp, humidity, power, outdoor, PM2.5)
    // Trước đây bị bỏ sót → card không tự cập nhật khi sensor thay đổi, phải reload trang
    if (!changed && prev) {
      var cfg = this._config || {};
      // Global sensors
      var globalSensors = [
        cfg.outdoor_temp_entity,
        cfg.humidity_entity,
        cfg.power_entity,
        cfg.pm25_entity,
      ];
      for (var gi = 0; gi < globalSensors.length; gi++) {
        var gEnt = globalSensors[gi];
        if (gEnt) {
          var gNew = h.states && h.states[gEnt] ? h.states[gEnt].state : null;
          var gOld = prev.states && prev.states[gEnt] ? prev.states[gEnt].state : null;
          if (gNew !== gOld) { changed = true; break; }
        }
      }
    }
    if (!changed && prev) {
      // Per-room sensors (temp_entity, humidity_entity, power_entity cho mỗi phòng)
      var ents = (this._config && this._config.entities) || [];
      for (var ei = 0; ei < ROOMS.length && !changed; ei++) {
        var roomSensors = [
          ents[ei] && ents[ei].temp_entity,
          ents[ei] && ents[ei].humidity_entity,
          ents[ei] && ents[ei].power_entity,
        ];
        for (var si = 0; si < roomSensors.length; si++) {
          var sEnt = roomSensors[si];
          if (sEnt) {
            var sNew = h.states && h.states[sEnt] ? h.states[sEnt].state : null;
            var sOld = prev.states && prev.states[sEnt] ? prev.states[sEnt].state : null;
            if (sNew !== sOld) { changed = true; break; }
          }
        }
      }
    }

    if (changed) {
      // ── Ghi lịch sử nhiệt độ cho từng phòng ──────────────────────────────
      var nowMs = Date.now();
      var histDirty = false;
      for (var ri = 0; ri < ROOMS.length; ri++) {
        var rid = ROOMS[ri].id;
        var rTemp = parseFloat(this._attrOf(h, rid, 'current_temperature'));
        var rMode = this._stateOf(h, rid);
        if (!isNaN(rTemp) && rMode === 'cool') {
          if (!this._tempHistory[ri]) this._tempHistory[ri] = [];
          var hist = this._tempHistory[ri];
          var last = hist[hist.length - 1];
          if (!last || Math.abs(last.temp - rTemp) >= 0.05 || (nowMs - last.t) >= 30000) {
            hist.push({ t: nowMs, temp: rTemp });
            if (hist.length > 30) hist.splice(0, hist.length - 30);
            histDirty = true;
          }
        } else if (rMode !== 'cool') {
          // Chỉ xóa nếu thực sự đã tắt/đổi mode (không xóa ngay khi mới bật)
          if (this._tempHistory[ri] && this._tempHistory[ri].length > 0) {
            this._tempHistory[ri] = [];
            histDirty = true;
          }
        }
      }
      // Lưu lịch sử vào localStorage để survive reload
      if (histDirty) {
        try { localStorage.setItem('ac_temp_history_v2', JSON.stringify(this._tempHistory)); } catch(e) {}
      }
      this._renderFull();
    }
  }

  // Helpers để đọc state/attr an toàn từ bất kỳ hass object nào
  _stateOf(hassObj, id) {
    return hassObj && hassObj.states && hassObj.states[id] ? hassObj.states[id].state : 'off';
  }
  _attrOf(hassObj, id, k) {
    return hassObj && hassObj.states && hassObj.states[id] && hassObj.states[id].attributes
      ? hassObj.states[id].attributes[k]
      : null;
  }

  // ── Tính ETA làm lạnh ────────────────────────────────────────────────────
  // Trả về { eta: số phút, rate: số, mode: 'measured'|'estimated' } hoặc null
  // ── Cool Mode Trail Animation ─────────────────────────────────────────────
  // Bông tuyết + vệt sáng từ nút cool → tâm vòng tròn nhiệt + burst giọt nước
  // Lặp lại mỗi 10 giây khi đang ở chế độ cool
  // ── Cool Trail Animation ─────────────────────────────────────────────────
  // Kiến trúc: một vòng lặp RAF duy nhất chạy liên tục độc lập với DOM re-render.
  // Canvas gắn vào document.body (position:fixed) nên không bị innerHTML destroy.
  // _coolAnimRunning: flag tổng; _coolAnimPhase: 'trail'|'burst'|'wait'
  // Toàn bộ state lưu trong this._cas (cool anim state) object.

  _startCoolTrailAnim() {
    if (this._coolAnimRunning) return;
    this._coolAnimRunning = true;
    this._cas = null;          // reset state
    this._coolAnimRaf = requestAnimationFrame(this._coolAnimLoop.bind(this));
  }

  _stopCoolTrailAnim() {
    this._coolAnimRunning = false;
    if (this._coolAnimRaf) { cancelAnimationFrame(this._coolAnimRaf); this._coolAnimRaf = null; }
    this._cas = null;
    // Dọn canvas
    var c = document.getElementById('cool-trail-global-canvas');
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  _coolAnimLoop(ts) {
    // Nếu bị stop → thoát vòng lặp
    if (!this._coolAnimRunning) return;

    var self = this;
    var cas  = this._cas;

    // ── Khởi tạo state lần đầu hoặc sau mỗi chu kỳ wait ─────────────────
    if (!cas) {
      // Kiểm tra vẫn còn cool mode
      var room = ROOMS[this._activeIdx];
      var hvac = room && this._hass && this._hass.states && this._hass.states[room.id]
        ? (this._hass.states[room.id].attributes && this._hass.states[room.id].attributes.hvac_mode)
          || this._hass.states[room.id].state
        : null;
      if (hvac !== 'cool') { this._coolAnimRunning = false; return; }

      // Tìm vị trí nút và dial từ shadowRoot
      var sr = this.shadowRoot;
      if (!sr) { this._coolAnimRunning = false; return; }
      var dialWrap = sr.getElementById('dial-wrap-main');
      var coolBtn  = sr.querySelector('.mode-btn[data-hvac="cool"]');
      if (!dialWrap || !coolBtn) {
        // DOM chưa sẵn, thử lại sau 200ms
        this._coolAnimRaf = setTimeout(function() {
          if (self._coolAnimRunning) self._coolAnimRaf = requestAnimationFrame(self._coolAnimLoop.bind(self));
        }, 200);
        return;
      }

      // Toạ độ viewport thực (getBoundingClientRect không bị ảnh hưởng scale)
      var btnR  = coolBtn.getBoundingClientRect();
      var dialR = dialWrap.getBoundingClientRect();

      // Đảm bảo canvas tồn tại và đúng kích thước
      var canvas = document.getElementById('cool-trail-global-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'cool-trail-global-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
        document.body.appendChild(canvas);
      }
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      var repeatMs = Math.min(15000, Math.max(2000,
        (this._config && this._config.cool_anim_speed) || 10000));

      this._cas = cas = {
        canvas      : canvas,
        ctx         : canvas.getContext('2d'),
        // Xuất phát: mép trên nút cool, giữa chiều ngang
        sx          : btnR.left + btnR.width / 2,
        sy          : btnR.top - 10,
        // Đích: tâm dial
        ex          : dialR.left + dialR.width  / 2,
        ey          : dialR.top  + dialR.height / 2,
        phase       : 'trail',    // 'trail' | 'burst' | 'wait'
        phaseStart  : ts,
        phaseDur    : 2000,       // trail cố định 2s
        burstDur    : 1500,       // burst cố định 1.5s
        repeatMs    : repeatMs,
        waitStart   : 0,
        flakeRot    : [0,0.5,1,1.5,2],
      };
    }

    var ctx    = cas.ctx;
    var canvas = cas.canvas;
    var sx = cas.sx, sy = cas.sy, ex = cas.ex, ey = cas.ey;
    var W = canvas.width, H = canvas.height;

    // ── Clamp elapsed để tránh phase-skip khi tab ẩn/hiện hoặc RAF timestamp nhảy ──
    var elapsed = ts - cas.phaseStart;
    var maxStep = 100; // ms tối đa mỗi frame — nếu vượt quá, reset phaseStart
    if (!cas._lastTs) cas._lastTs = ts;
    var frameDelta = ts - cas._lastTs;
    cas._lastTs = ts;
    if (frameDelta > 200) {
      // Tab vừa được focus lại — reset phaseStart để tránh skip
      cas.phaseStart = ts - Math.min(elapsed, cas.phase === 'trail' ? cas.phaseDur - 50 : cas.phase === 'burst' ? cas.burstDur - 50 : 0);
      elapsed = ts - cas.phaseStart;
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    function lerp(a,b,t)   { return a+(b-a)*t; }
    function eio(t)        { return t<0.5?2*t*t:-1+(4-2*t)*t; }
    function eoc(t)        { return 1-Math.pow(1-t,3); }

    function flake(x, y, size, rot, alpha) {
      if (alpha<=0||size<1) return;
      ctx.save();
      ctx.globalAlpha = Math.min(1,alpha);
      ctx.translate(x,y); ctx.rotate(rot);
      ctx.strokeStyle='#c8e8ff';
      ctx.lineWidth=Math.max(1,size*0.15);
      ctx.lineCap='round';
      ctx.shadowColor='#3b9eff'; ctx.shadowBlur=size*1.4;
      for (var a=0;a<6;a++) {
        ctx.save(); ctx.rotate(a*Math.PI/3);
        ctx.beginPath();
        ctx.moveTo(0,0);          ctx.lineTo(0,-size);
        ctx.moveTo(0,-size*.5);   ctx.lineTo(-size*.25,-size*.72);
        ctx.moveTo(0,-size*.5);   ctx.lineTo( size*.25,-size*.72);
        ctx.moveTo(0,-size*.25);  ctx.lineTo(-size*.15,-size*.4);
        ctx.moveTo(0,-size*.25);  ctx.lineTo( size*.15,-size*.4);
        ctx.stroke(); ctx.restore();
      }
      ctx.restore();
    }

    ctx.clearRect(0, 0, W, H);

    var elapsed = ts - cas.phaseStart;

    if (cas.phase === 'trail') {
      var tp   = Math.min(elapsed / cas.phaseDur, 1);
      var head = eio(tp);

      // Trail gradient
      var tailStart = Math.max(0, head - 0.5);
      var tx1=lerp(sx,ex,tailStart), ty1=lerp(sy,ey,tailStart);
      var tx2=lerp(sx,ex,head),      ty2=lerp(sy,ey,head);
      if (Math.hypot(tx2-tx1,ty2-ty1) > 1) {
        var gr = ctx.createLinearGradient(tx1,ty1,tx2,ty2);
        gr.addColorStop(0,  'rgba(59,158,255,0)');
        gr.addColorStop(0.4,'rgba(80,170,255,0.35)');
        gr.addColorStop(1,  'rgba(200,232,255,0.9)');
        ctx.save();
        ctx.strokeStyle=gr; ctx.lineWidth=4; ctx.lineCap='round';
        ctx.shadowColor='#3b9eff'; ctx.shadowBlur=18;
        ctx.beginPath(); ctx.moveTo(tx1,ty1); ctx.lineTo(tx2,ty2); ctx.stroke();
        ctx.restore();
      }

      // Glow đầu trail
      var hx=lerp(sx,ex,head), hy=lerp(sy,ey,head);
      var hg=ctx.createRadialGradient(hx,hy,0,hx,hy,20);
      hg.addColorStop(0,'rgba(210,240,255,0.95)');
      hg.addColorStop(0.5,'rgba(59,158,255,0.5)');
      hg.addColorStop(1,'rgba(59,158,255,0)');
      ctx.save(); ctx.fillStyle=hg;
      ctx.beginPath(); ctx.arc(hx,hy,20,0,Math.PI*2); ctx.fill(); ctx.restore();

      // Bông tuyết nhỏ theo trail
      for (var fi=0;fi<5;fi++) {
        var fPos=(fi/5)*head;
        if (fPos<0.02) continue;
        var fx=lerp(sx,ex,fPos), fy=lerp(sy,ey,fPos);
        var fA=0.45+0.45*(fPos/Math.max(head,0.01));
        cas.flakeRot[fi]+=0.012;
        flake(fx,fy,5+fi*2,cas.flakeRot[fi],fA);
      }
      // Bông tuyết lớn dẫn đầu
      flake(hx, hy, 17, elapsed*0.0014, 1.0);

      // Chuyển phase
      if (elapsed >= cas.phaseDur) {
        cas.phase = 'burst';
        cas.phaseStart = ts;
      }

    } else if (cas.phase === 'burst') {
      var bp = Math.min(elapsed / cas.burstDur, 1);
      var bE = eoc(bp);

      // Flash
      var fA2 = Math.max(0, 1-bp*5);
      if (fA2 > 0) {
        var fg=ctx.createRadialGradient(ex,ey,0,ex,ey,60);
        fg.addColorStop(0,'rgba(235,248,255,'+fA2.toFixed(2)+')');
        fg.addColorStop(0.5,'rgba(59,158,255,'+(fA2*0.7).toFixed(2)+')');
        fg.addColorStop(1,'rgba(59,158,255,0)');
        ctx.save(); ctx.fillStyle=fg;
        ctx.beginPath(); ctx.arc(ex,ey,60,0,Math.PI*2); ctx.fill(); ctx.restore();
      }

      // Glow lan rộng
      var gA=Math.max(0,0.8-bp*0.9), gR=45+bE*90;
      var cg=ctx.createRadialGradient(ex,ey,0,ex,ey,gR);
      cg.addColorStop(0,'rgba(190,235,255,'+(gA*0.95).toFixed(2)+')');
      cg.addColorStop(0.35,'rgba(59,158,255,'+(gA*0.65).toFixed(2)+')');
      cg.addColorStop(1,'rgba(59,158,255,0)');
      ctx.save(); ctx.fillStyle=cg;
      ctx.beginPath(); ctx.arc(ex,ey,gR,0,Math.PI*2); ctx.fill(); ctx.restore();

      // 10 giọt nước
      for (var d=0;d<10;d++) {
        var ang=(d/10)*Math.PI*2+0.3;
        var dD=bE*70, dA=Math.max(0,1-bp*1.1);
        var dX=ex+Math.cos(ang)*dD, dY=ey+Math.sin(ang)*dD;
        var dS=(1-bE*0.55)*8;
        ctx.save(); ctx.globalAlpha=dA;
        ctx.translate(dX,dY); ctx.rotate(ang+Math.PI/2);
        ctx.beginPath();
        ctx.moveTo(0,-dS*1.6);
        ctx.bezierCurveTo(dS,0,dS,dS,0,dS*1.3);
        ctx.bezierCurveTo(-dS,dS,-dS,0,0,-dS*1.6);
        ctx.fillStyle='rgba(120,210,255,0.92)';
        ctx.shadowColor='#3b9eff'; ctx.shadowBlur=12;
        ctx.fill(); ctx.restore();
      }

      // Bông tuyết to ở tâm
      flake(ex,ey, 14+bE*18, bp*Math.PI*0.4, Math.max(0,1-bp*1.2));

      // Mảnh băng nhỏ
      for (var s=0;s<6;s++) {
        var sA2=(s/6)*Math.PI*2+Math.PI/6;
        var sD=bE*48;
        flake(ex+Math.cos(sA2)*sD, ey+Math.sin(sA2)*sD, 4+s*1.5, bp*2+s, Math.max(0,0.75-bp));
      }

      // Chuyển phase wait
      if (elapsed >= cas.burstDur) {
        ctx.clearRect(0, 0, W, H);
        cas.phase    = 'wait';
        cas.phaseStart = ts;
        cas.waitStart  = ts;
      }

    } else if (cas.phase === 'wait') {
      // Chờ repeatMs rồi reset state để chạy lại
      if (elapsed >= cas.repeatMs) {
        this._cas = null;   // reset → loop tiếp theo sẽ init lại toạ độ mới
      }
      // Canvas trống trong lúc chờ → không vẽ gì
    }

    // Tiếp tục vòng lặp
    this._coolAnimRaf = requestAnimationFrame(this._coolAnimLoop.bind(this));
  }


  // ── Fan Mode Wind Animation ───────────────────────────────────────────────
  // Luồng gió từ nút fan_only → tâm vòng tròn nhiệt → lốc xoáy to dần rồi biến mất
  // Kiến trúc giống cool trail: canvas fixed gắn body, RAF loop độc lập

  _startFanWindAnim() {
    if (this._fanAnimRunning) return;
    this._fanAnimRunning = true;
    this._fas = null;
    this._fanAnimRaf = requestAnimationFrame(this._fanAnimLoop.bind(this));
  }

  _stopFanWindAnim() {
    this._fanAnimRunning = false;
    if (this._fanAnimRaf) { cancelAnimationFrame(this._fanAnimRaf); this._fanAnimRaf = null; }
    this._fas = null;
    var c = document.getElementById('fan-wind-global-canvas');
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  _fanAnimLoop(ts) {
    if (!this._fanAnimRunning) return;

    var self = this;
    var fas  = this._fas;

    // ── Khởi tạo state ────────────────────────────────────────────────────
    if (!fas) {
      var room = ROOMS[this._activeIdx];
      var hvac = room && this._hass && this._hass.states && this._hass.states[room.id]
        ? (this._hass.states[room.id].attributes && this._hass.states[room.id].attributes.hvac_mode)
          || this._hass.states[room.id].state
        : null;
      if (hvac !== 'fan_only') { this._fanAnimRunning = false; return; }

      var sr = this.shadowRoot;
      if (!sr) { this._fanAnimRunning = false; return; }
      var dialWrap = sr.getElementById('dial-wrap-main');
      var fanBtn   = sr.querySelector('.mode-btn[data-hvac="fan_only"]');
      if (!dialWrap || !fanBtn) {
        this._fanAnimRaf = setTimeout(function() {
          if (self._fanAnimRunning) self._fanAnimRaf = requestAnimationFrame(self._fanAnimLoop.bind(self));
        }, 200);
        return;
      }

      var btnR  = fanBtn.getBoundingClientRect();
      var dialR = dialWrap.getBoundingClientRect();

      var canvas = document.getElementById('fan-wind-global-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'fan-wind-global-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99998;';
        document.body.appendChild(canvas);
      }
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      var repeatMs = Math.min(15000, Math.max(2000,
        (this._config && this._config.cool_anim_speed) || 10000));

      // Sinh các luồng gió — mỗi luồng lệch offset nhỏ để trông tự nhiên
      var streams = [];
      for (var i = 0; i < 5; i++) {
        streams.push({
          offset  : (i - 2) * 6,   // lệch ngang so với trục chính (px)
          delay   : i * 120,        // delay khởi động (ms)
          width   : 2 + i * 0.6,
          alpha   : 0.55 + i * 0.06,
        });
      }

      this._fas = fas = {
        canvas    : canvas,
        ctx       : canvas.getContext('2d'),
        sx        : btnR.left + btnR.width  / 2,
        sy        : btnR.top  + btnR.height / 2,
        ex        : dialR.left + dialR.width  / 2,
        ey        : dialR.top  + dialR.height / 2,
        phase     : 'trail',   // 'trail' | 'vortex' | 'wait'
        phaseStart: ts,
        trailDur  : 1800,
        vortexDur : 2200,
        repeatMs  : repeatMs,
        streams   : streams,
        _lastTs   : ts,
        // particles dùng cho phase vortex
        vortexSeeds: Array.from({length: 28}, function(_, k) {
          return { angle: (k / 28) * Math.PI * 2, r: 10 + (k % 7) * 8, speed: 0.025 + (k % 5) * 0.008, size: 2 + (k % 4) * 1.2 };
        }),
      };
      fas = this._fas;
    }

    // ── frame-delta guard (tab hidden fix) ───────────────────────────────
    var frameDelta = ts - fas._lastTs;
    fas._lastTs = ts;
    if (frameDelta > 200) {
      fas.phaseStart = ts - Math.min(ts - fas.phaseStart,
        fas.phase === 'trail' ? fas.trailDur - 50 : fas.phase === 'vortex' ? fas.vortexDur - 50 : 0);
    }

    var ctx    = fas.ctx;
    var canvas = fas.canvas;
    var W = canvas.width, H = canvas.height;
    var sx = fas.sx, sy = fas.sy, ex = fas.ex, ey = fas.ey;
    var elapsed = ts - fas.phaseStart;

    // Helpers
    function lerp(a, b, t) { return a + (b - a) * t; }
    function eio(t)        { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
    function eoc(t)        { return 1 - Math.pow(1 - t, 3); }
    function clamp(v,mn,mx){ return Math.min(mx, Math.max(mn, v)); }

    // Vector từ src → dst, pháp tuyến để offset luồng gió
    var dx = ex - sx, dy = ey - sy;
    var dist = Math.hypot(dx, dy) || 1;
    var nx = -dy / dist, ny = dx / dist; // normal vector

    ctx.clearRect(0, 0, W, H);

    // ── Phase: TRAIL — luồng gió thổi từ nút đến tâm dial ────────────────
    if (fas.phase === 'trail') {
      var tp = clamp(elapsed / fas.trailDur, 0, 1);
      var head = eio(tp);

      fas.streams.forEach(function(st, si) {
        var stDelay = st.delay;
        var stElapsed = Math.max(0, elapsed - stDelay);
        var stTp  = clamp(stElapsed / (fas.trailDur - stDelay), 0, 1);
        var stHead = eio(stTp);
        if (stTp <= 0) return;

        var tail = Math.max(0, stHead - 0.45);

        // Điểm offset theo pháp tuyến
        var ox = nx * st.offset, oy = ny * st.offset;
        var x1 = lerp(sx, ex, tail)  + ox;
        var y1 = lerp(sy, ey, tail)  + oy;
        var x2 = lerp(sx, ex, stHead)+ ox;
        var y2 = lerp(sy, ey, stHead)+ oy;

        if (Math.hypot(x2 - x1, y2 - y1) < 1) return;

        // Gradient dọc theo luồng
        var gr = ctx.createLinearGradient(x1, y1, x2, y2);
        gr.addColorStop(0,   'rgba(52,211,153,0)');
        gr.addColorStop(0.35,'rgba(52,211,153,' + (st.alpha * 0.4).toFixed(2) + ')');
        gr.addColorStop(0.75,'rgba(110,231,183,' + (st.alpha * 0.75).toFixed(2) + ')');
        gr.addColorStop(1,   'rgba(200,255,235,' + st.alpha.toFixed(2) + ')');

        ctx.save();
        ctx.strokeStyle = gr;
        ctx.lineWidth   = st.width;
        ctx.lineCap     = 'round';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur  = 8 + si * 2;

        // Vẽ đường cong nhẹ (quadratic bezier lệch ngang)
        var cpx = lerp(sx, ex, 0.5) + ox + nx * 12;
        var cpy = lerp(sy, ey, 0.5) + oy + ny * 12;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.stroke();
        ctx.restore();
      });

      // Glow đầu luồng chính
      var hx = lerp(sx, ex, head), hy = lerp(sy, ey, head);
      var hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 18);
      hg.addColorStop(0,   'rgba(200,255,235,0.9)');
      hg.addColorStop(0.5, 'rgba(52,211,153,0.45)');
      hg.addColorStop(1,   'rgba(52,211,153,0)');
      ctx.save();
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hx, hy, 18, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Chuyển sang vortex
      if (elapsed >= fas.trailDur) {
        fas.phase = 'vortex';
        fas.phaseStart = ts;
        // khởi tạo góc xoay cho từng hạt
        fas.vortexSeeds.forEach(function(p) { p.curAngle = p.angle; });
      }

    // ── Phase: VORTEX — lốc xoáy to dần rồi mờ dần ─────────────────────
    } else if (fas.phase === 'vortex') {
      var vp  = clamp(elapsed / fas.vortexDur, 0, 1);
      var vE  = eoc(vp);

      // Scale lốc: to dần đến ~1.8× rồi fade
      var maxR   = dialWrap ? (fas.ex ? 55 : 55) : 55;
      var scale  = 0.15 + vE * 1.85;
      var fadeA  = vp < 0.55 ? 1 : clamp(1 - (vp - 0.55) / 0.45, 0, 1);

      // Vẽ các vòng xoắn (3 lớp)
      for (var ring = 0; ring < 3; ring++) {
        var rOffset = ring * (Math.PI * 2 / 3);
        var rScale  = scale * (0.55 + ring * 0.28);
        var rAlpha  = fadeA * (0.55 - ring * 0.12);
        var rR      = (28 + ring * 18) * rScale;
        var rWidth  = (2.5 - ring * 0.5);

        ctx.save();
        ctx.globalAlpha = clamp(rAlpha, 0, 1);
        ctx.strokeStyle = ring === 0 ? '#6ee7b7' : ring === 1 ? '#34d399' : '#a7f3d0';
        ctx.lineWidth   = rWidth;
        ctx.lineCap     = 'round';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur  = 12 + ring * 6;

        // Xoắn ốc: arc nhiều đoạn với bán kính tăng dần
        ctx.beginPath();
        var steps = 80;
        var startAngle = rOffset + elapsed * (0.0018 + ring * 0.0005);
        for (var st2 = 0; st2 <= steps; st2++) {
          var pct = st2 / steps;
          var ang = startAngle + pct * Math.PI * (3.5 - ring * 0.5);
          var pr  = rR * (0.15 + pct * 0.85);
          var px  = ex + Math.cos(ang) * pr;
          var py  = ey + Math.sin(ang) * pr;
          if (st2 === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Hạt nước lơ lửng bay theo vòng xoáy
      fas.vortexSeeds.forEach(function(p, pi) {
        p.curAngle += p.speed * (1 + vE * 1.2);
        var pr  = p.r * scale * (0.9 + 0.1 * Math.sin(ts * 0.002 + pi));
        var px  = ex + Math.cos(p.curAngle) * pr;
        var py  = ey + Math.sin(p.curAngle) * pr;
        var pA  = fadeA * 0.7;
        if (pA <= 0) return;
        ctx.save();
        ctx.globalAlpha = pA;
        ctx.fillStyle   = '#a7f3d0';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(px, py, p.size * clamp(scale * 0.6, 0.3, 1.2), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Glow tâm
      var cA = fadeA * 0.7;
      if (cA > 0) {
        var cR = 22 * scale;
        var cg2 = ctx.createRadialGradient(ex, ey, 0, ex, ey, cR);
        cg2.addColorStop(0,   'rgba(167,243,208,' + (cA * 0.85).toFixed(2) + ')');
        cg2.addColorStop(0.5, 'rgba(52,211,153,'  + (cA * 0.4).toFixed(2)  + ')');
        cg2.addColorStop(1,   'rgba(52,211,153,0)');
        ctx.save();
        ctx.fillStyle = cg2;
        ctx.beginPath(); ctx.arc(ex, ey, cR, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Chuyển wait
      if (elapsed >= fas.vortexDur) {
        ctx.clearRect(0, 0, W, H);
        fas.phase     = 'wait';
        fas.phaseStart = ts;
      }

    // ── Phase: WAIT ───────────────────────────────────────────────────────
    } else if (fas.phase === 'wait') {
      if (elapsed >= fas.repeatMs) {
        this._fas = null; // reset → init lại tọa độ mới
      }
    }

    this._fanAnimRaf = requestAnimationFrame(this._fanAnimLoop.bind(this));
  }

  _updateFanAnim() {
    var room = ROOMS[this._activeIdx];
    var hvac = room && this._hass && this._hass.states[room.id]
      ? (this._hass.states[room.id].attributes.hvac_mode || this._hass.states[room.id].state)
      : null;
    if (hvac === 'fan_only') {
      if (!this._fanAnimRunning) this._startFanWindAnim();
    } else {
      this._stopFanWindAnim();
    }
  }

  // ── Heat Mode Flame Trail Animation ─────────────────────────────────────
  // Tia nhiệt rung động từ nút heat → tâm dial → bùng phát hào quang rồi tắt

  _startHeatFlameAnim() {
    if (this._heatAnimRunning) return;
    this._heatAnimRunning = true;
    this._has = null;
    this._heatAnimRaf = requestAnimationFrame(this._heatAnimLoop.bind(this));
  }

  _stopHeatFlameAnim() {
    this._heatAnimRunning = false;
    if (this._heatAnimRaf) { cancelAnimationFrame(this._heatAnimRaf); this._heatAnimRaf = null; }
    this._has = null;
    var c = document.getElementById('heat-flame-global-canvas');
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  _heatAnimLoop(ts) {
    if (!this._heatAnimRunning) return;
    var self = this;
    var has  = this._has;

    if (!has) {
      var room = ROOMS[this._activeIdx];
      var hvac = room && this._hass && this._hass.states && this._hass.states[room.id]
        ? (this._hass.states[room.id].attributes && this._hass.states[room.id].attributes.hvac_mode)
          || this._hass.states[room.id].state
        : null;
      if (hvac !== 'heat') { this._heatAnimRunning = false; return; }

      var sr = this.shadowRoot;
      if (!sr) { this._heatAnimRunning = false; return; }
      var dialWrap = sr.getElementById('dial-wrap-main');
      var heatBtn  = sr.querySelector('.mode-btn[data-hvac="heat"]');
      if (!dialWrap || !heatBtn) {
        this._heatAnimRaf = setTimeout(function() {
          if (self._heatAnimRunning) self._heatAnimRaf = requestAnimationFrame(self._heatAnimLoop.bind(self));
        }, 200);
        return;
      }

      var btnR  = heatBtn.getBoundingClientRect();
      var dialR = dialWrap.getBoundingClientRect();

      var canvas = document.getElementById('heat-flame-global-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'heat-flame-global-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99998;';
        document.body.appendChild(canvas);
      }
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      var repeatMs = Math.min(15000, Math.max(2000,
        (this._config && this._config.cool_anim_speed) || 10000));

      // Tia nhiệt: 4 tia lệch nhau, rung ngẫu nhiên theo thời gian
      var rays = [];
      for (var i = 0; i < 4; i++) {
        rays.push({ phase: i * Math.PI * 0.5, amp: 4 + i * 2, freq: 0.006 + i * 0.002 });
      }

      this._has = has = {
        canvas    : canvas,
        ctx       : canvas.getContext('2d'),
        sx        : btnR.left + btnR.width  / 2,
        sy        : btnR.top  + btnR.height / 2,
        ex        : dialR.left + dialR.width  / 2,
        ey        : dialR.top  + dialR.height / 2,
        phase     : 'trail',
        phaseStart: ts,
        trailDur  : 1600,
        burstDur  : 1800,
        repeatMs  : repeatMs,
        rays      : rays,
        // ember particles cho burst
        embers    : Array.from({length: 20}, function(_, k) {
          return {
            angle : (k / 20) * Math.PI * 2 + Math.random() * 0.3,
            speed : 0.6 + Math.random() * 0.8,
            r0    : 8 + Math.random() * 12,
            size  : 2 + Math.random() * 3,
            drift : (Math.random() - 0.5) * 0.04,
          };
        }),
        _lastTs   : ts,
      };
      has = this._has;
    }

    // frame-delta guard
    var frameDelta = ts - has._lastTs;
    has._lastTs = ts;
    if (frameDelta > 200) {
      has.phaseStart = ts - Math.min(ts - has.phaseStart,
        has.phase === 'trail' ? has.trailDur - 50 : has.phase === 'burst' ? has.burstDur - 50 : 0);
    }

    var ctx    = has.ctx;
    var canvas = has.canvas;
    var W = canvas.width, H = canvas.height;
    var sx = has.sx, sy = has.sy, ex = has.ex, ey = has.ey;
    var elapsed = ts - has.phaseStart;

    function lerp(a,b,t)  { return a+(b-a)*t; }
    function eio(t)       { return t<0.5?2*t*t:-1+(4-2*t)*t; }
    function eoc(t)       { return 1-Math.pow(1-t,3); }
    function clamp(v,a,b) { return Math.min(b,Math.max(a,v)); }

    // Vector pháp tuyến để lắc tia
    var dx = ex-sx, dy = ey-sy, dist = Math.hypot(dx,dy)||1;
    var nx = -dy/dist, ny = dx/dist;

    ctx.clearRect(0, 0, W, H);

    // ── Phase TRAIL: tia nhiệt rung động chạy từ nút → dial ──────────────
    if (has.phase === 'trail') {
      var tp   = clamp(elapsed / has.trailDur, 0, 1);
      var head = eio(tp);

      has.rays.forEach(function(ray, ri) {
        var rHead = clamp(head - ri * 0.06, 0, 1);
        if (rHead <= 0) return;
        var rTail = Math.max(0, rHead - 0.4);

        // Vẽ tia dưới dạng polyline rung (zigzag nhiệt)
        var steps = 30;
        ctx.save();
        ctx.beginPath();
        for (var s = 0; s <= steps; s++) {
          var pct = rTail + (rHead - rTail) * (s / steps);
          var px  = lerp(sx, ex, pct);
          var py  = lerp(sy, ey, pct);
          // Lắc theo sóng sin nhiều tần số
          var shake = ray.amp * Math.sin(ts * ray.freq + s * 0.7 + ray.phase)
                    + ray.amp * 0.4 * Math.sin(ts * ray.freq * 1.7 + s * 1.3);
          px += nx * shake * (1 - Math.abs(pct - 0.5) * 2); // mạnh nhất ở giữa
          py += ny * shake * (1 - Math.abs(pct - 0.5) * 2);
          if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        // Màu gradient: đỏ cam → vàng ở đầu
        var pStart = { x: lerp(sx,ex,rTail), y: lerp(sy,ey,rTail) };
        var pEnd   = { x: lerp(sx,ex,rHead), y: lerp(sy,ey,rHead) };
        var gr = ctx.createLinearGradient(pStart.x, pStart.y, pEnd.x, pEnd.y);
        gr.addColorStop(0,   'rgba(255,80,0,0)');
        gr.addColorStop(0.3, 'rgba(255,120,20,' + (0.35 + ri * 0.08).toFixed(2) + ')');
        gr.addColorStop(0.75,'rgba(255,180,30,' + (0.6  + ri * 0.06).toFixed(2) + ')');
        gr.addColorStop(1,   'rgba(255,220,80,' + (0.85 + ri * 0.03).toFixed(2) + ')');
        ctx.strokeStyle = gr;
        ctx.lineWidth   = 2.5 - ri * 0.4;
        ctx.lineCap     = 'round';
        ctx.shadowColor = '#ff7b3b';
        ctx.shadowBlur  = 10 + ri * 3;
        ctx.stroke();
        ctx.restore();
      });

      // Glow đầu tia chính
      var hx = lerp(sx, ex, head), hy = lerp(sy, ey, head);
      var hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 20);
      hg.addColorStop(0,   'rgba(255,220,80,0.95)');
      hg.addColorStop(0.45,'rgba(255,120,30,0.5)');
      hg.addColorStop(1,   'rgba(255,60,0,0)');
      ctx.save(); ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hx, hy, 20, 0, Math.PI*2); ctx.fill(); ctx.restore();

      if (elapsed >= has.trailDur) {
        has.phase = 'burst'; has.phaseStart = ts;
        // khởi góc ban đầu cho ember
        has.embers.forEach(function(e) { e.curR = e.r0; });
      }

    // ── Phase BURST: hào quang nở rộng + than hồng bay ra ────────────────
    } else if (has.phase === 'burst') {
      var bp  = clamp(elapsed / has.burstDur, 0, 1);
      var bE  = eoc(bp);

      // Flash tức thì ở tâm
      var fA = Math.max(0, 1 - bp * 4);
      if (fA > 0) {
        var fg = ctx.createRadialGradient(ex,ey,0,ex,ey,55);
        fg.addColorStop(0,  'rgba(255,240,180,'+fA.toFixed(2)+')');
        fg.addColorStop(0.4,'rgba(255,140,30,'+(fA*0.7).toFixed(2)+')');
        fg.addColorStop(1,  'rgba(255,60,0,0)');
        ctx.save(); ctx.fillStyle=fg;
        ctx.beginPath(); ctx.arc(ex,ey,55,0,Math.PI*2); ctx.fill(); ctx.restore();
      }

      // Hào quang lan rộng — 3 lớp màu
      var haloColors = [
        ['rgba(255,220,60,', 'rgba(255,130,20,', 50, 0.75],
        ['rgba(255,160,30,', 'rgba(255,80,10,',  80, 0.50],
        ['rgba(255,100,10,', 'rgba(200,40,0,',  110, 0.30],
      ];
      haloColors.forEach(function(h, hi) {
        var hR = h[2] * bE;
        var hA = Math.max(0, h[3] - bp * h[3]);
        if (hR < 1 || hA <= 0) return;
        var hg2 = ctx.createRadialGradient(ex,ey,0,ex,ey,hR);
        hg2.addColorStop(0,   h[0]+(hA*0.9).toFixed(2)+')');
        hg2.addColorStop(0.5, h[1]+(hA*0.55).toFixed(2)+')');
        hg2.addColorStop(1,   'rgba(255,40,0,0)');
        ctx.save(); ctx.fillStyle=hg2;
        ctx.beginPath(); ctx.arc(ex,ey,hR,0,Math.PI*2); ctx.fill(); ctx.restore();
      });

      // Than hồng bay ra rồi rơi nhẹ
      has.embers.forEach(function(em) {
        em.curR = em.r0 + bE * 55 * em.speed;
        em.angle += em.drift;
        var emX = ex + Math.cos(em.angle) * em.curR;
        var emY = ey + Math.sin(em.angle) * em.curR + bE * 15; // rơi nhẹ
        var emA = Math.max(0, 0.85 - bp * 0.95);
        if (emA <= 0) return;
        ctx.save();
        ctx.globalAlpha = emA;
        // Hình giọt lửa nhỏ
        ctx.fillStyle = bp < 0.4 ? '#ffdc50' : '#ff8c20';
        ctx.shadowColor = '#ff6010'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(emX, emY, em.size * (1 - bp * 0.5), 0, Math.PI*2);
        ctx.fill(); ctx.restore();
      });

      // Vòng sóng nhiệt (heat shimmer ring)
      for (var ring = 0; ring < 2; ring++) {
        var rR2 = (35 + ring * 28) * bE;
        var rA2 = Math.max(0, (0.5 - ring * 0.12) * (1 - bp * 1.1));
        if (rR2 < 1 || rA2 <= 0) continue;
        ctx.save();
        ctx.globalAlpha = rA2;
        ctx.strokeStyle = ring === 0 ? '#ffb030' : '#ff7020';
        ctx.lineWidth   = 2 - ring * 0.5;
        ctx.shadowColor = '#ff7b3b'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(ex, ey, rR2, 0, Math.PI*2); ctx.stroke();
        ctx.restore();
      }

      if (elapsed >= has.burstDur) {
        ctx.clearRect(0, 0, W, H);
        has.phase = 'wait'; has.phaseStart = ts;
      }

    } else if (has.phase === 'wait') {
      if (elapsed >= has.repeatMs) this._has = null;
    }

    this._heatAnimRaf = requestAnimationFrame(this._heatAnimLoop.bind(this));
  }

  _updateHeatAnim() {
    var room = ROOMS[this._activeIdx];
    var hvac = room && this._hass && this._hass.states[room.id]
      ? (this._hass.states[room.id].attributes.hvac_mode || this._hass.states[room.id].state)
      : null;
    if (hvac === 'heat') {
      if (!this._heatAnimRunning) this._startHeatFlameAnim();
    } else {
      this._stopHeatFlameAnim();
    }
  }

  // ── Dry Mode Moisture Absorption Animation ───────────────────────────────
  // Giọt sương bay từ nút dry → dial, tan ra thành vầng sương rồi bị hút vào

  _startDryMistAnim() {
    if (this._dryAnimRunning) return;
    this._dryAnimRunning = true;
    this._das = null;
    this._dryAnimRaf = requestAnimationFrame(this._dryAnimLoop.bind(this));
  }

  _stopDryMistAnim() {
    this._dryAnimRunning = false;
    if (this._dryAnimRaf) { cancelAnimationFrame(this._dryAnimRaf); this._dryAnimRaf = null; }
    this._das = null;
    var c = document.getElementById('dry-mist-global-canvas');
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  _dryAnimLoop(ts) {
    if (!this._dryAnimRunning) return;
    var self = this;
    var das  = this._das;

    if (!das) {
      var room = ROOMS[this._activeIdx];
      var hvac = room && this._hass && this._hass.states && this._hass.states[room.id]
        ? (this._hass.states[room.id].attributes && this._hass.states[room.id].attributes.hvac_mode)
          || this._hass.states[room.id].state
        : null;
      if (hvac !== 'dry') { this._dryAnimRunning = false; return; }

      var sr = this.shadowRoot;
      if (!sr) { this._dryAnimRunning = false; return; }
      var dialWrap = sr.getElementById('dial-wrap-main');
      var dryBtn   = sr.querySelector('.mode-btn[data-hvac="dry"]');
      if (!dialWrap || !dryBtn) {
        this._dryAnimRaf = setTimeout(function() {
          if (self._dryAnimRunning) self._dryAnimRaf = requestAnimationFrame(self._dryAnimLoop.bind(self));
        }, 200);
        return;
      }

      var btnR  = dryBtn.getBoundingClientRect();
      var dialR = dialWrap.getBoundingClientRect();

      var canvas = document.getElementById('dry-mist-global-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'dry-mist-global-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99998;';
        document.body.appendChild(canvas);
      }
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      var repeatMs = Math.min(15000, Math.max(2000,
        (this._config && this._config.cool_anim_speed) || 10000));

      // 18 giọt sương — mỗi giọt có quỹ đạo uốn lượn khác nhau
      var drops = Array.from({length: 18}, function(_, k) {
        return {
          t      : k / 18,                         // vị trí ban đầu trên đường đi (0-1)
          delay  : k * 85,                          // ms delay
          offAmp : (Math.random() - 0.5) * 18,      // biên độ dao động ngang
          offFreq: 0.004 + Math.random() * 0.003,   // tần số dao động
          size   : 2.5 + Math.random() * 3,
          alpha  : 0.5 + Math.random() * 0.4,
          phase  : Math.random() * Math.PI * 2,
        };
      });

      // Đám sương (mist cloud) cho phase absorb: các blob tròn bán trong suốt
      var mistBlobs = Array.from({length: 14}, function(_, k) {
        return {
          angle : (k / 14) * Math.PI * 2,
          r0    : 15 + (k % 5) * 8,
          speed : 0.008 + (k % 4) * 0.003,
          size  : 8 + (k % 5) * 5,
          alpha : 0.18 + (k % 4) * 0.04,
          curAng: (k / 14) * Math.PI * 2,
        };
      });

      this._das = das = {
        canvas    : canvas,
        ctx       : canvas.getContext('2d'),
        sx        : btnR.left + btnR.width  / 2,
        sy        : btnR.top  + btnR.height / 2,
        ex        : dialR.left + dialR.width  / 2,
        ey        : dialR.top  + dialR.height / 2,
        phase     : 'trail',
        phaseStart: ts,
        trailDur  : 2000,
        absorbDur : 2000,
        repeatMs  : repeatMs,
        drops     : drops,
        mistBlobs : mistBlobs,
        _lastTs   : ts,
      };
      das = this._das;
    }

    // frame-delta guard
    var frameDelta = ts - das._lastTs;
    das._lastTs = ts;
    if (frameDelta > 200) {
      das.phaseStart = ts - Math.min(ts - das.phaseStart,
        das.phase === 'trail' ? das.trailDur - 50 : das.phase === 'absorb' ? das.absorbDur - 50 : 0);
    }

    var ctx    = das.ctx;
    var canvas = das.canvas;
    var W = canvas.width, H = canvas.height;
    var sx = das.sx, sy = das.sy, ex = das.ex, ey = das.ey;
    var elapsed = ts - das.phaseStart;

    function lerp(a,b,t)  { return a+(b-a)*t; }
    function eio(t)       { return t<0.5?2*t*t:-1+(4-2*t)*t; }
    function eoc(t)       { return 1-Math.pow(1-t,3); }
    function clamp(v,a,b) { return Math.min(b,Math.max(a,v)); }

    var dx = ex-sx, dy = ey-sy, dist = Math.hypot(dx,dy)||1;
    var nx = -dy/dist, ny = dx/dist;

    ctx.clearRect(0, 0, W, H);

    // ── Phase TRAIL: giọt sương uốn lượn bay đến dial ─────────────────────
    if (das.phase === 'trail') {
      var tp = clamp(elapsed / das.trailDur, 0, 1);

      das.drops.forEach(function(drop) {
        var dElapsed = Math.max(0, elapsed - drop.delay);
        var dTp = clamp(dElapsed / (das.trailDur * 0.75), 0, 1);
        if (dTp <= 0) return;

        var pos = eio(dTp);
        // Giọt uốn lượn theo pháp tuyến
        var wave = drop.offAmp * Math.sin(ts * drop.offFreq + drop.phase + pos * Math.PI * 2.5);
        var px = lerp(sx, ex, pos) + nx * wave;
        var py = lerp(sy, ey, pos) + ny * wave;

        // Alpha: fade in ở đầu, mờ dần ở đích
        var dA = drop.alpha * Math.min(1, dTp * 3) * (1 - Math.max(0, (pos - 0.7) / 0.3) * 0.6);

        // Vẽ giọt nước (hình giọt lệch nhỏ)
        ctx.save();
        ctx.globalAlpha = clamp(dA, 0, 1);
        var r = drop.size * (0.7 + 0.3 * Math.sin(ts * 0.006 + drop.phase));
        // Glow hào quang tím
        ctx.shadowColor = '#c4b5fd'; ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(196,181,253,0.85)';
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2); ctx.fill();
        // Vệt sáng nhỏ bên trong
        ctx.globalAlpha = clamp(dA * 0.5, 0, 1);
        ctx.fillStyle = '#ede9fe';
        ctx.beginPath(); ctx.arc(px - r*0.25, py - r*0.25, r*0.35, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });

      // Vệt sương mờ dọc theo đường đi
      var trailHead = eio(clamp(elapsed / das.trailDur, 0, 1));
      if (trailHead > 0.05) {
        var gr = ctx.createLinearGradient(sx, sy, lerp(sx,ex,trailHead), lerp(sy,ey,trailHead));
        gr.addColorStop(0,   'rgba(167,139,250,0)');
        gr.addColorStop(0.4, 'rgba(167,139,250,0.08)');
        gr.addColorStop(1,   'rgba(196,181,253,0.18)');
        ctx.save();
        ctx.strokeStyle = gr; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.filter = 'blur(4px)';
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(lerp(sx,ex,trailHead), lerp(sy,ey,trailHead));
        ctx.stroke(); ctx.restore();
      }

      if (elapsed >= das.trailDur) {
        das.phase = 'absorb'; das.phaseStart = ts;
      }

    // ── Phase ABSORB: đám sương xoay quanh dial rồi bị hút vào ──────────
    } else if (das.phase === 'absorb') {
      var ap  = clamp(elapsed / das.absorbDur, 0, 1);
      var aE  = eoc(ap);

      // Scale đám sương: nở to rồi co vào (hút ẩm)
      // 0→0.4: nở ra  |  0.4→1: co lại bị hút vào
      var expandP = clamp(ap / 0.4, 0, 1);
      var shrinkP = clamp((ap - 0.4) / 0.6, 0, 1);
      var mistScale = ap < 0.4
        ? eoc(expandP) * 1.3
        : lerp(1.3, 0.1, eio(shrinkP));
      var mistAlpha = ap < 0.4
        ? eoc(expandP)
        : Math.max(0, 1 - eio(shrinkP) * 1.15);

      // Blob sương quay và co lại
      das.mistBlobs.forEach(function(blob) {
        blob.curAng += blob.speed * (1 + shrinkP * 2.5); // tăng tốc khi bị hút
        var bR = blob.r0 * mistScale;
        var bX = ex + Math.cos(blob.curAng) * bR;
        var bY = ey + Math.sin(blob.curAng) * bR;
        var bA = blob.alpha * mistAlpha;
        if (bA <= 0 || bR < 0.5) return;

        var bSize = blob.size * clamp(mistScale, 0.1, 1.5);
        ctx.save();
        ctx.globalAlpha = clamp(bA, 0, 1);
        var bg = ctx.createRadialGradient(bX,bY,0,bX,bY,bSize);
        bg.addColorStop(0,   'rgba(233,213,255,0.9)');
        bg.addColorStop(0.5, 'rgba(167,139,250,0.55)');
        bg.addColorStop(1,   'rgba(139,92,246,0)');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(bX, bY, bSize, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });

      // Glow tâm: sáng lên khi hút xong
      var cA = shrinkP * 0.8;
      if (cA > 0.02) {
        var cScale = 0.3 + (1 - shrinkP) * 0.9;
        var cg = ctx.createRadialGradient(ex,ey,0,ex,ey,40*cScale);
        cg.addColorStop(0,   'rgba(233,213,255,'+(cA*0.9).toFixed(2)+')');
        cg.addColorStop(0.45,'rgba(167,139,250,'+(cA*0.55).toFixed(2)+')');
        cg.addColorStop(1,   'rgba(139,92,246,0)');
        ctx.save(); ctx.fillStyle=cg;
        ctx.beginPath(); ctx.arc(ex,ey,40*cScale,0,Math.PI*2); ctx.fill(); ctx.restore();
      }

      // Các giọt nhỏ lao vào tâm khi shrink
      if (shrinkP > 0.1) {
        for (var di = 0; di < 8; di++) {
          var dAng = (di / 8) * Math.PI * 2 + shrinkP * Math.PI * 3 + elapsed * 0.003;
          var dDist = (1 - shrinkP) * 45;
          var dX = ex + Math.cos(dAng) * dDist;
          var dY = ey + Math.sin(dAng) * dDist;
          var dA2 = Math.max(0, 0.7 - shrinkP * 0.8);
          if (dA2 <= 0) continue;
          ctx.save();
          ctx.globalAlpha = dA2;
          ctx.fillStyle = '#c4b5fd';
          ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(dX, dY, 2.5, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }

      if (elapsed >= das.absorbDur) {
        ctx.clearRect(0, 0, W, H);
        das.phase = 'wait'; das.phaseStart = ts;
      }

    } else if (das.phase === 'wait') {
      if (elapsed >= das.repeatMs) this._das = null;
    }

    this._dryAnimRaf = requestAnimationFrame(this._dryAnimLoop.bind(this));
  }

  _updateDryAnim() {
    var room = ROOMS[this._activeIdx];
    var hvac = room && this._hass && this._hass.states[room.id]
      ? (this._hass.states[room.id].attributes.hvac_mode || this._hass.states[room.id].state)
      : null;
    if (hvac === 'dry') {
      if (!this._dryAnimRunning) this._startDryMistAnim();
    } else {
      this._stopDryMistAnim();
    }
  }

  _calcEta(roomIdx, setTemp, curTemp, fanMode) {
    if (curTemp <= setTemp) return null;
    var remaining = curTemp - setTemp;

    // ── Ước tính ban đầu dựa trên fan speed (dùng ngay khi chưa có data) ──
    // Tốc độ tiêu chuẩn: máy lạnh thông thường ~0.3–1.0°C/phút tùy fan
    var fanRateMap = {
      'auto': 0.55, 'min': 0.25, 'low': 0.35,
      'low_mid': 0.45, 'medium': 0.55,
      'high_mid': 0.70, 'high': 0.85, 'max': 1.0,
      'low/auto': 0.40, 'high/auto': 0.80, 'quiet': 0.20
    };
    var fm = (fanMode || 'auto').toLowerCase().replace(/[\s-]/g, '_');
    var estimatedRate = fanRateMap[fm] || fanRateMap['auto'];
    var etaEstimated = Math.round(remaining / estimatedRate);

    // ── Tính tốc độ thực tế từ lịch sử ──────────────────────────────────
    var hist = this._tempHistory[roomIdx];
    if (hist && hist.length >= 2) {
      var now = Date.now();
      // Lấy window 8 phút gần nhất
      var cutoff = now - 8 * 60 * 1000;
      var pts = hist.filter(function(p) { return p.t >= cutoff; });
      if (pts.length < 2) pts = hist.slice(-Math.min(hist.length, 6));

      if (pts.length >= 2) {
        var first = pts[0], lastPt = pts[pts.length - 1];
        var dtMin = (lastPt.t - first.t) / 60000;
        if (dtMin >= 0.4) {
          var dTemp = first.temp - lastPt.temp; // dương nếu đang giảm
          if (dTemp > 0) {
            var measuredRate = dTemp / dtMin;
            if (measuredRate >= 0.01) {
              // Blend: bắt đầu từ 50% estimated → 100% measured sau 5 phút data
              var blendFactor = Math.min(1, dtMin / 5);
              var blendedRate = estimatedRate * (1 - blendFactor) + measuredRate * blendFactor;
              var etaMeasured = Math.round(remaining / blendedRate);
              if (etaMeasured > 0 && etaMeasured <= 999) {
                return { eta: etaMeasured, rate: blendedRate, mode: blendFactor >= 0.95 ? 'measured' : 'blending' };
              }
            }
          }
        }
      }
    }

    // Fallback: ước tính ban đầu
    if (etaEstimated > 0 && etaEstimated <= 999) {
      return { eta: etaEstimated, rate: estimatedRate, mode: 'estimated' };
    }
    return null;
  }

  setConfig(c) {
    this._config = Object.assign({}, AC_DEFAULT_CONFIG, c);
    var lang = this._config.language || 'vi';
    var tr   = AC_TRANSLATIONS[lang] || AC_TRANSLATIONS.vi;
    var roomCount = Math.max(1, Math.min(8, parseInt(this._config.room_count) || 4));
    this._config.room_count = roomCount;

    // Reset ROOMS theo room_count, copy từ ROOMS_DEFAULT
    ROOMS.length = 0;
    for (var r = 0; r < roomCount; r++) {
      ROOMS.push(Object.assign({}, ROOMS_DEFAULT[r] || {
        id: 'climate.room_' + (r + 1),
        label: 'Ph\xf2ng ' + (r + 1),
        area: '15 m\xb2',
        icon: 'mdi:snowflake',
      }));
    }

    // Ghi đè ROOMS từ config entities
    if (c && c.entities && Array.isArray(c.entities)) {
      for (var i = 0; i < Math.min(c.entities.length, ROOMS.length); i++) {
        if (c.entities[i] && c.entities[i].entity_id) ROOMS[i].id    = c.entities[i].entity_id;
        if (c.entities[i] && c.entities[i].label)     ROOMS[i].label = c.entities[i].label;
        if (c.entities[i] && c.entities[i].area)      ROOMS[i].area  = c.entities[i].area;
        if (c.entities[i] && c.entities[i].icon)      ROOMS[i].icon  = c.entities[i].icon;
        if (c.entities[i] && c.entities[i].image)     ROOMS[i].image = c.entities[i].image;
      }
    }
    // Áp dụng ngôn ngữ vào ROOMS nếu label chưa tuỳ chỉnh
    for (var j = 0; j < ROOMS.length; j++) {
      if (!c.entities || !c.entities[j] || !c.entities[j].label) {
        ROOMS[j].label = (tr.rooms && tr.rooms[j]) || ROOMS[j].label;
        ROOMS[j].icon  = (tr.roomIcons && tr.roomIcons[j]) || ROOMS[j].icon;
      }
    }
    // Đảm bảo activeIdx không vượt quá số phòng
    if (this._activeIdx >= ROOMS.length) this._activeIdx = 0;

    // Khi cool_anim_speed thay đổi → restart animation ngay lập tức
    var newSpeed = c && c.cool_anim_speed;
    if (newSpeed && newSpeed !== this._prevCoolAnimSpeed) {
      this._prevCoolAnimSpeed = newSpeed;
      if (this._cas) {
        if (this._cas.phase === 'wait') {
          // Đang chờ → reset ngay để chạy chu kỳ mới
          this._cas = null;
        } else {
          // Đang trail/burst → cập nhật repeatMs để chu kỳ tiếp dùng giá trị mới
          this._cas.repeatMs = Math.min(15000, Math.max(2000, newSpeed));
        }
      }
    }
  }

  static getConfigElement() {
    return document.createElement('multi-air-conditioner-card-editor');
  }

  static getStubConfig() {
    return {
      entities: [
        { entity_id: 'climate.dieu_hoa_living',         label: 'Phòng khách', area: '25 m²', icon: 'mdi:sofa' },
        { entity_id: 'climate.bed_air_conditioning',     label: 'Phòng ngủ',   area: '18 m²', icon: 'mdi:bed' },
        { entity_id: 'climate.kitchen_air_conditioning', label: 'Phòng ăn',    area: '20 m²', icon: 'mdi:silverware-fork-knife' },
        { entity_id: 'climate.dieu_hoa_office',          label: 'Văn phòng',   area: '15 m²', icon: 'mdi:briefcase' },
      ],
      pm25_entity:      'sensor.pm25',
      outdoor_temp_entity: 'sensor.outdoor_temperature',
      humidity_entity:  'sensor.outdoor_humidity',
      power_entity:     'sensor.ac_power_kwh',
    };
  }
  getCardSize() { return 8; }

  _s(id)       { return this._stateOf(this._hass, id); }
  _a(id, k)    { return this._attrOf(this._hass, id, k); }
  _call(d,s,x) { this._hass.callService(d, s, x); }

  // ── FIX: connectedCallback – inject font + CSS 1 lần duy nhất ────────────
  connectedCallback() {
    if (this.shadowRoot.querySelector('[data-ac-style]')) return;

    var link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Orbitron:wght@400;600;800&display=swap';
    link.setAttribute('data-ac-style', 'font');
    this.shadowRoot.appendChild(link);

    var style = document.createElement('style');
    style.setAttribute('data-ac-style', 'css');
    style.textContent = CARD_CSS;
    this.shadowRoot.appendChild(style);

    // Khởi động interval 10s để cập nhật nhiệt độ thực tế + ETA liên tục
    this._startRefresh();

    // Resume tất cả timer đang chạy (sau reload)
    var self2 = this;
    Object.keys(this._timers).forEach(function(idx) {
      var t = self2._timers[idx];
      if (t && t.end > Date.now() && !t.int) {
        self2._startTick(parseInt(idx));
      }
    });
    // -- Auto-scale: watch card width and scale down if needed --
    var self3 = this;
    var _scaleRafId = null;
    var _scalePending = false;
    function _applyScale() {
      var wrap = self3.shadowRoot && self3.shadowRoot.getElementById('ac-scale-wrap');
      if (!wrap) return;
      var card = wrap.firstElementChild;
      if (!card) return;
      var isSL = (self3._config && self3._config.view_mode === 'super_lite');
      var designW = isSL ? 320 : 460;
      // Đọc availW từ self3 (host element) — KHÔNG đọc từ wrap để tránh feedback loop
      var availW = self3.getBoundingClientRect().width || designW;
      if (availW < 10) return;
      if (availW >= designW) {
        // Desktop / wide: card stretches full width, no scale
        card.style.transform = '';
        card.style.width = '100%';
        card.style.minWidth = '';
        // Chỉ xóa height nếu đang set, tránh trigger layout liên tục
        if (wrap.style.height) wrap.style.height = '';
      } else {
        // Mobile / narrow: scale down proportionally
        var scale = availW / designW;
        var scaleStr = scale.toFixed(4);
        // Chỉ set transform khi giá trị thực sự thay đổi để tránh nháy
        var curTransform = card.style.transform;
        var newTransform = 'scale(' + scaleStr + ')';
        if (curTransform !== newTransform) {
          card.style.transform = newTransform;
        }
        if (card.style.width !== designW + 'px') {
          card.style.width = designW + 'px';
          card.style.minWidth = designW + 'px';
        }
        // Tính height SAU khi transform đã set (dùng scrollHeight để không bị ảnh hưởng scale)
        var naturalH = card.scrollHeight || card.offsetHeight;
        var newH = Math.round(naturalH * scale) + 'px';
        if (wrap.style.height !== newH) wrap.style.height = newH;
      }
    }
    // Debounced wrapper — tránh gọi liên tục khi ResizeObserver bắn nhiều entries
    function _scheduleScale() {
      if (_scalePending) return;
      _scalePending = true;
      _scaleRafId = requestAnimationFrame(function() {
        _scalePending = false;
        _applyScale();
      });
    }
    self3._applyScale = _applyScale;
    self3._scheduleScale = _scheduleScale;
    if (window.ResizeObserver) {
      // Observe host element để lấy width container, KHÔNG observe wrap/card
      // để tránh feedback loop: scale thay đổi height → ResizeObserver trigger lại
      self3._scaleObs = new ResizeObserver(function(entries) {
        // Bỏ qua nếu chỉ height thay đổi (do chính ta set wrap.style.height)
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.contentBoxSize) {
            var w = entry.contentBoxSize[0] ? entry.contentBoxSize[0].inlineSize : entry.contentRect.width;
            if (w < 10) continue;
          }
        }
        _scheduleScale();
      });
      self3._scaleObs.observe(self3);
    }
  }

  // Render icon: nếu là 'mdi:*' → <ha-icon>, ngược lại → text span (emoji fallback)
  // color: optional — nếu truyền vào sẽ set màu icon cụ thể, mặc định inherit
  _mdiIcon(icon, size, color) {
    size = size || 20;
    var clr = color || 'inherit';
    if (icon && icon.indexOf('mdi:') === 0) {
      return '<ha-icon icon="' + icon + '" style="--mdc-icon-size:' + size + 'px;--mdc-icon-color:' + clr + ';width:' + size + 'px;height:' + size + 'px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;color:' + clr + '"></ha-icon>';
    }
    return '<span style="font-size:' + Math.round(size * 0.85) + 'px;line-height:1;vertical-align:middle;color:' + clr + '">' + (icon || '') + '</span>';
  }

  _arc(cx, cy, r, a1, a2) {
    var rad = function(d) { return (d - 90) * Math.PI / 180; };
    var x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    var x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2));
    var lg = (a2 - a1 > 180) ? 1 : 0;
    return 'M' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + r + ' ' + r + ' 0 ' + lg + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2);
  }

  _renderFull() {
    if (!this._hass) return;

    var cfg    = this._config || {};
    var lang   = cfg.language || 'vi';
    var tr     = AC_TRANSLATIONS[lang] || AC_TRANSLATIONS.vi;
    var bgGrad = acPresetGradient(cfg.background_preset, cfg.bg_color1, cfg.bg_color2, cfg.bg_alpha);
    var accent = (cfg.background_preset === 'deep_neon' && (!cfg.accent_color || cfg.accent_color === '#00ffcc'))
      ? '#00d4ff'
      : (cfg.accent_color || '#00ffcc');
    var txtClr = cfg.text_color   || '#ffffff';

    var room    = ROOMS[this._activeIdx];
    var hvac    = this._s(room.id);
    var isOn    = hvac !== 'off';
    var curTemp = parseFloat(this._a(room.id,'current_temperature') || 26);
    var setTemp = parseFloat(this._a(room.id,'temperature')         || 24);
    var fanMode  = this._a(room.id,'fan_mode')     || 'auto';
    var swingMode= this._a(room.id,'swing_mode')   || 'off';
    var supportedFanModes = (function() {
      var raw = this._a(room.id,'fan_modes');
      return (Array.isArray(raw) && raw.length > 0) ? raw : null;
    }).call(this);
    var ecoOn   = this._a(room.id,'preset_mode') === 'eco';
    // Override curTemp từ cảm biến phòng nếu được cấu hình
    var roomEntCfg = (cfg.entities && cfg.entities[this._activeIdx]) || {};
    if (roomEntCfg.temp_entity && this._hass && this._hass.states[roomEntCfg.temp_entity]) {
      var sensorTemp = parseFloat(this._hass.states[roomEntCfg.temp_entity].state);
      if (!isNaN(sensorTemp)) curTemp = sensorTemp;
    }
    // Override roomHumidity từ cảm biến phòng nếu được cấu hình (đọc sớm để dùng trong header)
    var roomHumidityRaw = parseFloat(this._a(room.id, 'current_humidity') || this._a(room.id, 'humidity') || 0);
    if (roomEntCfg.humidity_entity && this._hass && this._hass.states[roomEntCfg.humidity_entity]) {
      var sensorHum = parseFloat(this._hass.states[roomEntCfg.humidity_entity].state);
      if (!isNaN(sensorHum)) roomHumidityRaw = sensorHum;
    }
    var roomHumidityDisplay = roomHumidityRaw > 0 ? Math.round(roomHumidityRaw) + '%' : '--';
    var isLite  = this._config.view_mode === 'lite';
    var tUnit   = cfg.temp_unit || 'C';   // 'C' | 'F' — đơn vị hiển thị người dùng chọn
    // Tự động nhận diện đơn vị HA entity trả về (temperature_unit attribute)
    var haUnit  = this._a(room.id, 'temperature_unit') || 'C'; // 'C' hoặc 'F'
    var curTempDisp = acFmtTemp(curTemp, tUnit, haUnit);
    var setTempDisp = acFmtSetTemp(setTemp, tUnit, haUnit);
    var degSym      = tUnit === 'F' ? '°F' : '°C';
    var fi  = Math.max(0, FAN_LEVELS.indexOf(fanMode));
    // Dùng supported fan_modes thực tế của entity; fallback về FAN_LEVELS
    var activeFanModes = supportedFanModes || FAN_LEVELS;
    // fi_active: vị trí fanMode trong danh sách thực tế (để tính fillCount theo thiết bị)
    var fi_active = Math.max(0, activeFanModes.indexOf(fanMode));
    var si  = Math.max(0, SWING_LEVELS.indexOf(swingMode));
    var mode    = MODE_CFG[hvac] || MODE_CFG.cool;
    // Localise mode labels and fan/swing labels
    mode = Object.assign({}, mode, { lbl: tr.modes[hvac] || mode.lbl });
    var fanLabels   = tr.fans   || ['Auto','Min','Low','Low-Mid','Medium','High-Mid','High','Max','Low/Auto','High/Auto','Quiet'];
    var swingLabels = tr.swings || ['Fixed','Up/Down','Left/Right','Both','Position 1','Position 2','Position 3','Position 4','Position 5','Position 6'];
    // Label cho swing hiện tại: map từ swing_mode string → label theo ngôn ngữ
    var swingModeToLabel = { off: swingLabels[0], vertical: swingLabels[1], horizontal: swingLabels[2], both: swingLabels[3] };
    // Numeric positions 1-6
    for (var _si = 1; _si <= 6; _si++) { swingModeToLabel[String(_si)] = swingLabels[3 + _si] || ('Pos ' + _si); }
    var swingCurrentLabel = swingModeToLabel[swingMode] || swingMode;

    var pct    = Math.max(0, Math.min(1, (curTemp - 16) / 16));
    var arcEnd = -140 + pct * 280;
    var dotRad = (arcEnd - 90) * Math.PI / 180;
    var dotX   = (110 + 88 * Math.cos(dotRad)).toFixed(1);
    var dotY   = (110 + 88 * Math.sin(dotRad)).toFixed(1);

    var now     = new Date();
    var timeStr = now.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
    var dateStr = now.toLocaleDateString('vi-VN', {weekday:'long', day:'2-digit', month:'2-digit'});

    var arcTrack = this._arc(110,110,88,-140,140);
    var arcFill  = pct > 0.02 ? this._arc(110,110,88,-140,arcEnd) : '';

    // Inner set-temperature ring (r=76) — color by mode, length by setTemp
    var setPct    = Math.max(0, Math.min(1, (setTemp - 16) / 16));
    var setArcEnd = -140 + setPct * 280;
    var innerTrack   = this._arc(110,110,76,-140,140);
    var innerArcFill = setPct > 0.02 ? this._arc(110,110,76,-140,setArcEnd) : '';
    var innerSetDotRad = (setArcEnd - 90) * Math.PI / 180;
    var innerSetDotX   = (110 + 76 * Math.cos(innerSetDotRad)).toFixed(1);
    var innerSetDotY   = (110 + 76 * Math.sin(innerSetDotRad)).toFixed(1);

    var arcFillSvg = '';
    if (pct > 0.02) {
      arcFillSvg = '<path d="' + arcFill + '" fill="none" stroke="url(#arcGrad)" stroke-width="12" stroke-linecap="round" filter="url(#arcGlow)" opacity="0.95"/>';
    }
    var dotSvg = '';
    if (pct > 0.02) {
      dotSvg = '<circle cx="' + dotX + '" cy="' + dotY + '" r="8" fill="' + mode.color + '" filter="url(#dotGlow)"/>'
             + '<circle cx="' + dotX + '" cy="' + dotY + '" r="4" fill="white" opacity="0.9"/>';
    }

    // Tick marks
    var ticks = '';
    for (var k = 0; k < 17; k++) {
      var tDeg = -140 + k * 280 / 16;
      var tRad = (tDeg - 90) * Math.PI / 180;
      var tx1 = (110 + 79 * Math.cos(tRad)).toFixed(1), ty1 = (110 + 79 * Math.sin(tRad)).toFixed(1);
      var tx2 = (110 + 85 * Math.cos(tRad)).toFixed(1), ty2 = (110 + 85 * Math.sin(tRad)).toFixed(1);
      ticks += '<line x1="' + tx1 + '" y1="' + ty1 + '" x2="' + tx2 + '" y2="' + ty2 + '" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" stroke-linecap="round"/>';
    }

    // Fan bar chart
    var barHeights = [7,10,13,16,19,22,26,30];
    // fillCount: map fan level index to number of bars filled (8 bars total)
    // indices: auto,min,low,low_mid,medium,high_mid,high,max,low/auto,high/auto,quiet
    var fanFillMap = [0, 1, 2, 3, 4, 5, 6, 8, 2, 6, 1]; // 11 modes
    var fillCount;
    if (fi >= 0 && fi < fanFillMap.length) {
      // Chế độ nằm trong danh sách chuẩn → dùng map chuẩn
      fillCount = fanFillMap[fi];
    } else if (activeFanModes.length > 1) {
      // Chế độ thiết bị tự định nghĩa → tính theo vị trí tỉ lệ trong danh sách thực tế
      fillCount = Math.round((fi_active / (activeFanModes.length - 1)) * 8);
    } else {
      fillCount = 4;
    }
    var fanBarHtml = '';
    for (var i = 0; i < 8; i++) {
      var barOn = i < fillCount;
      fanBarHtml += '<span class="fbar' + (barOn ? ' fbar-on' : '') + '" style="height:' + barHeights[i] + 'px"></span>';
    }

    // Fan icon SVG – cánh béo to, viền sáng, animation khi auto
    var fanIconSvg = (function(fi) {
      var color = 'var(--accent)';
      var glow  = 'var(--glow)';
      var dim = 42; // to hơn hẳn
      var cx = 21, cy = 21;
      // Cánh béo: dùng cubic bezier tạo hình giống cánh quạt thật
      function fatBlade(angleDeg) {
        var a  = (angleDeg - 90) * Math.PI / 180;
        var aL = (angleDeg - 90 - 38) * Math.PI / 180; // cạnh trái cánh
        var aR = (angleDeg - 90 + 22) * Math.PI / 180; // cạnh phải cánh
        var len = 14.5; // chiều dài cánh
        var baseW = 5;  // bán rộng gốc cánh
        // Điểm đầu cánh (2 góc trái/phải tại gốc)
        var bLx = cx + baseW * Math.cos(aL), bLy = cy + baseW * Math.sin(aL);
        var bRx = cx + baseW * Math.cos(aR), bRy = cy + baseW * Math.sin(aR);
        // Đỉnh cánh
        var tipX = cx + len * Math.cos(a), tipY = cy + len * Math.sin(a);
        // Control points để tạo đường cong béo
        var c1x = cx + len*0.45 * Math.cos(aL) + len*0.3 * Math.cos(a);
        var c1y = cy + len*0.45 * Math.sin(aL) + len*0.3 * Math.sin(a);
        var c2x = tipX + 3 * Math.cos(aR), c2y = tipY + 3 * Math.sin(aR);
        var c3x = cx + len*0.45 * Math.cos(aR) + len*0.2 * Math.cos(a);
        var c3y = cy + len*0.45 * Math.sin(aR) + len*0.2 * Math.sin(a);
        return 'M ' + bLx.toFixed(2) + ' ' + bLy.toFixed(2)
          + ' C ' + c1x.toFixed(2) + ' ' + c1y.toFixed(2) + ' ' + c2x.toFixed(2) + ' ' + c2y.toFixed(2) + ' ' + tipX.toFixed(2) + ' ' + tipY.toFixed(2)
          + ' C ' + c2x.toFixed(2) + ' ' + c2y.toFixed(2) + ' ' + c3x.toFixed(2) + ' ' + c3y.toFixed(2) + ' ' + bRx.toFixed(2) + ' ' + bRy.toFixed(2)
          + ' Z';
      }
      var bladeCount = [4, 3, 3, 4, 4, 4, 5, 5, 3, 5, 3][Math.min(fi, 10)] || 4;
      var blades = '';
      for (var b = 0; b < bladeCount; b++) {
        var ang = b * (360 / bladeCount);
        // Fill béo + stroke viền sáng
        blades += '<path d="' + fatBlade(ang) + '" fill="' + color + '" fill-opacity="0.82"'
          + ' stroke="rgba(255,255,255,0.55)" stroke-width="0.8" stroke-linejoin="round"/>';
      }
      var animStyle = (fi === 0 || fi === 8 || fi === 9) ? 'style="transform-origin:21px 21px;animation:fanSpin 1.4s linear infinite"'
                    : fi === 10 ? 'style="transform-origin:21px 21px;animation:fanSpin 4s linear infinite"'
                    : '';
      return '<svg width="' + dim + '" height="' + dim + '" viewBox="0 0 42 42" ' + animStyle + '>'
        + '<defs><filter id="fanGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
        + '<g filter="url(#fanGlow)">'
        + blades
        + '</g>'
        + '<circle cx="21" cy="21" r="4.5" fill="' + color + '" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>'
        + '<circle cx="21" cy="21" r="2" fill="rgba(220,240,255,0.85)"/>'
        + '</svg>';
    })(fi);
    var swingActive = swingMode !== 'off';
    var sColor = swingActive ? 'var(--accent)' : 'rgba(255,255,255,0.3)';
    var sOp    = swingActive ? '1' : '0.5';
    var swingSvg = '<svg width="38" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M2 8 Q10 4 18 8 Q26 12 34 8" stroke="' + sColor + '" stroke-width="2" stroke-linecap="round" fill="none" opacity="' + sOp + '"/>'
      + '<path d="M2 15 Q10 11 18 15 Q26 19 34 15" stroke="' + sColor + '" stroke-width="2" stroke-linecap="round" fill="none" opacity="' + (swingActive?'0.7':'0.35') + '"/>'
      + '<path d="M2 22 Q10 18 18 22 Q26 26 34 22" stroke="' + sColor + '" stroke-width="2" stroke-linecap="round" fill="none" opacity="' + (swingActive?'0.45':'0.2') + '"/>'
      + '</svg>';

    var swingBtn = '<button class="swing-btn" id="btn-swing">'
      + swingSvg
      + '<span class="swing-lbl">' + swingCurrentLabel + '</span>'
      + '</button>';

    // Room tabs
    var roomTabs = '';
    for (var j = 0; j < ROOMS.length; j++) {
      var rState = this._s(ROOMS[j].id);
      var ron = rState !== 'off';
      var rTemp = parseFloat(this._a(ROOMS[j].id, 'current_temperature') || 0);
      var rTempDisp = rTemp > 0 ? acFmtTemp(rTemp, tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°') : '--';
      var rTempStr = rTempDisp;

      // ── Đọc độ ẩm phòng (per-room sensor hoặc global) ──
      var rHumRaw = NaN;
      var rEntCfgJ = (cfg.entities && cfg.entities[j]) || {};
      if (rEntCfgJ.humidity_entity && this._hass && this._hass.states[rEntCfgJ.humidity_entity]) {
        rHumRaw = parseFloat(this._hass.states[rEntCfgJ.humidity_entity].state);
      } else if (this._a(ROOMS[j].id, 'current_humidity')) {
        rHumRaw = parseFloat(this._a(ROOMS[j].id, 'current_humidity'));
      }

      // ── Sinh tooltip thông minh theo nhiệt độ + độ ẩm + trạng thái ──
      var tipMsg = '';
      var tipColor = 'rgba(255,255,255,0.88)';
      var tipEmoji = '';
      var rTD = rTemp > 0 ? acFmtTemp(rTemp, tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°') : '';
      if (rTemp > 0) {
        // Thresholds: convert to compare in °C always (rTemp is always °C from HA)
        var tHot  = 32, tWarm = 29, tCool = 24, tCold = 18;
        if (!ron) {
          if (rTemp >= tHot) {
            tipEmoji = '🥵'; tipMsg = lang === 'vi' ? 'Nóng quá ' + rTD + ' rồi, bật điều hòa đi bạn!' : 'Too hot at ' + rTD + '! Turn on the AC!';
            tipColor = '#fca5a5';
          } else if (rTemp >= tWarm) {
            tipEmoji = '☀️'; tipMsg = lang === 'vi' ? 'Hơi nóng đó, ' + rTD + ' — bật điều hòa cho mát?' : 'Getting warm (' + rTD + ') — turn on AC?';
            tipColor = '#fdba74';
          } else if (rTemp <= tCold) {
            tipEmoji = '🥶'; tipMsg = lang === 'vi' ? 'Lạnh quá ' + rTD + ', bật sưởi đi bạn!' : 'Too cold at ' + rTD + '! Turn on heat?';
            tipColor = '#93c5fd';
          } else if (!isNaN(rHumRaw) && rHumRaw >= 75) {
            tipEmoji = '💧'; tipMsg = lang === 'vi' ? 'Độ ẩm ' + Math.round(rHumRaw) + '% — ẩm thật! Bật hút ẩm đi?' : 'Humidity ' + Math.round(rHumRaw) + '% — quite humid! Try dry mode?';
            tipColor = '#c4b5fd';
          } else {
            tipEmoji = '✅'; tipMsg = lang === 'vi' ? rTD + ' — phòng đang ổn, không cần bật đâu' : rTD + ' — room is comfortable';
            tipColor = '#86efac';
          }
        } else {
          if (rState === 'cool') {
            if (rTemp > 28) {
              tipEmoji = '❄️'; tipMsg = lang === 'vi' ? 'Đang làm lạnh... ' + rTD + ' còn hơi cao, chờ tí nha!' : 'Cooling... ' + rTD + ' still a bit high, hang on!';
              tipColor = '#7dd3fc';
            } else if (rTemp <= tCool) {
              tipEmoji = '😌'; tipMsg = lang === 'vi' ? rTD + ' — mát rồi đó, dễ chịu lắm!' : rTD + ' — nice and cool now!';
              tipColor = '#6ee7b7';
            } else {
              tipEmoji = '❄️'; tipMsg = lang === 'vi' ? 'Đang làm lạnh, ' + rTD + ' — sắp mát rồi!' : 'Cooling down (' + rTD + ') — almost there!';
              tipColor = '#93c5fd';
            }
          } else if (rState === 'heat') {
            tipEmoji = '🔥'; tipMsg = lang === 'vi' ? 'Đang sưởi ấm, ' + rTD + ' — ấm áp rồi nhé!' : 'Heating up (' + rTD + ') — getting warm!';
            tipColor = '#fca5a5';
          } else if (rState === 'dry') {
            tipEmoji = '💨'; tipMsg = lang === 'vi'
              ? (!isNaN(rHumRaw) ? 'Đang hút ẩm, ' + Math.round(rHumRaw) + '% — không khí đang khô ráo dần' : 'Đang hút ẩm — không khí dễ chịu hơn rồi!')
              : (!isNaN(rHumRaw) ? 'Drying... ' + Math.round(rHumRaw) + '% humidity — getting better!' : 'Dehumidifying — air feels fresher!');
            tipColor = '#c4b5fd';
          } else if (rState === 'fan_only') {
            tipEmoji = '🌬️'; tipMsg = lang === 'vi' ? 'Quạt đang chạy, ' + rTD + ' — gió mát thôi nhé!' : 'Fan on (' + rTD + ') — just fresh air!';
            tipColor = '#86efac';
          }
        }
        if (!isNaN(rHumRaw) && rHumRaw >= 80 && rState !== 'dry' && !tipMsg.includes('ẩm') && !tipMsg.includes('humid')) {
          tipMsg += (lang === 'vi' ? ' (Độ ẩm ' + Math.round(rHumRaw) + '% hơi cao!)' : ' (Humidity ' + Math.round(rHumRaw) + '% is high!)');
        }
      } else {
        tipMsg = lang === 'vi' ? 'Không có dữ liệu nhiệt độ' : 'No temperature data';
        tipColor = 'rgba(255,255,255,0.5)';
      }
      var tipHtml = tipMsg
        ? '<span class="room-tab-tip" style="color:' + tipColor + '">' + tipEmoji + ' ' + tipMsg + '</span>'
        : '';
      var isActive = j === this._activeIdx;
      var tabClass = 'room-tab'
        + (isActive && ron  ? ' room-tab--active room-tab--on'  : '')
        + (isActive && !ron ? ' room-tab--active room-tab--off' : '')
        + (!isActive && ron ? ' room-tab--running' : '');
      var rMode = this._s(ROOMS[j].id);
      var rModeCfg = MODE_CFG[rMode] || MODE_CFG.cool;
      var tabIconColor = ron ? rModeCfg.color : 'rgba(255,255,255,0.55)';

      // ── Temperature progress background ──────────────────────────────────
      // Khi máy đang bật, hiển thị progress bar nền từ trái sang phải
      // Progress = 100% khi nhiệt độ thực tế đạt đến nhiệt độ đặt
      var rSetTemp = parseFloat(this._a(ROOMS[j].id, 'temperature') || 0);
      var tabProgressStyle = '';
      if (ron && rSetTemp > 0 && rTemp > 0) {
        // Xác định màu progress theo mode
        var progressColor = rModeCfg.color || 'rgba(0,200,255,0.9)';
        // Chuyển hex/rgb → rgba với opacity thấp cho nền
        var progressBg = progressColor;
        // Parse color để tạo rgba semi-transparent
        var hexMatch = progressColor.match(/^#([0-9a-f]{6})$/i);
        if (hexMatch) {
          var hr = parseInt(hexMatch[1].substring(0,2),16);
          var hg = parseInt(hexMatch[1].substring(2,4),16);
          var hb = parseInt(hexMatch[1].substring(4,6),16);
          progressBg = 'rgba(' + hr + ',' + hg + ',' + hb + ',0.22)';
        } else {
          // fallback: dùng color-mix hoặc rgba mặc định
          progressBg = progressColor.replace('rgb(','rgba(').replace(')',',0.22)');
        }

        var progressPct = 0;
        if (rMode === 'cool' || rMode === 'auto') {
          // Làm lạnh: progress từ (setTemp+10°C) xuống setTemp
          // curTemp >= setTemp+10 → 0%, curTemp = setTemp → 100%
          var coolHigh = rSetTemp + 10;
          progressPct = Math.max(0, Math.min(100, (1 - (rTemp - rSetTemp) / 10) * 100));
          if (rTemp <= rSetTemp) progressPct = 100;
          if (rTemp >= coolHigh) progressPct = 0;
        } else if (rMode === 'heat') {
          // Sưởi: progress từ (setTemp-10°C) lên setTemp
          var heatLow = rSetTemp - 10;
          progressPct = Math.max(0, Math.min(100, (1 - (rSetTemp - rTemp) / 10) * 100));
          if (rTemp >= rSetTemp) progressPct = 100;
          if (rTemp <= heatLow) progressPct = 0;
        } else {
          // Dry / fan_only: hiển thị cố định 60%
          progressPct = 60;
        }

        // Build inline background: progress từ trái qua phải, trong suốt dần
        // Viền (border) được giữ nguyên từ CSS class, chỉ background thay đổi
        tabProgressStyle = 'background:linear-gradient(to right,'
          + progressBg + ' 0%,'
          + progressBg + ' ' + progressPct.toFixed(1) + '%,'
          + 'transparent ' + progressPct.toFixed(1) + '%,'
          + 'transparent 100%);';
      }

      roomTabs += '<button class="' + tabClass + '" data-room="' + j + '" data-tip="' + (tipMsg ? tipEmoji + ' ' + tipMsg : '') + '" data-tip-color="' + tipColor + '"'
        + (tabProgressStyle ? ' style="' + tabProgressStyle + '"' : '') + '>'
        + '<span class="room-tab-ico">' + this._mdiIcon(ROOMS[j].icon, 20, tabIconColor) + '</span>'
        + '<span class="room-tab-info">'
        + '  <span class="room-tab-name">' + ROOMS[j].label + '</span>'
        + '  <span class="room-tab-temp">' + rTempStr + '</span>'
        + '</span>'
        + '<span class="room-status-badge ' + (ron ? 'rsb-on' : 'rsb-off') + '">' + (ron ? 'ON' : 'OFF') + '</span>'
        + '</button>';
    }

    // Mode buttons — lọc theo từng flag show_cool / show_heat / show_dry / show_fan_only / show_auto
    var modeKeys = ['auto','cool','heat','dry','fan_only'];
    var modeShowMap = { auto: 'show_auto', cool: 'show_cool', heat: 'show_heat', dry: 'show_dry', fan_only: 'show_fan_only' };
    var modeBtns = '';
    for (var m = 0; m < modeKeys.length; m++) {
      var mk = modeKeys[m];
      // auto mặc định ẩn (show_auto === true mới hiện)
      if (mk === 'auto' && cfg.show_auto !== true) continue;
      if (mk !== 'auto' && cfg[modeShowMap[mk]] === false) continue;
      var mc = Object.assign({}, MODE_CFG[mk], { lbl: tr.modes[mk] || MODE_CFG[mk].lbl });
      var act = hvac === mk;
      var st  = act ? ('--bc:' + mc.color + ';--bg:' + mc.glow + ';') : '';
      var modeIconColor = act ? mc.color : '#ffffff';
      var modeIconHtml = (mc.icon && mc.icon.indexOf('mdi:') === 0)
        ? '<ha-icon icon="' + mc.icon + '" style="--mdc-icon-size:22px;--mdc-icon-color:' + modeIconColor + ';width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;color:' + modeIconColor + '"></ha-icon>'
        : '<span style="font-size:18px;line-height:1;vertical-align:middle">' + mc.icon + '</span>';
      modeBtns += '<button class="mode-btn' + (act ? ' mode-btn--active' : '') + '" data-hvac="' + mk + '" style="' + st + '">'
        + '<span class="mode-icon">' + modeIconHtml + '</span>'
        + '<span class="mode-lbl">' + mc.lbl + '</span>'
        + '</button>';
    }

    var comfortTxt = (hvac === 'cool' || hvac === 'heat') ? tr.comfortTemp(curTemp) : (tr.comfort[hvac] || '');
    var modeChipIcon = (mode.icon && mode.icon.indexOf('mdi:') === 0)
      ? '<ha-icon icon="' + mode.icon + '" style="--mdc-icon-size:14px;--mdc-icon-color:' + mode.color + ';width:14px;height:14px;display:inline-flex;align-items:center;justify-content:center;color:' + mode.color + '"></ha-icon>'
      : '<span style="font-size:12px;line-height:1;vertical-align:middle">' + mode.icon + '</span>';
    var modeChip = isOn ? ('<span class="ac-mode-chip">' + modeChipIcon + ' ' + mode.lbl + '</span>') : '';

    var pwClass = isOn ? 'pw-on' : 'pw-off';
    var entityState = this._hass && this._hass.states && this._hass.states[room.id] ? this._hass.states[room.id].state : 'unknown';
    var wifiOk = entityState !== 'unknown' && entityState !== 'unavailable';
    var wifiColor = wifiOk ? '#34d399' : 'rgba(255,255,255,0.4)';
    var wifiGlow  = wifiOk ? 'drop-shadow(0 0 4px #34d399)' : 'none';
    var pwSub   = isOn ? tr.tapOff : tr.tapOn;

    // Đọc giá trị cảm biến từ config
    var cfg = this._config || {};
    var pm25Val = cfg.pm25_entity && this._hass && this._hass.states[cfg.pm25_entity]
      ? parseFloat(this._hass.states[cfg.pm25_entity].state) || '--'
      : '--';
    // Nhiệt độ ngoài: ưu tiên sensor config, fallback current_temperature phòng đang chọn
    var outdoorTempRaw = cfg.outdoor_temp_entity && this._hass && this._hass.states[cfg.outdoor_temp_entity]
      ? parseFloat(this._hass.states[cfg.outdoor_temp_entity].state)
      : (curTemp > 0 ? curTemp : null);
    var outdoorTempVal = outdoorTempRaw !== null && !isNaN(outdoorTempRaw)
      ? acFmtTemp(outdoorTempRaw, tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°')
      : '--°';
    // Độ ẩm ngoài: ưu tiên outdoor sensor config, fallback roomHumidityRaw (đã tính từ phòng/cảm biến)
    var humidityVal = cfg.humidity_entity && this._hass && this._hass.states[cfg.humidity_entity]
      ? Math.round(parseFloat(this._hass.states[cfg.humidity_entity].state)) + '%'
      : (roomHumidityRaw > 0 ? Math.round(roomHumidityRaw) + '%' : '--%');
    var powerUnit = cfg.power_unit || 'kw';
    // Per-room power entity: ưu tiên entities[activeIdx].power_entity, fallback global power_entity
    var roomPowerEntity = roomEntCfg.power_entity || null;
    var powerRawState = null;
    if (roomPowerEntity && this._hass && this._hass.states[roomPowerEntity]) {
      powerRawState = parseFloat(this._hass.states[roomPowerEntity].state);
    } else if (cfg.power_entity && this._hass && this._hass.states[cfg.power_entity]) {
      powerRawState = parseFloat(this._hass.states[cfg.power_entity].state);
    }
    var powerVal = '--';
    if (powerRawState !== null && !isNaN(powerRawState)) {
      if (powerUnit === 'w') {
        powerVal = powerRawState >= 1000
          ? (powerRawState / 1000).toFixed(2) + ' kW'
          : Math.round(powerRawState) + ' W';
      } else {
        powerVal = powerRawState.toFixed(2) + ' kW';
      }
    }

    // ── SUPER LITE MODE ──────────────────────────────────────────────────────
    var isSuperLite = this._config.view_mode === 'super_lite';
    if (isSuperLite) {
      var slModeKeys = ['auto','cool','heat','dry','fan_only'];
      var slModeShowMap = { auto: 'show_auto', cool: 'show_cool', heat: 'show_heat', dry: 'show_dry', fan_only: 'show_fan_only' };
      var slModeOptions = '<option value="off">' + (tr.modes['off'] || 'Tắt') + '</option>';
      for (var sm = 0; sm < slModeKeys.length; sm++) {
        var smk = slModeKeys[sm];
        if (smk === 'auto' && cfg.show_auto !== true) continue;
        if (smk !== 'auto' && cfg[slModeShowMap[smk]] === false) continue;
        var smc = Object.assign({}, MODE_CFG[smk], { lbl: tr.modes[smk] || MODE_CFG[smk].lbl });
        var smcOptIcon = (smc.icon && smc.icon.indexOf('mdi:') === 0)
          ? ({ 'mdi:snowflake':'❄', 'mdi:fire':'🔥', 'mdi:water':'💧', 'mdi:fan':'🌬️' }[smc.icon] || '●')
          : smc.icon;
        slModeOptions += '<option value="' + smk + '"' + (hvac === smk ? ' selected' : '') + '>' + smcOptIcon + ' ' + smc.lbl + '</option>';
      }
      var slIsOn = hvac !== 'off';
      // Outdoor sensors for super lite
      var slOutdoorTemp = cfg.outdoor_temp_entity && this._hass && this._hass.states[cfg.outdoor_temp_entity]
        ? acFmtTemp(parseFloat(this._hass.states[cfg.outdoor_temp_entity].state), tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°')
        : null;
      var slHumidity = cfg.humidity_entity && this._hass && this._hass.states[cfg.humidity_entity]
        ? Math.round(parseFloat(this._hass.states[cfg.humidity_entity].state)) + '%'
        : null;

      // Room env override: nếu show_room_env bật → dùng nhiệt độ/độ ẩm phòng đang chọn
      var slShowRoomEnv = cfg.show_room_env === true;
      var slEnvTemp, slEnvHumidity, slEnvIsRoom;
      if (slShowRoomEnv) {
        // Nhiệt độ phòng: ưu tiên cảm biến riêng, fallback current_temperature của entity
        var roomEntCfgSL = (cfg.entities && cfg.entities[this._activeIdx]) || {};
        var roomTempSL = curTemp; // curTemp đã tính từ sensor/entity bên trên
        var roomHumSL  = roomHumidityRaw; // roomHumidityRaw đã tính bên trên
        slEnvTemp     = roomTempSL > 0 ? acFmtTemp(roomTempSL, tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°') : null;
        slEnvHumidity = roomHumSL  > 0 ? Math.round(roomHumSL) + '%'  : null;
        slEnvIsRoom   = true;
      } else {
        slEnvTemp     = slOutdoorTemp;
        slEnvHumidity = slHumidity;
        slEnvIsRoom   = false;
      }
      // Inner set-temp ring (same calc as main render)
      var slSetPct    = Math.max(0, Math.min(1, (setTemp - 16) / 16));
      var slSetArcEnd = -140 + slSetPct * 280;
      var slInnerTrack   = this._arc(110,110,76,-140,140);
      var slInnerArcFill = slSetPct > 0.02 ? this._arc(110,110,76,-140,slSetArcEnd) : '';
      var slSetDotRad = (slSetArcEnd - 90) * Math.PI / 180;
      var slSetDotX   = (110 + 76 * Math.cos(slSetDotRad)).toFixed(1);
      var slSetDotY   = (110 + 76 * Math.sin(slSetDotRad)).toFixed(1);

      // Build room dropdown button label + popup items
      var slRoomBtnLabel = '';
      var slRoomPopupItems = '';
      for (var sri = 0; sri < ROOMS.length; sri++) {
        var sriState = this._s(ROOMS[sri].id);
        var sriOn    = sriState !== 'off';
        var sriTemp  = parseFloat(this._a(ROOMS[sri].id, 'current_temperature') || 0);
        var sriTempStr = sriTemp > 0 ? ' · ' + acFmtTemp(sriTemp, tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°') : '';
        var sriHumRaw = parseFloat(this._a(ROOMS[sri].id, 'current_humidity') || this._a(ROOMS[sri].id, 'humidity') || 0);
        var sriEntCfgH = (cfg.entities && cfg.entities[sri]) || {};
        if (sriEntCfgH.humidity_entity && this._hass && this._hass.states[sriEntCfgH.humidity_entity]) {
          var sriHumSensor = parseFloat(this._hass.states[sriEntCfgH.humidity_entity].state);
          if (!isNaN(sriHumSensor)) sriHumRaw = sriHumSensor;
        }
        var sriHumStr = sriHumRaw > 0 ? ' · 💧' + Math.round(sriHumRaw) + '%' : '';
        var sriIconColor = sriOn ? (MODE_CFG[sriState] || MODE_CFG.cool).color : 'rgba(255,255,255,0.55)';
        var sriIconHtml = this._mdiIcon(ROOMS[sri].icon, 18, sriIconColor);
        var sriLabelText = ROOMS[sri].label + sriTempStr + sriHumStr;
        if (sri === this._activeIdx) slRoomBtnLabel = sriIconHtml + ' ' + sriLabelText;
        slRoomPopupItems += '<div class="sl-room-item' + (sri === this._activeIdx ? ' active' : '') + '" data-room-idx="' + sri + '">'
          + '<span style="flex:1;display:flex;align-items:center;gap:6px">' + sriIconHtml + '<span>' + sriLabelText + '</span></span>'
          + '<span class="sl-room-item-badge ' + (sriOn ? 'on' : 'off') + '">' + (sriOn ? 'ON' : 'OFF') + '</span>'
          + '</div>';
      }
      this._slRoomPopupItems = slRoomPopupItems;

      var isDeepNeonSL = (cfg.background_preset === 'deep_neon');
      var slShowFan   = cfg.show_sl_fan   !== false;
      var slShowSwing = cfg.show_sl_swing !== false;
      var slCompact   = slShowFan || slShowSwing;
      var slFanLabelIdx = FAN_LEVELS.indexOf(fanMode);
      // Ưu tiên label từ FAN_LEVELS chuẩn; nếu thiết bị dùng tên riêng thì hiển thị nguyên
      var slFanLabel  = (slFanLabelIdx >= 0 && tr.fans && tr.fans[slFanLabelIdx]) ? tr.fans[slFanLabelIdx] : fanMode;
      var slSwingLabel = swingCurrentLabel;

      // ── Room power per-room ──────────────────────────────────────────────────
      var slShowRoomPower = cfg.show_sl_room_power !== false;
      var slPowerUnit = cfg.power_unit || 'kw'; // 'kw' | 'w'
      var slRoomPowerRaw = null;
      var roomEntCfgPow = (cfg.entities && cfg.entities[this._activeIdx]) || {};
      if (roomEntCfgPow.power_entity && this._hass && this._hass.states[roomEntCfgPow.power_entity]) {
        var rawPow = parseFloat(this._hass.states[roomEntCfgPow.power_entity].state);
        if (!isNaN(rawPow)) {
          slRoomPowerRaw = slPowerUnit === 'w'
            ? (rawPow >= 1000 ? (rawPow/1000).toFixed(2) + ' kW' : Math.round(rawPow) + ' W')
            : rawPow.toFixed(2) + ' kW';
        }
      }
      var _customCssVarsSL = '';
      if (cfg.color_temp_val)     _customCssVarsSL += '--cv-temp:' + cfg.color_temp_val + ';';
      if (cfg.color_comfort)      _customCssVarsSL += '--cv-comfort:' + cfg.color_comfort + ';';
      if (cfg.color_room_on)      _customCssVarsSL += '--cv-room-on:' + cfg.color_room_on + ';';
      if (cfg.color_room_off)     _customCssVarsSL += '--cv-room-off:' + cfg.color_room_off + ';';
      if (cfg.color_title)        _customCssVarsSL += '--cv-title:' + cfg.color_title + ';';
      if (cfg.color_greet_sub)    _customCssVarsSL += '--cv-greet-sub:' + cfg.color_greet_sub + ';';
      if (cfg.color_greet_name)   _customCssVarsSL += '--cv-greet-name:' + cfg.color_greet_name + ';';
      if (cfg.color_dial_lbl)     _customCssVarsSL += '--cv-dial-lbl:' + cfg.color_dial_lbl + ';';
      if (cfg.color_temp_set)     _customCssVarsSL += '--cv-temp-set:' + cfg.color_temp_set + ';';
      if (cfg.color_eta)          _customCssVarsSL += '--cv-eta:' + cfg.color_eta + ';';
      if (cfg.color_mode_lbl)     _customCssVarsSL += '--cv-mode-lbl:' + cfg.color_mode_lbl + ';';
      if (cfg.color_fc_label)     _customCssVarsSL += '--cv-fc-label:' + cfg.color_fc_label + ';';
      if (cfg.color_fc_val)       _customCssVarsSL += '--cv-fc-val:' + cfg.color_fc_val + ';';
      if (cfg.color_swing_lbl)    _customCssVarsSL += '--cv-swing-lbl:' + cfg.color_swing_lbl + ';';
      if (cfg.color_room_header)  _customCssVarsSL += '--cv-room-header:' + cfg.color_room_header + ';';
      if (cfg.color_room_name)    _customCssVarsSL += '--cv-room-name:' + cfg.color_room_name + ';';
      if (cfg.color_st_title)     _customCssVarsSL += '--cv-st-title:' + cfg.color_st_title + ';';
      if (cfg.color_st_sub)       _customCssVarsSL += '--cv-st-sub:' + cfg.color_st_sub + ';';
      var slHtml = '<div class="card card--super-lite' + (isDeepNeonSL ? ' card--deep-neon' : '') + '" style="--accent:' + mode.color + ';--glow:' + mode.glow + ';background:' + bgGrad + ';' + _customCssVarsSL + '">'
        + '<div class="sl-body">'

        // ── Header: title + sensors + wifi + gear + status badge
        + '<div class="sl-hdr">'
        + '  <div style="display:flex;flex-direction:column;gap:2px">'
        + '    <span class="sl-title">' + tr.greet() + ' ' + (cfg.owner_name || tr.cardSub) + '</span>'
        + (!slEnvIsRoom ? '    <span style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.4);font-weight:600;margin-bottom:1px">&#127777; ' + (tr.outdoorLabel || 'Outdoor') + '</span>' : '')
        + (slEnvTemp || slEnvHumidity || (slShowRoomPower && slRoomPowerRaw) ? (
            '    <span style="display:flex;gap:8px;align-items:center">'
          + (slEnvTemp     ? '<span style="font-size:13px;color:rgba(255,255,255,' + (slEnvIsRoom ? '0.9' : '0.65') + ');font-family:\'Orbitron\',sans-serif;font-weight:600">' + (slEnvIsRoom ? '&#127968;' : '&#127777;') + ' ' + slEnvTemp + '</span>' : '')
          + (slEnvHumidity ? '<span style="font-size:13px;color:rgba(255,255,255,' + (slEnvIsRoom ? '0.75' : '0.55') + ');font-family:\'Orbitron\',sans-serif;font-weight:600">&#128167; ' + slEnvHumidity + '</span>' : '')
          + (slShowRoomPower && slRoomPowerRaw ? '<span style="font-size:13px;color:rgba(255,255,255,0.7);font-family:\'Orbitron\',sans-serif;font-weight:600">&#9889; ' + slRoomPowerRaw + '</span>' : '')
          + '    </span>'
          ) : '')
        + '  </div>'
        + '  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'
        + '    <div style="display:flex;align-items:center;gap:10px">'
        + '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + wifiColor + '" stroke-width="1.8" style="filter:' + wifiGlow + ';flex-shrink:0"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>'
        + '      <button id="sl-btn-gear" style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;line-height:0">'
        + '        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
        + '      </button>'
        + '      <span class="sl-badge">'
        + '        <span class="sl-led ' + (slIsOn ? 'sl-led-on' : 'sl-led-off') + '"></span>'
        + '        <span class="sl-badge-txt">' + (slIsOn ? tr.statusOn : tr.statusOff) + '</span>'
        + '      </span>'
        + '    </div>'
        + '    <div style="display:flex;align-items:center;gap:3px">'
        + '      <button class="sl-vs-btn' + (cfg.view_mode !== 'super_lite' && cfg.view_mode !== 'lite' ? ' sl-vs-btn--active' : '') + '" id="sl-vs-full" title="Full"><svg width="20" height="8" viewBox="0 0 20 8"><circle cx="2" cy="4" r="2.2" fill="currentColor"/><circle cx="10" cy="4" r="2.2" fill="currentColor"/><circle cx="18" cy="4" r="2.2" fill="currentColor"/></svg></button>'
        + '      <button class="sl-vs-btn' + (cfg.view_mode === 'lite' ? ' sl-vs-btn--active' : '') + '" id="sl-vs-lite" title="Lite"><svg width="14" height="8" viewBox="0 0 14 8"><circle cx="2" cy="4" r="2.2" fill="currentColor"/><circle cx="10" cy="4" r="2.2" fill="currentColor"/></svg></button>'
        + '      <button class="sl-vs-btn' + (cfg.view_mode === 'super_lite' ? ' sl-vs-btn--active' : '') + '" id="sl-vs-superlite" title="Super Lite"><svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="2.2" fill="currentColor"/></svg></button>'
        + '    </div>'
        + '  </div>'
        + '</div>'

        // ── Dial — larger (240px), with inner set-temp ring
        + '<div class="sl-dial-wrap">'
        + '<svg width="240" height="240" viewBox="0 0 220 220" style="overflow:visible">'
        + '<defs>'
        + '<filter id="arcGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        + '<filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        + '<filter id="innerArcGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        + '<linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3b9eff"/><stop offset="50%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
        + '<radialGradient id="innerGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="' + mode.color + '" stop-opacity="0.25"/><stop offset="100%" stop-color="' + mode.color + '" stop-opacity="0"/></radialGradient>'
        + '</defs>'
        + '<circle cx="110" cy="110" r="72" fill="rgba(180,220,255,0.25)" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>'
        + '<circle cx="110" cy="110" r="68" fill="url(#innerGlow)"/>'
        + '<path d="' + arcTrack + '" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" stroke-linecap="round"/>'
        + ticks
        + arcFillSvg
        + dotSvg
        // inner set-temp ring
        + '<path d="' + slInnerTrack + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/>'
        + (slSetPct > 0.02 ? '<path d="' + slInnerArcFill + '" fill="none" stroke="' + mode.color + '" stroke-width="4" stroke-linecap="round" filter="url(#innerArcGlow)" opacity="0.85"/>' : '')
        + (slSetPct > 0.02 ? '<circle cx="' + slSetDotX + '" cy="' + slSetDotY + '" r="4" fill="' + mode.color + '" filter="url(#innerArcGlow)"/><circle cx="' + slSetDotX + '" cy="' + slSetDotY + '" r="2" fill="white" opacity="0.9"/>' : '')
        + '</svg>'
        + '<div class="sl-dial-center">'
        + '  <div class="sl-temp-lbl">' + tr.tempLabel + '</div>'
        + '  <div class="sl-temp-val" id="live-cur-temp" style="color:' + acTempColor(curTemp) + ';text-shadow:0 0 30px ' + acTempColor(curTemp) + ',0 0 60px ' + acTempColor(curTemp) + '">' + curTempDisp + '<span style="font-size:22px;font-weight:400;vertical-align:super;line-height:0">°</span></div>'
        + '  <div class="sl-temp-feel" id="live-comfort">' + comfortTxt + '</div>'
        + '</div>'
        + '</div>'

        // ── Temp control (với fan bên trái, swing bên phải)
        + (function() {
            if (hvac !== 'cool' || !slIsOn) return '';
            var slEta = this._calcEta(this._activeIdx, setTemp, curTemp, fanMode);
            if (!slEta) return '';
            var lang2 = cfg.language || 'vi';
            var prefix2 = slEta.mode === 'estimated' ? '⏱~ ' : '⏱ ';
            var etaTxt2 = lang2 === 'vi'
              ? prefix2 + 'Dự kiến đạt ' + setTempDisp + degSym + ' trong ' + slEta.eta + ' phút'
              : prefix2 + 'Est. ' + setTempDisp + degSym + ' in ' + slEta.eta + ' min';
            return '<div class="eta-bar-sl" id="live-eta">' + etaTxt2 + '</div>';
          }).call(this)
        + '<div class="sl-temp-ctrl">'
        + (slShowFan ? (
            '  <button class="sl-mini-btn sl-mini-btn--inline sl-fan-inline" id="sl-btn-fan-sl" type="button">'
          + '    <span class="sl-mini-btn-ico">&#128168;</span>'
          + '    <span class="sl-mini-btn-val">' + slFanLabel + '</span>'
          + '  </button>'
        ) : '')
        + '  <button class="sl-temp-btn" id="sl-btn-temp-down">&#8722;</button>'
        + '  <span class="sl-temp-set" id="live-set-temp">' + setTempDisp + '<span style="font-size:0.55em;vertical-align:super;">' + degSym + '</span></span>'
        + '  <button class="sl-temp-btn" id="sl-btn-temp-up">+</button>'
        + (slShowSwing ? (
            '  <button class="sl-mini-btn sl-mini-btn--inline sl-swing-inline" id="sl-btn-swing-sl" type="button">'
          + '    <span class="sl-mini-btn-ico">&#8644;</span>'
          + '    <span class="sl-mini-btn-val">' + slSwingLabel + '</span>'
          + '  </button>'
        ) : '')
        + '</div>'

        // ── Bottom controls: mode + room (scale ra hết card)
        + '<div class="sl-controls">'
        + '  <div class="sl-mode-wrap">'
        + '    <div class="sl-select-lbl">&#9881; ' + (tr.modeLabel || 'MODE') + '</div>'
        + (cfg.popup_style === 'effect' || cfg.popup_style === 'wave'
          ? (    '    <button class="sl-room-btn" id="sl-mode-btn" type="button">'
               + '      <span class="sl-room-btn-txt" id="sl-mode-btn-txt">' + (MODE_CFG[hvac] ? ((MODE_CFG[hvac].icon && MODE_CFG[hvac].icon.indexOf('mdi:') === 0 ? '<ha-icon icon="' + MODE_CFG[hvac].icon + '" style="--mdc-icon-size:16px;--mdc-icon-color:' + MODE_CFG[hvac].color + ';width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;color:' + MODE_CFG[hvac].color + '"></ha-icon>' : '<span style="font-size:13px;line-height:1;vertical-align:middle">' + MODE_CFG[hvac].icon + '</span>') + ' ' + (tr.modes[hvac] || MODE_CFG[hvac].lbl)) : (tr.modes['off'] || 'Off')) + '</span>'
               + '      <svg class="sl-room-btn-arrow" id="sl-mode-btn-arrow" viewBox="0 0 10 6" fill="rgba(255,255,255,0.5)"><path d="M0 0l5 6 5-6z"/></svg>'
               + '    </button>')
          : (    '    <select class="sl-select' + (hvac !== 'off' ? ' sl-mode-active' : '') + '" id="sl-mode-select">'
               + slModeOptions
               + '    </select>'))
        + '  </div>'
        + '  <div class="sl-room-wrap" style="position:relative">'
        + '    <div class="sl-select-lbl">&#127968; ' + tr.selectRoom + '</div>'
        + (cfg.popup_style === 'effect' || cfg.popup_style === 'wave'
          ? (    '    <button class="sl-room-btn" id="sl-room-btn" type="button">'
               + '      <span class="sl-room-btn-txt" id="sl-room-btn-txt">' + slRoomBtnLabel + '</span>'
               + '      <svg class="sl-room-btn-arrow" id="sl-room-btn-arrow" viewBox="0 0 10 6" fill="rgba(255,255,255,0.5)"><path d="M0 0l5 6 5-6z"/></svg>'
               + '    </button>')
          : (    '    <select class="sl-select" id="sl-room-select">'
               + (function() {
                   var opts = '';
                   for (var ri = 0; ri < ROOMS.length; ri++) {
                     var riTemp = parseFloat(this._a(ROOMS[ri].id, 'current_temperature') || 0);
                     var riTempStr = riTemp > 0 ? ' · ' + acFmtTemp(riTemp, tUnit, haUnit) + (tUnit === 'F' ? '°F' : '°') : '';
                     var riHumRaw = parseFloat(this._a(ROOMS[ri].id, 'current_humidity') || this._a(ROOMS[ri].id, 'humidity') || 0);
                     var riEntCfgH = (cfg.entities && cfg.entities[ri]) || {};
                     if (riEntCfgH.humidity_entity && this._hass && this._hass.states[riEntCfgH.humidity_entity]) { var riHumS = parseFloat(this._hass.states[riEntCfgH.humidity_entity].state); if (!isNaN(riHumS)) riHumRaw = riHumS; }
                     var riHumStr = riHumRaw > 0 ? ' · 💧' + Math.round(riHumRaw) + '%' : '';
                     var riIconTxt = ROOMS[ri].icon && ROOMS[ri].icon.indexOf('mdi:') === 0 ? '' : (ROOMS[ri].icon + ' ');
                     opts += '<option value="' + ri + '"' + (ri === this._activeIdx ? ' selected' : '') + '>'
                           + riIconTxt + ROOMS[ri].label + riTempStr + riHumStr + '</option>';
                   }
                   return opts;
                 }).call(this)
               + '    </select>'))
        + '  </div>'
        + '</div>'

        + '</div>' // end sl-body
        + '</div>'; // end card
      var container = this.shadowRoot.getElementById('ac-card-root');
      if (!container) {
        container = document.createElement('div');
        container.id = 'ac-card-root';
        this.shadowRoot.appendChild(container);
      }
      container.innerHTML = '<div class="card-scale-wrap" id="ac-scale-wrap">' + slHtml + '</div>';
      this._initialized = true;
      this._bindSuperLite();
      if (this._applyScale) { var _slSelf = this; requestAnimationFrame(function(){ _slSelf._applyScale(); }); }
      return;
    }
    // ── END SUPER LITE ───────────────────────────────────────────────────────

    // ── Không có <link>/<style> ở đây – đã inject ở connectedCallback
    var isDeepNeon = (cfg.background_preset === 'deep_neon');
    // Áp dụng CSS variables màu tùy chỉnh
    var _customCssVars = '';
    if (cfg.color_temp_val)     _customCssVars += '--cv-temp:' + cfg.color_temp_val + ';';
    if (cfg.color_comfort)      _customCssVars += '--cv-comfort:' + cfg.color_comfort + ';';
    if (cfg.color_mode_active)  _customCssVars += '--cv-mode-active:' + cfg.color_mode_active + ';';
    if (cfg.color_room_on)      _customCssVars += '--cv-room-on:' + cfg.color_room_on + ';';
    if (cfg.color_room_off)     _customCssVars += '--cv-room-off:' + cfg.color_room_off + ';';
    if (cfg.color_status_on)    _customCssVars += '--cv-status-on:' + cfg.color_status_on + ';';
    if (cfg.color_status_off)   _customCssVars += '--cv-status-off:' + cfg.color_status_off + ';';
    if (cfg.color_fan_bar)      _customCssVars += '--cv-fan-bar:' + cfg.color_fan_bar + ';';
    if (cfg.color_dial_arc)     _customCssVars += '--cv-dial-arc:' + cfg.color_dial_arc + ';';
    if (cfg.color_title)        _customCssVars += '--cv-title:' + cfg.color_title + ';';
    if (cfg.color_greet_sub)    _customCssVars += '--cv-greet-sub:' + cfg.color_greet_sub + ';';
    if (cfg.color_greet_name)   _customCssVars += '--cv-greet-name:' + cfg.color_greet_name + ';';
    if (cfg.color_dial_lbl)     _customCssVars += '--cv-dial-lbl:' + cfg.color_dial_lbl + ';';
    if (cfg.color_temp_set)     _customCssVars += '--cv-temp-set:' + cfg.color_temp_set + ';';
    if (cfg.color_eta)          _customCssVars += '--cv-eta:' + cfg.color_eta + ';';
    if (cfg.color_mode_lbl)     _customCssVars += '--cv-mode-lbl:' + cfg.color_mode_lbl + ';';
    if (cfg.color_fc_label)     _customCssVars += '--cv-fc-label:' + cfg.color_fc_label + ';';
    if (cfg.color_fc_val)       _customCssVars += '--cv-fc-val:' + cfg.color_fc_val + ';';
    if (cfg.color_swing_lbl)    _customCssVars += '--cv-swing-lbl:' + cfg.color_swing_lbl + ';';
    if (cfg.color_power_lbl)    _customCssVars += '--cv-power-lbl:' + cfg.color_power_lbl + ';';
    if (cfg.color_timer_lbl)    _customCssVars += '--cv-timer-lbl:' + cfg.color_timer_lbl + ';';
    if (cfg.color_alloff_lbl)   _customCssVars += '--cv-alloff-lbl:' + cfg.color_alloff_lbl + ';';
    if (cfg.color_room_header)  _customCssVars += '--cv-room-header:' + cfg.color_room_header + ';';
    if (cfg.color_room_name)    _customCssVars += '--cv-room-name:' + cfg.color_room_name + ';';
    if (cfg.color_st_title)     _customCssVars += '--cv-st-title:' + cfg.color_st_title + ';';
    if (cfg.color_st_sub)       _customCssVars += '--cv-st-sub:' + cfg.color_st_sub + ';';
    var html = '<div class="card' + (isLite ? ' card--lite' : '') + (isDeepNeon ? ' card--deep-neon' : '') + '" style="--accent:' + mode.color + ';--glow:' + mode.glow + ';background:' + bgGrad + ';' + _customCssVars + '">'
+ '<div class="left' + (isLite ? ' left--lite' : '') + '">'

+ '<div class="hdr">'
+ '  <div class="hdr-brand">'
+ '    <div class="hdr-ico">' + (mode.icon && mode.icon.indexOf('mdi:') === 0 ? '<ha-icon icon="' + mode.icon + '" style="--mdc-icon-size:22px;--mdc-icon-color:' + mode.color + ';width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;color:' + mode.color + '"></ha-icon>' : '<span style="font-size:20px;line-height:1;color:' + mode.color + '">' + mode.icon + '</span>') + '</div>'
+ '    <div><div class="hdr-title">' + tr.cardTitle + '</div><div class="hdr-sub">' + tr.cardSub + '</div></div>'
+ '  </div>'
+ '  <div class="hdr-icons">'
+ '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + wifiColor + '" stroke-width="1.8" style="filter:' + wifiGlow + ';transition:all 0.4s"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>'
+ '    <button id="btn-gear" style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;line-height:0">'
+ '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
+ '    </button>'
+ '  </div>'
+ '</div>'
+ '<div class="greet-row">'
+ '  <div style="' + (cfg.show_greet === false ? 'visibility:hidden;' : '') + '">'
+ '    <div class="greet-sub">' + tr.greet() + '</div>'
+ '    <div class="greet-name">' + (cfg.owner_name || 'Smart Home') + '</div>'
+ '  </div>'
+ '  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'
+ '    <div class="hdr-vs-row">'
+ '      <button class="hdr-vs-btn' + (!isLite ? ' hdr-vs-btn--active' : '') + '" id="hdr-vs-full" title="Full"><svg width="20" height="8" viewBox="0 0 20 8"><circle cx="2" cy="4" r="2.2" fill="currentColor"/><circle cx="10" cy="4" r="2.2" fill="currentColor"/><circle cx="18" cy="4" r="2.2" fill="currentColor"/></svg></button>'
+ '      <button class="hdr-vs-btn' + (isLite ? ' hdr-vs-btn--active' : '') + '" id="hdr-vs-lite" title="Lite"><svg width="14" height="8" viewBox="0 0 14 8"><circle cx="2" cy="4" r="2.2" fill="currentColor"/><circle cx="10" cy="4" r="2.2" fill="currentColor"/></svg></button>'
+ '      <button class="hdr-vs-btn" id="hdr-vs-superlite" title="Super Lite"><svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="2.2" fill="currentColor"/></svg></button>'
+ '    </div>'
+ '  </div>'
+ '</div>'

+ '<div class="dial-wrap" id="dial-wrap-main">'
+ '<div id="cool-dial-center-marker" style="position:absolute;top:50%;left:50%;width:1px;height:1px;pointer-events:none;z-index:0"></div>'
+ '<svg width="220" height="220" viewBox="0 0 220 220" style="overflow:visible">'
+ '<defs>'
+ '<filter id="arcGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
+ '<filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
+ '<filter id="innerArcGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
+ '<linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">'
+ (cfg.color_dial_arc
    ? '<stop offset="0%" stop-color="' + cfg.color_dial_arc + '"/><stop offset="100%" stop-color="' + cfg.color_dial_arc + '"/>'
    : '<stop offset="0%" stop-color="#3b9eff"/><stop offset="50%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#f59e0b"/>')
+ '</linearGradient>'
+ '<radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">'
+ '<stop offset="0%" stop-color="' + mode.color + '" stop-opacity="0.25"/>'
+ '<stop offset="100%" stop-color="' + mode.color + '" stop-opacity="0"/>'
+ '</radialGradient>'
+ '</defs>'
+ '<circle cx="110" cy="110" r="72" fill="rgba(180,220,255,0.25)" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>'
+ '<circle cx="110" cy="110" r="68" fill="url(#innerGlow)"/>'
+ '<path d="' + arcTrack + '" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" stroke-linecap="round"/>'
+ ticks
+ arcFillSvg
+ dotSvg
+ '<path d="' + innerTrack + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/>'
+ (setPct > 0.02 ? '<path d="' + innerArcFill + '" fill="none" stroke="' + mode.color + '" stroke-width="4" stroke-linecap="round" filter="url(#innerArcGlow)" opacity="0.85"/>' : '')
+ (setPct > 0.02 ? '<circle cx="' + innerSetDotX + '" cy="' + innerSetDotY + '" r="4" fill="' + mode.color + '" filter="url(#innerArcGlow)"/><circle cx="' + innerSetDotX + '" cy="' + innerSetDotY + '" r="2" fill="white" opacity="0.9"/>' : '')
+ '</svg>'
+ '<div class="dial-center">'
+ '  <div class="dial-lbl">' + tr.tempLabel + '</div>'
+ '  <div class="dial-temp" id="live-cur-temp" style="color:' + acTempColor(curTemp) + ';text-shadow:0 0 30px ' + acTempColor(curTemp) + ',0 0 60px ' + acTempColor(curTemp) + '">' + curTempDisp + '<span class="dial-deg">&#176;</span></div>'
+ '  <div class="dial-feel" id="live-comfort">' + comfortTxt + '</div>'
+ '</div>'
+ '</div>'

+ '<div class="temp-ctrl">'
+ '  <button class="temp-btn" id="btn-temp-down">&#8722;</button>'
+ '  <span class="temp-set" id="live-set-temp">' + setTempDisp + '<span style="font-size:0.55em;vertical-align:super;">' + degSym + '</span></span>'
+ '  <button class="temp-btn" id="btn-temp-up">+</button>'
+ '</div>'
+ (function() {
    if (hvac !== 'cool' || !isOn) return '';
    var eta = this._calcEta(this._activeIdx, setTemp, curTemp, fanMode);
    if (!eta) return '';
    var lang2 = cfg.language || 'vi';
    var prefix = eta.mode === 'estimated' ? '⏱~ ' : '⏱ ';
    var etaTxt = lang2 === 'vi'
      ? prefix + 'Dự kiến đạt ' + setTempDisp + degSym + ' trong ' + eta.eta + ' phút'
      : prefix + 'Est. ' + setTempDisp + degSym + ' in ' + eta.eta + ' min';
    var tipTxt = eta.mode === 'estimated' ? 'title="Ước tính theo tốc độ quạt, sẽ chính xác hơn khi có dữ liệu thực tế"' : '';
    return '<div class="eta-bar" id="live-eta" ' + tipTxt + '>' + etaTxt + '</div>';
  }).call(this)

+ (modeBtns ? '<div class="mode-grid">' + modeBtns + '</div>' : '')

+ ((cfg.show_fan !== false || cfg.show_swing !== false) ? (
  '<div class="fan-swing-row">'
+ (cfg.show_fan !== false ? (
  '  <div class="fan-card">'
+ '    <div class="fc-head"><span class="fc-label">' + tr.fanLabel + '</span><span class="fc-val">' + (function(){ var _fIdx = FAN_LEVELS.indexOf(fanMode); return (_fIdx >= 0 && _fIdx < fanLabels.length) ? fanLabels[_fIdx] : fanMode; })() + '</span></div>'
+ '    <button class="fan-tap" id="btn-fan-cycle">'
+ '      <span class="fan-ico">' + fanIconSvg + '</span>'
+ '      <div class="fan-bars">' + fanBarHtml + '</div>'
+ '    </button>'
+ '  </div>'
) : '')
+ (cfg.show_swing !== false ? (
  '  <div class="swing-card">'
+ '    <div class="fc-head"><span class="fc-label">' + tr.swingLabel + '</span></div>'
+ '    ' + swingBtn
+ '  </div>'
) : '')
+ '</div>'
) : '')

+ (!isLite && this._config.show_preset_bar !== false ? (
  '<div class="chips">'
+ '  <button id="btn-eco-chip" class="chip ' + (ecoOn ? 'chip--g' : '') + '">&#127807; Eco</button>'
+ '  <button class="chip chip--a">&#11088; Fav</button>'
+ '  <button class="chip chip--b">&#10024; Clean</button>'
+ '</div>'
) : '')

+ (isLite ? '' : (
  '<div class="bottom-row">'
+ '<button class="power-row" id="btn-power">'
+ '  <div class="pw-btn ' + pwClass + '">&#9211;</div>'
+ '  <div style="flex:1;min-width:0">'
+ '    <div class="pw-sub pw-sub--big">' + pwSub + '</div>'
+ '  </div>'
+ '  <span class="pw-arrow">&#8250;</span>'
+ '</button>'
+ (cfg.show_timer !== false ? (
  '<button class="timer-btn' + (this._timers[this._activeIdx] ? ' timer-btn--active' : '') + '" id="btn-timer-left">'
+ '  <span class="timer-ico">&#9200;</span>'
+ '  <span class="timer-lbl">' + tr.timerBtn + '</span>'
+ '  <span class="timer-cd" id="timer-cd">' + (this._timers[this._activeIdx] ? this._fmtRemain(this._activeIdx) : '') + '</span>'
+ '</button>'
) : '')
+ '</div>'
))

+ '</div>'  // end .left

+ '<div class="right' + (isLite ? ' right--lite' : '') + '">'

+ (isLite ? '' : (
  '<div class="room-image">'
+ '  <img id="room-photo" class="room-img-el" src="' + (room.image || ROOM_IMAGES[this._activeIdx] || ROOM_IMAGES[0]) + '" alt="room">'
+ '  <div class="ac-overlay">'
+ '    <span class="ac-led ' + (isOn ? 'led-on' : 'led-off') + '"></span>'
+ '    <span class="ac-overlay-txt">' + (isOn ? tr.overlayOn : tr.overlayOff) + '</span>'
+ modeChip
+ '  </div>'
+ '  <div class="img-temp-badge" style="color:' + acTempColor(curTemp) + ';text-shadow:0 0 18px ' + acTempColor(curTemp) + ',0 0 40px ' + acTempColor(curTemp) + ',0 2px 20px rgba(0,0,0,0.7)">' + curTempDisp + '<span>' + degSym + '</span>'
+ (roomHumidityRaw > 0 ? '<span style="font-family:\'Sora\',sans-serif;font-size:13px;font-weight:500;opacity:0.75;margin-left:6px;vertical-align:middle;">💧' + Math.round(roomHumidityRaw) + '%</span>' : '')
+ '</div>'
+ '  <div class="img-room-name">' + room.label + '</div>'
+ '</div>'
))

+ (cfg.show_status !== false ? (
  '<div class="status-block">'
+ '  <div class="status-header">'
+ '    <div>'
+ '      <div class="st-title">' + tr.statusLabel + '</div>'
+ '      <div class="' + (isOn ? 'st-on' : 'st-off') + '">' + (isOn ? tr.statusOn : tr.statusOff) + '</div>'
+ '      <div class="st-sub">' + (isOn ? tr.airGood : tr.pressOn) + '</div>'
+ '    </div>'
+ '    <div class="pm-ring"><div class="pm-val">' + pm25Val + '</div><div class="pm-unit">' + tr.dustLabel + '</div></div>'
+ '  </div>'
+ '  <div class="metrics">'
+ (cfg.show_outdoor_temp !== false ? '    <div class="met"><span class="met-ico">&#127777;</span><span class="met-val" id="met-outdoor-temp">' + outdoorTempVal + '</span></div>' : '')
+ (cfg.show_humidity !== false     ? '    <div class="met"><span class="met-ico">&#128167;</span><span class="met-val" id="met-humidity">' + humidityVal + '</span></div>' : '')
+ (cfg.show_power !== false        ? '    <div class="met"><span class="met-ico">&#9889;</span><span class="met-val" id="met-power">' + powerVal + '</span></div>' : '')
+ '  </div>'
+ '</div>'
) : '')

+ '<div class="room-tabs"><div class="rt-header">' + tr.selectRoom + '</div><div class="room-tabs-inner' + (ROOMS.length >= 5 ? ' scrollable' : '') + '">' + roomTabs + '</div></div>'

+ (isLite ? (
  '<div class="lite-bottom">'
+ '<button class="power-row power-row--lite" id="btn-power-lite">'
+ '  <div class="pw-btn ' + pwClass + '">&#9211;</div>'
+ '  <div style="flex:1;min-width:0"><div class="pw-sub pw-sub--big">' + pwSub + '</div></div>'
+ '  <span class="pw-arrow">&#8250;</span>'
+ '</button>'
+ '<div class="lite-bottom-row">'
+ (cfg.show_all_off !== false ? (
  '<button class="lite-small-btn lite-small-btn--alloff" id="btn-all-off-lite">'
+ '  <span class="lsb-ico">&#9211;</span>'
+ '  <span class="lsb-lbl">' + tr.allOff + '</span>'
+ '</button>'
) : '')
+ (cfg.show_timer !== false ? (
  '<button class="lite-small-btn' + (this._timers[this._activeIdx] ? ' lite-small-btn--timer-active' : '') + '" id="btn-timer">'
+ '  <span class="lsb-ico">&#9200;</span>'
+ '  <span class="lsb-lbl">' + tr.timerBtn + '</span>'
+ '  <span class="lsb-cd" id="timer-cd">' + (this._timers[this._activeIdx] ? this._fmtRemain(this._activeIdx) : '') + '</span>'
+ '</button>'
) : '')
+ '</div>'
+ '</div>'
) : (
  (cfg.show_all_off !== false ? (
  '<button class="all-off-btn" id="btn-all-off">'
+ '  <div class="all-off-ico">&#9211;</div>'
+ '  <div class="all-off-info">'
+ '    <div class="all-off-title">' + tr.allOff + '</div>'
+ '    <div class="all-off-sub">' + tr.allOffSub + '</div>'
+ '  </div>'
+ '  <div class="all-off-arr">&#8250;</div>'
+ '</button>'
  ) : '')
))

+ '</div>'  // end .right
+ '</div>'; // end .card

    // ── FIX: Chỉ cập nhật phần nội dung, không đụng vào <style> và <link> đã inject
    var container = this.shadowRoot.getElementById('ac-card-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ac-card-root';
      this.shadowRoot.appendChild(container);
    }
    container.innerHTML = '<div class="card-scale-wrap" id="ac-scale-wrap">' + html + '</div>';

    this._initialized = true;
    this._bind();
    this._startClock();
    if (this._applyScale) { var _asSelf = this; requestAnimationFrame(function(){ _asSelf._applyScale(); }); }

    // Kích hoạt / dừng animation cool trail
    this._updateCoolAnim();
    // Kích hoạt / dừng animation fan wind
    this._updateFanAnim();
    // Kích hoạt / dừng animation heat flame
    this._updateHeatAnim();
    // Kích hoạt / dừng animation dry mist
    this._updateDryAnim();
  }

  _updateCoolAnim() {
    var room = ROOMS[this._activeIdx];
    var hvac = room && this._hass && this._hass.states[room.id]
      ? (this._hass.states[room.id].attributes.hvac_mode || this._hass.states[room.id].state)
      : null;
    if (hvac === 'cool') {
      // Chỉ start nếu chưa chạy — KHÔNG restart khi card re-render
      if (!this._coolAnimRunning) this._startCoolTrailAnim();
      // Nếu đang chạy rồi thì giữ nguyên, không làm gì
    } else {
      this._stopCoolTrailAnim();
    }
  }

  _bind() {
    var self = this;
    var r = this.shadowRoot;

    function onTap(el, fn) {
      if (!el) return;
      var tapped = false;
      el.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        tapped = true;
        fn(e);
      }, { passive: false });
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        if (tapped) { tapped = false; return; }
        fn(e);
      });
    }

    function onTapAll(els, fn) {
      els.forEach(function(b) { onTap(b, function(e) { fn(b, e); }); });
    }

    onTap(r.getElementById('btn-temp-up'), function() {
      var id = ROOMS[self._activeIdx].id;
      self._call('climate','set_temperature',{entity_id:id, temperature: parseFloat(self._a(id,'temperature')||24)+1});
    });

    onTap(r.getElementById('btn-temp-down'), function() {
      var id = ROOMS[self._activeIdx].id;
      self._call('climate','set_temperature',{entity_id:id, temperature: Math.max(16, parseFloat(self._a(id,'temperature')||24)-1)});
    });

    onTapAll(r.querySelectorAll('[data-hvac]'), function(b) {
      var _hvacId = ROOMS[self._activeIdx].id;
      var _newMode = b.dataset.hvac;
      // Nếu chọn mode khác off → lưu làm "chế độ cuối cùng" để bật lại sau
      if (_newMode && _newMode !== 'off') self._hvacModeSave(_hvacId, _newMode);
      self._call('climate','set_hvac_mode',{entity_id:_hvacId, hvac_mode:_newMode});
    });

    onTapAll(r.querySelectorAll('[data-fan]'), function(b) {
      self._call('climate','set_fan_mode',{entity_id:ROOMS[self._activeIdx].id, fan_mode:b.dataset.fan});
    });

    onTap(r.getElementById('btn-power'), function() {
      var id = ROOMS[self._activeIdx].id;
      var curState = self._s(id);
      if (curState !== 'off') {
        // Lưu chế độ hiện tại vào localStorage trước khi tắt
        self._hvacModeSave(id, curState);
        self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode:'off'});
      } else {
        // Bật lại: ưu tiên climate.turn_on để tôn trọng mode hệ thống (Mitsubishi City Multi, v.v.)
        self._turnOn(id);
      }
    });

    onTap(r.getElementById('btn-gear'), function() {
      var entityId = ROOMS[self._activeIdx].id;
      self.dispatchEvent(new CustomEvent('hass-more-info', {
        bubbles: true, composed: true,
        detail: { entityId: entityId }
      }));
    });

    // View mode switcher (full/lite header)
    onTap(r.getElementById('hdr-vs-full'), function() {
      self._config = Object.assign({}, self._config, { view_mode: 'full' });
      self._renderFull();
    });
    onTap(r.getElementById('hdr-vs-lite'), function() {
      self._config = Object.assign({}, self._config, { view_mode: 'lite' });
      self._renderFull();
    });
    onTap(r.getElementById('hdr-vs-superlite'), function() {
      self._config = Object.assign({}, self._config, { view_mode: 'super_lite' });
      self._renderFull();
    });

    var ecoFn = function() {
      var id = ROOMS[self._activeIdx].id;
      self._call('climate','set_preset_mode',{entity_id:id, preset_mode: self._a(id,'preset_mode')==='eco'?'none':'eco'});
    };
    onTap(r.getElementById('btn-eco'), ecoFn);
    onTap(r.getElementById('btn-eco-chip'), ecoFn);

    onTap(r.getElementById('btn-fan-cycle'), function() {
      var id = ROOMS[self._activeIdx].id;
      var cur = self._a(id,'fan_mode') || 'auto';
      var supported = self._a(id,'fan_modes');
      var levels = (Array.isArray(supported) && supported.length > 0) ? supported : FAN_LEVELS;
      var idx = levels.indexOf(cur);
      var next = levels[(idx + 1) % levels.length];
      self._call('climate','set_fan_mode',{entity_id:id, fan_mode:next});
    });

    onTap(r.getElementById('btn-swing'), function() {
      var id = ROOMS[self._activeIdx].id;
      var cur = self._a(id,'swing_mode') || 'off';
      // Chỉ dùng swing_modes thực tế của entity — tránh hiển thị/cycle các mode không hỗ trợ
      var supported = self._a(id,'swing_modes');
      var levels = (Array.isArray(supported) && supported.length > 0) ? supported : SWING_LEVELS;
      var idx = levels.indexOf(cur);
      // Nếu mode hiện tại không nằm trong danh sách hỗ trợ (idx = -1) → về đầu danh sách
      // thay vì bị stuck tại mode không hợp lệ
      var next = idx >= 0 ? levels[(idx + 1) % levels.length] : levels[0];
      self._call('climate','set_swing_mode',{entity_id:id, swing_mode:next});
    });

    // btn-power-lite (lite mode) — same action as btn-power
    onTap(r.getElementById('btn-power-lite'), function() {
      var id = ROOMS[self._activeIdx].id;
      var curState2 = self._hass && self._hass.states[id] && self._hass.states[id].state;
      if (curState2 && curState2 !== 'off') {
        self._hvacModeSave(id, curState2);
        self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode:'off'});
      } else {
        self._turnOn(id);
      }
    });

    // all-off lite (same logic, different element id)
    var allOffLiteHandler = function() {
      var sr2 = self.shadowRoot;
      var allOffBtn = r.getElementById('btn-all-off-lite') || r.getElementById('btn-all-off');
      var oldP = sr2.getElementById('confirm-popup-el');
      if (oldP) { oldP.remove(); return; }
      var cpop = document.createElement('div');
      cpop.id = 'confirm-popup-el';
      cpop.className = 'confirm-popup';
      var rect2 = allOffBtn.getBoundingClientRect();
      cpop.style.bottom = (window.innerHeight - rect2.top + 10) + 'px';
      cpop.style.right  = (window.innerWidth  - rect2.right + 12) + 'px';
      var trPop = AC_TRANSLATIONS[(self._config && self._config.language) || 'vi'] || AC_TRANSLATIONS.vi;
      cpop.innerHTML =
        '<div class="cp-title">' + trPop.confirmOff + '</div>'
        + '<div class="cp-sub">' + trPop.confirmSub(ROOMS.length) + '</div>'
        + '<div class="cp-acts">'
        + '<button class="cp-cancel" id="cp-cancel-btn">' + trPop.cancel + '</button>'
        + '<button class="cp-ok" id="cp-ok-btn">' + trPop.doOff + '</button>'
        + '</div>';
      sr2.appendChild(cpop);
      cpop.querySelector('#cp-cancel-btn').onclick = function(ev) { ev.stopPropagation(); cpop.remove(); };
      cpop.querySelector('#cp-ok-btn').onclick = function(ev) {
        ev.stopPropagation();
        ROOMS.forEach(function(room) { self._call('climate','set_hvac_mode',{entity_id:room.id, hvac_mode:'off'}); });
        cpop.remove();
      };
      self._confirmJustOpened = true;
      setTimeout(function() { self._confirmJustOpened = false; }, 80);
      function outsideConfirmLite(ev) {
        if (self._confirmJustOpened) return;
        var path = ev.composedPath ? ev.composedPath() : [];
        if (path.indexOf(cpop) === -1 && path.indexOf(allOffBtn) === -1) {
          cpop.remove();
          document.removeEventListener('click',    outsideConfirmLite, true);
          document.removeEventListener('touchend', outsideConfirmLite, true);
        }
      }
      document.addEventListener('click',    outsideConfirmLite, true);
      document.addEventListener('touchend', outsideConfirmLite, true);
    };
    onTap(r.getElementById('btn-all-off-lite'), allOffLiteHandler);

    onTap(r.getElementById('btn-all-off'), function() {
      var sr2 = self.shadowRoot;
      var allOffBtn = r.getElementById('btn-all-off');
      var oldP = sr2.getElementById('confirm-popup-el');
      if (oldP) { oldP.remove(); return; }
      var cpop = document.createElement('div');
      cpop.id = 'confirm-popup-el';
      cpop.className = 'confirm-popup';
      var rect2 = allOffBtn.getBoundingClientRect();
      cpop.style.bottom = (window.innerHeight - rect2.top + 10) + 'px';
      cpop.style.right  = (window.innerWidth  - rect2.right + 12) + 'px';
      var trPop = AC_TRANSLATIONS[(self._config && self._config.language) || 'vi'] || AC_TRANSLATIONS.vi;
      cpop.innerHTML =
        '<div class="cp-title">' + trPop.confirmOff + '</div>'
        + '<div class="cp-sub">' + trPop.confirmSub(ROOMS.length) + '</div>'
        + '<div class="cp-acts">'
        + '<button class="cp-cancel" id="cp-cancel-btn">' + trPop.cancel + '</button>'
        + '<button class="cp-ok" id="cp-ok-btn">' + trPop.doOff + '</button>'
        + '</div>';
      sr2.appendChild(cpop);
      cpop.querySelector('#cp-cancel-btn').onclick = function(ev) { ev.stopPropagation(); cpop.remove(); };
      cpop.querySelector('#cp-ok-btn').onclick = function(ev) {
        ev.stopPropagation();
        ROOMS.forEach(function(room) { self._call('climate','set_hvac_mode',{entity_id:room.id, hvac_mode:'off'}); });
        cpop.remove();
      };
      self._confirmJustOpened = true;
      setTimeout(function() { self._confirmJustOpened = false; }, 80);
      function outsideConfirm(ev) {
        if (self._confirmJustOpened) return;
        var path = ev.composedPath ? ev.composedPath() : [];
        if (path.indexOf(cpop) === -1 && path.indexOf(allOffBtn) === -1) {
          cpop.remove();
          document.removeEventListener('click',    outsideConfirm, true);
          document.removeEventListener('touchend', outsideConfirm, true);
        }
      }
      document.addEventListener('click',    outsideConfirm, true);
      document.addEventListener('touchend', outsideConfirm, true);
    });

    onTapAll(r.querySelectorAll('[data-room]'), function(b) {
      var newIdx = parseInt(b.dataset.room);
      if (newIdx === self._activeIdx) return;
      var img = r.getElementById('room-photo');
      if (img) {
        img.classList.add('fade-out');
        setTimeout(function() { self._activeIdx = newIdx; self._renderFull(); }, 300);
      } else {
        self._activeIdx = newIdx; self._renderFull();
      }
    });

    // ── Tooltip phòng: inject vào document.body để thoát khỏi overflow:hidden ──
    // CSS nằm trong Shadow DOM không apply được ra body → dùng inline style
    if (!self._acTip) {
      var tip = document.createElement('div');
      tip.id = 'ac-room-tip-' + Math.random().toString(36).slice(2);
      tip.style.cssText = [
        'position:fixed',
        'z-index:99999',
        'pointer-events:none',
        'background:rgba(6,10,28,0.96)',
        'border:1px solid rgba(255,255,255,0.18)',
        'border-radius:12px',
        'padding:8px 14px',
        'max-width:260px',
        'white-space:normal',
        'line-height:1.55',
        'font-size:11px',
        'font-weight:500',
        "font-family:'Sora',sans-serif",
        'box-shadow:0 6px 28px rgba(0,0,0,0.7)',
        'opacity:0',
        'transition:opacity 0.2s ease',
        'display:none',
        'backdrop-filter:blur(12px)',
        '-webkit-backdrop-filter:blur(12px)',
      ].join(';');
      document.body.appendChild(tip);
      self._acTip = tip;
    }
    var _acTip = self._acTip;
    // Timer ID để auto-ẩn tooltip sau 5s — lưu trên self để clear được khi re-render
    if (!self._tipAutoHideTimer) self._tipAutoHideTimer = null;
    if (!self._tipFadeTimer)     self._tipFadeTimer     = null;

    function _clearTipTimers() {
      if (self._tipAutoHideTimer) { clearTimeout(self._tipAutoHideTimer); self._tipAutoHideTimer = null; }
      if (self._tipFadeTimer)     { clearTimeout(self._tipFadeTimer);     self._tipFadeTimer     = null; }
    }

    function _hideTipNow() {
      _clearTipTimers();
      _acTip.style.opacity = '0';
      self._tipFadeTimer = setTimeout(function() { _acTip.style.display = 'none'; }, 200);
    }

    function _showRoomTip(btn) {
      var msg = btn.dataset.tip;
      if (!msg) { _hideTipNow(); return; }
      // Hủy timer cũ trước khi show lại (tránh nháy)
      _clearTipTimers();
      var color = btn.dataset.tipColor || '#fff';
      _acTip.textContent = msg;
      _acTip.style.color = color;
      _acTip.style.display = 'block';
      _acTip.style.opacity = '0';
      // Định vị tooltip — ưu tiên bên phải button, fallback bên trái
      var rect = btn.getBoundingClientRect();
      var tipTop  = rect.top + rect.height / 2;
      var tipLeft = rect.right + 12;
      _acTip.style.top       = tipTop + 'px';
      _acTip.style.left      = tipLeft + 'px';
      _acTip.style.transform = 'translateY(-50%)';
      // Dùng double rAF để đảm bảo display:block đã được paint xong trước khi đọc offsetWidth
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          var tw = _acTip.offsetWidth || 220;
          if (tipLeft + tw > window.innerWidth - 8) {
            _acTip.style.left = (rect.left - tw - 12) + 'px';
          }
          _acTip.style.opacity = '1';
          // Auto-ẩn sau 5 giây (mobile: không có mouseleave)
          _clearTipTimers();
          self._tipAutoHideTimer = setTimeout(function() { _hideTipNow(); }, 5000);
        });
      });
    }

    r.querySelectorAll('[data-room]').forEach(function(btn) {
      // Desktop: hover bình thường
      btn.addEventListener('mouseenter', function() { _showRoomTip(btn); });
      btn.addEventListener('mouseleave', function() { _hideTipNow(); });
      // Mobile: touchstart show tooltip, KHÔNG gọi _hideTipNow ngay lập tức
      // Timer 5s sẽ tự ẩn — tránh race condition nháy loạn
      btn.addEventListener('touchstart', function(e) {
        // Chỉ show tooltip, không can thiệp vào logic chọn phòng
        _showRoomTip(btn);
      }, { passive: true });
    });

    this._bindTimer();
  }

  _bindSuperLite() {
    var self = this;
    var r = this.shadowRoot;

    function onTapSL(el, fn) {
      if (!el) return;
      var tapped = false;
      el.addEventListener('touchstart', function(e) { e.preventDefault(); tapped = true; fn(e); }, { passive: false });
      el.addEventListener('click', function(e) { e.stopPropagation(); if (tapped) { tapped = false; return; } fn(e); });
    }

    // Temp up/down
    onTapSL(r.getElementById('sl-btn-temp-up'), function() {
      var id = ROOMS[self._activeIdx].id;
      self._call('climate','set_temperature',{entity_id:id, temperature: parseFloat(self._a(id,'temperature')||24)+1});
    });
    onTapSL(r.getElementById('sl-btn-temp-down'), function() {
      var id = ROOMS[self._activeIdx].id;
      self._call('climate','set_temperature',{entity_id:id, temperature: Math.max(16, parseFloat(self._a(id,'temperature')||24)-1)});
    });

    // Fan dropdown popup (Super Lite)
    var slFanPopupEl = null;
    function closeSlFanPopup() {
      if (slFanPopupEl && slFanPopupEl.parentNode) { slFanPopupEl.parentNode.removeChild(slFanPopupEl); slFanPopupEl = null; }
      var ov = document.getElementById('sl-fan-overlay-global'); if (ov) ov.parentNode.removeChild(ov);
    }
    function openSlFanPopup() {
      if (slFanPopupEl) { closeSlFanPopup(); return; }
      var lang2   = (self._config && self._config.language) || 'vi';
      var tr2     = AC_TRANSLATIONS[lang2] || AC_TRANSLATIONS.vi;
      var isWave  = (self._config && self._config.popup_style) === 'wave';
      var id      = ROOMS[self._activeIdx].id;
      var curFan  = self._a(id,'fan_mode') || 'auto';
      var rawModes = self._a(id,'fan_modes');
      var modes   = (Array.isArray(rawModes) && rawModes.length > 0) ? rawModes : FAN_LEVELS;
      var fanLbls = tr2.fans || ['Auto','Min','Low','Low-Mid','Medium','High-Mid','High','Max','Low/Auto','High/Auto','Quiet'];

      var overlay = document.createElement('div');
      overlay.id = 'sl-fan-overlay-global';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9990;background:transparent';
      document.body.appendChild(overlay);

      var pop = document.createElement('div');
      pop.style.cssText = [
        'position:fixed','z-index:9999',
        'background:rgba(8,20,48,0.55)',
        'border:1px solid rgba(255,255,255,0.20)',
        'border-top:1px solid rgba(255,255,255,0.35)',
        'border-radius:22px',
        'backdrop-filter:blur(48px) saturate(2) brightness(1.1)',
        '-webkit-backdrop-filter:blur(48px) saturate(2) brightness(1.1)',
        'box-shadow:0 2px 0 rgba(255,255,255,0.15) inset,0 24px 64px rgba(0,0,0,0.55)',
        'overflow:hidden','padding:8px','min-width:160px','font-family:Sora,sans-serif',
        'transform-origin:' + (isWave ? 'bottom center' : 'top center'),
        isWave ? 'animation:slWaveSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both'
               : 'animation:slBubblePop 0.45s cubic-bezier(0.22,1,0.36,1) both',
      ].join(';');
      _slInjectStyles(isWave);

      var itemsHtml = isWave ? '' : '<div class="sl-pop-shimmer"></div>';
      for (var fmi = 0; fmi < modes.length; fmi++) {
        var fmVal   = modes[fmi];
        var fmIdx   = FAN_LEVELS.indexOf(fmVal);
        var fmLbl   = (fmIdx >= 0 && fmIdx < fanLbls.length) ? fanLbls[fmIdx] : fmVal;
        var fmDelay = (fmi * 0.04 + 0.03).toFixed(2) + 's';
        var fmIcon  = fmVal === 'auto' ? '🔄' : fmVal === 'max' ? '💨' : fmVal === 'min' ? '🍃'
                    : fmVal === 'quiet' ? '🌙' : fmVal === 'low/auto' ? '🔄' : fmVal === 'high/auto' ? '💨' : '💨';
        if (isWave) {
          itemsHtml += '<div class="sl-ri sl-ri-wave' + (curFan === fmVal ? ' active' : '') + '" data-fan-val="' + fmVal + '" style="animation-delay:' + fmDelay + '">'
            + '<span style="font-size:18px;line-height:1;width:22px;text-align:center">' + fmIcon + '</span>'
            + '<span style="flex:1">' + fmLbl + '</span>'
            + '<div class="sl-wave-ripple"></div></div>';
        } else {
          itemsHtml += '<div class="sl-ri' + (curFan === fmVal ? ' active' : '') + '" data-fan-val="' + fmVal + '" style="animation-delay:' + fmDelay + '">'
            + '<span style="font-size:18px;line-height:1;width:22px;text-align:center">' + fmIcon + '</span>'
            + '<span style="flex:1">' + fmLbl + '</span></div>';
        }
      }
      pop.innerHTML = itemsHtml;

      var fanBtn = r.getElementById('sl-btn-fan-sl');
      var btnRect = fanBtn ? fanBtn.getBoundingClientRect() : {left:0,right:160,top:0,bottom:40,width:160};
      var popWidth = Math.max(btnRect.width, 160);
      var popLeft  = btnRect.left;
      if (popLeft + popWidth > window.innerWidth - 8) popLeft = window.innerWidth - popWidth - 8;
      if (isWave) { pop.style.bottom = (window.innerHeight - btnRect.top + 6) + 'px'; pop.style.top = 'auto'; }
      else        { pop.style.top    = (btnRect.bottom + 6) + 'px'; }
      pop.style.left = popLeft + 'px';
      pop.style.width = popWidth + 'px';
      document.body.appendChild(pop);
      slFanPopupEl = pop;

      pop.querySelectorAll('[data-fan-val]').forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          if (isWave) _slWaveRipple(item, e);
          var val = item.dataset.fanVal;
          var doCall = function() { self._call('climate','set_fan_mode',{entity_id:id, fan_mode:val}); closeSlFanPopup(); };
          isWave ? setTimeout(doCall, 220) : doCall();
        });
      });
      overlay.addEventListener('click', closeSlFanPopup);
    }
    var slFanBtnEl = r.getElementById('sl-btn-fan-sl');
    if (slFanBtnEl) slFanBtnEl.addEventListener('click', function(e) { e.stopPropagation(); openSlFanPopup(); });
    function onOutsideSlFanClick(e) {
      if (!slFanPopupEl) return;
      if (slFanPopupEl.contains(e.target)) return;
      var fb = r.getElementById('sl-btn-fan-sl'); if (fb && fb.contains(e.target)) return;
      closeSlFanPopup();
    }
    document.addEventListener('click', onOutsideSlFanClick);
    var prevSlCleanup1 = self._slCleanup;
    self._slCleanup = function() { document.removeEventListener('click', onOutsideSlFanClick); closeSlFanPopup(); if (prevSlCleanup1) prevSlCleanup1(); };

    // Swing cycle (Super Lite mini button)
    onTapSL(r.getElementById('sl-btn-swing-sl'), function() {
      var id = ROOMS[self._activeIdx].id;
      var cur = self._a(id,'swing_mode') || 'off';
      // Chỉ cycle trong danh sách swing_modes thực tế của entity
      var supported = self._a(id,'swing_modes');
      var levels = (Array.isArray(supported) && supported.length > 0) ? supported : SWING_LEVELS;
      var idx = levels.indexOf(cur);
      // idx = -1 nghĩa là mode hiện tại không được hỗ trợ → reset về đầu danh sách, không bị stuck
      var next = idx >= 0 ? levels[(idx + 1) % levels.length] : levels[0];
      self._call('climate','set_swing_mode',{entity_id:id, swing_mode:next});
    });

    // Gear → more-info
    onTapSL(r.getElementById('sl-btn-gear'), function() {
      self.dispatchEvent(new CustomEvent('hass-more-info', {
        bubbles: true, composed: true,
        detail: { entityId: ROOMS[self._activeIdx].id }
      }));
    });

    // View mode switcher (super lite)
    onTapSL(r.getElementById('sl-vs-full'), function() {
      self._config = Object.assign({}, self._config, { view_mode: 'full' });
      self._renderFull();
    });
    onTapSL(r.getElementById('sl-vs-lite'), function() {
      self._config = Object.assign({}, self._config, { view_mode: 'lite' });
      self._renderFull();
    });
    onTapSL(r.getElementById('sl-vs-superlite'), function() {
      self._config = Object.assign({}, self._config, { view_mode: 'super_lite' });
      self._renderFull();
    });

    // Mode dropdown (native select — Normal style)
    var modeSelect = r.getElementById('sl-mode-select');
    if (modeSelect) {
      modeSelect.addEventListener('change', function() {
        var id = ROOMS[self._activeIdx].id;
        var newMode = modeSelect.value;
        // Nếu đang tắt → lưu chế độ hiện tại của HVAC trước khi off
        if (newMode === 'off') {
          var curHvac = self._s(id);
          if (curHvac && curHvac !== 'off') self._hvacModeSave(id, curHvac);
        }
        self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode: newMode});
      });
    }

    // Room dropdown (native select — Normal style)
    var roomSelect = r.getElementById('sl-room-select');
    if (roomSelect) {
      roomSelect.addEventListener('change', function() {
        var idx = parseInt(roomSelect.value);
        if (!isNaN(idx) && idx !== self._activeIdx) {
          self._activeIdx = idx;
          self._renderFull();
        }
      });
    }

    // ── Shared style injector (effect + wave keyframes) ──────────────────────
    function _slInjectStyles(isWave) {
      var id = isWave ? 'sl-wave-style' : 'sl-bubble-style';
      if (document.getElementById(id)) return;
      var st = document.createElement('style');
      st.id = id;
      if (isWave) {
        st.textContent = [
          /* popup trượt lên từ dưới */
          '@keyframes slWaveSlideUp{',
          '  0%  {opacity:0;transform:translateY(100%) scaleX(0.85);filter:blur(8px)}',
          '  55% {opacity:1;transform:translateY(-6%) scaleX(1.02);filter:blur(0)}',
          '  75% {transform:translateY(2%) scaleX(0.99)}',
          '  100%{transform:translateY(0) scaleX(1)}',
          '}',
          /* mỗi item sóng vào từ trái, kèm glow sweep */
          '@keyframes slWaveItem{',
          '  0%  {opacity:0;transform:translateX(-24px);filter:blur(4px)}',
          '  60% {opacity:1;transform:translateX(4px);filter:blur(0)}',
          '  80% {transform:translateX(-2px)}',
          '  100%{transform:translateX(0)}',
          '}',
          /* ripple lan ra khi chọn */
          '@keyframes slRippleOut{',
          '  0%  {transform:scale(0);opacity:0.7}',
          '  100%{transform:scale(3.5);opacity:0}',
          '}',
          '.sl-ri{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:14px;',
          '  cursor:pointer;font-family:Sora,sans-serif;font-size:13px;font-weight:600;',
          '  color:rgba(255,255,255,0.88);transition:background 0.15s,transform 0.12s;',
          '  white-space:nowrap;position:relative;overflow:hidden}',
          '.sl-ri-wave{animation:slWaveItem 0.38s cubic-bezier(0.22,1,0.36,1) both}',
          '.sl-ri:hover{background:rgba(255,255,255,0.09);transform:scale(1.01)}',
          '.sl-ri:active{transform:scale(0.97)}',
          '.sl-ri.active{background:linear-gradient(100deg,rgba(59,130,246,0.28),rgba(139,92,246,0.18));',
          '  color:#fff;box-shadow:inset 0 0 0 1px rgba(120,180,255,0.25)}',
          '.sl-ri+.sl-ri{border-top:1px solid rgba(255,255,255,0.05)}',
          '.sl-ri-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;flex-shrink:0;letter-spacing:0.8px}',
          '.sl-ri-badge.on{background:rgba(52,211,153,0.18);color:#34d399;box-shadow:0 0 10px rgba(52,211,153,0.35)}',
          '.sl-ri-badge.off{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.32)}',
          /* ripple element */
          '.sl-wave-ripple{position:absolute;border-radius:50%;pointer-events:none;',
          '  background:radial-gradient(circle,rgba(120,180,255,0.55) 0%,transparent 70%);',
          '  width:60px;height:60px;margin-left:-30px;margin-top:-30px;',
          '  animation:slRippleOut 0.5s cubic-bezier(0.4,0,0.2,1) both;',
          '  display:none}',
        ].join('\n');
      } else {
        st.textContent = [
          '@keyframes slBubblePop{',
          '  0%  {opacity:0;transform:scale(0.25);filter:blur(18px)}',
          '  40% {opacity:1;filter:blur(2px)}',
          '  65% {transform:scale(1.10);filter:blur(0)}',
          '  82% {transform:scale(0.96)}',
          '  92% {transform:scale(1.03)}',
          '  100%{transform:scale(1)}',
          '}',
          '@keyframes slSpark{',
          '  0%  {transform:scale(0)   rotate(0deg);  opacity:0.9}',
          '  40% {transform:scale(1.6) rotate(25deg); opacity:0.7}',
          '  100%{transform:scale(0)   rotate(50deg); opacity:0}',
          '}',
          '@keyframes slItemIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}',
          '.sl-ri{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:14px;',
          '  cursor:pointer;font-family:Sora,sans-serif;font-size:13px;font-weight:600;',
          '  color:rgba(255,255,255,0.88);transition:background 0.15s,transform 0.12s;',
          '  white-space:nowrap;animation:slItemIn 0.3s cubic-bezier(0.22,1,0.36,1) both}',
          '.sl-ri:hover{background:rgba(255,255,255,0.09);transform:scale(1.02)}',
          '.sl-ri:active{transform:scale(0.96)}',
          '.sl-ri.active{background:linear-gradient(100deg,rgba(59,130,246,0.28),rgba(139,92,246,0.18));',
          '  color:#fff;box-shadow:inset 0 0 0 1px rgba(120,180,255,0.25)}',
          '.sl-ri+.sl-ri{border-top:1px solid rgba(255,255,255,0.05)}',
          '.sl-ri-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;flex-shrink:0;letter-spacing:0.8px}',
          '.sl-ri-badge.on{background:rgba(52,211,153,0.18);color:#34d399;box-shadow:0 0 10px rgba(52,211,153,0.35)}',
          '.sl-ri-badge.off{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.32)}',
          '.sl-pop-shimmer{position:absolute;top:0;left:8%;right:8%;height:1px;pointer-events:none;',
          '  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)}',
          '.sl-spark{position:absolute;width:28px;height:28px;pointer-events:none;border-radius:50%;',
          '  animation:slSpark 0.7s cubic-bezier(0.22,1,0.36,1) both;',
          '  background:radial-gradient(circle,rgba(180,210,255,0.95) 0%,rgba(100,160,255,0.45) 50%,transparent 100%);',
          '  filter:blur(2px)}',
          '.sl-spark-tl{top:-12px;left:-12px;animation-delay:0s}',
          '.sl-spark-tr{top:-12px;right:-12px;animation-delay:0.05s}',
          '.sl-spark-bl{bottom:-12px;left:-12px;animation-delay:0.10s}',
          '.sl-spark-br{bottom:-12px;right:-12px;animation-delay:0.15s}',
        ].join('\n');
      }
      document.head.appendChild(st);
    }

    // ── Ripple helper cho Wave style ─────────────────────────────────────────
    function _slWaveRipple(item, e) {
      var ripple = item.querySelector('.sl-wave-ripple');
      if (!ripple) return;
      var rect = item.getBoundingClientRect();
      var x = (e.clientX || (rect.left + rect.width / 2)) - rect.left;
      var y = (e.clientY || (rect.top  + rect.height / 2)) - rect.top;
      ripple.style.left = x + 'px';
      ripple.style.top  = y + 'px';
      ripple.style.display = 'block';
      ripple.style.animation = 'none';
      void ripple.offsetWidth; // reflow
      ripple.style.animation = 'slRippleOut 0.5s cubic-bezier(0.4,0,0.2,1) both';
    }

    // ── Mode popup ───────────────────────────────────────────────────────────
    var modeBtn    = r.getElementById('sl-mode-btn');
    var modeBtnArrow = r.getElementById('sl-mode-btn-arrow');
    var slModePopupEl = null;

    function closeModePopup() {
      if (slModePopupEl && slModePopupEl.parentNode) {
        slModePopupEl.parentNode.removeChild(slModePopupEl);
        slModePopupEl = null;
      }
      var ov = document.getElementById('sl-mode-overlay-global');
      if (ov) ov.parentNode.removeChild(ov);
      if (modeBtnArrow) modeBtnArrow.classList.remove('open');
    }

    function openModePopup() {
      if (slModePopupEl) { closeModePopup(); return; }
      var lang2 = (self._config && self._config.language) || 'vi';
      var tr2   = AC_TRANSLATIONS[lang2] || AC_TRANSLATIONS.vi;
      var isWave = (self._config && self._config.popup_style) === 'wave';

      var overlay = document.createElement('div');
      overlay.id = 'sl-mode-overlay-global';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9990;background:transparent';
      document.body.appendChild(overlay);

      var pop = document.createElement('div');
      pop.style.cssText = [
        'position:fixed',
        'z-index:9999',
        'background:rgba(8,20,48,0.55)',
        'border:1px solid rgba(255,255,255,0.20)',
        'border-top:1px solid rgba(255,255,255,0.35)',
        'border-radius:22px',
        'backdrop-filter:blur(48px) saturate(2) brightness(1.1)',
        '-webkit-backdrop-filter:blur(48px) saturate(2) brightness(1.1)',
        'box-shadow:0 2px 0 rgba(255,255,255,0.15) inset,0 24px 64px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.06)',
        'overflow:hidden',
        'padding:8px',
        'min-width:180px',
        'font-family:Sora,sans-serif',
        'transform-origin:' + (isWave ? 'bottom center' : 'top center'),
        isWave
          ? 'animation:slWaveSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both'
          : 'animation:slBubblePop 0.45s cubic-bezier(0.22,1,0.36,1) both',
      ].join(';');

      _slInjectStyles(isWave);

      var modeList = ['off','auto','cool','heat','dry','fan_only'];
      var slModeShowMap2 = { auto: 'show_auto', cool: 'show_cool', heat: 'show_heat', dry: 'show_dry', fan_only: 'show_fan_only' };
      var curHvac  = self._s(ROOMS[self._activeIdx].id);
      var itemsHtml = isWave ? '' : '<div class="sl-pop-shimmer"></div>';
      for (var mi = 0; mi < modeList.length; mi++) {
        var mk2  = modeList[mi];
        if (mk2 === 'auto' && !(self._config && self._config.show_auto === true)) continue;
        if (mk2 !== 'off' && mk2 !== 'auto' && (self._config && self._config[slModeShowMap2[mk2]] === false)) continue;
        var mcfg = MODE_CFG[mk2] || MODE_CFG.off;
        var mlbl = tr2.modes[mk2] || mcfg.lbl;
        var delay = (mi * 0.04 + 0.03).toFixed(2) + 's';
        if (isWave) {
          var icHtml3 = (mcfg.icon && mcfg.icon.indexOf('mdi:') === 0)
            ? '<ha-icon icon="' + mcfg.icon + '" style="--mdc-icon-size:20px;--mdc-icon-color:' + mcfg.color + ';width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;color:' + mcfg.color + '"></ha-icon>'
            : '<span style="font-size:18px;line-height:1">' + mcfg.icon + '</span>';
          itemsHtml += '<div class="sl-ri sl-ri-wave' + (curHvac === mk2 ? ' active' : '') + '" data-mode-val="' + mk2 + '" style="animation-delay:' + delay + '">'
            + '<span style="width:22px;text-align:center;display:inline-flex;align-items:center;justify-content:center">' + icHtml3 + '</span>'
            + '<span style="flex:1">' + mlbl + '</span>'
            + '<div class="sl-wave-ripple"></div>'
            + '</div>';
        } else {
          var icHtml4 = (mcfg.icon && mcfg.icon.indexOf('mdi:') === 0)
            ? '<ha-icon icon="' + mcfg.icon + '" style="--mdc-icon-size:20px;--mdc-icon-color:' + mcfg.color + ';width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;color:' + mcfg.color + '"></ha-icon>'
            : '<span style="font-size:18px;line-height:1">' + mcfg.icon + '</span>';
          itemsHtml += '<div class="sl-ri' + (curHvac === mk2 ? ' active' : '') + '" data-mode-val="' + mk2 + '" style="animation-delay:' + delay + '">'
            + '<span style="width:22px;text-align:center;display:inline-flex;align-items:center;justify-content:center">' + icHtml4 + '</span>'
            + '<span style="flex:1">' + mlbl + '</span>'
            + '</div>';
        }
      }
      pop.innerHTML = itemsHtml;

      var btnRect2 = modeBtn.getBoundingClientRect();
      var popWidth2 = Math.max(btnRect2.width, 180);
      var popLeft2 = btnRect2.left;
      if (popLeft2 + popWidth2 > window.innerWidth - 8) popLeft2 = window.innerWidth - popWidth2 - 8;
      if (isWave) {
        pop.style.bottom = (window.innerHeight - btnRect2.top + 6) + 'px';
        pop.style.top = 'auto';
      } else {
        pop.style.top  = (btnRect2.bottom + 6) + 'px';
      }
      pop.style.left  = popLeft2 + 'px';
      pop.style.width = popWidth2 + 'px';

      document.body.appendChild(pop);
      slModePopupEl = pop;
      if (modeBtnArrow) modeBtnArrow.classList.add('open');

      pop.querySelectorAll('[data-mode-val]').forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          if (isWave) _slWaveRipple(item, e);
          var modeVal = item.dataset.modeVal;
          var id = ROOMS[self._activeIdx].id;
          var doCall = function() {
            if (modeVal === 'off') { var ch = self._s(id); if (ch && ch !== 'off') self._hvacModeSave(id, ch); }
            self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode: modeVal}); closeModePopup();
          };
          isWave ? setTimeout(doCall, 220) : doCall();
        });
      });

      overlay.addEventListener('click', closeModePopup);
    }

    if (modeBtn) {
      modeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openModePopup();
      });
    }

    function onOutsideModeClick(e) {
      if (!slModePopupEl) return;
      if (slModePopupEl.contains(e.target)) return;
      if (modeBtn && modeBtn.contains(e.target)) return;
      closeModePopup();
    }
    document.addEventListener('click', onOutsideModeClick);
    var origSlCleanup = self._slCleanup;
    self._slCleanup = function() {
      document.removeEventListener('click', onOutsideModeClick);
      closeModePopup();
      if (origSlCleanup) origSlCleanup();
    };

    // ── Custom room dropdown ─────────────────────────────────────────────────
    var roomBtn   = r.getElementById('sl-room-btn');
    var roomArrow = r.getElementById('sl-room-btn-arrow');
    var roomBtnTxt = r.getElementById('sl-room-btn-txt');
    var slRoomPopupEl = null;

    function closeRoomPopup() {
      if (slRoomPopupEl && slRoomPopupEl.parentNode) {
        slRoomPopupEl.parentNode.removeChild(slRoomPopupEl);
        slRoomPopupEl = null;
      }
      // Remove overlay
      var ov = document.getElementById('sl-room-overlay-global');
      if (ov) ov.parentNode.removeChild(ov);
      if (roomArrow) roomArrow.classList.remove('open');
    }

    function openRoomPopup() {
      if (slRoomPopupEl) { closeRoomPopup(); return; }
      var isWave = (self._config && self._config.popup_style) === 'wave';

      // Transparent overlay in real DOM (needed for backdrop-filter stacking context)
      var overlay = document.createElement('div');
      overlay.id = 'sl-room-overlay-global';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9990;background:transparent';
      document.body.appendChild(overlay);

      // Popup appended to document.body — bên ngoài shadow DOM
      // để backdrop-filter có stacking context chuẩn
      var pop = document.createElement('div');
      pop.style.cssText = [
        'position:fixed',
        'z-index:9999',
        'background:rgba(8,20,48,0.55)',
        'border:1px solid rgba(255,255,255,0.20)',
        'border-top:1px solid rgba(255,255,255,0.35)',
        'border-radius:22px',
        'backdrop-filter:blur(48px) saturate(2) brightness(1.1)',
        '-webkit-backdrop-filter:blur(48px) saturate(2) brightness(1.1)',
        'box-shadow:0 2px 0 rgba(255,255,255,0.15) inset,0 24px 64px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.06)',
        'overflow:hidden',
        'padding:8px',
        'min-width:220px',
        'font-family:Sora,sans-serif',
        'transform-origin:' + (isWave ? 'bottom center' : 'top center'),
        isWave
          ? 'animation:slWaveSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both'
          : 'animation:slBubblePop 0.45s cubic-bezier(0.22,1,0.36,1) both',
      ].join(';');

      _slInjectStyles(isWave);

      // Build items
      var itemsHtml = isWave ? '' : (
          '<div class="sl-pop-shimmer"></div>'
        + '<div class="sl-spark sl-spark-tl"></div>'
        + '<div class="sl-spark sl-spark-tr"></div>'
        + '<div class="sl-spark sl-spark-bl"></div>'
        + '<div class="sl-spark sl-spark-br"></div>'
      );
      for (var ri2 = 0; ri2 < ROOMS.length; ri2++) {
        var ri2State = self._s(ROOMS[ri2].id);
        var ri2On = ri2State !== 'off';
        var ri2Temp = parseFloat(self._a(ROOMS[ri2].id, 'current_temperature') || 0);
        var ri2TUnit = (self._config && self._config.temp_unit) || 'C';
        var ri2HaUnit = self._a(ROOMS[ri2].id, 'temperature_unit') || 'C';
        var ri2TempStr = ri2Temp > 0 ? ' · ' + acFmtTemp(ri2Temp, ri2TUnit, ri2HaUnit) + (ri2TUnit === 'F' ? '°F' : '°') : '';
        var ri2HumRaw = parseFloat(self._a(ROOMS[ri2].id, 'current_humidity') || self._a(ROOMS[ri2].id, 'humidity') || 0);
        var ri2EntH = (self._config && self._config.entities && self._config.entities[ri2]) || {};
        if (ri2EntH.humidity_entity && self._hass && self._hass.states[ri2EntH.humidity_entity]) { var ri2HS = parseFloat(self._hass.states[ri2EntH.humidity_entity].state); if (!isNaN(ri2HS)) ri2HumRaw = ri2HS; }
        var ri2HumStr = ri2HumRaw > 0 ? ' · 💧' + Math.round(ri2HumRaw) + '%' : '';
        var ri2IconHtml = self._mdiIcon(ROOMS[ri2].icon, 18);
        var ri2LabelText = ROOMS[ri2].label + ri2TempStr + ri2HumStr;
        var delay = (ri2 * 0.03 + 0.03).toFixed(2) + 's';
        if (isWave) {
          itemsHtml += '<div class="sl-ri sl-ri-wave' + (ri2 === self._activeIdx ? ' active' : '') + '" data-room-idx="' + ri2 + '" style="animation-delay:' + delay + '">'
            + '<span style="flex:1;display:flex;align-items:center;gap:6px">' + ri2IconHtml + '<span>' + ri2LabelText + '</span></span>'
            + '<span class="sl-ri-badge ' + (ri2On ? 'on' : 'off') + '">' + (ri2On ? 'ON' : 'OFF') + '</span>'
            + '<div class="sl-wave-ripple"></div>'
            + '</div>';
        } else {
          itemsHtml += '<div class="sl-ri' + (ri2 === self._activeIdx ? ' active' : '') + '" data-room-idx="' + ri2 + '" style="animation-delay:' + delay + '">'
            + '<span style="flex:1;display:flex;align-items:center;gap:6px">' + ri2IconHtml + '<span>' + ri2LabelText + '</span></span>'
            + '<span class="sl-ri-badge ' + (ri2On ? 'on' : 'off') + '">' + (ri2On ? 'ON' : 'OFF') + '</span>'
            + '</div>';
        }
      }
      pop.innerHTML = itemsHtml;

      // Position
      var btnRect = roomBtn.getBoundingClientRect();
      var popWidth = Math.max(btnRect.width, 220);
      var popLeft  = btnRect.left;
      if (popLeft + popWidth > window.innerWidth - 8) popLeft = window.innerWidth - popWidth - 8;
      if (isWave) {
        pop.style.bottom = (window.innerHeight - btnRect.top + 6) + 'px';
        pop.style.top = 'auto';
      } else {
        pop.style.top = (btnRect.bottom + 6) + 'px';
      }
      pop.style.left  = popLeft + 'px';
      pop.style.width = popWidth + 'px';

      document.body.appendChild(pop);
      slRoomPopupEl = pop;
      if (roomArrow) roomArrow.classList.add('open');

      // Item click
      pop.querySelectorAll('[data-room-idx]').forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          if (isWave) _slWaveRipple(item, e);
          var idx = parseInt(item.dataset.roomIdx);
          var doSwitch = function() {
            self._activeIdx = idx;
            closeRoomPopup();
            self._renderFull();
          };
          isWave ? setTimeout(doSwitch, 220) : doSwitch();
        });
      });

      // Overlay click closes
      overlay.addEventListener('click', closeRoomPopup);
    }

    if (roomBtn) {
      roomBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openRoomPopup();
      });
    }

    // Close popup on outside click (popup is in document.body now)
    function onOutsideClick(e) {
      if (!slRoomPopupEl) return;
      if (slRoomPopupEl.contains(e.target)) return;
      if (roomBtn && roomBtn.contains(e.target)) return;
      closeRoomPopup();
    }
    document.addEventListener('click', onOutsideClick);
    // Clean up listener when card is disconnected — chain with any existing cleanup (e.g. mode popup)
    var prevCleanup = self._slCleanup;
    self._slCleanup = function() { document.removeEventListener('click', onOutsideClick); closeRoomPopup(); if (prevCleanup) prevCleanup(); };
  }

  // ── Interval 10s: cập nhật nhiệt độ thực tế + ETA kể cả khi HA không push ──
  _startRefresh() {
    if (this._refreshInt) return; // đã có rồi
    var self = this;
    this._refreshInt = setInterval(function() {
      if (!self._hass || !self._initialized) return;
      var h = self._hass;
      var nowMs = Date.now();
      var histDirty = false;

      // Ghi lịch sử nhiệt độ cho tất cả phòng (giống logic trong set hass)
      for (var ri = 0; ri < ROOMS.length; ri++) {
        var rid = ROOMS[ri].id;
        var rTemp = parseFloat(self._attrOf(h, rid, 'current_temperature'));
        var rMode = self._stateOf(h, rid);
        if (!isNaN(rTemp) && rMode === 'cool') {
          if (!self._tempHistory[ri]) self._tempHistory[ri] = [];
          var hist = self._tempHistory[ri];
          var last = hist[hist.length - 1];
          // Ghi điểm mới mỗi 10s (kể cả nếu nhiệt độ không đổi — để track thời gian thực)
          if (!last || (nowMs - last.t) >= 9000) {
            if (!last || Math.abs(last.temp - rTemp) >= 0.01 || (nowMs - last.t) >= 30000) {
              hist.push({ t: nowMs, temp: rTemp });
              if (hist.length > 60) hist.splice(0, hist.length - 60);
              histDirty = true;
            }
          }
        }
      }
      if (histDirty) {
        try { localStorage.setItem('ac_temp_history_v2', JSON.stringify(self._tempHistory)); } catch(e) {}
      }

      // Patch chỉ các element thay đổi — KHÔNG rebuild toàn bộ DOM → không nháy
      self._patchLiveData();
    }, 10000);
  }

  // ── Patch các element hiển thị live mà không rebuild toàn bộ card ────────
  _patchLiveData() {
    if (!this._hass || !this._initialized) return;
    var sr = this.shadowRoot;
    if (!sr) return;

    var cfg     = this._config || {};
    var lang    = cfg.language || 'vi';
    var tr      = AC_TRANSLATIONS[lang] || AC_TRANSLATIONS.vi;
    var room    = ROOMS[this._activeIdx];
    var hvac    = this._s(room.id);
    var isOn    = hvac !== 'off';
    var curTemp = parseFloat(this._a(room.id, 'current_temperature') || 26);
    var setTemp = parseFloat(this._a(room.id, 'temperature') || 24);
    var fanMode = this._a(room.id, 'fan_mode') || 'auto';

    // Nhiệt độ thực tế từ cảm biến riêng nếu có
    var roomEntCfg = (cfg.entities && cfg.entities[this._activeIdx]) || {};
    if (roomEntCfg.temp_entity && this._hass.states[roomEntCfg.temp_entity]) {
      var st = parseFloat(this._hass.states[roomEntCfg.temp_entity].state);
      if (!isNaN(st)) curTemp = st;
    }

    // ── Patch nhiệt độ hiển thị ──────────────────────────────────────────
    var tUnit2  = cfg.temp_unit || 'C';
    var haUnit2 = this._a(room.id, 'temperature_unit') || 'C';
    var tempEl = sr.getElementById('live-cur-temp');
    if (tempEl) {
      var color = acTempColor(curTemp);
      tempEl.style.color = color;
      tempEl.style.textShadow = '0 0 30px ' + color + ',0 0 60px ' + color;
      var firstNode = tempEl.firstChild;
      var tempStr = acFmtTemp(curTemp, tUnit2, haUnit2);
      if (firstNode && firstNode.nodeType === 3) {
        if (firstNode.textContent !== tempStr) firstNode.textContent = tempStr;
      }
    }

    // ── Patch set-temp display ───────────────────────────────────────────
    var setTempEl = sr.getElementById('live-set-temp');
    if (setTempEl) {
      var setTempVal = String(acFmtSetTemp(setTemp, tUnit2, haUnit2));
      var setTempNode = setTempEl.firstChild;
      if (setTempNode && setTempNode.nodeType === 3) {
        if (setTempNode.textContent !== setTempVal) setTempNode.textContent = setTempVal;
      }
    }

    // ── Patch comfort text ───────────────────────────────────────────────
    var comfortEl = sr.getElementById('live-comfort');
    if (comfortEl) {
      var comfortTxt = '';
      if (!isOn) comfortTxt = tr.comfort && tr.comfort.off ? tr.comfort.off : '';
      else if (hvac === 'dry') comfortTxt = tr.comfort && tr.comfort.dry ? tr.comfort.dry : '';
      else if (hvac === 'fan_only') comfortTxt = tr.comfort && tr.comfort.fan_only ? tr.comfort.fan_only : '';
      else comfortTxt = tr.comfortTemp ? tr.comfortTemp(curTemp) : '';
      if (comfortEl.textContent !== comfortTxt) comfortEl.textContent = comfortTxt;
    }

    // ── Patch ETA bar ─────────────────────────────────────────────────────
    var setTempDisp2 = acFmtSetTemp(setTemp, tUnit2, haUnit2);
    var degSym2 = tUnit2 === 'F' ? '°F' : '°C';
    var etaEl = sr.getElementById('live-eta');
    if (hvac === 'cool' && isOn) {
      var eta = this._calcEta(this._activeIdx, setTemp, curTemp, fanMode);
      if (eta) {
        var prefix = eta.mode === 'estimated' ? '⏱~ ' : '⏱ ';
        var etaTxt = lang === 'vi'
          ? prefix + 'Dự kiến đạt ' + setTempDisp2 + degSym2 + ' trong ' + eta.eta + ' phút'
          : prefix + 'Est. ' + setTempDisp2 + degSym2 + ' in ' + eta.eta + ' min';
        if (etaEl) {
          if (etaEl.textContent !== etaTxt) etaEl.textContent = etaTxt;
          etaEl.style.display = '';
        } else {
          // ETA element chưa tồn tại → bỏ qua, không renderFull để tránh kill animation
        }
      } else if (etaEl) {
        etaEl.style.display = 'none';
      }
    } else if (etaEl) {
      etaEl.style.display = 'none';
    }

    // ── Patch sensor values (outdoor temp, humidity, power) ──────────────
    var outdoorEl = sr.getElementById('met-outdoor-temp');
    if (outdoorEl && cfg.outdoor_temp_entity && this._hass.states[cfg.outdoor_temp_entity]) {
      var ov = acFmtTemp(parseFloat(this._hass.states[cfg.outdoor_temp_entity].state), tUnit2, haUnit2) + (tUnit2 === 'F' ? '°F' : '°');
      if (outdoorEl.textContent !== ov) outdoorEl.textContent = ov;
    }
    var humEl = sr.getElementById('met-humidity');
    if (humEl && cfg.humidity_entity && this._hass.states[cfg.humidity_entity]) {
      var hv = Math.round(parseFloat(this._hass.states[cfg.humidity_entity].state)) + '%';
      if (humEl.textContent !== hv) humEl.textContent = hv;
    }
    var powEl = sr.getElementById('met-power');
    if (powEl) {
      var powerEnt = (roomEntCfg.power_entity) || cfg.power_entity;
      if (powerEnt && this._hass.states[powerEnt]) {
        var rawPow = parseFloat(this._hass.states[powerEnt].state);
        var useKw = (cfg.power_unit || 'kW') === 'kW';
        var pv = isNaN(rawPow) ? '--'
          : (useKw
              ? (rawPow >= 1000 ? (rawPow / 1000).toFixed(2) + ' kW' : rawPow.toFixed(0) + ' W')
              : rawPow.toFixed(0) + ' W');
        if (powEl.textContent !== pv) powEl.textContent = pv;
      }
    }
  }

  _startClock() {
    var self = this;
    if (this._clockInt) return; // đã có rồi → không tạo thêm
    this._clockInt = setInterval(function() {
      var el = self.shadowRoot && self.shadowRoot.getElementById('clock-display');
      if (el) el.textContent = new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
    }, 30000);
  }

  // ── Timer per-room ────────────────────────────────────────────────────────
  _fmtRemain(roomIdx) {
    var t = this._timers[roomIdx];
    if (!t || !t.end) return '';
    var rem = t.end - Date.now();
    if (rem <= 0) return '';
    var m = Math.ceil(rem / 60000);
    var h = Math.floor(m / 60); m = m % 60;
    return h > 0 ? h + 'h' + (m ? m + 'm' : '') : m + 'm';
  }

  _timerSave() {
    try {
      var snap = {};
      var now = Date.now();
      Object.keys(this._timers).forEach(function(idx) {
        var t = this._timers[idx];
        if (t && t.end && t.end > now) {
          snap[idx] = { end: t.end, mode: t.mode, hrs: t.hrs };
        }
      }.bind(this));
      if (Object.keys(snap).length > 0) {
        localStorage.setItem('ac_timer_state_v2', JSON.stringify(snap));
      } else {
        localStorage.removeItem('ac_timer_state_v2');
      }
    } catch(e) {}
  }

  // ── Lưu / đọc chế độ HVAC cuối cùng (persist qua reload + thiết bị khác cùng domain)
  _hvacModeSave(entityId, mode) {
    this._lastHvacMode = this._lastHvacMode || {};
    this._lastHvacMode[entityId] = mode;
    try { localStorage.setItem('ac_last_hvac_mode_v1', JSON.stringify(this._lastHvacMode)); } catch(e) {}
  }

  _hvacModeLoad(entityId) {
    // 1. Bộ nhớ trong session (đã sync từ localStorage khi constructor chạy)
    if (this._lastHvacMode && this._lastHvacMode[entityId]) return this._lastHvacMode[entityId];
    // 2. Đọc thẳng localStorage (phòng trường hợp instance mới trên thiết bị khác)
    try {
      var saved = localStorage.getItem('ac_last_hvac_mode_v1');
      if (saved) {
        var obj = JSON.parse(saved);
        if (obj && obj[entityId]) {
          this._lastHvacMode = this._lastHvacMode || {};
          this._lastHvacMode[entityId] = obj[entityId];
          return obj[entityId];
        }
      }
    } catch(e) {}
    // 3. Attribute do integration lưu sẵn (một số brand cung cấp)
    var attrLast = this._a(entityId, 'last_hvac_mode') || this._a(entityId, 'previous_hvac_mode');
    if (attrLast && attrLast !== 'off') return attrLast;
    // 4. Fallback cuối cùng
    return null; // null → caller sẽ dùng climate.turn_on thay vì set_hvac_mode
  }

  // ── Bật điều hòa đúng cách: ưu tiên climate.turn_on (tôn trọng mode hệ thống)
  // climate.turn_on là HA core service: khôi phục mode trước đó theo integration
  // (đúng với Mitsubishi City Multi — hệ thống tập trung quyết định Heat/Cool)
  _turnOn(entityId) {
    var savedMode = this._hvacModeLoad(entityId);
    if (savedMode) {
      // Có mode đã lưu rõ ràng (user từng chọn trong card) → dùng set_hvac_mode
      this._call('climate', 'set_hvac_mode', { entity_id: entityId, hvac_mode: savedMode });
    } else {
      // Không có mode lưu → gọi turn_on để integration/hệ thống tự quyết định
      // Đây là hành vi đúng cho Mitsubishi City Multi và các hệ thống tập trung khác
      this._call('climate', 'turn_on', { entity_id: entityId });
    }
  }

  _startTick(roomIdx) {
    var self = this;
    var t = self._timers[roomIdx];
    if (!t) return;
    if (t.int) clearInterval(t.int);
    self._timerSave();
    t.int = setInterval(function() {
      var tr2 = self._timers[roomIdx];
      if (!tr2) { return; }
      var rem = tr2.end - Date.now();
      // Chỉ cập nhật UI nếu đang xem đúng phòng này
      if (self._activeIdx === parseInt(roomIdx)) {
        var el = self.shadowRoot && self.shadowRoot.getElementById('timer-cd');
        var btn2 = self.shadowRoot && (self.shadowRoot.getElementById('btn-timer-left') || self.shadowRoot.getElementById('btn-timer'));
        if (rem <= 0) {
          clearInterval(tr2.int); tr2.int = null;
          delete self._timers[roomIdx];
          self._timerSave();
          if (el)   el.textContent = '';
          if (btn2) btn2.classList.remove('timer-btn--active');
          // Thực hiện bật/tắt đúng phòng
          var id = ROOMS[roomIdx].id;
          if (tr2.mode === 'on') {
            self._turnOn(id);
          } else {
            self._call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: 'off' });
          }
        } else {
          if (el) el.textContent = self._fmtRemain(roomIdx);
        }
      } else {
        // Phòng đang chạy timer nhưng không được xem → chỉ xử lý hết giờ
        if (rem <= 0) {
          clearInterval(tr2.int); tr2.int = null;
          delete self._timers[roomIdx];
          self._timerSave();
          var id2 = ROOMS[roomIdx].id;
          if (tr2.mode === 'on') {
            self._turnOn(id2);
          } else {
            self._call('climate', 'set_hvac_mode', { entity_id: id2, hvac_mode: 'off' });
          }
        }
      }
    }, 10000);
  }

  _bindTimer() {
    var self  = this;
    var sr    = this.shadowRoot;
    // btn-timer-left = chế độ full, btn-timer = chế độ lite
    var btn   = sr.getElementById('btn-timer-left') || sr.getElementById('btn-timer');
    var roomIdx = this._activeIdx; // ghi nhớ phòng tại thời điểm bind
    if (!btn) return;

    var lang = (this._config && this._config.language) || 'vi';
    var tr   = AC_TRANSLATIONS[lang] || AC_TRANSLATIONS['vi'];

    var HOURS     = [0.5, 1, 1.5, 2, 3, 4, 6, 8];
    var HOUR_LBLS = ['30p','1h','1.5h','2h','3h','4h','6h','8h'];

    function closePopup() {
      var p = sr.getElementById('timer-popup-el');
      if (p) p.remove();
      if (self._outsideHandler) {
        document.removeEventListener('click',    self._outsideHandler, true);
        document.removeEventListener('touchend', self._outsideHandler, true);
        self._outsideHandler = null;
      }
    }

    function openPopup() {
      closePopup();
      var cur        = self._timers[roomIdx] || {};
      var chosenH    = cur.hrs || null;
      var chosenMode = cur.mode || 'off';
      var customMin  = '';  // phút tùy chỉnh

      var pop = document.createElement('div');
      pop.id = 'timer-popup-el';
      pop.className = 'timer-popup';

      var rect = btn.getBoundingClientRect();
      pop.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
      pop.style.right  = (window.innerWidth  - rect.right)  + 'px';

      function renderPop() {
        var hasTimer = !!(self._timers[roomIdx] && self._timers[roomIdx].end);
        pop.innerHTML =
          '<div class="tp-title">' + tr.timerTitle + '</div>'
        + '<div class="tp-tabs">'
        +   '<button class="tp-tab ' + (chosenMode==='off'?'tp-tab-off-sel':'') + '" id="tp-off">' + tr.timerOff + '</button>'
        +   '<button class="tp-tab ' + (chosenMode==='on'?'tp-tab-on-sel':'')   + '" id="tp-on" >' + tr.timerOn  + '</button>'
        + '</div>'
        + '<div class="tp-hours">'
        + HOURS.map(function(h, i) {
            var sel = chosenH === h ? (chosenMode==='off'?' tp-h-off':' tp-h-on') : '';
            return '<button class="tp-h' + sel + '" data-h="' + h + '">' + HOUR_LBLS[i] + '</button>';
          }).join('')
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">'
        +   '<input id="tp-custom-min" type="number" min="1" max="999" placeholder="' + tr.timerMinPlaceholder + '" value="' + customMin + '"'
        +     ' style="flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.18);border-radius:8px;'
        +     'padding:6px 8px;font-size:11px;font-family:Sora,sans-serif;color:#fff;outline:none;width:0">'
        +   '<span style="font-size:9px;color:rgba(255,255,255,0.45);white-space:nowrap">' + tr.timerMinUnit + '</span>'
        + '</div>'
        + '<div class="tp-acts">'
        +   '<button class="tp-cancel" id="tp-cancel">' + tr.cancel + '</button>'
        +   (hasTimer ? '<button class="tp-del" id="tp-del">' + tr.timerDelete + '</button>' : '')
        +   '<button class="tp-ok ' + (chosenMode==='on'?'tp-ok-on':'tp-ok-off') + '" id="tp-ok">' + tr.timerConfirm + '</button>'
        + '</div>';

        // Bind tabs
        var tabOff = pop.querySelector('#tp-off');
        var tabOn  = pop.querySelector('#tp-on');
        function setMode(m) { chosenMode = m; renderPop(); }
        if (tabOff) tabOff.onclick = function(e){ e.stopPropagation(); setMode('off'); };
        if (tabOn)  tabOn.onclick  = function(e){ e.stopPropagation(); setMode('on');  };

        // Bind preset giờ
        pop.querySelectorAll('.tp-h').forEach(function(b) {
          b.onclick = function(e) {
            e.stopPropagation();
            chosenH   = parseFloat(b.dataset.h);
            customMin = '';
            renderPop();
          };
        });

        // Bind custom input – giữ value khi re-render
        var custEl = pop.querySelector('#tp-custom-min');
        if (custEl) {
          custEl.addEventListener('input', function() {
            customMin = custEl.value;
            chosenH   = null; // bỏ chọn preset
          });
          custEl.addEventListener('click', function(e) { e.stopPropagation(); });
          custEl.addEventListener('touchstart', function(e) { e.stopPropagation(); }, { passive: true });
        }

        // Huỷ
        var cancelBtn = pop.querySelector('#tp-cancel');
        if (cancelBtn) cancelBtn.onclick = function(e){ e.stopPropagation(); closePopup(); };

        // Xoá hẹn
        var delBtn = pop.querySelector('#tp-del');
        if (delBtn) delBtn.onclick = function(e) {
          e.stopPropagation();
          var t = self._timers[roomIdx];
          if (t && t.int) clearInterval(t.int);
          delete self._timers[roomIdx];
          self._timerSave();
          var cd = sr.getElementById('timer-cd');
          if (cd) cd.textContent = '';
          btn.classList.remove('timer-btn--active');
          closePopup();
        };

        // Xác nhận
        var okBtn = pop.querySelector('#tp-ok');
        if (okBtn) okBtn.onclick = function(e) {
          e.stopPropagation();
          // Ưu tiên custom minutes nếu có
          var custInput = pop.querySelector('#tp-custom-min');
          var mins = custInput && custInput.value ? parseFloat(custInput.value) : 0;
          var finalHrs = mins > 0 ? (mins / 60) : chosenH;
          if (!finalHrs || finalHrs <= 0) { closePopup(); return; }

          // Huỷ timer cũ của phòng này (nếu có)
          var old = self._timers[roomIdx];
          if (old && old.int) clearInterval(old.int);

          self._timers[roomIdx] = { end: Date.now() + finalHrs * 3600000, mode: chosenMode, hrs: finalHrs, int: null };
          btn.classList.add('timer-btn--active');
          var cd = sr.getElementById('timer-cd');
          if (cd) cd.textContent = self._fmtRemain(roomIdx);
          self._startTick(roomIdx);
          closePopup();
        };
      }

      renderPop();
      sr.appendChild(pop);

      self._popupJustOpened = true;
      setTimeout(function() { self._popupJustOpened = false; }, 80);

      function outside(e) {
        if (self._popupJustOpened) return;
        var path = e.composedPath ? e.composedPath() : [];
        if (path.indexOf(pop) === -1 && path.indexOf(btn) === -1) closePopup();
      }
      document.addEventListener('click',    outside, true);
      document.addEventListener('touchend', outside, true);
      self._outsideHandler = outside;
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation(); e.preventDefault();
      if (!sr.getElementById('timer-popup-el')) openPopup();
    });
    btn.addEventListener('touchend', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (!sr.getElementById('timer-popup-el')) openPopup();
    }, { passive: false });
  }

  disconnectedCallback() {
    if (this._clockInt)   { clearInterval(this._clockInt);   this._clockInt   = null; }
    if (this._refreshInt) { clearInterval(this._refreshInt); this._refreshInt = null; }
    if (this._slCleanup) { this._slCleanup(); this._slCleanup = null; }
    if (this._scaleObs) { this._scaleObs.disconnect(); this._scaleObs = null; }
    // Clear tooltip timers
    if (this._tipAutoHideTimer) { clearTimeout(this._tipAutoHideTimer); this._tipAutoHideTimer = null; }
    this._stopCoolTrailAnim();
    this._stopFanWindAnim();
    this._stopHeatFlameAnim();
    this._stopDryMistAnim();
    if (this._tipFadeTimer)     { clearTimeout(this._tipFadeTimer);     this._tipFadeTimer     = null; }
    if (this._acTip && this._acTip.parentNode) { this._acTip.parentNode.removeChild(this._acTip); this._acTip = null; }
    var self = this;
    Object.keys(this._timers).forEach(function(idx) {
      var t = self._timers[idx];
      if (t && t.int) { clearInterval(t.int); t.int = null; }
    });
  }
}

// ═══════════════════════════════════════════════════════════════
//  VISUAL EDITOR  –  Gate-card style, đa ngôn ngữ, ha-entity-picker
// ═══════════════════════════════════════════════════════════════
class MultiAcCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = { ...AC_DEFAULT_CONFIG };
    this._hass   = null;
    this._open   = { lang: true, rooms: true, sensors: true, colors: false, bg: true, display: false };
    this._picker = null;
  }

  setConfig(c) {
    this._config = { ...AC_DEFAULT_CONFIG, ...c };
    this._render();
  }

  set hass(h) {
    this._hass = h;
    this._syncPickers();
  }

  get t() { return AC_TRANSLATIONS[this._config.language || 'vi'] || AC_TRANSLATIONS.vi; }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  // ── Inject hass vào mọi ha-entity-picker ───────────────────────────────────
  _syncPickers() {
    if (!this._hass || !this.shadowRoot) return;
    const apply = () => {
      this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => {
        p.hass = this._hass;
        const domain = p.dataset.domain;
        if (domain) p.includeDomains = [domain];
        const key   = p.dataset.key;
        const saved = this._config[key] || '';
        if (saved && p.value !== saved) {
          p.value = saved;
          p.setAttribute('value', saved);
        }
      });
      // entity pickers cho từng room
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room]').forEach(p => {
        p.hass = this._hass;
        p.includeDomains = ['climate'];
        const idx   = parseInt(p.dataset.room);
        const ents  = this._config.entities || [];
        const saved = (ents[idx] && ents[idx].entity_id) || '';
        if (saved && p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
      // room temp sensor pickers
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room-temp]').forEach(p => {
        p.hass = this._hass;
        p.includeDomains = ['sensor'];
        const idx   = parseInt(p.dataset.roomTemp);
        const ents  = this._config.entities || [];
        const saved = (ents[idx] && ents[idx].temp_entity) || '';
        if (saved && p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
      // room humidity sensor pickers
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room-hum]').forEach(p => {
        p.hass = this._hass;
        p.includeDomains = ['sensor'];
        const idx   = parseInt(p.dataset.roomHum);
        const ents  = this._config.entities || [];
        const saved = (ents[idx] && ents[idx].humidity_entity) || '';
        if (saved && p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
    };
    apply();
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }

  // ── Toggle accordion mà không full re-render (giữ picker state) ────────────
  _toggleSection(id) {
    this._open[id] = !this._open[id];
    const body  = this.shadowRoot.getElementById('body-' + id);
    const arrow = this.shadowRoot.getElementById('arrow-' + id);
    if (body) {
      body.style.display = this._open[id] ? 'block' : 'none';
      if (arrow) arrow.textContent = this._open[id] ? '▾' : '▸';
      if (this._open[id]) this._syncPickers();
    }
  }

  // ── Color picker row (y hệt gate-card) ──────────────────────────────────────
  _colorRow(key, label) {
    const value  = this._config[key] || '#ffffff';
    const isOpen = this._picker === key;
    const swatches = ['#00ffcc','#00ff96','#ff5252','#00dcff','#ffd740','#ff8a65',
                      '#ffffff','#aaaaaa','#ffaa00','#22cc77','#2288ee','#ee4444'];
    return `
<div class="ci">
  <div class="ci-hdr" data-cp="${key}">
    <div class="ci-swatch" style="background:${value};"></div>
    <span class="ci-label">${label}</span>
    <code class="ci-code">${value}</code>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="ci-chv">
      <path d="${isOpen?'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z':'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'}"/>
    </svg>
  </div>
  ${isOpen ? `
  <div class="ci-body">
    <input type="color" data-cp-native="${key}" value="${value}" class="ci-native"/>
    <div class="ci-hex-wrap">
      <span class="ci-hash">#</span>
      <input type="text" data-cp-hex="${key}" value="${value.replace('#','')}" maxlength="6" placeholder="rrggbb" class="ci-hex-inp"/>
    </div>
    <div class="ci-swatches">
      ${swatches.map(c=>`<div data-cp-dot="${key}" data-color="${c}" class="ci-dot"
        style="background:${c};outline:${value===c?'2px solid var(--primary-color)':'2px solid transparent'};"></div>`).join('')}
    </div>
  </div>` : ''}
</div>`;
  }

  // ── Entity field dùng ha-entity-picker native ─────────────────────────────
  _entityField(key, label, domain) {
    return `
<div class="row">
  <label>${label}</label>
  <ha-entity-picker data-key="${key}" data-domain="${domain}" allow-custom-entity></ha-entity-picker>
</div>`;
  }

  _render() {
    const cfg  = this._config;
    const t    = this.t;
    const bgP  = cfg.background_preset || 'default';
    const lang = cfg.language || 'vi';
    const roomCount = Math.max(1, Math.min(8, parseInt(cfg.room_count) || 4));
    const entities = (cfg.entities || []).slice();
    while (entities.length < roomCount) entities.push({});

    // ── Room rows (dynamic by room_count) ──────────────────────────────────
    let roomRows = '';
    for (let i = 0; i < roomCount; i++) {
      const ent   = entities[i] || {};
      const defLbl = (t.rooms && t.rooms[i]) || ('Room ' + (i+1));
      const defIco = (t.roomIcons && t.roomIcons[i]) || 'mdi:snowflake';
      roomRows += `
<div class="ac-row">
  <div class="ac-row-title">❄ ${t.edRooms.replace(/^❄\s*/,'')} ${i+1} – ${defLbl}</div>
  <div class="row">
    <label>${t.edAcEntity}</label>
    <ha-entity-picker data-room="${i}" data-domain="climate" allow-custom-entity></ha-entity-picker>
  </div>
  <div class="row">
    <label>${t.edRoomTempEntity || '🌡 Room temperature sensor'}</label>
    <ha-entity-picker data-room-temp="${i}" data-domain="sensor" allow-custom-entity></ha-entity-picker>
  </div>
  <div class="row">
    <label>${t.edRoomHumidityEntity || '💧 Room humidity sensor'}</label>
    <ha-entity-picker data-room-hum="${i}" data-domain="sensor" allow-custom-entity></ha-entity-picker>
  </div>
  <div class="row">
    <label>${t.edRoomPowerEntity || '⚡ Room power sensor (sensor.*)'}</label>
    <ha-entity-picker data-room-power="${i}" data-domain="sensor" allow-custom-entity></ha-entity-picker>
  </div>
  <div class="row">
    <label>${t.edAcName}</label>
    <input class="txt-inp" type="text" id="inp-room-label-${i}" placeholder="${defLbl}" value="${ent.label||''}"/>
  </div>
  <div class="row">
    <label>${t.edAcIcon}</label>
    <input class="txt-inp" type="text" id="inp-room-icon-${i}" placeholder="${defIco}" value="${ent.icon||''}"/>
  </div>
  <div class="row">
    <label>${t.edAcImage || '🖼 Ảnh phòng (URL)'}</label>
    <div style="display:flex;gap:8px;align-items:center;">
      <input class="txt-inp" type="text" id="inp-room-image-${i}"
        placeholder="https://... hoặc /local/..."
        value="${ent.image||''}"
        style="flex:1;min-width:0;"/>
      ${ent.image ? `<div id="img-preview-${i}" style="width:48px;height:36px;border-radius:6px;overflow:hidden;flex-shrink:0;border:1px solid var(--divider-color);">
        <img src="${ent.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentNode.style.display='none'"/>
      </div>` : `<div id="img-preview-${i}" style="display:none"></div>`}
    </div>
  </div>
</div>`;
    }

    this.shadowRoot.innerHTML = `
<style>
  :host { display:block; font-family:var(--primary-font-family,'Roboto',sans-serif); }
  .editor { background:var(--card-background-color,#fff); color:var(--primary-text-color); }
  .credit { display:flex;align-items:center;gap:8px;padding:12px 16px 8px;font-size:12px;
            color:var(--primary-color);font-weight:500;border-bottom:1px solid var(--divider-color); }
  /* accordion */
  .acc-wrap { border-bottom:1px solid var(--divider-color); }
  .acc-head { display:flex;align-items:center;gap:10px;padding:14px 16px;cursor:pointer;
              user-select:none;font-size:14px;font-weight:500;color:var(--primary-text-color);
              background:var(--secondary-background-color); }
  .acc-head:hover { filter:brightness(.96); }
  .acc-head ha-icon { color:var(--secondary-text-color);--mdi-icon-size:18px; }
  .acc-arrow { margin-left:auto;font-size:14px;color:var(--secondary-text-color); }
  .acc-body { padding:12px 14px;border-top:1px solid var(--divider-color);
              background:var(--card-background-color,#fff); }
  /* fields */
  .row { display:flex;flex-direction:column;margin-bottom:12px; }
  .row:last-child { margin-bottom:0; }
  .row label { font-size:12px;color:var(--secondary-text-color);margin-bottom:4px;font-weight:600; }
  ha-entity-picker { display:block;width:100%; }
  /* language */
  .lang-grid { display:flex;flex-wrap:wrap;gap:6px; }
  .lang-btn { display:flex;align-items:center;gap:5px;padding:7px 10px;border-radius:8px;
              border:1.5px solid var(--divider-color);background:var(--secondary-background-color);
              cursor:pointer;font-size:12px;color:var(--primary-text-color);transition:all .2s; }
  .lang-btn.on { border-color:var(--primary-color);background:rgba(3,169,244,.12);
                 color:var(--primary-color);font-weight:700; }
  /* AC room rows */
  .ac-row { background:var(--secondary-background-color);border:1px solid var(--divider-color);
            border-radius:10px;padding:12px;margin-bottom:10px;display:flex;flex-direction:column;gap:8px; }
  .ac-row:last-child { margin-bottom:0; }
  .ac-row-title { font-size:12px;font-weight:700;color:var(--primary-color);margin-bottom:2px; }
  /* text inputs */
  .txt-inp { background:var(--input-fill-color,rgba(0,0,0,.04));border:1px solid var(--divider-color);
             border-radius:8px;padding:8px 12px;font-size:13px;color:var(--primary-text-color);
             width:100%;box-sizing:border-box; }
  .txt-inp:focus { outline:none;border-color:var(--primary-color); }
  /* bg presets */
  .bg-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:10px; }
  .bgs { border-radius:7px;height:40px;cursor:pointer;border:2px solid transparent;
         display:flex;align-items:flex-end;padding:3px 5px;font-size:9px;font-family:monospace;
         color:rgba(255,255,255,.85);text-shadow:0 1px 3px rgba(0,0,0,.9);transition:border-color .15s;
         white-space:nowrap;overflow:hidden; }
  .bgs.on { border-color:var(--primary-color); }
  /* color picker */
  .ci { border:1px solid var(--divider-color);border-radius:8px;overflow:hidden;margin-bottom:8px; }
  .ci:last-child { margin-bottom:0; }
  .ci-hdr { display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;
            background:var(--card-background-color,#fff); }
  .ci-swatch { width:24px;height:24px;border-radius:4px;border:1px solid rgba(0,0,0,.1);flex-shrink:0; }
  .ci-label { font-size:13px;flex:1;color:var(--primary-text-color); }
  .ci-code { font-size:11px;color:var(--secondary-text-color);font-family:monospace;
             background:var(--secondary-background-color);padding:2px 6px;border-radius:3px; }
  .ci-chv { color:var(--secondary-text-color);flex-shrink:0; }
  .ci-body { padding:12px 14px;background:var(--secondary-background-color);
             border-top:1px solid var(--divider-color);display:flex;flex-direction:column;gap:10px; }
  .ci-native { width:100%;height:44px;border:1px solid var(--divider-color);border-radius:6px;
               cursor:pointer;padding:2px;background:transparent; }
  .ci-hex-wrap { display:flex;align-items:center;gap:6px;border:1px solid var(--divider-color);
                 border-radius:4px;padding:6px 10px;background:var(--card-background-color,#fff); }
  .ci-hash { color:var(--secondary-text-color);font-size:12px;font-family:monospace; }
  .ci-hex-inp { border:none;outline:none;width:100%;font-size:14px;
                color:var(--primary-text-color);font-family:monospace;background:transparent; }
  .ci-swatches { display:flex;gap:6px;flex-wrap:wrap; }
  .ci-dot { width:24px;height:24px;border-radius:50%;cursor:pointer;
            transition:transform .1s;outline-offset:2px; }
  .ci-dot:hover { transform:scale(1.15); }
</style>
<div class="editor">
  <div class="credit">❄️ <strong>Multi Air Conditioner Card</strong>
    <span style="color:var(--secondary-text-color);font-weight:400;">v1.7.2 Designed by @doanlong1412 from 🇻🇳 Vietnam</span>
  </div>
  <a href="https://www.tiktok.com/@long.1412" target="_blank" rel="noopener noreferrer"
    style="display:flex;align-items:center;gap:8px;margin:6px 0 10px;padding:8px 14px;
      border-radius:10px;text-decoration:none;cursor:pointer;
      background:linear-gradient(135deg,rgba(0,0,0,0.85) 0%,rgba(30,20,40,0.92) 100%);
      border:1px solid rgba(255,255,255,0.08);
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      transition:transform .15s,box-shadow .15s;"
    onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.4)'"
    onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'">
    <!-- TikTok logo SVG -->
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
      <path d="M27.2 7.2a7.6 7.6 0 0 1-7.6-7.6h-5v21.5a3.6 3.6 0 1 1-3.6-3.6c.33 0 .65.05.96.13V12.5a8.6 8.6 0 1 0 8.24 8.6V11.5a12.6 12.6 0 0 0 7.6 2.5V8.6a7.66 7.66 0 0 1-.54-.01z" fill="white"/>
      <path d="M27.2 7.2a7.6 7.6 0 0 1-7.6-7.6h-3v21.5a3.6 3.6 0 1 1-2.6-3.46V12.5a8.6 8.6 0 1 0 7.6 8.6V11.5a12.6 12.6 0 0 0 5.6 1.5V8.6a7.6 7.6 0 0 1 0 0z" fill="#69C9D0" fill-opacity="0.5"/>
      <path d="M13 21.1a3.6 3.6 0 1 0 3.6 3.6V3.6h-3v20.95a3.61 3.61 0 0 0-.6-.45z" fill="#EE1D52" fill-opacity="0.6"/>
    </svg>
    <div style="flex:1;min-width:0;">
      <div style="font-size:12px;font-weight:700;color:#ffffff;letter-spacing:.2px;line-height:1.3;">TikTok Channel</div>
      <div style="font-size:10.5px;color:rgba(255,255,255,0.6);line-height:1.3;">Xem thêm &amp; Follow @long.1412</div>
    </div>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;opacity:0.45;">
      <path d="M9 18l6-6-6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>

  <!-- 0. Owner name -->
  <div class="row" style="margin-bottom:4px;">
    <label style="font-size:12px;font-weight:600;color:var(--secondary-text-color);letter-spacing:.3px;">${t.edOwnerName}</label>
    <input id="inp-owner-name" type="text" placeholder="Smart Home"
      value="${this._config.owner_name || ''}"
      style="width:100%;margin-top:6px;padding:8px 10px;border-radius:8px;
        border:1px solid var(--divider-color);background:var(--card-background-color,#fff);
        color:var(--primary-text-color);font-size:14px;font-family:inherit;box-sizing:border-box;outline:none;">
  </div>

  <!-- 1. Language -->
  <div class="acc-wrap">
    <div class="acc-head" id="head-lang">
      <ha-icon icon="mdi:translate"></ha-icon> ${t.edLang}
      <span class="acc-arrow" id="arrow-lang">${this._open.lang?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-lang" style="display:${this._open.lang?'block':'none'}">
      <div class="lang-grid">
        ${Object.entries(AC_TRANSLATIONS).map(([code,tr])=>`
          <div class="lang-btn ${lang===code?'on':''}" data-lang="${code}">
            <img src="https://flagcdn.com/20x15/${tr.flag}.png" width="20" height="15" alt="${tr.lang}" style="border-radius:2px;flex-shrink:0;display:block;">
            ${tr.lang}
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- 1b. View mode toggle -->
  <div class="acc-wrap">
    <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;">
      <ha-icon icon="mdi:view-split-vertical" style="color:var(--secondary-text-color);--mdi-icon-size:18px;"></ha-icon>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--primary-text-color);">${t.edViewMode}</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button id="vm-full" style="padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;outline:none;font-family:inherit;transition:all 0.15s;
          border:1px solid ${(this._config.view_mode||'full')==='full' ? 'var(--primary-color)' : 'var(--divider-color)'};
          background:${(this._config.view_mode||'full')==='full' ? 'var(--primary-color)' : 'transparent'};
          color:${(this._config.view_mode||'full')==='full' ? '#fff' : 'var(--secondary-text-color)'};">${t.edViewModeFull}</button>
        <button id="vm-lite" style="padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;outline:none;font-family:inherit;transition:all 0.15s;
          border:1px solid ${(this._config.view_mode)==='lite' ? 'var(--primary-color)' : 'var(--divider-color)'};
          background:${(this._config.view_mode)==='lite' ? 'var(--primary-color)' : 'transparent'};
          color:${(this._config.view_mode)==='lite' ? '#fff' : 'var(--secondary-text-color)'};">${t.edViewModeLite}</button>
        <button id="vm-super-lite" style="padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;outline:none;font-family:inherit;transition:all 0.15s;
          border:1px solid ${(this._config.view_mode)==='super_lite' ? 'var(--primary-color)' : 'var(--divider-color)'};
          background:${(this._config.view_mode)==='super_lite' ? 'var(--primary-color)' : 'transparent'};
          color:${(this._config.view_mode)==='super_lite' ? '#fff' : 'var(--secondary-text-color)'};">⚡ Super Lite</button>
      </div>
    </div>
  </div>

  <!-- 1b-2. Popup style (chỉ hiện khi Super Lite) -->
  ${(this._config.view_mode) === 'super_lite' ? `
  <div class="acc-wrap">
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--secondary-background-color);">
      <ha-icon icon="mdi:animation-play" style="color:var(--secondary-text-color);--mdi-icon-size:18px;"></ha-icon>
      <div style="flex:1;font-size:13px;font-weight:600;color:var(--primary-text-color);">${t.edPopupStyle || '✨ Popup style'}</div>
      <div style="display:flex;gap:6px;">
        <button id="ps-normal" style="padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;outline:none;font-family:inherit;transition:all 0.15s;
          border:1px solid ${(this._config.popup_style||'normal')==='normal' ? 'var(--primary-color)' : 'var(--divider-color)'};
          background:${(this._config.popup_style||'normal')==='normal' ? 'var(--primary-color)' : 'transparent'};
          color:${(this._config.popup_style||'normal')==='normal' ? '#fff' : 'var(--secondary-text-color)'};">${t.edPopupNormal || 'Normal'}</button>
        <button id="ps-effect" style="padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;outline:none;font-family:inherit;transition:all 0.15s;
          border:1px solid ${(this._config.popup_style)==='effect' ? 'var(--primary-color)' : 'var(--divider-color)'};
          background:${(this._config.popup_style)==='effect' ? 'var(--primary-color)' : 'transparent'};
          color:${(this._config.popup_style)==='effect' ? '#fff' : 'var(--secondary-text-color)'};">${t.edPopupEffect || 'Effect'}</button>
        <button id="ps-wave" style="padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;outline:none;font-family:inherit;transition:all 0.15s;
          border:1px solid ${(this._config.popup_style)==='wave' ? 'var(--primary-color)' : 'var(--divider-color)'};
          background:${(this._config.popup_style)==='wave' ? 'var(--primary-color)' : 'transparent'};
          color:${(this._config.popup_style)==='wave' ? '#fff' : 'var(--secondary-text-color)'};">${t.edPopupWave || 'Wave'}</button>
      </div>
    </div>
  </div>

  <!-- 1b-3. Fan/Swing in Super Lite (chỉ hiện khi Super Lite) -->
  <div class="acc-wrap" style="margin-top:4px">
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--secondary-background-color);">
      <ha-icon icon="mdi:fan" style="color:var(--secondary-text-color);--mdi-icon-size:18px;"></ha-icon>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--primary-text-color);">${t.edShowSlFan || '💨 Fan speed (Super Lite)'}</div>
        <div style="font-size:11px;color:var(--secondary-text-color);margin-top:2px">${t.edShowSlFanDesc || 'Show fan button in Super Lite'}</div>
      </div>
      <label style="position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0">
        <input type="checkbox" id="tog-show-sl-fan" ${this._config.show_sl_fan !== false ? 'checked' : ''} style="opacity:0;width:0;height:0;position:absolute">
        <span style="position:absolute;inset:0;border-radius:20px;cursor:pointer;transition:0.25s;background:${this._config.show_sl_fan !== false ? 'var(--primary-color)' : 'rgba(0,0,0,0.18)'}"></span>
        <span style="position:absolute;top:2px;left:${this._config.show_sl_fan !== false ? '18px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></span>
      </label>
    </div>
  </div>
  <div class="acc-wrap" style="margin-top:4px">
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--secondary-background-color);">
      <ha-icon icon="mdi:arrow-oscillating" style="color:var(--secondary-text-color);--mdi-icon-size:18px;"></ha-icon>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--primary-text-color);">${t.edShowSlSwing || '🔄 Airflow (Super Lite)'}</div>
        <div style="font-size:11px;color:var(--secondary-text-color);margin-top:2px">${t.edShowSlSwingDesc || 'Show airflow button in Super Lite'}</div>
      </div>
      <label style="position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0">
        <input type="checkbox" id="tog-show-sl-swing" ${this._config.show_sl_swing !== false ? 'checked' : ''} style="opacity:0;width:0;height:0;position:absolute">
        <span style="position:absolute;inset:0;border-radius:20px;cursor:pointer;transition:0.25s;background:${this._config.show_sl_swing !== false ? 'var(--primary-color)' : 'rgba(0,0,0,0.18)'}"></span>
        <span style="position:absolute;top:2px;left:${this._config.show_sl_swing !== false ? '18px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></span>
      </label>
    </div>
  </div>` : ''}

  <!-- 1c. Display Options accordion -->
  <div class="acc-wrap">
    <div class="acc-head" id="head-display">
      <ha-icon icon="mdi:eye-settings-outline"></ha-icon> ${t.edDisplay}
      <span class="acc-arrow" id="arrow-display">${this._open.display?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-display" style="display:${this._open.display?'block':'none'}">
      ${[
        ['show_greet',        t.edShowGreet,       t.edShowGreetDesc],
        null,
        ['show_cool',         t.edShowCool,        ''],
        ['show_heat',         t.edShowHeat,        ''],
        ['show_dry',          t.edShowDry,         ''],
        ['show_fan_only',     t.edShowFanOnly,     ''],
        ['show_auto',         t.edShowAuto || '🔄 Auto mode', ''],
        null,
        ['show_fan',          t.edShowFan,         t.edShowFanDesc],
        ['show_swing',        t.edShowSwing,       t.edShowSwingDesc],
        ['show_preset_bar',   t.edShowPreset,      t.edShowPresetDesc],
        null,
        ['show_status',       t.edShowStatus,      t.edShowStatusDesc],
        ['show_outdoor_temp', t.edShowOutdoorTemp, ''],
        ['show_humidity',     t.edShowHumidity,    ''],
        ['show_power',        t.edShowPower,       ''],
        null,
        ['show_all_off',      t.edShowAllOff,      t.edShowAllOffDesc],
        ['show_timer',        t.edShowTimer,        t.edShowTimerDesc],
        null,
        ['show_room_env',     t.edShowRoomEnv,      t.edShowRoomEnvDesc],
        ['show_sl_room_power',t.edShowSlRoomPower,  t.edShowSlRoomPowerDesc],
      ].map(item => {
        if (!item) return '<div style="height:1px;background:var(--divider-color,rgba(0,0,0,0.08));margin:4px 0;"></div>';
        const [key, label, desc] = item;
        const checked = this._config[key] !== false;
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 2px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:12.5px;font-weight:500;color:var(--primary-text-color);">${label}</div>
            ${desc ? `<div style="font-size:10.5px;color:var(--secondary-text-color);margin-top:1px;">${desc}</div>` : ''}
          </div>
          <label style="position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0;margin:0;">
            <input type="checkbox" class="disp-tog" data-key="${key}" ${checked ? 'checked' : ''}
              style="opacity:0;width:0;height:0;position:absolute;">
            <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;
              background:${checked ? 'var(--primary-color,#03a9f4)' : 'rgba(0,0,0,0.2)'};
              border-radius:20px;transition:background 0.2s;border:1px solid var(--divider-color);">
              <span style="position:absolute;height:14px;width:14px;border-radius:50%;background:#fff;
                top:2px;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.3);
                left:${checked ? '19px' : '2px'};"></span>
            </span>
          </label>
        </div>`;
      }).join('')}
      <div style="margin-top:10px;padding:8px 2px;display:flex;align-items:center;gap:10px;">
        <div style="flex:1;font-size:12.5px;font-weight:500;color:var(--primary-text-color);">${t.edPowerUnit || '⚡ Power unit'}</div>
        <select id="sel-power-unit" style="background:var(--secondary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:8px;padding:4px 8px;font-size:12px;cursor:pointer;">
          <option value="kw" ${(this._config.power_unit||'kw')==='kw'?'selected':''}>${t.edPowerUnitKw||'kW'}</option>
          <option value="w"  ${(this._config.power_unit||'kw')==='w' ?'selected':''}>${t.edPowerUnitW ||'W' }</option>
        </select>
      </div>
      <div style="margin-top:8px;padding:8px 2px;display:flex;align-items:center;gap:10px;">
        <div style="flex:1;font-size:12.5px;font-weight:500;color:var(--primary-text-color);">${t.edTempUnit||'🌡 Temperature unit'}</div>
        <div style="display:flex;gap:4px;">
          <button id="tu-c" style="padding:4px 12px;border-radius:8px;border:1px solid ${(this._config.temp_unit||'C')==='C'?'var(--primary-color,#03a9f4)':'var(--divider-color)'};background:${(this._config.temp_unit||'C')==='C'?'rgba(3,169,244,0.15)':'transparent'};color:${(this._config.temp_unit||'C')==='C'?'var(--primary-color,#03a9f4)':'var(--secondary-text-color)'};font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;">°C</button>
          <button id="tu-f" style="padding:4px 12px;border-radius:8px;border:1px solid ${(this._config.temp_unit||'C')==='F'?'var(--primary-color,#03a9f4)':'var(--divider-color)'};background:${(this._config.temp_unit||'C')==='F'?'rgba(3,169,244,0.15)':'transparent'};color:${(this._config.temp_unit||'C')==='F'?'var(--primary-color,#03a9f4)':'var(--secondary-text-color)'};font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;">°F</button>
        </div>
      </div>
      <div style="height:1px;background:var(--divider-color,rgba(0,0,0,0.08));margin:6px 0;"></div>
      <div style="padding:8px 2px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div>
            <div style="font-size:12.5px;font-weight:500;color:var(--primary-text-color);">${t.edCoolAnimSpeed||'❄ Snowflake repeat (s)'}</div>
            <div style="font-size:10.5px;color:var(--secondary-text-color);margin-top:1px;">${t.edCoolAnimSpeedDesc||'Wait between animations (2–15s)'}</div>
          </div>
          <span id="cool-anim-speed-val" style="font-size:13px;font-weight:700;color:var(--primary-color,#03a9f4);min-width:28px;text-align:right;">${Math.round((this._config.cool_anim_speed||10000)/1000)}s</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:10px;color:var(--secondary-text-color);">2s</span>
          <input type="range" id="inp-cool-anim-speed" min="2000" max="15000" step="500"
            value="${this._config.cool_anim_speed||10000}"
            style="flex:1;accent-color:var(--primary-color,#03a9f4);height:4px;cursor:pointer;">
          <span style="font-size:10px;color:var(--secondary-text-color);">15s</span>
        </div>
      </div>
    </div>
  </div>
  <div class="acc-wrap">
    <div class="acc-head" id="head-roomcount">
      <ha-icon icon="mdi:home-group"></ha-icon> ${t.edRoomsHeader(roomCount)}
      <span class="acc-arrow" id="arrow-roomcount">${this._open.roomcount?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-roomcount" style="display:${this._open.roomcount?'block':'none'}">
      <div class="row">
        <label style="margin-bottom:8px;">${t.edRoomCountLabel(roomCount)}</label>
        <div style="display:flex;align-items:center;gap:12px;">
          <input type="range" id="inp-room-count" min="1" max="8" step="1" value="${roomCount}"
            style="flex:1;height:4px;cursor:pointer;accent-color:var(--primary-color);">
          <span id="room-count-display" style="min-width:24px;font-weight:700;font-size:16px;color:var(--primary-color);">${roomCount}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--secondary-text-color);margin-top:4px;">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. Rooms -->
  <div class="acc-wrap">
    <div class="acc-head" id="head-rooms">
      <ha-icon icon="mdi:air-conditioner"></ha-icon> ${t.edRoomsHeader(roomCount)}
      <span class="acc-arrow" id="arrow-rooms">${this._open.rooms?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-rooms" style="display:${this._open.rooms?'block':'none'}">
      ${roomRows}
    </div>
  </div>

  <!-- 3. Sensors -->
  <div class="acc-wrap">
    <div class="acc-head" id="head-sensors">
      <ha-icon icon="mdi:broadcast"></ha-icon> ${t.edSensors}
      <span class="acc-arrow" id="arrow-sensors">${this._open.sensors?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-sensors" style="display:${this._open.sensors?'block':'none'}">
      ${this._entityField('pm25_entity',           t.edPm25,        'sensor')}
      ${this._entityField('outdoor_temp_entity',   t.edOutdoorTemp, 'sensor')}
      ${this._entityField('humidity_entity',       t.edHumidity,    'sensor')}
      ${this._entityField('power_entity',          t.edPower,       'sensor')}
    </div>
  </div>

  <!-- 5. Background -->
  <div class="acc-wrap">
    <div class="acc-head" id="head-bg">
      <ha-icon icon="mdi:palette"></ha-icon> ${t.edBg}
      <span class="acc-arrow" id="arrow-bg">${this._open.bg?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-bg" style="display:${this._open.bg?'block':'none'}">
      <div style="font-size:11px;font-weight:700;color:var(--secondary-text-color);margin-bottom:8px;letter-spacing:.4px;">${t.bgPresets}</div>
      <div class="bg-grid">
        ${AC_BG_PRESETS.map(p => {
          const c1 = p.c1||'#888', c2 = p.c2||'#444';
          const isC = p.id === 'custom';
          return `<div class="bgs ${bgP===p.id?'on':''}" data-bg="${p.id}"
            style="${isC?'background:linear-gradient(135deg,#e0e0e0,#bdbdbd);color:#555;text-shadow:none;':'background:linear-gradient(135deg,'+c1+'bb 0%,'+c2+'44 100%);'}">${p.label}</div>`;
        }).join('')}
      </div>
      ${bgP === 'custom' ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        ${this._colorRow('bg_color1', t.color1)}
        ${this._colorRow('bg_color2', t.color2)}
      </div>` : ''}

      <!-- Opacity slider -->
      <div style="margin-top:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:12px;font-weight:600;color:var(--secondary-text-color);">
            ${t.edBgAlpha||'🔆 Background opacity'}
          </span>
          <span id="bg-alpha-val-lbl" style="font-size:13px;font-weight:700;color:var(--primary-color);min-width:36px;text-align:right;">
            ${cfg.bg_alpha !== undefined ? cfg.bg_alpha : 80}%
          </span>
        </div>
        <input type="range" id="inp-bg-alpha" min="0" max="100" step="1"
          value="${cfg.bg_alpha !== undefined ? cfg.bg_alpha : 80}"
          style="width:100%;height:4px;cursor:pointer;accent-color:var(--primary-color);">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--secondary-text-color);margin-top:3px;">
          <span>0% (${t.edBgTransparent||'Transparent'})</span><span>100% (${t.edBgSolid||'Solid'})</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 5b. Advanced colors -->
  <div class="acc-wrap">
    <div class="acc-head" id="head-colors">
      <ha-icon icon="mdi:palette-swatch"></ha-icon> ${t.edColorsAdvanced||'🎨 Advanced colors'}
      <span class="acc-arrow" id="arrow-colors">${this._open.colors?'▾':'▸'}</span>
    </div>
    <div class="acc-body" id="body-colors" style="display:${this._open.colors?'block':'none'}">
      <div style="font-size:11px;color:var(--secondary-text-color);margin-bottom:10px;line-height:1.5;">
        ${t.edColorsDefault||'Leave blank = use default color. Applied in real time.'}
      </div>

      <div style="font-size:10px;font-weight:700;color:var(--secondary-text-color);letter-spacing:.5px;margin-bottom:6px;text-transform:uppercase;padding:4px 0;border-bottom:1px solid var(--divider-color);">${t.edColorsSecHeader||'📌 Header & Greeting'}</div>
      ${this._colorRow('color_title',      '📌 Chữ tiêu đề (AIRCONDITIONING)')}
      ${this._colorRow('color_greet_sub',  '🌅 Chữ lời chào (Goedemorgen,...)')}
      ${this._colorRow('color_greet_name', '🏷 Tên Smart Home')}

      <div style="font-size:10px;font-weight:700;color:var(--secondary-text-color);letter-spacing:.5px;margin:14px 0 6px;text-transform:uppercase;padding:4px 0;border-bottom:1px solid var(--divider-color);">${t.edColorsDial||'🌡 Temperature dial'}</div>
      ${this._colorRow('color_dial_lbl',  '🔠 Chữ NHIỆT ĐỘ / TEMPERATURE')}
      ${this._colorRow('color_comfort',   '💬 Chữ cảm giác (Momenteel uit...)')}
      ${this._colorRow('color_temp_set',  '🎯 Số nhiệt cần set (19.5°C)')}
      ${this._colorRow('color_eta',       '⏱ Dự kiến làm mát')}
      ${this._colorRow('color_dial_arc',  '〰 Vòng cung nhiệt độ')}

      <div style="font-size:10px;font-weight:700;color:var(--secondary-text-color);letter-spacing:.5px;margin:14px 0 6px;text-transform:uppercase;padding:4px 0;border-bottom:1px solid var(--divider-color);">${t.edColorsModeCtrl||'⚡ Modes & Controls'}</div>
      ${this._colorRow('color_mode_lbl',    '🔵 Chữ tên các chế độ')}
      ${this._colorRow('color_mode_active', '✅ Nút chế độ đang bật')}
      ${this._colorRow('color_fc_label',    '💨 Chữ TỐCĐỘQUẠT / LUCHTRICHTING')}
      ${this._colorRow('color_fc_val',      '💨 Giá trị tốc độ quạt (Auto...)')}
      ${this._colorRow('color_swing_lbl',   '🔄 Chữ hướng gió (Vast / Fixed...)')}
      ${this._colorRow('color_power_lbl',   '⏻ Chữ Bật / Tắt')}
      ${this._colorRow('color_timer_lbl',   '⏰ Chữ Hẹn giờ')}
      ${this._colorRow('color_alloff_lbl',  '🔴 Chữ Tắt tất cả')}

      <div style="font-size:10px;font-weight:700;color:var(--secondary-text-color);letter-spacing:.5px;margin:14px 0 6px;text-transform:uppercase;padding:4px 0;border-bottom:1px solid var(--divider-color);">${t.edColorsStatusRoom||'🏠 Status & Room tabs'}</div>
      ${this._colorRow('color_st_title',    '📊 Chữ TRẠNG THÁI')}
      ${this._colorRow('color_status_on',   '🟢 Chữ ĐANG CHẠY')}
      ${this._colorRow('color_status_off',  '⚫ Chữ TẮT')}
      ${this._colorRow('color_st_sub',      '💬 Chữ phụ trạng thái')}
      ${this._colorRow('color_room_header', '🏠 Chữ CHỌN PHÒNG')}
      ${this._colorRow('color_room_name',   '🏷 Tên phòng trong tab')}
      ${this._colorRow('color_room_on',     '🟩 Badge phòng BẬT')}
      ${this._colorRow('color_room_off',    '⬜ Badge phòng TẮT')}
      ${this._colorRow('color_fan_bar',     '📊 Thanh tốc độ quạt')}

      <div style="margin-top:14px;padding:8px 10px;background:var(--secondary-background-color);border-radius:8px;border:1px solid var(--divider-color);">
        <button id="btn-reset-colors" style="width:100%;padding:8px;border-radius:7px;border:1px solid var(--divider-color);background:transparent;color:var(--secondary-text-color);font-size:12px;cursor:pointer;font-family:inherit;">
          ${t.edColorsReset||'↩ Reset all colors to default'}
        </button>
      </div>
    </div>
  </div>
</div>`;

    this._bindEvents();
    this._syncPickers();
  }

  _bindEvents() {
    const sr = this.shadowRoot;

    // accordion
    ['lang','roomcount','rooms','sensors','bg','display','colors'].forEach(id => {
      const hdr = sr.getElementById('head-' + id);
      if (hdr) hdr.addEventListener('click', () => this._toggleSection(id));
    });

    // language buttons
    sr.querySelectorAll('[data-lang]').forEach(btn =>
      btn.addEventListener('click', () => {
        this._config = { ...this._config, language: btn.dataset.lang };
        this._fire();
        this._render();
      }));

    // bg preset tiles
    sr.querySelectorAll('[data-bg]').forEach(tile =>
      tile.addEventListener('click', () => {
        this._config = { ...this._config, background_preset: tile.dataset.bg };
        this._fire();
        this._render();
      }));

    // color picker header toggle
    sr.querySelectorAll('[data-cp]').forEach(hdr =>
      hdr.addEventListener('click', () => {
        const k = hdr.dataset.cp;
        this._picker = this._picker === k ? null : k;
        this._render();
      }));

    // native color input
    sr.querySelectorAll('[data-cp-native]').forEach(inp => {
      inp.addEventListener('input', () => {
        const ci   = inp.closest('.ci');
        const sw   = ci ? ci.querySelector('.ci-swatch') : null;
        const code = ci ? ci.querySelector('.ci-code') : null;
        const hex  = sr.querySelector(`[data-cp-hex="${inp.dataset.cpNative}"]`);
        if (sw)   sw.style.background = inp.value;
        if (code) code.textContent    = inp.value;
        if (hex)  hex.value           = inp.value.replace('#','');
        this._config[inp.dataset.cpNative] = inp.value;
        this._fire();
      });
      inp.addEventListener('change', () => {
        this._config[inp.dataset.cpNative] = inp.value;
        this._fire();
        this._render();
      });
    });

    // hex text input
    sr.querySelectorAll('[data-cp-hex]').forEach(inp =>
      inp.addEventListener('change', () => {
        const val = '#' + inp.value.replace('#','');
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          this._config[inp.dataset.cpHex] = val;
          this._fire();
          this._render();
        }
      }));

    // swatch dot
    sr.querySelectorAll('[data-cp-dot]').forEach(dot =>
      dot.addEventListener('click', () => {
        this._config[dot.dataset.cpDot] = dot.dataset.color;
        this._fire();
        this._render();
      }));

    // room count slider
    const rcSlider = sr.getElementById('inp-room-count');
    const rcDisplay = sr.getElementById('room-count-display');
    if (rcSlider) {
      rcSlider.addEventListener('input', () => {
        const val = parseInt(rcSlider.value);
        if (rcDisplay) rcDisplay.textContent = val;
        // update accordion header live
        const hdrRoomcount = sr.getElementById('head-roomcount');
        const hdrRooms = sr.getElementById('head-rooms');
        const t2 = this.t;
        if (hdrRoomcount) {
          const arr = sr.getElementById('arrow-roomcount');
          hdrRoomcount.innerHTML = `<ha-icon icon="mdi:home-group"></ha-icon> ${t2.edRoomsHeader(val)}<span class="acc-arrow" id="arrow-roomcount">${arr ? arr.textContent : '▸'}</span>`;
        }
        if (hdrRooms) {
          const arr2 = sr.getElementById('arrow-rooms');
          hdrRooms.innerHTML = `<ha-icon icon="mdi:air-conditioner"></ha-icon> ${t2.edRoomsHeader(val)}<span class="acc-arrow" id="arrow-rooms">${arr2 ? arr2.textContent : '▸'}</span>`;
        }
      });
      rcSlider.addEventListener('change', () => {
        const val = parseInt(rcSlider.value);
        this._config = { ...this._config, room_count: val };
        this._fire();
        this._render();
      });
    }

    // wireTextInput — update state mỗi keystroke, chỉ fire khi blur/Enter (tránh mất focus)
    const wireTextInput = (el, updater) => {
      if (!el) return;
      el.addEventListener('input',  () => updater(el.value));
      el.addEventListener('change', () => { updater(el.value); this._fire(); });
      el.addEventListener('blur',   () => { updater(el.value); this._fire(); });
      el.addEventListener('keydown', e => { if (e.key === 'Enter') el.blur(); });
    };

    // Owner name input
    wireTextInput(sr.getElementById('inp-owner-name'), val => {
      this._config = { ...this._config, owner_name: val };
    });

    // Room label + icon + image inputs
    const roomCountBind = Math.max(1, Math.min(8, parseInt(this._config.room_count) || 4));
    for (let i = 0; i < roomCountBind; i++) {
      const lblEl   = sr.getElementById('inp-room-label-' + i);
      const iconEl  = sr.getElementById('inp-room-icon-'  + i);
      const imageEl = sr.getElementById('inp-room-image-' + i);
      wireTextInput(lblEl, val => {
        const ents = (this._config.entities || []).slice();
        while (ents.length <= i) ents.push({});
        ents[i] = { ...ents[i], label: val };
        this._config = { ...this._config, entities: ents };
      });
      wireTextInput(iconEl, val => {
        const ents = (this._config.entities || []).slice();
        while (ents.length <= i) ents.push({});
        ents[i] = { ...ents[i], icon: val };
        this._config = { ...this._config, entities: ents };
      });
      // Image input — live preview update
      if (imageEl) {
        imageEl.addEventListener('input', () => {
          const ents = (this._config.entities || []).slice();
          while (ents.length <= i) ents.push({});
          ents[i] = { ...ents[i], image: imageEl.value };
          this._config = { ...this._config, entities: ents };
          // Live preview
          const prev = sr.getElementById('img-preview-' + i);
          if (prev) {
            if (imageEl.value) {
              prev.style.display = '';
              prev.innerHTML = `<img src="${imageEl.value}" style="width:100%;height:100%;object-fit:cover;border-radius:5px;" onerror="this.parentNode.style.display='none'"/>`;
            } else {
              prev.style.display = 'none';
            }
          }
        });
        imageEl.addEventListener('change', () => { this._fire(); });
        imageEl.addEventListener('blur',   () => { this._fire(); });
        imageEl.addEventListener('keydown', e => { if (e.key === 'Enter') imageEl.blur(); });
      }
    }

    // ha-entity-picker: room entities
    sr.querySelectorAll('ha-entity-picker[data-room]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const idx  = parseInt(picker.dataset.room);
        const val  = e.detail.value;
        const rcMax = Math.max(1, Math.min(8, parseInt(this._config.room_count) || 4));
        const ents = (this._config.entities || []).slice();
        while (ents.length <= idx) ents.push({});
        if (val) ents[idx] = { ...ents[idx], entity_id: val };
        else delete ents[idx].entity_id;
        this._config = { ...this._config, entities: ents };
        this._fire();
      }));

    // ha-entity-picker: room temp sensor
    sr.querySelectorAll('ha-entity-picker[data-room-temp]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const idx = parseInt(picker.dataset.roomTemp);
        const val = e.detail.value;
        const ents = (this._config.entities || []).slice();
        while (ents.length <= idx) ents.push({});
        if (val) ents[idx] = { ...ents[idx], temp_entity: val };
        else delete ents[idx].temp_entity;
        this._config = { ...this._config, entities: ents };
        this._fire();
      }));

    // ha-entity-picker: room humidity sensor
    sr.querySelectorAll('ha-entity-picker[data-room-hum]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const idx = parseInt(picker.dataset.roomHum);
        const val = e.detail.value;
        const ents = (this._config.entities || []).slice();
        while (ents.length <= idx) ents.push({});
        if (val) ents[idx] = { ...ents[idx], humidity_entity: val };
        else delete ents[idx].humidity_entity;
        this._config = { ...this._config, entities: ents };
        this._fire();
      }));

    // ha-entity-picker: room power sensor
    sr.querySelectorAll('ha-entity-picker[data-room-power]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const idx = parseInt(picker.dataset.roomPower);
        const val = e.detail.value;
        const ents = (this._config.entities || []).slice();
        while (ents.length <= idx) ents.push({});
        if (val) ents[idx] = { ...ents[idx], power_entity: val };
        else delete ents[idx].power_entity;
        this._config = { ...this._config, entities: ents };
        this._fire();
      }));

    // power unit select
    const selPowerUnit = sr.getElementById('sel-power-unit');
    if (selPowerUnit) selPowerUnit.addEventListener('change', () => {
      this._config = { ...this._config, power_unit: selPowerUnit.value };
      this._fire(); this._render();
    });

    // temperature unit toggle (°C / °F)
    const tuC = sr.getElementById('tu-c');
    const tuF = sr.getElementById('tu-f');
    if (tuC) tuC.addEventListener('click', () => {
      this._config = { ...this._config, temp_unit: 'C' };
      this._fire(); this._render();
    });
    if (tuF) tuF.addEventListener('click', () => {
      this._config = { ...this._config, temp_unit: 'F' };
      this._fire(); this._render();
    });

    // cool anim speed slider
    const sliderCoolSpeed = sr.getElementById('inp-cool-anim-speed');
    if (sliderCoolSpeed) {
      // Helper: tìm card element anh em trong cùng hui-card-element và restart animation
      const _restartCardAnim = (val) => {
        try {
          // Editor nằm trong ha-more-info-dialog hoặc lovelace editor — leo ngược DOM
          let node = this.getRootNode();
          // Tìm card element qua document hoặc shadowRoot chain
          const findCard = (root) => {
            if (!root) return null;
            const c = root.querySelector && root.querySelector('multi-air-conditioner-card');
            if (c) return c;
            if (root.host) return findCard(root.host.getRootNode());
            return null;
          };
          const card = findCard(node) || findCard(node && node.host && node.host.getRootNode());
          if (card && card._cas) {
            if (card._cas.phase === 'wait') {
              card._cas = null;  // restart ngay
            } else {
              card._cas.repeatMs = Math.min(15000, Math.max(2000, val));
            }
          }
        } catch(e) { /* silent */ }
      };
      sliderCoolSpeed.addEventListener('input', () => {
        const val = parseInt(sliderCoolSpeed.value);
        const lbl = sr.getElementById('cool-anim-speed-val');
        if (lbl) lbl.textContent = Math.round(val/1000) + 's';
        this._config = { ...this._config, cool_anim_speed: val };
        this._fire();
        _restartCardAnim(val);
      });
      sliderCoolSpeed.addEventListener('change', () => {
        const val = parseInt(sliderCoolSpeed.value);
        this._config = { ...this._config, cool_anim_speed: val };
        this._fire();
        _restartCardAnim(val);
      });
    }

    // ha-entity-picker: sensor entities
    sr.querySelectorAll('ha-entity-picker[data-key]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const k = picker.dataset.key;
        const v = e.detail.value;
        const c = { ...this._config };
        if (v) c[k] = v; else delete c[k];
        this._config = c;
        this._fire();
      }));

    // opacity slider
    const bgAlphaSlider = sr.getElementById('inp-bg-alpha');
    if (bgAlphaSlider) {
      bgAlphaSlider.addEventListener('input', () => {
        const lbl = sr.getElementById('bg-alpha-val-lbl');
        if (lbl) lbl.textContent = bgAlphaSlider.value + '%';
        this._config = { ...this._config, bg_alpha: parseInt(bgAlphaSlider.value) };
        this._fire();
      });
      bgAlphaSlider.addEventListener('change', () => {
        this._config = { ...this._config, bg_alpha: parseInt(bgAlphaSlider.value) };
        this._fire();
      });
    }

    // reset colors button
    const btnResetColors = sr.getElementById('btn-reset-colors');
    if (btnResetColors) btnResetColors.addEventListener('click', () => {
      const resetKeys = ['accent_color','text_color',
        'color_title','color_greet_sub','color_greet_name',
        'color_dial_lbl','color_temp_val','color_comfort','color_dial_arc','color_temp_set','color_eta',
        'color_mode_lbl','color_mode_active','color_fc_label','color_fc_val','color_swing_lbl',
        'color_power_lbl','color_timer_lbl','color_alloff_lbl',
        'color_st_title','color_status_on','color_status_off','color_st_sub',
        'color_room_header','color_room_name','color_room_on','color_room_off','color_fan_bar'];
      const c = { ...this._config };
      resetKeys.forEach(k => { delete c[k]; });
      c.accent_color = '#00ffcc';
      c.text_color   = '#ffffff';
      c.bg_alpha = 80;
      this._config = c;
      this._fire();
      this._render();
    });

    // display options toggles
    sr.querySelectorAll('.disp-tog').forEach(tog => {
      tog.addEventListener('change', () => {
        this._config = { ...this._config, [tog.dataset.key]: tog.checked };
        this._fire();
        this._render();
      });
    });

    // view mode toggle
    const vmFull = sr.getElementById('vm-full');
    const vmLite = sr.getElementById('vm-lite');
    const vmSuperLite = sr.getElementById('vm-super-lite');
    if (vmFull) vmFull.addEventListener('click', () => {
      this._config = { ...this._config, view_mode: 'full' };
      this._fire(); this._render();
    });
    if (vmLite) vmLite.addEventListener('click', () => {
      this._config = { ...this._config, view_mode: 'lite' };
      this._fire(); this._render();
    });
    if (vmSuperLite) vmSuperLite.addEventListener('click', () => {
      this._config = { ...this._config, view_mode: 'super_lite' };
      this._fire(); this._render();
    });

    // popup style buttons (Super Lite only)
    const psNormal = sr.getElementById('ps-normal');
    const psEffect = sr.getElementById('ps-effect');
    if (psNormal) psNormal.addEventListener('click', () => {
      this._config = { ...this._config, popup_style: 'normal' };
      this._fire(); this._render();
    });
    if (psEffect) psEffect.addEventListener('click', () => {
      this._config = { ...this._config, popup_style: 'effect' };
      this._fire(); this._render();
    });
    const psWave = sr.getElementById('ps-wave');
    if (psWave) psWave.addEventListener('click', () => {
      this._config = { ...this._config, popup_style: 'wave' };
      this._fire(); this._render();
    });
    const togSlFan = sr.getElementById('tog-show-sl-fan');
    if (togSlFan) togSlFan.addEventListener('change', () => {
      this._config = { ...this._config, show_sl_fan: togSlFan.checked };
      this._fire(); this._render();
    });
    const togSlSwing = sr.getElementById('tog-show-sl-swing');
    if (togSlSwing) togSlSwing.addEventListener('change', () => {
      this._config = { ...this._config, show_sl_swing: togSlSwing.checked };
      this._fire(); this._render();
    });
    const togSlRoomPower = sr.getElementById('tog-show-sl-room-power');
    if (togSlRoomPower) togSlRoomPower.addEventListener('change', () => {
      this._config = { ...this._config, show_sl_room_power: togSlRoomPower.checked };
      this._fire(); this._render();
    });
  }
}

customElements.define('multi-air-conditioner-card-editor', MultiAcCardEditor);

customElements.define('multi-air-conditioner-card', AcControllerCardV2);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'multi-air-conditioner-card',
  name: 'Multi Air Conditioner Card',
  description: 'Multi-room air conditioner card with live sensor data, full editor and 10-language support. By @doanlong1412',
  preview: true,
});
