import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface LeadTimeItem {
  quantity_range: string;
  lead_days: string;
}

interface LeadTimeEditorProps {
  items: LeadTimeItem[];
  onChange: (items: LeadTimeItem[]) => void;
}

export default function LeadTimeEditor({ items, onChange }: LeadTimeEditorProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const addItem = () => {
    onChange([...safeItems, { quantity_range: '', lead_days: '' }]);
  };

  const updateItem = (index: number, field: keyof LeadTimeItem, value: string) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">交货时间</h3>
      </div>

      {/* Table header */}
      {safeItems.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1">数量范围 (如: 1 - 500)</div>
          <div className="flex-1">预计天数 (如: 15)</div>
          <div className="w-9"></div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {safeItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item.quantity_range}
              onChange={(e) => updateItem(index, 'quantity_range', e.target.value)}
              placeholder="1 - 500"
              className="flex-1 h-9"
            />
            <Input
              value={item.lead_days}
              onChange={(e) => updateItem(index, 'lead_days', e.target.value)}
              placeholder="15"
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
        添加交货时间档位
      </Button>
    </div>
  );
}
