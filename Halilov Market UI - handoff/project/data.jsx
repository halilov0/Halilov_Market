// Mock data — general ecommerce marketplace (electronics, home, beauty, sports, fashion).

const CATEGORIES = [
  { id: 'electronics', name: 'אלקטרוניקה',     count: 1240, accent: 'oklch(0.55 0.14 255)' },
  { id: 'computers',   name: 'מחשבים וגיימינג', count: 642,  accent: 'oklch(0.50 0.14 290)' },
  { id: 'home',        name: 'בית ומטבח',       count: 2150, accent: 'oklch(0.58 0.12 145)' },
  { id: 'sports',      name: 'ספורט ופנאי',     count: 890,  accent: 'oklch(0.60 0.16 55)' },
  { id: 'beauty',      name: 'יופי וטיפוח',     count: 1430, accent: 'oklch(0.65 0.14 10)' },
  { id: 'fashion',     name: 'אופנה ותיקים',    count: 1850, accent: 'oklch(0.45 0.10 30)' },
];

const NAV_DEPARTMENTS = [
  { name: 'אלקטרוניקה',   hot: false },
  { name: 'מחשבים',       hot: false },
  { name: 'גיימינג',       hot: true  },
  { name: 'בית ומטבח',    hot: false },
  { name: 'ספורט ופנאי',  hot: false },
  { name: 'יופי וטיפוח',  hot: false },
  { name: 'אופנה',        hot: false },
  { name: 'תיקים ונסיעות', hot: false },
  { name: 'תינוקות',      hot: false },
  { name: 'צעצועים',      hot: false },
  { name: 'מבצעי בלאק',   hot: true  },
];

const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Bosch', 'Philips',
  'LG', 'Adidas', 'Nike', 'Dyson', 'Logitech', 'Xiaomi', 'JBL',
];

// Flash / lightning deals — prominent placement, stock progress.
const FLASH_DEALS = [
  { sku: 'AIR-201', name: 'אוזניות אלחוטיות AirPro · ביטול רעשים',     unit: 'אקטיב 4 · שחור',   price: 39900, old: 59900, badge: 'sale', rating: 4.7, reviews: 1840, stock: 12, sold: 73, badgeText: 'BEST SELLER' },
  { sku: 'LAP-202', name: 'מחשב נייד 14" · Core Ultra 7 · 16GB · 1TB', unit: 'אפור · 2024',       price: 449900, old: 549900, badge: 'sale', rating: 4.5, reviews: 312, stock: 4, sold: 41 },
  { sku: 'BLD-203', name: 'בלנדר מקצועי 1500W',                         unit: 'נירוסטה · 1.8L',    price: 29900, old: 42900, badge: 'sale', rating: 4.6, reviews: 567, stock: 9, sold: 88 },
  { sku: 'SNK-204', name: 'נעלי ריצה אוויר־מקס',                       unit: 'נשים · שחור',       price: 49900, old: 69900, badge: 'sale', rating: 4.8, reviews: 2104, stock: 3, sold: 95 },
];

const FEATURED = [
  { sku: 'WCH-301', name: 'שעון חכם · GPS · קצב לב',         unit: 'מסך AMOLED 1.4"', price: 89900,  old: null,    rating: 4.6, reviews: 542,  stock: 22, badgeText: 'TOP RATED' },
  { sku: 'BAG-302', name: 'תיק גב לטיולים 35L · עמיד למים',  unit: 'שחור · יוניסקס',  price: 24900,  old: 32900,   rating: 4.5, reviews: 318,  stock: 47, badge: 'sale' },
  { sku: 'SOA-303', name: 'סבון נוזלי טבעי · לבנדר',          unit: '500 מ"ל × 3',     price: 5900,   old: null,    rating: 4.3, reviews: 89,   stock: 64 },
  { sku: 'KBD-304', name: 'מקלדת מכאנית RGB · אדומים',       unit: 'TKL · עברית',     price: 49900,  old: null,    rating: 4.7, reviews: 678,  stock: 18, badgeText: 'PRIME' },
  { sku: 'MUG-305', name: 'סט ספלי קפה איכותיים · 6 יחידות', unit: 'פורצלן לבן',      price: 12900,  old: 17900,   rating: 4.4, reviews: 142,  stock: 0,  badge: 'sale' },
  { sku: 'SPK-306', name: 'רמקול נייד עמיד במים',            unit: 'אדום · 16 שעות',  price: 19900,  old: null,    rating: 4.5, reviews: 891,  stock: 32 },
  { sku: 'DRL-307', name: 'מקדחת אקרובט · 18V · 2 סוללות',   unit: 'מקצועית',         price: 39900,  old: 49900,   rating: 4.6, reviews: 234,  stock: 11, badge: 'sale' },
  { sku: 'YGM-308', name: 'מזרן יוגה פרימיום · 6 מ"מ',       unit: 'סגול · אנטי־החלקה', price: 8900, old: null,    rating: 4.5, reviews: 421,  stock: 38, badgeText: 'NEW' },
  { sku: 'CAM-309', name: 'מצלמת אבטחה ביתית 4K · WiFi',     unit: 'פנימית · ראייה לילית', price: 27900, old: 34900, rating: 4.4, reviews: 156, stock: 24, badge: 'sale' },
  { sku: 'PRF-310', name: 'בושם נשי · אדמוני 50מ"ל',         unit: 'EAU DE PARFUM',    price: 34900,  old: null,    rating: 4.8, reviews: 76,   stock: 14, badgeText: 'TOP RATED' },
];

const RECOMMEND = [
  { sku: 'LMP-401', name: 'מנורת שולחן LED · מתכווננת',      unit: 'שחור מט',         price: 13900,  old: null,    rating: 4.4, reviews: 92,   stock: 19 },
  { sku: 'TRY-402', name: 'מגש הגשה במבוק · גדול',           unit: '45×30 ס"מ',       price: 7900,   old: 9900,    rating: 4.6, reviews: 41,   stock: 28, badge: 'sale' },
  { sku: 'PEN-403', name: 'עיפרון אוטומטי איכותי · 0.7',     unit: 'מהדורה · אלומיניום', price: 4900, old: null,    rating: 4.5, reviews: 28,   stock: 95 },
  { sku: 'SNK-404', name: 'נעלי ספורט קלאסיות',              unit: 'גברים · לבן',     price: 27900,  old: null,    rating: 4.3, reviews: 524,  stock: 12, badgeText: 'NEW' },
  { sku: 'PRS-405', name: 'מכונת אספרסו · 15 בר',           unit: 'אוטומטית',         price: 79900,  old: 99900,   rating: 4.7, reviews: 1023, stock: 7,  badge: 'sale', badgeText: 'BEST SELLER' },
  { sku: 'WLT-406', name: 'ארנק עור איכותי · קומפקטי',       unit: 'חום · RFID',      price: 14900,  old: null,    rating: 4.6, reviews: 89,   stock: 33 },
];

window.MARKET_DATA = { CATEGORIES, NAV_DEPARTMENTS, BRANDS, FLASH_DEALS, FEATURED, RECOMMEND };
