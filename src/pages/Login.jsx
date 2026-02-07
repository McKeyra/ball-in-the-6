import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/api/base44Client";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check for stored redirect URL
    const redirect = localStorage.getItem("auth_redirect");
    localStorage.removeItem("auth_redirect");
    navigate(redirect || "/");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 md:p-6 lg:p-8 pb-24">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 md:mb-10">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#c9a962] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Zap className="w-6 h-6 md:w-7 md:h-7 text-[#0f0f0f]" />
          </div>
          <h1 className="text-xl md:text-2xl font-light tracking-tight text-white">
            Ball in the <span className="text-[#c9a962] font-normal">6</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm mt-2 font-light">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl md:rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-5 md:p-8">
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-[0.15em] mb-2 block font-light">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full min-h-[48px] rounded-xl bg-white/[0.06] border border-white/[0.06]
                    pl-10 pr-4 text-white text-sm font-light placeholder:text-white/20
                    focus:outline-none focus:border-[#c9a962]/40 focus:ring-1 focus:ring-[#c9a962]/20
                    transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-[0.15em] mb-2 block font-light">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full min-h-[48px] rounded-xl bg-white/[0.06] border border-white/[0.06]
                    pl-10 pr-12 text-white text-sm font-light placeholder:text-white/20
                    focus:outline-none focus:border-[#c9a962]/40 focus:ring-1 focus:ring-[#c9a962]/20
                    transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-xs md:text-sm font-light bg-red-400/10 rounded-xl px-4 py-3 border border-red-400/20">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] rounded-xl bg-[#c9a962] text-[#0f0f0f] font-medium text-sm
                hover:bg-[#b8943f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs md:text-sm mt-5 md:mt-6 font-light">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#c9a962] hover:text-[#b8943f] transition-colors py-2 inline-block">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
