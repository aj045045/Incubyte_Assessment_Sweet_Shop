"use client"
import Footer05Page from "@/components/footer-05/footer-05";
import { NavbarComp } from "@/components/navbar";

/**
 * The `HomePage` function in TypeScript React renders a Navbar component and a Footer component.
 * @returns The `HomePage` component is being returned, which includes the `NavbarComp` component and
 * the `Footer05Page` component wrapped in a fragment (`<>...</>`).
 */
export default function HomePage() {
  return (
    <>
      <NavbarComp />
      <Footer05Page />
    </>
  );
}
