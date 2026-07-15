export const lessonCatalogColors = {
  accordion: ['#FACC15', '#5EEAD4', '#93C5FD', '#FDA4AF', '#C4B5FD', '#86EFAC'],
  border: '#0F172A',
  controls: '#FFFFFF',
  lessonHover: '#F8FAFC',
} as const

export const lessonPageSizes = [5, 10, 20, 30, 100, 'all'] as const

export const lessonSortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'A to Z' },
] as const
