<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">timeline</span>
      <button @click="mostrar = true">Historial</button>
    </div>
  </div>

  <div class="modal" id="modal_vender" v-show="mostrar">
    <table>
      <thead>
        <tr>
          <th>Acción</th>
          <th>Crypto</th>
          <th>Cantidad</th>
          <th>Dinero (en $ARS)</th>
          <th>Fecha</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction._id">
          <td>{{ transaction.action }}</td>
          <td>{{ transaction.crypto_code }}</td>
          <td>{{ transaction.crypto_amount }}</td>
          <td>{{ transaction.money }}</td>
          <td>{{ formatDate(transaction.datetime) }}</td>
          <td>
            <button class="btn-view">Ver</button>
            <button class="btn-edit">Editar</button>
            <button class="btn-delete" @click="deleteTransaction(transaction._id)">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <span class="material-symbols-outlined" id="cerrar_vender" @click="mostrar = false">close</span>
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
      transactions: [], // Array to store fetched transactions
    };
  },
  mounted() {
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
  computed: {
    ...mapState({
      usuario: "usuario",
    })
  },
  methods: {
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    deleteTransaction(transactionId) {
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
    }
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
th, td {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px; 
  } 
th { 
  background-color: #dddddd; 
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
  background-color: #4CAF50;
  color: white;
} 
.btn-edit { 
  background-color: #2196F3; 
  color: white; 
}
.btn-delete {
  background-color: #f44336;
  color: white;
}
 @import '../assets/home.css'
</style>
