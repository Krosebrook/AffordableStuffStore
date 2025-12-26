import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Trans, useTranslation } from "react-i18next";
import { FFPackWithStats } from "@/types";

interface PackCardProps {
  pack: FFPackWithStats;
  featured?: boolean;
}

export function PackCard({ pack, featured = false }: PackCardProps) {
  const { t } = useTranslation();

  const handleVote = (type: "up" | "down") => {
    // In a real implementation, this would call an API
    console.log(`Voted ${type} on pack ${pack.id}`);
  };

  const handleRemix = () => {
    // In a real implementation, this would clone the pack and redirect to editor
    console.log(`Remixing pack ${pack.id}`);
  };

  return (
    <div className={`border rounded-lg p-6 hover:shadow-lg transition-shadow ${featured ? 'bg-gradient-to-br from-primary-50 to-secondary-50' : 'bg-content1'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/marketplace/${pack.id}`}>
            <h3 className="text-xl font-bold hover:text-primary transition-colors">
              {pack.name}
            </h3>
          </Link>
          <p className="text-sm text-default-500">
            <Trans t={t}>version</Trans>: {pack.version}
          </p>
        </div>
        {pack.isPublic && (
          <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
            <Trans t={t}>public-packs</Trans>
          </span>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-4">
        {pack.authorAvatar && (
          <img 
            src={pack.authorAvatar} 
            alt={pack.metadata.author}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm text-default-600">{pack.metadata.author}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pack.metadata.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="text-xs bg-default-100 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-default-600">
          {pack.templates.length} <Trans t={t}>templates</Trans>
        </span>
        <span className="text-default-600">
          {pack.assets.length} <Trans t={t}>assets</Trans>
        </span>
      </div>

      {/* Voting */}
      <div className="flex items-center gap-4 mb-4">
        <Button 
          size="sm" 
          variant="flat" 
          color="success"
          onClick={() => handleVote("up")}
        >
          ▲ {pack.upvotes}
        </Button>
        <Button 
          size="sm" 
          variant="flat" 
          color="danger"
          onClick={() => handleVote("down")}
        >
          ▼ {pack.downvotes}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          color="primary" 
          variant="solid"
          onClick={handleRemix}
        >
          <Trans t={t}>remix</Trans>
        </Button>
        <Link href={`/marketplace/${pack.id}`}>
          <Button size="sm" variant="bordered">
            <Trans t={t}>version-history</Trans>
          </Button>
        </Link>
      </div>
    </div>
  );
}
