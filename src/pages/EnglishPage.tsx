import LessonCatalog from '../components/LessonCatalog'

const EnglishPage = () => {
  const currentUrl = new URL(window.location.href)
  if (!currentUrl.pathname.endsWith('/')) currentUrl.pathname += '/'
  const homeUrl = new URL('../', currentUrl).toString()

  return (
    <>
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
          <li>
            <a href={homeUrl} className="inline-flex items-center gap-2 text-slate-600 hover:text-accent transition-colors">
              <i className="fa-solid fa-house" aria-hidden="true"></i>
              Home
            </a>
          </li>
          <li className="text-slate-400" aria-hidden="true">/</li>
          <li className="text-dark" aria-current="page">English</li>
        </ol>
      </nav>

      <section id="home" className="py-16 sm:py-20 md:py-32 overflow-hidden px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block relative mb-8">
            <img
              src="https://raw.githubusercontent.com/fajarudinakbar/Images/refs/heads/main/Fajarudin%20Akbar.png"
              alt="Foto profil Fajarudin Akbar"
              className="w-32 h-32 md:w-44 md:h-44 rounded-full mx-auto neo-card p-1 object-cover"
            />
            <div
              className="absolute -bottom-3 -right-3 bg-highlight border-3 border-dark rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-neo-sm">
              <i className="fa-solid fa-graduation-cap text-lg md:text-xl text-dark"></i>
            </div>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-dark mb-6 uppercase wrap-break-words">
            Fajarudin Akbar
          </h1>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            <span
              className="bg-white text-dark border-2 border-dark px-3 py-1.5 sm:px-4 font-bold uppercase text-xs md:text-sm shadow-neo-sm">English
              Language Teacher</span>
            <span
              className="bg-white text-dark border-2 border-dark px-3 py-1.5 sm:px-4 font-bold uppercase text-xs md:text-sm shadow-neo-sm">TEFL/TESOL
              Educator</span>
            <span
              className="bg-accent text-white border-2 border-dark px-3 py-1.5 sm:px-4 font-bold uppercase text-xs md:text-sm shadow-neo-sm">EdTech
              Practitioner</span>
          </div>

          <p
            className="mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl font-medium text-slate-700 bg-white border-3 border-dark p-4 sm:p-6 shadow-neo">
            This page serves as a repository for my digital lessons, open educational resources (OER), and EdTech
            projects.
          </p>

        </div>
      </section>

      <LessonCatalog />

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="neo-card bg-teal-600 text-white p-6 sm:p-10 md:p-16 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 sm:mb-6 text-white">Let's Collaborate</h2>
              <p
                className="mt-4 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium text-slate-100 bg-dark/20 p-4 border-2 border-dark/30">
                I am always open to new opportunities, collaborations, and conversations. Whether you're a
                potential student, a fellow educator, or an institution looking to innovate, I'd love to
                connect.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                <a href="https://facebook.com/mrfajarudinakbar" target="_blank"
                  className="neo-btn w-full sm:w-auto bg-white text-dark px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-slate-100">
                  <i className="fa-brands fa-facebook text-xl text-[#1877F2]"></i> Connect on Facebook
                </a>
                <a href="https://linkedin.com/in/fajarudinakbar" target="_blank"
                  className="neo-btn w-full sm:w-auto bg-white text-dark px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-slate-100">
                  <i className="fa-brands fa-linkedin text-xl text-[#0A66C2]"></i> Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="mt-12 pt-8 border-t-4 border-dark text-center mb-6">
        <p
          className="text-dark text-xl md:text-2xl font-black uppercase tracking-wider bg-[#facc15] inline-block px-4 py-2 border-3 border-dark shadow-neo-sm">
          Designed by <a href="https://fajarudinakbar.online" target="_blank"
            className="underline hover:text-teal-700 transition-colors">fajarudinakbar.online</a>
        </p>
      </footer>

      <a
        href="/kursus"
        className="exclusive-class-float neo-btn fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 inline-flex items-center gap-3 bg-highlight text-dark px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wide hover:bg-white"
        aria-label="Open Exclusive English Class page"
      >
        <i className="fa-solid fa-graduation-cap text-lg" aria-hidden="true"></i>
        <span>Exclusive English Class</span>
        <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </a>
    </>
  )
}

export default EnglishPage
