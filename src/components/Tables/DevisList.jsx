import React, { useState, useEffect } from 'react';
import axios from 'axios';


const DevisList = () => {
  const [devis, setDevis] = useState([]);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await axios.get(`https://cfmqbxpsxd.us-east-1.awsapprunner.com/devis`);
        setDevis(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
      }
    };

    fetchDevis();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Demandes de devis reçues</h2>
      <ul className="space-y-4">
        {devis.map((devis) => (
          <li key={devis._id} className="bg-white shadow rounded-lg p-4">
            <p className="font-bold">{devis.nom}</p>
            <p>{devis.email}</p>
            <p>{devis.telephone}</p>
            <p className="mt-2">{devis.otherPrecisions}</p>
            <ul className="mt-2">
              {devis.isCommerçant && <li>Commerçant</li>}
              {devis.wantWebApp && <li>Souhaite une web app</li>}
              {devis.wantOpenTables && <li>Souhaite voir les tables ouvertes</li>}
              {devis.wantLoyaltySystem && <li>Souhaite un système de fidélisation</li>}
              {devis.wantAdminDashboard && <li>Souhaite un dashboard admin</li>}
              {devis.wantClientDatabase && <li>Souhaite une base de données clients</li>}
              {devis.wantModifyArticles && <li>Souhaite pouvoir modifier les articles</li>}
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(devis.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevisList;