import type { ProgramVideo } from './api'

export interface VideoEmbed {
  type: 'youtube' | 'vimeo' | 'file' | 'link'
  /** iframe src (youtube/vimeo) or the direct file/link URL */
  src: string
  original: string
}

/** Turn a stored video (uploaded file or pasted link) into something playable. */
export function resolveVideo(v: ProgramVideo): VideoEmbed {
  const url = (v.url ?? '').trim()
  if (v.kind === 'file') return { type: 'file', src: url, original: url }

  // YouTube: watch?v=, youtu.be/, embed/, shorts/
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { type: 'youtube', src: `https://www.youtube.com/embed/${yt[1]}`, original: url }

  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return { type: 'vimeo', src: `https://player.vimeo.com/video/${vm[1]}`, original: url }

  return { type: 'link', src: url, original: url }
}
