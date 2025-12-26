/**
 * Example component demonstrating security features
 * This shows how to use validation, authentication, and secure logging
 */

/* eslint-disable no-console */
/* global console */

import type React from "react";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { LoginUserSchema, validateData } from "@/utils/validation";
import { createApiClient } from "@/utils/auth";
import { SecureLogger } from "@/utils/security";

const logger = new SecureLogger("LoginExample");

export function LoginExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      // Step 1: Validate input using Zod schema
      const validationResult = validateData(LoginUserSchema, {
        email,
        password,
      });

      if (!validationResult.success) {
        setErrors(validationResult.errors);
        logger.warn("Login validation failed", {
          errors: validationResult.errors,
        });

        return;
      }

      // Step 2: Make authenticated API request
      const apiClient = createApiClient();
      const tokens = await apiClient.login(email, password);

      // Step 3: Log successful login (credentials are automatically sanitized)
      logger.security("User logged in successfully", {
        email,
        timestamp: new Date().toISOString(),
      });

      // Step 4: Redirect or update UI
      console.log("Login successful!", tokens);
      // window.location.href = '/dashboard';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      setErrors([errorMessage]);

      // Log error (sensitive data is automatically redacted)
      logger.error("Login failed", {
        error: errorMessage,
        email,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Secure Login Example</h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <Input
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <Input
          required
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        {errors.length > 0 && (
          <div className="text-red-500 text-sm space-y-1">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <Button fullWidth color="primary" isLoading={loading} type="submit">
          Login
        </Button>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold mb-2">Security Features Demonstrated:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Input validation with Zod schemas</li>
          <li>JWT authentication with refresh tokens</li>
          <li>Secure logging (credentials redacted)</li>
          <li>Error handling with user-friendly messages</li>
          <li>Rate limiting (enforced by API)</li>
        </ul>
      </div>
    </div>
  );
}
