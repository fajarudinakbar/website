import { createReadStream, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const lessonsRoot = resolve(__dirname, 'src/listLesson')
const virtualLessonsId = 'virtual:lessons'
const resolvedVirtualLessonsId = `\0${virtualLessonsId}`

const walkFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name === '.git') return []
  const absolutePath = join(directory, entry.name)
  return entry.isDirectory() ? walkFiles(absolutePath) : [absolutePath]
})

const toPosixPath = (path: string) => path.split(sep).join('/')

const injectTailwindStylesheet = (html: string, stylesheetUrl: string) => {
  const stylesheet = `<link rel="stylesheet" href="${stylesheetUrl}" data-local-tailwind>`
  return html.includes('</head>') ? html.replace('</head>', ` ${stylesheet}\n</head>`) : `${stylesheet}\n${html}`
}

const extractTitle = (html: string): string => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match ? match[1].trim() : ''
}

const lessonsPlugin = (): Plugin => ({
  name: 'lessons-catalog',
  resolveId(id) {
    if (id === virtualLessonsId) return resolvedVirtualLessonsId
  },
  load(id) {
    if (id !== resolvedVirtualLessonsId) return
    const lessons = walkFiles(lessonsRoot)
      .filter((file) => extname(file).toLowerCase() === '.html')
      .map((file) => {
        const relativePath = toPosixPath(relative(lessonsRoot, file))
        const pathParts = relativePath.split('/')
        const html = readFileSync(file, 'utf8')
        const title = extractTitle(html)
        return {
          category: pathParts.length === 1 ? 'Uncategorized' : pathParts[0],
          fileName: pathParts.at(-1) ?? relativePath,
          modifiedAt: statSync(file).mtimeMs,
          relativePath,
          title,
          url: relativePath === 'index.html'
            ? '/uncategorized/index.html'
            : `/${relativePath.split('/').map(encodeURIComponent).join('/')}`,
        }
      })
    return `export default ${JSON.stringify(lessons)}`
  },
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const publicPath = decodeURIComponent((request.url ?? '/').split('?')[0]).replace(/^\/+/, '')
      const requestedPath = publicPath === 'uncategorized/index.html' ? 'index.html' : publicPath
      const absolutePath = resolve(lessonsRoot, requestedPath)
      if (absolutePath !== join(lessonsRoot, 'index.html') && !absolutePath.startsWith(`${lessonsRoot}${sep}`)) return next()
      try {
        const stats = statSync(absolutePath)
        if (!stats.isFile()) return next()
        const extension = extname(absolutePath).toLowerCase()
        const contentType = extension === '.html'
          ? 'text/html; charset=utf-8'
          : extension === '.wav'
          ? 'audio/wav'
          : 'application/octet-stream'
        response.setHeader('Content-Type', contentType)
        if (extension === '.html') {
          response.end(injectTailwindStylesheet(readFileSync(absolutePath, 'utf8'), '/src/index.css'))
        } else {
          createReadStream(absolutePath).pipe(response)
        }
      } catch {
        next()
      }
    })
  },
  generateBundle(_options, bundle) {
    const stylesheet = Object.values(bundle).find((output) => output.type === 'asset' && output.fileName.endsWith('.css'))
    const stylesheetUrl = stylesheet ? `/${stylesheet.fileName}` : '/src/index.css'
    walkFiles(lessonsRoot).forEach((file) => {
      const relativePath = toPosixPath(relative(lessonsRoot, file))
      const extension = extname(file).toLowerCase()
      const source = extension === '.html'
        ? injectTailwindStylesheet(readFileSync(file, 'utf8'), stylesheetUrl)
        : readFileSync(file)
      this.emitFile({
        type: 'asset',
        fileName: relativePath === 'index.html' ? 'uncategorized/index.html' : relativePath,
        source,
      })
    })
  },
})

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  plugins: [react(), tailwindcss(), lessonsPlugin()],
})
