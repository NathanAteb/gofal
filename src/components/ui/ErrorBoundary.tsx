"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-[16px] border border-blush-grey bg-white p-8 text-center">
            <p className="text-muted-plum">
              Mae rhywbeth wedi mynd o&apos;i le. / Something went wrong.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white"
            >
              Ceisio eto / Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
