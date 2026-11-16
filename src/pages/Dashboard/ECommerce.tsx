import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import DemandesTable from '../../components/Admin/DemandesTable';
import DashboardStats from '../../components/DashboardStats';
import { useAuthContext } from '../../contexts/AuthContext';


const ECommerce: React.FC = () => {
  const { user } = useAuthContext();

  return (
          <>
        {/* Message de bienvenue */}
        <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Bienvenue, {user?.name || 'Utilisateur'} ! 👋
          </h2>
          <p className="mt-2 text-sm text-bodydark2">
            Connecté en tant que {user?.email} ({user?.role || 'Utilisateur'})
          </p>
        </div>

                <DashboardStats />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <div className="col-span-12">
          <DemandesTable compact />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
