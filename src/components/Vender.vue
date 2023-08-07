<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">
        swap_vert
      </span>
      <button id="comprar" @click="mostrar = true">Vender</button>
    </div>
  </div>

  <div v-if="mostrar" class="modal-overlay">
    <div class="modal" id="modal_comprar" v-show="mostrar">
      <div class="dropdown">
        <div class="select" @click="menuDesplegable" :class="{ 'select-clicked': abrirMenu }">
          <span class="selected">{{ opcionSeleccionada }}</span>
          <span class="material-symbols-outlined" id="expand_more" :class="{ rotated: abrirMenu }">
            expand_more
          </span>
        </div>
        <ul class="menu" :class="{ 'menu-open': abrirMenu }">
          <li v-for="(opcion, index) in opciones" :key="index" @click="seleccionarOpcion(opcion)" :class="{ active: opcion === opcionSeleccionada }">
            {{ opcion }}
          </li>
        </ul>
      </div>
      <div class="input-field">
        <input type="number" min="0" v-model="cantidad" placeholder="Cantidad" />
      </div>
      <input type="submit" value="Vender" class="btn solid" id="ingresar-btn" @click="vender" />
      <div class="card">
        <div class="wrapper">
          <p id="mostrarPrecio">{{cantidad}} {{ opcionSeleccionada }} = ${{precioTotal}}</p>
        </div>
      </div>
      <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrar = false">
        close
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'Vender',
  data() {
    return {
      mostrar: false,
      abrirMenu: false,
      opciones: ["AAVE" , "ADA" , "ALGO" , "AXS" , "BAT" , "BCH" , "BTC" , "BUSD" , "CHZ" , "DAI" , "DOGE" , "DOT" , "ETH" , "FTM" , "LINK" , "LTC" , "MANA" , "MATIC" , "PAXG" , "SAND" , "SHIB" , "SOL" , "TRX" , "UNI" , "USDC" , "USDP" , "USDT" , "XRP"],
      opcionSeleccionada: "AAVE",
      cantidad: 1, // La cantidad ingresada por defecto será 1
      precio: null, // Para almacenar el precio obtenido de la API
      fechaHoraCompra: null
    };
  },
  computed: {
    precioTotal() {
    if (this.precio && this.cantidad) {
      const precioTotal = this.cantidad * this.precio;
      return precioTotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return '0.00';
  },
    ...mapState({
      usuario:"usuario",
    })
  },
  methods: {
    menuDesplegable() {
      this.abrirMenu = !this.abrirMenu;
    },
    seleccionarOpcion(opcion) {
      this.opcionSeleccionada = opcion;
      this.abrirMenu = false;
    },
    vender() {

      if (this.cantidad > 0) {
        const fechaHoraActual = new Date();
        
        // Formatear la fecha y hora en "DD-MM-YYYY hh:mm"
        const dia = String(fechaHoraActual.getDate()).padStart(2, '0');
        const mes = String(fechaHoraActual.getMonth() + 1).padStart(2, '0');
        const anio = fechaHoraActual.getFullYear();
        const horas = String(fechaHoraActual.getHours()).padStart(2, '0');
        const minutos = String(fechaHoraActual.getMinutes()).padStart(2, '0');

        this.fechaHoraCompra = `${mes}-${dia}-${anio} ${horas}:${minutos}`;
        let json={ 
          "user_id":this.usuario,
          "action": "sale", 
          "crypto_code":this.opcionSeleccionada, 
          "crypto_amount":this.cantidad, 
          "money":this.precioTotal,
          "datetime":this.fechaHoraCompra 
        }
        axios.post('https://labor3-d60e.restdb.io/rest/transactions',json,{
          headers:{
            'Content-Type':'application/json',
            'x-apikey':'64a2e9bc86d8c525a3ed8f63',
          },
        }).then(data=>{
          console.log(data)
        })
        .catch(error => {
          console.error('Error al realizar la solicitud POST:', error);
        })
        
        
      }

    },
    actualizarPrecio() {
      // Validamos que la cantidad sea mayor que cero antes de hacer la petición
      if (this.cantidad > 0) {
        axios.get(`https://criptoya.com/api/bitso/${this.opcionSeleccionada.toLowerCase()}/ars/${this.cantidad}`)
          .then(response => {
            this.precio = parseFloat(response.data.bid);
          })
          .catch(error => {
            console.error('Error al obtener el precio:', error);
            this.precio = null;
          });
      } else {
        // Si la cantidad es cero o negativa, dejamos el precio como nulo
        this.precio = null;
      }
    },
  },
  watch: {
    opcionSeleccionada: {
      handler() {
        this.actualizarPrecio();
      },
    },
    cantidad: {
      handler() {
        this.actualizarPrecio();
      },
    },
  },
  created() {
    this.actualizarPrecio();
  },
}
</script>

<style scoped>
.modal .card{
  background: rgb(255, 213, 0);
}
.rotated {
  transform: rotate(180deg);
  transition: transform 0.2s ease;

}
@import '../assets/home.css'
</style>
