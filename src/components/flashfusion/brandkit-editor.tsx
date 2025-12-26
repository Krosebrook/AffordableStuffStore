/**
 * Brand Kit Editor Component
 *
 * UI for creating and editing brand kits with validation
 */

import type { BrandKit, BrandColor, BrandFont } from "@/types/flashfusion";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { validateBrandKit, lintBrandKit } from "@/utils/brandkit-validation";

export function BrandKitEditor() {
  const [brandKit, setBrandKit] = useState<Partial<BrandKit>>({
    name: "",
    colors: [],
    fonts: [],
    guidelines: "",
    tone: "",
  });

  const [newColor, setNewColor] = useState<BrandColor>({
    name: "",
    hex: "#000000",
    usage: "primary",
  });

  const [newFont, setNewFont] = useState<BrandFont>({
    name: "",
    family: "",
    weights: [400],
  });

  const addColor = () => {
    if (newColor.name && newColor.hex) {
      setBrandKit({
        ...brandKit,
        colors: [...(brandKit.colors || []), { ...newColor }],
      });
      setNewColor({ name: "", hex: "#000000", usage: "primary" });
    }
  };

  const addFont = () => {
    if (newFont.name && newFont.family) {
      setBrandKit({
        ...brandKit,
        fonts: [...(brandKit.fonts || []), { ...newFont }],
      });
      setNewFont({ name: "", family: "", weights: [400] });
    }
  };

  const validateKit = () => {
    const validation = validateBrandKit(brandKit);
    const linting = brandKit.name ? lintBrandKit(brandKit as BrandKit) : [];

    alert(
      `Validation: ${validation.valid ? "PASSED" : "FAILED"}\n\n` +
        `Errors: ${validation.errors.length}\n` +
        `Warnings: ${linting.length}\n\n` +
        validation.errors
          .map((e) => `${e.severity.toUpperCase()}: ${e.message}`)
          .join("\n"),
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-default-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Brand Kit Editor</h2>

        <div className="space-y-4">
          <Input
            fullWidth
            label="Brand Name"
            placeholder="Enter brand name"
            value={brandKit.name || ""}
            onChange={(e) => setBrandKit({ ...brandKit, name: e.target.value })}
          />

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input
                label="Color Name"
                placeholder="Primary Blue"
                value={newColor.name}
                onChange={(e) =>
                  setNewColor({ ...newColor, name: e.target.value })
                }
              />
              <Input
                label="Hex Code"
                type="color"
                value={newColor.hex}
                onChange={(e) =>
                  setNewColor({ ...newColor, hex: e.target.value })
                }
              />
            </div>
            <Button size="sm" onClick={addColor}>
              Add Color
            </Button>

            <div className="mt-2 flex flex-wrap gap-2">
              {brandKit.colors?.map((color, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-default-100 rounded"
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Fonts</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input
                label="Font Name"
                placeholder="Heading Font"
                value={newFont.name}
                onChange={(e) =>
                  setNewFont({ ...newFont, name: e.target.value })
                }
              />
              <Input
                label="Font Family"
                placeholder="Inter, sans-serif"
                value={newFont.family}
                onChange={(e) =>
                  setNewFont({ ...newFont, family: e.target.value })
                }
              />
            </div>
            <Button size="sm" onClick={addFont}>
              Add Font
            </Button>

            <div className="mt-2 space-y-1">
              {brandKit.fonts?.map((font, i) => (
                <div key={i} className="p-2 bg-default-100 rounded text-sm">
                  {font.name}: {font.family}
                </div>
              ))}
            </div>
          </div>

          <Input
            fullWidth
            label="Guidelines"
            placeholder="Brand usage guidelines..."
            value={brandKit.guidelines || ""}
            onChange={(e) =>
              setBrandKit({ ...brandKit, guidelines: e.target.value })
            }
          />

          <Input
            fullWidth
            label="Tone of Voice"
            placeholder="Professional, friendly, innovative..."
            value={brandKit.tone || ""}
            onChange={(e) => setBrandKit({ ...brandKit, tone: e.target.value })}
          />

          <Button fullWidth color="primary" onClick={validateKit}>
            Validate Brand Kit
          </Button>
        </div>
      </div>
    </div>
  );
}
