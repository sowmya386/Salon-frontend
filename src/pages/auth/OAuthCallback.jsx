import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import api from "../../api/axios";
import { setAuth } from "../../utils/auth";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Retrieve the session that Supabase parsed from the URL fragment
    supabase.auth.getSession().then(async ({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error("Supabase Auth Error:", sessionError);
        setError("Authentication failed during Google redirect.");
        return;
      }

      if (session && session.access_token) {
        // 2. We have a valid Google/Supabase token.
        // Grab the saved preferences from localStorage (if the user was Registering)
        const savedSalonName = localStorage.getItem("oauth_salonName");
        const savedRole = localStorage.getItem("oauth_role");

        try {
          // 3. Exchange the Supabase Token for a Spring Boot JWT
          const response = await api.post('/auth/supabase/exchange', {
            accessToken: session.access_token,
            salonName: savedSalonName || null,
            role: savedRole || null
          });

          const jwt = response.data?.token;
          if (!jwt) throw new Error("Backend did not return a valid token.");

          // 4. Decode JWT to find the Spring Boot assigned Role
          let base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) {
            base64 += '=';
          }
          const payload = JSON.parse(atob(base64));
          const roles = payload.roles || [];

          // 5. Cleanup localStorage securely
          localStorage.removeItem("oauth_salonName");
          localStorage.removeItem("oauth_role");

          // 6. Navigate to proper dashboard
          if (roles.includes("ROLE_SUPER_ADMIN")) {
            setAuth(jwt, "SUPER_ADMIN");
            navigate("/super-admin/dashboard");
          } else if (roles.includes("ROLE_ADMIN")) {
            setAuth(jwt, "ADMIN");
            navigate("/admin/dashboard");
          } else {
            setAuth(jwt, "CUSTOMER");
            navigate("/portal");
          }

        } catch (err) {
          console.error("Backend Exchange Error:", err);
          setError(err.response?.data?.message || "Failed to finalize Google Login securely.");
          localStorage.removeItem("oauth_salonName");
          localStorage.removeItem("oauth_role");
        }
      } else {
        // Did not return with a session
        setError("No session data received from Google.");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center border border-gray-100">
        {!error ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Securely logging you in...</h2>
            <p className="text-gray-500 text-sm">Validating your Google credentials with the server. Please wait.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Failed</h2>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
