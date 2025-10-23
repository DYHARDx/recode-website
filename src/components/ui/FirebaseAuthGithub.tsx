import React from "react";
import { auth } from "../../lib/firebase";

const FirebaseAuthGithub = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) =>
      setUser(user),
    );
    return () => unregisterAuthObserver();
  }, []);

  if (user) {
    return (
      <div
        style={{ textAlign: "center" }}
        className="flex items-center justify-center gap-5 p-0"
      >
        <img
          src={user.photoURL || ""}
          alt="avatar"
          style={{ width: 48, borderRadius: "50%", border: "2px solid #000" }}
        />
        <br />
        <button
          onClick={() => auth.signOut()}
          className="flex cursor-pointer items-center gap-2 rounded bg-gray-900 px-4 py-1 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-gray-700"
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    );
  }

  const handleGithubSignIn = async () => {
    setLoading(true);
    
    try {
      // Dynamically import Firebase auth functions
      const { GithubAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GithubAuthProvider();
      
      // Add custom parameters to ensure proper OAuth flow
      provider.setCustomParameters({
        allow_signup: 'false'
      });
      
      // Try popup sign in first
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("GitHub sign-in error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Handle specific error cases
      let errorMessage = error.message || "Unknown error occurred";

      if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Popup was blocked by your browser. Please allow popups for this site and try again.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage =
          "Sign-in popup was closed before completing sign-in. Please try again.";
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-oauth-client-id"
      ) {
        errorMessage =
          "GitHub OAuth configuration error. Please contact the site administrator.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage =
          "This domain is not authorized for OAuth operations. Please contact the site administrator.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage =
          "Popup request was cancelled. Please try again.";
      } else if (error.code === "auth/web-storage-unsupported") {
        errorMessage =
          "Web storage is not supported or is disabled. Please enable cookies and try again.";
      } else if (error.code === "auth/internal-error") {
        errorMessage =
          "Internal error occurred. Please try again later.";
      } else {
        // Log the full error for debugging
        console.error("Full error object:", error);
        errorMessage = `GitHub sign-in failed: ${error.message || "Unknown error"}. Error code: ${error.code || "N/A"}. Please contact support if this persists.`;
      }

      // Show user-friendly error message
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ textAlign: "center" }}
      className="flex items-center justify-center gap-5 p-0"
    >
      <button
        onClick={handleGithubSignIn}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded bg-[var(--btn-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:bg-[var(--btn-hover)] hover:text-[var(--btn-hover-text)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm md:text-base"
      >
        {loading ? (
          <>
            <svg
              className="mr-2 -ml-1 h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </>
        ) : (
          <>
            <svg
              height="22"
              width="22"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="github-text">Sign in with GitHub</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FirebaseAuthGithub;