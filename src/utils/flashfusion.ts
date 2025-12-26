import { FlashFusionPack } from "@/types/flashfusion";

/**
 * Estimate token count for a given text
 * Using a simple approximation: ~4 characters per token on average
 * This is a rough estimate - actual token count may vary by tokenizer
 */
export const estimateTokens = (text: string): number => {
  if (!text) return 0;

  // Remove extra whitespace
  const cleaned = text.trim().replace(/\s+/g, " ");

  if (!cleaned) return 0;

  // Approximate: 1 token ≈ 4 characters for English text
  // Adjust for punctuation and special characters
  const charCount = cleaned.length;
  const wordCount = cleaned.split(/\s+/).length;

  // Use a weighted average: character-based estimate and word-based estimate
  const charEstimate = charCount / 4;
  const wordEstimate = wordCount * 1.3; // Average word is ~1.3 tokens

  return Math.ceil((charEstimate + wordEstimate) / 2);
};

/**
 * Calculate total tokens for all sections of a prompt
 */
export const calculateTotalTokens = (sections: {
  context: string;
  task: string;
  constraints: string;
  tone: string;
}): number => {
  return (
    estimateTokens(sections.context) +
    estimateTokens(sections.task) +
    estimateTokens(sections.constraints) +
    estimateTokens(sections.tone)
  );
};

/**
 * Export prompt configuration as FlashFusion Pack (.ffpack.json)
 */
export const exportFlashFusionPack = (pack: FlashFusionPack): void => {
  const jsonString = JSON.stringify(pack, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${pack.name.replace(/\s+/g, "-").toLowerCase()}.ffpack.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import FlashFusion Pack from JSON file
 */
export const importFlashFusionPack = (file: File): Promise<FlashFusionPack> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const pack = JSON.parse(content) as FlashFusionPack;

        // Validate the pack structure
        if (!pack.version || !pack.name || !pack.sections) {
          reject(new Error("Invalid FlashFusion Pack format"));

          return;
        }

        resolve(pack);
      } catch {
        reject(new Error("Failed to parse FlashFusion Pack file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

/**
 * Generate a shareable prompt text from sections
 */
export const generatePromptText = (sections: {
  context: string;
  task: string;
  constraints: string;
  tone: string;
}): string => {
  const parts = [];

  if (sections.context) {
    parts.push(`**Context:**\n${sections.context}`);
  }

  if (sections.task) {
    parts.push(`**Task:**\n${sections.task}`);
  }

  if (sections.constraints) {
    parts.push(`**Constraints:**\n${sections.constraints}`);
  }

  if (sections.tone) {
    parts.push(`**Tone:**\n${sections.tone}`);
  }

  return parts.join("\n\n");
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");

    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);

      return true;
    } catch {
      document.body.removeChild(textArea);

      return false;
    }
  }
};

/**
 * Fuzzy search implementation
 */
export const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Exact match
  if (lowerText.includes(lowerQuery)) return true;

  // Fuzzy match: check if all query characters appear in order
  let queryIndex = 0;

  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === lowerQuery.length;
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};
