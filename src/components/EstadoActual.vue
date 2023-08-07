<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">
        query_stats
      </span>
      <button @click="mostrarModal">Estado actual</button>
      <button @click="mostrarGrafico">Composicion</button>

    </div>
  </div>

  <div v-if="mostrar" class="modal-overlay">
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
            <td :class="{'ganancia': resultado(amount) > 0, 'perdida': resultado(amount) < 0}">
          ${{ resultado(amount).toFixed(2) }}
        </td>
          </tr>
        </tbody>
      </table>
      <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrar = false">close</span>
    </div>
  </div>

  <div v-if="mostrarGrafica" class="modal-overlay">
    <div class="modal" id="modalGrafica" v-show="mostrarGrafica">
      
      <div class="chart-container">
        <CircularChart :labels="cryptoLabels" :data="cryptoAmounts" />
      </div>
      <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrarGrafica = false">close</span>
    </div>
  </div>
  
</template>

<script>
import CircularChart from './CircularChart.vue'; 
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'EstadoActual',
  components: {
    CircularChart, // Registrar el componente CircularChart
  },
  data() {
    return {
      mostrarGrafica:false,
      mostrar: false,
      netAmounts: {},
    };
  },
  computed: {
    ...mapState({
      usuario: "usuario",
    }),
    cryptoLabels() {
      return Object.keys(this.netAmounts);
    },
    cryptoAmounts() {
      return Object.values(this.netAmounts).map(amount => amount.cryptoAmount.toFixed(6));
    },
  },
  methods: {
    resultado(amount) {
      return amount.ganancia + amount.askInMoney;
    },
    async fetchTransactions(userId) {
      const apiUrl = `https://labor3-d60e.restdb.io/rest/transactions?q={"user_id": "${userId}"}`;
      const apiKey = '64a2e9bc86d8c525a3ed8f63'; 

      const config = {
        headers: {
          'x-apikey': apiKey,
        },
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
      const apiUrl = `https://criptoya.com/api/bitso/${crypto_code.toLowerCase()}/ars/1`;

      try {
        const response = await axios.get(apiUrl);
        const cryptoValue = parseFloat(response.data.bid);
        const valueCrypto = parseFloat(response.data.ask);

        return [valueCrypto, cryptoValue];
      } catch (error) {
        console.error(`Error al obtener el precio de ${crypto_code}:`, error);
        return [0, 0];
      }
    },

    async calculateNetAmountByCrypto(transactions) {
      const cryptoAmounts = {};

      for (const transaction of transactions) {
        const { crypto_code, action, crypto_amount, money } = transaction;
        const amount = parseFloat(crypto_amount);
        const moneyValue = parseFloat(money);

        if (!cryptoAmounts[crypto_code]) {
          cryptoAmounts[crypto_code] = {
            cryptoAmount: 0,
            askInMoney: 0,
            valueInMoney: 0,
            ganancia: 0,
            precioCompra: 0,
          };
        }

        if (action === 'purchase') {
          cryptoAmounts[crypto_code].cryptoAmount += amount;
          cryptoAmounts[crypto_code].ganancia -= moneyValue; // Restar el valor en dinero (money) para compras
        } else if (action === 'sale') {
          cryptoAmounts[crypto_code].cryptoAmount -= amount;
          cryptoAmounts[crypto_code].ganancia += moneyValue; // Sumar el valor en dinero (money) para ventas
        }

        const [valueCrypto, cryptoValue] = await this.fetchCryptoValue(crypto_code);
        const valueInMoney = cryptoValue * cryptoAmounts[crypto_code].cryptoAmount;
        const askInMoney = valueCrypto * cryptoAmounts[crypto_code].cryptoAmount;
        cryptoAmounts[crypto_code].valueInMoney = valueInMoney;
        cryptoAmounts[crypto_code].askInMoney = askInMoney;

        // Agregar el cálculo de ganancia o pérdida considerando el precio de compra
        const precioCompraTotal = cryptoAmounts[crypto_code].precioCompra * cryptoAmounts[crypto_code].cryptoAmount;
        cryptoAmounts[crypto_code].ganancia += precioCompraTotal;
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
    async mostrarGrafico() {
      this.mostrarGrafica = true; // Show the modal

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

@import '../assets/home.css';

/* Estilos para las celdas de ganancia o pérdida */
td.ganancia {
  background: rgb(0, 255, 0);
  font-weight: bold;
  color: white;
}

td.perdida {
  background: red;
  font-weight: bold;
  color: white;
}

#modalGrafica {
  width: 41.1875rem;
  height: 40.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
