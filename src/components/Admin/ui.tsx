import { ReactNode, useEffect } from 'react';
import { FiAlertTriangle, FiSearch } from 'react-icons/fi';

export const PUBLIC_PROFILE_BASE_URL = (
  import.meta.env.VITE_PUBLIC_PROFILE_URL || 'https://connect.incantix.net'
).replace(/\/+$/, '');

export const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/** Date de création : createdAt, sinon l'horodatage contenu dans l'ObjectId MongoDB. */
export const createdAtOf = (doc: { _id?: string; createdAt?: string }) => {
  if (doc.createdAt) return doc.createdAt;
  if (doc._id && /^[a-f0-9]{24}$/i.test(doc._id)) {
    return new Date(parseInt(doc._id.slice(0, 8), 16) * 1000).toISOString();
  }
  return undefined;
};

export const errorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || fallback;

/* ---------- Carte conteneur ---------- */
export const Card = ({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) => (
  <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex flex-col gap-3 border-b border-stroke px-5 py-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 className="text-lg font-semibold text-black dark:text-white">
          {title}
        </h4>
        {subtitle && <p className="text-sm text-body">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
    {children}
  </div>
);

/* ---------- Badge ---------- */
const BADGE_TONES = {
  green: 'bg-success/10 text-success',
  red: 'bg-danger/10 text-danger',
  amber: 'bg-warning/10 text-warning',
  blue: 'bg-primary/10 text-primary',
  gray: 'bg-gray-2 text-body dark:bg-meta-4 dark:text-bodydark',
};
export type Tone = keyof typeof BADGE_TONES;

export const Badge = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_TONES[tone]}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {children}
  </span>
);

/* ---------- Boutons ---------- */
const BUTTON_TONES = {
  primary: 'bg-primary text-white hover:bg-opacity-90',
  success: 'bg-success text-white hover:bg-opacity-90',
  danger: 'bg-danger text-white hover:bg-opacity-90',
  ghost:
    'border border-stroke text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4',
};

export const Button = ({
  tone = 'ghost',
  icon,
  children,
  loading,
  ...props
}: {
  tone?: keyof typeof BUTTON_TONES;
  icon?: ReactNode;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...props}
    disabled={props.disabled || loading}
    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_TONES[tone]} ${props.className || ''}`}
  >
    {loading ? <Spinner /> : icon}
    {children}
  </button>
);

const ICON_TONES = {
  default: 'text-body hover:bg-gray-2 hover:text-black dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white',
  success: 'text-success hover:bg-success/10',
  danger: 'text-danger hover:bg-danger/10',
  warning: 'text-warning hover:bg-warning/10',
  primary: 'text-primary hover:bg-primary/10',
};

export const IconButton = ({
  label,
  tone = 'default',
  loading,
  children,
  ...props
}: {
  label: string;
  tone?: keyof typeof ICON_TONES;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    {...props}
    disabled={props.disabled || loading}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${ICON_TONES[tone]}`}
  >
    {loading ? <Spinner /> : children}
  </button>
);

export const Spinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
);

/* ---------- Recherche ---------- */
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Rechercher…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="relative">
    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-stroke bg-transparent py-1.5 pl-9 pr-3 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:text-white sm:w-64"
    />
  </div>
);

/* ---------- Onglets filtres ---------- */
export const Tabs = <T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="flex gap-1 overflow-x-auto border-b border-stroke px-5 dark:border-strokedark">
    {tabs.map((t) => (
      <button
        key={t.key}
        type="button"
        onClick={() => onChange(t.key)}
        className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition ${
          value === t.key
            ? 'border-primary text-primary'
            : 'border-transparent text-body hover:text-black dark:hover:text-white'
        }`}
      >
        {t.label}
        {t.count !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              value === t.key ? 'bg-primary/10' : 'bg-gray-2 dark:bg-meta-4'
            }`}
          >
            {t.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

/* ---------- Avatar ---------- */
export const Avatar = ({ src, name }: { src?: string; name: string }) => {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';
  return src ? (
    <img
      src={src}
      alt={name}
      className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {initials}
    </span>
  );
};

/* ---------- États vides / chargement ---------- */
export const TableMessage = ({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-12 text-center text-sm text-body">
      {children}
    </td>
  </tr>
);

/* ---------- Confirmation ---------- */
export type ConfirmState = {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  tone?: 'danger' | 'primary' | 'success';
  onConfirm: () => Promise<void> | void;
} | null;

export const ConfirmDialog = ({
  state,
  onClose,
  loading,
}: {
  state: ConfirmState;
  onClose: () => void;
  loading?: boolean;
}) => {
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, onClose]);

  if (!state) return null;
  const tone = state.tone || 'danger';
  return (
    <div
      className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-boxdark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4">
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
              tone === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
            }`}
          >
            <FiAlertTriangle />
          </span>
          <div>
            <h5 className="font-semibold text-black dark:text-white">{state.title}</h5>
            <div className="mt-1 text-sm text-body">{state.message}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button tone={tone} loading={loading} onClick={() => state.onConfirm()}>
            {state.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
