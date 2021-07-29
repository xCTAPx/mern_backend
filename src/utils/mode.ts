export const isProduction = process.env.MODE === "production";

export const isDevelopment =
  process.env.MODE === undefined || process.env.MODE === "development";

export const mode = isProduction ? "production" : "development";
