import Contact01Page from "@/components/contact-01/contact-01";
import Features02Page from "@/components/features-02/features-02";
import Footer05Page from "@/components/footer-05/footer-05";
import Hero02 from "@/components/hero-02/hero-02";
import { NavbarComp } from "@/components/navbar";
import Testimonial06 from "@/components/testimonial-06/testimonial-06";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Kata sweets",
};

/**
 * The `HomePage` function in TypeScript React renders a Navbar component and a Footer component.
 * @returns The `HomePage` component is being returned, which includes the `NavbarComp` component and
 * the `Footer05Page` component wrapped in a fragment (`<>...</>`).
 */
export default function HomePage() {
  return (
    <>
      <NavbarComp />
      <Hero02 />
      <Features02Page />
      <Testimonial06 />
      <Contact01Page />
      <Footer05Page />
    </>
  );
}
