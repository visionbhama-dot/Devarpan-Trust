// Official Devarpan Trust logo on a bright circular background — used across the site.
const sizes = {
  sm: { ring: 'size-10', pad: 'p-1' },
  md: { ring: 'size-12', pad: 'p-1' },
  lg: { ring: 'size-16', pad: 'p-1.5' },
  xl: { ring: 'size-20', pad: 'p-2' },
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
      className={`grid ${s.ring} ${s.pad} place-items-center overflow-hidden rounded-full bg-white shadow-md ring-2 ring-marigold-300 ${className}`}
    >
      <img
        src="/devarpan-logo.png"
        alt="देवार्पण ट्रस्ट"
        className="size-full object-contain"
      />
    </span>
  )
}
