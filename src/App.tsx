import { useEffect } from 'react'
import CoursePage from './pages/CoursePage'
import EnglishPage from './pages/EnglishPage'

const metaConfig = {
    english: {
        title: 'English Lessons & Resources | Fajarudin Akbar',
        description: 'Explore free English lessons, open educational resources, and EdTech projects created by Fajarudin Akbar for students and educators.',
        image: 'https://raw.githubusercontent.com/fajarudinakbar/Images/refs/heads/main/Fajarudin%20Akbar.png',
        imageAlt: 'Fajarudin Akbar, English teacher and EdTech practitioner',
        url: window.location.origin,
    },
} as const

const setMetaContent = (selector: string, content: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(selector)

    if (!element) {
        element = document.createElement('meta')
        const attribute = selector.startsWith('meta[property=') ? 'property' : 'name'
        const value = selector.match(/["'](.+)["']/)?.[1]

        if (!value) return

        element.setAttribute(attribute, value)
        document.head.appendChild(element)
    }

    element.content = content
}

const App = () => {
    useEffect(() => {
        const isEnglishPage = ['/', '/english', '/english/'].includes(window.location.pathname)
        if (!isEnglishPage) return

        const meta = metaConfig.english
        document.title = meta.title
        setMetaContent('meta[name="description"]', meta.description)
        setMetaContent('meta[property="og:title"]', meta.title)
        setMetaContent('meta[property="og:description"]', meta.description)
        setMetaContent('meta[property="og:image"]', meta.image)
        setMetaContent('meta[property="og:image:alt"]', meta.imageAlt)
        setMetaContent('meta[property="og:url"]', meta.url)
        setMetaContent('meta[property="og:type"]', 'website')
        setMetaContent('meta[name="twitter:card"]', 'summary_large_image')
        setMetaContent('meta[name="twitter:title"]', meta.title)
        setMetaContent('meta[name="twitter:description"]', meta.description)
        setMetaContent('meta[name="twitter:image"]', meta.image)

        let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        if (!canonical) {
            canonical = document.createElement('link')
            canonical.rel = 'canonical'
            document.head.appendChild(canonical)
        }
        canonical.href = meta.url
    }, [])

    useEffect(() => {
        const mobileMenuButton = document.getElementById('mobile-menu-button')
        const mobileMenu = document.getElementById('mobile-menu')
        const navLinksMobile = document.querySelectorAll('.nav-link-mobile')
        const hamburgerIcon = document.getElementById('hamburger-icon')?.children

        const closeMobileMenu = () => {
            mobileMenuButton?.setAttribute('aria-expanded', 'false')
            mobileMenu?.classList.add('hidden')
            if (hamburgerIcon) {
                ; (hamburgerIcon[0] as HTMLElement).style.transform = 'rotate(0)'
                    ; (hamburgerIcon[1] as HTMLElement).style.opacity = '1'
                    ; (hamburgerIcon[2] as HTMLElement).style.transform = 'rotate(0)'
            }
            mobileMenuButton?.classList.remove('bg-highlight')
        }

        const toggleMobileMenu = () => {
            const isExpanded = mobileMenuButton?.getAttribute('aria-expanded') === 'true'
            mobileMenuButton?.setAttribute('aria-expanded', String(!isExpanded))
            mobileMenu?.classList.toggle('hidden')
            if (!hamburgerIcon) return
                ; (hamburgerIcon[0] as HTMLElement).style.transform = !isExpanded ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)'
                ; (hamburgerIcon[1] as HTMLElement).style.opacity = !isExpanded ? '0' : '1'
                ; (hamburgerIcon[2] as HTMLElement).style.transform = !isExpanded ? 'rotate(-45deg) translate(5px, -5px)' : 'rotate(0)'
            mobileMenuButton?.classList.toggle('bg-highlight', !isExpanded)
        }

        mobileMenuButton?.addEventListener('click', toggleMobileMenu)
        navLinksMobile.forEach((link) => link.addEventListener('click', closeMobileMenu))

        const sections = document.querySelectorAll('.fade-in-section')
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible')
            })
        }, { threshold: 0.1 })
        sections.forEach((section) => observer.observe(section))

        const backToTopButton = document.getElementById('back-to-top')
        const handleScroll = () => backToTopButton?.classList.toggle('hidden', window.scrollY <= 400)
        const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
        window.addEventListener('scroll', handleScroll)
        backToTopButton?.addEventListener('click', scrollToTop)

        const tabButtons = document.querySelectorAll('.tab-btn')
        const tabPanels = document.querySelectorAll<HTMLElement>('.tab-panel')
        const tabHandlers = new Map<Element, EventListener>()
        tabButtons.forEach((button) => {
            const handler = () => {
                const targetPanelId = button.id.replace('btn', 'panel')
                tabButtons.forEach((btn) => {
                    btn.classList.remove('tab-active')
                    btn.classList.add('tab-inactive')
                    btn.setAttribute('aria-selected', 'false')
                })
                button.classList.add('tab-active')
                button.classList.remove('tab-inactive')
                button.setAttribute('aria-selected', 'true')
                tabPanels.forEach((panel) => {
                    panel.classList.toggle('hidden', panel.id !== targetPanelId)
                    if (panel.id === targetPanelId) {
                        panel.style.opacity = '0'
                        window.setTimeout(() => {
                            panel.style.transition = 'opacity 0.2s ease-in-out'
                            panel.style.opacity = '1'
                        }, 50)
                    }
                })
            }
            tabHandlers.set(button, handler)
            button.addEventListener('click', handler)
        })

        const aiPopup = document.getElementById('ai-popup')
        const aiPopupContent = document.getElementById('ai-popup-content')
        const popupClose = document.getElementById('ai-popup-close')
        const popupBackdrop = document.getElementById('ai-popup-backdrop')
        const closePopup = () => {
            aiPopup?.classList.add('opacity-0')
            aiPopupContent?.classList.add('scale-95')
            window.setTimeout(() => aiPopup?.classList.add('hidden'), 300)
        }
        popupClose?.addEventListener('click', closePopup)
        popupBackdrop?.addEventListener('click', closePopup)

        const popupTimer = window.setTimeout(() => {
            aiPopup?.classList.remove('hidden')
            void aiPopup?.offsetWidth
            aiPopup?.classList.remove('opacity-0')
            aiPopupContent?.classList.remove('scale-95')
        }, 2000)

        return () => {
            mobileMenuButton?.removeEventListener('click', toggleMobileMenu)
            navLinksMobile.forEach((link) => link.removeEventListener('click', closeMobileMenu))
            observer.disconnect()
            window.removeEventListener('scroll', handleScroll)
            backToTopButton?.removeEventListener('click', scrollToTop)
            tabHandlers.forEach((handler, button) => button.removeEventListener('click', handler))
            popupClose?.removeEventListener('click', closePopup)
            popupBackdrop?.removeEventListener('click', closePopup)
            window.clearTimeout(popupTimer)
        }
    }, [])

    if (window.location.pathname === '/kursus' || window.location.pathname === '/kursus/') {
        return <CoursePage />
    }

    if (
        window.location.pathname === '/' ||
        window.location.pathname === '/english' ||
        window.location.pathname === '/english/'
    ) {
        return <EnglishPage />
    }

    return (
        <>


            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white border-b-4 border-dark shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0">
                            <a href="#home" className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter uppercase text-dark">
                                Fajarudin<span className="text-accent">Akbar</span>.
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                <a href="#journey" className="nav-link text-slate-800 text-sm">Journey</a>
                                <a href="/english" className="nav-link text-slate-800 text-sm">English</a>
                                <a href="#expertise" className="nav-link text-slate-800 text-sm">Expertise</a>
                                <a href="#projects" className="nav-link text-slate-800 text-sm">Projects</a>
                                <a href="#impact" className="nav-link text-slate-800 text-sm">Impact</a>
                                <a href="#contact" className="neo-btn bg-highlight text-dark px-6 py-2.5 text-sm uppercase tracking-wider">Contact</a>
                            </div>
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button id="mobile-menu-button" className="neo-btn bg-white p-2 text-dark focus:outline-none" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <div id="hamburger-icon" className="space-y-1.5 w-6 h-5 flex flex-col justify-center">
                                    <span className="block w-6 h-0.5 bg-dark transition-transform duration-300 origin-center"></span>
                                    <span className="block w-6 h-0.5 bg-dark transition-opacity duration-300"></span>
                                    <span className="block w-6 h-0.5 bg-dark transition-transform duration-300 origin-center"></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile menu */}
                <div id="mobile-menu" className="md:hidden hidden bg-white border-t-4 border-dark shadow-neo absolute w-full left-0 z-40">
                    <div className="px-4 pt-4 pb-6 space-y-3">
                        <a href="#journey" className="nav-link-mobile block text-dark bg-slate-50 border-2 border-dark px-4 py-3 text-base font-black uppercase text-center hover:bg-highlight transition-colors">Journey</a>
                        <a href="/english" className="nav-link-mobile block text-dark bg-slate-50 border-2 border-dark px-4 py-3 text-base font-black uppercase text-center hover:bg-highlight transition-colors">English</a>
                        <a href="#expertise" className="nav-link-mobile block text-dark bg-slate-50 border-2 border-dark px-4 py-3 text-base font-black uppercase text-center hover:bg-highlight transition-colors">Expertise</a>
                        <a href="#projects" className="nav-link-mobile block text-dark bg-slate-50 border-2 border-dark px-4 py-3 text-base font-black uppercase text-center hover:bg-highlight transition-colors">Projects</a>
                        <a href="#impact" className="nav-link-mobile block text-dark bg-slate-50 border-2 border-dark px-4 py-3 text-base font-black uppercase text-center hover:bg-highlight transition-colors">Impact</a>
                        <a href="#contact" className="nav-link-mobile block bg-highlight text-dark border-2 border-dark px-4 py-3 text-base font-black uppercase text-center hover:bg-yellow-400 transition-colors shadow-neo-sm">Contact</a>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section id="home" className="py-16 sm:py-20 md:py-32 overflow-hidden px-4">
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="inline-block relative mb-8">
                            <img src="https://raw.githubusercontent.com/fajarudinakbar/Images/refs/heads/main/Fajarudin%20Akbar.png"
                                alt="Foto profil Fajarudin Akbar"
                                className="w-32 h-32 md:w-44 md:h-44 rounded-full mx-auto neo-card p-1 object-cover" />
                            <div className="absolute -bottom-3 -right-3 bg-highlight border-3 border-dark rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-neo-sm">
                                <i className="fa-solid fa-graduation-cap text-lg md:text-xl text-dark"></i>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-dark mb-6 uppercase break-words">
                            Fajarudin Akbar
                        </h1>

                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
                            <span className="bg-white text-dark border-2 border-dark px-3 py-1.5 sm:px-4 font-bold uppercase text-xs md:text-sm shadow-neo-sm">English Language Teacher</span>
                            <span className="bg-white text-dark border-2 border-dark px-3 py-1.5 sm:px-4 font-bold uppercase text-xs md:text-sm shadow-neo-sm">TEFL/TESOL Educator</span>
                            <span className="bg-accent text-white border-2 border-dark px-3 py-1.5 sm:px-4 font-bold uppercase text-xs md:text-sm shadow-neo-sm">EdTech Practitioner</span>
                        </div>

                        <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl font-medium text-slate-700 bg-white border-3 border-dark p-4 sm:p-6 shadow-neo">
                            Leveraging technology and Open Educational Resources to create dynamic, student-centered learning experiences for a global audience.
                        </p>

                        {/* Qualitative Grid */}
                        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                            <div className="neo-card p-6 sm:p-8 text-left relative mt-4 sm:mt-0">
                                <div className="absolute -top-5 -left-5 bg-white border-3 border-dark w-10 h-10 flex items-center justify-center shadow-neo-sm">
                                    <i className="fa-solid fa-chalkboard-user text-accent text-lg"></i>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-dark mb-3 uppercase tracking-tight">Pedagogical Expertise</h3>
                                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">Delivering student-centered, communicative language instruction grounded in global standards (GSE) to drive measurable proficiency gains in Business and Academic English.</p>
                            </div>
                            <div className="neo-card p-6 sm:p-8 text-left relative mt-4 sm:mt-0">
                                <div className="absolute -top-5 -left-5 bg-white border-3 border-dark w-10 h-10 flex items-center justify-center shadow-neo-sm">
                                    <i className="fa-solid fa-rocket text-highlight text-lg"></i>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-dark mb-3 uppercase tracking-tight">Continuous Innovation</h3>
                                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">Bridging the gap between traditional teaching and modern technology by creatively integrating EdTech tools and Open Educational Resources (OER) to empower learners.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Journey Section */}
                <section id="journey" className="py-16 sm:py-24 bg-white border-y-4 border-dark fade-in-section relative overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-dark uppercase inline-block bg-highlight px-4 sm:px-6 py-2 border-3 border-dark shadow-neo">The Educator's Journey</h2>
                            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-medium">A narrative of professional evolution, from direct instruction to scalable educational impact.</p>
                        </div>

                        <div className="max-w-4xl mx-auto relative">
                            {/* Desktop timeline line */}
                            <div className="absolute inset-0 hidden md:block">
                                <div className="w-1 h-full bg-dark mx-auto"></div>
                            </div>

                            <div className="space-y-8 sm:space-y-12 relative z-10">

                                {/* Timeline Item 1 */}
                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                                    {/* Mobile Marker & Line */}
                                    <div className="md:hidden absolute left-0 top-0 bottom-[-2rem] sm:bottom-[-3rem] w-1 bg-dark ml-5"></div>
                                    <div className="md:hidden absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-white border-4 border-dark flex items-center justify-center shadow-neo-sm z-10">
                                        <span className="font-black text-base sm:text-lg text-dark">1</span>
                                    </div>

                                    <div className="hidden md:block w-5/12 text-right">
                                        <div className="neo-card p-5 sm:p-6">
                                            <h3 className="font-black text-lg sm:text-xl text-dark uppercase">Foundational Roles</h3>
                                            <p className="mt-2 text-sm text-slate-600 font-medium">Began career as a Part-Time Teacher and English Tutor, honing core pedagogical skills and building a strong foundation in classroom instruction.</p>
                                        </div>
                                    </div>
                                    {/* Desktop Marker */}
                                    <div className="hidden md:flex absolute left-1/2 w-12 h-12 bg-white border-4 border-dark rounded-none -translate-x-1/2 items-center justify-center shadow-neo-sm">
                                        <span className="font-black text-lg text-dark">1</span>
                                    </div>

                                    {/* Mobile Card */}
                                    <div className="ml-14 sm:ml-16 md:hidden w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)]">
                                        <div className="neo-card p-5 sm:p-6">
                                            <h3 className="font-black text-lg sm:text-xl text-dark uppercase">Foundational Roles</h3>
                                            <p className="mt-2 text-sm text-slate-600 font-medium">Began career as a Part-Time Teacher and English Tutor, honing core pedagogical skills and building a strong foundation in classroom instruction.</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-5/12"></div>
                                </div>

                                {/* Timeline Item 2 */}
                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                                    {/* Mobile Marker & Line */}
                                    <div className="md:hidden absolute left-0 top-0 bottom-[-2rem] sm:bottom-[-3rem] w-1 bg-dark ml-5"></div>
                                    <div className="md:hidden absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent border-4 border-dark flex items-center justify-center shadow-neo-sm z-10">
                                        <span className="font-black text-base sm:text-lg text-white">2</span>
                                    </div>

                                    <div className="hidden md:block w-5/12"></div>
                                    {/* Desktop Marker */}
                                    <div className="hidden md:flex absolute left-1/2 w-12 h-12 bg-accent border-4 border-dark rounded-none -translate-x-1/2 items-center justify-center shadow-neo-sm">
                                        <span className="font-black text-lg text-white">2</span>
                                    </div>

                                    <div className="ml-14 sm:ml-16 md:ml-0 md:w-5/12 w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)]">
                                        <div className="neo-card p-5 sm:p-6 bg-slate-50">
                                            <h3 className="font-black text-lg sm:text-xl text-dark uppercase">Leadership in Academia</h3>
                                            <p className="mt-2 text-sm text-slate-600 font-medium">Grew into a leadership role as Head of Academic Division, pivoting from teaching students to shaping curricula. This experience provided deep insight into systemic educational challenges.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Item 3 */}
                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                                    {/* Mobile Marker & Line */}
                                    <div className="md:hidden absolute left-0 top-0 bottom-[-2rem] sm:bottom-[-3rem] w-1 bg-dark ml-5"></div>
                                    <div className="md:hidden absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-white border-4 border-dark flex items-center justify-center shadow-neo-sm z-10">
                                        <span className="font-black text-base sm:text-lg text-dark">3</span>
                                    </div>

                                    <div className="hidden md:block w-5/12 text-right">
                                        <div className="neo-card p-5 sm:p-6">
                                            <h3 className="font-black text-lg sm:text-xl text-dark uppercase">Global Ambassador</h3>
                                            <p className="mt-2 text-sm text-slate-600 font-medium">Expanded influence by becoming an ambassador for global organizations like IELTA Indonesia, HundrEDorg, and Pearson (GSE), focusing on creating educational programs for teachers and learners worldwide.</p>
                                        </div>
                                    </div>
                                    {/* Desktop Marker */}
                                    <div className="hidden md:flex absolute left-1/2 w-12 h-12 bg-white border-4 border-dark rounded-none -translate-x-1/2 items-center justify-center shadow-neo-sm">
                                        <span className="font-black text-lg text-dark">3</span>
                                    </div>

                                    <div className="ml-14 sm:ml-16 md:hidden w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)]">
                                        <div className="neo-card p-5 sm:p-6">
                                            <h3 className="font-black text-lg sm:text-xl text-dark uppercase">Global Ambassador</h3>
                                            <p className="mt-2 text-sm text-slate-600 font-medium">Expanded influence by becoming an ambassador for global organizations like IELTA Indonesia, HundrEDorg, and Pearson (GSE), focusing on creating educational programs for teachers and learners worldwide.</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-5/12"></div>
                                </div>

                                {/* Timeline Item 4 */}
                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                                    {/* Mobile Marker */}
                                    <div className="md:hidden absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-highlight border-4 border-dark flex items-center justify-center shadow-neo-sm z-10">
                                        <span className="font-black text-base sm:text-lg text-dark">4</span>
                                    </div>

                                    <div className="hidden md:block w-5/12"></div>
                                    {/* Desktop Marker */}
                                    <div className="hidden md:flex absolute left-1/2 w-12 h-12 bg-highlight border-4 border-dark rounded-none -translate-x-1/2 items-center justify-center shadow-neo-sm">
                                        <span className="font-black text-lg text-dark">4</span>
                                    </div>

                                    <div className="ml-14 sm:ml-16 md:ml-0 md:w-5/12 w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)]">
                                        <div className="neo-card p-5 sm:p-6 bg-slate-50">
                                            <h3 className="font-black text-lg sm:text-xl text-dark uppercase">EdTech Consultant & Founder</h3>
                                            <p className="mt-2 text-sm text-slate-600 font-medium">Now works independently, leveraging extensive experience to provide expert teaching and EdTech consulting. Continues to innovate as the founder of the MOOC Guru platform.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section id="expertise" className="py-16 sm:py-24 fade-in-section">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-dark uppercase">Core Pillars of Practice</h2>
                            <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 font-medium bg-white neo-card p-4">
                                My expertise is built on three interconnected pillars that form a synergistic "innovation flywheel" - a cycle of identifying problems, developing tech-based solutions, and sharing the results.
                            </p>
                        </div>

                        <div className="mt-12 max-w-5xl mx-auto">
                            {/* Tabs */}
                            <div className="border-b-4 border-dark pb-0">
                                <nav className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 relative z-10 bottom-[-4px]" aria-label="Tabs">
                                    <button id="tab-btn-1" className="tab-btn tab-active w-full sm:w-auto px-4 sm:px-6 py-3 bg-white text-sm md:text-base">Language Teaching</button>
                                    <button id="tab-btn-2" className="tab-btn tab-inactive w-full sm:w-auto px-4 sm:px-6 py-3 bg-white text-sm md:text-base">Educator Empowerment</button>
                                    <button id="tab-btn-3" className="tab-btn tab-inactive w-full sm:w-auto px-4 sm:px-6 py-3 bg-white text-sm md:text-base">EdTech Innovation</button>
                                </nav>
                            </div>

                            <div id="tab-content" className="neo-card bg-white p-5 sm:p-10 relative z-0 mt-0">
                                {/* Tab Panel 1 */}
                                <div id="tab-panel-1" className="tab-panel">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-black uppercase text-dark mb-4 tracking-tight">The Art of Pedagogy</h3>
                                            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-4">My philosophy is deeply student-centered, focusing on creating dynamic, interactive, and personalized learning experiences. I specialize in high-stakes contexts like Business and Academic English, where learners require targeted, real-world language skills.</p>
                                            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">A key element of my pedagogy is the use of the Global Scale of English (GSE). I use it as a "mirror" to reflect on my teaching, leading to purposeful lesson planning where activities are precisely matched to a student's specific proficiency level.</p>
                                        </div>
                                        <div className="bg-slate-50 border-3 border-dark p-5 sm:p-6 shadow-neo-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 border-b-2 border-dark pb-3">
                                                <i className="fa-solid fa-magnifying-glass text-accent text-xl hidden sm:block"></i>
                                                <h4 className="font-black text-lg sm:text-xl text-dark uppercase">Case Study: Intervention</h4>
                                            </div>
                                            <div className="space-y-4 text-sm md:text-base">
                                                <p className="font-medium text-slate-700"><span className="font-bold text-dark bg-highlight px-2 border border-dark mr-2 inline-block mb-1 sm:mb-0">Profile</span>Business English student with disparate skills - speaking at GSE 55 and writing at GSE 45.</p>
                                                <p className="font-medium text-slate-700"><span className="font-bold text-white bg-dark px-2 border border-dark mr-2 inline-block mb-1 sm:mb-0">Approach</span>Used complex mock interview questions to challenge speaking, while providing guided sentence frames to support writing.</p>
                                                <p className="font-medium text-slate-700"><span className="font-bold text-white bg-accent px-2 border border-dark mr-2 inline-block mb-1 sm:mb-0">Outcome</span>Targeted intervention led to faster, more confident progress in both skills.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tab Panel 2 */}
                                <div id="tab-panel-2" className="tab-panel hidden">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-black uppercase text-dark mb-4 tracking-tight">Leader in TEFL/TESOL</h3>
                                            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-4">I extend my impact beyond my own students by actively empowering fellow educators. My experience in academic leadership provides deep insights into curriculum design and effective mentorship, which I now apply in my independent consulting work.</p>
                                            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">Through my writing and workshops, I share practical frameworks and facilitate peer mentoring, aiming to equip my peers with modern tools and methodologies to elevate the practice of the entire community.</p>
                                        </div>
                                        <div className="bg-slate-50 border-3 border-dark p-5 sm:p-6 shadow-neo-sm">
                                            <div className="flex items-center gap-3 mb-4 border-b-2 border-dark pb-3">
                                                <i className="fa-solid fa-users text-accent text-xl hidden sm:block"></i>
                                                <h4 className="font-black text-lg sm:text-xl text-dark uppercase">Community Highlights</h4>
                                            </div>
                                            <ul className="space-y-3 font-medium text-slate-700 text-sm sm:text-base">
                                                <li className="flex items-start"><i className="fa-solid fa-square text-xs text-dark mt-1.5 mr-3"></i> Developed professional development on innovative educator programs.</li>
                                                <li className="flex items-start"><i className="fa-solid fa-square text-xs text-dark mt-1.5 mr-3"></i> Authored articles for leading educational platforms.</li>
                                                <li className="flex items-start"><i className="fa-solid fa-square text-xs text-dark mt-1.5 mr-3"></i> Active panelist for British Council and Trinity College London.</li>
                                                <li className="flex items-start"><i className="fa-solid fa-square text-xs text-dark mt-1.5 mr-3"></i> Facilitator of teachers' communities passionate about OER.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Tab Panel 3 */}
                                <div id="tab-panel-3" className="tab-panel hidden">
                                    <div className="text-center max-w-3xl mx-auto py-6">
                                        <i className="fa-solid fa-microchip text-4xl sm:text-5xl text-dark mb-6"></i>
                                        <h3 className="text-2xl sm:text-3xl font-black uppercase text-dark mb-4 tracking-tight">The Vanguard of EdTech</h3>
                                        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6">I stand at the forefront of educational technology, not as a passive adopter but as a critical and creative practitioner. My approach is to leverage technology to actively shape and enhance the learning process, using AI tools for manipulation and creation rather than just information retrieval.</p>
                                        <a href="#projects" className="neo-btn inline-block bg-highlight text-dark px-6 sm:px-8 py-3 text-base sm:text-lg mt-2">
                                            Explore Projects <i className="fa-solid fa-arrow-down ml-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-16 sm:py-24 bg-dark text-white fade-in-section">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase inline-block bg-accent px-4 sm:px-6 py-2 border-3 border-white shadow-[4px_4px_0px_0px_#ffffff] sm:shadow-[6px_6px_0px_0px_#ffffff]">Key Projects & Initiatives</h2>
                            <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-medium">From founding platforms to academic research and practical applications, these projects demonstrate my commitment to solving real-world teaching challenges.</p>
                        </div>

                        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Project 1 */}
                            <a href="https://moocguru.com" target="_blank" className="neo-btn group bg-white text-dark block p-6 sm:p-8 relative overflow-hidden h-full flex flex-col border-white shadow-[6px_6px_0px_0px_#FACC15] hover:shadow-[8px_8px_0px_0px_#FACC15]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">MOOC Guru Platform</h3>
                                <p className="font-medium text-slate-600 flex-grow normal-case text-sm sm:text-base">Created a comprehensive online platform providing Open CPD, free English courses, and professional development resources for a global community.</p>
                                <div className="mt-6 font-black text-accent text-xs sm:text-sm flex items-center justify-between border-t-2 border-slate-100 pt-4">
                                    <span>LAUNCH PROJECT</span>
                                    <i className="fa-solid fa-arrow-right project-link-icon text-base sm:text-lg"></i>
                                </div>
                            </a>

                            {/* Project 2 - UPDATED GEMINI GEM LINK */}
                            <a href="https://gemini.google.com/gem/1a5eibgbWWQS8vKOJykciPNurPc_x34sr" target="_blank" className="neo-btn group bg-white text-dark block p-6 sm:p-8 relative overflow-hidden h-full flex flex-col border-white shadow-[6px_6px_0px_0px_#0D9488] hover:shadow-[8px_8px_0px_0px_#0D9488]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">Gemini Gem for ELT</h3>
                                <p className="font-medium text-slate-600 flex-grow normal-case text-sm sm:text-base">Created a specialized Gemini Gem to assist educators in writing authentic, personalized lesson materials that align with communicative teaching principles.</p>
                                <div className="mt-6 font-black text-accent text-xs sm:text-sm flex items-center justify-between border-t-2 border-slate-100 pt-4">
                                    <span>LAUNCH PROJECT</span>
                                    <i className="fa-solid fa-arrow-right project-link-icon text-base sm:text-lg"></i>
                                </div>
                            </a>

                            {/* Project 3 */}
                            <a href="https://fajarudinakbar.online/static-to-app" target="_blank" className="neo-btn group bg-white text-dark block p-6 sm:p-8 relative overflow-hidden h-full flex flex-col border-white shadow-[6px_6px_0px_0px_#ffffff] hover:shadow-[8px_8px_0px_0px_#ffffff]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3 flex flex-wrap items-center gap-1">Static <i className="fa-solid fa-arrow-right-long text-slate-400"></i> Interactive</h3>
                                <p className="font-medium text-slate-600 flex-grow normal-case text-sm sm:text-base">Transformed traditional materials into dynamic experiences using AI. Highlighted as a "standout project" by edCommunity.</p>
                                <div className="mt-6 font-black text-accent text-xs sm:text-sm flex items-center justify-between border-t-2 border-slate-100 pt-4">
                                    <span>VIEW DETAILS</span>
                                    <i className="fa-solid fa-arrow-right project-link-icon text-base sm:text-lg"></i>
                                </div>
                            </a>

                            {/* Project 4 */}
                            <a href="https://fajarudinakbar.online/genai-and-gse" target="_blank" className="neo-btn group bg-white text-dark block p-6 sm:p-8 relative overflow-hidden h-full flex flex-col border-white shadow-[6px_6px_0px_0px_#ffffff] hover:shadow-[8px_8px_0px_0px_#ffffff]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">GenAI & GSE Guide</h3>
                                <p className="font-medium text-slate-600 flex-grow normal-case text-sm sm:text-base">An interactive guide on using the GSE framework to create effective prompts for generative AI in lesson planning.</p>
                                <div className="mt-6 font-black text-accent text-xs sm:text-sm flex items-center justify-between border-t-2 border-slate-100 pt-4">
                                    <span>READ GUIDE</span>
                                    <i className="fa-solid fa-arrow-right project-link-icon text-base sm:text-lg"></i>
                                </div>
                            </a>

                            {/* Project 5 */}
                            <a href="https://fajarudinakbar.online/fyp-framework" target="_blank" className="neo-btn group bg-white text-dark block p-6 sm:p-8 relative overflow-hidden h-full flex flex-col border-white shadow-[6px_6px_0px_0px_#0D9488] hover:shadow-[8px_8px_0px_0px_#0D9488]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">The FYP Framework</h3>
                                <p className="font-medium text-slate-600 flex-grow normal-case text-sm sm:text-base">A practical framework for educators to Find, Personalize, and Plan lessons using modern EdTech tools and pedagogical strategies.</p>
                                <div className="mt-6 font-black text-accent text-xs sm:text-sm flex items-center justify-between border-t-2 border-slate-100 pt-4">
                                    <span>VIEW FRAMEWORK</span>
                                    <i className="fa-solid fa-arrow-right project-link-icon text-base sm:text-lg"></i>
                                </div>
                            </a>

                            {/* Project 6 */}
                            <a href="https://fajarudinakbar.online/handson-genai" target="_blank" className="neo-btn group bg-highlight text-dark block p-6 sm:p-8 relative overflow-hidden h-full flex flex-col border-white shadow-[6px_6px_0px_0px_#FACC15] hover:shadow-[8px_8px_0px_0px_#FACC15]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">Hands-On GenAI</h3>
                                <p className="font-medium text-slate-800 flex-grow normal-case text-sm sm:text-base">A practical framework and guide for educators to leverage generative AI, presented for Trinity College London.</p>
                                <div className="mt-6 font-black text-dark text-xs sm:text-sm flex items-center justify-between border-t-2 border-dark pt-4">
                                    <span>ACCESS WORKSHOP</span>
                                    <i className="fa-solid fa-bolt project-link-icon text-base sm:text-lg"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Impact & Recognition Section */}
                <section id="impact" className="py-16 sm:py-24 fade-in-section">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12">
                            {/* Impact Quotes */}
                            <div className="lg:w-1/3">
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-dark uppercase mb-6 sm:mb-8">Impact & Proof</h2>
                                <div className="space-y-6">
                                    <div className="neo-card p-5 sm:p-6 bg-white relative">
                                        <i className="fa-solid fa-quote-left text-accent text-xl sm:text-2xl mb-2"></i>
                                        <p className="text-sm sm:text-base text-slate-700 font-medium italic leading-relaxed">"An active member... reimagining what's possible in the classroom by using AI and interactive tools to create dynamic, student-centered learning experiences."</p>
                                        <p className="mt-4 font-black text-dark uppercase text-xs sm:text-sm border-t-2 border-slate-100 pt-3">edCommunity Spotlight</p>
                                    </div>
                                    <div className="neo-card p-5 sm:p-6 bg-white relative">
                                        <i className="fa-solid fa-quote-left text-accent text-xl sm:text-2xl mb-2"></i>
                                        <p className="text-sm sm:text-base text-slate-700 font-medium italic leading-relaxed">"An exceptional educator and an inspiring academic and business English teacher."</p>
                                        <p className="mt-4 font-black text-dark uppercase text-xs sm:text-sm border-t-2 border-slate-100 pt-3">Cathoven AI TechTeach</p>
                                    </div>
                                </div>
                            </div>

                            {/* Global Recognition */}
                            <div className="lg:w-2/3">
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-dark uppercase mb-6 sm:mb-8">Global Recognition</h2>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="neo-card p-5 sm:p-6 bg-white flex flex-col h-full">
                                        <h3 className="text-lg sm:text-xl font-black uppercase text-dark mb-3 border-b-2 border-dark pb-2">OPEN US Program Lead</h3>
                                        <p className="font-medium text-slate-600 flex-grow text-xs sm:text-sm">MOOC Camp Facilitator and Community Lead for the U.S. Department of State's OPEN Program, mentoring Indonesian English teachers.</p>
                                        <a href="https://www.youtube.com/watch?v=5R4GUxjkcC8&feature=youtu.be" target="_blank" className="mt-4 inline-block font-black text-accent text-xs sm:text-sm uppercase hover:underline">View Alumni Highlight <i className="fa-solid fa-play ml-1"></i></a>
                                    </div>

                                    <div className="neo-card p-5 sm:p-6 bg-white flex flex-col h-full">
                                        <h3 className="text-lg sm:text-xl font-black uppercase text-dark mb-3 border-b-2 border-dark pb-2">British Council Contributor</h3>
                                        <p className="font-medium text-slate-600 flex-grow text-xs sm:text-sm">Contributing to the global ELT community by speaking at webinars, conferences, and podcasts on EdTech and AI frameworks.</p>
                                        <a href="https://www.youtube.com/live/hgtw9qk4RqA" target="_blank" className="mt-4 inline-block font-black text-accent text-xs sm:text-sm uppercase hover:underline">View Recorded Session <i className="fa-solid fa-play ml-1"></i></a>
                                    </div>

                                    <a href="https://www.pearson.com/languages/why-pearson/the-global-scale-of-english/gse-ambassadors.html" target="_blank" className="neo-btn bg-highlight p-5 sm:p-6 flex flex-col sm:col-span-2 group cursor-pointer text-dark hover:bg-yellow-400">
                                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">GSE Ambassador for Pearson</h3>
                                        <p className="font-medium text-slate-800 normal-case text-sm sm:text-base">Advocating for and training educators on the Global Scale of English framework through articles and workshops to improve pedagogical precision.</p>
                                        <div className="mt-4 font-black text-dark text-xs sm:text-sm uppercase text-right">
                                            See Profile <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-2"></i>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Presentations Section */}
                <section id="presentations" className="py-16 sm:py-24 fade-in-section">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-dark uppercase">International Presentations</h2>
                            <p className="mt-4 text-base sm:text-lg font-medium text-slate-600">A selection of my talks and webinars shared with a global audience.</p>
                        </div>

                        <div className="neo-card bg-white p-2 sm:p-4 border-3 sm:border-4">
                            <div className="video-container border-2 border-dark bg-dark">
                                <iframe src="https://www.youtube.com/embed/videoseries?list=PL9a2kUfbEt5sQ9ASDoAjDMLfiojAMU0Kn" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16 sm:py-24 fade-in-section">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="neo-card bg-accent text-white p-6 sm:p-10 md:p-16 relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 sm:mb-6 text-white" style={{ textShadow: '2px 2px 0 #0f172a, 3px 3px 0 #0f172a' }}>Let's Collaborate</h2>
                                <p className="mt-4 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium text-slate-100 bg-dark/20 p-4 border-2 border-dark/30">
                                    I am always open to new opportunities, collaborations, and conversations. Whether you're a potential student, a fellow educator, or an institution looking to innovate, I'd love to connect.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                                    <a href="https://facebook.com/mrfajarudinakbar" target="_blank" className="neo-btn w-full sm:w-auto bg-white text-dark px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-slate-100">
                                        <i className="fa-brands fa-facebook text-xl text-[#1877F2]"></i> Connect on Facebook
                                    </a>
                                    <a href="https://linkedin.com/in/fajarudinakbar" target="_blank" className="neo-btn w-full sm:w-auto bg-white text-dark px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-slate-100">
                                        <i className="fa-brands fa-linkedin text-xl text-[#0A66C2]"></i> Connect on LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-10 sm:py-12 bg-dark text-white border-t-8 border-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <a className='inline-block bg-highlight neo-btn px-4 sm:px-6 py-3 sm:py-4 text-dark hover:bg-white cursor-pointer group max-w-full' href='https://fajarudinakbar.online/teaching-english-innovatively-ai' target='_blank'>
                        <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-tight uppercase flex flex-wrap items-center justify-center gap-2 sm:gap-3 m-0">
                            Teaching English Innovatively with AI
                            <span className="text-accent hidden sm:inline">|</span>
                            <span className="block sm:inline w-full sm:w-auto text-sm sm:text-xl md:text-2xl">Fajarudin Akbar</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-sm sm:text-base ml-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block"></i>
                        </h2>
                    </a>
                    <p className="font-bold text-slate-400 mt-6 sm:mt-8 text-xs sm:text-sm uppercase tracking-wider">
                        &copy;{new Date().getFullYear()} Fajarudin Akbar. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* Back to top button */}
            <button id="back-to-top" className="neo-btn hidden fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-highlight text-dark w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-white z-50" aria-label="Back to top">
                <i className="fa-solid fa-arrow-up text-lg sm:text-xl font-black"></i>
            </button>

            {/* AI Feature Popup Modal */}
            <div id="ai-popup" className="fixed inset-0 z-[100] flex items-center justify-center p-4 hidden opacity-0 transition-opacity duration-300">
                {/* Backdrop */}
                <div id="ai-popup-backdrop" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"></div>

                {/* Modal Content */}
                <div className="relative w-full max-w-md bg-white border-4 border-dark shadow-neo p-8 transform transition-transform duration-300 scale-95 origin-center z-10" id="ai-popup-content">
                    {/* Close Button */}
                    <button id="ai-popup-close" className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center border-4 border-dark bg-white text-dark hover:bg-highlight transition-colors shadow-neo-sm focus:outline-none" aria-label="Close popup">
                        <i className="fa-solid fa-xmark text-xl font-black"></i>
                    </button>

                    {/* Content */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-accent border-4 border-dark flex items-center justify-center mb-6 shadow-neo-sm transform -rotate-3">
                            <i className="fa-solid fa-microchip text-3xl text-white"></i>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-dark mb-4">Innovate with AI</h3>
                        <p className="text-slate-600 font-medium mb-8 text-sm sm:text-base leading-relaxed">
                            Discover practical frameworks to integrate Generative AI into your English language teaching. Authentic tasks, visible outcomes, and communicative principles.
                        </p>
                        <a className='neo-btn w-full bg-highlight text-dark px-6 py-4 text-base font-black uppercase flex items-center justify-center gap-3 hover:bg-yellow-400' href='https://fajarudinakbar.online/teaching-english-innovatively-ai' target='_blank'>
                            Explore the Guide <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>


        </>
    )
}

export default App
