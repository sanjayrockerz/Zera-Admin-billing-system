import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Building, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdminAuthStore } from '../store/store'
import { BRAND_EN, BRAND_TA } from '../lib/brand'
import { useLangStore } from '../store/langStore'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLangStore()
  const l = (en: string, ta: string) => lang === 'ta' ? ta : en
  const login = useAdminAuthStore((state) => state.login)

  const [shopId, setShopId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(shopId.trim(), password)
    setLoading(false)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError(l('Invalid Shop ID or Password', 'தவறான கடை அடையாளம் அல்லது கடவுச்சொல்'))
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#eaf2e5] to-[#f7f6f2] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-sand/40 w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-sage/30 rounded-2xl flex items-center justify-center mb-3">
            <Building size={24} className="text-sageDark" />
          </div>
          <h1 className="text-xl font-bold font-headline text-textMain text-center">{BRAND_EN}</h1>
          <p className="text-[12px] text-textMuted mt-0.5 text-center">{BRAND_TA}</p>
          <p className="mt-2.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            {l('Admin Access', 'நிர்வாக அணுகல்')}
          </p>
        </div>

        {/* Server-level error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-[12px] mb-4 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-[13px] font-bold text-textMain">{l('Sign in to Dashboard', 'டாஷ்போர்ட்டில் உள்நுழahui')}</p>

          {/* Shop ID */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-textMuted uppercase tracking-wide mb-1.5">
              <Building size={14} />
              {l('Shop ID', 'கடை அடையாளம்')}
              <span className="text-red-500 font-black">*</span>
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder="e.g. shopname"
              className="w-full px-4 py-3 rounded-xl border-2 outline-none text-[13px] transition-colors border-sand focus:border-sageDark"
              value={shopId}
              onChange={(e) => { setShopId(e.target.value); setError('') }}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-textMuted uppercase tracking-wide mb-1.5">
              <Lock size={14} />
              {l('Password', 'கடவுச்சொல்')}
              <span className="text-red-500 font-black">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border-2 outline-none text-[13px] transition-colors border-sand focus:border-sageDark pr-12"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain"
                aria-label={showPassword ? l('Hide password', 'கடவுச்சொல்லை மறை') : l('Show password', 'கடவுச்சொல்லை காட்டு')}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sageDark hover:bg-sageDeep text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                {l('Signing in...', 'உள்நுழைகிறது...')}
              </>
            ) : (
              <>
                <Lock size={15} />
                {l('Sign In', 'உள்நுழு')}
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400 leading-relaxed">
            {l('Enter your shop credentials to access the admin dashboard.', 'நிர்வாக டாஷ்போர்ட்டில் அணுக உங்கள் கடை கைமுறைகளை உள்ளிடவும்.')}<br />
            {l('Default: shopname / shopname@cenexa', 'மூலம்: shopname / shopname@cenexa')}
          </p>
        </form>
      </div>
    </div>
  )
}