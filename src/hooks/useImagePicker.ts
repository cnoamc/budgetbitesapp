import { useState, useCallback, useRef } from 'react';

const LOG_TAG = '[PROFILE_PHOTO]';

interface ImagePickerOptions {
  maxSizeMB?: number;
  maxDimension?: number;
  quality?: number;
}

interface ImagePickerResult {
  dataUrl: string | null;
  error: string | null;
}

/**
 * Detect if device is iPad or tablet
 */
export function isTabletDevice(): boolean {
  try {
    const ua = navigator.userAgent.toLowerCase();
    
    // iPad detection (including iPadOS 13+ which reports as Mac)
    const isIPad = /ipad/.test(ua) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
      (/macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    
    // Android tablet detection (has android but not mobile)
    const isAndroidTablet = /android/.test(ua) && !/mobile/.test(ua);
    
    // Generic tablet detection based on screen size
    const isLargeScreen = Math.min(window.screen.width, window.screen.height) >= 600;
    const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    
    return isIPad || isAndroidTablet || (isLargeScreen && hasTouch && !/mobile/.test(ua));
  } catch (e) {
    console.error(LOG_TAG, 'Error detecting tablet:', e);
    return false;
  }
}

/**
 * Check if camera capture is supported on this device
 */
export function isCameraCaptureSupported(): boolean {
  try {
    // Tablets often have issues with capture attribute
    if (isTabletDevice()) {
      console.log(LOG_TAG, 'Tablet detected - disabling direct camera capture');
      return false;
    }
    
    // Check if we're on a mobile device that supports capture
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipod|android.*mobile/.test(ua);
    
    // Check for MediaDevices API (camera access)
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    
    return isMobile && hasMediaDevices;
  } catch (e) {
    console.error(LOG_TAG, 'Error checking camera support:', e);
    return false;
  }
}

/**
 * Compress and crop image to square
 */
async function compressImage(
  file: File, 
  maxDimension: number = 512, 
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const img = new Image();
          
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const size = Math.min(img.width, img.height);
              const offsetX = (img.width - size) / 2;
              const offsetY = (img.height - size) / 2;
              
              canvas.width = maxDimension;
              canvas.height = maxDimension;
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }
              
              ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, maxDimension, maxDimension);
              const dataUrl = canvas.toDataURL('image/jpeg', quality);
              resolve(dataUrl);
            } catch (e) {
              console.error(LOG_TAG, 'Canvas processing error:', e);
              reject(new Error('Failed to process image'));
            }
          };
          
          img.onerror = () => {
            console.error(LOG_TAG, 'Image load error');
            reject(new Error('Failed to load image'));
          };
          
          img.src = e.target?.result as string;
        } catch (e) {
          console.error(LOG_TAG, 'Image creation error:', e);
          reject(new Error('Failed to create image'));
        }
      };
      
      reader.onerror = () => {
        console.error(LOG_TAG, 'FileReader error');
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(LOG_TAG, 'Compression setup error:', e);
      reject(new Error('Failed to start compression'));
    }
  });
}

/**
 * Validate file type and size
 */
function validateFile(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!file.type) {
    // Some browsers don't report type for HEIC, allow by extension
    const ext = file.name?.toLowerCase().split('.').pop();
    if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'].includes(ext || '')) {
      return { valid: false, error: 'סוג קובץ לא נתמך' };
    }
  } else if (!validTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'סוג קובץ לא נתמך. יש לבחור תמונה' };
  }
  
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `הקובץ גדול מדי. גודל מקסימלי: ${maxSizeMB}MB` };
  }
  
  return { valid: true };
}

/**
 * Hook for robust image picking with camera/library options
 */
export function useImagePicker(options: ImagePickerOptions = {}) {
  const { maxSizeMB = 10, maxDimension = 512, quality = 0.8 } = options;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const libraryInputRef = useRef<HTMLInputElement | null>(null);
  
  const cameraSupported = isCameraCaptureSupported();
  const isTablet = isTabletDevice();
  
  /**
   * Process a selected file
   */
  const processFile = useCallback(async (file: File | undefined | null): Promise<ImagePickerResult> => {
    // Reset error state
    setError(null);
    
    // Early exit if no file (user cancelled)
    if (!file) {
      console.log(LOG_TAG, 'No file selected (user cancelled)');
      return { dataUrl: null, error: null };
    }
    
    console.log(LOG_TAG, 'Processing file:', { 
      name: file.name, 
      type: file.type, 
      size: file.size 
    });
    
    // Validate file
    const validation = validateFile(file, maxSizeMB);
    if (!validation.valid) {
      console.warn(LOG_TAG, 'Validation failed:', validation.error);
      setError(validation.error || 'קובץ לא תקין');
      return { dataUrl: null, error: validation.error || 'קובץ לא תקין' };
    }
    
    setIsProcessing(true);
    
    try {
      const dataUrl = await compressImage(file, maxDimension, quality);
      console.log(LOG_TAG, 'Image processed successfully');
      setIsProcessing(false);
      return { dataUrl, error: null };
    } catch (e) {
      console.error(LOG_TAG, 'Processing error:', e);
      const errorMsg = 'לא הצלחנו לעבד את התמונה. נסה שוב';
      setError(errorMsg);
      setIsProcessing(false);
      return { dataUrl: null, error: errorMsg };
    }
  }, [maxSizeMB, maxDimension, quality]);
  
  /**
   * Handle file input change event
   */
  const handleFileChange = useCallback(async (
    event: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const file = event.target.files?.[0];
      
      // Clear input value to allow re-selecting same file
      if (event.target) {
        event.target.value = '';
      }
      
      const result = await processFile(file);
      
      if (result.dataUrl) {
        onSuccess(result.dataUrl);
      } else if (result.error && onError) {
        onError(result.error);
      }
      // If both are null, user cancelled - do nothing
    } catch (e) {
      console.error(LOG_TAG, 'Unexpected error in handleFileChange:', e);
      const errorMsg = 'לא הצלחנו לעדכן את התמונה. נסה שוב';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    }
  }, [processFile]);
  
  /**
   * Open camera (only if supported)
   */
  const openCamera = useCallback(() => {
    if (!cameraSupported) {
      console.warn(LOG_TAG, 'Camera not supported on this device');
      return false;
    }
    
    try {
      cameraInputRef.current?.click();
      return true;
    } catch (e) {
      console.error(LOG_TAG, 'Error opening camera:', e);
      return false;
    }
  }, [cameraSupported]);
  
  /**
   * Open photo library
   */
  const openLibrary = useCallback(() => {
    try {
      libraryInputRef.current?.click();
      return true;
    } catch (e) {
      console.error(LOG_TAG, 'Error opening library:', e);
      return false;
    }
  }, []);
  
  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    // State
    isProcessing,
    error,
    cameraSupported,
    isTablet,
    
    // Refs for inputs
    cameraInputRef,
    libraryInputRef,
    
    // Actions
    processFile,
    handleFileChange,
    openCamera,
    openLibrary,
    clearError,
  };
}
