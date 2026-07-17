declare module 'virtual:lessons' {
  export type LessonManifestItem = {
    category: string
    fileName: string
    modifiedAt: number
    relativePath: string
    url: string
  }

  const lessons: LessonManifestItem[]
  export default lessons
}
