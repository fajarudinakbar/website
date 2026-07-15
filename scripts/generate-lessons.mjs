import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const lessonsRoot = join(projectRoot, 'src/listLesson')
const outputFile = join(projectRoot, 'src/generated/lessons.ts')

const walkFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name === '.git') return []
  const absolutePath = join(directory, entry.name)
  return entry.isDirectory() ? walkFiles(absolutePath) : [absolutePath]
})

const toPosixPath = (path) => path.split(sep).join('/')
const toPublicUrl = (relativePath) => relativePath === 'index.html'
  ? '/uncategorized/index.html'
  : `/${relativePath.split('/').map(encodeURIComponent).join('/')}`

const lessons = walkFiles(lessonsRoot)
  .filter((file) => extname(file).toLowerCase() === '.html')
  .map((file) => {
    const relativePath = toPosixPath(relative(lessonsRoot, file))
    const pathParts = relativePath.split('/')
    return {
      category: pathParts.length === 1 ? 'Uncategorized' : pathParts[0],
      fileName: pathParts.at(-1) ?? relativePath,
      modifiedAt: statSync(file).mtimeMs,
      relativePath,
      url: toPublicUrl(relativePath),
    }
  })

if (lessons.length === 0) {
  console.warn('No lesson HTML files found; keeping the existing generated manifest.')
  process.exit(0)
}

const source = `export type LessonManifestItem = {
  category: string
  fileName: string
  modifiedAt: number
  relativePath: string
  url: string
}

const lessons: LessonManifestItem[] = ${JSON.stringify(lessons, null, 2)}

export default lessons
`

mkdirSync(resolve(outputFile, '..'), { recursive: true })
writeFileSync(outputFile, source)
console.log(`Generated ${lessons.length} lessons in src/generated/lessons.ts`)
