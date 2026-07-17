import { useEffect, useMemo, useState } from 'react'
import lessons, { type LessonManifestItem } from 'virtual:lessons'
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
    <nav className="flex flex-wrap justify-end items-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="neo-btn cursor-pointer bg-white px-3 py-2 text-xs uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true"></i> Previous
      </button>

      {pages.map((page, index) => (
        <span key={page} className="contents">
          {index > 0 && pages[index - 1] !== page - 1 && <span className="font-black px-1">...</span>}
          <button
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`cursor-pointer border-3 border-dark min-w-10 h-10 font-black ${page === currentPage ? 'bg-highlight shadow-neo-sm' : 'bg-white'}`}
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
  <label className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs font-black uppercase">
    Show data
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
  const [sort, setSort] = useState('newest')
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  const sortedItems = useMemo(() => [...items].sort((first, second) => {
    if (sort === 'newest') return second.modifiedAt - first.modifiedAt
    if (sort === 'oldest') return first.modifiedAt - second.modifiedAt
    return first.fileName.localeCompare(second.fileName, undefined, { sensitivity: 'base' })
  }), [items, sort])

  const totalPages = getTotalPages(sortedItems.length, pageSize)
  const visibleItems = pageSize === 'all' ? sortedItems : sortedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [sort, pageSize, items])
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <div className="p-4 border-t-3 border-dark">
      <p className="text-xs font-bold uppercase mb-4">{items.length} lessons in this category</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs font-black uppercase">
          Sort lessons
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

      <div className="flex flex-col gap-3">
        {visibleItems.map((lesson) => (
          <div key={lesson.relativePath} className="border-3 border-dark p-4 bg-white hover:bg-lessonHover transition-colors">
            <h3 className="font-black text-lg mb-1">{lesson.title || formatName(lesson.fileName)}</h3>
            {category !== 'Uncategorized' && (
              <p className="text-xs text-gray-500 mb-3 font-mono">{lesson.relativePath}</p>
            )}
            <a
              href={lesson.url}
              className="neo-btn inline-block px-4 py-2 text-xs font-black uppercase border-3 border-dark bg-highlight hover:shadow-neo-sm transition-shadow"
            >
              Show Lesson
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Pagination currentPage={currentPage} onChange={setCurrentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}

const LessonCatalog = () => {
  const [query, setQuery] = useState('')
  const [categoryPageSize, setCategoryPageSize] = useState(5)
  const [categoryPage, setCategoryPage] = useState(1)

  const categories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const groups = new Map<string, LessonManifestItem[]>()

    lessons.forEach((lesson) => {
      const categoryMatches = lesson.category.toLocaleLowerCase().includes(normalizedQuery)
      const fileMatches = lesson.fileName.toLocaleLowerCase().includes(normalizedQuery)
      const titleMatches = lesson.title.toLocaleLowerCase().includes(normalizedQuery)
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
  const visibleCategories = categoryPageSize === 'all' ? categories : categories.slice((categoryPage - 1) * categoryPageSize, categoryPage * categoryPageSize)

  useEffect(() => setCategoryPage(1), [query, categoryPageSize])
  useEffect(() => {
    if (categoryPage > totalCategoryPages) setCategoryPage(totalCategoryPages)
  }, [categoryPage, totalCategoryPages])

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-black uppercase tracking-widest mb-2">Learning Repository</p>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Explore English Lessons</h2>
        <p className="text-sm font-bold">Search and browse {lessons.length} interactive lesson files by category.</p>
      </header>

      <div className="border-3 border-dark p-4 mb-6 bg-white">
        <label className="block text-xs font-black uppercase mb-2">Search lessons</label>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by lesson or category..."
            className="w-full border-3 border-dark bg-white pl-11 pr-4 py-3 font-bold outline-none focus:ring-4 focus:ring-highlight/60"
          />
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t-3 border-dark">
          <span className="text-xs font-black uppercase">{categories.length} categories found</span>
          <span className="text-xs font-black uppercase">Category page {categoryPage} of {totalCategoryPages}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visibleCategories.map(([category, categoryLessons], categoryIndex) => (
          <details key={category} className={`border-3 border-dark ${categoryIndex > 0 ? '' : ''}`}>
            <summary className="flex items-center justify-between p-4 cursor-pointer font-black uppercase text-lg" style={{ backgroundColor: lessonCatalogColors.accordion[categoryIndex % lessonCatalogColors.accordion.length] }}>
              <span className="flex items-center gap-3">
                <i className="fa-solid fa-folder" aria-hidden="true"></i>
                {formatName(category)}
              </span>
              <span className="flex items-center gap-3">
                <span className="border-3 border-dark bg-white px-2 py-0.5 text-sm">{categoryLessons.length}</span>
                <span className="text-xs">Open Details <i className="fa-solid fa-chevron-down"></i></span>
              </span>
            </summary>
            <CategoryLessons category={category} items={categoryLessons} />
          </details>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="border-3 border-dark p-8 text-center bg-white">
          <h3 className="font-black text-xl mb-2">No lessons found</h3>
          <p className="text-sm">Try another lesson name or category.</p>
        </div>
      )}

      <div className="mt-6">
        <PageSizeSelect value={categoryPageSize} onChange={setCategoryPageSize} />
        <div className="mt-4">
          <Pagination currentPage={categoryPage} onChange={setCategoryPage} totalPages={totalCategoryPages} />
        </div>
      </div>
    </div>
  )
}

export default LessonCatalog
