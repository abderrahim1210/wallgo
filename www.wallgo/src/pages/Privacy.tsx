import {
    Check,
    Database,
    EyeOff,
    Fingerprint,
    LockKeyhole,
    ShieldCheck,
    SlidersHorizontal,
    UserRound,
    WandSparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { MainLayout } from '../layouts/MainLayout'

const privacySections = [
    {
        id: 'information-we-collect',
        icon: Database,
        title: 'privacy.sections.information.title',
        eyebrow: 'privacy.sections.information.eyebrow',
        description: 'privacy.sections.information.description',
        items: [
            {
                title: 'privacy.sections.information.items.account.title',
                description: 'privacy.sections.information.items.account.description',
            },
            {
                title: 'privacy.sections.information.items.profile.title',
                description: 'privacy.sections.information.items.profile.description',
            },
            {
                title: 'privacy.sections.information.items.content.title',
                description: 'privacy.sections.information.items.content.description',
            },
            {
                title: 'privacy.sections.information.items.interactions.title',
                description: 'privacy.sections.information.items.interactions.description',
            },
        ],
    },
    {
        id: 'profile-views',
        icon: EyeOff,
        title: 'privacy.sections.profileViews.title',
        eyebrow: 'privacy.sections.profileViews.eyebrow',
        description: 'privacy.sections.profileViews.description',
        items: [
            {
                title: 'privacy.sections.profileViews.items.recording.title',
                description: 'privacy.sections.profileViews.items.recording.description',
            },
            {
                title: 'privacy.sections.profileViews.items.visibility.title',
                description: 'privacy.sections.profileViews.items.visibility.description',
            },
        ],
    },
    {
        id: 'how-we-use-data',
        icon: WandSparkles,
        title: 'privacy.sections.usage.title',
        eyebrow: 'privacy.sections.usage.eyebrow',
        description: 'privacy.sections.usage.description',
        items: [
            {
                title: 'privacy.sections.usage.items.feed.title',
                description: 'privacy.sections.usage.items.feed.description',
            },
            {
                title: 'privacy.sections.usage.items.security.title',
                description: 'privacy.sections.usage.items.security.description',
            },
            {
                title: 'privacy.sections.usage.items.notifications.title',
                description: 'privacy.sections.usage.items.notifications.description',
            },
            {
                title: 'privacy.sections.usage.items.improvement.title',
                description: 'privacy.sections.usage.items.improvement.description',
            },
        ],
    },
    {
        id: 'data-security',
        icon: LockKeyhole,
        title: 'privacy.sections.security.title',
        eyebrow: 'privacy.sections.security.eyebrow',
        description: 'privacy.sections.security.description',
        items: [
            {
                title: 'privacy.sections.security.items.authentication.title',
                description: 'privacy.sections.security.items.authentication.description',
            },
            {
                title: 'privacy.sections.security.items.storage.title',
                description: 'privacy.sections.security.items.storage.description',
            },
            {
                title: 'privacy.sections.security.items.control.title',
                description: 'privacy.sections.security.items.control.description',
            },
        ],
    },
    {
        id: 'your-rights',
        icon: UserRound,
        title: 'privacy.sections.rights.title',
        eyebrow: 'privacy.sections.rights.eyebrow',
        description: 'privacy.sections.rights.description',
        items: [
            {
                title: 'privacy.sections.rights.items.profile.title',
                description: 'privacy.sections.rights.items.profile.description',
            },
            {
                title: 'privacy.sections.rights.items.content.title',
                description: 'privacy.sections.rights.items.content.description',
            },
            {
                title: 'privacy.sections.rights.items.settings.title',
                description: 'privacy.sections.rights.items.settings.description',
            },
        ],
    },
]

const Privacy = () => {
    const { t } = useTranslation()

    return (
        <MainLayout>
            <Helmet>
                <title>{t('privacy.pageTitle')}</title>
            </Helmet>
            <main className="relative min-h-screen overflow-hidden bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-gray-950 sm:px-6 sm:py-16 lg:px-8">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] overflow-hidden">
                    <div
                        className="absolute left-1/2 top-[-12rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-3xl"
                        style={{
                            background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--special-purple) 20%, transparent), transparent 70%)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-gray-50/40 to-gray-50 dark:from-gray-950/20 dark:via-gray-950/50 dark:to-gray-950" />
                </div>

                <div className="relative mx-auto max-w-6xl">
                    <header className="relative isolate mb-14 space-y-6 py-4 text-center sm:mb-16 sm:py-8">
                        <div className="absolute left-1/2 top-[-8rem] -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--special-purple)]/10 blur-3xl" />
                        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/65 text-[var(--special-purple)] shadow-xl shadow-purple-950/5 backdrop-blur-md dark:border-white/10 dark:bg-gray-800/55">
                            <ShieldCheck className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <div className="space-y-4">
                            <p className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--special-purple)] shadow-sm backdrop-blur-md dark:border-purple-400/20 dark:bg-gray-900/60">
                                <Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />
                                {t('privacy.eyebrow')}
                            </p>
                            <h1 className="bg-gradient-to-r from-[var(--special-purple)] to-indigo-500 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                                {t('privacy.title')}
                            </h1>
                            <p className="mx-auto max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                                {t('privacy.subtitle')}
                            </p>
                        </div>
                        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-purple-200/60 bg-white/60 p-4 text-start shadow-sm backdrop-blur-md dark:border-purple-300/10 dark:bg-gray-900/55">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--special-purple)]" aria-hidden="true" />
                            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                                {t('privacy.summaryNote')}
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
                        <aside className="h-fit lg:sticky lg:top-24">
                            <nav
                                aria-label={t('privacy.toc.ariaLabel')}
                                className="rounded-2xl border border-white/70 bg-white/65 p-4 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/60 sm:p-5"
                            >
                                <div className="mb-3 flex items-center gap-2 px-2">
                                    <SlidersHorizontal className="h-4 w-4 text-[var(--special-purple)]" aria-hidden="true" />
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {t('privacy.toc.title')}
                                    </p>
                                </div>
                                <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                                    {privacySections.map((section, index) => (
                                        <li key={section.id} className="shrink-0 lg:shrink">
                                            <a
                                                href={`#${section.id}`}
                                                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-purple-50 hover:text-[var(--special-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)] dark:text-gray-300 dark:hover:bg-purple-950/40"
                                            >
                                                <span className="font-mono text-xs text-gray-400 transition-colors group-hover:text-[var(--special-purple)] dark:text-gray-500">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span className="whitespace-nowrap">{t(section.title)}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>

                        <div className="space-y-6">
                            {privacySections.map(({ id, icon: Icon, title, eyebrow, description, items }) => (
                                <section
                                    key={id}
                                    id={id}
                                    aria-labelledby={`${id}-title`}
                                    className="group relative scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[var(--special-purple)]/35 hover:shadow-xl hover:shadow-purple-950/[0.05] dark:border-white/10 dark:bg-gray-900/65 sm:p-8"
                                >
                                    <div className="pointer-events-none absolute -end-10 -top-14 h-52 w-52 rounded-full bg-[var(--special-purple)]/[0.06] blur-3xl transition-opacity group-hover:opacity-90 dark:bg-[var(--special-purple)]/[0.12]" />
                                    <div className="relative">
                                        <div className="mb-6 flex items-start gap-4">
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-100 to-white text-[var(--special-purple)] shadow-sm dark:border-purple-300/10 dark:from-purple-950/80 dark:to-gray-900">
                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                            <div>
                                                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--special-purple)]">
                                                    {t(eyebrow)}
                                                </p>
                                                <h2 id={`${id}-title`} className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                                                    {t(title)}
                                                </h2>
                                            </div>
                                        </div>
                                        <p className="mb-6 leading-7 text-gray-600 dark:text-gray-300">
                                            {t(description)}
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {items.map((item) => (
                                                <article
                                                    key={item.title}
                                                    className="rounded-2xl border border-gray-100/90 bg-white/65 p-4 transition-colors hover:border-purple-200/80 dark:border-white/[0.06] dark:bg-gray-950/35 dark:hover:border-purple-300/20"
                                                >
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-[var(--special-purple)] dark:bg-purple-950/50">
                                                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                                        </span>
                                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {t(item.title)}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                        {t(item.description)}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </MainLayout>
    )
}

export default Privacy
