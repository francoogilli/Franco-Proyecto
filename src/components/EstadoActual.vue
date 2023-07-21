<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">
        query_stats
      </span>
      <button @click="mostrar = true">Estado actual</button>
    </div>
  </div>

  <div class="modal" id="modalEstadoActual" v-show="mostrar">
    <table>
      <thead>
        <tr>
          <th>Crypto</th>
          <th>Cantidad Neta</th>
          <th>Valor en Dinero</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(amount, crypto_code) in netAmounts" :key="crypto_code">
          <td>{{ crypto_code }}</td>
          <td>{{ amount.cryptoAmount.toFixed(6) }}</td>
          <td>${{ amount.valueInMoney.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <span class="material-symbols-outlined" @click="mostrar = false">close</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'EstadoActual',
  data() {
    return {
      mostrar: false,
      netAmounts: {},
    };
  },
  computed: {
    ...mapState({
      usuario: "usuario",
    })
  },
  methods: {
    async fetchTransactions(userId) {
      const apiUrl = `https://laboratorio-36cf.restdb.io/rest/transactions?q={"user_id": "${userId}"}`;
      const apiKey = '64a5ccf686d8c5d256ed8fce'; // Reemplaza "TU_API_KEY" por tu API Key proporcionada por la API
      
      const config = {
        headers: {
          'x-apikey': apiKey
        }
      };

      try {
        const response = await axios.get(apiUrl, config);
        return response.data;
      } catch (error) {
        console.error('Error al obtener las transacciones:', error);
        return [];
      }
    },

    async fetchCryptoValue(crypto_code) {      
      const apiUrl = `https://criptoya.com/api/bybit/${crypto_code.toLowerCase()}/ars/1`;

      try {
        const response = await axios.get(apiUrl);
        return parseFloat(response.data.bid);
      } catch (error) {
        console.error(`Error al obtener el precio de ${crypto_code}:`, error);
        return 0;
      }
    },

    async calculateNetAmountByCrypto(transactions) {
      const cryptoAmounts = {};

      for (const transaction of transactions) {
        const { crypto_code, action, crypto_amount } = transaction;
        const amount = parseFloat(crypto_amount);

        if (!cryptoAmounts[crypto_code]) {
          cryptoAmounts[crypto_code] = { cryptoAmount: 0, valueInMoney: 0 };
        }

        if (action === 'purchase') {
          cryptoAmounts[crypto_code].cryptoAmount += amount;
        } else if (action === 'sale') {
          cryptoAmounts[crypto_code].cryptoAmount -= amount;
        }
        
        const cryptoValue = await this.fetchCryptoValue(crypto_code);
        const valueInMoney = cryptoValue * cryptoAmounts[crypto_code].cryptoAmount;
        cryptoAmounts[crypto_code].valueInMoney = valueInMoney;
      }

      return cryptoAmounts;
    },
  },

  async mounted() {
    const userId = this.usuario; // Reemplaza "TU_USER_ID" por el ID del usuario para el cual deseas obtener las transacciones

    try {
      const transactions = await this.fetchTransactions(userId);
      this.netAmounts = await this.calculateNetAmountByCrypto(transactions);
    } catch (error) {
      console.error('Error en el proceso:', error);
    }
  },
};
</script>

<style scoped>
.modal{
    width: 60rem;
    height: 30rem;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 1.375rem;
  border-radius: 20px; /* Agregamos el border-radius para esquinas redondeadas */
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
td:nth-child(4) {
  font-weight: bold;
}

@import '../assets/home.css'

</style>
