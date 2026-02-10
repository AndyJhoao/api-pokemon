// URL base del API - en producción apunta al backend en Render
// En desarrollo usa el proxy de Vite (ruta relativa)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
