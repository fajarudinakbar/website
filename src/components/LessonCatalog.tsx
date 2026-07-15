import { useEffect, useMemo, useState } from 'react'
import lessons, { type LessonManifestItem } from '../generated/lessons'
import { lessonCatalogColors, lessonPageSizes, lessonSortOptions } from '../config/lessonCatalog'

type SortOption = (typeof lessonSortOptions)[number]['value']
type PageSize = (typeof lessonPageSizes)[number]

const formatName = (name: string) => name
  .replace(/\.html$/i, '')
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getTotalPages = (total: number, size: PageSize) => size === 'all' ? 1 : Math.max(1, Math.ceil(total / size))

const getPageNumbers = (totalPages: number, currentPage: number) => Array.from(
  { length: totalPages },
  (_, index) => index + 1,
).filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)

type PaginationProps = {
  currentPage: number
  onChange: (page: number) => void
  totalPages: number
}

const Pagination = ({ currentPage, onChange, totalPages }: PaginationProps) => {
  if (totalPages <= 1) return null
  const pages = getPageNumbers(totalPages, currentPage)

  return (
    <nav className="flex flex-wrap justify-center items-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="neo-btn bg-white px-3 py-2 text-xs uppercase disabled:opacity-40 disabled:pointer-events-none"
      >
        <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true"></i> Previous
      </button>

      {pages.map((page, index) => (
        <span key={page} className="contents">
          {index > 0 && pages[index - 1] !== page - 1 && <span className="font-black px-1">…</span>}
          <button
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`border-3 border-dark min-w-10 h-10 font-black ${page === currentPage ? 'bg-highlight shadow-neo-sm' : 'bg-white'}`}
          >
            {page}
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="neo-btn bg-white px-3 py-2 text-xs uppercase disabled:opacity-40 disabled:pointer-events-none"
      >
        Next <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
      </button>
    </nav>
  )
}

const PageSizeSelect = ({ value, onChange }: { value: PageSize; onChange: (size: PageSize) => void }) => (
  <label className="block">
    <span className="block text-xs font-black uppercase tracking-wider text-dark mb-2">Show data</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value === 'all' ? 'all' : Number(event.target.value) as PageSize)}
      className="w-full sm:w-32 border-3 border-dark bg-white px-4 py-3 font-black uppercase text-sm outline-none focus:ring-4 focus:ring-highlight/60"
    >
      {lessonPageSizes.map((size) => <option key={size} value={size}>{size === 'all' ? 'All' : size}</option>)}
    </select>
  </label>
)

const CategoryLessons = ({ category, items }: { category: string; items: LessonManifestItem[] }) => {
  const [sort, setSort] = useState<SortOption>('newest')
  const [pageSize, setPageSize] = useState<PageSize>(5)
  const [currentPage, setCurrentPage] = useState(1)

  const sortedItems = useMemo(() => [...items].sort((first, second) => {
    if (sort === 'newest') return second.modifiedAt - first.modifiedAt
    if (sort === 'oldest') return first.modifiedAt - second.modifiedAt
    return first.fileName.localeCompare(second.fileName, undefined, { sensitivity: 'base' })
  }), [items, sort])

  const totalPages = getTotalPages(sortedItems.length, pageSize)
  const visibleItems = pageSize === 'all'
    ? sortedItems
    : sortedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [sort, pageSize, items])
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <div className="border-x-3 border-b-3 border-dark bg-white p-3 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 items-end pb-5 mb-5 border-b-2 border-slate-200">
        <p className="font-black text-sm uppercase text-slate-600">
          {items.length} lessons in this category
        </p>

        <label className="block">
          <span className="block text-xs font-black uppercase tracking-wider text-dark mb-2">Sort lessons</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="w-full sm:w-40 border-3 border-dark bg-white px-4 py-3 font-black uppercase text-sm outline-none focus:ring-4 focus:ring-highlight/60"
          >
            {lessonSortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <PageSizeSelect value={pageSize} onChange={setPageSize} />
      </div>

      <div className="space-y-3">
        {visibleItems.map((lesson) => (
          <article
            key={lesson.relativePath}
            className="border-2 border-dark p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:-translate-y-0.5 transition-transform"
            style={{ backgroundColor: lessonCatalogColors.lessonHover }}
          >
            <div className="min-w-0">
              <h3 className="font-black text-dark break-words">{formatName(lesson.fileName)}</h3>
              {category !== 'Uncategorized' && (
                <p className="text-xs text-slate-500 font-bold mt-1 break-all">{lesson.relativePath}</p>
              )}
            </div>
            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn shrink-0 inline-flex items-center justify-center gap-2 bg-white text-dark px-4 py-2 text-xs uppercase"
            >
              Show Lesson <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Pagination currentPage={currentPage} onChange={setCurrentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}

const LessonCatalog = () => {
  const [query, setQuery] = useState('')
  const [categoryPageSize, setCategoryPageSize] = useState<PageSize>(5)
  const [categoryPage, setCategoryPage] = useState(1)

  const categories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const groups = new Map<string, LessonManifestItem[]>()

    lessons.forEach((lesson) => {
      const categoryMatches = lesson.category.toLocaleLowerCase().includes(normalizedQuery)
      const fileMatches = lesson.fileName.toLocaleLowerCase().includes(normalizedQuery)
      if (normalizedQuery && !categoryMatches && !fileMatches) return
      const categoryItems = groups.get(lesson.category) ?? []
      categoryItems.push(lesson)
      groups.set(lesson.category, categoryItems)
    })

    return [...groups.entries()].sort(([first], [second]) => {
      if (first === 'Uncategorized') return 1
      if (second === 'Uncategorized') return -1
      return first.localeCompare(second, undefined, { sensitivity: 'base' })
    })
  }, [query])

  const totalCategoryPages = getTotalPages(categories.length, categoryPageSize)
  const visibleCategories = categoryPageSize === 'all'
    ? categories
    : categories.slice((categoryPage - 1) * categoryPageSize, categoryPage * categoryPageSize)

  useEffect(() => setCategoryPage(1), [query, categoryPageSize])
  useEffect(() => {
    if (categoryPage > totalCategoryPages) setCategoryPage(totalCategoryPages)
  }, [categoryPage, totalCategoryPages])

  return (
    <section className="pb-16 sm:pb-24" aria-labelledby="lesson-catalog-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-block bg-accent text-white border-3 border-dark px-4 py-2 font-black uppercase text-xs shadow-neo-sm mb-5">Learning Repository</span>
          <h2 id="lesson-catalog-title" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-dark">Explore English Lessons</h2>
          <p className="mt-4 text-slate-600 font-medium">Search and browse {lessons.length} interactive lesson files by category.</p>
        </div>

        <div className="neo-card p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
            <label className="block">
              <span className="block text-xs font-black uppercase tracking-wider text-dark mb-2">Search lessons</span>
              <span className="relative block">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true"></i>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by lesson or category..."
                  className="w-full border-3 border-dark bg-white pl-11 pr-4 py-3 font-bold outline-none focus:ring-4 focus:ring-highlight/60"
                />
              </span>
            </label>
            <PageSizeSelect value={categoryPageSize} onChange={setCategoryPageSize} />
          </div>

          <div className="mt-5 pt-4 border-t-2 border-slate-200 flex flex-wrap justify-between gap-2 text-xs font-black uppercase tracking-wider text-slate-600">
            <span>{categories.length} categories found</span>
            <span>Category page {categoryPage} of {totalCategoryPages}</span>
          </div>
        </div>

        <div className="space-y-5">
          {visibleCategories.map(([category, categoryLessons], categoryIndex) => (
            <details key={category} className="lesson-accordion group" open={query.trim().length > 0}>
              <summary
                className="cursor-pointer list-none border-3 border-dark shadow-neo-sm px-4 sm:px-6 py-4 flex items-center justify-between gap-4"
                style={{ backgroundColor: lessonCatalogColors.accordion[categoryIndex % lessonCatalogColors.accordion.length] }}
              >
                <span className="min-w-0 flex items-center gap-3">
                  <i className="fa-solid fa-folder-open text-xl" aria-hidden="true"></i>
                  <span className="font-black uppercase tracking-tight truncate">{formatName(category)}</span>
                  <span className="shrink-0 bg-white border-2 border-dark px-2 py-0.5 text-xs font-black">{categoryLessons.length}</span>
                </span>
                <span className="shrink-0 flex items-center gap-2 text-xs sm:text-sm font-black uppercase">
                  <span className="hidden sm:inline">Open Details</span>
                  <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" aria-hidden="true"></i>
                </span>
              </summary>
              <CategoryLessons category={category} items={categoryLessons} />
            </details>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="neo-card p-8 sm:p-12 text-center bg-white">
            <i className="fa-solid fa-file-circle-xmark text-4xl text-slate-400 mb-4" aria-hidden="true"></i>
            <h3 className="text-xl font-black uppercase text-dark">No lessons found</h3>
            <p className="mt-2 text-slate-600 font-medium">Try another lesson name or category.</p>
          </div>
        )}

        <div className="mt-10">
          <Pagination currentPage={categoryPage} onChange={setCategoryPage} totalPages={totalCategoryPages} />
        </div>
      </div>
    </section>
  )
}

export default LessonCatalog
