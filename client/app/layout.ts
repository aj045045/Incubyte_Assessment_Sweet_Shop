import type { Metadata } from "next";
import { RootLayout } from "./config";

/* This code snippet is defining a constant named `metadata` that has a type of `Metadata`. The
`Metadata` type likely contains properties related to metadata for a web page, such as title,
description, etc. In this case, the `metadata` constant specifically defines a `title` property with
two sub-properties: `default` and `template`. */
export const metadata: Metadata = {
  title: {
    default: "Kata Sweets",
    template: "%s | Kata Sweets",
  },
};

export default RootLayout;