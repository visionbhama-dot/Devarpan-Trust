import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, User, Landmark, CheckCircle2, Send } from 'lucide-react'
import { FacebookIcon } from '../components/icons'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import { useSettings } from '../lib/SettingsContext'

export default function Contact() {
  const { t } = useTranslation()
  const { pick } = useLang()
  const settings = useSettings()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    e.currentTarget.reset()
    setTimeout(() => setSent(false), 6000)
  }

  return (
    <>
      <PageHeader
        kicker={t('contact.kicker')}
        title={t('contact.title')}
        intro={t('contact.intro')}
        image="/gallery/g04-yajna.jpg"
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT: info */}
          <div className="space-y-5">
            <InfoCard icon={MapPin} title={t('contact.officeTitle')}>
              <p className="text-ink-800">{pick(settings.address)}</p>
            </InfoCard>

            <InfoCard icon={Phone} title={t('contact.phoneTitle')}>
              <ul className="space-y-1">
                {settings.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:+91${p}`} className="font-medium text-ink-800 hover:text-vermilion-600">
                      +91 {p}
                    </a>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard icon={Mail} title={t('contact.emailTitle')}>
              <a
                href={`mailto:${settings.email}`}
                className="break-all font-medium text-ink-800 hover:text-vermilion-600"
              >
                {settings.email}
              </a>
              {settings.socials.facebook && (
                <a
                  href={settings.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-vermilion-700 hover:underline"
                >
                  <FacebookIcon className="size-4" /> Facebook
                </a>
              )}
            </InfoCard>

            <InfoCard icon={User} title={t('contact.presidentTitle')}>
              <p className="font-medium text-ink-800">{t('contact.presidentName')}</p>
            </InfoCard>

            {/* Bank / donate */}
            <div className="rounded-3xl bg-gradient-to-br from-vermilion-600 to-marigold-500 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/20">
                  <Landmark className="size-6" />
                </span>
                <h3 className="font-display text-xl font-normal">{t('contact.bankTitle')}</h3>
              </div>
              <dl className="grid gap-3 sm:grid-cols-3">
                <BankItem label={t('contact.pan')} value={settings.bank.pan} />
                <BankItem label={t('contact.account')} value={settings.bank.account} />
                <BankItem label={t('contact.ifsc')} value={settings.bank.ifsc} />
              </dl>
            </div>
          </div>

          {/* RIGHT: form */}
          <div>
            <div className="rounded-3xl border border-saffron-100 bg-white p-7 shadow-md md:p-8">
              <h3 className="font-display text-2xl font-bold text-ink-900">{t('contact.formTitle')}</h3>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-leaf-50 p-3 text-sm font-medium text-leaf-800 ring-1 ring-leaf-200"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-leaf-600" />
                  {t('contact.formThanks')}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Field label={t('contact.formName')}>
                  <input required type="text" name="name" className={inputCls} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t('contact.formEmail')}>
                    <input type="email" name="email" className={inputCls} />
                  </Field>
                  <Field label={t('contact.formPhone')}>
                    <input type="tel" name="phone" className={inputCls} />
                  </Field>
                </div>
                <Field label={t('contact.formMessage')}>
                  <textarea required name="message" rows={4} className={inputCls} />
                </Field>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-leaf-600 px-6 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Send className="size-5" /> {t('contact.formSubmit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const inputCls =
  'w-full rounded-xl border border-saffron-200 bg-saffron-50/50 px-4 py-2.5 text-ink-900 outline-none transition-colors focus:border-saffron-500 focus:bg-white focus:ring-2 focus:ring-saffron-200'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      {children}
    </label>
  )
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-saffron-100 bg-white p-5 shadow-sm">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-saffron-500 to-leaf-600 text-white shadow">
        <Icon className="size-6" />
      </span>
      <div>
        <h3 className="font-display text-base font-bold text-ink-900">{title}</h3>
        <div className="mt-1 text-sm">{children}</div>
      </div>
    </div>
  )
}

function BankItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 p-3">
      <dt className="text-xs font-medium text-white/80">{label}</dt>
      <dd className="mt-0.5 break-all font-mono text-sm font-semibold">{value}</dd>
    </div>
  )
}
