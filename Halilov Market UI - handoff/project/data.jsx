// Diverse general-ecommerce sample catalog for the mockup
const PRODUCTS = [
  { id: 1, code: 'BAG · 18L',    cat: 'תיקים',      name: 'תיק גב לעיר',           sub: 'בד ממוחזר · אפור פחם',     price: 24900, badge: 'sale',  badgeText: '15%-' },
  { id: 2, code: 'BALL · 7',     cat: 'ספורט',      name: 'כדורסל אינדור',          sub: 'גודל 7 · עור סינתטי',      price: 15900, badge: null },
  { id: 3, code: 'AUD · WX5',    cat: 'אודיו',      name: 'אוזניות אלחוטיות',       sub: 'סינון רעש · 40 שעות',      price: 89900, badge: 'gold',  badgeText: 'הבחירה שלנו' },
  { id: 4, code: 'SNK · 42',     cat: 'נעליים',     name: 'סניקרס אורבני',           sub: 'יוניסקס · לבן/שמנת',       price: 39900, badge: null },
  { id: 5, code: 'LMP · D3',     cat: 'בית',        name: 'מנורת שולחן',             sub: 'אלומיניום · ראש מתכוונן',  price: 18500, badge: 'new', badgeText: 'חדש' },
  { id: 6, code: 'WCH · M',      cat: 'אביזרים',   name: 'שעון מינימליסטי',          sub: 'פלדה · 38 מ"מ',            price: 64900, badge: null },
  { id: 7, code: 'KTL · 1.5L',   cat: 'בית',        name: 'קומקום נירוסטה',          sub: '1.5 ליטר · בקרת חום',      price: 27900, badge: 'sale', badgeText: '20%-' },
  { id: 8, code: 'YGA · 6mm',    cat: 'ספורט',     name: 'מזרן יוגה',                sub: 'TPE · אנטי-החלקה',         price:  9900, badge: null },
];

const CATEGORIES = [
  { id: 0, name: 'הכול' },
  { id: 1, name: 'ביגוד' },
  { id: 2, name: 'נעליים' },
  { id: 3, name: 'תיקים ואביזרים' },
  { id: 4, name: 'ספורט ופנאי' },
  { id: 5, name: 'אלקטרוניקה' },
  { id: 6, name: 'בית וסלון' },
  { id: 7, name: 'יופי וטיפוח' },
];

const ORDERS = [
  { num: 'HLV-24081', date: '13/05/2026 09:24', status: 'PENDING',   items: 4, total: 14750, customer: 'נועה חליבוב',  city: 'תל אביב' },
  { num: 'HLV-24080', date: '13/05/2026 08:51', status: 'PAID',      items: 2, total:  8990, customer: 'דניאל אזולאי', city: 'חיפה' },
  { num: 'HLV-24079', date: '12/05/2026 22:13', status: 'SHIPPED',   items: 1, total: 39900, customer: 'מאיה לוי',     city: 'רמת גן' },
  { num: 'HLV-24078', date: '12/05/2026 18:42', status: 'DELIVERED', items: 3, total: 22450, customer: 'יעל מזרחי',    city: 'ירושלים' },
  { num: 'HLV-24077', date: '12/05/2026 16:09', status: 'PAID',      items: 5, total: 18200, customer: 'אורי שמש',     city: 'באר שבע' },
  { num: 'HLV-24076', date: '12/05/2026 11:31', status: 'CANCELLED', items: 2, total:  6990, customer: 'רוני כהן',     city: 'נתניה' },
  { num: 'HLV-24075', date: '11/05/2026 19:58', status: 'DELIVERED', items: 1, total: 89900, customer: 'אדם פרץ',      city: 'הרצליה' },
  { num: 'HLV-24074', date: '11/05/2026 14:22', status: 'REFUNDED',  items: 1, total: 24900, customer: 'שירה גרין',    city: 'מודיעין' },
];

window.HM_PRODUCTS = PRODUCTS;
window.HM_CATEGORIES = CATEGORIES;
window.HM_ORDERS = ORDERS;
