/**
 * @module App
 * @description
 * Root application component.
 *
 * Provides the outer shell (topbar + layout wrapper).
 * All routing would be placed here if multi-page support were added.
 */

import HomePage from "./ui/pages/HomePage";

/**
 * App root component.
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <div className="app-shell">
      {/* ── Topbar ── */}
      <nav className="topbar">
        <span className="topbar__logo">
          Sport<span>X</span>
        </span>
        <span className="topbar__tagline">Live Betting</span>
      </nav>

      {/* ── Page ── */}
      <HomePage />
    </div>
  );
}

export default App;
