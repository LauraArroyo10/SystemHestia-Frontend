const apiUrl = 'http://localhost:8080/users';

document.addEventListener('DOMContentLoaded', fetchAllUsers);

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('userIdHidden').value;
  if (userId) {
    await updateUser(userId);
  } else {
    await createUser();
  }
});

async function createUser() {
  const user = getFormData();
  try {
    const res = await fetch(`${apiUrl}/signUp`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Error');
    alert('Usuario creado!');
    clearForm();
    fetchAllUsers();
  } catch (error) {
    console.error(error);
    alert('Error al crear usuario');
  }
}

async function updateUser(id) {
  const user = getFormData();
  user.id = parseInt(id);
  try {
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    });
    const message = await res.text();
    alert(message);
    clearForm();
    fetchAllUsers();
  } catch (error) {
    console.error(error);
    alert('Error al actualizar usuario');
  }
}

async function getUser() {
  const id = document.getElementById('userId').value;
  if (!id) return alert('Ingrese un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('No encontrado');
    const user = await res.json();
    document.getElementById('userIdHidden').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('role').value = user.role;
   
  } catch (error) {
    console.error(error);
    alert('Usuario no encontrado');
  }
}

async function deleteUser() {
  const id = document.getElementById('userId').value;
  if (!id) return alert('Ingrese un ID');
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    const message = await res.text();
    alert(message);
    fetchAllUsers();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar');
  }
}

async function fetchAllUsers() {
  document.getElementById('loading').innerText = 'Loading users...';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Error');
    const users = await res.json();
    renderUsers(users);
  } catch (error) {
    console.error(error);
    document.getElementById('usersList').innerHTML = '';
    document.getElementById('loading').innerText = 'Could not load users.';
  }
}

function renderUsers(users) {
  const list = document.getElementById('usersList');
  document.getElementById('loading').innerText = '';
  if (!users.length) {
    list.innerHTML = 'No users found';
    return;
  }
  list.innerHTML = users.map(u => `
    <div>
      <strong>${u.name}</strong> (${u.email})<br>
      Role: ${u.role} | ID: ${u.id}<br>
      <button class="edit-btn" onclick="prefillForm(${u.id})">Editar</button>
    </div>
  `).join('');
}

async function prefillForm(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('No encontrado');
    const user = await res.json();
    document.getElementById('userIdHidden').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('role').value = user.role;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el usuario');
  }
}

function getFormData() {
  return {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value
  };
}

function clearForm() {
  document.getElementById('userForm').reset();
  document.getElementById('userIdHidden').value = '';
}

