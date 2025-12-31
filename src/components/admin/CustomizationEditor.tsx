import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface CustomizationItem {
  service_name: string;
  moq: string;
}

interface CustomizationEditorProps {
  items: CustomizationItem[];
  onChange: (items: CustomizationItem[]) => void;
}

const PRESET_SERVICES = [
  'Logo Customization',
  'Packaging Customization',
  'Graphic Customization',
  'OEM Service',
];

export default function CustomizationEditor({ items, onChange }: CustomizationEditorProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const addItem = () => {
    onChange([...safeItems, { service_name: '', moq: '' }]);
  };

  const updateItem = (index: number, field: keyof CustomizationItem, value: string) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  const addPreset = (name: string) => {
    if (!safeItems.some(item => item.service_name === name)) {
      onChange([...safeItems, { service_name: name, moq: '' }]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">定制选项</h3>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_SERVICES.map((name) => (
          <Button
            key={name}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addPreset(name)}
            disabled={safeItems.some(item => item.service_name === name)}
          >
            + {name}
          </Button>
        ))}
      </div>

      {/* Table header */}
      {safeItems.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1">服务名称</div>
          <div className="flex-1">最小起订量 (MOQ)</div>
          <div className="w-9"></div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {safeItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item.service_name}
              onChange={(e) => updateItem(index, 'service_name', e.target.value)}
              placeholder="Logo Customization"
              className="flex-1 h-9"
            />
            <Input
              value={item.moq}
              onChange={(e) => updateItem(index, 'moq', e.target.value)}
              placeholder="150 pieces"
              className="flex-1 h-9"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="h-9 w-9 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        添加定制服务
      </Button>
    </div>
  );
}
