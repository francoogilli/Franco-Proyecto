<template>
  <div>
    <div class="card">
      <div class="wrapper">
        <span class="material-symbols-outlined">timeline</span>
        <button @click="mostrarHistorial">Historial</button>
      </div>
    </div>
  
  <div v-if="mostrar" class="modal-overlay">
    <div class="modal" id="modalTable" v-show="mostrar">
      <table>
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Acción</th>
            <th>Cantidad</th>
            <th>Dinero</th>
            <th>Fecha</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction._id">
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.action }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>${{ transaction.money }}</td>
            <td>{{ formatearFecha(transaction.datetime) }}</td>
            <td>
              <button class="btn-view" @click="mostrarTransaccion(transaction)">Ver</button>
              <button class="btn-edit" @click="editarTransaccion(transaction)">Editar</button>
              <button class="btn-delete" @click="borrarTransaccion(transaction._id)">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrar = false">close</span>
    </div>
  


    <!-- Modal para editar transacción -->
    <div v-if="editarTransacción" class="modal" id="modal-editar">
      <h2>Editar transacción</h2>
      <table>
        <tr>
          <td><strong>Acción:</strong></td>
          <td><input v-model="transaccionEditada.action" type="text" /></td>
        </tr>
        <tr>
          <td><strong>Crypto:</strong></td>
          <td><input v-model="transaccionEditada.crypto_code" type="text" /></td>
        </tr>
        <tr>
          <td><strong>Cantidad:</strong></td>
          <td><input v-model="transaccionEditada.crypto_amount" type="number" /></td>
        </tr>
        <tr>
          <td><strong>Dinero:</strong></td>
          <td><input v-model="transaccionEditada.money" type="number" step="0.01" /></td>
        </tr>
        <tr>
          <td><strong>Fecha:</strong></td>
          <td><input v-model="transaccionEditada.datetime" type="date" /></td>
        </tr>
        <div>
        <div class="button-container">
            <button @click="guardarEditar">Guardar</button>
        </div>
          <span class="material-symbols-outlined" id="cerrarSpan" @click="cancelarEditar">close</span>
        </div>
      </table>
    </div>



    <!-- Modal para mostrar los detalles de la transacción seleccionada -->
    <div v-if="transaccionSeleccionada" class="modal" id="modal-ver">
      <h2>Detalles de la transacción</h2>
      <table>
        <tr>
          <td><strong>Acción:</strong></td>
          <td>{{ transaccionSeleccionada.action }}</td>
        </tr>
        <tr>
          <td><strong>Crypto:</strong></td>
          <td>{{ transaccionSeleccionada.crypto_code }}</td>
        </tr>
        <tr>
          <td><strong>Cantidad:</strong></td>
          <td>{{ transaccionSeleccionada.crypto_amount }}</td>
        </tr>
        <tr>
          <td><strong>Dinero:</strong></td>
          <td>${{ transaccionSeleccionada.money }}</td>
        </tr>
        <tr>
          <td><strong>Fecha:</strong></td>
          <td>{{ formatearFecha(transaccionSeleccionada.datetime) }}</td>
        </tr>
      </table>
      <span class="material-symbols-outlined" id="cerrarSpan" @click="transaccionSeleccionada = null">close</span>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'Historial',
  data() {
    return {
      mostrar: false,
      transactions: [], // Matriz para almacenar transacciones obtenidas
      transaccionSeleccionada: null, // Nueva propiedad para almacenar datos de transacciones seleccionados
      editarTransacción: null, // Nueva propiedad para almacenar la transacción que se está editando
      transaccionEditada: {}, // Nueva propiedad para almacenar los datos de transacción editados
    };
  },
  computed: {
    ...mapState({
      usuario: "usuario",
    })
  },
  methods: {
    formatearFecha(dateString) {
      const utcDate = new Date(dateString);
      const date = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * -60000));
      
      // Use toLocaleString() to format the date and time in the local timezone
      const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false // Use 24-hour format
      };
      const fechaFormateada = date.toLocaleString('es-AR', options);
      
      return fechaFormateada;
    },
    borrarTransaccion(transactionId) {
      const apiUrl = `https://labor3-d60e.restdb.io/rest/transactions/${transactionId}`;

      axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': '64a2e9bc86d8c525a3ed8f63',
        },
      })
      .then(response => {
        // Remove the deleted transaction from the local array
        this.transactions = this.transactions.filter(transaction => transaction._id !== transactionId);
      })
      .catch(error => {
        console.error('Error al eliminar la transacción:', error);
      });
    },
    buscarTransacciones() {
      const userId = this.usuario;

      axios.get(`https://labor3-d60e.restdb.io/rest/transactions?q={"user_id": "${userId}"}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': '64a2e9bc86d8c525a3ed8f63',
        },
      })
      .then(response => {
        this.transactions = response.data;
      })
      .catch(error => {
        console.error('Error al realizar la solicitud GET:', error);
      });
    },
    mostrarHistorial() {
      // Actualizar el historial al abrir el modal
      this.buscarTransacciones();
      // Mostrar el modal
      this.mostrar = true;
    },
    mostrarTransaccion(transaction) {
      this.transaccionSeleccionada = transaction;
    },
    editarTransaccion(transaction) {
      this.editarTransacción = transaction;
      // Crea una copia de la transacción para evitar modificar el original hasta guardar
      this.transaccionEditada = { ...transaction };
    },
    guardarEditar() {
      const apiUrl = `https://labor3-d60e.restdb.io/rest/transactions/${this.editarTransacción._id}`;

      axios
        .patch(apiUrl, this.transaccionEditada, {
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '64a2e9bc86d8c525a3ed8f63', // Replace with your RestDB API Key
          },
        })
        .then(response => {
          // Update the local transactions array with the edited transaction
          const index = this.transactions.findIndex(
            transaction => transaction._id === this.editarTransacción._id
          );
          if (index !== -1) {
            this.transactions[index] = this.transaccionEditada;
          }

          // Close the edit modal
          this.editarTransacción = null;
          this.transaccionEditada = {};
        })
        .catch(error => {
          console.error('Error al editar la transacción:', error);
        });
    },
    cancelarEditar() {
      this.editarTransacción = null;
      this.transaccionEditada = {};
    },
  },
  mounted() {
    // Se llama a buscarTransacciones() al montar el componente
    this.buscarTransacciones();
  }
}
</script>

<style scoped>
.modal{ 
  width: 60rem; 
  height: 30rem; 
  overflow: auto;
} 
table { 
  border-collapse: collapse;
  width: 100%;
  margin-top: 0.4rem; 
  border-radius: 20px;
  overflow: hidden;
  font-weight: 400; 
} 

#modal_editar table{
  border-collapse: collapse;
  width: 110%;
  margin-top: 1.375rem; 
  border-radius: 20px;
  overflow: hidden;
  font-weight: 400; 
}
th, td {
  
  text-align: center;
  padding: 10px; 
  } 
th { 
  background-color: #282828; 
  color: white;
} 
tr:nth-child(even) {
   background-color: #f2f2f2; 
}
td button {
  margin: 2px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 11px; 
  font-weight: 800;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Poppins'; 
} 

.btn-view { 
  background-color: #00ff93;
  color: white;
  cursor: pointer; /* Add cursor property to indicate it's clickable */
} 
.btn-view:active{
  background:#5affba;
}
.btn-edit { 
  background-color: #0051ffe0; 
  color: white; 
}
.btn-edit:active{
  background: #4981fae0;
}
.btn-delete {
  background-color: #ff1100;
  color: white;
}
.btn-delete:active{
  background: #ff5447;
}
.transaction-details {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
.transaction-details h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
.transaction-details table {
  width: 100%;
}
.transaction-details td {
  padding: 5px;
}
#modal-ver table{
  margin-top: 5.375rem;
}


#modal-editar input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  box-shadow: -4px -4px 10px rgba(255,255,255,1), inset 4px 4px 10px rgba(0,0,0,0.05), inset -4px -4px 10px rgba(255,255,255,1), 4px 4px 10px rgba(0,0,0,0.05);
  font-family: 'Poppins';
  border-radius: 14px;
  outline: none;
  border: none;
  background: #ebeef1;
  line-height: 1;
  font-weight: 650;
  font-size: 15px;
  color: #3e3e3e;
}

#modal-editar .button-container {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  left: 559px;
}
.button-container button{
  background-color: #ebeef1;
  padding: 0.75rem 1.1875rem;
  border-radius: 1.25rem;
  border: none;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 900;
  color: rgba(0,0,0,0.8);
  box-shadow: 10px 10px 10px -1px rgba(10,99,169,0.16), -10px -10px 10px -1px rgba(255,255,255,0.7);
}

.button-container button:active{
  box-shadow: -4px -4px 10px rgba(255,255,255,1), inset 4px 4px 10px rgba(0,0,0,0.05), inset -4px -4px 10px rgba(255,255,255,1), 4px 4px 10px rgba(0,0,0,0.05);

}
#modalTable table{
  margin-top: 23px;
}
td:nth-child(1) {
  font-weight: bold;
}

 @import '../assets/home.css'
</style>
