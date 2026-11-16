import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DemandesTable from '../components/Admin/DemandesTable';
import UsersTable from '../components/Admin/UsersTable';

const Tables = () => (
  <>
    <Breadcrumb pageName="Demandes & utilisateurs" />
    <div className="flex flex-col gap-6">
      <DemandesTable />
      <UsersTable />
    </div>
  </>
);

export default Tables;
