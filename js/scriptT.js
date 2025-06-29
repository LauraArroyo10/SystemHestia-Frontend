const apiUrl = 'https://systemhestia-1.onrender.com/tratamientos';

document.addEventListener('DOMContentLoaded', fetchAllTreatments);

// Manejar el envío del formulario
document.getElementById('treatmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await crearTratamiento();
});

async function crearTratamiento() {
  const tratamiento = obtenerDatosFormulario();

  // 👀 Agregado: para ver exactamente qué JSON se está enviando
  console.log('Tratamiento a enviar:', JSON.stringify(tratamiento, null, 2));

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(tratamiento)
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error desconocido');
    }
    alert('Tratamiento creado correctamente');
    limpiarFormulario();
    fetchAllTreatments();
  } catch (error) {
    console.error(error);
    alert('Error al crear el tratamiento: ' + error.message);
  }
}

async function getTreatmentById() {
  const id = document.getElementById('treatmentId').value;
  if (!id) return alert('Ingresa un ID');
  try {
    const res = await fetch(`${apiUrl}/id/${id}`);
    if (!res.ok) throw new Error('No encontrado');
    const tratamiento = await res.json();

    // Llenar el formulario con los datos encontrados
    document.getElementById('treatmentIdHidden').value = tratamiento.id || '';
    document.getElementById('patientId').value = tratamiento.patient?.id || '';
    document.getElementById('medicineId').value = tratamiento.medicine?.id || '';
    document.getElementById('diseaseId').value = tratamiento.disease?.id || '';
    document.getElementById('dosage').value = tratamiento.dosage || '';
    document.getElementById('frequency').value = tratamiento.frequency || '';
    document.getElementById('startDate').value = tratamiento.startDate ? tratamiento.startDate.slice(0,16) : '';
    document.getElementById('endDate').value = tratamiento.endDate ? tratamiento.endDate.slice(0,16) : '';
    document.getElementById('status').value = tratamiento.status || '';
    document.getElementById('observations').value = tratamiento.observations || '';
    document.getElementById('loadAllBtn').addEventListener('click', fetchAllTreatments);
  } catch (error) {
    console.error(error);
    alert('Tratamiento no encontrado');
  }
}

async function getTreatmentsByPatient() {
  const nombre = document.getElementById('patientSearchName').value;
  if (!nombre) return alert('Ingresa el nombre del paciente');
  try {
    const res = await fetch(`${apiUrl}/paciente/${nombre}`);
    if (!res.ok) throw new Error('Error');
    const tratamientos = await res.json();
    mostrarTratamientos(tratamientos);
  } catch (error) {
    console.error(error);
    alert('Error al buscar tratamientos');
  }
}

async function deleteTreatment() {
  const id = document.getElementById('treatmentId').value;
  if (!id) return alert('Ingresa un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    alert('Tratamiento eliminado correctamente');
    fetchAllTreatments();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar el tratamiento');
  }
}

async function fetchAllTreatments() {
  document.getElementById('loading').innerText = 'Cargando tratamientos...';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Error');
    const tratamientos = await res.json();
    mostrarTratamientos(tratamientos);
  } catch (error) {
    console.error(error);
    document.getElementById('treatmentsList').innerHTML = '';
    document.getElementById('loading').innerText = 'No se pudieron cargar los tratamientos.';
  }
}

function mostrarTratamientos(tratamientos) {
  const lista = document.getElementById('treatmentsList');
  document.getElementById('loading').innerText = '';
  if (!tratamientos.length) {
    lista.innerHTML = 'No se encontraron tratamientos';
    return;
  }
  lista.innerHTML = tratamientos.map(t => `
    <div>
      <strong>ID:</strong> ${t.id}<br>
      <strong>Paciente:</strong> ${t.patient?.name}<br>
      <strong>Medicamento:</strong> ${t.medicine?.name}<br>
      <strong>Enfermedad:</strong> ${t.disease?.name}<br>
      <strong>Dosis:</strong> ${t.dosage}<br>
      <strong>Frecuencia:</strong> ${t.frequency}<br>
      <strong>Inicio:</strong> ${t.startDate}<br>
      <strong>Fin:</strong> ${t.endDate}<br>
      <strong>Estado:</strong> ${t.status}<br>
      <strong>Observaciones:</strong> ${t.observations}
    </div>
  `).join('');
}

function obtenerDatosFormulario() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  return {
    patient: { id: parseInt(document.getElementById('patientId').value) },
    medicine: { id: parseInt(document.getElementById('medicineId').value) },
    disease: { id: parseInt(document.getElementById('diseaseId').value) },
    dosage: document.getElementById('dosage').value,
    frequency: document.getElementById('frequency').value,
    startDate: startDate ? startDate + ':00' : '',
    endDate: endDate ? endDate + ':00' : '',
    status: document.getElementById('status').value,
    observations: document.getElementById('observations').value
  };
}

function limpiarFormulario() {
  document.getElementById('treatmentForm').reset();
  document.getElementById('treatmentIdHidden').value = '';
}

