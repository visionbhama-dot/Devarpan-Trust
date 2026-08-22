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
    <section className="relative overflow-hidden border-b-4 border-marigold-400 bg-mandana">
      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-block rounded-full bg-vermilion-600 px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-white shadow-sm"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-5xl font-normal text-ink-900 md:text-6xl"
        >
          {title}
        </motion.h1>
        {/* decorative divider */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <span className="h-1 w-10 rounded-full bg-vermilion-500" />
          <span className="size-2.5 rotate-45 bg-marigold-400" />
          <span className="h-1 w-10 rounded-full bg-vermilion-500" />
        </div>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-ink-700 md:text-lg"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </section>
  )
}
