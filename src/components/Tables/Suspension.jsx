import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3000/api/users')
      .then(response => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations des utilisateurs:', error);
        toast.error("Erreur lors du chargement des utilisateurs");
      });
  };

  const handleToggleActive = async (userName, currentState) => {
    try {
      const endpoint = currentState ? 'deactivate-profile' : 'activate-profile';
      await axios.patch(`http://localhost:3000/api/${endpoint}/${userName}`);
      fetchUsers();
      toast.success(`Profil ${currentState ? 'désactivé' : 'activé'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'état du profil:', error);
      toast.error("Erreur lors de la modification de l'état du profil");
    }
  };

  const handleToggleSuspension = async (userName, isSuspended) => {
    try {
      await axios.patch(`http://localhost:3000/api/users/${userName}/toggle-suspension`);
      fetchUsers();
      toast.success(`Compte ${isSuspended ? 'réactivé' : 'suspendu'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'état de suspension:', error);
      toast.error("Erreur lors de la modification de l'état de suspension");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nom d'utilisateur</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-center">État du profil</th>
            <th className="py-3 px-6 text-center">État du compte</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
          {users.map(user => (
            <tr key={user.userName} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
              <td className="py-3 px-6 text-left whitespace-nowrap">{user.userName}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-center">
                <label className="flex items-center justify-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={user.isActive}
                      onChange={() => handleToggleActive(user.userName, user.isActive)}
                      disabled={user.isSuspended}
                    />
                    <div className={`block h-8 w-14 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${user.isActive ? 'transform translate-x-full' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </label>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => handleToggleSuspension(user.userName, user.isSuspended)}
                  className={`py-1 px-3 rounded-full text-xs font-bold ${
                    user.isSuspended
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {user.isSuspended ? 'Réactiver' : 'Suspendre'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementComponent;