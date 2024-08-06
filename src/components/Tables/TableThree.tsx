import { useEffect, useState } from 'react';
import axios from 'axios';

const TableThree = () => {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = () => {
    // Récupérer les informations des demandes
    axios.get('https://cfmqbxpsxd.us-east-1.awsapprunner.com/api/demandes')
      .then(response => {
        setDemandes(response.data);
        console.log(response.data);  // Affichez les données récupérées dans la console
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations des demandes:', error);
      });
  };

  const handleApprove = async (demandeId) => {
    try {
      await axios.post(`https://cfmqbxpsxd.us-east-1.awsapprunner.com/api/demandes/${demandeId}/approve`);
      console.log('Demande approuvée avec succès!')
      // Met à jour l'état des demandes localement
      setDemandes(demandes.map(demande =>
        demande._id === demandeId ? { ...demande, status: 'approved' } : demande
      ));
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande :', error);
      console.log('Erreur lors de l\'approbation de la demande')
    }
  };

  const handleReject = async (demandeId) => {
    try {
      await axios.post(`https://cfmqbxpsxd.us-east-1.awsapprunner.com/api/demandes/${demandeId}/reject`);
      console.log('Demande rejetée avec succès!')
      // Met à jour l'état des demandes localement
      setDemandes(demandes.map(demande =>
        demande._id === demandeId ? { ...demande, status: 'rejected' } : demande
      ));
    } catch (error) {
      console.error('Erreur lors du rejet de la demande :', error);
    }
  };

  const handleDelete = async (demandeId) => {
    try {
      await axios.delete(`https://cfmqbxpsxd.us-east-1.awsapprunner.com/api/demandes/${demandeId}`);
      console.log('Demande supprimée avec succès!')
      // Met à jour l'état des demandes localement en supprimant la demande supprimée
      setDemandes(demandes.filter(demande => demande._id !== demandeId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande :', error);
    
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Pseudo
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande._id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {demande.userName}
                  </h5>
                  <p className="text-sm">{demande.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {demande.date}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      demande.status === 'approved'
                        ? 'bg-success text-success'
                        : demande.status === 'rejected'
                        ? 'bg-danger text-danger'
                        : 'bg-warning text-warning'
                    }`}
                  >
                    {demande.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => handleReject(demande._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    </button>
                    <button className="hover:text-primary" onClick={() => handleDelete(demande._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>


                    </button>
                    <button className="hover:text-primary" onClick={() => handleApprove(demande._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TableThree;
