import { Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductAttribute {
  key_zh: string;
  key_en: string;
  value_zh: string;
  value_en: string;
  is_key_attribute?: boolean;
  group?: string;
}

interface AttributesEditorProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
}

const PRESET_KEYS = [
  { zh: '品牌名称', en: 'Brand Name' },
  { zh: '型号', en: 'Model Number' },
  { zh: '产地', en: 'Place of Origin' },
  { zh: '处理器 (CPU)', en: 'Processor (CPU)' },
  { zh: '内存 (RAM)', en: 'Memory (RAM)' },
  { zh: '存储 (ROM)', en: 'Storage (ROM)' },
  { zh: '屏幕尺寸', en: 'Screen Size' },
  { zh: '操作系统', en: 'Operating System' },
  { zh: '接口类型', en: 'Interface Type' },
  { zh: '电源', en: 'Power Supply' },
  { zh: '尺寸', en: 'Dimensions' },
  { zh: '重量', en: 'Weight' },
  { zh: '保修', en: 'Warranty' },
  { zh: '认证', en: 'Certification' },
];

export default function AttributesEditor({ attributes, onChange }: AttributesEditorProps) {
  const addAttribute = () => {
    onChange([...attributes, { key_zh: '', key_en: '', value_zh: '', value_en: '', is_key_attribute: false }]);
  };

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string | boolean) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  const addPreset = (preset: { zh: string; en: string }) => {
    if (!attributes.some(attr => attr.key_en === preset.en)) {
      onChange([...attributes, { key_zh: preset.zh, key_en: preset.en, value_zh: '', value_en: '', is_key_attribute: false }]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_KEYS.slice(0, 6).map((preset) => (
          <Button
            key={preset.en}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addPreset(preset)}
            disabled={attributes.some(attr => attr.key_en === preset.en)}
          >
            + {preset.en}
          </Button>
        ))}
      </div>

      {/* Attributes list */}
      <div className="space-y-3">
        {attributes.map((attr, index) => (
          <div key={index} className="p-3 border border-border rounded-lg bg-muted/20 space-y-2">
            {/* First row: Key attribute checkbox + Delete button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={attr.is_key_attribute}
                  onCheckedChange={(checked) => updateAttribute(index, 'is_key_attribute', !!checked)}
                />
                <Star className={`w-3.5 h-3.5 ${attr.is_key_attribute ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs text-muted-foreground">显示在首屏</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAttribute(index)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Second row: Chinese key/value */}
            <div className="flex gap-2">
              <Input
                value={attr.key_zh}
                onChange={(e) => updateAttribute(index, 'key_zh', e.target.value)}
                placeholder="属性名称 (中文)"
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={attr.value_zh}
                onChange={(e) => updateAttribute(index, 'value_zh', e.target.value)}
                placeholder="属性值 (中文)"
                className="flex-1 h-8 text-sm"
              />
            </div>

            {/* Third row: English key/value */}
            <div className="flex gap-2">
              <Input
                value={attr.key_en}
                onChange={(e) => updateAttribute(index, 'key_en', e.target.value)}
                placeholder="Attribute name (English)"
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={attr.value_en}
                onChange={(e) => updateAttribute(index, 'value_en', e.target.value)}
                placeholder="Attribute value (English)"
                className="flex-1 h-8 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addAttribute}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        添加属性 / Add Attribute
      </Button>
    </div>
  );
}
