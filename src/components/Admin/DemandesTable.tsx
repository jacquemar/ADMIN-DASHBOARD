import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../services/api';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ConfirmState,
  IconButton,
  SearchInput,
  TableMessage,
  Tabs,
  Tone,
  errorMessage,
  formatDate,
  createdAtOf,
} from './ui';

type Status = 'pending' | 'approved' | 'rejected';
type Demande = {
  _id: string;
  userName: string;
  email: string;
  nom?: string;
  prenom?: string;
  phoneNumber?: string;
  status?: Status;
  date?: string;
  createdAt?: string;
};
type Filter = Status | 'all';

const STATUS: Record<Status, { label: string; tone: Tone }> = {
  pending: { label: 'En attente', tone: 'amber' },
  approved: { label: 'Approuvée', tone: 'green' },
  rejected: { label: 'Rejetée', tone: 'red' },
};

const statusOf = (d: Demande): Status => d.status || 'pending';
const fullName = (d: Demande) =>
  [d.prenom, d.nom].filter(Boolean).join(' ') || d.userName;

const DemandesTable = ({ compact = false }: { compact?: boolean }) => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState<string | null>(null); // `${id}:${action}`
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Demande[]>('/demandes');
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(errorMessage(error, 'Impossible de charger les demandes'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0, all: demandes.length };
    demandes.forEach((d) => c[statusOf(d)]++);
    return c;
  }, [demandes]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return demandes.filter(
      (d) =>
        (filter === 'all' || statusOf(d) === filter) &&
        (!q ||
          [d.userName, d.email, d.nom, d.prenom, d.phoneNumber]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))),
    );
  }, [demandes, filter, search]);

  const run = async (
    d: Demande,
    action: 'approve' | 'reject' | 'delete',
  ) => {
    setBusy(`${d._id}:${action}`);
    try {
      if (action === 'delete') {
        await api.delete(`/demandes/${d._id}`);
        setDemandes((list) => list.filter((x) => x._id !== d._id));
        toast.success('Demande supprimée');
      } else {
        await api.post(`/demandes/${d._id}/${action}`);
        const status: Status = action === 'approve' ? 'approved' : 'rejected';
        setDemandes((list) =>
          list.map((x) => (x._id === d._id ? { ...x, status } : x)),
        );
        toast.success(
          action === 'approve'
            ? `@${d.userName} approuvé, compte créé`
            : `Demande de @${d.userName} rejetée`,
        );
      }
      setConfirm(null);
    } catch (error) {
      toast.error(errorMessage(error, "L'action a échoué"));
    } finally {
      setBusy(null);
    }
  };

  const ask = (d: Demande, action: 'approve' | 'reject' | 'delete') => {
    const who = <strong className="text-black dark:text-white">@{d.userName}</strong>;
    const configs = {
      approve: {
        title: 'Approuver la demande ?',
        message: <>Le compte {who} sera créé avec son QR code.</>,
        confirmLabel: 'Approuver',
        tone: 'success' as const,
      },
      reject: {
        title: 'Rejeter la demande ?',
        message: <>La demande de {who} sera marquée comme rejetée.</>,
        confirmLabel: 'Rejeter',
        tone: 'danger' as const,
      },
      delete: {
        title: 'Supprimer la demande ?',
        message: <>La demande de {who} sera définitivement supprimée.</>,
        confirmLabel: 'Supprimer',
        tone: 'danger' as const,
      },
    };
    setConfirm({ ...configs[action], onConfirm: () => run(d, action) });
  };

  const isBusy = (d: Demande, action: string) => busy === `${d._id}:${action}`;

  return (
    <Card
      title="Demandes d'inscription"
      subtitle={
        counts.pending
          ? `${counts.pending} demande${counts.pending > 1 ? 's' : ''} en attente de validation`
          : 'Aucune demande en attente'
      }
      actions={
        <>
          {!compact && (
            <SearchInput value={search} onChange={setSearch} placeholder="Nom, pseudo, email…" />
          )}
          <Button icon={<FiRefreshCw />} onClick={load} loading={loading}>
            Actualiser
          </Button>
        </>
      }
    >
      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        tabs={[
          { key: 'pending', label: 'En attente', count: counts.pending },
          { key: 'approved', label: 'Approuvées', count: counts.approved },
          { key: 'rejected', label: 'Rejetées', count: counts.rejected },
          { key: 'all', label: 'Toutes', count: counts.all },
        ]}
      />

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-body">
              <th className="px-5 py-3 font-medium">Demandeur</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Contact</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Date</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && demandes.length === 0 ? (
              <TableMessage colSpan={5}>Chargement…</TableMessage>
            ) : visible.length === 0 ? (
              <TableMessage colSpan={5}>Aucune demande à afficher.</TableMessage>
            ) : (
              visible.map((d) => {
                const s = statusOf(d);
                return (
                  <tr
                    key={d._id}
                    className="border-t border-stroke transition hover:bg-gray-2/60 dark:border-strokedark dark:hover:bg-meta-4/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={fullName(d)} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-black dark:text-white">
                            {fullName(d)}
                          </p>
                          <p className="truncate text-xs text-body">@{d.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-sm md:table-cell">
                      <p className="text-black dark:text-white">{d.email}</p>
                      {d.phoneNumber && <p className="text-xs text-body">{d.phoneNumber}</p>}
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3 text-sm sm:table-cell">
                      {formatDate(createdAtOf(d) || d.date)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS[s].tone}>{STATUS[s].label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {s === 'pending' ? (
                          <>
                            <Button
                              tone="success"
                              icon={<FiCheck />}
                              loading={isBusy(d, 'approve')}
                              disabled={!!busy}
                              onClick={() => ask(d, 'approve')}
                            >
                              <span className="hidden lg:inline">Approuver</span>
                            </Button>
                            <IconButton
                              label="Rejeter"
                              tone="warning"
                              loading={isBusy(d, 'reject')}
                              disabled={!!busy}
                              onClick={() => ask(d, 'reject')}
                            >
                              <FiX />
                            </IconButton>
                          </>
                        ) : null}
                        <IconButton
                          label="Supprimer"
                          tone="danger"
                          loading={isBusy(d, 'delete')}
                          disabled={!!busy}
                          onClick={() => ask(d, 'delete')}
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

      <ConfirmDialog
        state={confirm}
        onClose={() => !busy && setConfirm(null)}
        loading={!!busy}
      />
    </Card>
  );
};

export default DemandesTable;
