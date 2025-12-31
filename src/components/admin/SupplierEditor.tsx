import { Building2, MapPin, Calendar, Shield, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useRef, useState } from 'react';

export interface SupplierInfo {
  name: string;
  location: string;
  type: string;
  years: number;
  verified: boolean;
  logo_url?: string;
  certifications: string[];
}

interface SupplierEditorProps {
  supplier: SupplierInfo;
  onChange: (supplier: SupplierInfo) => void;
}

const BUSINESS_TYPES = [
  'Manufacturer',
  'Trading Company',
  'Factory + Trading',
  'OEM/ODM Service Provider',
  'Distributor',
];

const CERTIFICATIONS = [
  'ISO 9001',
  'ISO 14001',
  'CE',
  'FCC',
  'RoHS',
  'UL',
  'CCC',
  'BSCI',
  'SA8000',
];

export default function SupplierEditor({ supplier, onChange }: SupplierEditorProps) {
  const { uploadImages, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCert, setNewCert] = useState('');

  // Ensure supplier has all required fields with defaults
  const safeSupplier: SupplierInfo = {
    name: supplier?.name ?? '',
    location: supplier?.location ?? '',
    type: supplier?.type ?? '',
    years: supplier?.years ?? 0,
    verified: supplier?.verified ?? false,
    logo_url: supplier?.logo_url ?? '',
    certifications: Array.isArray(supplier?.certifications) ? supplier.certifications : [],
  };

  const updateField = <K extends keyof SupplierInfo>(field: K, value: SupplierInfo[K]) => {
    onChange({ ...safeSupplier, [field]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls = await uploadImages(files);
    if (urls.length > 0) {
      updateField('logo_url', urls[0]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addCertification = (cert: string) => {
    if (cert && !safeSupplier.certifications.includes(cert)) {
      updateField('certifications', [...safeSupplier.certifications, cert]);
    }
    setNewCert('');
  };

  const removeCertification = (cert: string) => {
    updateField('certifications', safeSupplier.certifications.filter(c => c !== cert));
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Building2 className="w-4 h-4" />
        <span>供应商信息 (Supplier Info)</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">公司名称</label>
          <Input
            value={safeSupplier.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Hangzhou XingWei Technology Co., Ltd."
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> 所在地
          </label>
          <Input
            value={safeSupplier.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Hangzhou, Zhejiang, China"
          />
        </div>

        {/* Business Type */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">业务类型</label>
          <Select value={safeSupplier.type} onValueChange={(v) => updateField('type', v)}>
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Years */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> 成立年限
          </label>
          <Input
            type="number"
            value={safeSupplier.years || ''}
            onChange={(e) => updateField('years', parseInt(e.target.value) || 0)}
            placeholder="20"
            min={0}
          />
        </div>
      </div>

      {/* Verified Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={safeSupplier.verified}
          onCheckedChange={(checked) => updateField('verified', !!checked)}
        />
        <label className="text-sm flex items-center gap-1">
          <Shield className="w-4 h-4 text-primary" />
          已认证供应商 (Verified Supplier)
        </label>
      </div>

      {/* Logo Upload */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">公司 Logo</label>
        <div className="flex items-center gap-3">
          {safeSupplier.logo_url ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
              <img src={safeSupplier.logo_url} alt="Logo" className="w-full h-full object-contain bg-white" />
              <button
                type="button"
                onClick={() => updateField('logo_url', '')}
                className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground rounded-bl-lg flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              上传 Logo
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">认证资质</label>
        <div className="flex flex-wrap gap-1.5">
          {safeSupplier.certifications.map((cert) => (
            <Badge key={cert} variant="secondary" className="gap-1">
              {cert}
              <button
                type="button"
                onClick={() => removeCertification(cert)}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Select value={newCert} onValueChange={addCertification}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="添加认证" />
            </SelectTrigger>
            <SelectContent>
              {CERTIFICATIONS.filter(c => !safeSupplier.certifications.includes(c)).map((cert) => (
                <SelectItem key={cert} value={cert}>{cert}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
