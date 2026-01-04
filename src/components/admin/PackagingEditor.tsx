import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface PackagingItem {
  key_zh: string;
  key_en: string;
  value_zh: string;
  value_en: string;
}

interface PackagingEditorProps {
  items: PackagingItem[];
  onChange: (items: PackagingItem[]) => void;
}

const PRESET_KEYS = [
  { zh: '销售单位', en: 'Selling Units' },
  { zh: '单个包装尺寸', en: 'Single Package Size' },
  { zh: '单个毛重', en: 'Single Gross Weight' },
  { zh: '包装类型', en: 'Package Type' },
  { zh: '有效期', en: 'Valid Period' },
  { zh: '包装细节', en: 'Packaging Details' },
];

export default function PackagingEditor({ items, onChange }: PackagingEditorProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const addItem = () => {
    onChange([...safeItems, { key_zh: '', key_en: '', value_zh: '', value_en: '' }]);
  };

  const updateItem = (index: number, field: keyof PackagingItem, value: string) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  const addPreset = (preset: { zh: string; en: string }) => {
    if (!safeItems.some(item => item.key_en === preset.en)) {
      onChange([...safeItems, { key_zh: preset.zh, key_en: preset.en, value_zh: '', value_en: '' }]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-accent rounded-full"></span>
        包装和发货信息 / Packaging & Delivery
      </h3>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_KEYS.map((preset) => (
          <Button
            key={preset.en}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addPreset(preset)}
            disabled={safeItems.some(item => item.key_en === preset.en)}
          >
            + {preset.en}
          </Button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {safeItems.map((item, index) => (
          <div key={index} className="p-3 border border-border rounded-lg bg-muted/20 space-y-2">
            {/* Delete button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Chinese key/value */}
            <div className="flex gap-2">
              <Input
                value={item.key_zh}
                onChange={(e) => updateItem(index, 'key_zh', e.target.value)}
                placeholder="名称 (中文)"
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={item.value_zh}
                onChange={(e) => updateItem(index, 'value_zh', e.target.value)}
                placeholder="值 (中文)"
                className="flex-1 h-8 text-sm"
              />
            </div>

            {/* English key/value */}
            <div className="flex gap-2">
              <Input
                value={item.key_en}
                onChange={(e) => updateItem(index, 'key_en', e.target.value)}
                placeholder="Name (English)"
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={item.value_en}
                onChange={(e) => updateItem(index, 'value_en', e.target.value)}
                placeholder="Value (English)"
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
        onClick={addItem}
        className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
      >
        <Plus className="w-4 h-4 mr-2" />
        添加包装信息 / Add Packaging Info
      </Button>
    </div>
  );
}
