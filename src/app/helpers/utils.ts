// Función para validar el RUT chileno con módulo 11
function validateRutElevenModule(rut: string): boolean {
  // Eliminar guiones y convertir a mayúsculas
  rut = rut.replace(/\./g, "").toUpperCase();

  // Separar el RUT y el dígito verificador
  const rutArray = rut.split("-");
  if (rutArray.length !== 2) {
    return false; // El RUT debe tener un guión separador
  }

  const numRut = parseInt(rutArray[0], 10);
  const dv = rutArray[1];

  // Validar que el dígito verificador sea un número o 'K'
  if (!/^[0-9Kk]{1}$/.test(dv)) {
    return false;
  }

  // Calcular el dígito verificador esperado
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutArray[0].length - 1; i >= 0; i--) {
    suma += parseInt(rutArray[0].charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado: string;

  if (dvEsperado === 11) {
    dvCalculado = '0';
  } else if (dvEsperado === 10) {
    dvCalculado = 'K';
  } else {
    dvCalculado = dvEsperado.toString();
  }

  // Comparar el dígito verificador calculado con el ingresado
  return dvCalculado === dv;
}

export {
  validateRutElevenModule
};