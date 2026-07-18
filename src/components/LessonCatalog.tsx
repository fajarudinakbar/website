import { useEffect, useMemo, useState } from 'react'
import lessons, { type LessonManifestItem } from 'virtual:lessons'
import { lessonCatalogColors, lessonPageSizes, lessonSortOptions } from '../config/lessonCatalog'

type SortOption = (typeof lessonSortOptions)[number]['value']
type PageSize = (typeof lessonPageSizes)[number]

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
        className="neo-btn cursor-pointer bg-white px-3 py-2 text-xs uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true"></i>
        Previous
      </button>
      {pages.map((page, index) => (
        <span key={page} className="contents">
          {index > 0 && pages[index - 1] !== page - 1 && <span className="font-black px-1">...</span>}
          <button
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`cursor-pointer border-3 border-dark min-w-10 h-10 font-black ${
              page === currentPage ? 'bg-highlight shadow-neo-sm' : 'bg-white'
            }`}
          >
            {page}
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="neo-btn cursor-pointer bg-white px-3 py-2 text-xs uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
      </button>
    </nav>
  )
}

const PageSizeSelect = ({ value, onChange }: { value: PageSize; onChange: (size: PageSize) => void }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-black uppercase">Show data</span>
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
    <div>
      <p>{items.length} lessons in this category</p>
      <div>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase">Sort lessons</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="w-full sm:w-40 border-3 border-dark bg-white px-4 py-3 font-black uppercase text-sm outline-none focus:ring-4 focus:ring-highlight/60"
          >
            {lessonSortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <PageSizeSelect value={pageSize} onChange={(size) => { setPageSize(size); setCurrentPage(1) }} />
      </div>
      <div>
        {visibleItems.map((lesson) => (
          <div key={lesson.url}>
            <h3>{lesson.title || formatName(lesson.fileName)}</h3>
            {category !== 'Uncategorized' && (
              <p>{lesson.relativePath}</p>
            )}
            <a href={lesson.url}>Show Lesson</a>
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
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-highlight">Learning Repository</p>
        <h1 className="text-4xl font-black mt-1">Explore English Lessons</h1>
        <p className="mt-2 text-dark/70">
          Search and browse {lessons.length} interactive lesson files by category.
        </p>
      </header>
      <div className="mt-6 relative">
        <label className="sr-only" htmlFor="lesson-search">Search lessons</label>
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" aria-hidden="true"></i>
        <input
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by lesson or category..."
          className="w-full border-3 border-dark bg-white pl-11 pr-4 py-3 font-bold outline-none focus:ring-4 focus:ring-highlight/60"
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm font-bold">{categories.length} categories found</p>
        <p className="text-sm">Category page {categoryPage} of {totalCategoryPages}</p>
      </div>
      <div className="mt-4 space-y-4">
        {visibleCategories.map(([category, categoryLessons], categoryIndex) => (
          <details
            key={category}
            className={`border-3 border-dark ${lessonCatalogColors[categoryIndex % lessonCatalogColors.length] ?? ''}`}
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer font-black text-lg">
              {formatName(category)}
              <span className="ml-2 text-sm font-bold">{categoryLessons.length}</span>
              <span className="ml-auto text-xs uppercase">Open Details</span>
            </summary>
            <div className="p-4 border-t-3 border-dark">
              <CategoryLessons category={category} items={categoryLessons} />
            </div>
          </details>
        ))}
        {categories.length === 0 && (
          <div className="p-8 text-center border-3 border-dark">
            <h3 className="text-xl font-black">No lessons found</h3>
            <p className="mt-2">Try another lesson name or category.</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
        <PageSizeSelect value={categoryPageSize} onChange={(size) => { setCategoryPageSize(size); setCategoryPage(1) }} />
        <Pagination currentPage={categoryPage} onChange={setCategoryPage} totalPages={totalCategoryPages} />
      </div>
    </main>
  )
}

export default LessonCatalog
