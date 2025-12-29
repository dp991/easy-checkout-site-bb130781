import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImages = async (files: FileList | File[]): Promise<string[]> => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];
    const totalFiles = fileArray.length;

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('图片上传失败');
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { uploadImages, isUploading, uploadProgress };
}
