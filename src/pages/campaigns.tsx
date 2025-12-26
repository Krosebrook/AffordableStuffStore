import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function CampaignsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>Campaign Wizard</h1>
          <p className="mt-4 text-default-600 text-lg">
            Multi-channel scheduling with smart retry logic and audience
            segmentation
          </p>
        </div>

        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">📅 Schedule</h3>
              <p className="text-default-600">
                Plan and schedule content across multiple channels
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">🎯 Target</h3>
              <p className="text-default-600">
                Segment audiences and personalize messaging
              </p>
            </div>

            <div className="p-6 rounded-lg bg-default-100">
              <h3 className="text-xl font-bold mb-2">📊 Analyze</h3>
              <p className="text-default-600">
                Track performance and optimize campaigns
              </p>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Supported Channels</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-default-600">
              <div>Twitter</div>
              <div>Facebook</div>
              <div>Instagram</div>
              <div>LinkedIn</div>
              <div>Email</div>
              <div>Blog</div>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <ul className="list-disc list-inside text-default-600 space-y-2">
              <li>Multi-channel scheduling (social media, email, blog)</li>
              <li>Smart retry logic for failed posts (up to 3 retries)</li>
              <li>Campaign analytics and performance tracking</li>
              <li>Audience segmentation with custom criteria</li>
              <li>A/B testing capabilities</li>
              <li>Automated optimization</li>
            </ul>
          </div>

          <div className="mt-6 p-6 rounded-lg bg-default-100">
            <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
            <p className="text-default-600">
              The Campaign Wizard is currently under development. Check back
              soon for the full multi-channel campaign management experience!
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
