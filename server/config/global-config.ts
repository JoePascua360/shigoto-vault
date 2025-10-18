import { GoogleGenAI } from "@google/genai";

type dbConfig = {
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
  DB_NAME: string | undefined;
};

export class GlobalConfigs {
  static apiVersion: string = process.env.VITE_API_VERSION || "v1";
  static dbConfig: dbConfig = {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME,
  };
  static geminiConfig = {
    ai: new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  };
  static resendConfig = {
    apiKey: process.env.RESEND_API_KEY,
    referenceEmail: process.env.REFERENCE_EMAIL,
  };
}
