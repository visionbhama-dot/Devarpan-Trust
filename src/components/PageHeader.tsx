import { motion } from 'framer-motion'

export default function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string
  title: string
  intro?: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saffron-600 via-saffron-500 to-leaf-600 text-white">
      <div className="absolute inset-0 bg-pattern opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold tracking-wide ring-1 ring-white/30"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl font-extrabold drop-shadow-sm md:text-5xl"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg"
          >
            {intro}
          </motion.p>
        )}
      </div>
      <div className="h-3 w-full bg-gradient-to-r from-saffron-700 via-white/40 to-leaf-700" />
    </section>
  )
}
