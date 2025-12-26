import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { FFPackWithStats, FFPack } from "@/types";
import { PackCard } from "@/components/pack-card";

// Mock data for demonstration
const mockPacks: FFPackWithStats[] = [
  {
    id: "1",
    name: "E-commerce Starter",
    version: "1.2.0",
    templates: [
      { id: "t1", name: "Product Page", content: "Product template content", variables: ["title", "price"] },
      { id: "t2", name: "Cart Page", content: "Cart template content", variables: ["items"] },
    ],
    brand_kit: {
      colors: { primary: "#4F46E5", secondary: "#10B981", accent: "#F59E0B" },
      fonts: { heading: "Inter", body: "Roboto" },
    },
    assets: [
      { id: "a1", name: "Logo", type: "image/png", url: "/assets/logo.png" },
    ],
    metadata: {
      author: "John Doe",
      tags: ["e-commerce", "starter", "templates"],
      license: "MIT",
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-03-20T14:30:00Z",
    },
    isPublic: true,
    upvotes: 42,
    downvotes: 3,
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    versionHistory: [
      { version: "1.2.0", timestamp: "2025-03-20T14:30:00Z", changes: "Added cart page template", pack: {} as FFPack },
      { version: "1.1.0", timestamp: "2025-02-10T09:15:00Z", changes: "Updated brand kit colors", pack: {} as FFPack },
    ],
    isFeatured: true,
  },
  {
    id: "2",
    name: "Blog Theme Pro",
    version: "2.0.1",
    templates: [
      { id: "t3", name: "Blog Post", content: "Blog post template", variables: ["title", "content", "author"] },
      { id: "t4", name: "Author Bio", content: "Author bio template", variables: ["name", "bio"] },
    ],
    assets: [
      { id: "a2", name: "Header Image", type: "image/jpeg", url: "/assets/header.jpg" },
    ],
    metadata: {
      author: "Jane Smith",
      tags: ["blog", "content", "writing"],
      license: "Apache 2.0",
      createdAt: "2025-02-01T08:00:00Z",
      updatedAt: "2025-03-15T16:45:00Z",
    },
    isPublic: true,
    upvotes: 38,
    downvotes: 2,
    authorAvatar: "https://i.pravatar.cc/150?img=2",
    versionHistory: [
      { version: "2.0.1", timestamp: "2025-03-15T16:45:00Z", changes: "Bug fixes", pack: {} as FFPack },
    ],
  },
];

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");

  const filteredPacks = mockPacks.filter((pack) => {
    const matchesSearch = pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === "all" || 
      (filter === "public" && pack.isPublic) ||
      (filter === "private" && !pack.isPublic);
    return matchesSearch && matchesFilter;
  });

  const featuredPack = mockPacks.find(pack => pack.isFeatured);

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10">
        <div className="text-center">
          <h1 className={title()}>
            <Trans t={t}>flashfusion-marketplace</Trans>
          </h1>
          <p className="mt-4 text-default-600">
            <Trans t={t}>browse-packs</Trans>
          </p>
        </div>

        {/* Featured Pack */}
        {featuredPack && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <Trans t={t}>featured-pack-of-the-day</Trans>
            </h2>
            <div className="border-2 border-primary rounded-lg p-1">
              <PackCard pack={featuredPack} featured />
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            className="flex-1"
            placeholder={t("search-packs")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              color={filter === "all" ? "primary" : "default"}
              variant={filter === "all" ? "solid" : "bordered"}
              onClick={() => setFilter("all")}
            >
              <Trans t={t}>all-packs</Trans>
            </Button>
            <Button
              color={filter === "public" ? "primary" : "default"}
              variant={filter === "public" ? "solid" : "bordered"}
              onClick={() => setFilter("public")}
            >
              <Trans t={t}>public-packs</Trans>
            </Button>
            <Button
              color={filter === "private" ? "primary" : "default"}
              variant={filter === "private" ? "solid" : "bordered"}
              onClick={() => setFilter("private")}
            >
              <Trans t={t}>private-packs</Trans>
            </Button>
          </div>
        </div>

        {/* Pack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacks.length > 0 ? (
            filteredPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-default-500">
                <Trans t={t}>no-packs-found</Trans>
              </p>
            </div>
          )}
        </div>

        {/* Create New Pack Button */}
        <div className="flex justify-center mt-8">
          <Link href="/prompt-builder">
            <Button color="primary" size="lg">
              <Trans t={t}>create-new-pack</Trans>
            </Button>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
