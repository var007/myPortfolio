import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  failed: boolean
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio render failed:', error, info)
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="portfolio-error" role="alert">
          <p className="portfolio-error-label">Portfolio unavailable</p>
          <h1>The page could not finish loading.</h1>
          <p>Refresh the page to try again. If the problem continues, please return later.</p>
          <button type="button" onClick={() => window.location.reload()}>Reload portfolio</button>
        </main>
      )
    }

    return this.props.children
  }
}
