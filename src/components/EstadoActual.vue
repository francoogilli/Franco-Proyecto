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
        <th>Cantidad</th>
        <th>Dinero</th>
        <th>Resultado</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>BTC</td>
        <td>2.5</td>
        <td>$30,000</td>
        <td>+$10,000</td>
      </tr>
      <tr>
        <td>ETH</td>
        <td>5.0</td>
        <td>$15,000</td>
        <td>+$5,000</td>
      </tr>
      <tr>
        <td>USDT</td>
        <td>100</td>
        <td>$1,000</td>
        <td>-$500</td>
      </tr>
      <tr>
        <td>USDC</td>
        <td>20</td>
        <td>$10,446</td>
        <td>+$236</td>
      </tr>
      <tr>
        <td>DAI</td>
        <td>9</td>
        <td>$5,546</td>
        <td>+$136</td>
      </tr>
      <!-- Añade más filas si es necesario -->
    </tbody>
  </table>
        <span class="material-symbols-outlined" @click="mostrar = false">close</span>
    </div>
</template>

<script>
export default {
    name:'EstadoActual',
    data(){
        return{
            mostrar:false
        };
    }
}
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