<template>
  <div class="card">
    <div class="wrapper">
      <span class="material-symbols-outlined">
        currency_bitcoin
      </span>
      <button id="comprar" @click="mostrar = true">Comprar</button>
    </div>
  </div>

  <div class="modal" id="modal_comprar" v-show="mostrar">
    <div class="dropdown">
      <div class="select" @click="toggleMenu" :class="{ 'select-clicked': menuOpen }">
        <span class="selected">{{ selectedOption }}</span>
        <span class="material-symbols-outlined" id="expand_more" :class="{ rotated: menuOpen }">
          expand_more
        </span>
      </div>
      <ul class="menu" :class="{ 'menu-open': menuOpen }">
        <li v-for="(opcion, index) in opciones" :key="index" @click="selectOption(opcion)" :class="{ active: opcion === selectedOption }">
          {{ opcion }}
        </li>
      </ul>
    </div>
    <div class="input-field">
      <input type="number" min="0" v-model="cantidad" placeholder="Cantidad" />
    </div>
    <input type="submit" value="Comprar" class="btn solid" id="ingresar-btn" @click="comprar" />
    <div v-if="compraExitosa" class="success-message">Compra realizada exitosamente</div>

    <div class="card">
      <div class="wrapper">
        <p id="mostrarPrecio">{{cantidad}} {{ selectedOption }} = ${{precioTotal}}</p>
      </div>
    </div>
    <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrar = false">
      close
    </span>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'Comprar',
  data() {
    return {
      mostrar: false,
      menuOpen: false,
      opciones: ["AAVE" , "ADA" , "ALGO" , "AXS" , "BAT" , "BCH" , "BTC" , "BUSD" , "CHZ" , "DAI" , "DOGE" , "DOT" , "ETH" , "FTM" , "LINK" , "LTC" , "MANA" , "MATIC" , "PAXG" , "SAND" , "SHIB" , "SOL" , "TRX" , "UNI" , "USDC" , "USDP" , "USDT" , "XRP"],
      selectedOption: "AAVE",
      cantidad: 1, // La cantidad ingresada por defecto será 1
      precio: null, // Para almacenar el precio obtenido de la API
      fechaHoraCompra: null,
      compraExitosa: false
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
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    selectOption(opcion) {
      this.selectedOption = opcion;
      this.menuOpen = false;
    },
    comprar() {

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
          "action": "purchase", 
          "crypto_code":this.selectedOption, 
          "crypto_amount":this.cantidad, 
          "money":this.precioTotal,
          "datetime":this.fechaHoraCompra 
        }
        axios.post('https://laboratorio-36cf.restdb.io/rest/transactions',json,{
          headers:{
            'Content-Type':'application/json',
            'x-apikey':'64a5ccf686d8c5d256ed8fce',
          },
        }).then(data=>{
          console.log(data);
          this.compraExitosa = true;
          setTimeout(() => {
            this.compraExitosa = false; // Ocultar el mensaje después de 3 segundos
              
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
        axios.get(`https://criptoya.com/api/bitso/${this.selectedOption.toLowerCase()}/ars/${this.cantidad}`)
          .then(response => {
            this.precio = parseFloat(response.data.ask);
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
    selectedOption: {
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
.rotated {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
.success-message {
  font-weight: 700;
  position: fixed;
  top: 70%; /* Alinear el mensaje en el centro vertical de la pantalla */
  left: 50%; /* Alinear el mensaje en el centro horizontal de la pantalla */
  transform: translate(-50%, -50%); /* Centrar el mensaje exactamente en el centro */
  color: #2eff59;
  width: 100%;
  display: grid;
  place-items: center;
}
.menu {
  max-height: 341px; /* Set the maximum height for the menu to create a scrollbar */
  overflow-y: auto; /* Enable vertical scrollbar when the content overflows */
  scrollbar-width: thin; /* For Firefox */
}

/* Customize the scrollbar for WebKit browsers (Chrome, Safari, Opera) */
.menu::-webkit-scrollbar {
  width: 8px;
}

.menu::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 8px;
}

.menu::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* Customize the scrollbar for other browsers */


.menu::-webkit-scrollbar-thumb {
  background-color: #888;
}

.menu::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

@import '../assets/home.css'
</style>
