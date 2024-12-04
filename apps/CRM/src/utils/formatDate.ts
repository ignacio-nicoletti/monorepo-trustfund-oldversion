export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    // Formatea la fecha en 'YYYY-MM-DD'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
  
    return `${year}-${month}-${day}`;
  }