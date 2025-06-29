
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:8080/medicine';

    const id = document.getElementById('id');
    const identification = document.getElementById('identification');
    const name = document.getElementById('name');
    const sideEffects = document.getElementById('sideEffects');
    const instructions = document.getElementById('instructions');
    const expirationDate = document.getElementById('expirationDate');
    const quantity = document.getElementById('quantity');
    const medicineType = document.getElementById('medicineType');

    const createBtn = document.getElementById('createBtn');
    const updateBtn = document.getElementById('updateBtn');
    const searchBtn = document.getElementById('searchBtn');
    const deleteBtn = document.getElementById('deleteBtn');
  const loadAllBtn = document.getElementById('loadAllBtn');

    const searchId = document.getElementById('searchId');
   const medicineList = document.getElementById('medicineList');
    const loading = document.getElementById('loading');

    createBtn.addEventListener('click', () => {
        const data = getFormData();
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => alert('Medicamento creado correctamente'))
        .catch(err => alert('Error al crear: ' + err));
    });

    updateBtn.addEventListener('click', () => {
        const data = getFormData(true);
        fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) throw new Error('ID no encontrado');
            return res.json();
        })
        .then(() => alert('Medicamento actualizado correctamente'))
        .catch(err => alert('Error al actualizar: ' + err));
    });

    searchBtn.addEventListener('click', () => {
        const idValue = searchId.value;
        if (!idValue) return alert('Ingrese un ID');

        fetch(`${apiUrl}/${idValue}`)
        .then(res => {
            if (!res.ok) throw new Error('No se encontró el medicamento');
            return res.json();
        })
        .then(data => {
            id.value = data.id;
            identification.value = data.identification;
            name.value = data.name;
            sideEffects.value = data.sideEffects;
            instructions.value = data.instructions;
            expirationDate.value = data.expirationDate;
            quantity.value = data.quantity;
            medicineType.value = data.medicineType;
            alert('Medicamento cargado en el formulario');
        })
        .catch(err => alert('Error: ' + err));
    });

    deleteBtn.addEventListener('click', () => {
        const idValue = searchId.value;
        if (!idValue) return alert('Ingrese un ID para eliminar');

        fetch(`${apiUrl}/${idValue}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) throw new Error('No se encontró el medicamento para eliminar');
            alert('Medicamento eliminado correctamente');
        })
        .catch(err => alert('Error: ' + err));
    });

    loadAllBtn.addEventListener('click', () => {
        loading.textContent = 'Cargando...';
        fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            medicineList.innerHTML = '';
            data.forEach(med => {
                const div = document.createElement('div');
                div.innerHTML = `<strong>${med.name}</strong><br>ID: ${med.id}<br>Identificación: ${med.identification}<br>Tipo: ${med.medicineType}<br>Cantidad: ${med.quantity}<br>Expira: ${med.expirationDate}<br><small>${med.instructions}</small>`;
                medicineList.appendChild(div);
            });
            loading.textContent = '';
        })
        .catch(err => {
            loading.textContent = '';
            alert('Error al cargar medicamentos: ' + err);
        });
    });

    function getFormData(includeId = false) {
        const data = {
            identification: identification.value,
            name: name.value,
            sideEffects: sideEffects.value,
            instructions: instructions.value,
            expirationDate: expirationDate.value,
            quantity: parseFloat(quantity.value),
            medicineType: medicineType.value
        };
        if (includeId && id.value) {
            data.id = parseInt(id.value);
        }
        return data;
    }
});
