import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface PackagingItem {
  key: string;
  value: string;
}

interface PackagingEditorProps {
  items: PackagingItem[];
  onChange: (items: PackagingItem[]) => void;
}

const PRESET_KEYS = [
  'Selling Units',
  'Single Package Size',
  'Single Gross Weight',
  'Package Type',
  'Valid Period',
];

export default function PackagingEditor({ items, onChange }: PackagingEditorProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const addItem = () => {
    onChange([...safeItems, { key: '', value: '' }]);
  };

  const updateItem = (index: number, field: keyof PackagingItem, value: string) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  const addPreset = (key: string) => {
    if (!safeItems.some(item => item.key === key)) {
      onChange([...safeItems, { key, value: '' }]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">包装和发货信息</h3>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_KEYS.map((key) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addPreset(key)}
            disabled={safeItems.some(item => item.key === key)}
          >
            + {key}
          </Button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {safeItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item.key}
              onChange={(e) => updateItem(index, 'key', e.target.value)}
              placeholder="名称 (如: 销售单位)"
              className="flex-1 h-9"
            />
            <Input
              value={item.value}
              onChange={(e) => updateItem(index, 'value', e.target.value)}
              placeholder="值 (如: 单一商品)"
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
        添加包装信息
      </Button>
    </div>
  );
}
