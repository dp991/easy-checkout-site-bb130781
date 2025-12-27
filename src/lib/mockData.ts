// Mock product data based on cash register/POS products
export interface Category {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  image_url: string;
  product_count: number;
}

export interface Product {
  id: string;
  category_id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  price_min: number;
  price_max: number;
  min_order: number;
  specs: Record<string, string>;
  images: string[];
  is_featured: boolean;
  is_new: boolean;
  stock_status: 'in_stock' | 'out_of_stock';
}

export const categories: Category[] = [
  {
    id: '1',
    slug: 'pos-terminals',
    name_zh: 'POS终端',
    name_en: 'POS Terminals',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    product_count: 12,
  },
  {
    id: '2',
    slug: 'cash-registers',
    name_zh: '收银机',
    name_en: 'Cash Registers',
    image_url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600',
    product_count: 8,
  },
  {
    id: '3',
    slug: 'receipt-printers',
    name_zh: '票据打印机',
    name_en: 'Receipt Printers',
    image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600',
    product_count: 15,
  },
  {
    id: '4',
    slug: 'barcode-scanners',
    name_zh: '条码扫描器',
    name_en: 'Barcode Scanners',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    product_count: 10,
  },
  {
    id: '5',
    slug: 'cash-drawers',
    name_zh: '钱箱',
    name_en: 'Cash Drawers',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
    product_count: 6,
  },
  {
    id: '6',
    slug: 'accessories',
    name_zh: '配件',
    name_en: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    product_count: 20,
  },
];

export const products: Product[] = [
  {
    id: '1',
    category_id: '1',
    slug: 'android-pos-terminal-t2',
    name_zh: 'Android POS终端 T2',
    name_en: 'Android POS Terminal T2',
    description_zh: '高性能Android POS终端，配备15.6英寸触摸屏，支持多种支付方式，适用于餐饮、零售等多种场景。',
    description_en: 'High-performance Android POS terminal with 15.6" touchscreen, supports multiple payment methods, suitable for restaurants, retail and more.',
    price_min: 299,
    price_max: 399,
    min_order: 10,
    specs: {
      'Display': '15.6" IPS Touch',
      'CPU': 'RK3568 Quad-core',
      'RAM': '4GB DDR4',
      'Storage': '64GB eMMC',
      'OS': 'Android 11',
      'Printer': '80mm Thermal',
    },
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800',
    ],
    is_featured: true,
    is_new: true,
    stock_status: 'in_stock',
  },
  {
    id: '2',
    category_id: '1',
    slug: 'windows-pos-system-w10',
    name_zh: 'Windows POS系统 W10',
    name_en: 'Windows POS System W10',
    description_zh: '专业级Windows POS系统，Intel处理器，17英寸双屏显示，适合大型商超和连锁店铺。',
    description_en: 'Professional Windows POS system with Intel processor, 17" dual display, perfect for supermarkets and chain stores.',
    price_min: 459,
    price_max: 599,
    min_order: 5,
    specs: {
      'Display': '17" + 10.1" Dual',
      'CPU': 'Intel Celeron J6412',
      'RAM': '8GB DDR4',
      'Storage': '128GB SSD',
      'OS': 'Windows 11 IoT',
      'Printer': '80mm Auto-cutter',
    },
    images: [
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    ],
    is_featured: true,
    is_new: false,
    stock_status: 'in_stock',
  },
  {
    id: '3',
    category_id: '2',
    slug: 'smart-cash-register-s5',
    name_zh: '智能收银机 S5',
    name_en: 'Smart Cash Register S5',
    description_zh: '一体化智能收银机，内置打印机、扫码器，支持云端管理，适合小型零售店铺。',
    description_en: 'All-in-one smart cash register with built-in printer and scanner, cloud management support, ideal for small retail stores.',
    price_min: 199,
    price_max: 259,
    min_order: 20,
    specs: {
      'Display': '10.1" Touch',
      'CPU': 'Quad-core ARM',
      'RAM': '2GB',
      'Storage': '16GB',
      'Connectivity': 'WiFi + 4G',
      'Printer': '58mm Thermal',
    },
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    ],
    is_featured: true,
    is_new: false,
    stock_status: 'in_stock',
  },
  {
    id: '4',
    category_id: '3',
    slug: 'thermal-printer-80mm',
    name_zh: '80mm热敏打印机',
    name_en: '80mm Thermal Receipt Printer',
    description_zh: '高速热敏打印机，支持USB和蓝牙连接，自动切纸，适用于各类POS系统。',
    description_en: 'High-speed thermal printer with USB and Bluetooth, auto-cutter, compatible with all POS systems.',
    price_min: 45,
    price_max: 65,
    min_order: 50,
    specs: {
      'Width': '80mm',
      'Speed': '250mm/s',
      'Interface': 'USB + BT',
      'Cutter': 'Auto',
      'Paper Roll': '80mm x 80m',
    },
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
    ],
    is_featured: false,
    is_new: true,
    stock_status: 'in_stock',
  },
  {
    id: '5',
    category_id: '4',
    slug: 'wireless-barcode-scanner',
    name_zh: '无线条码扫描器',
    name_en: 'Wireless Barcode Scanner',
    description_zh: '2.4G无线条码扫描器，支持1D/2D码，超长续航，适合仓储和零售场景。',
    description_en: '2.4G wireless barcode scanner, supports 1D/2D codes, long battery life, ideal for warehouse and retail.',
    price_min: 35,
    price_max: 55,
    min_order: 100,
    specs: {
      'Type': '1D/2D',
      'Connection': '2.4G Wireless',
      'Range': '100m',
      'Battery': '2000mAh',
      'Scan Rate': '100 scans/s',
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    is_featured: false,
    is_new: false,
    stock_status: 'in_stock',
  },
  {
    id: '6',
    category_id: '5',
    slug: 'heavy-duty-cash-drawer',
    name_zh: '重型钱箱',
    name_en: 'Heavy Duty Cash Drawer',
    description_zh: '全金属结构钱箱，8格纸币5格硬币，支持RJ11触发和钥匙开锁。',
    description_en: 'All-metal cash drawer, 8 bill and 5 coin compartments, RJ11 trigger and key lock support.',
    price_min: 28,
    price_max: 45,
    min_order: 50,
    specs: {
      'Material': 'Steel',
      'Bills': '8 Slots',
      'Coins': '5 Slots',
      'Trigger': 'RJ11 / Key',
      'Size': '420x420x100mm',
    },
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    ],
    is_featured: false,
    is_new: false,
    stock_status: 'in_stock',
  },
];

export const featuredProducts = products.filter(p => p.is_featured);
export const newProducts = products.filter(p => p.is_new);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.category_id === categoryId);
}
