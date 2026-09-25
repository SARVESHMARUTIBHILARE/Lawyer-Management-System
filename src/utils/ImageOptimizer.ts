/**
 * Utility to downscale and compress images to prevent exceeding localStorage quota.
 * Resizes images to max 256x256 and compresses to JPEG with quality 0.78,
 * resulting in ~10KB - 25KB data URLs instead of 2MB - 10MB raw files.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while bounding within max dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to uncompressed if canvas context is unavailable
            resolve(readerEvent.target?.result as string);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression failed, falling back to original:', err);
          resolve(readerEvent.target?.result as string);
        }
      };
      img.onerror = () => {
        reject(new Error('Failed to load image element for compression.'));
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };
    reader.readAsDataURL(file);
  });
}

export async function compressDataUrl(
  dataUrl: string,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.78
): Promise<string> {
  // If it's already an HTTP URL or tiny data URL, return directly
  if (!dataUrl.startsWith('data:image/') || dataUrl.length < 30000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

/**
 * Safely writes to localStorage. If QuotaExceededError is encountered,
 * it safely purges temporary/legacy keys and retries.
 */
export function safeLocalStorageSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`Quota exceeded while setting "${key}". Attempting cleanup...`, err);
    try {
      // Clean up known heavy or redundant keys
      const keysToClean = [
        'jurispulse_persons_registry',
        'jurispulse_lawyers_roster',
        'jurispulse_clients_roster'
      ];

      for (const k of keysToClean) {
        if (k !== key) {
          // Remove old oversized cache if it contains massive base64
          const item = localStorage.getItem(k);
          if (item && item.length > 500000) {
            localStorage.removeItem(k);
          }
        }
      }

      // Try setting again
      localStorage.setItem(key, value);
      return true;
    } catch (retryErr) {
      console.error(`Unable to save "${key}" to localStorage even after cleanup:`, retryErr);
      return false;
    }
  }
}
