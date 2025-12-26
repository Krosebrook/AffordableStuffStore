import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function PromptsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>Public Prompt Library</h1>
          <p className="mt-4 text-default-600 text-lg">
            User-submitted prompts with voting, search, and tag-based filtering
          </p>
        </div>

        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🗳️ Vote</h3>
              <p className="text-default-600">
                Upvote the best prompts and help others discover quality content
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🔖 Tag</h3>
              <p className="text-default-600">
                Find prompts by tags and categories that match your needs
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🌟 Featured</h3>
              <p className="text-default-600">
                Explore trending and featured prompts from the community
              </p>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <ul className="list-disc list-inside text-default-600 space-y-2">
              <li>User-submitted prompts open to everyone</li>
              <li>Voting system for quality curation</li>
              <li>Tag-based search and filtering</li>
              <li>Trending prompts dashboard</li>
              <li>Featured prompt highlights</li>
              <li>Copy and use prompts directly</li>
              <li>Save favorites to your library</li>
            </ul>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2 text-default-600">
              <span className="px-3 py-1 rounded-full bg-default-200">
                #marketing
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #creative
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #social-media
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #content-writing
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #design
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #video
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #music
              </span>
              <span className="px-3 py-1 rounded-full bg-default-200">
                #photography
              </span>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
            <p className="text-default-600">
              The Public Prompt Library is currently under development. Check
              back soon to explore and submit prompts!
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
