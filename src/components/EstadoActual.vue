<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">
        query_stats
      </span>
      <button @click="mostrarModal">Estado actual</button>
    </div>
  </div>

  <div class="modal" id="modalEstadoActual" v-show="mostrar">
    <table>
      <thead>
        <tr>
          <th>Crypto</th>
          <th>Cantidad Neta</th>
          <th>Valor en Dinero</th>
          <th>Resultado</th> 
        </tr>
      </thead>
      <tbody>
        <tr v-for="(amount, crypto_code) in netAmounts" :key="crypto_code">
          <td>{{ crypto_code }}</td>
          <td>{{ amount.cryptoAmount.toFixed(6) }}</td>
          <td>${{ amount.valueInMoney.toLocaleString('es-AR') }}</td>
          <td :class="{'ganancia': getTotalGain(amount) >= 0, 'perdida': getTotalGain(amount) < 0}">
            {{ getTotalGain(amount).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', signDisplay: 'always' }) }}
          </td>
        </tr>
      </tbody>
    </table>
    <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrar = false">close</span>
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
    getTotalGain(amount) {
      return amount.ganancia + amount.cryptoAmount * amount.ask;
    },
    async fetchTransactions(userId) {
      const apiUrl = `https://labor3-d60e.restdb.io/rest/transactions?q={"user_id": "${userId}"}`;
      const apiKey = '64a2e9bc86d8c525a3ed8f63'; // Reemplaza "TU_API_KEY" por tu API Key proporcionada por la API
      
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
        return {
          bid: parseFloat(response.data.bid),
          ask: parseFloat(response.data.ask),
        };
      } catch (error) {
        console.error(`Error al obtener el precio de ${crypto_code}:`, error);
        return { bid: 0, ask: 0 };
      }
    },

    async calculateNetAmountByCrypto(transactions) {
      const cryptoAmounts = {};

      for (const transaction of transactions) {
        const { crypto_code, action, crypto_amount, money } = transaction;
        const amount = parseFloat(crypto_amount);
        const moneyValue = parseFloat(money);

        if (!cryptoAmounts[crypto_code]) {
          cryptoAmounts[crypto_code] = { cryptoAmount: 0, valueInMoney: 0, ganancia: 0, ask: 0 };
        }

        if (action === 'purchase') {
          cryptoAmounts[crypto_code].cryptoAmount += amount;
          cryptoAmounts[crypto_code].ganancia -= moneyValue; // Restar el valor en dinero (money) para compras
        } else if (action === 'sale') {
          cryptoAmounts[crypto_code].cryptoAmount -= amount;
          cryptoAmounts[crypto_code].ganancia += moneyValue; // Sumar el valor en dinero (money) para ventas
          const cryptoValue = await this.fetchCryptoValue(crypto_code);
          cryptoAmounts[crypto_code].ask = cryptoValue.ask;
        }
        
        const cryptoValue = await this.fetchCryptoValue(crypto_code);
        const valueInMoney = cryptoValue.bid * cryptoAmounts[crypto_code].cryptoAmount;
        cryptoAmounts[crypto_code].valueInMoney = Math.round(valueInMoney);
      }

      return cryptoAmounts;
    },

    async mostrarModal() {
      this.mostrar = true; // Show the modal

      try {
        const transactions = await this.fetchTransactions(this.usuario);
        this.netAmounts = await this.calculateNetAmountByCrypto(transactions);
      } catch (error) {
        console.error('Error en el proceso:', error);
      }
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
td:nth-child(1) {
  font-weight: bold;
}
td.ganancia {
  color: white;
  font-weight: bold;
  background: #00ff34;
}

td.perdida {
  color: white;
  font-weight: bold;
  background: red;
}
@import '../assets/home.css'

</style>
