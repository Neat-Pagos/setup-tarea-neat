import React, { useState } from "react";
import { type UserData } from "../types/adoption";

interface AdoptionFormProps {
  onSubmit: (userData: UserData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ onSubmit, isLoading = false, onClose }) => {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    region: "",
    idNumber: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }
    if (!formData.region.trim()) {
      newErrors.region = "La región es requerida";
    }
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "El número de identificación es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof UserData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="adoption-form">
      <div className="form-grid">
        <div className="form-group col-span-2">
          <label htmlFor="name">Nombre *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            disabled={isLoading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu.email@ejemplo.com"
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            disabled={isLoading}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="region">Región *</label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Tu región"
            disabled={isLoading}
          />
          {errors.region && <span className="error-message">{errors.region}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="idNumber">Número de Identificación *</label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="Tu número de identificación"
            disabled={isLoading}
          />
          {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
        </div>
      </div>

      <div className="button-container mt-8">
        <button
          className="adoption-button secondary-button"
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
          type="button"
        >
          Cerrar
        </button>
        <button
          className="adoption-button primary-button"
          onClick={() => null}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </div>

    </form>
  );
};

export default AdoptionForm;
