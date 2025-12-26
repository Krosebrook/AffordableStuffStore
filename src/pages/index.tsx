import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <span className={title()}>FlashFusion&nbsp;</span>
          <br />
          <span className={title({ color: "violet" })}>
            AI-Powered Creative Mega App
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Production-grade SaaS platform for AI content generation, campaign management, and multi-channel publishing.
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/prompt-builder"
          >
            Start Creating
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="/marketplace"
          >
            Explore Marketplace
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          <div className="p-6 rounded-lg bg-default-100">
            <h3 className="text-xl font-bold mb-2">Modular Prompt Builder</h3>
            <p className="text-default-600">
              30+ presets, searchable combobox, live token estimates
            </p>
          </div>
          <div className="p-6 rounded-lg bg-default-100">
            <h3 className="text-xl font-bold mb-2">Content Studio</h3>
            <p className="text-default-600">
              Generate text, images, video, and music with brand validation
            </p>
          </div>
          <div className="p-6 rounded-lg bg-default-100">
            <h3 className="text-xl font-bold mb-2">Campaign Wizard</h3>
            <p className="text-default-600">
              Multi-channel scheduling with smart retry logic
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
