import React from 'react';
import { Image, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';

interface PhotoPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakePhoto?: () => void; // Deprecated - kept for backward compatibility but never shown
  onChooseFromLibrary: () => void;
  onRemovePhoto?: () => void;
  showRemove?: boolean;
  cameraSupported?: boolean; // Deprecated - camera is always disabled
  isProcessing?: boolean;
}

/**
 * Bottom sheet for photo picking options
 * CAMERA DISABLED: Only gallery selection is available to prevent iOS crashes
 */
export const PhotoPickerSheet: React.FC<PhotoPickerSheetProps> = ({
  open,
  onOpenChange,
  onChooseFromLibrary,
  onRemovePhoto,
  showRemove = false,
  isProcessing = false,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[50vh]">
        <DrawerHeader className="text-center">
          <DrawerTitle>עדכון תמונת פרופיל</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-8 space-y-2">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">מעבד תמונה...</p>
            </div>
          ) : (
            <>
              {/* Choose from Library - the only option available */}
              <Button
                variant="outline"
                className="w-full h-14 justify-start gap-4 text-base"
                onClick={() => {
                  onChooseFromLibrary();
                  onOpenChange(false);
                }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Image className="w-5 h-5 text-primary" />
                </div>
                בחר מהגלריה
              </Button>
              
              {/* Remove Photo - only show when there's a photo */}
              {showRemove && onRemovePhoto && (
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start gap-4 text-base text-destructive hover:text-destructive"
                  onClick={() => {
                    onRemovePhoto();
                    onOpenChange(false);
                  }}
                >
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  הסר תמונה
                </Button>
              )}
              
              {/* Cancel */}
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 text-muted-foreground"
                >
                  ביטול
                </Button>
              </DrawerClose>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PhotoPickerSheet;
