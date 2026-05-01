import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span className="font-mono text-xs text-text-muted select-none">›</span>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
