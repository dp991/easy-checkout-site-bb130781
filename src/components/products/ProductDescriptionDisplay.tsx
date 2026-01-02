import { ProductDescriptionData } from '@/components/admin/ProductDescriptionEditor';

interface ProductDescriptionDisplayProps {
    data: ProductDescriptionData | null | undefined;
    locale: 'zh' | 'en';
    fallbackText?: string;
}

export default function ProductDescriptionDisplay({
    data,
    locale,
    fallbackText
}: ProductDescriptionDisplayProps) {
    // If no data or empty data, show fallback
    if (!data || (data.features.length === 0 && data.specTables.length === 0 && data.richContent.length === 0)) {
        return (
            <p className="text-muted-foreground">
                {fallbackText || (locale === 'zh' ? '暂无详细描述' : 'No description available')}
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {/* Features Section */}
            {data.features.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">
                        {locale === 'zh' ? '产品特点' : 'Product Features'}
                    </h3>
                    <div className="space-y-2">
                        {data.features.map((feature, index) => (
                            <div key={index} className="flex gap-2 text-sm">
                                <span className="text-cyan-400 font-medium shrink-0">{index + 1}.</span>
                                <div>
                                    {feature.title && (
                                        <span className="text-cyan-400 font-medium">{feature.title}: </span>
                                    )}
                                    <span className="text-foreground">{feature.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Spec Tables Section - Unified table with category headers as rows */}
            {data.specTables.length > 0 && (
                <div className="rounded-lg border border-border overflow-hidden">
                    {data.specTables.map((table, tableIndex) => (
                        <div key={tableIndex}>
                            {/* Category Header Row */}
                            {table.category && (
                                <div className="bg-muted/50 border-b border-border py-2 px-3">
                                    <h4 className="text-base font-semibold text-cyan-400 text-center">
                                        {table.category}
                                    </h4>
                                </div>
                            )}
                            {/* Spec Rows */}
                            {table.specs.filter(spec => spec.name || spec.value).map((spec, specIndex) => (
                                <div
                                    key={specIndex}
                                    className={`flex border-b border-border last:border-b-0 ${specIndex % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'
                                        }`}
                                >
                                    <div className="w-2/5 p-3 text-sm text-cyan-400 font-medium border-r border-border">
                                        {spec.name}
                                    </div>
                                    <div className="w-3/5 p-3 text-sm text-foreground">
                                        {spec.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Rich Content Section */}
            {data.richContent.length > 0 && (
                <div className="space-y-4">
                    {data.richContent.map((block, index) => (
                        <div key={index}>
                            {block.type === 'text' ? (
                                <p className="text-foreground whitespace-pre-wrap text-justify indent-8">{block.content}</p>
                            ) : (
                                <img
                                    src={block.content}
                                    alt=""
                                    className="w-full max-w-2xl h-auto rounded-lg mx-auto"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
