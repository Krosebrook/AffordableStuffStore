import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function ContentStudioPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>Content Studio</h1>
          <p className="mt-4 text-default-600 text-lg">
            Generate text, images, video, and music with AI-powered tools and
            brand kit validation
          </p>
        </div>

        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">📝 Text</h3>
              <p className="text-default-600">
                Blog posts, social copy, emails, and more
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🖼️ Images</h3>
              <p className="text-default-600">
                Illustrations, photos, graphics, and designs
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🎥 Video</h3>
              <p className="text-default-600">
                Short clips, animations, and promotional videos
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🎵 Music</h3>
              <p className="text-default-600">
                Background tracks, jingles, and sound effects
              </p>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-default-600 space-y-2">
              <li>
                Multi-modal content generation (text, image, video, music)
              </li>
              <li>Brand kit validation and consistency checking</li>
              <li>Asset preview and editing capabilities</li>
              <li>Provenance logging (model, prompt_hash, dataset_tag)</li>
              <li>Version history and rollback</li>
              <li>Collaborative workflows</li>
            </ul>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
            <p className="text-default-600">
              The Content Studio is currently under development. Check back soon
              for the full multi-modal generation experience!
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
