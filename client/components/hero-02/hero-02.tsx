import { Button } from "@/components/ui/button";
import { assetsLinks } from "@/constant/assets-links";
import { pageLinks } from "@/constant/page-links";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero02 = () => {
  return (
    <section className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-7xl w-full px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-primary">
            Welcome to Kata Sweet Shop 🍬
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            "From classic pastries to signature sweets, discover the joy of handcrafted desserts made with love at Kata Sweet Shop."
          </p>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Button size="lg" asChild className="rounded-full text-base">
              <Link href={pageLinks.login}>
                Get Started <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative w-full aspect-video max-w-xl mx-auto">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={assetsLinks.donuts.src}
              alt={assetsLinks.donuts.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero02;
