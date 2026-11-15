import {
    ArrowRight,
    BookOpen,
    Check,
    ChevronDown,
    CircleHelp,
    Film,
    LifeBuoy,
    Mail,
    MessageCircle,
    Search,
    Send,
    ShieldCheck,
    UserRound,
    X,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { MainLayout } from '../MainLayout'

const SUPPORT_EMAIL = 'abderrahimkhaliali@gmail.com'

const supportCategories = [
    {
        id: 'account',
        icon: UserRound,
        title: 'support.categories.account.title',
        description: 'support.categories.account.description',
    },
    {
        id: 'content',
        icon: Film,
        title: 'support.categories.content.title',
        description: 'support.categories.content.description',
    },
    {
        id: 'privacy',
        icon: ShieldCheck,
        title: 'support.categories.privacy.title',
        description: 'support.categories.privacy.description',
    },
    {
        id: 'general',
        icon: CircleHelp,
        title: 'support.categories.general.title',
        description: 'support.categories.general.description',
    },
]

const frequentlyAskedQuestions = [
    {
        id: 'reset-password',
        category: 'account',
        question: 'support.faq.resetPassword.question',
        answer: 'support.faq.resetPassword.answer',
    },
    {
        id: 'account-access',
        category: 'account',
        question: 'support.faq.accountAccess.question',
        answer: 'support.faq.accountAccess.answer',
    },
    {
        id: 'profile-views',
        category: 'privacy',
        question: 'support.faq.profileViews.question',
        answer: 'support.faq.profileViews.answer',
    },
    {
        id: 'delete-content',
        category: 'content',
        question: 'support.faq.deleteContent.question',
        answer: 'support.faq.deleteContent.answer',
    },
    {
        id: 'privacy-settings',
        category: 'privacy',
        question: 'support.faq.privacySettings.question',
        answer: 'support.faq.privacySettings.answer',
    },
    {
        id: 'report-a-problem',
        category: 'general',
        question: 'support.faq.reportProblem.question',
        answer: 'support.faq.reportProblem.answer',
    },
]

const Support = () => {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [openQuestion, setOpenQuestion] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState('general')
    const [replyEmail, setReplyEmail] = useState('')
    const [message, setMessage] = useState('')

    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
    const filteredQuestions = frequentlyAskedQuestions.filter(({ question, answer }) =>
        `${t(question)} ${t(answer)}`.toLocaleLowerCase().includes(normalizedQuery),
    )

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId)
        document.getElementById('support-contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const category = supportCategories.find(({ id }) => id === selectedCategory) ?? supportCategories[3]
        const categoryTitle = t(category.title)
        const subject = `${t('support.form.subjectPrefix')} - ${categoryTitle}`
        const body = [
            `${t('support.form.categoryLabel')}: ${categoryTitle}`,
            replyEmail.trim() ? `${t('support.form.replyEmailBodyLabel')}: ${replyEmail.trim()}` : '',
            '',
            message.trim(),
        ].filter(Boolean).join('\n')

        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    return (
        <MainLayout>
            <Helmet>
                <title>{t('support.pageTitle')}</title>
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
                            <LifeBuoy className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <div className="space-y-4">
                            <p className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--special-purple)] shadow-sm backdrop-blur-md dark:border-purple-400/20 dark:bg-gray-900/60">
                                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                {t('support.eyebrow')}
                            </p>
                            <h1 className="bg-gradient-to-r from-[var(--special-purple)] to-indigo-500 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                                {t('support.title')}
                            </h1>
                            <p className="mx-auto max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                                {t('support.subtitle')}
                            </p>
                        </div>

                        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-start shadow-lg shadow-gray-950/[0.03] backdrop-blur-md focus-within:border-[var(--special-purple)]/50 focus-within:ring-4 focus-within:ring-[var(--special-purple)]/10 dark:border-white/10 dark:bg-gray-900/65">
                            <Search className="h-5 w-5 shrink-0 text-[var(--special-purple)]" aria-hidden="true" />
                            <label className="sr-only" htmlFor="support-search">{t('support.search.label')}</label>
                            <input
                                id="support-search"
                                type="search"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value)
                                    setOpenQuestion(null)
                                }}
                                placeholder={t('support.search.placeholder')}
                                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setOpenQuestion(null)
                                    }}
                                    aria-label={t('support.search.clear')}
                                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)] dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </header>

                    <section aria-labelledby="support-categories-title" className="mb-16 space-y-6">
                        <div className="space-y-2 text-center">
                            <h2 id="support-categories-title" className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                {t('support.categoriesTitle')}
                            </h2>
                            <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
                                {t('support.categoriesDescription')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {supportCategories.map(({ id, icon: Icon, title, description }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => handleCategorySelect(id)}
                                    className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-5 text-start shadow-lg shadow-gray-950/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--special-purple)]/50 hover:shadow-xl hover:shadow-purple-950/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)] dark:border-white/10 dark:bg-gray-900/65"
                                >
                                    <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-purple-200/60 bg-gradient-to-br from-purple-100 to-white text-[var(--special-purple)] dark:border-purple-300/10 dark:from-purple-950/80 dark:to-gray-900">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span className="block text-base font-bold text-gray-900 dark:text-white">{t(title)}</span>
                                    <span className="mt-1 block text-sm leading-6 text-gray-600 dark:text-gray-400">{t(description)}</span>
                                    <ArrowRight className="absolute bottom-5 end-5 h-4 w-4 text-[var(--special-purple)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="support-faq-title" className="mb-16">
                        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--special-purple)]">
                                    {t('support.faq.eyebrow')}
                                </p>
                                <h2 id="support-faq-title" className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                    {t('support.faq.title')}
                                </h2>
                            </div>
                            <p className="max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400">
                                {t('support.faq.description')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {filteredQuestions.map(({ id, category, question, answer }) => {
                                const isOpen = openQuestion === id
                                const answerId = `support-faq-answer-${id}`

                                return (
                                    <article
                                        key={id}
                                        className="overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-md transition-colors hover:border-[var(--special-purple)]/35 dark:border-white/10 dark:bg-gray-900/65"
                                    >
                                        <h3>
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={answerId}
                                                onClick={() => setOpenQuestion(isOpen ? null : id)}
                                                className="flex w-full items-center justify-between gap-4 p-5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--special-purple)] sm:px-6"
                                            >
                                                <span>
                                                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--special-purple)]">
                                                        {t(`support.categories.${category}.title`)}
                                                    </span>
                                                    <span className="font-semibold leading-6 text-gray-900 dark:text-white">{t(question)}</span>
                                                </span>
                                                <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--special-purple)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                                            </button>
                                        </h3>
                                        <div id={answerId} hidden={!isOpen} className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-white/[0.06] sm:px-6">
                                            <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">{t(answer)}</p>
                                        </div>
                                    </article>
                                )
                            })}
                            {filteredQuestions.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-gray-300 bg-white/40 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-900/35">
                                    <CircleHelp className="mx-auto mb-3 h-8 w-8 text-[var(--special-purple)]" aria-hidden="true" />
                                    <p className="font-semibold text-gray-900 dark:text-white">{t('support.faq.noResultsTitle')}</p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('support.faq.noResultsDescription')}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section aria-labelledby="support-contact-title" className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                        <div id="support-contact-form" className="scroll-mt-24 rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/65 sm:p-8">
                            <div className="mb-6">
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--special-purple)]">
                                    {t('support.form.eyebrow')}
                                </p>
                                <h2 id="support-contact-title" className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                    {t('support.form.title')}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{t('support.form.description')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="support-category" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {t('support.form.categoryLabel')}
                                    </label>
                                    <select
                                        id="support-category"
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(event) => setSelectedCategory(event.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--special-purple)] focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    >
                                        {supportCategories.map(({ id, title }) => (
                                            <option key={id} value={id}>{t(title)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="support-reply-email" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {t('support.form.replyEmailLabel')}
                                    </label>
                                    <input
                                        id="support-reply-email"
                                        type="email"
                                        autoComplete="email"
                                        value={replyEmail}
                                        onChange={(event) => setReplyEmail(event.target.value)}
                                        placeholder={t('support.form.replyEmailPlaceholder')}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--special-purple)] focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="support-message" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {t('support.form.messageLabel')}
                                    </label>
                                    <textarea
                                        id="support-message"
                                        name="message"
                                        rows={5}
                                        required
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        placeholder={t('support.form.messagePlaceholder')}
                                        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--special-purple)] focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
                                    />
                                </div>

                                <div className="flex flex-col gap-4 border-t border-gray-100 pt-5 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
                                    <p className="max-w-md text-xs leading-5 text-gray-500 dark:text-gray-400">
                                        {t('support.form.mailtoNote')}
                                    </p>
                                    <button
                                        type="submit"
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--special-purple)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                                    >
                                        <Send className="h-4 w-4" aria-hidden="true" />
                                        {t('support.form.submit')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <aside className="space-y-5">
                            <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-purple-200/60 bg-gradient-to-br from-purple-100 via-white to-indigo-100 p-6 shadow-lg shadow-purple-950/[0.05] dark:border-purple-300/10 dark:from-purple-950/70 dark:via-gray-900 dark:to-indigo-950/60 sm:p-7">
                                <div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-14 -z-10 h-48 w-48 rounded-full bg-[var(--special-purple)]/15 blur-3xl" />
                                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[var(--special-purple)] shadow-sm dark:bg-white/10">
                                    <Mail className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{t('support.contact.emailTitle')}</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{t('support.contact.emailDescription')}</p>
                                <a
                                    href={`mailto:${SUPPORT_EMAIL}`}
                                    className="mt-4 inline-flex items-center gap-2 break-all text-sm font-bold text-[var(--special-purple)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)]"
                                >
                                    {t('support.contact.emailAddress', { email: SUPPORT_EMAIL })}
                                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                </a>
                            </div>

                            <div className="rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-lg shadow-gray-950/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/65 sm:p-7">
                                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[var(--special-purple)] dark:bg-purple-950/50">
                                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{t('support.contact.guidelinesTitle')}</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{t('support.contact.guidelinesDescription')}</p>
                                <Link
                                    to="/wallgo/terms#user-generated-content"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--special-purple)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)]"
                                >
                                    {t('support.contact.guidelinesLink')}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>

                            <p className="flex items-start gap-2 px-1 text-xs leading-5 text-gray-500 dark:text-gray-500">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--special-purple)]" aria-hidden="true" />
                                {t('support.contact.privacyNote')}
                            </p>
                        </aside>
                    </section>
                </div>
            </main>
        </MainLayout>
    )
}

export default Support
