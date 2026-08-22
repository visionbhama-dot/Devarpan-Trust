// Colorful Om mark on a bright circular background — used across the site.
const sizes = {
  sm: { ring: 'size-10', img: 'size-6' },
  md: { ring: 'size-12', img: 'size-7' },
  lg: { ring: 'size-16', img: 'size-10' },
  xl: { ring: 'size-20', img: 'size-12' },
} as const

export default function OmLogo({
  size = 'md',
  className = '',
}: {
  size?: keyof typeof sizes
  className?: string
}) {
  const s = sizes[size]
  return (
    <span
      className={`grid ${s.ring} place-items-center rounded-full bg-gradient-to-br from-white to-marigold-50 shadow-md ring-2 ring-marigold-300 ${className}`}
    >
      <img src="/om-color.svg" alt="ॐ" className={`${s.img} object-contain`} />
    </span>
  )
}
