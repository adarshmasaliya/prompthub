export interface Category {
  id: string;
  name: string;
}

export interface Prompt {
  id:string;
  title: string;
  description: string;
  promptText: string;
  categoryId: string;
  imageUrl?: string;
  createdAt: string;
  logoUrl?: string;
  productImageUrl?: string;
  humanPhotoUrl?: string;
  referenceImageUrl?: string;
  assetUrl?: string;
}

// FIX: Add AIStudio interface for Veo API key selection and declare it on the global window object.
// FIX: Moved the `AIStudio` interface inside the `declare global` block to make it a true global type and resolve declaration conflicts.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
