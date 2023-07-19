<template>
    <div class="card">
        <div class="wrapper">
            <span class="material-symbols-outlined">
                timeline
                </span>
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
      <tr>
        <td>Compra</td>
        <td>USDT</td>
        <td>1.2</td>
        <td>$618</td>
        <td>2023-07-18</td>
        <td>
          <button class="btn-view">Ver</button>
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Borrar</button>
        </td>
      </tr>
      <tr>
        <td>Venta</td>
        <td>BTC</td>
        <td>0.007</td>
        <td>$107,835</td>
        <td>2023-07-18</td>
        <td>
          <button class="btn-view">Ver</button>
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Borrar</button>
        </td>
      </tr>
    </tbody>
  </table>
        <span class="material-symbols-outlined" id="cerrar_vender" @click="mostrar = false">close</span>
    </div>
</template>

<script>
export default {
    name:'Historial',
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


/* Styling buttons in the Options column */
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