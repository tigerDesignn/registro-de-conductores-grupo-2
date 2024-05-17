// Función para renderizar la tabla con los datos actuales
function renderTable(data) {
    const table = document.getElementById('table-container').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    data.forEach(registro => {
      const row = table.insertRow();
      row.insertCell(0).textContent = registro.numTerritorio;
      row.insertCell(1).textContent = registro.conductor;
      row.insertCell(2).textContent = registro.fechaInicio;
      row.insertCell(3).textContent = registro.fechaFin;
      const accionesCell = row.insertCell(4);
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.onclick = () => {
        showDeleteConfirmation(registro._id);
      };
      accionesCell.appendChild(deleteBtn);
    });
  }
  
  // Función para mostrar la pantalla de confirmación de eliminación
  function showDeleteConfirmation(id) {
    const modal = document.getElementById('confirm-delete-modal');
    modal.style.display = 'block';
  
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
  
    // Si el usuario confirma la eliminación
    confirmDeleteBtn.onclick = async () => {
      await deleteRegistro(id);
      modal.style.display = 'none';
    };
  
    // Si el usuario cancela la eliminación
    cancelDeleteBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
  
  // Resto del código permanece igual
  // ...
  
  
  // Función para agregar un nuevo registro
  async function addRegistro(event) {
    event.preventDefault();
    const conductor = document.getElementById('conductor').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const numTerritorio = document.getElementById('numTerritorio').value; // Obtener el valor seleccionado del campo de selección
  
    const response = await fetch('/grupoDos/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conductor, fechaInicio, fechaFin, numTerritorio })
    });
  
    if (response.ok) {
      const data = await response.json();
      renderTable(data);
      // Limpiar el formulario después de agregar el registro
      document.getElementById('registro-form').reset();
    } else {
      console.error('Error al agregar registro');
    }
  }
  
  // Función para eliminar un registro
  async function deleteRegistro(id) {
    const response = await fetch(`/grupoDos/registros/${id}`, {
      method: 'DELETE'
    });
  
    if (response.ok) {
      const data = await response.json();
      renderTable(data);
    } else {
      console.error('Error al eliminar registro');
    }
  }
  
  
  // Obtener datos iniciales al cargar la página
  window.onload = async () => {
    const response = await fetch('/grupoDos/registros');
    if (response.ok) {
      const data = await response.json();
      renderTable(data);
    } else {
      console.error('Error al obtener datos');
    }
  
    // Agregar evento de envío de formulario
    document.getElementById('registro-form').addEventListener('submit', addRegistro);
   
    document.getElementById('download-pdf').addEventListener('click', () => {
      downloadPDF();
    });
    
    document.getElementById('download-doc').addEventListener('click', () => {
      downloadDOC();
    });
    
    document.getElementById('download-exe').addEventListener('click', () => {
      downloadEXE();
    });
    
  };
  
  