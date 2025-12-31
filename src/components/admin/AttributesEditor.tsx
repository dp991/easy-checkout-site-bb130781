import { Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductAttribute {
  key: string;
  value: string;
  is_key_attribute?: boolean;
  group?: string;
}

interface AttributesEditorProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
}

const PRESET_KEYS = [
  'Brand Name',
  'Model Number',
  'Place of Origin',
  'Processor (CPU)',
  'Memory (RAM)',
  'Storage (ROM)',
  'Screen Size',
  'Operating System',
  'Interface Type',
  'Power Supply',
  'Dimensions',
  'Weight',
  'Warranty',
  'Certification',
];

export default function AttributesEditor({ attributes, onChange }: AttributesEditorProps) {
  const addAttribute = () => {
    onChange([...attributes, { key: '', value: '', is_key_attribute: false }]);
  };

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string | boolean) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  const addPreset = (key: string) => {
    if (!attributes.some(attr => attr.key === key)) {
      onChange([...attributes, { key, value: '', is_key_attribute: false }]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_KEYS.slice(0, 6).map((key) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addPreset(key)}
            disabled={attributes.some(attr => attr.key === key)}
          >
            + {key}
          </Button>
        ))}
      </div>

      {/* Attributes list */}
      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Checkbox
                checked={attr.is_key_attribute}
                onCheckedChange={(checked) => updateAttribute(index, 'is_key_attribute', !!checked)}
                title="显示在首屏"
              />
              <Star className={`w-3.5 h-3.5 ${attr.is_key_attribute ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
            </div>
            <Input
              value={attr.key}
              onChange={(e) => updateAttribute(index, 'key', e.target.value)}
              placeholder="属性名称"
              className="flex-1 h-9"
              list="preset-keys"
            />
            <Input
              value={attr.value}
              onChange={(e) => updateAttribute(index, 'value', e.target.value)}
              placeholder="属性值"
              className="flex-1 h-9"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAttribute(index)}
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
        onClick={addAttribute}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        添加属性
      </Button>

      {/* Datalist for suggestions */}
      <datalist id="preset-keys">
        {PRESET_KEYS.map((key) => (
          <option key={key} value={key} />
        ))}
      </datalist>
    </div>
  );
}
