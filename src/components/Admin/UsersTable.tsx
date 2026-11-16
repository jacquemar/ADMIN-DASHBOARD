import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiPower,
  FiRefreshCw,
  FiSlash,
  FiTrash2,
} from 'react-icons/fi';
import { MdQrCode2 } from 'react-icons/md';
import api from '../../services/api';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ConfirmState,
  IconButton,
  PUBLIC_PROFILE_BASE_URL,
  SearchInput,
  TableMessage,
  errorMessage,
  formatDate,
  createdAtOf,
} from './ui';

type User = {
  _id: string;
  userName: string;
  email?: string;
  nomComplet?: string;
  phoneNumber?: string;
  photoProfilURL?: string;
  profil?: string;
  role?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  createdAt?: string;
};
type Pagination = { page: number; limit: number; total: number; pages: number };

const PAGE_SIZE = 10;

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null); // `${id}:${action}` ou 'all-qr'
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  // Recherche avec un léger délai pour ne pas spammer l'API
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', {
        params: { page, limit: PAGE_SIZE, search: query || undefined },
      });
      setUsers(data.users || []);
      setPagination(data.pagination || null);
    } catch (error) {
      toast.error(errorMessage(error, 'Impossible de charger les utilisateurs'));
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  const patchUser = (id: string, patch: Partial<User>) =>
    setUsers((list) => list.map((u) => (u._id === id ? { ...u, ...patch } : u)));

  const withBusy = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } catch (error) {
      toast.error(errorMessage(error, "L'action a échoué"));
    } finally {
      setBusy(null);
    }
  };

  const setStatus = (u: User, isActive: boolean, isSuspended: boolean, msg: string) =>
    withBusy(`${u._id}:status`, async () => {
      await api.put(`/admin/users/${u._id}/status`, { isActive, isSuspended });
      patchUser(u._id, { isActive, isSuspended });
      toast.success(msg);
      setConfirm(null);
    });

  const toggleActive = (u: User) =>
    setStatus(
      u,
      !u.isActive,
      !!u.isSuspended,
      `Profil @${u.userName} ${u.isActive ? 'désactivé' : 'activé'}`,
    );

  const toggleSuspension = (u: User) => {
    if (u.isSuspended) {
      setStatus(u, true, false, `Compte @${u.userName} réactivé`);
      return;
    }
    setConfirm({
      title: 'Suspendre le compte ?',
      message: (
        <>
          Le profil <strong className="text-black dark:text-white">@{u.userName}</strong> ne
          sera plus accessible publiquement.
        </>
      ),
      confirmLabel: 'Suspendre',
      onConfirm: () => setStatus(u, false, true, `Compte @${u.userName} suspendu`),
    });
  };

  const regenerateQr = (u: User) =>
    withBusy(`${u._id}:qr`, async () => {
      await api.post(`/users/${encodeURIComponent(u.userName)}/regenerate-qr`);
      toast.success(`QR code de @${u.userName} régénéré`);
    });

  const regenerateAll = () =>
    setConfirm({
      title: 'Régénérer tous les QR codes ?',
      message: `Les QR codes de tous les comptes pointeront vers ${PUBLIC_PROFILE_BASE_URL}.`,
      confirmLabel: 'Tout régénérer',
      tone: 'primary',
      onConfirm: () =>
        withBusy('all-qr', async () => {
          const { data } = await api.post('/admin/regenerate-qr-codes');
          toast.success(data?.message || 'QR codes régénérés');
          setConfirm(null);
        }),
    });

  const remove = (u: User) =>
    setConfirm({
      title: "Supprimer l'utilisateur ?",
      message: (
        <>
          Le compte <strong className="text-black dark:text-white">@{u.userName}</strong> sera
          définitivement supprimé. Cette action est irréversible.
        </>
      ),
      confirmLabel: 'Supprimer',
      onConfirm: () =>
        withBusy(`${u._id}:delete`, async () => {
          await api.delete(`/admin/users/${u._id}`);
          toast.success(`@${u.userName} supprimé`);
          setConfirm(null);
          load();
        }),
    });

  const isBusy = (u: User, action: string) => busy === `${u._id}:${action}`;
  const total = pagination?.total ?? users.length;
  const pages = pagination?.pages || 1;

  return (
    <Card
      title="Utilisateurs"
      subtitle={`${total} compte${total > 1 ? 's' : ''}`}
      actions={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Nom, pseudo, email…" />
          <Button
            icon={<MdQrCode2 />}
            onClick={regenerateAll}
            loading={busy === 'all-qr'}
            disabled={!!busy}
          >
            Régénérer les QR
          </Button>
          <IconButton label="Actualiser" onClick={load} loading={loading}>
            <FiRefreshCw />
          </IconButton>
        </>
      }
    >
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-body">
              <th className="px-5 py-3 font-medium">Utilisateur</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Contact</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">Formule</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Inscrit le</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <TableMessage colSpan={6}>Chargement…</TableMessage>
            ) : users.length === 0 ? (
              <TableMessage colSpan={6}>Aucun utilisateur trouvé.</TableMessage>
            ) : (
              users.map((u) => {
                const name = u.nomComplet || u.userName;
                return (
                  <tr
                    key={u._id}
                    className={`border-t border-stroke transition hover:bg-gray-2/60 dark:border-strokedark dark:hover:bg-meta-4/40 ${
                      loading ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.photoProfilURL} name={name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-black dark:text-white">
                            {name}
                            {u.role === 'admin' && (
                              <span className="ml-2 align-middle">
                                <Badge tone="blue">Admin</Badge>
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-body">@{u.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-sm md:table-cell">
                      <p className="text-black dark:text-white">{u.email || '—'}</p>
                      {u.phoneNumber && <p className="text-xs text-body">{u.phoneNumber}</p>}
                    </td>
                    <td className="hidden px-5 py-3 text-sm capitalize lg:table-cell">
                      {u.profil || '—'}
                    </td>
                    <td className="px-5 py-3">
                      {u.isSuspended ? (
                        <Badge tone="red">Suspendu</Badge>
                      ) : u.isActive ? (
                        <Badge tone="green">Actif</Badge>
                      ) : (
                        <Badge tone="gray">Inactif</Badge>
                      )}
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3 text-sm sm:table-cell">
                      {formatDate(createdAtOf(u))}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          label={u.isActive ? 'Désactiver le profil' : 'Activer le profil'}
                          tone={u.isActive ? 'success' : 'default'}
                          loading={isBusy(u, 'status')}
                          disabled={!!busy || !!u.isSuspended}
                          onClick={() => toggleActive(u)}
                        >
                          <FiPower />
                        </IconButton>
                        <IconButton
                          label={u.isSuspended ? 'Réactiver le compte' : 'Suspendre le compte'}
                          tone="warning"
                          disabled={!!busy}
                          onClick={() => toggleSuspension(u)}
                        >
                          <FiSlash />
                        </IconButton>
                        <IconButton
                          label="Régénérer le QR code"
                          tone="primary"
                          loading={isBusy(u, 'qr')}
                          disabled={!!busy}
                          onClick={() => regenerateQr(u)}
                        >
                          <MdQrCode2 />
                        </IconButton>
                        <a
                          href={`${PUBLIC_PROFILE_BASE_URL}/${encodeURIComponent(u.userName)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Voir le profil public"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-lg text-body transition hover:bg-gray-2 hover:text-black dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white"
                        >
                          <FiExternalLink />
                        </a>
                        <IconButton
                          label="Supprimer"
                          tone="danger"
                          loading={isBusy(u, 'delete')}
                          disabled={!!busy}
                          onClick={() => remove(u)}
                        >
                          <FiTrash2 />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke px-5 py-3 text-sm dark:border-strokedark">
          <span className="text-body">
            Page {page} sur {pages}
          </span>
          <div className="flex gap-1">
            <IconButton
              label="Page précédente"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              <FiChevronLeft />
            </IconButton>
            <IconButton
              label="Page suivante"
              disabled={page >= pages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              <FiChevronRight />
            </IconButton>
          </div>
        </div>
      )}

      <ConfirmDialog
        state={confirm}
        onClose={() => !busy && setConfirm(null)}
        loading={!!busy}
      />
    </Card>
  );
};

export default UsersTable;
