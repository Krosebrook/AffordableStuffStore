import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { FFPack, FFPackTemplate, FFPackAsset } from "@/types";

export default function PromptBuilderPage() {
  const { t } = useTranslation();

  const [packName, setPackName] = useState("");
  const [packVersion, setPackVersion] = useState("1.0.0");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [license, setLicense] = useState("MIT");

  const [templates, setTemplates] = useState<FFPackTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [newTemplateVariables, setNewTemplateVariables] = useState("");

  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [secondaryColor, setSecondaryColor] = useState("#10B981");
  const [accentColor, setAccentColor] = useState("#F59E0B");
  const [headingFont, setHeadingFont] = useState("Inter");
  const [bodyFont, setBodyFont] = useState("Roboto");
  const [logoUrl, setLogoUrl] = useState("");

  const [assets, setAssets] = useState<FFPackAsset[]>([]);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("image/png");
  const [newAssetUrl, setNewAssetUrl] = useState("");

  const handleAddTemplate = () => {
    if (!newTemplateName || !newTemplateContent) return;

    const template: FFPackTemplate = {
      id: `t${templates.length + 1}`,
      name: newTemplateName,
      content: newTemplateContent,
      variables: newTemplateVariables
        ? newTemplateVariables.split(",").map((v) => v.trim())
        : [],
    };

    setTemplates([...templates, template]);
    setNewTemplateName("");
    setNewTemplateContent("");
    setNewTemplateVariables("");
  };

  const handleRemoveTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetUrl) return;

    const asset: FFPackAsset = {
      id: `a${assets.length + 1}`,
      name: newAssetName,
      type: newAssetType,
      url: newAssetUrl,
    };

    setAssets([...assets, asset]);
    setNewAssetName("");
    setNewAssetType("image/png");
    setNewAssetUrl("");
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleExport = () => {
    if (!packName || !author) {
      window.alert("Please fill in pack name and author");

      return;
    }

    const pack: FFPack = {
      name: packName,
      version: packVersion,
      templates,
      brand_kit: {
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
        },
        fonts: {
          heading: headingFont,
          body: bodyFont,
        },
        logo: logoUrl || undefined,
      },
      assets,
      metadata: {
        author,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        license,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    const dataStr = JSON.stringify(pack, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${packName.toLowerCase().replace(/\s+/g, "-")}.ffpack.json`;

    const linkElement = document.createElement("a");

    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className={title()}>
            <Trans t={t}>prompt-builder</Trans>
          </h1>
          <p className="mt-4 text-default-600">
            <Trans t={t}>create-new-pack</Trans>
          </p>
        </div>

        {/* Basic Info */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isRequired
              label={t("pack-name")}
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
            />
            <Input
              isRequired
              label={t("pack-version")}
              value={packVersion}
              onChange={(e) => setPackVersion(e.target.value)}
            />
            <Input
              isRequired
              label={t("author")}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <Input
              label={t("license")}
              value={license}
              onChange={(e) => setLicense(e.target.value)}
            />
            <Input
              className="md:col-span-2"
              label={t("tags")}
              placeholder="tag1, tag2, tag3"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Templates */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            <Trans t={t}>templates</Trans>
          </h2>

          <div className="space-y-4 mb-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 bg-default-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-default-600 mt-1">
                      {template.content}
                    </p>
                    {template.variables && template.variables.length > 0 && (
                      <p className="text-xs text-default-500 mt-2">
                        Variables: {template.variables.join(", ")}
                      </p>
                    )}
                  </div>
                  <Button
                    color="danger"
                    size="sm"
                    variant="flat"
                    onClick={() => handleRemoveTemplate(template.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">
              <Trans t={t}>add-template</Trans>
            </h3>
            <div className="space-y-3">
              <Input
                label={t("template-name")}
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
              <textarea
                className="w-full p-3 border rounded-lg min-h-[100px] bg-default-100"
                placeholder={t("template-content")}
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
              />
              <Input
                label="Variables (comma-separated)"
                placeholder="title, description, price"
                value={newTemplateVariables}
                onChange={(e) => setNewTemplateVariables(e.target.value)}
              />
              <Button color="primary" onClick={handleAddTemplate}>
                <Trans t={t}>add-template</Trans>
              </Button>
            </div>
          </div>
        </div>

        {/* Brand Kit */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            <Trans t={t}>configure-brand-kit</Trans>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block">
                <Trans t={t}>primary-color</Trans>
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="w-12 h-12 border rounded cursor-pointer"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">
                <Trans t={t}>secondary-color</Trans>
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="w-12 h-12 border rounded cursor-pointer"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">
                <Trans t={t}>accent-color</Trans>
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="w-12 h-12 border rounded cursor-pointer"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                />
              </div>
            </div>

            <Input
              label={t("logo-url")}
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />

            <Input
              label={t("heading-font")}
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
            />

            <Input
              label={t("body-font")}
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
            />
          </div>
        </div>

        {/* Assets */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            <Trans t={t}>assets</Trans>
          </h2>

          <div className="space-y-4 mb-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border rounded-lg p-4 bg-default-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{asset.name}</h3>
                    <p className="text-sm text-default-600">{asset.type}</p>
                    <p className="text-xs text-default-500">{asset.url}</p>
                  </div>
                  <Button
                    color="danger"
                    size="sm"
                    variant="flat"
                    onClick={() => handleRemoveAsset(asset.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">
              <Trans t={t}>add-asset</Trans>
            </h3>
            <div className="space-y-3">
              <Input
                label={t("asset-name")}
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
              />
              <Input
                label={t("asset-type")}
                value={newAssetType}
                onChange={(e) => setNewAssetType(e.target.value)}
              />
              <Input
                label={t("asset-url")}
                value={newAssetUrl}
                onChange={(e) => setNewAssetUrl(e.target.value)}
              />
              <Button color="primary" onClick={handleAddAsset}>
                <Trans t={t}>add-asset</Trans>
              </Button>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="flex justify-center gap-4">
          <Button color="primary" size="lg" onClick={handleExport}>
            <Trans t={t}>export</Trans> .ffpack.json
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
