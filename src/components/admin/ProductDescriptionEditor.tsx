import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useRef } from 'react';

// Types
export interface FeatureItem {
    title: string;
    content: string;
}

export interface SpecTable {
    category: string;
    specs: Array<{ name: string; value: string }>;
}

export interface RichContentBlock {
    type: 'text' | 'image';
    content: string;
}

export interface ProductDescriptionData {
    features: FeatureItem[];
    specTables: SpecTable[];
    richContent: RichContentBlock[];
}

interface ProductDescriptionEditorProps {
    value: ProductDescriptionData;
    onChange: (value: ProductDescriptionData) => void;
    language: 'zh' | 'en';
}

// Collapsible Section Component
function Section({
    title,
    children,
    defaultOpen = true,
    accentColor = 'primary'
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    accentColor?: 'primary' | 'accent' | 'orange';
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colorClasses = {
        primary: 'bg-primary',
        accent: 'bg-accent',
        orange: 'bg-orange-500'
    };

    return (
        <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <span className={`w-1 h-4 ${colorClasses[accentColor]} rounded-full`}></span>
                    {title}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-3 bg-background/50">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductDescriptionEditor({
    value,
    onChange,
    language
}: ProductDescriptionEditorProps) {
    const { uploadImages, isUploading } = useImageUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const labels = {
        zh: {
            features: '产品特点',
            featureTitle: '特点标题',
            featureContent: '特点描述',
            addFeature: '添加特点',
            specTables: '规格表格',
            category: '分类名称',
            specName: '参数名',
            specValue: '参数值',
            addSpec: '添加参数',
            addTable: '添加分类表格',
            richContent: '图文说明',
            addText: '添加文字段落',
            addImage: '添加图片',
            textPlaceholder: '输入说明文字...',
        },
        en: {
            features: 'Product Features',
            featureTitle: 'Feature Title',
            featureContent: 'Feature Description',
            addFeature: 'Add Feature',
            specTables: 'Specification Tables',
            category: 'Category Name',
            specName: 'Spec Name',
            specValue: 'Spec Value',
            addSpec: 'Add Spec',
            addTable: 'Add Category Table',
            richContent: 'Rich Content',
            addText: 'Add Text Block',
            addImage: 'Add Image',
            textPlaceholder: 'Enter description text...',
        }
    };

    const t = labels[language];

    // Feature handlers
    const addFeature = () => {
        onChange({
            ...value,
            features: [...value.features, { title: '', content: '' }]
        });
    };

    const updateFeature = (index: number, field: 'title' | 'content', val: string) => {
        const updated = [...value.features];
        updated[index] = { ...updated[index], [field]: val };
        onChange({ ...value, features: updated });
    };

    const removeFeature = (index: number) => {
        onChange({
            ...value,
            features: value.features.filter((_, i) => i !== index)
        });
    };

    // Spec table handlers
    const addSpecTable = () => {
        onChange({
            ...value,
            specTables: [...value.specTables, { category: '', specs: [{ name: '', value: '' }] }]
        });
    };

    const updateTableCategory = (tableIndex: number, category: string) => {
        const updated = [...value.specTables];
        updated[tableIndex] = { ...updated[tableIndex], category };
        onChange({ ...value, specTables: updated });
    };

    const addSpec = (tableIndex: number) => {
        const updated = [...value.specTables];
        updated[tableIndex] = {
            ...updated[tableIndex],
            specs: [...updated[tableIndex].specs, { name: '', value: '' }]
        };
        onChange({ ...value, specTables: updated });
    };

    const updateSpec = (tableIndex: number, specIndex: number, field: 'name' | 'value', val: string) => {
        const updated = [...value.specTables];
        const specs = [...updated[tableIndex].specs];
        specs[specIndex] = { ...specs[specIndex], [field]: val };
        updated[tableIndex] = { ...updated[tableIndex], specs };
        onChange({ ...value, specTables: updated });
    };

    const removeSpec = (tableIndex: number, specIndex: number) => {
        const updated = [...value.specTables];
        updated[tableIndex] = {
            ...updated[tableIndex],
            specs: updated[tableIndex].specs.filter((_, i) => i !== specIndex)
        };
        onChange({ ...value, specTables: updated });
    };

    const removeTable = (tableIndex: number) => {
        onChange({
            ...value,
            specTables: value.specTables.filter((_, i) => i !== tableIndex)
        });
    };

    // Rich content handlers
    const addTextBlock = () => {
        onChange({
            ...value,
            richContent: [...value.richContent, { type: 'text', content: '' }]
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const urls = await uploadImages(files);
        const newBlocks = urls.map(url => ({ type: 'image' as const, content: url }));
        onChange({
            ...value,
            richContent: [...value.richContent, ...newBlocks]
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const updateRichContent = (index: number, content: string) => {
        const updated = [...value.richContent];
        updated[index] = { ...updated[index], content };
        onChange({ ...value, richContent: updated });
    };

    const removeRichContent = (index: number) => {
        onChange({
            ...value,
            richContent: value.richContent.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-4">
            {/* Features Section */}
            <Section title={t.features} accentColor="primary">
                {value.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-1 text-muted-foreground pt-2">
                            <GripVertical className="w-4 h-4" />
                            <span className="text-sm font-medium w-5">{index + 1}.</span>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                            <Input
                                value={feature.title}
                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                placeholder={t.featureTitle}
                                className="text-sm"
                            />
                            <Input
                                value={feature.content}
                                onChange={(e) => updateFeature(index, 'content', e.target.value)}
                                placeholder={t.featureContent}
                                className="col-span-2 text-sm"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(index)}
                            className="text-destructive hover:text-destructive h-9 w-9"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addFeature} className="border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    {t.addFeature}
                </Button>
            </Section>

            {/* Spec Tables Section */}
            <Section title={t.specTables} accentColor="accent">
                {value.specTables.map((table, tableIndex) => (
                    <div key={tableIndex} className="border border-border/50 rounded-lg p-3 space-y-3 bg-muted/20">
                        <div className="flex gap-2 items-center">
                            <Input
                                value={table.category}
                                onChange={(e) => updateTableCategory(tableIndex, e.target.value)}
                                placeholder={t.category}
                                className="font-medium"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTable(tableIndex)}
                                className="text-destructive hover:text-destructive h-9 w-9"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {table.specs.map((spec, specIndex) => (
                                <div key={specIndex} className="flex gap-2 items-center">
                                    <Input
                                        value={spec.name}
                                        onChange={(e) => updateSpec(tableIndex, specIndex, 'name', e.target.value)}
                                        placeholder={t.specName}
                                        className="text-sm w-1/3"
                                    />
                                    <Input
                                        value={spec.value}
                                        onChange={(e) => updateSpec(tableIndex, specIndex, 'value', e.target.value)}
                                        placeholder={t.specValue}
                                        className="text-sm flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeSpec(tableIndex, specIndex)}
                                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button type="button" variant="ghost" size="sm" onClick={() => addSpec(tableIndex)} className="text-primary hover:bg-primary/10">
                            <Plus className="w-3 h-3 mr-1" />
                            {t.addSpec}
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSpecTable} className="border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    {t.addTable}
                </Button>
            </Section>

            {/* Rich Content Section */}
            <Section title={t.richContent} accentColor="orange">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {value.richContent.map((block, index) => (
                        block.type === 'text' ? (
                            <div key={index} className="col-span-2 md:col-span-4 group relative flex gap-2 items-start">
                                <Textarea
                                    value={block.content}
                                    onChange={(e) => updateRichContent(index, e.target.value)}
                                    placeholder={t.textPlaceholder}
                                    rows={3}
                                    className="flex-1 text-sm bg-background"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRichContent(index)}
                                    className="text-muted-foreground hover:text-destructive h-9 w-9 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div key={index} className="col-span-1 group relative aspect-square bg-background rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-all overflow-hidden flex items-center justify-center">
                                <img
                                    src={block.content}
                                    alt=""
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeRichContent(index)}
                                        className="h-7 w-7 shadow-sm"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={addTextBlock} className="border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary">
                        <Plus className="w-4 h-4 mr-1" />
                        {t.addText}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="border-dashed border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                    >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        {t.addImage}
                    </Button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </Section>
        </div>
    );
}

// Helper to create empty data
export function createEmptyProductDescription(): ProductDescriptionData {
    return {
        features: [],
        specTables: [],
        richContent: []
    };
}

// Helper to parse existing data
export function parseProductDescription(data: unknown): ProductDescriptionData {
    if (!data || typeof data !== 'object') {
        return createEmptyProductDescription();
    }

    const d = data as Record<string, unknown>;
    return {
        features: Array.isArray(d.features) ? d.features : [],
        specTables: Array.isArray(d.specTables) ? d.specTables : [],
        richContent: Array.isArray(d.richContent) ? d.richContent : []
    };
}
