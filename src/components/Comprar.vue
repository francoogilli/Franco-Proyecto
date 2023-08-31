<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">
        currency_bitcoin
      </span>
      <button id="comprar" @click="mostrar = true">Comprar</button>
    </div>
  </div>
  <!-- Modal de compra -->
 <div v-if="mostrar" class="modal-overlay">
  <div class="modal" id="modal_comprar" v-show="mostrar">
    <!-- Menú desplegable para seleccionar la criptomoneda -->
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
    <!-- Campo de entrada para la cantidad a comprar -->
    <div class="input-field">
      <input type="number" min="0" v-model="cantidad" placeholder="Cantidad" />
    </div>
    <!-- Botón de compra -->
    <input type="submit" value="Comprar" class="btn solid" id="ingresar-btn" @click="comprar" />
    <!-- Mensaje de compra exitosa -->
    <div v-if="compraExitosa" class="success-message">¡Compra realizada correctamente!</div>
    <!-- Tarjeta para mostrar el precio total -->
    <div class="card">
      <div class="wrapper">
        <p id="mostrarPrecio">{{cantidad}} {{ opcionSeleccionada }} = ${{precioTotal}}</p>
      </div>
    </div>
    <!-- Botón para cerrar el modal -->
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
  name: 'Comprar',
  data() {
    return {
      mostrar: false, // Estado para controlar la visibilidad del modal
      abrirMenu: false, // Estado para controlar el menú desplegable de criptomonedas
      // Lista de opciones de criptomonedas ↓↓↓↓
      opciones: ["AAVE" , "ADA" , "ALGO" , "AXS" , "BAT" , "BCH" , "BTC" , "BUSD" , "CHZ" , "DAI" , "DOGE" , "DOT" , "ETH" , "FTM" , "LINK" , "LTC" , "MANA" , "MATIC" , "PAXG" , "SAND" , "SHIB" , "SOL" , "TRX" , "UNI" , "USDC" , "USDP" , "USDT" , "XRP"],
      opcionSeleccionada: "AAVE", // Opción de criptomoneda seleccionada por defecto
      cantidad: 1, // Cantidad de criptomoneda a comprar
      precio: null,  // Precio actual de la criptomoneda
      fechaHoraCompra: null, // Fecha y hora de la compra
      compraExitosa: false // Estado para mostrar el mensaje de "compra exitosa"
    };
  },
  computed: {
    // Cálculo del precio total de la compra    
    precioTotal() {
      if (this.precio && this.cantidad) {
        const precioTotal = (this.cantidad * this.precio).toFixed(2);
        return precioTotal;
      }
      return '0.00';
    },

    // Mapeo del estado del usuario desde Vuex
    ...mapState({
      usuario:"usuario",
    })
  },
  methods: {
    // Cambiar el estado del menú desplegable
    menuDesplegable() {
      this.abrirMenu = !this.abrirMenu;
    },
    // Seleccionar una opción de criptomoneda
    seleccionarOpcion(opcion) {
      this.opcionSeleccionada = opcion;
      this.abrirMenu = false;
    },
    // Realizar la compra de criptomonedas
    comprar() {
      if (this.cantidad > 0) {
        const fechaHoraActual = new Date();
        // Obtener componentes de la fecha y hora actual
        const dia = String(fechaHoraActual.getDate()).padStart(2, '0');
        const mes = String(fechaHoraActual.getMonth() + 1).padStart(2, '0');
        const anio = fechaHoraActual.getFullYear();
        const horas = String(fechaHoraActual.getHours()).padStart(2, '0');
        const minutos = String(fechaHoraActual.getMinutes()).padStart(2, '0');
        // Dar el formato de fecha y hora de la compra
        this.fechaHoraCompra = `${mes}-${dia}-${anio} ${horas}:${minutos}`;
        // Se envian los datos para la solicitud POST de compra
        let json={ 
          "user_id":this.usuario,
          "action": "purchase", 
          "crypto_code":this.opcionSeleccionada, 
          "crypto_amount":this.cantidad, 
          "money":this.precioTotal,
          "datetime":this.fechaHoraCompra 
        }
        // Realizar la solicitud POST a la API
        axios.post('https://labor3-d60e.restdb.io/rest/transactions',json,{
          headers:{
            'Content-Type':'application/json',
            'x-apikey':'64a2e9bc86d8c525a3ed8f63',
          },
        }).then(data=>{
          console.log(data);
          // Mostrar mensaje de compra exitosa y luego se oculta
          this.compraExitosa = true;
          setTimeout(() => {
            this.compraExitosa = false; 
              
          }, 3000);
        })
        .catch(error => {
          console.error('Error al realizar la solicitud POST:', error);
        })
        
        
      }

    },
    actualizarPrecio() {
      // Validamos que la cantidad sea mayor que cero antes de hacer la petición
      if (this.cantidad > 0) {
        // Obtener el precio de la cripto atraves de la API de CryptoYa
        axios.get(`https://criptoya.com/api/bitso/${this.opcionSeleccionada.toLowerCase()}/ars/${this.cantidad}`)
          .then(response => {
            this.precio = parseFloat(response.data.ask);
          })
          .catch(error => {
            console.error('Error al obtener el precio:', error);
            this.precio = null;
          });
      } else {
        
        this.precio = null;
      }
    },
  },
  watch: {
    // Actualizamos el precio cuando la opción de la criptomoneda cambie
    opcionSeleccionada: {
      handler() {
        this.actualizarPrecio();
      },
    },
    cantidad: {
      // Actualizamos el precio cuando la cantidad seleccionada cambie
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

.rotated {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
/*Estilos para el mensaje de 'Compra exitosa'*/
.success-message {
  font-weight: 700;
  position: fixed;
  top: 70%; 
  left: 50%; 
  transform: translate(-50%, -50%);
  color: rgb(0 255 104);;
  width: 100%;
  display: grid;
  place-items: center;
}



@import '../assets/home.css'
</style>
