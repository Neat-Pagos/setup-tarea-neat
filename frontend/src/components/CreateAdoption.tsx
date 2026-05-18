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
            <h2 className="text-center">{`Solicitud de adopción de ${pokemon.name}`}</h2>
          </div>
          <dl className="pokemon-meta">
            <div className="pokemon-meta-row">
              <dt>Tipo</dt>
              <dd>{pokemon.type}</dd>
            </div>
            <div className="pokemon-meta-row">
              <dt>Dieta</dt>
              <dd>{pokemon.diet}</dd>
            </div>
            <div className="pokemon-meta-row">
              <dt>Región</dt>
              <dd>{pokemon.region}</dd>
            </div>
          </dl>
          <div>
            <AdoptionForm onSubmit={(e) => { console.log(e) }} />
          </div>
          <div className="button-container">
            <button className="adoption-button secondary-button" onClick={handleModalClose}>Cerrar</button>
            <button className="adoption-button primary-button" onClick={handleModalClose}>Enviar solicitud</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateAdoption;