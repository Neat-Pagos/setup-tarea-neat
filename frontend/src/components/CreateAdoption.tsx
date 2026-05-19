import React, { useState, useEffect } from "react";
import { type Pokemon } from "../types/pokemon";
import Modal from "./Modal";
import AdoptionForm from "./AdoptionForm";
import { type UserData } from "../types/adoption";
import { useBroadcastRefresh } from "../hooks/useBroadcastRefresh";

interface Props {
  pokemon: Pokemon;
}

const CreateAdoption: React.FC<Props> = ({ pokemon }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { broadcast } = useBroadcastRefresh('adoptions');

  const handleModalOpen = (): void => {
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (userData: UserData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/adoptions/v2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemonId: pokemon.id, userData }),
      });

      if (!response.ok) throw new Error('Error al enviar la solicitud');

      setIsModalOpen(false);
      broadcast();
    } catch (err) {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="button-container">
        <button className="adoption-button" onClick={handleModalOpen}>Adoptar</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="create-adoption">
          <div className="flex items-center gap-4 mb-4 flex-col">
            <img src={pokemon.imageUrl} className="rounded-full w-32 h-32 border" />
            <h2 className="text-center mt-0">{`Solicitud de adopción de ${pokemon.name}`}</h2>
          </div>
          <div className="flex justify-around gap-4 mb-6">
            <div className="flex flex-col text-start">
              <span className="text-gray-500 text-sm">Tipo</span>
              <span>{pokemon.type}</span>
            </div>
            <div className="flex flex-col text-start">
              <span className="text-gray-500 text-sm">Dieta</span>
              <span>{pokemon.diet}</span>
            </div>
            <div className="flex flex-col text-start">
              <span className="text-gray-500 text-sm">Región</span>
              <span>{pokemon.region}</span>
            </div>
          </div>
          <div>
            <AdoptionForm onSubmit={handleSubmit} onClose={handleModalClose} isLoading={isLoading} error={error} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateAdoption;