"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 7,
    name: "Aisha Rahman",
    designation: "Food Blogger",
    company: "TastyTravels",
    testimonial:
      "Kata Sweet Shop is a hidden gem! Their sweets are rich, authentic, and always fresh. The attention to traditional recipes with a modern twist is impressive. Every time I visit, it feels like a nostalgic journey through childhood flavors—perfectly crafted and beautifully presented!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 8,
    name: "Ahmed Malik",
    designation: "Local Resident",
    company: "Regular Customer",
    testimonial:
      "I’ve been a loyal customer of Kata Sweet Shop for over 3 years. Their mithai is the best in town—soft, flavorful, and made with real love. Whether it's Eid, weddings, or just a treat for the kids, Kata never disappoints.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 9,
    name: "Fatima Siddiqui",
    designation: "Event Planner",
    company: "Elegant Events",
    testimonial:
      "We always source our sweets from Kata for corporate events and weddings. Their presentation, taste, and timely delivery are exceptional. Our clients constantly compliment the quality and freshness—it truly elevates the entire experience.",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg",
  },
  {
    id: 10,
    name: "Zayn Ali",
    designation: "Lifestyle Influencer",
    company: "@ZaynEats",
    testimonial:
      "Kata Sweet Shop’s boxes are an Instagram dream! Not only do they look stunning, but the flavors are top-tier. My followers love the behind-the-scenes I post here—it’s artisanal quality with viral charm!",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
  },
  {
    id: 11,
    name: "Bibi Jaan",
    designation: "Retired School Teacher",
    company: "Loyal Elder Customer",
    testimonial:
      "Kata’s sweets remind me of my childhood. The barfi, gulab jamun, and laddoos taste just like they did decades ago. It warms my heart to see young people continue these traditions so beautifully.",
    avatar: "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    id: 12,
    name: "Imran Qureshi",
    designation: "Wholesale Supplier",
    company: "SweetHub Distributors",
    testimonial:
      "Working with Kata Sweet Shop has been a pleasure. Their commitment to quality, consistent demand, and transparent communication make them one of our favorite clients. It’s a brand built on trust and taste.",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
  },
];

const Testimonial06 = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center py-12 px-6">
      <div className="w-full">
        <h2 className="mb-14 text-5xl md:text-6xl font-bold text-center tracking-tight">
          Testimonials
        </h2>
        <div className="container w-full lg:max-w-screen-lg xl:max-w-screen-xl mx-auto px-12">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn("h-3.5 w-3.5 rounded-full border-2", {
                  "bg-primary border-primary": current === index + 1,
                })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) => (
  <div className="mb-8 bg-accent rounded-xl py-8 px-6 sm:py-6">
    <div className="flex items-center justify-between gap-20">
      <div className="flex flex-col justify-center">
        {/* Top Section with Avatar + Rating */}
        <div className="flex items-center justify-between gap-1">
          {/* Visible on small screens */}
          <div className="hidden sm:flex md:hidden items-center gap-4">
            <Avatar className="w-8 h-8 md:w-10 md:h-10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                {testimonial.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.designation}</p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="w-5 h-5 fill-yellow-500 stroke-yellow-700"
              />
            ))}
          </div>
        </div>

        {/* Testimonial Text */}
        <p className="mt-6 text-lg sm:text-2xl lg:text-[1.75rem] xl:text-3xl leading-normal font-semibold tracking-tight">
          &quot;{testimonial.testimonial}&quot;
        </p>

        {/* Visible on medium and up */}
        <div className="flex sm:hidden md:flex mt-6 items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.designation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Testimonial06;
