import type { NextConfig } from "next";
// @ts-ignore
import nextI18NextConfig from "./next-i18next.config.js";

const { i18n } = nextI18NextConfig;

const nextConfig: NextConfig = {
  i18n,
  /* other config options here */
};

export default nextConfig;
