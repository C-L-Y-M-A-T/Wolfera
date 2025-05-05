import Script from "next/script";
import { useEffect } from "react";
import { googleSignIn } from "../../api/authService";

declare global {
  interface Window {
    handleSignInWithGoogle: (response: any) => void;
  }
}

export default function GoogleSignIn() {
  async function handleSignInWithGoogle(response) {
    try {
      const res = await googleSignIn(response.credential);
      console.log("Google Sign-In Response: ", res);
    } catch (error) {
      console.error("Google sign-in failed", error);
    }
  }

  // const handleSignInWithGoogle = (response) => {
  //   console.log("Google Sign-In Response: ", response);
  //   if (response) {
  //     // Do something with the response.
  //   } else {
  //     console.error("Google sign-in failed");
  //   }
  // };

  useEffect(() => {
    window.handleSignInWithGoogle = handleSignInWithGoogle;
    return () => {
      delete window.handleSignInWithGoogle;
    };
  }, []);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async />
      <div
        id="g_id_onload"
        data-client_id="724250411037-ocml8h8ihs3urem63bbjuvd0pi74ebin.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-auto_select="true"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_black"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
}
