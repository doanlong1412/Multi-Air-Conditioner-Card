/**
 * Multi Air Conditioner Card
 * v1.4 Designed by @doanlong1412 from 🇻🇳 Vietnam
 * HACS-compatible Web Component
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
    airGood: 'Chất lượng không khí tốt', pressOn: 'Nhấn nguồn để bật',
    dustLabel: 'Bụi mịn',
    fanLabel: 'Tốc độ quạt', swingLabel: 'Hướng gió',
    allOff: 'Tắt tất cả', allOffSub: 'Nhấn để tắt mọi phòng',
    tapOff: 'Nhấn để tắt', tapOn: 'Nhấn để bật',
    confirmOff: '⚠ Tắt tất cả?', confirmSub: function(n) { return 'Sẽ tắt ' + n + ' điều hòa cùng lúc'; },
    cancel: 'Hủy', doOff: '⏻ Tắt hết',
    overlayOn: 'ĐANG BẬT', overlayOff: 'TẮT',
    modes: { cool:'Làm lạnh', heat:'Sưởi', dry:'Hút ẩm', fan_only:'Quạt', off:'Tắt' },
    fans:   ['Tự động','Thấp','Vừa','Cao'],
    swings: ['Cố định','Lên xuống','Trái phải','Tất cả'],
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
    edShowDry: '💧 Hút ẩm (Dry)', edShowFanOnly: '🌀 Quạt (Fan)',
    edShowFan: 'Tốc độ quạt', edShowFanDesc: 'Hiện bảng điều chỉnh tốc độ quạt',
    edShowSwing: 'Hướng gió', edShowSwingDesc: 'Hiện bảng điều chỉnh hướng gió',
    edShowPreset: 'Thanh Eco/Fav/Clean', edShowPresetDesc: 'Hiện dòng Eco · Fav · Clean',
    edShowStatus: 'Bảng trạng thái', edShowStatusDesc: 'Hiện khối trạng thái & cảm biến bên phải',
    edShowAllOff: 'Nút Tắt tất cả', edShowAllOffDesc: 'Hiện nút tắt toàn bộ điều hòa',
    edShowTimer: 'Nút Hẹn giờ', edShowTimerDesc: 'Hiện nút hẹn giờ tắt/bật',
    edShowRoomEnv: 'Nhiệt độ/Độ ẩm phòng', edShowRoomEnvDesc: 'Hiện nhiệt độ & độ ẩm phòng đang chọn (Super Lite)',
    edShowOutdoorTemp: 'Nhiệt độ ngoài trời', edShowHumidity: 'Độ ẩm', edShowPower: 'Công suất (kW)',
    edRoomCountLabel: function(n) { return '🏠 Số lượng phòng (1–8, mặc định 4)'; },
    edRoomsHeader: function(n) { return '❄ Điều hòa (' + n + ' phòng)'; },
    edRooms: '❄ Điều hòa',
    edSensors: '📡 Cảm biến môi trường',
    edColors: 'Màu sắc',
    edBg: 'Màu nền',
    edAcEntity: '❄ Entity điều hòa (climate.*)',
    edAcName: '🏷 Tên hiển thị',
    edAcIcon: '🎨 Icon (emoji)',
    edAcImage: '🖼 Ảnh phòng (URL)',
    edRoomTempEntity: '🌡 Cảm biến nhiệt độ phòng (nếu điều hòa không có)',
    edRoomHumidityEntity: '💧 Cảm biến độ ẩm phòng (nếu điều hòa không có)',
    edVaneVertical: '↕ Cánh gió dọc (input_select)',
    edVaneHorizontal: '↔ Cánh gió ngang (input_select)',
    edPm25: '🌫 Bụi mịn PM2.5',
    edOutdoorTemp: '🌡 Nhiệt độ ngoài trời',
    edHumidity: '💧 Độ ẩm ngoài trời',
    edPower: '⚡ Tiêu thụ điện (kW)',
    edVaneVerticalGlobal: '↕ Cánh gió dọc (mặc định)',
    edVaneHorizontalGlobal: '↔ Cánh gió ngang (mặc định)',
    rooms: ['Phòng khách','Phòng ngủ','Phòng ăn','Văn phòng'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Air quality is good', pressOn: 'Press power to turn on',
    dustLabel: 'Fine dust',
    fanLabel: 'Fan speed', swingLabel: 'Airflow',
    allOff: 'Turn all off', allOffSub: 'Tap to turn off all rooms',
    tapOff: 'Tap to turn off', tapOn: 'Tap to turn on',
    confirmOff: '⚠ Turn all off?', confirmSub: function(n) { return 'Will turn off ' + n + ' AC units at once'; },
    cancel: 'Cancel', doOff: '⏻ Turn all off',
    overlayOn: 'ON', overlayOff: 'OFF',
    modes: { cool:'Cool', heat:'Heat', dry:'Dry', fan_only:'Fan', off:'Off' },
    fans:   ['Auto','Low','Medium','High'],
    swings: ['Fixed','Up/Down','Left/Right','Both'],
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
    edShowDry: '💧 Dry mode', edShowFanOnly: '🌀 Fan mode',
    edShowFan: 'Fan speed', edShowFanDesc: 'Show fan speed control panel',
    edShowSwing: 'Airflow', edShowSwingDesc: 'Show airflow direction panel',
    edShowPreset: 'Eco/Fav/Clean bar', edShowPresetDesc: 'Show Eco · Fav · Clean row',
    edShowStatus: 'Status panel', edShowStatusDesc: 'Show status & sensor block on the right',
    edShowAllOff: 'Turn all off button', edShowAllOffDesc: 'Show the turn-all-off button',
    edShowTimer: 'Timer button', edShowTimerDesc: 'Show the timer button',
    edShowRoomEnv: 'Room Temp / Humidity', edShowRoomEnvDesc: 'Show selected room temp & humidity (Super Lite)',
    edShowOutdoorTemp: 'Outdoor temperature', edShowHumidity: 'Humidity', edShowPower: 'Power (kW)',
    edRoomCountLabel: function(n) { return '🏠 Number of rooms (1–8, default 4)'; },
    edRoomsHeader: function(n) { return '❄ Air Conditioners (' + n + ' rooms)'; },
    edRooms: '❄ Air Conditioners',
    edSensors: '📡 Environment Sensors',
    edColors: 'Colors',
    edBg: 'Background',
    edAcEntity: '❄ AC entity (climate.*)',
    edAcName: '🏷 Display name',
    edAcIcon: '🎨 Icon (emoji)',
    edAcImage: '🖼 Ảnh phòng (URL)',
    edRoomTempEntity: '🌡 Room temperature sensor (if AC has none)',
    edRoomHumidityEntity: '💧 Room humidity sensor (if AC has none)',
    edVaneVertical: '↕ Vertical vane (input_select)',
    edVaneHorizontal: '↔ Horizontal vane (input_select)',
    edPm25: '🌫 Fine dust PM2.5',
    edOutdoorTemp: '🌡 Outdoor temperature',
    edHumidity: '💧 Outdoor humidity',
    edPower: '⚡ Power consumption (kW)',
    edVaneVerticalGlobal: '↕ Vertical vane (default)',
    edVaneHorizontalGlobal: '↔ Horizontal vane (default)',
    rooms: ['Living room','Bedroom','Dining room','Office'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Luftqualität gut', pressOn: 'Einschalten drücken',
    dustLabel: 'Feinstaub',
    fanLabel: 'Lüfterstufe', swingLabel: 'Luftrichtung',
    allOff: 'Alle ausschalten', allOffSub: 'Alle Räume ausschalten',
    tapOff: 'Zum Ausschalten', tapOn: 'Zum Einschalten',
    confirmOff: '⚠ Alle ausschalten?', confirmSub: function(n) { return n + ' Klimaanlagen gleichzeitig ausschalten'; },
    cancel: 'Abbrechen', doOff: '⏻ Alle aus',
    overlayOn: 'AN', overlayOff: 'AUS',
    modes: { cool:'Kühlen', heat:'Heizen', dry:'Entfeuchten', fan_only:'Lüfter', off:'Aus' },
    fans:   ['Auto','Niedrig','Mittel','Hoch'],
    swings: ['Fest','Auf/Ab','Links/Rechts','Alle'],
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
    edShowDry: '💧 Entfeuchten', edShowFanOnly: '🌀 Lüfter',
    edShowFan: 'Lüfterdrehzahl', edShowFanDesc: 'Lüftersteuerung anzeigen',
    edShowSwing: 'Luftrichtung', edShowSwingDesc: 'Luftrichtungssteuerung anzeigen',
    edShowPreset: 'Eco/Fav/Clean-Leiste', edShowPresetDesc: 'Eco · Fav · Clean-Zeile anzeigen',
    edShowStatus: 'Statusblock', edShowStatusDesc: 'Status- & Sensorblock rechts anzeigen',
    edShowAllOff: 'Alle-aus-Schaltfläche', edShowAllOffDesc: 'Alle-ausschalten-Schaltfläche anzeigen',
    edShowTimer: 'Timer-Schaltfläche', edShowTimerDesc: 'Timer-Schaltfläche anzeigen',
    edShowRoomEnv: 'Raum Temp/Luftfeuchte', edShowRoomEnvDesc: 'Raumtemp. & Luftfeuchte (Super Lite)',
    edShowOutdoorTemp: 'Außentemperatur', edShowHumidity: 'Luftfeuchtigkeit', edShowPower: 'Leistung (kW)',
    edRoomCountLabel: function(n) { return '🏠 Anzahl der Räume (1–8, Standard 4)'; },
    edRoomsHeader: function(n) { return '❄ Klimaanlagen (' + n + ' Räume)'; },
    edRooms: '❄ Klimaanlagen',
    edSensors: '📡 Umgebungssensoren',
    edColors: 'Farben',
    edBg: 'Hintergrund',
    edAcEntity: '❄ Klimaanlage-Entity (climate.*)',
    edRoomTempEntity: '🌡 Raumtemperatursensor (falls Klimaanlage keinen hat)',
    edRoomHumidityEntity: '💧 Raumfeuchtigkeitssensor (falls Klimaanlage keinen hat)',
    edAcName: '🏷 Anzeigename',
    edAcIcon: '🎨 Symbol (Emoji)',
    edAcImage: '🖼 Raumfoto (URL)',
    edPm25: '🌫 Feinstaub PM2.5',
    edOutdoorTemp: '🌡 Außentemperatur',
    edHumidity: '💧 Außenluftfeuchtigkeit',
    edPower: '⚡ Stromverbrauch (kW)',
    rooms: ['Wohnzimmer','Schlafzimmer','Esszimmer','Büro'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Qualité de l\'air bonne', pressOn: 'Appuyer pour allumer',
    dustLabel: 'Particules fines',
    fanLabel: 'Vitesse ventilateur', swingLabel: 'Direction d\'air',
    allOff: 'Tout éteindre', allOffSub: 'Éteindre toutes les pièces',
    tapOff: 'Appuyer pour éteindre', tapOn: 'Appuyer pour allumer',
    confirmOff: '⚠ Tout éteindre?', confirmSub: function(n) { return 'Éteindra ' + n + ' climatiseurs à la fois'; },
    cancel: 'Annuler', doOff: '⏻ Tout éteindre',
    overlayOn: 'ALLUMÉ', overlayOff: 'ÉTEINT',
    modes: { cool:'Refroidir', heat:'Chauffer', dry:'Déshumidifier', fan_only:'Ventilateur', off:'Éteint' },
    fans:   ['Auto','Faible','Moyen','Élevé'],
    swings: ['Fixe','Haut/Bas','Gauche/Droite','Tous'],
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
    edShowDry: '💧 Déshumidifier', edShowFanOnly: '🌀 Ventilateur',
    edShowFan: 'Vitesse ventilateur', edShowFanDesc: 'Afficher le panneau de vitesse',
    edShowSwing: 'Direction d\'air', edShowSwingDesc: 'Afficher le panneau de direction',
    edShowPreset: 'Barre Eco/Fav/Clean', edShowPresetDesc: 'Afficher la ligne Eco · Fav · Clean',
    edShowStatus: 'Bloc de statut', edShowStatusDesc: 'Afficher le bloc statut & capteurs',
    edShowAllOff: 'Bouton Tout éteindre', edShowAllOffDesc: 'Afficher le bouton tout éteindre',
    edShowTimer: 'Bouton minuterie', edShowTimerDesc: 'Afficher le bouton minuterie',
    edShowRoomEnv: 'Temp/Humidité pièce', edShowRoomEnvDesc: 'Afficher temp. & humidité de la pièce (Super Lite)',
    edShowOutdoorTemp: 'Température extérieure', edShowHumidity: 'Humidité', edShowPower: 'Puissance (kW)',
    edRoomCountLabel: function(n) { return '🏠 Nombre de pièces (1–8, défaut 4)'; },
    edRoomsHeader: function(n) { return '❄ Climatiseurs (' + n + ' pièces)'; },
    edRooms: '❄ Climatiseurs',
    edSensors: '📡 Capteurs environnementaux',
    edColors: 'Couleurs',
    edBg: 'Arrière-plan',
    edAcEntity: '❄ Entité clim. (climate.*)',
    edRoomTempEntity: '🌡 Capteur température pièce (si clim. n\'en a pas)',
    edRoomHumidityEntity: '💧 Capteur humidité pièce (si clim. n\'en a pas)',
    edAcName: '🏷 Nom affiché',
    edAcIcon: '🎨 Icône (emoji)',
    edAcImage: '🖼 Photo pièce (URL)',
    edPm25: '🌫 Particules fines PM2.5',
    edOutdoorTemp: '🌡 Température extérieure',
    edHumidity: '💧 Humidité extérieure',
    edPower: '⚡ Consommation (kW)',
    rooms: ['Salon','Chambre','Salle à manger','Bureau'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Luchtkwaliteit goed', pressOn: 'Druk om in te schakelen',
    dustLabel: 'Fijnstof',
    fanLabel: 'Ventilatorsnelheid', swingLabel: 'Luchtrichting',
    allOff: 'Alles uitschakelen', allOffSub: 'Alle kamers uitschakelen',
    tapOff: 'Tik om uit te schakelen', tapOn: 'Tik om in te schakelen',
    confirmOff: '⚠ Alles uitschakelen?', confirmSub: function(n) { return n + ' airconditioners tegelijk uitschakelen'; },
    cancel: 'Annuleren', doOff: '⏻ Alles uit',
    overlayOn: 'AAN', overlayOff: 'UIT',
    modes: { cool:'Koelen', heat:'Verwarmen', dry:'Ontvochtigen', fan_only:'Ventilator', off:'Uit' },
    fans:   ['Auto','Laag','Medium','Hoog'],
    swings: ['Vast','Op/Neer','Links/Rechts','Alle'],
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
    edShowDry: '💧 Ontvochtigen', edShowFanOnly: '🌀 Ventilator',
    edShowFan: 'Ventilatorsnelheid', edShowFanDesc: 'Ventilatorregeling weergeven',
    edShowSwing: 'Luchtrichting', edShowSwingDesc: 'Luchtrichtingsregeling weergeven',
    edShowPreset: 'Eco/Fav/Clean-balk', edShowPresetDesc: 'Eco · Fav · Clean-rij weergeven',
    edShowStatus: 'Statusblok', edShowStatusDesc: 'Status- & sensorblok rechts weergeven',
    edShowAllOff: 'Alles-uit-knop', edShowAllOffDesc: 'Alles-uitschakelknop weergeven',
    edShowTimer: 'Timerknop', edShowTimerDesc: 'Timerknop weergeven',
    edShowRoomEnv: 'Kamer Temp/Vochtigheid', edShowRoomEnvDesc: 'Kamertemp. & vochtigheid tonen (Super Lite)',
    edShowOutdoorTemp: 'Buitentemperatuur', edShowHumidity: 'Vochtigheid', edShowPower: 'Vermogen (kW)',
    edRoomCountLabel: function(n) { return '🏠 Aantal kamers (1–8, standaard 4)'; },
    edRoomsHeader: function(n) { return '❄ Airconditioners (' + n + ' kamers)'; },
    edRooms: '❄ Airconditioners',
    edSensors: '📡 Omgevingssensoren',
    edColors: 'Kleuren',
    edBg: 'Achtergrond',
    edAcEntity: '❄ AC-entiteit (climate.*)',
    edRoomTempEntity: '🌡 Kamertemperatuursensor (als AC dit niet heeft)',
    edRoomHumidityEntity: '💧 Kamerluchtvochtigheidssensor (als AC dit niet heeft)',
    edAcName: '🏷 Weergavenaam',
    edAcIcon: '🎨 Pictogram (emoji)',
    edAcImage: '🖼 Kamerafoto (URL)',
    edPm25: '🌫 Fijnstof PM2.5',
    edOutdoorTemp: '🌡 Buitentemperatuur',
    edHumidity: '💧 Buitenvochtigheid',
    edPower: '⚡ Stroomverbruik (kW)',
    rooms: ['Woonkamer','Slaapkamer','Eetkamer','Kantoor'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Jakość powietrza dobra', pressOn: 'Naciśnij aby włączyć',
    dustLabel: 'Pył zawieszony',
    fanLabel: 'Prędkość wentylatora', swingLabel: 'Kierunek przepływu',
    allOff: 'Wyłącz wszystkie', allOffSub: 'Naciśnij aby wyłączyć wszystkie pokoje',
    tapOff: 'Naciśnij aby wyłączyć', tapOn: 'Naciśnij aby włączyć',
    confirmOff: '⚠ Wyłączyć wszystkie?', confirmSub: function(n) { return 'Wyłączy ' + n + ' klimatyzatorów naraz'; },
    cancel: 'Anuluj', doOff: '⏻ Wyłącz wszystkie',
    overlayOn: 'WŁ', overlayOff: 'WYŁ',
    modes: { cool:'Chłodzenie', heat:'Ogrzewanie', dry:'Osuszanie', fan_only:'Wentylator', off:'Wyłącz' },
    fans:   ['Auto','Niski','Średni','Wysoki'],
    swings: ['Stały','Góra/Dół','Lewo/Prawo','Wszystkie'],
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
    edShowDry: '💧 Osuszanie', edShowFanOnly: '🌀 Wentylator',
    edShowFan: 'Prędkość wentylatora', edShowFanDesc: 'Pokaż panel prędkości wentylatora',
    edShowSwing: 'Kierunek przepływu', edShowSwingDesc: 'Pokaż panel kierunku przepływu',
    edShowPreset: 'Pasek Eco/Fav/Clean', edShowPresetDesc: 'Pokaż wiersz Eco · Fav · Clean',
    edShowStatus: 'Blok statusu', edShowStatusDesc: 'Pokaż blok statusu i czujników po prawej',
    edShowAllOff: 'Przycisk wyłącz wszystkie', edShowAllOffDesc: 'Pokaż przycisk wyłącz wszystkie',
    edShowTimer: 'Przycisk timera', edShowTimerDesc: 'Pokaż przycisk timera',
    edShowRoomEnv: 'Temp/Wilgotność pokoju', edShowRoomEnvDesc: 'Pokaż temp. i wilgotność pokoju (Super Lite)',
    edShowOutdoorTemp: 'Temperatura zewnętrzna', edShowHumidity: 'Wilgotność', edShowPower: 'Moc (kW)',
    edRoomCountLabel: function(n) { return '🏠 Liczba pokojów (1–8, domyślnie 4)'; },
    edRoomsHeader: function(n) { return '❄ Klimatyzatory (' + n + ' pokoje)'; },
    edRooms: '❄ Klimatyzatory',
    edSensors: '📡 Czujniki środowiskowe',
    edColors: 'Kolory',
    edBg: 'Tło',
    edAcEntity: '❄ Encja klimatyzatora (climate.*)',
    edRoomTempEntity: '🌡 Czujnik temperatury pokoju (jeśli AC nie ma)',
    edRoomHumidityEntity: '💧 Czujnik wilgotności pokoju (jeśli AC nie ma)',
    edAcName: '🏷 Nazwa wyświetlana',
    edAcIcon: '🎨 Ikona (emoji)',
    edAcImage: '🖼 Zdjęcie pokoju (URL)',
    edPm25: '🌫 Pył zawieszony PM2.5',
    edOutdoorTemp: '🌡 Temperatura zewnętrzna',
    edHumidity: '💧 Wilgotność zewnętrzna',
    edPower: '⚡ Zużycie energii (kW)',
    rooms: ['Salon','Sypialnia','Jadalnia','Biuro'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    modes: { cool:'Kyla', heat:'Värme', dry:'Avfuktning', fan_only:'Fläkt', off:'Av' },
    fans:   ['Auto','Låg','Medel','Hög'],
    swings: ['Fast','Upp/Ned','Vänster/Höger','Alla'],
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
    edShowDry: '💧 Torr', edShowFanOnly: '🌀 Fläkt',
    edShowFan: 'Fläkthastighet', edShowFanDesc: 'Visa fläkthastighetspanel',
    edShowSwing: 'Luftriktning', edShowSwingDesc: 'Visa luftriktningspanel',
    edShowPreset: 'Eco/Fav/Clean-fält', edShowPresetDesc: 'Visa Eco · Fav · Clean-rad',
    edShowStatus: 'Statusblock', edShowStatusDesc: 'Visa status- & sensorblock till höger',
    edShowAllOff: 'Stäng av alla-knapp', edShowAllOffDesc: 'Visa stäng av alla-knapp',
    edShowTimer: 'Timerknapp', edShowTimerDesc: 'Visa timerknapp',
    edShowRoomEnv: 'Rumstemperatur/Luftfuktighet', edShowRoomEnvDesc: 'Visa rumstemperatur & luftfuktighet (Super Lite)',
    edShowOutdoorTemp: 'Utomhustemperatur', edShowHumidity: 'Luftfuktighet', edShowPower: 'Effekt (kW)',
    edRoomCountLabel: function(n) { return '🏠 Antal rum (1–8, standard 4)'; },
    edRoomsHeader: function(n) { return '❄ Luftkonditioneringar (' + n + ' rum)'; },
    edRooms: '❄ Luftkonditioneringar',
    edSensors: '📡 Miljösensorer',
    edColors: 'Färger',
    edBg: 'Bakgrund',
    edAcEntity: '❄ AC-entitet (climate.*)',
    edRoomTempEntity: '🌡 Rumstemperatursensor (om AC saknar det)',
    edRoomHumidityEntity: '💧 Rumsfuktighetssensor (om AC saknar det)',
    edAcName: '🏷 Visningsnamn',
    edAcIcon: '🎨 Ikon (emoji)',
    edAcImage: '🖼 Rumsfoto (URL)',
    edPm25: '🌫 Fint damm PM2.5',
    edOutdoorTemp: '🌡 Utomhustemperatur',
    edHumidity: '💧 Utomhusfuktighet',
    edPower: '⚡ Elförbrukning (kW)',
    rooms: ['Vardagsrum','Sovrum','Matsal','Kontor'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    modes: { cool:'Hűtés', heat:'Fűtés', dry:'Párátlanítás', fan_only:'Ventilátor', off:'Ki' },
    fans:   ['Auto','Alacsony','Közepes','Magas'],
    swings: ['Rögzített','Fel/Le','Bal/Jobb','Mindkettő'],
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
    edShowDry: '💧 Szárítás', edShowFanOnly: '🌀 Ventilátor',
    edShowFan: 'Ventilátor sebesség', edShowFanDesc: 'Ventilátor vezérlőpanel megjelenítése',
    edShowSwing: 'Légáramlás', edShowSwingDesc: 'Légáramlás panel megjelenítése',
    edShowPreset: 'Eco/Fav/Clean sáv', edShowPresetDesc: 'Eco · Fav · Clean sor megjelenítése',
    edShowStatus: 'Állapot panel', edShowStatusDesc: 'Állapot és szenzor blokk megjelenítése',
    edShowAllOff: 'Mindent kikapcsol gomb', edShowAllOffDesc: 'Mindent kikapcsol gomb megjelenítése',
    edShowTimer: 'Időzítő gomb', edShowTimerDesc: 'Időzítő gomb megjelenítése',
    edShowRoomEnv: 'Szoba hőmérséklet/páratartalom', edShowRoomEnvDesc: 'Szoba hőmérséklet & páratartalom mutatása (Super Lite)',
    edShowOutdoorTemp: 'Kültéri hőmérséklet', edShowHumidity: 'Páratartalom', edShowPower: 'Teljesítmény (kW)',
    edRoomCountLabel: function(n) { return '🏠 Szobák száma (1–8, alapértelmezett 4)'; },
    edRoomsHeader: function(n) { return '❄ Légkondicionáló (' + n + ' szoba)'; },
    edRooms: '❄ Légkondicionáló',
    edSensors: '📡 Környezeti érzékelők',
    edColors: 'Színek',
    edBg: 'Háttér',
    edAcEntity: '❄ Légkondicionáló entitás (climate.*)',
    edRoomTempEntity: '🌡 Szobahőmérséklet-érzékelő (ha AC nem rendelkezik)',
    edRoomHumidityEntity: '💧 Szobapáratartalom-érzékelő (ha AC nem rendelkezik)',
    edAcName: '🏷 Megjelenítési név',
    edAcIcon: '🎨 Ikon (emoji)',
    edAcImage: '🖼 Rumsfoto (URL)',
    edPm25: '🌫 Finom por PM2.5',
    edOutdoorTemp: '🌡 Kültéri hőmérséklet',
    edHumidity: '💧 Kültéri páratartalom',
    edPower: '⚡ Energiafogyasztás (kW)',
    rooms: ['Nappali','Hálószoba','Étkező','Iroda'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    modes: { cool:'Chlazení', heat:'Topení', dry:'Odvlhčování', fan_only:'Ventilátor', off:'Vypnout' },
    fans:   ['Auto','Nízká','Střední','Vysoká'],
    swings: ['Pevný','Nahoru/Dolů','Vlevo/Vpravo','Vše'],
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
    edShowDry: '💧 Sušení', edShowFanOnly: '🌀 Ventilátor',
    edShowFan: 'Rychlost ventilátoru', edShowFanDesc: 'Zobrazit panel rychlosti ventilátoru',
    edShowSwing: 'Směr vzduchu', edShowSwingDesc: 'Zobrazit panel směru vzduchu',
    edShowPreset: 'Lišta Eco/Fav/Clean', edShowPresetDesc: 'Zobrazit řádek Eco · Fav · Clean',
    edShowStatus: 'Stavový blok', edShowStatusDesc: 'Zobrazit blok stavu a senzorů vpravo',
    edShowAllOff: 'Tlačítko vše vypnout', edShowAllOffDesc: 'Zobrazit tlačítko vše vypnout',
    edShowTimer: 'Tlačítko časovače', edShowTimerDesc: 'Zobrazit tlačítko časovače',
    edShowRoomEnv: 'Teplota/vlhkost místnosti', edShowRoomEnvDesc: 'Zobrazit teplotu & vlhkost místnosti (Super Lite)',
    edShowOutdoorTemp: 'Venkovní teplota', edShowHumidity: 'Vlhkost', edShowPower: 'Výkon (kW)',
    edRoomCountLabel: function(n) { return '🏠 Počet místností (1–8, výchozí 4)'; },
    edRoomsHeader: function(n) { return '❄ Klimatizace (' + n + ' místností)'; },
    edRooms: '❄ Klimatizace',
    edSensors: '📡 Senzory prostředí',
    edColors: 'Barvy',
    edBg: 'Pozadí',
    edAcEntity: '❄ Entita klimatizace (climate.*)',
    edRoomTempEntity: '🌡 Senzor teploty v místnosti (pokud AC nemá)',
    edRoomHumidityEntity: '💧 Senzor vlhkosti v místnosti (pokud AC nemá)',
    edAcName: '🏷 Zobrazovaný název',
    edAcIcon: '🎨 Ikona (emoji)',
    edAcImage: '🖼 Zdjęcie pokoju (URL)',
    edPm25: '🌫 Jemný prach PM2.5',
    edOutdoorTemp: '🌡 Venkovní teplota',
    edHumidity: '💧 Venkovní vlhkost',
    edPower: '⚡ Spotřeba energie (kW)',
    rooms: ['Obývací pokoj','Ložnice','Jídelna','Kancelář'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Qualità dell\'aria buona', pressOn: 'Premi per accendere',
    dustLabel: 'Polvere fine',
    fanLabel: 'Velocità ventilatore', swingLabel: 'Direzione flusso',
    allOff: 'Spegni tutti', allOffSub: 'Spegni tutte le stanze',
    tapOff: 'Premi per spegnere', tapOn: 'Premi per accendere',
    confirmOff: '⚠ Spegnere tutto?', confirmSub: function(n) { return 'Spegnerà ' + n + ' condizionatori contemporaneamente'; },
    cancel: 'Annulla', doOff: '⏻ Spegni tutti',
    overlayOn: 'ACCESO', overlayOff: 'SPENTO',
    modes: { cool:'Raffreddamento', heat:'Riscaldamento', dry:'Deumidificazione', fan_only:'Ventilatore', off:'Spento' },
    fans:   ['Auto','Bassa','Media','Alta'],
    swings: ['Fisso','Su/Giù','Sinistra/Destra','Tutti'],
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
    edShowDry: '💧 Deumidificazione', edShowFanOnly: '🌀 Ventilatore',
    edShowFan: 'Velocità ventilatore', edShowFanDesc: 'Mostra pannello velocità ventilatore',
    edShowSwing: 'Direzione aria', edShowSwingDesc: 'Mostra pannello direzione aria',
    edShowPreset: 'Barra Eco/Fav/Clean', edShowPresetDesc: 'Mostra riga Eco · Fav · Clean',
    edShowStatus: 'Blocco stato', edShowStatusDesc: 'Mostra blocco stato e sensori a destra',
    edShowAllOff: 'Pulsante spegni tutto', edShowAllOffDesc: 'Mostra pulsante spegni tutto',
    edShowTimer: 'Pulsante timer', edShowTimerDesc: 'Mostra pulsante timer',
    edShowRoomEnv: 'Temp/Umidità stanza', edShowRoomEnvDesc: 'Mostra temp. & umidità stanza (Super Lite)',
    edShowOutdoorTemp: 'Temperatura esterna', edShowHumidity: 'Umidità', edShowPower: 'Potenza (kW)',
    edRoomCountLabel: function(n) { return '🏠 Numero di stanze (1–8, predefinito 4)'; },
    edRoomsHeader: function(n) { return '❄ Condizionatori (' + n + ' stanze)'; },
    edRooms: '❄ Condizionatori',
    edSensors: '📡 Sensori ambientali',
    edColors: 'Colori',
    edBg: 'Sfondo',
    edAcEntity: '❄ Entità condizionatore (climate.*)',
    edRoomTempEntity: '🌡 Sensore temperatura stanza (se AC non ce l\'ha)',
    edRoomHumidityEntity: '💧 Sensore umidità stanza (se AC non ce l\'ha)',
    edAcName: '🏷 Nome visualizzato',
    edAcIcon: '🎨 Icona (emoji)',
    edAcImage: '🖼 Foto stanza (URL)',
    edPm25: '🌫 Polvere fine PM2.5',
    edOutdoorTemp: '🌡 Temperatura esterna',
    edHumidity: '💧 Umidità esterna',
    edPower: '⚡ Consumo energetico (kW)',
    rooms: ['Soggiorno','Camera da letto','Sala da pranzo','Ufficio'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
    airGood: 'Qualidade do ar boa', pressOn: 'Prima para ligar',
    dustLabel: 'Pó fino',
    fanLabel: 'Velocidade do ventilador', swingLabel: 'Direção do fluxo',
    allOff: 'Desligar todos', allOffSub: 'Desligar todas as salas',
    tapOff: 'Prima para desligar', tapOn: 'Prima para ligar',
    confirmOff: '⚠ Desligar todos?', confirmSub: function(n) { return 'Irá desligar ' + n + ' ar condicionados ao mesmo tempo'; },
    cancel: 'Cancelar', doOff: '⏻ Desligar todos',
    overlayOn: 'LIGADO', overlayOff: 'DESLIGADO',
    modes: { cool:'Arrefecer', heat:'Aquecer', dry:'Desumidificar', fan_only:'Ventilador', off:'Desligado' },
    fans:   ['Auto','Baixo','Médio','Alto'],
    swings: ['Fixo','Cima/Baixo','Esquerda/Direita','Todos'],
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
    edShowDry: '💧 Desumidificação', edShowFanOnly: '🌀 Ventilador',
    edShowFan: 'Velocidade do ventilador', edShowFanDesc: 'Mostrar painel de velocidade',
    edShowSwing: 'Direção do ar', edShowSwingDesc: 'Mostrar painel de direção do ar',
    edShowPreset: 'Barra Eco/Fav/Clean', edShowPresetDesc: 'Mostrar linha Eco · Fav · Clean',
    edShowStatus: 'Bloco de status', edShowStatusDesc: 'Mostrar bloco de status e sensores',
    edShowAllOff: 'Botão desligar tudo', edShowAllOffDesc: 'Mostrar botão desligar tudo',
    edShowTimer: 'Botão temporizador', edShowTimerDesc: 'Mostrar botão temporizador',
    edShowRoomEnv: 'Temp/Humidade do quarto', edShowRoomEnvDesc: 'Mostrar temp. & humidade do quarto (Super Lite)',
    edShowOutdoorTemp: 'Temperatura externa', edShowHumidity: 'Humidade', edShowPower: 'Potência (kW)',
    edRoomCountLabel: function(n) { return '🏠 Número de salas (1–8, padrão 4)'; },
    edRoomsHeader: function(n) { return '❄ Ar Condicionados (' + n + ' salas)'; },
    edRooms: '❄ Ar Condicionados',
    edSensors: '📡 Sensores ambientais',
    edColors: 'Cores',
    edBg: 'Fundo',
    edAcEntity: '❄ Entidade AC (climate.*)',
    edRoomTempEntity: '🌡 Sensor temperatura sala (se AC não tiver)',
    edRoomHumidityEntity: '💧 Sensor humidade sala (se AC não tiver)',
    edAcName: '🏷 Nome exibido',
    edAcIcon: '🎨 Ícone (emoji)',
    edAcImage: '🖼 Foto do quarto (URL)',
    edPm25: '🌫 Pó fino PM2.5',
    edOutdoorTemp: '🌡 Temperatura exterior',
    edHumidity: '💧 Humidade exterior',
    edPower: '⚡ Consumo de energia (kW)',
    rooms: ['Sala de estar','Quarto','Sala de jantar','Escritório'],
    roomIcons: ['🛋','🛌','🍳','💼'],
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
  { id: 'custom',  label: '✏ Custom', c1: null,      c2: null       },
];

function acPresetGradient(preset, c1, c2) {
  const p = AC_BG_PRESETS.find(x => x.id === preset) || AC_BG_PRESETS[0];
  const gc1 = (preset === 'custom' ? c1 : p.c1) || '#001e2b';
  const gc2 = (preset === 'custom' ? c2 : p.c2) || '#12c6f3';
  return 'linear-gradient(135deg, ' + gc1 + 'bb 0%, ' + gc2 + '44 100%)';
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
};

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
  { id: 'climate.dieu_hoa_living',         label: 'Ph\xf2ng kh\xe1ch', area: '25 m\xb2', icon: '\ud83d\udecb' },
  { id: 'climate.bed_air_conditioning',     label: 'Ph\xf2ng ng\u1ee7',  area: '18 m\xb2', icon: '\ud83d\udecc' },
  { id: 'climate.kitchen_air_conditioning', label: 'Ph\xf2ng \u0103n',   area: '20 m\xb2', icon: '\ud83c\udf73' },
  { id: 'climate.dieu_hoa_office',          label: 'V\u0103n ph\xf2ng',  area: '15 m\xb2', icon: '\ud83d\udcbc' },
  { id: 'climate.dieu_hoa_bathroom',        label: 'Ph\xf2ng t\u1eafm',  area: '8 m\xb2',  icon: '\ud83d\udec1' },
  { id: 'climate.dieu_hoa_kids',            label: 'Ph\xf2ng tr\u1ebb',  area: '14 m\xb2', icon: '\ud83e\uddf8' },
  { id: 'climate.dieu_hoa_gym',             label: 'Ph\xf2ng gym',       area: '20 m\xb2', icon: '\ud83c\udfcb' },
  { id: 'climate.dieu_hoa_utility',         label: 'Kho',                area: '10 m\xb2', icon: '\ud83d\udce6' },
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
  cool:     { lbl: 'L\xe0m l\u1ea1nh', icon: '\u2744',      color: '#3b9eff', glow: 'rgba(59,158,255,0.55)'   },
  heat:     { lbl: 'S\u01b0\u1edfi',   icon: '\ud83d\udd25', color: '#ff7b3b', glow: 'rgba(255,123,59,0.55)'  },
  dry:      { lbl: 'H\xfat \u1ea9m',   icon: '\ud83d\udca7', color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  fan_only: { lbl: 'Qu\u1ea1t',        icon: '\ud83c\udf2c', color: '#34d399', glow: 'rgba(52,211,153,0.55)'  },
  off:      { lbl: 'T\u1eaft',         icon: '\u25cb',       color: '#4b5563', glow: 'rgba(75,85,99,0.3)'     },
};

const FAN_LEVELS  = ['auto','low','medium','high'];
const FAN_VI      = ['T\u1ef1 \u0111\u1ed9ng','Th\u1ea5p','V\u1eeba','Cao'];
const SWING_LEVELS = ['off','vertical','horizontal','both'];
const SWING_VI    = ['C\u1ed1 \u0111\u1ecbnh','L\u00ean xu\u1ed1ng','Tr\xe1i ph\u1ea3i','T\u1ea5t c\u1ea3'];
const SWING_ICONS  = ['\u2014','\u2195','\u2194','\u2716'];
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
  border-radius:28px;overflow:hidden;display:flex;align-items:stretch;
  box-shadow:0 0 0 1px rgba(255,255,255,0.28),0 40px 120px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.45)}
.left{flex:1.2;background:linear-gradient(160deg,rgba(200,235,255,0.18) 0%,rgba(140,210,230,0.12) 100%);
  display:flex;flex-direction:column;padding:16px 16px 14px;gap:8px;
  position:relative;border-right:1px solid rgba(255,255,255,0.2);overflow-x:hidden;overflow-y:visible}
.left::before{content:"";position:absolute;top:-120px;left:-70px;width:380px;height:380px;
  background:radial-gradient(circle,var(--glow) 0%,transparent 65%);pointer-events:none;opacity:0.25}
.hdr{display:flex;align-items:center;justify-content:space-between}
.hdr-brand{display:flex;align-items:center;gap:10px}
.hdr-ico{width:40px;height:40px;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#000));
  border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 24px var(--glow)}
.hdr-title{font-size:11px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.85);text-transform:uppercase}
.hdr-sub{font-size:9px;color:rgba(40,80,110,0.5);margin-top:1px}
.hdr-icons{display:flex;gap:12px;align-items:center}
.greet-row{display:flex;align-items:flex-start;justify-content:space-between}
.greet-sub{font-size:11.5px;color:rgba(255,255,255,0.65);font-weight:300}
.greet-name{font-size:22px;font-weight:700;color:#ffffff;line-height:1.15;letter-spacing:-0.5px}

.eco-badge{display:inline-flex;align-items:center;gap:4px;padding:5px 13px;border-radius:20px;
  font-size:9.5px;font-weight:600;cursor:pointer;outline:none;transition:all 0.2s;border:none}
.eco-on{background:rgba(52,211,153,0.38);border:1px solid rgba(52,211,153,0.7)!important;color:#ffffff}
.eco-off{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09)!important;color:rgba(255,255,255,0.55)}
.eco-badge:hover{filter:brightness(1.25);transform:scale(1.04)}
.dial-wrap{display:flex;justify-content:center;position:relative;margin:-2px 0 -14px}
.dial-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-26%);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;width:150px;height:150px}
.dial-lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.55);font-weight:500}
.dial-temp{font-family:'Orbitron',sans-serif;font-size:44px;font-weight:800;color:#ffffff;line-height:1;
  text-shadow:0 0 30px var(--glow),0 0 60px var(--glow);transition:color 0.6s ease}
.dial-deg{font-size:24px;font-weight:400;vertical-align:super;line-height:0}
.dial-feel{font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;font-weight:300;text-align:center;
  max-width:130px;line-height:1.45;word-break:break-word;white-space:normal}
.temp-ctrl{display:flex;align-items:center;justify-content:center}
.temp-btn{width:40px;height:40px;border-radius:50%;background:rgba(0,20,50,0.25);
  border:1px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.9);font-size:24px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;outline:none;transition:all 0.15s;font-family:'Sora',sans-serif}
.temp-btn:hover{background:rgba(0,30,70,0.4);border-color:var(--accent);color:var(--accent);box-shadow:0 0 18px var(--glow)}
.temp-btn:active{transform:scale(0.88)}
.temp-set{min-width:100px;text-align:center;font-family:'Orbitron',sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.85)}
.mode-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
.mode-btn{background:rgba(0,20,50,0.3);border:1px solid rgba(255,255,255,0.25);border-radius:13px;
  padding:9px 3px 7px;display:flex;flex-direction:column;align-items:center;gap:4px;
  cursor:pointer;outline:none;color:rgba(255,255,255,0.75);font-size:8.5px;font-weight:600;
  font-family:'Sora',sans-serif;transition:all 0.2s}
.mode-btn:hover{background:rgba(0,30,70,0.45);border-color:rgba(255,255,255,0.5);transform:translateY(-1px)}
.mode-btn:active{transform:scale(0.94)}
.mode-btn--active{background:linear-gradient(160deg,color-mix(in srgb,var(--bc,var(--accent)) 55%,rgba(0,15,40,0.5)),color-mix(in srgb,var(--bc,var(--accent)) 35%,rgba(0,15,40,0.4)));
  border-color:color-mix(in srgb,var(--bc,var(--accent)) 80%,transparent);color:#ffffff;
  box-shadow:0 0 24px var(--bg,var(--glow)),inset 0 1px 0 rgba(255,255,255,0.25)}
.mode-icon{font-size:22px;line-height:1}
.mode-lbl{font-size:8.5px}
.fan-swing-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fan-card,.swing-card{background:rgba(0,20,50,0.28);border:1px solid rgba(255,255,255,0.22);
  border-radius:14px;padding:9px 12px;display:flex;flex-direction:column;gap:6px}
.fc-head{display:flex;align-items:center;justify-content:space-between}
.fc-label{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.55);font-weight:700}
.fc-val{font-size:10px;color:rgba(255,255,255,0.95);font-weight:700}
.fan-body{display:flex;align-items:flex-end;gap:10px}
.fan-ico{font-size:22px;opacity:0.9;line-height:1;flex-shrink:0;display:flex;align-items:center;min-width:42px}
@keyframes fanSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fan-bars{display:flex;align-items:flex-end;gap:3px;height:32px}
.fbar{width:6px;border-radius:3px 3px 2px 2px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);transition:all 0.3s;flex-shrink:0}
.fbar.fbar-on{background:var(--accent);border-color:rgba(255,255,255,0.55);box-shadow:0 0 8px var(--glow),0 0 3px rgba(255,255,255,0.3),inset 0 1px 0 rgba(255,255,255,0.35)}
.fan-tap{display:flex;align-items:flex-end;gap:10px;cursor:pointer;outline:none;
  background:none;border:none;padding:0;width:100%}
.swing-body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex:1}
.swing-btn{display:flex;flex-direction:column;align-items:center;gap:4px;
  background:none;border:none;cursor:pointer;outline:none;padding:0;width:100%}
.swing-lbl{font-size:9px;color:rgba(255,255,255,0.7);font-weight:600}
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
.pw-sub--big{font-size:13px;font-weight:600;color:rgba(255,255,255,0.85);letter-spacing:0.2px}
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
.right{flex:1.4;background:linear-gradient(160deg,rgba(160,220,240,0.10) 0%,rgba(100,180,210,0.08) 100%);display:flex;flex-direction:column;position:relative;overflow-x:hidden;overflow-y:visible;min-height:0}
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
.lite-small-btn--alloff{border-color:rgba(255,80,80,0.25)!important}
.lite-small-btn--alloff:hover{background:rgba(255,60,60,0.12)!important;border-color:rgba(255,80,80,0.45)!important}
.lite-small-btn--alloff .lsb-ico{color:rgba(255,150,150,0.85)}
.lite-small-btn--alloff .lsb-lbl{color:rgba(255,150,150,0.75)}
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
.st-title{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.55);font-weight:600}
.st-on{font-size:13px;font-weight:700;color:#34d399;margin-top:2px}
.st-off{font-size:13px;font-weight:700;color:rgba(255,255,255,0.45);margin-top:2px}
.st-sub{font-size:9.5px;color:rgba(255,255,255,0.5);margin-top:1px}
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
.rsb-on{background:color-mix(in srgb,var(--accent) 55%,rgba(0,10,30,0.4));color:#ffffff;border:1px solid color-mix(in srgb,var(--accent) 80%,transparent)}
.rsb-off{background:rgba(0,20,50,0.25);color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.3)}
.all-off-btn{margin:0 10px 6px;background:rgba(255,60,60,0.06);border:1px solid rgba(255,80,80,0.18);
  border-radius:13px;padding:9px 12px;display:flex;align-items:center;gap:10px;
  cursor:pointer;outline:none;width:calc(100% - 20px);text-align:left;transition:all 0.2s;font-family:'Sora',sans-serif}
.all-off-btn:hover{background:rgba(255,60,60,0.12);border-color:rgba(255,80,80,0.35)}
.all-off-btn:active{transform:scale(0.97)}
.all-off-ico{width:36px;height:36px;border-radius:50%;background:rgba(255,60,60,0.15);border:1px solid rgba(255,80,80,0.3);
  display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;
  box-shadow:0 0 14px rgba(255,60,60,0.2)}
.all-off-info{flex:1}
.all-off-title{font-size:11px;font-weight:600;color:rgba(255,150,150,0.85)}
.all-off-sub{font-size:8.5px;color:rgba(255,255,255,0.5);margin-top:1px}
.all-off-arr{color:rgba(255,100,100,0.35);font-size:18px}
.bottom-row{display:flex;gap:8px}
.power-row{display:flex;align-items:center;gap:10px;background:rgba(0,20,50,0.3);
  border:1px solid rgba(255,255,255,0.25);border-radius:18px;padding:12px 14px;
  cursor:pointer;outline:none;text-align:left;transition:all 0.2s;font-family:'Sora',sans-serif;flex:1.6;min-width:0}
.power-row:hover{background:rgba(0,30,70,0.45)}
.power-row:active{transform:scale(0.98)}
.timer-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:rgba(0,20,50,0.3);border:1px solid rgba(255,255,255,0.22);border-radius:18px;
  padding:10px 8px;cursor:pointer;outline:none;font-family:'Sora',sans-serif;
  transition:all 0.2s;flex:1;min-width:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.timer-btn:hover{background:rgba(0,30,70,0.45);border-color:rgba(251,191,36,0.45)}
.timer-btn--active{border-color:rgba(251,191,36,0.75)!important;background:rgba(251,191,36,0.12)!important;box-shadow:0 0 14px rgba(251,191,36,0.2)}
.timer-ico{font-size:18px;line-height:1;pointer-events:none}
.timer-lbl{font-size:7px;font-weight:700;letter-spacing:1px;color:rgba(255,255,255,0.5);text-transform:uppercase;pointer-events:none}
.timer-cd{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:600;color:rgba(251,191,36,0.9);line-height:1;min-height:13px;pointer-events:none}
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
.rt-header{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.5);font-weight:600;margin-bottom:4px;margin-top:6px;text-align:center}
.room-tabs{padding:0 10px 6px;display:flex;flex-direction:column;gap:4px;flex-shrink:0}
.room-tabs-inner{background:rgba(0,15,40,0.45);border:1px solid rgba(255,255,255,0.16);border-radius:14px;padding:7px;display:flex;flex-direction:column;gap:6px;box-shadow:0 4px 20px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.08)}
.room-tabs-inner.scrollable{max-height:calc(4 * 66px + 3 * 6px + 14px);overflow-y:auto !important;overflow-x:hidden !important;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.25) rgba(0,0,0,0.15)}
.room-tabs-inner.scrollable::-webkit-scrollbar{width:5px}
.room-tabs-inner.scrollable::-webkit-scrollbar-track{background:rgba(0,0,0,0.15);border-radius:4px}
.room-tabs-inner.scrollable::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.25);border-radius:4px}
.room-tab{display:flex;align-items:center;gap:8px;background:rgba(0,20,50,0.28);
  border:1px solid rgba(255,255,255,0.2);border-radius:14px;padding:12px 12px;min-height:58px;
  cursor:pointer;outline:none;text-align:left;transition:all 0.2s;width:100%;font-family:'Sora',sans-serif;overflow:hidden;box-sizing:border-box}
.room-tab--active.room-tab--on{background:rgba(0,40,80,0.55)!important;border-color:color-mix(in srgb,var(--accent) 70%,transparent)!important;box-shadow:0 0 14px color-mix(in srgb,var(--accent) 30%,transparent)}
.room-tab--active.room-tab--off{background:rgba(30,20,50,0.55)!important;border-color:rgba(251,191,36,0.5)!important}
.room-tab--running{border-color:color-mix(in srgb,var(--accent) 35%,rgba(255,255,255,0.2))!important}
.room-tab-ico{font-size:20px;line-height:1;flex-shrink:0;width:24px;text-align:center}
.room-tab-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.room-tab-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.room-tab-temp{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.5)}

/* ── Super Lite mode ─────────────────────────────────────────────────────── */
.card--super-lite{display:flex;flex-direction:column;border-radius:22px;min-height:0}
.sl-body{display:flex;flex-direction:column;padding:12px 14px 14px;gap:10px}
.sl-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px;gap:8px}
.sl-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.8)}
.sl-badge{display:flex;align-items:center;gap:5px;background:rgba(0,20,50,0.32);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:3px 10px 3px 6px}
.sl-led{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.sl-led-on{background:#34d399;box-shadow:0 0 8px #34d399;animation:blink 2.5s infinite}
.sl-led-off{background:#4b5563}
.sl-badge-txt{font-size:9px;font-weight:700;color:rgba(255,255,255,0.85);letter-spacing:1px}
.sl-dial-wrap{display:flex;justify-content:center;position:relative;margin:-4px 0 -8px}
.sl-dial-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-26%);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;width:130px}
.sl-temp-lbl{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.5);font-weight:500}
.sl-temp-val{font-family:'Orbitron',sans-serif;font-size:40px;font-weight:800;line-height:1;transition:color 0.6s ease}
.sl-temp-feel{font-size:10px;color:rgba(255,255,255,0.55);margin-top:4px;font-weight:300;text-align:center;max-width:120px;line-height:1.4}
.sl-temp-ctrl{display:flex;align-items:center;justify-content:center;gap:6px}
.sl-extra-btn{display:flex;flex-direction:column;align-items:center;gap:2px;
  background:rgba(0,20,50,0.28);border:1px solid rgba(255,255,255,0.18);border-radius:12px;
  padding:6px 8px;cursor:pointer;outline:none;min-width:54px;transition:all 0.15s;font-family:'Sora',sans-serif}
.sl-extra-btn:hover{background:rgba(0,30,70,0.45);border-color:var(--accent)}
.sl-extra-btn:active{transform:scale(0.92)}
.sl-extra-lbl{font-size:8px;font-weight:600;color:rgba(255,255,255,0.7);white-space:nowrap;overflow:hidden;
  text-overflow:ellipsis;max-width:56px;text-transform:capitalize}
.sl-temp-btn{width:36px;height:36px;border-radius:50%;background:rgba(0,20,50,0.28);
  border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);font-size:22px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;outline:none;transition:all 0.15s;font-family:'Sora',sans-serif}
.sl-temp-btn:hover{background:rgba(0,30,70,0.45);border-color:var(--accent);color:var(--accent)}
.sl-temp-btn:active{transform:scale(0.88)}
.sl-temp-set{min-width:88px;text-align:center;font-family:'Orbitron',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.85)}
.sl-controls{display:flex;gap:8px}
.sl-mode-wrap{flex:0 0 30%;min-width:0;position:relative}
.sl-room-wrap{flex:0 0 calc(70% - 8px);min-width:0;position:relative}
.sl-select{width:100%;background:rgba(0,20,50,0.45);border:1px solid rgba(255,255,255,0.22);border-radius:12px;
  color:#ffffff;font-family:'Sora',sans-serif;font-size:11px;font-weight:600;
  padding:10px 10px 10px 10px;cursor:pointer;outline:none;appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.5)'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;
  transition:all 0.2s;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.sl-select:hover{border-color:rgba(255,255,255,0.45);background-color:rgba(0,30,70,0.55)}
.sl-select option{background:#0a1a2e;color:#ffffff;font-size:12px}
.sl-select-lbl{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);
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
`;

class AcControllerCardV2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeIdx   = 0;
    this._hass        = null;
    this._clockInt    = null;
    this._initialized = false;
    // timers: map roomIdx → { end, mode, hrs, int }
    this._timers           = {};
    this._outsideHandler   = null;
    this._confirmJustOpened = false;
    this._popupJustOpened  = false;
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

    if (changed) this._renderFull();
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
        icon: '\u2744',
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
  }

  static getConfigElement() {
    return document.createElement('multi-air-conditioner-card-editor');
  }

  static getStubConfig() {
    return {
      entities: [
        { entity_id: 'climate.dieu_hoa_living',         label: 'Phòng khách', area: '25 m²', icon: '🛋' },
        { entity_id: 'climate.bed_air_conditioning',     label: 'Phòng ngủ',   area: '18 m²', icon: '🛌' },
        { entity_id: 'climate.kitchen_air_conditioning', label: 'Phòng ăn',    area: '20 m²', icon: '🍳' },
        { entity_id: 'climate.dieu_hoa_office',          label: 'Văn phòng',   area: '15 m²', icon: '💼' },
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

    // Resume tất cả timer đang chạy (sau reload)
    var self2 = this;
    Object.keys(this._timers).forEach(function(idx) {
      var t = self2._timers[idx];
      if (t && t.end > Date.now() && !t.int) {
        self2._startTick(parseInt(idx));
      }
    });
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
    var bgGrad = acPresetGradient(cfg.background_preset, cfg.bg_color1, cfg.bg_color2);
    var accent = cfg.accent_color || '#00ffcc';
    var txtClr = cfg.text_color   || '#ffffff';

    var room    = ROOMS[this._activeIdx];
    var hvac    = this._s(room.id);
    var isOn    = hvac !== 'off';
    var curTemp = parseFloat(this._a(room.id,'current_temperature') || 26);
    var setTemp = parseFloat(this._a(room.id,'temperature')         || 24);
    var fanMode  = this._a(room.id,'fan_mode')     || 'auto';
    var swingMode= this._a(room.id,'swing_mode')   || 'off';
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
    // Đọc fan_modes từ entity, fallback FAN_LEVELS
    var entityFanModes = this._a(room.id, 'fan_modes');
    var actualFanModes = (Array.isArray(entityFanModes) && entityFanModes.length > 0) ? entityFanModes : FAN_LEVELS;
    var fi  = Math.max(0, actualFanModes.indexOf(fanMode));
    var si  = Math.max(0, SWING_LEVELS.indexOf(swingMode));
    var mode    = MODE_CFG[hvac] || MODE_CFG.cool;
    // Localise mode labels and fan/swing labels
    mode = Object.assign({}, mode, { lbl: tr.modes[hvac] || mode.lbl });
    var fanLabels   = tr.fans   || ['Auto','Low','Medium','High'];
    // Build fan mode label map for entity's actual modes
    var fanModeToLabel = {};
    for (var fli = 0; fli < FAN_LEVELS.length; fli++) {
      fanModeToLabel[FAN_LEVELS[fli]] = fanLabels[fli] || FAN_LEVELS[fli];
    }
    var currentFanLabel = fanModeToLabel[fanMode] || fanMode;
    var swingLabels = tr.swings || ['Fixed','Up/Down','Left/Right','Both'];
    // Label cho swing hiện tại: ưu tiên vane entity nếu có, fallback swing_mode
    var swingModeToLabel = { off: swingLabels[0], vertical: swingLabels[1], horizontal: swingLabels[2], both: swingLabels[3] };
    var swingCurrentLabel = swingModeToLabel[swingMode] || swingMode;
    var roomEntCfgVane = (cfg.entities && cfg.entities[this._activeIdx]) || {};
    var vaneVertEnt = roomEntCfgVane.vane_vertical_entity || cfg.vane_vertical_entity || null;
    var vaneHorizEnt = roomEntCfgVane.vane_horizontal_entity || cfg.vane_horizontal_entity || null;
    if (vaneVertEnt && this._hass && this._hass.states[vaneVertEnt]) {
      swingCurrentLabel = this._hass.states[vaneVertEnt].state;
    } else if (vaneHorizEnt && this._hass && this._hass.states[vaneHorizEnt]) {
      swingCurrentLabel = this._hass.states[vaneHorizEnt].state;
    }

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

    // Fan bar chart — dynamic based on actual fan modes count
    var barHeights = [7,10,13,16,19,22,26,30];
    var totalFanModes = actualFanModes.length;
    // Map current index to fill count proportionally across 8 bars
    var fillCount = totalFanModes > 1 ? Math.round((fi / (totalFanModes - 1)) * 8) : 0;
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
      var bladeCount = [4, 3, 4, 5][fi];
      var blades = '';
      for (var b = 0; b < bladeCount; b++) {
        var ang = b * (360 / bladeCount);
        // Fill béo + stroke viền sáng
        blades += '<path d="' + fatBlade(ang) + '" fill="' + color + '" fill-opacity="0.82"'
          + ' stroke="rgba(255,255,255,0.55)" stroke-width="0.8" stroke-linejoin="round"/>';
      }
      var animStyle = fi === 0 ? 'style="transform-origin:21px 21px;animation:fanSpin 1.4s linear infinite"' : '';
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
      var rTempStr = rTemp > 0 ? Math.round(rTemp) + '°' : '--';
      var isActive = j === this._activeIdx;
      var tabClass = 'room-tab'
        + (isActive && ron  ? ' room-tab--active room-tab--on'  : '')
        + (isActive && !ron ? ' room-tab--active room-tab--off' : '')
        + (!isActive && ron ? ' room-tab--running' : '');
      roomTabs += '<button class="' + tabClass + '" data-room="' + j + '">'
        + '<span class="room-tab-ico">' + ROOMS[j].icon + '</span>'
        + '<span class="room-tab-info">'
        + '  <span class="room-tab-name">' + ROOMS[j].label + '</span>'
        + '  <span class="room-tab-temp">' + rTempStr + '</span>'
        + '</span>'
        + '<span class="room-status-badge ' + (ron ? 'rsb-on' : 'rsb-off') + '">' + (ron ? 'ON' : 'OFF') + '</span>'
        + '</button>';
    }

    // Mode buttons — lọc theo từng flag show_cool / show_heat / show_dry / show_fan_only
    var modeKeys = ['cool','heat','dry','fan_only'];
    var modeShowMap = { cool: 'show_cool', heat: 'show_heat', dry: 'show_dry', fan_only: 'show_fan_only' };
    var modeBtns = '';
    for (var m = 0; m < modeKeys.length; m++) {
      var mk = modeKeys[m];
      if (cfg[modeShowMap[mk]] === false) continue;
      var mc = Object.assign({}, MODE_CFG[mk], { lbl: tr.modes[mk] || MODE_CFG[mk].lbl });
      var act = hvac === mk;
      var st  = act ? ('--bc:' + mc.color + ';--bg:' + mc.glow + ';') : '';
      modeBtns += '<button class="mode-btn' + (act ? ' mode-btn--active' : '') + '" data-hvac="' + mk + '" style="' + st + '">'
        + '<span class="mode-icon">' + mc.icon + '</span>'
        + '<span class="mode-lbl">' + mc.lbl + '</span>'
        + '</button>';
    }

    var comfortTxt = (hvac === 'cool' || hvac === 'heat') ? tr.comfortTemp(curTemp) : (tr.comfort[hvac] || '');
    var modeChip = isOn ? ('<span class="ac-mode-chip">' + mode.icon + ' ' + mode.lbl + '</span>') : '';

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
    var outdoorTempVal = cfg.outdoor_temp_entity && this._hass && this._hass.states[cfg.outdoor_temp_entity]
      ? Math.round(parseFloat(this._hass.states[cfg.outdoor_temp_entity].state)) + '°'
      : (curTemp > 0 ? Math.round(curTemp) + '°' : '--°');
    // Độ ẩm ngoài: ưu tiên outdoor sensor config, fallback roomHumidityRaw (đã tính từ phòng/cảm biến)
    var humidityVal = cfg.humidity_entity && this._hass && this._hass.states[cfg.humidity_entity]
      ? Math.round(parseFloat(this._hass.states[cfg.humidity_entity].state)) + '%'
      : (roomHumidityRaw > 0 ? Math.round(roomHumidityRaw) + '%' : '--%');
    var powerVal = cfg.power_entity && this._hass && this._hass.states[cfg.power_entity]
      ? parseFloat(this._hass.states[cfg.power_entity].state).toFixed(1) + ' kW'
      : '--';

    // ── SUPER LITE MODE ──────────────────────────────────────────────────────
    var isSuperLite = this._config.view_mode === 'super_lite';
    if (isSuperLite) {
      var slModeKeys = ['cool','heat','dry','fan_only'];
      var slModeShowMap = { cool: 'show_cool', heat: 'show_heat', dry: 'show_dry', fan_only: 'show_fan_only' };
      var slModeOptions = '<option value="off">' + (tr.modes['off'] || 'Tắt') + '</option>';
      for (var sm = 0; sm < slModeKeys.length; sm++) {
        var smk = slModeKeys[sm];
        if (cfg[slModeShowMap[smk]] === false) continue;
        var smc = Object.assign({}, MODE_CFG[smk], { lbl: tr.modes[smk] || MODE_CFG[smk].lbl });
        slModeOptions += '<option value="' + smk + '"' + (hvac === smk ? ' selected' : '') + '>' + smc.icon + ' ' + smc.lbl + '</option>';
      }
      var slIsOn = hvac !== 'off';
      // Outdoor sensors for super lite
      var slOutdoorTemp = (cfg.show_outdoor_temp !== false) && cfg.outdoor_temp_entity && this._hass && this._hass.states[cfg.outdoor_temp_entity]
        ? Math.round(parseFloat(this._hass.states[cfg.outdoor_temp_entity].state)) + '°'
        : null;
      var slHumidity = (cfg.show_humidity !== false) && cfg.humidity_entity && this._hass && this._hass.states[cfg.humidity_entity]
        ? Math.round(parseFloat(this._hass.states[cfg.humidity_entity].state)) + '%'
        : null;
      var slPm25 = cfg.pm25_entity && this._hass && this._hass.states[cfg.pm25_entity]
        ? parseFloat(this._hass.states[cfg.pm25_entity].state)
        : null;
      var slPower = (cfg.show_power !== false) && cfg.power_entity && this._hass && this._hass.states[cfg.power_entity]
        ? parseFloat(this._hass.states[cfg.power_entity].state).toFixed(1) + ' kW'
        : null;

      // Room env override: nếu show_room_env bật → dùng nhiệt độ/độ ẩm phòng đang chọn
      var slShowRoomEnv = cfg.show_room_env === true;
      var slEnvTemp, slEnvHumidity, slEnvIsRoom;
      if (slShowRoomEnv) {
        // Nhiệt độ phòng: ưu tiên cảm biến riêng, fallback current_temperature của entity
        var roomEntCfgSL = (cfg.entities && cfg.entities[this._activeIdx]) || {};
        var roomTempSL = curTemp; // curTemp đã tính từ sensor/entity bên trên
        var roomHumSL  = roomHumidityRaw; // roomHumidityRaw đã tính bên trên
        slEnvTemp     = (cfg.show_outdoor_temp !== false) && roomTempSL > 0 ? Math.round(roomTempSL) + '°' : null;
        slEnvHumidity = (cfg.show_humidity !== false) && roomHumSL  > 0 ? Math.round(roomHumSL) + '%'  : null;
        slEnvIsRoom   = true;
      } else {
        slEnvTemp     = slOutdoorTemp;
        slEnvHumidity = slHumidity;
        slEnvIsRoom   = false;
      }

      // Fan speed and vane data for super lite
      var slFanMode = fanMode;
      var slFanModes = this._a(room.id, 'fan_modes');
      slFanModes = (Array.isArray(slFanModes) && slFanModes.length > 0) ? slFanModes : FAN_LEVELS;
      var slFanLabel = slFanMode;
      // Map known fan modes to translated labels
      var slFanLabelMap = {};
      var slFanTr = tr.fans || [];
      for (var fmi = 0; fmi < FAN_LEVELS.length; fmi++) {
        slFanLabelMap[FAN_LEVELS[fmi]] = slFanTr[fmi] || FAN_LEVELS[fmi];
      }
      slFanLabel = slFanLabelMap[slFanMode] || slFanMode;

      // Vane entities for super lite
      var slRoomEntCfg = (cfg.entities && cfg.entities[this._activeIdx]) || {};
      var slVaneVertEntity = slRoomEntCfg.vane_vertical_entity || cfg.vane_vertical_entity || null;
      var slVaneHorizEntity = slRoomEntCfg.vane_horizontal_entity || cfg.vane_horizontal_entity || null;
      var slVaneVertVal = slVaneVertEntity && this._hass && this._hass.states[slVaneVertEntity]
        ? this._hass.states[slVaneVertEntity].state : null;
      var slVaneHorizVal = slVaneHorizEntity && this._hass && this._hass.states[slVaneHorizEntity]
        ? this._hass.states[slVaneHorizEntity].state : null;
      // Use configured vane entity, or fallback to swing_mode
      var slVaneLabel = '';
      var slHasVane = false;
      if (slVaneVertEntity || slVaneHorizEntity) {
        slHasVane = true;
        if (slVaneVertVal && slVaneHorizVal) slVaneLabel = slVaneVertVal;
        else slVaneLabel = slVaneVertVal || slVaneHorizVal || 'off';
      } else if (cfg.show_swing !== false) {
        slHasVane = true;
        slVaneLabel = swingMode !== 'off' ? (swingLabels[SWING_LEVELS.indexOf(swingMode)] || swingMode) : swingLabels[0];
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
        var sriTempStr = sriTemp > 0 ? ' · ' + Math.round(sriTemp) + '°' : '';
        var sriLabel = ROOMS[sri].icon + ' ' + ROOMS[sri].label + sriTempStr;
        if (sri === this._activeIdx) slRoomBtnLabel = sriLabel;
        slRoomPopupItems += '<div class="sl-room-item' + (sri === this._activeIdx ? ' active' : '') + '" data-room-idx="' + sri + '">'
          + '<span style="flex:1">' + sriLabel + '</span>'
          + '<span class="sl-room-item-badge ' + (sriOn ? 'on' : 'off') + '">' + (sriOn ? 'ON' : 'OFF') + '</span>'
          + '</div>';
      }
      this._slRoomPopupItems = slRoomPopupItems;

      var slHtml = '<div class="card card--super-lite" style="--accent:' + mode.color + ';--glow:' + mode.glow + ';background:' + bgGrad + '">'
        + '<div class="sl-body">'

        // ── Header: title + sensors + wifi + gear + status badge
        + '<div class="sl-hdr">'
        + '  <div style="display:flex;flex-direction:column;gap:2px">'
        + '    <span class="sl-title">' + tr.cardTitle + '</span>'
        + ((slEnvTemp || slEnvHumidity || slPm25 || slPower) ? (
            '    <span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
          + (slEnvTemp     ? '<span style="font-size:10px;color:rgba(255,255,255,' + (slEnvIsRoom ? '0.9' : '0.65') + ');font-family:\'Orbitron\',sans-serif;font-weight:600">' + (slEnvIsRoom ? '&#127968;' : '&#127777;') + ' ' + slEnvTemp + '</span>' : '')
          + (slEnvHumidity ? '<span style="font-size:10px;color:rgba(255,255,255,' + (slEnvIsRoom ? '0.75' : '0.55') + ');font-family:\'Orbitron\',sans-serif;font-weight:600">&#128167; ' + slEnvHumidity + '</span>' : '')
          + (slPm25 !== null ? '<span style="font-size:10px;color:rgba(255,255,255,0.6);font-family:\'Orbitron\',sans-serif;font-weight:600">&#127787; ' + Math.round(slPm25) + '</span>' : '')
          + (slPower        ? '<span style="font-size:10px;color:rgba(255,255,255,0.6);font-family:\'Orbitron\',sans-serif;font-weight:600">&#9889; ' + slPower + '</span>' : '')
          + '    </span>'
          ) : '')
        + '  </div>'
        + '  <div style="display:flex;align-items:center;gap:10px">'
        + '    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + wifiColor + '" stroke-width="1.8" style="filter:' + wifiGlow + ';flex-shrink:0"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>'
        + '    <button id="sl-btn-gear" style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;line-height:0">'
        + '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
        + '    </button>'
        + '    <span class="sl-badge">'
        + '      <span class="sl-led ' + (slIsOn ? 'sl-led-on' : 'sl-led-off') + '"></span>'
        + '      <span class="sl-badge-txt">' + (slIsOn ? tr.statusOn : tr.statusOff) + '</span>'
        + '    </span>'
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
        + '  <div class="sl-temp-val" style="color:' + acTempColor(curTemp) + ';text-shadow:0 0 30px ' + acTempColor(curTemp) + ',0 0 60px ' + acTempColor(curTemp) + '">' + Math.round(curTemp) + '<span style="font-size:22px;font-weight:400;vertical-align:super;line-height:0">°</span></div>'
        + '  <div class="sl-temp-feel">' + comfortTxt + '</div>'
        + '</div>'
        + '</div>'

        // ── Temp control with fan speed (left) and vane (right)
        + '<div class="sl-temp-ctrl">'
        + (cfg.show_fan !== false ? (
          '  <button class="sl-extra-btn" id="sl-btn-fan" title="' + tr.fanLabel + '">'
        + '    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0"/><path d="M12 2C12 2 12 8 12 10"/><path d="M12 14c0 2 0 8 0 8"/><path d="M2 12c0 0 6 0 8 0"/><path d="M14 12c2 0 8 0 8 0"/><path d="M4.93 4.93l4.24 4.24"/><path d="M14.83 14.83l4.24 4.24"/><path d="M4.93 19.07l4.24-4.24"/><path d="M14.83 9.17l4.24-4.24"/></svg>'
        + '    <span class="sl-extra-lbl">' + slFanLabel + '</span>'
        + '  </button>'
        ) : '<div style="min-width:60px"></div>')
        + '  <button class="sl-temp-btn" id="sl-btn-temp-down">&#8722;</button>'
        + '  <span class="sl-temp-set">' + setTemp + '&#176;C</span>'
        + '  <button class="sl-temp-btn" id="sl-btn-temp-up">+</button>'
        + (slHasVane ? (
          '  <button class="sl-extra-btn" id="sl-btn-vane" title="' + tr.swingLabel + '">'
        + '    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M2 8 Q8 4 12 8 Q16 12 22 8"/><path d="M2 16 Q8 12 12 16 Q16 20 22 16"/></svg>'
        + '    <span class="sl-extra-lbl">' + slVaneLabel + '</span>'
        + '  </button>'
        ) : '<div style="min-width:60px"></div>')
        + '</div>'

        // ── Bottom controls: mode dropdown (30%) + room dropdown (70%)
        + '<div class="sl-controls">'
        + '  <div class="sl-mode-wrap">'
        + '    <div class="sl-select-lbl">&#9881; ' + (tr.modeLabel || 'MODE') + '</div>'
        + (cfg.popup_style === 'effect' || cfg.popup_style === 'wave'
          ? (    '    <button class="sl-room-btn" id="sl-mode-btn" type="button">'
               + '      <span class="sl-room-btn-txt" id="sl-mode-btn-txt">' + (MODE_CFG[hvac] ? (MODE_CFG[hvac].icon + ' ' + (tr.modes[hvac] || MODE_CFG[hvac].lbl)) : (tr.modes['off'] || 'Off')) + '</span>'
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
                     var riTempStr = riTemp > 0 ? ' · ' + Math.round(riTemp) + '°' : '';
                     opts += '<option value="' + ri + '"' + (ri === this._activeIdx ? ' selected' : '') + '>'
                           + ROOMS[ri].icon + ' ' + ROOMS[ri].label + riTempStr + '</option>';
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
      container.innerHTML = slHtml;
      this._initialized = true;
      this._bindSuperLite();
      return;
    }
    // ── END SUPER LITE ───────────────────────────────────────────────────────

    // ── Không có <link>/<style> ở đây – đã inject ở connectedCallback
    var html = '<div class="card' + (isLite ? ' card--lite' : '') + '" style="--accent:' + mode.color + ';--glow:' + mode.glow + ';background:' + bgGrad + '">'
+ '<div class="left' + (isLite ? ' left--lite' : '') + '">'

+ '<div class="hdr">'
+ '  <div class="hdr-brand">'
+ '    <div class="hdr-ico">' + mode.icon + '</div>'
+ '    <div><div class="hdr-title">' + tr.cardTitle + '</div><div class="hdr-sub">' + tr.cardSub + '</div></div>'
+ '  </div>'
+ '  <div class="hdr-icons">'
+ '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + wifiColor + '" stroke-width="1.8" style="filter:' + wifiGlow + ';transition:all 0.4s"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>'
+ '    <button id="btn-gear" style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;line-height:0">'
+ '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
+ '    </button>'
+ '  </div>'
+ '</div>'

+ '<div class="greet-row" style="' + (cfg.show_greet === false ? 'display:none;' : '') + '">'
+ '  <div>'
+ '    <div class="greet-sub">' + tr.greet() + '</div>'
+ '    <div class="greet-name">' + (cfg.owner_name || 'Smart Home') + '</div>'
+ '  </div>'
+ '  <button id="btn-eco" class="eco-badge ' + (ecoOn ? 'eco-on' : 'eco-off') + '">&#127807; ' + (ecoOn ? 'ECO ON' : 'ECO') + '</button>'
+ '</div>'

+ '<div class="dial-wrap">'
+ '<svg width="220" height="220" viewBox="0 0 220 220" style="overflow:visible">'
+ '<defs>'
+ '<filter id="arcGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
+ '<filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
+ '<filter id="innerArcGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
+ '<linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">'
+ '<stop offset="0%" stop-color="#3b9eff"/><stop offset="50%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#f59e0b"/>'
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
+ '  <div class="dial-temp" style="color:' + acTempColor(curTemp) + ';text-shadow:0 0 30px ' + acTempColor(curTemp) + ',0 0 60px ' + acTempColor(curTemp) + '">' + Math.round(curTemp) + '<span class="dial-deg">&#176;</span></div>'
+ '  <div class="dial-feel">' + comfortTxt + '</div>'
+ '</div>'
+ '</div>'

+ '<div class="temp-ctrl">'
+ '  <button class="temp-btn" id="btn-temp-down">&#8722;</button>'
+ '  <span class="temp-set">' + setTemp + '&#176;C</span>'
+ '  <button class="temp-btn" id="btn-temp-up">+</button>'
+ '</div>'

+ (modeBtns ? '<div class="mode-grid">' + modeBtns + '</div>' : '')

+ ((cfg.show_fan !== false || cfg.show_swing !== false) ? (
  '<div class="fan-swing-row">'
+ (cfg.show_fan !== false ? (
  '  <div class="fan-card">'
+ '    <div class="fc-head"><span class="fc-label">' + tr.fanLabel + '</span><span class="fc-val">' + currentFanLabel + '</span></div>'
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
+ '  <div class="img-temp-badge" style="color:' + acTempColor(curTemp) + ';text-shadow:0 0 18px ' + acTempColor(curTemp) + ',0 0 40px ' + acTempColor(curTemp) + ',0 2px 20px rgba(0,0,0,0.7)">' + Math.round(curTemp) + '<span>&#176;C</span>'
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
    container.innerHTML = html;

    this._initialized = true;
    this._bind();
    this._startClock();
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
      self._call('climate','set_hvac_mode',{entity_id:ROOMS[self._activeIdx].id, hvac_mode:b.dataset.hvac});
    });

    onTapAll(r.querySelectorAll('[data-fan]'), function(b) {
      self._call('climate','set_fan_mode',{entity_id:ROOMS[self._activeIdx].id, fan_mode:b.dataset.fan});
    });

    onTap(r.getElementById('btn-power'), function() {
      var id = ROOMS[self._activeIdx].id;
      self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode: self._s(id)!=='off'?'off':'cool'});
    });

    onTap(r.getElementById('btn-gear'), function() {
      var entityId = ROOMS[self._activeIdx].id;
      self.dispatchEvent(new CustomEvent('hass-more-info', {
        bubbles: true, composed: true,
        detail: { entityId: entityId }
      }));
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
      // Dùng fan_modes từ attribute (danh sách thực tế entity hỗ trợ), fallback về FAN_LEVELS
      var supported = self._a(id,'fan_modes');
      var levels = (Array.isArray(supported) && supported.length > 0) ? supported : FAN_LEVELS;
      var idx = levels.indexOf(cur);
      var next = levels[(idx + 1) % levels.length];
      self._call('climate','set_fan_mode',{entity_id:id, fan_mode:next});
    });

    onTap(r.getElementById('btn-swing'), function() {
      var id = ROOMS[self._activeIdx].id;
      var cfg2 = self._config || {};
      var roomCfg = (cfg2.entities && cfg2.entities[self._activeIdx]) || {};
      var vaneVertEntity = roomCfg.vane_vertical_entity || cfg2.vane_vertical_entity || null;
      var vaneHorizEntity = roomCfg.vane_horizontal_entity || cfg2.vane_horizontal_entity || null;
      if (vaneVertEntity && self._hass && self._hass.states[vaneVertEntity]) {
        var vaneState = self._hass.states[vaneVertEntity];
        var options = vaneState.attributes.options || [];
        if (options.length > 0) {
          var curIdx = options.indexOf(vaneState.state);
          var nextOpt = options[(curIdx + 1) % options.length];
          self._call('input_select','select_option',{entity_id:vaneVertEntity, option:nextOpt});
        }
      } else if (vaneHorizEntity && self._hass && self._hass.states[vaneHorizEntity]) {
        var vaneState2 = self._hass.states[vaneHorizEntity];
        var options2 = vaneState2.attributes.options || [];
        if (options2.length > 0) {
          var curIdx2 = options2.indexOf(vaneState2.state);
          var nextOpt2 = options2[(curIdx2 + 1) % options2.length];
          self._call('input_select','select_option',{entity_id:vaneHorizEntity, option:nextOpt2});
        }
      } else {
        // Fallback: cycle swing_mode
        var cur = self._a(id,'swing_mode') || 'off';
        var supported = self._a(id,'swing_modes');
        var levels = (Array.isArray(supported) && supported.length > 0) ? supported : SWING_LEVELS;
        var idx = levels.indexOf(cur);
        var next = levels[(idx + 1) % levels.length];
        self._call('climate','set_swing_mode',{entity_id:id, swing_mode:next});
      }
    });

    // btn-power-lite (lite mode) — same action as btn-power
    onTap(r.getElementById('btn-power-lite'), function() {
      var id = ROOMS[self._activeIdx].id;
      var isOn2 = self._hass && self._hass.states[id] && self._hass.states[id].state !== 'off';
      self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode: isOn2 ? 'off' : 'cool'});
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

    // Fan speed cycle (super lite)
    onTapSL(r.getElementById('sl-btn-fan'), function() {
      var id = ROOMS[self._activeIdx].id;
      var cur = self._a(id,'fan_mode') || 'auto';
      var supported = self._a(id,'fan_modes');
      var levels = (Array.isArray(supported) && supported.length > 0) ? supported : FAN_LEVELS;
      var idx = levels.indexOf(cur);
      var next = levels[(idx + 1) % levels.length];
      self._call('climate','set_fan_mode',{entity_id:id, fan_mode:next});
    });

    // Vane cycle (super lite) — supports custom vane entities or fallback to swing_mode
    onTapSL(r.getElementById('sl-btn-vane'), function() {
      var id = ROOMS[self._activeIdx].id;
      var cfg2 = self._config || {};
      var roomCfg = (cfg2.entities && cfg2.entities[self._activeIdx]) || {};
      var vaneVertEntity = roomCfg.vane_vertical_entity || cfg2.vane_vertical_entity || null;
      var vaneHorizEntity = roomCfg.vane_horizontal_entity || cfg2.vane_horizontal_entity || null;
      if (vaneVertEntity && self._hass && self._hass.states[vaneVertEntity]) {
        // Cycle through input_select options
        var vaneState = self._hass.states[vaneVertEntity];
        var options = vaneState.attributes.options || [];
        if (options.length > 0) {
          var curIdx = options.indexOf(vaneState.state);
          var nextOpt = options[(curIdx + 1) % options.length];
          self._call('input_select','select_option',{entity_id:vaneVertEntity, option:nextOpt});
        }
      } else if (vaneHorizEntity && self._hass && self._hass.states[vaneHorizEntity]) {
        var vaneState2 = self._hass.states[vaneHorizEntity];
        var options2 = vaneState2.attributes.options || [];
        if (options2.length > 0) {
          var curIdx2 = options2.indexOf(vaneState2.state);
          var nextOpt2 = options2[(curIdx2 + 1) % options2.length];
          self._call('input_select','select_option',{entity_id:vaneHorizEntity, option:nextOpt2});
        }
      } else {
        // Fallback: cycle swing_mode
        var cur = self._a(id,'swing_mode') || 'off';
        var supported = self._a(id,'swing_modes');
        var levels = (Array.isArray(supported) && supported.length > 0) ? supported : SWING_LEVELS;
        var idx = levels.indexOf(cur);
        var next = levels[(idx + 1) % levels.length];
        self._call('climate','set_swing_mode',{entity_id:id, swing_mode:next});
      }
    });

    // Gear → more-info
    onTapSL(r.getElementById('sl-btn-gear'), function() {
      self.dispatchEvent(new CustomEvent('hass-more-info', {
        bubbles: true, composed: true,
        detail: { entityId: ROOMS[self._activeIdx].id }
      }));
    });

    // Mode dropdown (native select — Normal style)
    var modeSelect = r.getElementById('sl-mode-select');
    if (modeSelect) {
      modeSelect.addEventListener('change', function() {
        var id = ROOMS[self._activeIdx].id;
        self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode: modeSelect.value});
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

      var modeList = ['off','cool','heat','dry','fan_only'];
      var curHvac  = self._s(ROOMS[self._activeIdx].id);
      var itemsHtml = isWave ? '' : '<div class="sl-pop-shimmer"></div>';
      for (var mi = 0; mi < modeList.length; mi++) {
        var mk2  = modeList[mi];
        var mcfg = MODE_CFG[mk2] || MODE_CFG.off;
        var mlbl = tr2.modes[mk2] || mcfg.lbl;
        var delay = (mi * 0.04 + 0.03).toFixed(2) + 's';
        if (isWave) {
          itemsHtml += '<div class="sl-ri sl-ri-wave' + (curHvac === mk2 ? ' active' : '') + '" data-mode-val="' + mk2 + '" style="animation-delay:' + delay + '">'
            + '<span style="font-size:18px;line-height:1;width:22px;text-align:center">' + mcfg.icon + '</span>'
            + '<span style="flex:1">' + mlbl + '</span>'
            + '<div class="sl-wave-ripple"></div>'
            + '</div>';
        } else {
          itemsHtml += '<div class="sl-ri' + (curHvac === mk2 ? ' active' : '') + '" data-mode-val="' + mk2 + '" style="animation-delay:' + delay + '">'
            + '<span style="font-size:18px;line-height:1;width:22px;text-align:center">' + mcfg.icon + '</span>'
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
          var doCall = function() { self._call('climate','set_hvac_mode',{entity_id:id, hvac_mode: modeVal}); closeModePopup(); };
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
        var ri2TempStr = ri2Temp > 0 ? ' · ' + Math.round(ri2Temp) + '°' : '';
        var ri2Label = ROOMS[ri2].icon + ' ' + ROOMS[ri2].label + ri2TempStr;
        var delay = (ri2 * 0.03 + 0.03).toFixed(2) + 's';
        if (isWave) {
          itemsHtml += '<div class="sl-ri sl-ri-wave' + (ri2 === self._activeIdx ? ' active' : '') + '" data-room-idx="' + ri2 + '" style="animation-delay:' + delay + '">'
            + '<span style="flex:1">' + ri2Label + '</span>'
            + '<span class="sl-ri-badge ' + (ri2On ? 'on' : 'off') + '">' + (ri2On ? 'ON' : 'OFF') + '</span>'
            + '<div class="sl-wave-ripple"></div>'
            + '</div>';
        } else {
          itemsHtml += '<div class="sl-ri' + (ri2 === self._activeIdx ? ' active' : '') + '" data-room-idx="' + ri2 + '" style="animation-delay:' + delay + '">'
            + '<span style="flex:1">' + ri2Label + '</span>'
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
          self._call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: tr2.mode === 'on' ? 'cool' : 'off' });
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
          self._call('climate', 'set_hvac_mode', { entity_id: id2, hvac_mode: tr2.mode === 'on' ? 'cool' : 'off' });
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
    if (this._clockInt) { clearInterval(this._clockInt); this._clockInt = null; }
    if (this._slCleanup) { this._slCleanup(); this._slCleanup = null; }
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
    const ents = this._config.entities || [];
    const apply = () => {
      // Global sensor entity pickers (data-key)
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-key]').forEach(p => {
        p.hass = this._hass;
        const domain = p.dataset.domain;
        if (domain) p.includeDomains = [domain];
        const key   = p.dataset.key;
        const saved = this._config[key] || '';
        if (p.value !== saved) {
          p.value = saved;
          p.setAttribute('value', saved);
        }
      });
      // entity pickers cho từng room (climate entity)
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room]').forEach(p => {
        p.hass = this._hass;
        p.includeDomains = ['climate'];
        const idx   = parseInt(p.dataset.room);
        const saved = (ents[idx] && ents[idx].entity_id) || '';
        if (p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
      // room temp sensor pickers
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room-temp]').forEach(p => {
        p.hass = this._hass;
        p.includeDomains = ['sensor'];
        const idx   = parseInt(p.dataset.roomTemp);
        const saved = (ents[idx] && ents[idx].temp_entity) || '';
        if (p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
      // room humidity sensor pickers
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room-hum]').forEach(p => {
        p.hass = this._hass;
        p.includeDomains = ['sensor'];
        const idx   = parseInt(p.dataset.roomHum);
        const saved = (ents[idx] && ents[idx].humidity_entity) || '';
        if (p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
      // room vane vertical entity pickers
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room-vane-vert]').forEach(p => {
        p.hass = this._hass;
        const idx   = parseInt(p.dataset.roomVaneVert);
        const saved = (ents[idx] && ents[idx].vane_vertical_entity) || '';
        if (p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
      });
      // room vane horizontal entity pickers
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-room-vane-horiz]').forEach(p => {
        p.hass = this._hass;
        const idx   = parseInt(p.dataset.roomVaneHoriz);
        const saved = (ents[idx] && ents[idx].vane_horizontal_entity) || '';
        if (p.value !== saved) { p.value = saved; p.setAttribute('value', saved); }
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
      const dispLbl = ent.label || defLbl;
      const defIco = (t.roomIcons && t.roomIcons[i]) || '❄';
      roomRows += `
<div class="ac-row">
  <div class="ac-row-title" id="ac-row-title-${i}">❄ ${t.edRooms.replace(/^❄\s*/,'')} ${i+1} – ${dispLbl}</div>
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
    <label>${t.edVaneVertical || '↕ Vertical vane (input_select)'}</label>
    <ha-entity-picker data-room-vane-vert="${i}" allow-custom-entity></ha-entity-picker>
  </div>
  <div class="row">
    <label>${t.edVaneHorizontal || '↔ Horizontal vane (input_select)'}</label>
    <ha-entity-picker data-room-vane-horiz="${i}" allow-custom-entity></ha-entity-picker>
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
    <span style="color:var(--secondary-text-color);font-weight:400;">v1.4 Designed by @doanlong1412 from 🇻🇳 Vietnam</span>
  </div>

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
    </div>
  </div>

  <!-- 2. Số phòng -->
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
      <div style="height:1px;background:var(--divider-color,rgba(0,0,0,0.08));margin:8px 0;"></div>
      ${this._entityField('vane_vertical_entity',   t.edVaneVerticalGlobal || '↕ Vertical vane (default)', '')}
      ${this._entityField('vane_horizontal_entity', t.edVaneHorizontalGlobal || '↔ Horizontal vane (default)', '')}
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
    </div>
  </div>
</div>`;

    this._bindEvents();
    this._syncPickers();
  }

  _bindEvents() {
    const sr = this.shadowRoot;

    // accordion
    ['lang','roomcount','rooms','sensors','bg','display'].forEach(id => {
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
        // Live update title
        const titleEl = sr.getElementById('ac-row-title-' + i);
        if (titleEl) titleEl.textContent = '❄ ' + t.edRooms.replace(/^❄\s*/, '') + ' ' + (i+1) + ' – ' + (val || ((t.rooms && t.rooms[i]) || ('Room ' + (i+1))));
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

    // ha-entity-picker: room vane vertical entity
    sr.querySelectorAll('ha-entity-picker[data-room-vane-vert]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const idx = parseInt(picker.dataset.roomVaneVert);
        const val = e.detail.value;
        const ents = (this._config.entities || []).slice();
        while (ents.length <= idx) ents.push({});
        if (val) ents[idx] = { ...ents[idx], vane_vertical_entity: val };
        else delete ents[idx].vane_vertical_entity;
        this._config = { ...this._config, entities: ents };
        this._fire();
      }));

    // ha-entity-picker: room vane horizontal entity
    sr.querySelectorAll('ha-entity-picker[data-room-vane-horiz]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const idx = parseInt(picker.dataset.roomVaneHoriz);
        const val = e.detail.value;
        const ents = (this._config.entities || []).slice();
        while (ents.length <= idx) ents.push({});
        if (val) ents[idx] = { ...ents[idx], vane_horizontal_entity: val };
        else delete ents[idx].vane_horizontal_entity;
        this._config = { ...this._config, entities: ents };
        this._fire();
      }));

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
