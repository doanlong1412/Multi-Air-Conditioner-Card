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
    edRoomHumidityEntity: '💧 Czujnik wilgotności pokoju (jeśli AC không có)',
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
      return 'Troppo caldo! Regola la';
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
  if (h >= 18 && h < 21) return 'Ch\xe0a bu\u1ed5i t\u1ed1i,';   // 18–20
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
.sl-extra-btn:hover{backgroundrgba(0,30,70,0.45);border-color:var(--accent)}
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
@keyframes slBubble