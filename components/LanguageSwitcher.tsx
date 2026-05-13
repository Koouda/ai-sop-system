'use client'

interface LanguageSwitcherProps {
  language: string
  setLanguage: (lang: 'en' | 'ar') => void
}

export default function LanguageSwitcher({
  language,
  setLanguage,
}: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
          language === 'en'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage('ar')}
        className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
          language === 'ar'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        AR
      </button>
    </div>
  )
}
