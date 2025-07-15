"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";

const EmailVerificationPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = () => {
    setIsResending(true);

    setTimeout(() => {
        setIsResending(false);
        setResendSuccess(true);
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    }, 1500);
  };

  const handleLogout = async () => {
      await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8 flex justify-center">
                <svg
                  viewBox="0 0 400 240"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-64"
                >
            <rect x="50" y="60" width="300"
              height="180"
              rx="8"
              fill="#E2E8F0"
            />
            <path
              d="M50,60 L200,140 L350,60"
              stroke="#94A3B8"
              strokeWidth="2"
              fill="#F1F5F9"
            />
            <rect x="70" y="80" width="260" height="140" rx="4" fill="white" />
            <line
              x1="100" y1="110"
              x2="300"  y2="110"
              stroke="#CBD5E1" strokeWidth="2"
            />
            <line
              x1="100"
              y1="140"
              x2="300"
              y2="140"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="170"
              x2="250"
              y2="170"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <circle cx="330" cy="40" r="30" fill="#3B82F6" />
            <path
              d="M320,40 L328,48 L340,32"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="330"
              cy="40"
              r="35"
              stroke="#DBEAFE"
              strokeWidth="5"
              fill="none"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="r"
                from="35"
                to="45"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="1"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h1>

        <p className="text-gray-600 mb-6">
          We&#39;ve sent a verification link to your registered email address.
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="p-4 bg-blue-50 rounded-md mb-6">
          <p className="text-sm text-blue-800">
            Can&#39;t find the email? Check your spam folder or click below to
            resend it.
          </p>
        </div>

        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isResending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isResending ? "Sending..." : "Resend Verification Email"}
        </button>

        {resendSuccess && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
            Verification email has been resent successfully!
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full mt-5 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium"
        >
          Already Verified
        </button>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Having trouble?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
};

export default EmailVerificationPage;
