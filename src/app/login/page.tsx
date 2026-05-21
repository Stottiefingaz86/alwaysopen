import type { Metadata } from "next";
import { LoginForm } from "@/app/login/login-form";
import { Logo } from "@/components/landing/logo";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-google-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-google-gray-200 bg-white p-8 shadow-google-card">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-lg font-medium text-foreground">VoC admin</h1>
        <p className="mt-2 text-center text-sm text-google-gray-500">
          Sign in to manage businesses and client reports.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
