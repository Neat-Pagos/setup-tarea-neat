import React, { useState, useEffect } from "react";
import { type Pokemon } from "../types/pokemon";
import Modal from "./Modal";
import AdoptionForm from "./AdoptionForm";

interface Props {
  pokemon: Pokemon;
}

const CreateAdoption: React.FC<Props> = ({ pokemon }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleModalOpen = (): void => {
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log(`Modal is now ${isModalOpen ? "open" : "closed"}`);
  }, [isModalOpen]);

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
            <AdoptionForm onSubmit={(e) => { console.log(e) }} onClose={handleModalClose} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateAdoption;