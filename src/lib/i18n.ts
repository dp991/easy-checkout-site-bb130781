export type Locale = 'zh' | 'en';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['zh', 'en'];

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      about: 'About Us',
      contact: 'Contact',
      inquiry: 'Get Quote',
    },
    // Hero Section
    hero: {
      title: 'Professional POS Solutions',
      subtitle: 'For Modern Retail Business',
      description: 'High-performance cash registers, POS terminals, and retail equipment. Quality products, competitive prices, fast delivery worldwide.',
      cta: 'Explore Products',
      ctaSecondary: 'Contact Us',
    },
    // Products
    products: {
      title: 'Our Products',
      featured: 'Featured Products',
      new: 'New Arrivals',
      all: 'All Products',
      viewDetails: 'View Details',
      getQuote: 'Get Quote',
      minOrder: 'Min. Order',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      specifications: 'Specifications',
      description: 'Description',
      relatedProducts: 'Related Products',
    },
    // Categories
    categories: {
      title: 'Product Categories',
      posTerminals: 'POS Terminals',
      cashRegisters: 'Cash Registers',
      accessories: 'Accessories',
      printers: 'Receipt Printers',
      scanners: 'Barcode Scanners',
      scales: 'Electronic Scales',
    },
    // Contact
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our sales team',
      name: 'Your Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company Name',
      message: 'Your Message',
      send: 'Send Inquiry',
      success: 'Message sent successfully!',
      whatsapp: 'Chat on WhatsApp',
      telegram: 'Message on Telegram',
    },
    // Footer
    footer: {
      about: 'Leading supplier of POS equipment and cash register solutions for retail businesses worldwide.',
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Info',
      followUs: 'Follow Us',
      copyright: '© 2024 POS Store. All rights reserved.',
    },
    // Common
    common: {
      learnMore: 'Learn More',
      readMore: 'Read More',
      seeAll: 'See All',
      back: 'Back',
      loading: 'Loading...',
      error: 'An error occurred',
      search: 'Search products...',
    },
  },
  zh: {
    // Navigation
    nav: {
      home: '首页',
      products: '产品中心',
      categories: '产品分类',
      about: '关于我们',
      contact: '联系我们',
      inquiry: '获取报价',
    },
    // Hero Section
    hero: {
      title: '专业收银机解决方案',
      subtitle: '赋能现代零售商业',
      description: '高性能收银机、POS终端及零售设备。优质产品，极具竞争力的价格，全球快速交付。',
      cta: '浏览产品',
      ctaSecondary: '联系我们',
    },
    // Products
    products: {
      title: '我们的产品',
      featured: '热门产品',
      new: '新品上市',
      all: '全部产品',
      viewDetails: '查看详情',
      getQuote: '获取报价',
      minOrder: '最小起订量',
      inStock: '有货',
      outOfStock: '缺货',
      specifications: '规格参数',
      description: '产品描述',
      relatedProducts: '相关产品',
    },
    // Categories
    categories: {
      title: '产品分类',
      posTerminals: 'POS终端',
      cashRegisters: '收银机',
      accessories: '配件',
      printers: '票据打印机',
      scanners: '条码扫描器',
      scales: '电子秤',
    },
    // Contact
    contact: {
      title: '联系我们',
      subtitle: '与我们的销售团队取得联系',
      name: '您的姓名',
      email: '电子邮箱',
      phone: '联系电话',
      company: '公司名称',
      message: '留言内容',
      send: '发送询盘',
      success: '消息发送成功！',
      whatsapp: 'WhatsApp 咨询',
      telegram: 'Telegram 咨询',
    },
    // Footer
    footer: {
      about: '全球领先的收银机及POS设备供应商，为零售企业提供一站式解决方案。',
      quickLinks: '快速链接',
      contactInfo: '联系信息',
      followUs: '关注我们',
      copyright: '© 2024 收银机商城 版权所有',
    },
    // Common
    common: {
      learnMore: '了解更多',
      readMore: '阅读更多',
      seeAll: '查看全部',
      back: '返回',
      loading: '加载中...',
      error: '发生错误',
      search: '搜索产品...',
    },
  },
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}
