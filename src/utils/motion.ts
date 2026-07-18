import type { CSSProperties } from 'react'

export type MotionDirection =
  | 'from-left'
  | 'from-right'
  | 'from-top'
  | 'from-bottom'
  | 'project'

type MotionStyle = CSSProperties & {
  '--motion-delay'?: string
}

export const statMotionDirections: MotionDirection[] = [
  'from-left',
  'from-bottom',
  'from-top',
  'from-right',
]

export function motionClass(
  baseClass: string,
  inView: boolean,
  direction: MotionDirection
) {
  return `${baseClass} motion-card motion-${direction}${inView ? ' in-view' : ''}`
}

export function motionStyle(index: number, step = 90, maxDelay = 900): MotionStyle {
  return {
    '--motion-delay': `${Math.min(index * step, maxDelay)}ms`,
  }
}
