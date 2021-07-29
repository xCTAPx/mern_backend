export const isProduction = process.env.NODE_ENV === "production";

export const isDevelopment =
  process.env.NODE_ENV === undefined || process.env.NODE_ENV === "development";

export const mode = isProduction ? "production" : "development";
