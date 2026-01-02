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
    defaultOpen = true
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
            >
                <span className="font-medium text-sm">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                        <div className="p-4 space-y-3">
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
            <Section title={t.features}>
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
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="w-4 h-4 mr-1" />
                    {t.addFeature}
                </Button>
            </Section>

            {/* Spec Tables Section */}
            <Section title={t.specTables}>
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

                        <Button type="button" variant="ghost" size="sm" onClick={() => addSpec(tableIndex)}>
                            <Plus className="w-3 h-3 mr-1" />
                            {t.addSpec}
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSpecTable}>
                    <Plus className="w-4 h-4 mr-1" />
                    {t.addTable}
                </Button>
            </Section>

            {/* Rich Content Section */}
            <Section title={t.richContent}>
                {value.richContent.map((block, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        {block.type === 'text' ? (
                            <Textarea
                                value={block.content}
                                onChange={(e) => updateRichContent(index, e.target.value)}
                                placeholder={t.textPlaceholder}
                                rows={3}
                                className="flex-1 text-sm"
                            />
                        ) : (
                            <div className="flex-1 relative">
                                <img
                                    src={block.content}
                                    alt=""
                                    className="w-full max-h-48 object-contain rounded-lg bg-muted"
                                />
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRichContent(index)}
                            className="text-destructive hover:text-destructive h-9 w-9"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={addTextBlock}>
                        <Plus className="w-4 h-4 mr-1" />
                        {t.addText}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
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
