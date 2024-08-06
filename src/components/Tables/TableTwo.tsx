import { useEffect, useState } from "react";
import axios from "axios";


const TableTwo = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    
  }, []);

  const fetchUsers = () => {
    axios.get('https://cfmqbxpsxd.us-east-1.awsapprunner.com/api/users')
      .then(response => {
        setUsers(response.data);
        console.log(response.data); 
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations des demandes:', error);
      });
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://cfmqbxpsxd.us-east-1.awsapprunner.com/api/user/${userId}`);
      console.log('user supprimé avec succès!')
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande :', error);
    
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Utilisateurs
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Nom & Prénoms</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Téléphone</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Supprimer</p>
        </div>

      </div>

      {users.map((user, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={user._id}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className=" w-8 rounded-md">
                <img src={user.photoProfilURL} alt="Product" />
              </div>
              <p className="text-sm text-black dark:text-white">
                {user.nomComplet}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {user.phoneNumber}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {user.email}
            </p>
          </div>

          <div className="col-span-1 flex items-center">
          <button className="hover:text-primary" onClick={() => handleDelete(user._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>


                    </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
