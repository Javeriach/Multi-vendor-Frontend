'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUploadImage } from '../hooks/use-upload-image';

const MAX_IMAGES = 6;
const MAX_CLIENT_FILE_SIZE = 8 * 1024 * 1024;

interface UploadingSlot {
  id: string;
  previewUrl: string;
}

/**
 * Drag/click file upload, replacing the old "paste an image URL" textarea.
 * Every accepted file goes through `POST /uploads/image`, which resizes and
 * crops it server-side to a fixed 1200x1200 square (see UploadsService) —
 * the thumbnails here render at a matching `aspect-square` so what you see
 * is what actually gets stored, not just a CSS crop of a mismatched image.
 */
export function ImageUploadField<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: Path<T>;
}) {
  const uploadImage = useUploadImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingSlot[]>([]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const urls: string[] = field.value ?? [];
        const totalCount = urls.length + uploading.length;
        const atCapacity = totalCount >= MAX_IMAGES;

        const handleFiles = (files: FileList | null) => {
          if (!files) return;
          const remaining = MAX_IMAGES - totalCount;
          const selected = Array.from(files).slice(0, Math.max(0, remaining));
          if (files.length > selected.length) {
            toast.error(`Up to ${MAX_IMAGES} images per product`);
          }

          for (const file of selected) {
            // Any image format is accepted — the backend normalizes
            // everything (jpeg, png, gif, webp, avif, heic/heif, tiff, svg,
            // bmp, ...) to the same output JPEG, so this is just a basic
            // "is this even an image" sanity check, not a format allowlist.
            if (!file.type.startsWith('image/')) {
              toast.error(`${file.name}: only image files are allowed`);
              continue;
            }
            if (file.size > MAX_CLIENT_FILE_SIZE) {
              toast.error(`${file.name}: file is too large (max 8MB)`);
              continue;
            }

            const slot: UploadingSlot = { id: crypto.randomUUID(), previewUrl: URL.createObjectURL(file) };
            setUploading((prev) => [...prev, slot]);

            uploadImage.mutate(file, {
              onSuccess: ({ url }) => {
                field.onChange([...(field.value ?? []), url]);
              },
              onSettled: () => {
                setUploading((prev) => prev.filter((s) => s.id !== slot.id));
                URL.revokeObjectURL(slot.previewUrl);
              },
            });
          }
        };

        return (
          <FormItem>
            <FormLabel>Images ({totalCount}/{MAX_IMAGES})</FormLabel>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {urls.map((url) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
                  <Image src={url} alt="" fill sizes="150px" className="object-cover" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => field.onChange(urls.filter((u) => u !== url))}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {uploading.map((slot) => (
                <div key={slot.id} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                  <Image src={slot.previewUrl} alt="" fill sizes="150px" className="object-cover opacity-50" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Loader2 className="h-5 w-5 animate-spin text-white" aria-label="Uploading" />
                  </div>
                </div>
              ))}

              {!atCapacity && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs">Add</span>
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
