/** "Hungora" wordmark in the logo's own palette — "go" red, the rest gold. */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()} aria-label="Hungora">
      <span className="wordmark__g" aria-hidden="true">Hun</span>
      <span className="wordmark__r" aria-hidden="true">go</span>
      <span className="wordmark__g" aria-hidden="true">ra</span>
    </span>
  )
}
