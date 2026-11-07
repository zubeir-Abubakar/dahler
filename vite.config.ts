import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vercel runs api/contact.ts as a serverless function in production. `vite dev`
 * has no serverless runtime, so this middleware answers the same route with the
 * same "not configured" response the function gives without RESEND_API_KEY —
 * the form's error path stays honest and testable locally.
 */
function contactDevStub(): Plugin {
  return {
    name: "contact-dev-stub",
    configureServer(server) {
      server.middlewares.use("/api/contact", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ code: "method_not_allowed" }));
          return;
        }
        res.statusCode = 503;
        res.end(
          JSON.stringify({
            code: "not_configured",
            message:
              "Run `vercel dev` with RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL set to send real email.",
          }),
        );
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contactDevStub()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
