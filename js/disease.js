const apiUrl = 'https://systemhestia-1.onrender.com/diseases';

document.addEventListener('DOMContentLoaded', fetchAllDiseases);

document.getElementById('diseaseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('diseaseIdHidden').value;
   const loadAllBtn = document.getElementById('loadAllBtn');
  if (id) {
    await updateDisease(id);
  } else {
    await createDisease();
  }
});

async function createDisease() {
  const disease = getFormData();
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disease)
    });
    if (!res.ok) throw new Error('Error al crear enfermedad');
    alert('Enfermedad creada');
    clearForm();
    fetchAllDiseases();
  } catch (error) {
    console.error(error);
    alert('Error al crear enfermedad');
  }
}

async function updateDisease(id) {
  const disease = getFormData();
  disease.id = parseInt(id);
  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disease)
    });
    if (!res.ok) throw new Error('Error al actualizar enfermedad');
    alert('Enfermedad actualizada');
    clearForm();
    fetchAllDiseases();
  } catch (error) {
    console.error(error);
    alert('Error al actualizar enfermedad');
  }
}

async function getDisease() {
  const id = document.getElementById('diseaseId').value;
  if (!id) return alert('Ingresa un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('Enfermedad no encontrada');
    const d = await res.json();
    fillForm(d);
  } catch (error) {
    console.error(error);
    alert('Enfermedad no encontrada');
  }
}

async function deleteDisease() {
  const id = document.getElementById('diseaseId').value;
  if (!id) return alert('Ingresa un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al eliminar enfermedad');
    alert('Enfermedad eliminada');
    fetchAllDiseases();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar enfermedad');
  }
}

async function fetchAllDiseases() {
  document.getElementById('loading').innerText = 'Cargando enfermedades...';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Error al cargar enfermedades');
    const diseases = await res.json();
    renderDiseases(diseases);
  } catch (error) {
    console.error(error);
    document.getElementById('diseasesList').innerHTML = '';
    document.getElementById('loading').innerText = 'No se pudieron cargar las enfermedades.';
  }
}

function renderDiseases(diseases) {
  const list = document.getElementById('diseasesList');
  document.getElementById('loading').innerText = '';
  if (!diseases.length) {
    list.innerHTML = 'No hay enfermedades registradas';
    return;
  }
  list.innerHTML = diseases
    .map(
      (d) => `
    <div>
      <strong>ID:</strong> ${d.id}<br>
      <strong>Nombre:</strong> ${d.name}<br>
      <strong>Descripción:</strong> <em>${d.description}</em><br>
      <small><strong>Recomendación:</strong> ${d.recommendation}</small>
    </div>`
    )
    .join('');
}


function fillForm(d) {
  document.getElementById('diseaseIdHidden').value = d.id;
  document.getElementById('name').value = d.name || '';
  document.getElementById('description').value = d.description || '';
  document.getElementById('recommendation').value = d.recommendation || '';
}

function getFormData() {
  return {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    recommendation: document.getElementById('recommendation').value
  };
}

function clearForm() {
  document.getElementById('diseaseForm').reset();
  document.getElementById('diseaseIdHidden').value = '';
}
