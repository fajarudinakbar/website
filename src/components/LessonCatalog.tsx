import { useEffect, useMemo, useState } from 'react'
import lessons, { type LessonManifestItem } from 'virtual:lessons'
import { lessonCatalogColors, lessonPageSizes, lessonSortOptions } from '../config/lessonCatalog'

type SortOption = (typeof lessonSortOptions)[number]['value']
type PageSize = (typeof lessonPageSizes)[number]

const BORDER = '2px solid #0F172A'
const SHADOW = '3px 3px 0px #0F172A'
const SHADOW_SM = '2px 2px 0px #0F172A'

const formatName = (name: string) =>
  name
    .replace(/\.html$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getTotalPages = (total: number, size: PageSize) =>
  size === 'all' ? 1 : Math.max(1, Math.ceil(total / size))

const getPageNumbers = (totalPages: number, currentPage: number) =>
  Array.from(
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
    <nav className="flex flex-wrap justify-end items-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{ border: BORDER, boxShadow: currentPage === 1 ? 'none' : SHADOW_SM }}
        className="cursor-pointer bg-white px-3 py-2 text-xs font-black uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true"></i> PREV
      </button>
      {pages.map((page, index) => (
        <span key={page} className="contents">
          {index > 0 && pages[index - 1] !== page - 1 && <span className="font-black px-1">...</span>}
          <button
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            style={{
              border: BORDER,
              boxShadow: page === currentPage ? 'none' : SHADOW_SM,
              backgroundColor: page === currentPage ? lessonCatalogColors.accordion[0] : '#FFFFFF',
              transform: page === currentPage ? 'translate(2px,2px)' : undefined,
            }}
            className="cursor-pointer min-w-10 h-10 font-black uppercase text-sm"
          >
            {page}
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{ border: BORDER, boxShadow: currentPage === totalPages ? 'none' : SHADOW_SM }}
        className="cursor-pointer bg-white px-3 py-2 text-xs font-black uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        NEXT <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
      </button>
    </nav>
  )
}

const PageSizeSelect = ({ value, onChange }: { value: PageSize; onChange: (size: PageSize) => void }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-black uppercase">Show Data</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value === 'all' ? 'all' : Number(event.target.value) as PageSize)}
      style={{ border: BORDER, boxShadow: SHADOW_SM }}
      className="w-full sm:w-32 bg-white px-4 py-2 font-black uppercase text-sm outline-none"
    >
      {lessonPageSizes.map((size) => <option key={size} value={size}>{size === 'all' ? 'ALL' : size}</option>)}
    </select>
  </label>
)

const CategoryLessons = ({ category, items, accentColor }: { category: string; items: LessonManifestItem[]; accentColor: string }) => {
  const [sort, setSort] = useState<SortOption>('newest')
  const [pageSize, setPageSize] = useState<PageSize>(5)
  const [currentPage, setCurrentPage] = useState(1)

  const sortedItems = useMemo(
    () =>
      [...items].sort((first, second) => {
        if (sort === 'newest') return second.modifiedAt - first.modifiedAt
        if (sort === 'oldest') return first.modifiedAt - second.modifiedAt
        return first.fileName.localeCompare(second.fileName, undefined, { sensitivity: 'base' })
      }),
    [items, sort],
  )

  const totalPages = getTotalPages(sortedItems.length, pageSize)
  const visibleItems = pageSize === 'all' ? sortedItems : sortedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [sort, pageSize, items])
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <div className="space-y-4 p-4" style={{ backgroundColor: '#F8FAFC' }}>
      <p className="text-xs font-black uppercase">{items.length} LESSONS IN THIS CATEGORY</p>
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase">Sort Lessons</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            style={{ border: BORDER, boxShadow: SHADOW_SM, backgroundColor: '#FFFFFF' }}
            className="w-full sm:w-40 px-4 py-2 font-black uppercase text-sm outline-none"
          >
            {lessonSortOptions.map((option) => <option key={option.value} value={option.value}>{option.label.toUpperCase()}</option>)}
          </select>
        </label>
        <PageSizeSelect value={pageSize} onChange={setPageSize} />
      </div>
      <div className="space-y-3">
        {visibleItems.map((lesson) => (
          <div
            key={lesson.url}
            style={{ border: BORDER, boxShadow: SHADOW, backgroundColor: '#FFFFFF' }}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p className="font-black uppercase text-sm">{lesson.title || formatName(lesson.fileName)}</p>
              {category !== 'Uncategorized' && (
                <p className="text-xs font-bold mt-1" style={{ color: '#475569' }}>{lesson.relativePath}</p>
              )}
            </div>
            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ border: BORDER, boxShadow: SHADOW_SM, backgroundColor: accentColor }}
              className="px-4 py-2 text-xs font-black uppercase shrink-0 text-center"
            >
              SHOW LESSON
            </a>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} onChange={setCurrentPage} totalPages={totalPages} />
    </div>
  )
}

const LessonCatalog = () => {
  const [query, setQuery] = useState('')
  const [categoryPageSize, setCategoryPageSize] = useState<PageSize>(5)
  const [categoryPage, setCategoryPage] = useState(1)

  const categories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase().replace(/[-_]+/g, ' ')
    const groups = new Map<string, LessonManifestItem[]>()
    lessons.forEach((lesson) => {
      const categoryMatches = lesson.category.toLocaleLowerCase().includes(normalizedQuery)
      const fileMatches = lesson.fileName.toLocaleLowerCase().replace(/[-_]+/g, ' ').includes(normalizedQuery)
      const titleMatches = lesson.title.toLocaleLowerCase().replace(/[-_]+/g, ' ').includes(normalizedQuery)
      if (normalizedQuery && !categoryMatches && !fileMatches && !titleMatches) return
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
  const visibleCategories =
    categoryPageSize === 'all'
      ? categories
      : categories.slice((categoryPage - 1) * categoryPageSize, categoryPage * categoryPageSize)

  useEffect(() => setCategoryPage(1), [query, categoryPageSize])
  useEffect(() => {
    if (categoryPage > totalCategoryPages) setCategoryPage(totalCategoryPages)
  }, [categoryPage, totalCategoryPages])

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: lessonCatalogColors.accordion[0] }}>LEARNING REPOSITORY</p>
        <h1 className="text-4xl font-black mt-1 uppercase">Explore English Lessons</h1>
        <p className="mt-2 font-bold" style={{ color: '#1E293B' }}>
          Search and browse {lessons.length} interactive lesson files by category.
        </p>
      </header>

      <div className="relative">
        <label className="sr-only" htmlFor="lesson-search">Search lessons</label>
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#0F172A' }} aria-hidden="true"></i>
        <input
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="SEARCH BY LESSON TITLE, CATEGORY, OR FILE NAME..."
          style={{
            border: BORDER,
            boxShadow: SHADOW,
            backgroundColor: '#FFFFFF',
          }}
          className="w-full pl-11 pr-4 py-3 font-black uppercase text-sm outline-none placeholder:text-dark"
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm font-black uppercase">{categories.length} CATEGORIES FOUND</p>
        <p className="text-sm font-black uppercase">PAGE {categoryPage} OF {totalCategoryPages}</p>
      </div>

      <div className="mt-4 space-y-4">
        {visibleCategories.map(([category, categoryLessons], categoryIndex) => {
          const accentColor = lessonCatalogColors.accordion[categoryIndex % lessonCatalogColors.accordion.length]
          return (
            <details
              key={category}
              style={{ border: BORDER, boxShadow: SHADOW }}
            >
              <summary
                style={{ backgroundColor: accentColor }}
                className="flex items-center justify-between px-4 py-3 cursor-pointer list-none"
              >
                <span className="font-black uppercase">{formatName(category)}</span>
                <div className="flex items-center gap-3">
                  <span
                    style={{ border: BORDER, backgroundColor: '#FFFFFF' }}
                    className="px-2 py-0.5 text-xs font-black uppercase"
                  >
                    {categoryLessons.length}
                  </span>
                  <span className="text-xs font-black uppercase">OPEN DETAILS</span>
                </div>
              </summary>
              <CategoryLessons category={category} items={categoryLessons} accentColor={accentColor} />
            </details>
          )
        })}
        {categories.length === 0 && (
          <div
            style={{ border: BORDER, boxShadow: SHADOW, backgroundColor: lessonCatalogColors.accordion[2] }}
            className="p-8 text-center"
          >
            <h3 className="text-xl font-black uppercase">NO LESSONS FOUND</h3>
            <p className="mt-2 font-bold uppercase">Try another lesson name or category.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
        <PageSizeSelect value={categoryPageSize} onChange={setCategoryPageSize} />
        <Pagination currentPage={categoryPage} onChange={setCategoryPage} totalPages={totalCategoryPages} />
      </div>
    </main>
  )
}

export default LessonCatalog
