import { useState, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Code } from "@heroui/code";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { allPresets } from "@/data/presets";
import {
  PromptCategory,
  PromptSection,
  FlashFusionPack,
} from "@/types/flashfusion";
import {
  calculateTotalTokens,
  exportFlashFusionPack,
  generatePromptText,
  copyToClipboard,
  fuzzyMatch,
} from "@/utils/flashfusion";

export default function FlashFusionPage() {
  const { t } = useTranslation();

  // State for prompt sections
  const [context, setContext] = useState("");
  const [task, setTask] = useState("");
  const [constraints, setConstraints] = useState("");
  const [tone, setTone] = useState("");

  // State for UI controls
  const [packName, setPackName] = useState("My Prompt Pack");
  const [packDescription, setPackDescription] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<PromptCategory>("automation");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );
  const [copySuccess, setCopySuccess] = useState(false);

  // Categories
  const categories: PromptCategory[] = [
    "automation",
    "creative",
    "ops",
    "llm",
    "notion",
    "workflow",
  ];

  // Calculate token count
  const tokenCount = useMemo(() => {
    return calculateTotalTokens({ context, task, constraints, tone });
  }, [context, task, constraints, tone]);

  // Get unique tags from all presets
  const allTags = useMemo(() => {
    const tags = new Set<string>();

    allPresets.forEach((preset) => {
      preset.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  }, []);

  // Filter presets based on search and category
  const filteredPresets = useMemo(() => {
    let filtered = allPresets;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.some((tag) => p.tags.includes(tag)),
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          fuzzyMatch(p.name, searchQuery) ||
          fuzzyMatch(p.content, searchQuery) ||
          p.tags.some((tag) => fuzzyMatch(tag, searchQuery)),
      );
    }

    return filtered;
  }, [selectedCategory, selectedTags, searchQuery]);

  // Group filtered presets by section
  const presetsBySection = useMemo(() => {
    return {
      context: filteredPresets.filter((p) => p.section === "context"),
      task: filteredPresets.filter((p) => p.section === "task"),
      constraints: filteredPresets.filter((p) => p.section === "constraints"),
      tone: filteredPresets.filter((p) => p.section === "tone"),
    };
  }, [filteredPresets]);

  // Toggle section collapse
  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);

    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  // Handle preset selection
  const applyPreset = (presetContent: string, section: PromptSection) => {
    switch (section) {
      case "context":
        setContext((prev) =>
          prev ? `${prev}\n${presetContent}` : presetContent,
        );
        break;
      case "task":
        setTask((prev) => (prev ? `${prev}\n${presetContent}` : presetContent));
        break;
      case "constraints":
        setConstraints((prev) =>
          prev ? `${prev}\n${presetContent}` : presetContent,
        );
        break;
      case "tone":
        setTone((prev) => (prev ? `${prev}\n${presetContent}` : presetContent));
        break;
    }
  };

  // Export as FlashFusion Pack
  const handleExport = () => {
    const pack: FlashFusionPack = {
      version: "1.0.0",
      name: packName,
      description: packDescription,
      category: selectedCategory,
      sections: {
        context,
        task,
        constraints,
        tone,
      },
      tags: selectedTags,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tokenCount,
      },
    };

    exportFlashFusionPack(pack);
  };

  // Copy prompt to clipboard
  const handleCopy = async () => {
    const promptText = generatePromptText({ context, task, constraints, tone });
    const success = await copyToClipboard(promptText);

    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Clear all sections
  const handleClear = () => {
    setContext("");
    setTask("");
    setConstraints("");
    setTone("");
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-4 py-8 md:py-10">
        {/* Header */}
        <div className="text-center">
          <h1 className={title()}>
            <Trans>FlashFusion Prompt Builder</Trans>
          </h1>
          <p className="mt-4 text-default-600">
            <Trans>Create modular prompts with 30+ presets per section</Trans>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Pack Name and Description */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              className="flex-1"
              label={t("Pack Name")}
              placeholder={t("Enter pack name")}
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
            />
            <Input
              className="flex-1"
              label={t("Description")}
              placeholder={t("Enter description")}
              value={packDescription}
              onChange={(e) => setPackDescription(e.target.value)}
            />
          </div>

          {/* Category and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button className="capitalize" variant="bordered">
                  {t("Category")}: {selectedCategory}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Category selection"
                onAction={(key) => setSelectedCategory(key as PromptCategory)}
              >
                {categories.map((cat) => (
                  <DropdownItem key={cat} className="capitalize">
                    {cat}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Input
              className="flex-1"
              placeholder={t("Search presets...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 15).map((tag) => (
              <Button
                key={tag}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                size="sm"
                variant={selectedTags.includes(tag) ? "solid" : "bordered"}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompt Sections */}
        <div className="flex flex-col gap-6 mt-6">
          {/* Context Section */}
          <div className="border border-default-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3
                className="text-xl font-bold cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => toggleSection("context")}
                onKeyDown={(e) => e.key === "Enter" && toggleSection("context")}
              >
                {collapsedSections.has("context") ? "▶" : "▼"} Context (
                {presetsBySection.context.length} presets)
              </h3>
            </div>

            {!collapsedSections.has("context") && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetsBySection.context.slice(0, 10).map((preset) => (
                    <Button
                      key={preset.id}
                      size="sm"
                      title={preset.content}
                      variant="flat"
                      onClick={() => applyPreset(preset.content, "context")}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-default-300 rounded-lg min-h-[100px] bg-default-50"
                  placeholder={t("Add context for your prompt...")}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </>
            )}
          </div>

          {/* Task Section */}
          <div className="border border-default-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3
                className="text-xl font-bold cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => toggleSection("task")}
                onKeyDown={(e) => e.key === "Enter" && toggleSection("task")}
              >
                {collapsedSections.has("task") ? "▶" : "▼"} Task (
                {presetsBySection.task.length} presets)
              </h3>
            </div>

            {!collapsedSections.has("task") && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetsBySection.task.slice(0, 10).map((preset) => (
                    <Button
                      key={preset.id}
                      size="sm"
                      title={preset.content}
                      variant="flat"
                      onClick={() => applyPreset(preset.content, "task")}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-default-300 rounded-lg min-h-[100px] bg-default-50"
                  placeholder={t("Define the task...")}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </>
            )}
          </div>

          {/* Constraints Section */}
          <div className="border border-default-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3
                className="text-xl font-bold cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => toggleSection("constraints")}
                onKeyDown={(e) =>
                  e.key === "Enter" && toggleSection("constraints")
                }
              >
                {collapsedSections.has("constraints") ? "▶" : "▼"} Constraints
                ({presetsBySection.constraints.length} presets)
              </h3>
            </div>

            {!collapsedSections.has("constraints") && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetsBySection.constraints.slice(0, 10).map((preset) => (
                    <Button
                      key={preset.id}
                      size="sm"
                      title={preset.content}
                      variant="flat"
                      onClick={() => applyPreset(preset.content, "constraints")}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-default-300 rounded-lg min-h-[100px] bg-default-50"
                  placeholder={t("Add constraints...")}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                />
              </>
            )}
          </div>

          {/* Tone Section */}
          <div className="border border-default-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3
                className="text-xl font-bold cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => toggleSection("tone")}
                onKeyDown={(e) => e.key === "Enter" && toggleSection("tone")}
              >
                {collapsedSections.has("tone") ? "▶" : "▼"} Tone (
                {presetsBySection.tone.length} presets)
              </h3>
            </div>

            {!collapsedSections.has("tone") && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetsBySection.tone.slice(0, 10).map((preset) => (
                    <Button
                      key={preset.id}
                      size="sm"
                      title={preset.content}
                      variant="flat"
                      onClick={() => applyPreset(preset.content, "tone")}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-default-300 rounded-lg min-h-[100px] bg-default-50"
                  placeholder={t("Set the tone...")}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </>
            )}
          </div>
        </div>

        {/* Token Counter and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 p-4 bg-default-100 rounded-lg">
          <div className="text-lg font-semibold">
            <Trans>Estimated Tokens</Trans>:{" "}
            <Code color="primary">{tokenCount}</Code>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button color="danger" variant="flat" onClick={handleClear}>
              <Trans>Clear All</Trans>
            </Button>
            <Button color="primary" variant="flat" onClick={handleCopy}>
              {copySuccess ? (
                <Trans>Copied!</Trans>
              ) : (
                <Trans>Copy Prompt</Trans>
              )}
            </Button>
            <Button color="success" onClick={handleExport}>
              <Trans>Export .ffpack.json</Trans>
            </Button>
          </div>
        </div>

        {/* Preview Card */}
        {(context || task || constraints || tone) && (
          <div className="mt-6 p-6 border border-default-200 rounded-lg bg-default-50">
            <h3 className="text-xl font-bold mb-4">
              <Trans>Preview</Trans>
            </h3>
            <div className="space-y-4">
              {context && (
                <div>
                  <h4 className="font-semibold text-default-700">Context:</h4>
                  <p className="text-default-600 whitespace-pre-wrap">
                    {context}
                  </p>
                </div>
              )}
              {task && (
                <div>
                  <h4 className="font-semibold text-default-700">Task:</h4>
                  <p className="text-default-600 whitespace-pre-wrap">{task}</p>
                </div>
              )}
              {constraints && (
                <div>
                  <h4 className="font-semibold text-default-700">
                    Constraints:
                  </h4>
                  <p className="text-default-600 whitespace-pre-wrap">
                    {constraints}
                  </p>
                </div>
              )}
              {tone && (
                <div>
                  <h4 className="font-semibold text-default-700">Tone:</h4>
                  <p className="text-default-600 whitespace-pre-wrap">{tone}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
