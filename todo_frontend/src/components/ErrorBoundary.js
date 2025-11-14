import React from 'react';

/**
 * Basic error boundary to catch rendering errors and show a friendly message.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Something went wrong.' };
  }

  componentDidCatch(error, info) {
    // Log error - avoid sensitive data
    // eslint-disable-next-line no-console
    console.error('UI ErrorBoundary', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-panel">
          <h2>Something went wrong</h2>
          <p>{this.state.errorMsg}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
