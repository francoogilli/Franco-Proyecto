<template>
  <div>
    <div class="card">
      <div class="wrapper">
        <span class="material-symbols-outlined">timeline</span>
        <button @click="mostrarHistorial">Historial</button>
      </div>
    </div>

    <div class="modal" id="modal_vender" v-show="mostrar">
      <table>
        <thead>
          <tr>
            <th>Acción</th>
            <th>Crypto</th>
            <th>Cantidad</th>
            <th>Dinero</th>
            <th>Fecha</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction._id">
            <td>{{ transaction.action }}</td>
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>${{ transaction.money }}</td>
            <td>{{ formatDate(transaction.datetime) }}</td>
            <td>
              <button class="btn-view" @click="showDetails(transaction)">Ver</button>
              <button class="btn-edit" @click="editTransaction(transaction)">Editar</button>
              <button class="btn-delete" @click="deleteTransaction(transaction._id)">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <span class="material-symbols-outlined" id="cerrar_vender" @click="mostrar = false">close</span>
    </div>

    <!-- Modal para editar transacción -->
    <!--<div v-if="editingTransaction" class="modal" id="modal-editar">
      <h2>Editar transacción</h2>
      <div class="transaction-details">
        <label><strong>Acción:</strong></label>
        <input v-model="editedTransaction.action" type="text" />

        <label><strong>Crypto:</strong></label>
        <input v-model="editedTransaction.crypto_code" type="text" />

        <label><strong>Cantidad:</strong></label>
        <input v-model="editedTransaction.crypto_amount" type="number" />

        <label><strong>Dinero:</strong></label>
        <input v-model="editedTransaction.money" type="number" step="0.01" />

        <label><strong>Fecha:</strong></label>
        <input v-model="editedTransaction.datetime" type="date" />

        <div>
          <button @click="guardarEditar">Guardar</button>
          <button @click="cancelarEditar">Cancelar</button>
        </div>
      </div>
    </div>-->

    <!-- Modal para editar transacción -->
    <div v-if="editingTransaction" class="modal" id="modal-editar">
      <h2>Editar transacción</h2>
      <table>
        <tr>
          <td><strong>Acción:</strong></td>
          <td><input v-model="editedTransaction.action" type="text" /></td>
        </tr>
        <tr>
          <td><strong>Crypto:</strong></td>
          <td><input v-model="editedTransaction.crypto_code" type="text" /></td>
        </tr>
        <tr>
          <td><strong>Cantidad:</strong></td>
          <td><input v-model="editedTransaction.crypto_amount" type="number" /></td>
        </tr>
        <tr>
          <td><strong>Dinero:</strong></td>
          <td><input v-model="editedTransaction.money" type="number" step="0.01" /></td>
        </tr>
        <tr>
          <td><strong>Fecha:</strong></td>
          <td><input v-model="editedTransaction.datetime" type="date" /></td>
        </tr>
        <div>
        <div class="button-container">
            <button @click="guardarEditar">Guardar</button>
        </div>
          <span class="material-symbols-outlined" id="cerrar_vender" @click="cancelarEditar">close</span>
        </div>
      </table>
    </div>



    <!-- Modal para mostrar los detalles de la transacción seleccionada -->
    <div v-if="selectedTransaction" class="modal" id="modal-ver">
      <h2>Detalles de la transacción</h2>
      <table>
        <tr>
          <td><strong>Acción:</strong></td>
          <td>{{ selectedTransaction.action }}</td>
        </tr>
        <tr>
          <td><strong>Crypto:</strong></td>
          <td>{{ selectedTransaction.crypto_code }}</td>
        </tr>
        <tr>
          <td><strong>Cantidad:</strong></td>
          <td>{{ selectedTransaction.crypto_amount }}</td>
        </tr>
        <tr>
          <td><strong>Dinero:</strong></td>
          <td>${{ selectedTransaction.money }}</td>
        </tr>
        <tr>
          <td><strong>Fecha:</strong></td>
          <td>{{ (selectedTransaction.datetime) }}</td>
        </tr>
      </table>
      <span class="material-symbols-outlined" id="cerrar_vender" @click="selectedTransaction = null">close</span>
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
      selectedTransaction: null, // Nueva propiedad para almacenar datos de transacciones seleccionados
      editingTransaction: null, // Nueva propiedad para almacenar la transacción que se está editando
      editedTransaction: {}, // Nueva propiedad para almacenar los datos de transacción editados
    };
  },
  computed: {
    ...mapState({
      usuario: "usuario",
    })
  },
  methods: {
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    deleteTransaction(transactionId) {
      const apiUrl = `https://laboratorio3-5459.restdb.io/rest/transactions/${transactionId}`;

      axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': '64a57c2b86d8c50fe6ed8fa5',
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
    fetchTransactions() {
      const userId = this.usuario;

      axios.get(`https://laboratorio3-5459.restdb.io/rest/transactions?q={"user_id": "${userId}"}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': '64a57c2b86d8c50fe6ed8fa5',
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
      this.fetchTransactions();
      // Mostrar el modal
      this.mostrar = true;
    },
    showDetails(transaction) {
      this.selectedTransaction = transaction;
    },
    editTransaction(transaction) {
      this.editingTransaction = transaction;
      // Crea una copia de la transacción para evitar modificar el original hasta guardar
      this.editedTransaction = { ...transaction };
    },
    guardarEditar() {
      const apiUrl = `https://laboratorio3-5459.restdb.io/rest/transactions/${this.editingTransaction._id}`;

      axios
        .patch(apiUrl, this.editedTransaction, {
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '64a57c2b86d8c50fe6ed8fa5', // Replace with your RestDB API Key
          },
        })
        .then(response => {
          // Update the local transactions array with the edited transaction
          const index = this.transactions.findIndex(
            transaction => transaction._id === this.editingTransaction._id
          );
          if (index !== -1) {
            this.transactions[index] = this.editedTransaction;
          }

          // Close the edit modal
          this.editingTransaction = null;
          this.editedTransaction = {};
        })
        .catch(error => {
          console.error('Error al editar la transacción:', error);
        });
    },
    cancelarEditar() {
      this.editingTransaction = null;
      this.editedTransaction = {};
    },
  },
  mounted() {
    // Se llama a fetchTransactions() al montar el componente
    this.fetchTransactions();
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
  margin-top: 1.375rem; 
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
  border: 1px solid #e5e5e5;
  text-align: center;
  padding: 8px; 
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
.btn-edit { 
  background-color: #0093ff; 
  color: white; 
}
.btn-delete {
  background-color: #f44336;
  color: white;
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

 @import '../assets/home.css'
</style>
