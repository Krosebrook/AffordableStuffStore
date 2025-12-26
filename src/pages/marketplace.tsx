import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function MarketplacePage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>
            Prompt Marketplace
          </h1>
          <p className="mt-4 text-default-600 text-lg">
            Browse, remix, and submit community-created prompt packs
          </p>
        </div>

        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🔍 Browse</h3>
              <p className="text-default-600">
                Explore thousands of prompt packs created by the community
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🔧 Remix</h3>
              <p className="text-default-600">
                Customize existing prompts to fit your specific needs
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">📤 Submit</h3>
              <p className="text-default-600">
                Share your own prompt packs with the community
              </p>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <ul className="list-disc list-inside text-default-600 space-y-2">
              <li>Browse community-created prompt packs</li>
              <li>Filter by category, rating, and popularity</li>
              <li>Remix and customize existing prompts</li>
              <li>Submit your own prompt packs</li>
              <li>Rating and review system</li>
              <li>Featured packs and trending items</li>
              <li>Export prompts as .ffpack.json</li>
            </ul>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-default-600">
              <div>📝 Text</div>
              <div>🖼️ Image</div>
              <div>🎥 Video</div>
              <div>🎵 Music</div>
              <div>📱 Social</div>
              <div>📧 Email</div>
              <div>📰 Blog</div>
              <div>🎨 Creative</div>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
            <p className="text-default-600">
              The Prompt Marketplace is currently under development. Check back soon to explore and share prompt packs!
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
