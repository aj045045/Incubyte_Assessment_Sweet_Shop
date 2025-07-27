import Image from "next/image"; // Make sure this import is included
import { assetsLinks } from "@/constant/assets-links";

const features = [
  {
    title: "Discover Hidden Deals",
    description: "Uncover exclusive offers and limited-time discounts.",
    src: assetsLinks.cake.src,
    alt: assetsLinks.cake.alt,
  },
  {
    title: "Trusted by Thousands",
    description: "Shop with confidence with verified user reviews.",
    src: assetsLinks.chocolate_cookies.src,
    alt: assetsLinks.chocolate_cookies.alt,
  },
  {
    title: "Shop Smarter",
    description: "Get instant recommendations tailored to your taste.",
    src: assetsLinks.cookies.src,
    alt: assetsLinks.cookies.alt,
  },
];

const Features02Page = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-screen-xl px-6">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900">
          Why choose us?
        </h2>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start">
              <div className="w-full aspect-[4/5] relative overflow-hidden rounded-xl shadow-md mb-5">
                <Image
                  src={feature.src}
                  alt={feature.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-[16px] max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features02Page;
