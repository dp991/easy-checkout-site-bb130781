import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
    title?: string;
    titleZh?: string;
    description?: string;
    descriptionZh?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    productData?: {
        name: string;
        description: string;
        image: string;
        price?: number;
        priceCurrency?: string;
        availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
        sku?: string;
    };
    breadcrumbs?: Array<{
        name: string;
        url: string;
    }>;
}

const BASE_URL = 'https://postore.com';

export default function SEOHead({
    title,
    titleZh,
    description,
    descriptionZh,
    keywords,
    image = '/og-image.jpg',
    url = '',
    type = 'website',
    productData,
    breadcrumbs,
}: SEOHeadProps) {
    const { locale } = useLanguage();

    const currentTitle = locale === 'zh' ? (titleZh || title) : title;
    const currentDescription = locale === 'zh' ? (descriptionZh || description) : description;
    const fullUrl = `${BASE_URL}${url}`;
    const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

    const siteName = locale === 'zh' ? 'POStore - POS收银机商城' : 'POStore';
    const fullTitle = currentTitle ? `${currentTitle} | ${siteName}` : siteName;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update meta tags
        const updateMeta = (name: string, content: string, isProperty = false) => {
            const attr = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attr}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Basic meta
        if (currentDescription) {
            updateMeta('description', currentDescription);
        }
        if (keywords) {
            updateMeta('keywords', keywords);
        }

        // Open Graph
        updateMeta('og:title', fullTitle, true);
        if (currentDescription) {
            updateMeta('og:description', currentDescription, true);
        }
        updateMeta('og:url', fullUrl, true);
        updateMeta('og:image', fullImage, true);
        updateMeta('og:type', type, true);
        updateMeta('og:locale', locale === 'zh' ? 'zh_CN' : 'en_US', true);

        // Twitter
        updateMeta('twitter:title', fullTitle);
        if (currentDescription) {
            updateMeta('twitter:description', currentDescription);
        }
        updateMeta('twitter:image', fullImage);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

    }, [fullTitle, currentDescription, keywords, fullUrl, fullImage, type, locale]);

    // Render structured data
    const renderStructuredData = () => {
        const scripts: string[] = [];

        // Product structured data
        if (productData) {
            const productSchema = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: productData.name,
                description: productData.description,
                image: productData.image.startsWith('http') ? productData.image : `${BASE_URL}${productData.image}`,
                ...(productData.sku && { sku: productData.sku }),
                ...(productData.price && {
                    offers: {
                        '@type': 'Offer',
                        price: productData.price,
                        priceCurrency: productData.priceCurrency || 'USD',
                        availability: `https://schema.org/${productData.availability || 'InStock'}`,
                    },
                }),
            };
            scripts.push(JSON.stringify(productSchema));
        }

        // Breadcrumb structured data
        if (breadcrumbs && breadcrumbs.length > 0) {
            const breadcrumbSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbs.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
                })),
            };
            scripts.push(JSON.stringify(breadcrumbSchema));
        }

        return scripts.map((script, index) => (
            <script
                key={index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: script }}
            />
        ));
    };

    return <>{renderStructuredData()}</>;
}
