const apiUrl = 'https://systemhestia-1.onrender.com/patients';

document.addEventListener('DOMContentLoaded', fetchAllPatients);

document.getElementById('patientForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('patientIdHidden').value;
  if (id) {
    await updatePatient(id);
  } else {
    await createPatient();
  }
});

async function createPatient() {
  const patient = getFormData();
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    });
    if (!res.ok) throw new Error('Error al crear paciente');
    alert('Paciente creado');
    clearForm();
    fetchAllPatients();
  } catch (error) {
    console.error(error);
    alert('Error al crear paciente');
  }
}

async function updatePatient(id) {
  const patient = getFormData();
  patient.id = parseInt(id);
  try {
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    });
    if (!res.ok) throw new Error('Error al actualizar paciente');
    alert('Paciente actualizado');
    clearForm();
    fetchAllPatients();
  } catch (error) {
    console.error(error);
    alert('Error al actualizar paciente');
  }
}

async function getPatient() {
  const id = document.getElementById('patientId').value;
  if (!id) return alert('Ingresa un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('Paciente no encontrado');
    const p = await res.json();
    fillForm(p);
  } catch (error) {
    console.error(error);
    alert('Paciente no encontrado');
  }
}

async function deletePatient() {
  const id = document.getElementById('patientId').value;
  if (!id) return alert('Ingresa un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar paciente');
    alert('Paciente eliminado');
    fetchAllPatients();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar paciente');
  }
}

async function fetchAllPatients() {
  document.getElementById('loading').innerText = 'Cargando pacientes...';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Error al cargar pacientes');
    const patients = await res.json();
    renderPatients(patients);
  } catch (error) {
    console.error(error);
    document.getElementById('patientsList').innerHTML = '';
    document.getElementById('loading').innerText = 'No se pudieron cargar los pacientes.';
  }
}

function renderPatients(patients) {
  const list = document.getElementById('patientsList');
  document.getElementById('loading').innerText = '';
  if (!patients.length) {
    list.innerHTML = 'No hay pacientes';
    return;
  }
  list.innerHTML = patients
    .map(
      (p) => `
    <div>
      <strong>${p.name}</strong> (Edad: ${p.age})<br>
      ID: ${p.id} | Rol: ${p.role}<br>
      Enfermedad principal: ${p.primaryDisease?.name || 'N/A'}<br>
      <button onclick="prefillForm(${p.id})">Editar</button>
    </div>`
    )
    .join('');
}

// Esta función llena el formulario para editar, igual que el de usuarios
async function prefillForm(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('Paciente no encontrado');
    const p = await res.json();
    fillForm(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el paciente');
  }
}

// Llena el formulario con los datos del paciente
function fillForm(p) {
  document.getElementById('patientIdHidden').value = p.id;
  document.getElementById('name').value = p.name || '';
  document.getElementById('age').value = p.age || '';
  document.getElementById('conditions').value = p.conditions || '';
  document.getElementById('allergies').value = p.allergies || '';
  document.getElementById('description').value = p.description || '';
  document.getElementById('primaryDiseaseId').value = p.primaryDisease?.id || '';
  document.getElementById('role').value = p.role || '';
}

function getFormData() {
  return {
    name: document.getElementById('name').value,
    age: parseInt(document.getElementById('age').value),
    conditions: document.getElementById('conditions').value,
    allergies: document.getElementById('allergies').value,
    description: document.getElementById('description').value,
    primaryDisease: { id: parseInt(document.getElementById('primaryDiseaseId').value) },
    role: document.getElementById('role').value,
  };
}

function clearForm() {
  document.getElementById('patientForm').reset();
  document.getElementById('patientIdHidden').value = '';
}

