import { Link } from 'react-router-dom'

const VARIANTS = {
  gradient: 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-xl hover:shadow-violet-200',
  dark:     'bg-slate-800 hover:bg-slate-700 text-white',
  white:    'bg-white text-violet-700 hover:shadow-2xl',
  outline:  'border-2 border-white/50 text-white hover:bg-white/10',
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function Button({
  children,
  to,
  href,
  variant = 'gradient',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all',
    VARIANTS[variant] ?? VARIANTS.gradient,
    className,
  ].join(' ')

  const content = loading ? <><Spinner />Procesando...</> : children

  if (to) {
    return <Link to={to} className={base} {...props}>{content}</Link>
  }
  if (href) {
    return <a href={href} className={base} {...props}>{content}</a>
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} disabled:opacity-60 disabled:cursor-not-allowed`}
      {...props}
    >
      {content}
    </button>
  )
}
