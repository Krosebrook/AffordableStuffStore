/**
 * Input validation schemas using Zod
 * Implements OWASP A03:2021 - Injection prevention
 */

import { z } from "zod";

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  email: z.string().email("Invalid email address").min(1, "Email is required"),

  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores",
    ),

  orgId: z.string().uuid("Invalid organization ID"),

  url: z.string().url("Invalid URL").max(2048, "URL too long"),

  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

  // Prevent XSS - sanitize user input
  safeString: z
    .string()
    .max(1000, "Input too long")
    .refine(
      (val) => !/<script|javascript:|onerror=|onload=/i.test(val),
      "Invalid input detected",
    ),

  // SQL injection prevention - alphanumeric only
  alphanumeric: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters allowed"),

  // Positive integer for IDs, counts, etc.
  positiveInt: z.number().int().positive("Must be a positive integer"),

  // ISO date string
  isoDate: z.string().datetime("Invalid date format"),
};

/**
 * User registration schema
 */
export const RegisterUserSchema = z.object({
  email: ValidationPatterns.email,
  password: ValidationPatterns.password,
  username: ValidationPatterns.username,
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  orgId: ValidationPatterns.orgId.optional(),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

/**
 * User login schema
 */
export const LoginUserSchema = z.object({
  email: ValidationPatterns.email,
  password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

/**
 * Contact form schema
 */
export const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: ValidationPatterns.email,
  subject: z.string().min(1, "Subject is required").max(200),
  message: ValidationPatterns.safeString.min(
    10,
    "Message must be at least 10 characters",
  ),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

/**
 * Search query schema
 */
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(200),
  page: ValidationPatterns.positiveInt.optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(["relevance", "date", "name"]).optional(),
  orgId: ValidationPatterns.orgId.optional(),
});

export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;

/**
 * Product schema (example for e-commerce)
 */
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: ValidationPatterns.safeString,
  price: z.number().positive().max(1000000),
  currency: z.enum(["USD", "EUR", "GBP"]),
  orgId: ValidationPatterns.orgId,
  createdAt: ValidationPatterns.isoDate,
  updatedAt: ValidationPatterns.isoDate,
});

export type Product = z.infer<typeof ProductSchema>;

/**
 * API response schema with pagination
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: ValidationPatterns.positiveInt,
      limit: ValidationPatterns.positiveInt,
      total: z.number().int().nonnegative(),
      totalPages: ValidationPatterns.positiveInt,
    }),
  });

/**
 * Validation helper function
 * Validates data against a schema and returns typed result or errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.issues.map(
      (err) => `${err.path.join(".")}: ${err.message}`,
    );

    return { success: false, errors };
  }
}

/**
 * Validate and throw on error
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
