import {
    ArrowRight,
    Bookmark,
    CalendarDays,
    EyeOff,
    FileText,
    Film,
    HeartHandshake,
    Sparkles,
    Users,
    UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { MainLayout } from '../MainLayout'
import useDarkMode from '../hooks/useDarkMode'

const About = () => {
    const { t } = useTranslation()
    const { isDarkMode } = useDarkMode()

    const features = [
        {
            icon: FileText,
            title: 'about.features.posts.title',
            description: 'about.features.posts.description',
        },
        {
            icon: Film,
            title: 'about.features.reels.title',
            description: 'about.features.reels.description',
        },
        {
            icon: Bookmark,
            title: 'about.features.bookmarks.title',
            description: 'about.features.bookmarks.description',
        },
        {
            icon: Users,
            title: 'about.features.communities.title',
            description: 'about.features.communities.description',
        },
        {
            icon: EyeOff,
            title: 'about.features.profileViews.title',
            description: 'about.features.profileViews.description',
        },
    ]

    return (
        <MainLayout>
            <Helmet>
                <title>{t('about.pageTitle')}</title>
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
                <div className="relative mx-auto max-w-6xl space-y-16 sm:space-y-20">
                    <header className="relative isolate space-y-7 py-4 text-center sm:py-8">
                        <div className="absolute left-1/2 top-[-8rem] -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--special-purple)]/10 blur-3xl" />
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/65 px-5 py-3 shadow-xl shadow-purple-950/5 backdrop-blur-md dark:border-white/10 dark:bg-gray-800/55">
                            <img
                                src={isDarkMode ? '/icons/logos/mix_logo.webp' : '/icons/logos/mix_logo1.webp'}
                                alt={t('about.logoAlt')}
                                className="h-12 w-auto object-contain sm:h-14"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--special-purple)] shadow-sm backdrop-blur-md dark:border-purple-400/20 dark:bg-gray-900/60">
                                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                                {t('about.eyebrow')}
                            </p>
                            <h1 className="bg-gradient-to-r from-[var(--special-purple)] to-indigo-500 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                                {t('about.title')}
                            </h1>
                            <p className="mx-auto max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                                {t('about.description')}
                            </p>
                        </div>
                    </header>

                    <section className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 p-7 shadow-xl shadow-gray-950/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--special-purple)]/50 hover:shadow-2xl hover:shadow-purple-950/[0.08] dark:border-white/10 dark:bg-gray-900/60 sm:p-10">
                        <div className="absolute -end-10 -top-14 h-56 w-56 rounded-full bg-[var(--special-purple)]/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-100 to-white text-[var(--special-purple)] shadow-inner dark:border-purple-300/10 dark:from-purple-950/70 dark:to-gray-900">
                                <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                    {t('about.whyTitle')}
                                </h2>
                                <p className="max-w-4xl text-base leading-8 text-gray-600 dark:text-gray-300">
                                    {t('about.whyDescription')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="about-features-title" className="space-y-8">
                        <div className="space-y-3 text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--special-purple)]">
                                {t('about.eyebrow')}
                            </p>
                            <h2 id="about-features-title" className="bg-gradient-to-r from-[var(--special-purple)] to-indigo-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                                {t('about.featuresTitle')}
                            </h2>
                            <p className="mx-auto max-w-2xl leading-relaxed text-gray-600 dark:text-gray-400">
                                {t('about.featuresDescription')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map(({ icon: Icon, title, description }) => (
                                <article
                                    key={title}
                                    className={`group relative isolate min-h-56 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--special-purple)]/50 hover:shadow-xl hover:shadow-purple-950/[0.08] dark:border-white/10 dark:bg-gray-900/65 ${
                                        title === 'about.features.posts.title' || title === 'about.features.reels.title'
                                            ? 'sm:col-span-2'
                                            : ''
                                    }`}
                                >
                                    <div className="pointer-events-none absolute -end-5 -top-6 -z-10 text-[var(--special-purple)]/[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 dark:text-purple-300/[0.08]">
                                        <Icon className="h-36 w-36" strokeWidth={1} aria-hidden="true" />
                                    </div>
                                    <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-100 to-white text-[var(--special-purple)] shadow-sm dark:border-purple-300/10 dark:from-purple-950/80 dark:to-gray-900">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <h3 className="mb-2 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                        {t(title)}
                                    </h3>
                                    <p className="max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-400">
                                        {t(description)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <article className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-7 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--special-purple)]/50 dark:border-white/10 dark:bg-gray-900/65 sm:p-8">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-100 to-white text-[var(--special-purple)] dark:border-purple-300/10 dark:from-purple-950/80 dark:to-gray-900">
                                    <CalendarDays className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                    {t('about.journeyTitle')}
                                </h2>
                            </div>
                            <ol className="space-y-6 border-s-2 border-purple-100 ps-5 dark:border-purple-900/60">
                                <li className="relative">
                                    <span className="absolute -start-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--special-purple)] ring-4 ring-white dark:ring-gray-900" />
                                    <p className="inline-flex rounded-full border border-purple-200/70 bg-purple-50/80 px-3 py-1 text-xs font-bold tracking-wide text-[var(--special-purple)] dark:border-purple-300/10 dark:bg-purple-950/50">
                                        {t('about.timeline.beginningDate')}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {t('about.timeline.beginningDescription')}
                                    </p>
                                </li>
                                <li className="relative">
                                    <span className="absolute -start-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--special-purple)] ring-4 ring-white dark:ring-gray-900" />
                                    <p className="inline-flex rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 dark:border-indigo-300/10 dark:bg-indigo-950/50 dark:text-indigo-300">
                                        {t('about.timeline.todayDate')}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {t('about.timeline.todayDescription')}
                                    </p>
                                </li>
                            </ol>
                        </article>

                        <article className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-7 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--special-purple)]/50 dark:border-white/10 dark:bg-gray-900/65 sm:p-8">
                            <div className="pointer-events-none absolute -end-12 -top-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
                            <div className="mb-5 flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-100 to-white text-[var(--special-purple)] dark:border-purple-300/10 dark:from-purple-950/80 dark:to-gray-900">
                                    <UserRound className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                    {t('about.founderTitle')}
                                </h2>
                            </div>
                            <p className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {t('about.founderName')}
                            </p>
                            <p className="mt-1 text-sm font-medium text-[var(--special-purple)]">
                                {t('about.founderRole')}
                            </p>
                            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
                                {t('about.founderDescription')}
                            </p>
                        </article>
                    </section>

                    <section className="relative isolate overflow-hidden rounded-[2rem] border border-purple-200/60 bg-gradient-to-br from-purple-100 via-white to-indigo-100 p-7 shadow-xl shadow-purple-950/[0.07] dark:border-purple-300/10 dark:from-purple-950/70 dark:via-gray-900 dark:to-indigo-950/60 sm:p-10">
                        <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[var(--special-purple)]/15 blur-3xl" />
                        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="max-w-2xl">
                                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-[var(--special-purple)] shadow-sm dark:bg-white/10">
                                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                    {t('about.featuresTitle')}
                                </h2>
                                <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">
                                    {t('about.featuresDescription')}
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <Link
                                    to="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200/80 bg-white/75 px-5 py-3 text-sm font-bold text-gray-800 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--special-purple)]/40 hover:text-[var(--special-purple)] dark:border-white/10 dark:bg-gray-800/70 dark:text-gray-100"
                                >
                                    {t('common.home')}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link
                                    to="/account/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--special-purple)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-900/30"
                                >
                                    {t('common.signUp')}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </MainLayout>
    )
}

export default About
