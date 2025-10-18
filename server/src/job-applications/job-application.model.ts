import { Type } from "@google/genai";

const objectOrder = [
  "company_name",
  "role",
  "job_description",
  "min_salary",
  "max_salary",
  "location",
  "job_type",
  "work_schedule",
  "applied_at",
  "status",
  "job_url",
];

/**
 * Models/Schemas of Job Application page
 */
export const jobApplicationModel = {
  /**
   * Models/schema for services that deals with importing job applications:
   *
   * /importLink, /importCsv
   */
  importJobApplications: {
    /**
     * Object key's proper order. This is the object order that must be followed in the AI response.
     */
    objectOrder: objectOrder,
    /**
     * Structured output response of Gemini AI API.
     */
    structuredAIResponse: {
      type: Type.OBJECT,
      properties: {
        isValid: {
          type: Type.BOOLEAN,
          description: "False if the CSV file is not about job applications.",
        },
        schema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company_name: {
                type: Type.STRING,
                nullable: true,
              },
              role: {
                type: Type.STRING,
                nullable: true,
              },
              job_description: {
                type: Type.STRING,
                nullable: true,
              },
              min_salary: {
                type: Type.NUMBER,
                nullable: true,
              },
              max_salary: {
                type: Type.NUMBER,
                nullable: true,
              },
              location: {
                type: Type.STRING,
                nullable: true,
              },
              job_type: {
                type: Type.STRING,
                enum: ["Full-Time", "Contractual", "Part-Time", "Internship"],
              },
              work_schedule: {
                type: Type.STRING,
                description:
                  "Can be Monday - Friday, Nightshift/Dayshift etc. Anything about work schedule should be recorded here.",
              },
              applied_at: {
                type: Type.STRING,
                format: "date",
                nullable: true,
              },
              status: {
                type: Type.STRING,
                enum: [
                  "employed",
                  "rejected",
                  "applied",
                  "bookmarked",
                  "waiting for result",
                  "ghosted",
                ],
                nullable: true,
              },
              job_url: {
                type: Type.STRING,
                nullable: true,
              },
              currency: {
                type: Type.STRING,
                description:
                  "Use the correct currency here. Ex. USD, PHP, EUR. Only use acronyms",
              },
            },
          },
          propertyOrdering: objectOrder,
        },
      },
    },
  },
};
