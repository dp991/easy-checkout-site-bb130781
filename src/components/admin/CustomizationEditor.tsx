import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface CustomizationItem {
  service_name_zh: string;
  service_name_en: string;
  moq_zh: string;
  moq_en: string;
}

interface CustomizationEditorProps {
  items: CustomizationItem[];
  onChange: (items: CustomizationItem[]) => void;
}

const PRESET_SERVICES = [
  { zh: 'Logo定制', en: 'Logo Customization' },
  { zh: '包装定制', en: 'Packaging Customization' },
  { zh: '图形定制', en: 'Graphic Customization' },
  { zh: 'OEM服务', en: 'OEM Service' },
];

export default function CustomizationEditor({ items, onChange }: CustomizationEditorProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const addItem = () => {
    onChange([...safeItems, { service_name_zh: '', service_name_en: '', moq_zh: '', moq_en: '' }]);
  };

  const updateItem = (index: number, field: keyof CustomizationItem, value: string) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  const addPreset = (preset: { zh: string; en: string }) => {
    if (!safeItems.some(item => item.service_name_en === preset.en)) {
      onChange([...safeItems, { service_name_zh: preset.zh, service_name_en: preset.en, moq_zh: '', moq_en: '' }]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
        定制选项 / Customization
      </h3>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_SERVICES.map((preset) => (
          <Button
            key={preset.en}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addPreset(preset)}
            disabled={safeItems.some(item => item.service_name_en === preset.en)}
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

            {/* Chinese fields */}
            <div className="flex gap-2">
              <Input
                value={item.service_name_zh}
                onChange={(e) => updateItem(index, 'service_name_zh', e.target.value)}
                placeholder="服务名称 (中文)"
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={item.moq_zh}
                onChange={(e) => updateItem(index, 'moq_zh', e.target.value)}
                placeholder="最小起订量 (中文)"
                className="flex-1 h-8 text-sm"
              />
            </div>

            {/* English fields */}
            <div className="flex gap-2">
              <Input
                value={item.service_name_en}
                onChange={(e) => updateItem(index, 'service_name_en', e.target.value)}
                placeholder="Service name (English)"
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={item.moq_en}
                onChange={(e) => updateItem(index, 'moq_en', e.target.value)}
                placeholder="MOQ (English)"
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
        添加定制服务 / Add Customization
      </Button>
    </div>
  );
}
