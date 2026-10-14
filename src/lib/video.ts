import type { ProgramVideo } from './api'

export interface VideoEmbed {
  type: 'youtube' | 'vimeo' | 'instagram' | 'facebook' | 'file' | 'link'
  /** iframe src (youtube/vimeo/instagram/facebook) or the direct file/link URL */
  src: string
  /** Portrait players (reels/shorts) look best in a 9:16 frame */
  portrait: boolean
  original: string
}

/** Turn a stored video or reel (uploaded file or pasted link) into something playable. */
export function resolveVideo(v: ProgramVideo): VideoEmbed {
  const url = (v.url ?? '').trim()
  if (v.kind === 'file') return { type: 'file', src: url, portrait: false, original: url }

  // YouTube — watch?v=, youtu.be/, embed/, and Shorts (portrait)
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) {
    const isShort = /shorts\//.test(url)
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${yt[1]}`,
      portrait: isShort,
      original: url,
    }
  }

  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) {
    return { type: 'vimeo', src: `https://player.vimeo.com/video/${vm[1]}`, portrait: false, original: url }
  }

  // Instagram reels / posts / tv — embed via the /embed endpoint (portrait)
  const ig = url.match(/instagram\.com\/(?:reels?|p|tv)\/([\w-]+)/)
  if (ig) {
    return {
      type: 'instagram',
      src: `https://www.instagram.com/p/${ig[1]}/embed`,
      portrait: true,
      original: url,
    }
  }

  // Facebook reels / videos / watch — use the official video plugin (portrait for reels)
  if (/facebook\.com\/.+|fb\.watch\//.test(url)) {
    const isReel = /\/reel\//.test(url)
    return {
      type: 'facebook',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
      portrait: isReel,
      original: url,
    }
  }

  return { type: 'link', src: url, portrait: false, original: url }
}
