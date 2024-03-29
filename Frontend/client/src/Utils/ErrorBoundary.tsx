import React, { Component, ErrorInfo } from 'react';

interface Props {}
interface State {
  hasError: boolean;
}

interface IErrorBoundaryProps {
    children?: any
}

class ErrorBoundary extends Component<IErrorBoundaryProps, State> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
