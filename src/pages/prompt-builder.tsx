import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function PromptBuilderPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>
            Modular Prompt Builder
          </h1>
          <p className="mt-4 text-default-600 text-lg">
            Build powerful AI prompts with 30+ presets, live token estimation, and export capabilities
          </p>
        </div>

        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-lg bg-default-100">
              <h2 className="text-xl font-bold mb-4">Prompt Workspace</h2>
              <p className="text-default-600">
                • 30+ presets for different content types<br />
                • Searchable combobox for quick selection<br />
                • Live token estimation<br />
                • Export as .ffpack.json<br />
                • Version control & collaboration
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h2 className="text-xl font-bold mb-4">Quick Start</h2>
              <p className="text-default-600">
                1. Choose a preset<br />
                2. Customize your prompt<br />
                3. Test and refine<br />
                4. Save to library<br />
                5. Export or use in campaigns
              </p>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
            <p className="text-default-600">
              The Modular Prompt Builder is currently under development. Check back soon for the full experience!
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
