import { useEffect, useState } from 'react'

const CoursePage = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Exclusive English Class with Fajarudin Akbar'

    const revealElements = document.querySelectorAll('.course-page .reveal')
    const revealOnScroll = () => {
      revealElements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight - 100) {
          element.classList.add('active')
        }
      })
    }

    const linkedInScript = document.createElement('script')
    linkedInScript.src = 'https://platform.linkedin.com/badges/js/profile.js'
    linkedInScript.async = true
    linkedInScript.defer = true
    document.body.appendChild(linkedInScript)

    window.addEventListener('scroll', revealOnScroll)
    revealOnScroll()

    return () => {
      window.removeEventListener('scroll', revealOnScroll)
      linkedInScript.remove()
    }
  }, [])

  useEffect(() => {
    const menu = document.getElementById('course-mobile-menu')
    if (menuOpen) {
      menu?.classList.remove('hidden')
      requestAnimationFrame(() => menu?.classList.add('open'))
      return
    }

    menu?.classList.remove('open')
    const timer = window.setTimeout(() => menu?.classList.add('hidden'), 300)
    return () => window.clearTimeout(timer)
  }, [menuOpen])

  return (
    <div className="course-page selection:bg-comic-yellow selection:text-slate-900">
      
      
          {/*  Navigation  */}
          <nav className="fixed w-full z-50 bg-white border-b-4 border-slate-900 shadow-comic transition-all duration-300 top-0">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-20">
                      {/*  Brand  */}
                      <div className="flex-shrink-0 flex items-center cursor-pointer">
                          <a href="#" className="font-comic text-2xl md:text-3xl text-slate-900 tracking-widest uppercase"
                              style={{ textShadow: '2px 2px 0 #FACC15' }}>
                              Fajarudin<span className="text-comic-blue">Akbar</span>
                          </a>
                      </div>
      
                      {/*  Desktop Menu  */}
                      <div className="hidden md:flex space-x-4 items-center">
                          <a href="#philosophy" className="nav-link text-slate-800 px-4 py-2 rounded-lg text-sm">Methodology</a>
                          <a href="#about" className="nav-link text-slate-800 px-4 py-2 rounded-lg text-sm">Profile</a>
                          <a href="#programs" className="nav-link text-slate-800 px-4 py-2 rounded-lg text-sm">Programs</a>
                          <a href="#contact"
                              className="comic-btn bg-comic-indigo text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-500">
                              Contact
                          </a>
                      </div>
      
                      {/*  Mobile Menu Button  */}
                      <div className="md:hidden flex items-center">
                          <button id="course-mobile-menu-btn" onClick={() => setMenuOpen((open) => !open)}
                              className={`comic-btn ${menuOpen ? 'bg-comic-yellow' : 'bg-white'} p-2 rounded-lg text-slate-900 focus:outline-none`}
                              aria-label="Toggle Menu">
                              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl w-6 h-6 flex items-center justify-center`}></i>
                          </button>
                      </div>
                  </div>
              </div>
      
              {/*  Mobile Menu Panel  */}
              <div id="course-mobile-menu" className="md:hidden bg-white border-t-4 border-slate-900 shadow-xl absolute w-full left-0">
                  <div className="px-4 pt-4 pb-6 space-y-3">
                      <a href="#philosophy"
                          className="block text-slate-900 bg-slate-100 border-4 border-slate-900 px-4 py-3 rounded-xl text-lg font-black uppercase text-center hover:bg-comic-yellow transition-colors shadow-comic-sm mobile-link" onClick={() => setMenuOpen(false)}>Methodology</a>
                      <a href="#about"
                          className="block text-slate-900 bg-slate-100 border-4 border-slate-900 px-4 py-3 rounded-xl text-lg font-black uppercase text-center hover:bg-comic-yellow transition-colors shadow-comic-sm mobile-link" onClick={() => setMenuOpen(false)}>Profile</a>
                      <a href="#programs"
                          className="block text-slate-900 bg-slate-100 border-4 border-slate-900 px-4 py-3 rounded-xl text-lg font-black uppercase text-center hover:bg-comic-yellow transition-colors shadow-comic-sm mobile-link" onClick={() => setMenuOpen(false)}>Programs</a>
                      <a href="#contact"
                          className="block bg-comic-indigo text-white border-4 border-slate-900 px-4 py-3 rounded-xl text-lg font-black uppercase text-center hover:bg-indigo-500 transition-colors shadow-comic-sm mobile-link" onClick={() => setMenuOpen(false)}>Book
                          Consultation</a>
                  </div>
              </div>
          </nav>
      
          <main>
              {/*  Hero Section: Comic Impact  */}
              <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
                  {/*  Decorative Background Elements  */}
                  <div className="absolute top-20 right-10 text-comic-yellow opacity-40 hidden lg:block z-0">
                      <i className="fa-solid fa-burst text-9xl"></i>
                  </div>
      
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0 relative z-10">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center reveal active">
      
                          {/*  Mobile Image  */}
                          <div className="lg:hidden flex justify-center mb-4">
                              <div className="relative group">
                                  <img src="https://raw.githubusercontent.com/fajarudinakbar/Images/refs/heads/main/Fajarudin%20Akbar.png"
                                      alt="Professor Fajarudin Akbar"
                                      className="w-48 h-48 rounded-full object-cover comic-panel bg-white p-2" />
                                  <div
                                      className="absolute -bottom-2 -right-2 bg-comic-yellow comic-panel rounded-full w-12 h-12 flex items-center justify-center z-20">
                                      <i className="fa-solid fa-graduation-cap text-xl text-slate-900"></i>
                                  </div>
                              </div>
                          </div>
      
                          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                              <span
                                  className="inline-block bg-comic-yellow text-slate-900 border-4 border-slate-900 px-4 py-2 rounded-full font-black uppercase text-sm shadow-comic-sm">
                                  Private English Course
                              </span>
      
                              <h1 className="font-comic text-6xl sm:text-7xl md:text-8xl tracking-wider text-slate-900 leading-none"
                                  style={{ textShadow: '4px 4px 0 #fff, 8px 8px 0 #3B82F6' }}>
                                  USE ENGLISH,<br />
                                  <span className="text-comic-indigo">GO GLOBAL.</span>
                              </h1>
      
                              <p
                                  className="text-lg md:text-xl font-bold text-slate-800 bg-white comic-panel p-5 rounded-2xl max-w-lg mx-auto lg:mx-0">
                                  Lebih dari sekadar hafalan <span
                                      className="bg-comic-yellow px-1 border-2 border-slate-900 rounded">vocabulary</span>. Kami
                                  membangun confidence dan cross-cultural understanding. Belajar langsung dari praktisi yang
                                  diakui internasional.
                              </p>
      
                              <div className="flex flex-col sm:flex-row items-center lg:items-center gap-4 md:gap-6 pt-4">
                                  <a href="#contact"
                                      className="comic-btn bg-comic-red text-white px-8 py-4 rounded-xl text-lg w-full sm:w-auto text-center hover:bg-red-500 flex items-center justify-center gap-2">
                                      <i className="fa-solid fa-bolt"></i> Book Consultation
                                  </a>
                                  <div
                                      className="comic-panel bg-white px-6 py-3 rounded-xl w-full sm:w-auto flex items-center justify-center gap-3">
                                      <span className="font-black text-slate-500 uppercase">Rate:</span>
                                      <span className="font-comic text-2xl tracking-wide text-slate-900">Rp100ribu<span
                                              className="text-sm font-sans font-bold">/jam</span></span>
                                  </div>
                              </div>
                          </div>
      
                          {/*  Desktop Visual  */}
                          <div className="hidden lg:flex justify-center relative">
                              <div className="relative group">
                                  {/*  Background comic burst  */}
                                  <div
                                      className="absolute inset-0 bg-comic-yellow rounded-full transform -translate-x-4 translate-y-4 scale-105 border-4 border-slate-900 shadow-comic opacity-50 transition-transform group-hover:-translate-x-6 group-hover:translate-y-6">
                                  </div>
      
                                  <img src="https://raw.githubusercontent.com/fajarudinakbar/Images/refs/heads/main/Fajarudin%20Akbar.png"
                                      alt="Professor Fajarudin Akbar"
                                      className="relative z-10 w-80 h-80 object-cover rounded-full comic-panel bg-white p-3 transform group-hover:scale-105 transition-transform duration-500" />
      
                                  <div
                                      className="absolute top-10 -right-4 bg-comic-blue comic-panel rounded-full w-20 h-20 flex items-center justify-center z-20">
                                      <i className="fa-solid fa-globe text-3xl text-white"></i>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
      
              {/*  Philosophy: Comic Grid  */}
              <section id="philosophy" className="py-16 md:py-24">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center mb-16 reveal relative inline-block w-full">
                          <h2
                              className="font-comic text-5xl md:text-6xl text-slate-900 tracking-wider inline-block bg-white px-8 py-3 border-4 border-slate-900 shadow-comic">
                              The Direct Approach
                          </h2>
                          <p
                              className="mt-8 max-w-2xl mx-auto text-xl font-bold text-slate-700 bg-comic-yellow p-4 border-4 border-slate-900 shadow-comic-sm rounded-xl">
                              Fokus pada measurable progress. Pembelajaran didesain secara efisien, personalized, dan
                              result-oriented.
                          </p>
                      </div>
      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                          {/*  Item 1  */}
                          <div
                              className="comic-panel bg-blue-50 p-8 rounded-2xl relative transform hover:-translate-y-2 transition-transform duration-300 reveal">
                              <div
                                  className="absolute -top-6 -left-6 bg-comic-blue border-4 border-slate-900 rounded-full w-14 h-14 flex items-center justify-center shadow-comic-sm">
                                  <i className="fa-solid fa-users text-white text-2xl"></i>
                              </div>
                              <h3 className="font-comic text-3xl tracking-wide text-slate-900 mb-4 mt-2">Direct Mentorship</h3>
                              <p className="text-slate-800 font-bold leading-relaxed text-lg">
                                  Interaksi langsung dengan mentor profesional tanpa administrative barriers. In-depth
                                  discussion, constructive feedback, dan bimbingan intensif.
                              </p>
                          </div>
      
                          {/*  Item 2  */}
                          <div
                              className="comic-panel bg-rose-50 p-8 rounded-2xl relative transform hover:-translate-y-2 transition-transform duration-300 reveal">
                              <div
                                  className="absolute -top-6 left-1/2 -ml-7 bg-comic-red border-4 border-slate-900 rounded-full w-14 h-14 flex items-center justify-center shadow-comic-sm">
                                  <i className="fa-solid fa-sliders text-white text-2xl"></i>
                              </div>
                              <h3 className="font-comic text-3xl tracking-wide text-slate-900 mb-4 mt-2 text-center md:text-left">
                                  Adaptive Curriculum</h3>
                              <p className="text-slate-800 font-bold leading-relaxed text-lg text-center md:text-left">
                                  Materi 100% tailor-made. Silabus disesuaikan sepenuhnya dengan career goals atau academic
                                  needs Anda.
                              </p>
                          </div>
      
                          {/*  Item 3  */}
                          <div
                              className="comic-panel bg-emerald-50 p-8 rounded-2xl relative transform hover:-translate-y-2 transition-transform duration-300 reveal">
                              <div
                                  className="absolute -top-6 -right-6 bg-comic-emerald border-4 border-slate-900 rounded-full w-14 h-14 flex items-center justify-center shadow-comic-sm">
                                  <i className="fa-solid fa-earth-americas text-slate-900 text-2xl"></i>
                              </div>
                              <h3 className="font-comic text-3xl tracking-wide text-slate-900 mb-4 mt-2 text-right md:text-left">
                                  Global Standards</h3>
                              <p className="text-slate-800 font-bold leading-relaxed text-lg text-right md:text-left">
                                  Metodologi berbasis international standards (TESOL & TEFL) untuk menjamin language
                                  competence Anda diakui secara global.
                              </p>
                          </div>
                      </div>
                  </div>
              </section>
      
              {/*  Profile Section  */}
              <section id="about" className="py-16 md:py-24 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900 -z-10 h-full w-full opacity-5"></div>
      
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center reveal">
      
                          {/*  LinkedIn Badge in Comic Frame  */}
                          <div className="order-2 lg:order-1 w-full flex justify-center lg:justify-start">
                              <div className="comic-panel bg-white p-4 rounded-2xl">
                                  <div className="bg-slate-50 border-4 border-slate-900 rounded-xl overflow-hidden">
                                      
                                      <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="large"
                                          data-theme="light" data-type="HORIZONTAL" data-vanity="fajarudinakbar"
                                          data-version="v1">
                                          <a className="badge-base__link LI-simple-link"
                                              href="https://id.linkedin.com/in/fajarudinakbar?trk=profile-badge"></a>
                                      </div>
                                  </div>
                              </div>
                          </div>
      
                          {/*  Text  */}
                          <div className="order-1 lg:order-2 text-center lg:text-left">
                              <h2 className="font-comic text-5xl md:text-6xl text-slate-900 tracking-wider mb-4 uppercase"
                                  style={{ textShadow: '2px 2px 0 #10B981' }}>Language Meets Tech</h2>
      
                              <div
                                  className="inline-block bg-comic-yellow border-4 border-slate-900 px-4 py-2 shadow-comic-sm mb-6">
                                  <p className="text-slate-900 text-xl font-black uppercase">Call me Teacher Fajar!</p>
                              </div>
      
                              <p
                                  className="text-slate-800 font-bold text-lg leading-relaxed mb-8 bg-white comic-panel p-6 rounded-2xl">
                                  Saya menggabungkan structured teaching methods dengan latest technology. Fokus utama saya
                                  adalah membantu career acceleration dan capaian akademik Anda. Bersertifikat internasional
                                  dan aktif di forum global, saya memastikan materi pembelajaran yang relevan, aplikatif, dan
                                  berstandar tinggi.
                              </p>
      
                              <div
                                  className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10 text-left bg-indigo-50 comic-panel p-6 rounded-2xl">
                                  <div className="flex items-center gap-3">
                                      <i
                                          className="fa-solid fa-circle-check text-comic-blue text-xl border-2 border-slate-900 rounded-full bg-white"></i>
                                      <span className="text-slate-900 font-black uppercase">Certified Educator</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <i
                                          className="fa-solid fa-circle-check text-comic-blue text-xl border-2 border-slate-900 rounded-full bg-white"></i>
                                      <span className="text-slate-900 font-black uppercase">Personalized</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <i
                                          className="fa-solid fa-circle-check text-comic-blue text-xl border-2 border-slate-900 rounded-full bg-white"></i>
                                      <span className="text-slate-900 font-black uppercase">Global Speaker</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <i
                                          className="fa-solid fa-circle-check text-comic-blue text-xl border-2 border-slate-900 rounded-full bg-white"></i>
                                      <span className="text-slate-900 font-black uppercase">Tech Integrated</span>
                                  </div>
                              </div>
      
                              <a href="https://linkedin.com/in/fajarudinakbar" target="_blank" rel="noopener noreferrer"
                                  className="comic-btn inline-block bg-comic-indigo text-white px-8 py-4 rounded-xl text-lg hover:bg-indigo-500 group">
                                  View Portfolio <i
                                      className="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                              </a>
                          </div>
                      </div>
                  </div>
              </section>
      
              {/*  Programs: Burst Cards  */}
              <section id="programs" className="py-16 md:py-24">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="mb-16 reveal text-center">
                          <span
                              className="inline-block bg-comic-blue text-white border-4 border-slate-900 px-4 py-2 rounded-full font-black uppercase text-sm shadow-comic-sm mb-4">Curriculum</span>
                          <h2 className="font-comic text-5xl md:text-6xl text-slate-900 tracking-wider block"
                              style={{ textShadow: '3px 3px 0 #fff' }}>Structured for Impact</h2>
                      </div>
      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mt-12">
      
                          {/*  Card 1  */}
                          <div
                              className="comic-panel bg-white p-8 rounded-2xl relative transform hover:-translate-y-2 transition-transform duration-300 reveal mt-8 md:mt-0">
                              <div
                                  className="absolute -top-8 left-1/2 -ml-10 w-20 h-20 bg-comic-yellow border-4 border-slate-900 rounded-full flex items-center justify-center shadow-comic-sm z-10">
                                  <span className="font-comic text-4xl text-slate-900">01</span>
                              </div>
                              <h3 className="font-comic text-3xl text-slate-900 mt-10 mb-4 text-center tracking-wide uppercase">
                                  Academic English</h3>
                              <p
                                  className="text-slate-800 font-bold text-base leading-relaxed mb-6 text-center border-b-4 border-slate-100 pb-6">
                                  Kuasai <span className="bg-yellow-100 px-1">journal writing</span>, academic essays, dan
                                  presentation skills untuk level universitas internasional.
                              </p>
                              <ul className="text-base font-black text-slate-900 space-y-3 uppercase">
                                  <li className="flex items-center gap-3"><i
                                          className="fa-solid fa-caret-right text-comic-red text-xl"></i> Thesis Writing</li>
                                  <li className="flex items-center gap-3"><i
                                          className="fa-solid fa-caret-right text-comic-red text-xl"></i> Academic Vocab</li>
                              </ul>
                          </div>
      
                          {/*  Card 2  */}
                          <div className="comic-panel bg-comic-indigo p-8 rounded-2xl relative transform hover:-translate-y-2 transition-transform duration-300 reveal md:-translate-y-4 shadow-[12px_12px_0px_0px_#0f172a] z-10 mt-8 md:mt-0"
                              style={{ transitionDelay: '100ms' }}>
                              <div
                                  className="absolute -top-8 left-1/2 -ml-10 w-20 h-20 bg-comic-red border-4 border-slate-900 rounded-full flex items-center justify-center shadow-comic-sm z-10">
                                  <span className="font-comic text-4xl text-white">02</span>
                              </div>
                              <div className="absolute top-0 right-0 p-4 opacity-20">
                                  <i className="fa-solid fa-briefcase text-8xl text-white"></i>
                              </div>
                              <h3
                                  className="font-comic text-3xl text-white mt-10 mb-4 text-center tracking-wide uppercase relative z-10">
                                  Business English</h3>
                              <p
                                  className="text-white font-bold text-base leading-relaxed mb-6 text-center border-b-4 border-indigo-400 pb-6 relative z-10">
                                  Tingkatkan negotiation skills, email correspondence, dan professional collaboration di
                                  lingkungan kerja multinasional.
                              </p>
                              <ul className="text-base font-black text-comic-yellow space-y-3 uppercase relative z-10">
                                  <li className="flex items-center gap-3"><i
                                          className="fa-solid fa-caret-right text-white text-xl"></i> Professional Email</li>
                                  <li className="flex items-center gap-3"><i
                                          className="fa-solid fa-caret-right text-white text-xl"></i> Interview Prep</li>
                              </ul>
                          </div>
      
                          {/*  Card 3  */}
                          <div className="comic-panel bg-white p-8 rounded-2xl relative transform hover:-translate-y-2 transition-transform duration-300 reveal mt-8 md:mt-0"
                              style={{ transitionDelay: '200ms' }}>
                              <div
                                  className="absolute -top-8 left-1/2 -ml-10 w-20 h-20 bg-comic-emerald border-4 border-slate-900 rounded-full flex items-center justify-center shadow-comic-sm z-10">
                                  <span className="font-comic text-4xl text-slate-900">03</span>
                              </div>
                              <h3 className="font-comic text-3xl text-slate-900 mt-10 mb-4 text-center tracking-wide uppercase">
                                  Exam Prep</h3>
                              <p
                                  className="text-slate-800 font-bold text-base leading-relaxed mb-6 text-center border-b-4 border-slate-100 pb-6">
                                  Strategi komprehensif capai target score TOEFL/IELTS. In-depth analysis pada kelemahan
                                  spesifik dan time management.
                              </p>
                              <ul className="text-base font-black text-slate-900 space-y-3 uppercase">
                                  <li className="flex items-center gap-3"><i
                                          className="fa-solid fa-caret-right text-comic-emerald text-xl"></i> Mock Tests</li>
                                  <li className="flex items-center gap-3"><i
                                          className="fa-solid fa-caret-right text-comic-emerald text-xl"></i> Scoring Strategy
                                  </li>
                              </ul>
                          </div>
      
                      </div>
                  </div>
              </section>
      
              {/*  Media Container  */}
              <section className="py-16 md:py-24">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
                      <h2
                          className="font-comic text-5xl md:text-6xl text-slate-900 tracking-wider mb-10 bg-white inline-block px-8 py-2 border-4 border-slate-900 shadow-comic">
                          International Engagement
                      </h2>
      
                      <div className="comic-panel bg-slate-900 p-2 sm:p-4 rounded-2xl">
                          <div className="video-container border-4 border-slate-900 rounded-xl overflow-hidden bg-black">
                              <iframe className="absolute top-0 left-0 w-full h-full"
                                  src="https://www.youtube.com/embed/videoseries?list=PL9a2kUfbEt5sQ9ASDoAjDMLfiojAMU0Kn"
                                  title="Fajarudin Akbar Speaking Engagements" frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen>
                              </iframe>
                          </div>
                      </div>
                  </div>
              </section>
      
              {/*  CTA Section  */}
              <section id="contact" className="py-16 md:py-24">
                  <div className="max-w-5xl mx-auto px-4 reveal">
                      <div className="bg-comic-yellow comic-panel rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                          {/*  Action lines  */}
                          <div className="absolute inset-0 opacity-10 pointer-events-none"
                              style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}>
                          </div>
      
                          <div className="relative z-10">
                              <h2 className="font-comic text-6xl md:text-7xl text-slate-900 tracking-wider mb-6"
                                  style={{ textShadow: '3px 3px 0 #fff' }}>START YOUR JOURNEY</h2>
                              <p
                                  className="mb-10 max-w-2xl mx-auto text-xl font-bold text-slate-800 bg-white p-5 border-4 border-slate-900 shadow-comic-sm rounded-2xl">
                                  <span
                                      className="bg-comic-yellow px-1 border-2 border-slate-900 rounded uppercase font-black">Free
                                      initial consultation</span> untuk memetakan level dan target Anda. Mari kita mulai
                                  langkah sukses sekarang.
                              </p>
      
                              <div className="flex flex-col sm:flex-row justify-center gap-6">
                                  <a href="http://wa.me/6282225642124" target="_blank" rel="noopener noreferrer"
                                      className="comic-btn bg-white text-slate-900 px-8 py-5 rounded-xl text-xl flex items-center justify-center gap-3 hover:bg-slate-100">
                                      <i className="fa-brands fa-whatsapp text-green-500 text-3xl"></i> Chat on WhatsApp
                                  </a>
                                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScpDn7N4ouzyJj1zK-egWxdU3ZYFiJQer7F0USumJSPr5QwTg/viewform"
                                      target="_blank" rel="noopener noreferrer"
                                      className="comic-btn bg-comic-indigo text-white px-8 py-5 rounded-xl text-xl flex items-center justify-center gap-3 hover:bg-indigo-600">
                                      <i className="fa-solid fa-pen-to-square text-2xl"></i> Enrollment Form
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          </main>
      
          {/*  Footer  */}
          <footer className="bg-slate-900 border-t-8 border-slate-900 py-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
              <div
                  className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                  <div className="text-center md:text-left">
                      <div className="inline-block bg-comic-yellow comic-panel px-4 py-2 rounded-xl mb-3">
                          <p className="font-comic text-slate-900 text-3xl tracking-widest uppercase m-0">Fajarudin Akbar</p>
                      </div>
                      <p className="text-sm tracking-wider uppercase text-slate-300 font-black">English Teacher & EdTech
                          Practitioner</p>
                      <p className="text-sm mt-4 text-slate-500 font-bold">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                  </div>
      
                  <div className="flex gap-6">
                      <a href="https://linkedin.com/in/fajarudinakbar" target="_blank" rel="noopener noreferrer"
                          className="comic-btn bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-comic-blue hover:text-white"
                          aria-label="LinkedIn">
                          <i className="fa-brands fa-linkedin text-xl"></i>
                      </a>
                      <a href="https://youtube.com/@fajarudinakbar" target="_blank" rel="noopener noreferrer"
                          className="comic-btn bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-comic-red hover:text-white"
                          aria-label="YouTube">
                          <i className="fa-brands fa-youtube text-xl"></i>
                      </a>
                      <a href="https://instagram.com/fajarudinakbar" target="_blank" rel="noopener noreferrer"
                          className="comic-btn bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-comic-yellow hover:text-slate-900"
                          aria-label="Instagram">
                          <i className="fa-brands fa-instagram text-xl"></i>
                      </a>
                  </div>
              </div>
          </footer>
      
          
    </div>
  )
}

export default CoursePage
