'use client';

import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { ImagePlus, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export function MessageComposer({
  onSendText,
  onSendImage,
  isSending,
  disabled,
}: {
  onSendText: (text: string) => void;
  onSendImage: (file: File) => Promise<void> | void;
  isSending: boolean;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submitText = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendText(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitText();
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image is too large (max 8MB)');
      return;
    }
    setIsUploadingImage(true);
    try {
      await onSendImage(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="flex items-end gap-2 border-t bg-background p-3">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label="Attach image"
        disabled={disabled || isUploadingImage}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
      </Button>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
        rows={1}
        disabled={disabled}
        className={cn(
          'max-h-[120px] flex-1 resize-none rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50',
        )}
      />

      <Button
        type="button"
        size="icon"
        className="shrink-0 rounded-full"
        aria-label="Send message"
        disabled={disabled || !text.trim()}
        loading={isSending}
        onClick={submitText}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
