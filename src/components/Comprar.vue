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
        <span class="material-symbols-outlined" id="expand_more">
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
    <div class="card">
      <div class="wrapper">
        <p id="mostrarPrecio">{{cantidad}} {{ selectedOption }} = ${{precioTotal}}</p>
      </div>
    </div>
    <span class="material-symbols-outlined" id="cerrar_comprar" @click="mostrar = false">
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
      opciones: ["BTC", "ETH", "USDT", "USDC", "DAI"],
      selectedOption: "BTC",
      cantidad: 1, // La cantidad ingresada por defecto será 1
      precio: null, // Para almacenar el precio obtenido de la API
      fechaHoraCompra: null
    };
  },
  computed: {
    precioTotal() {
      if (this.precio && this.cantidad) {

        const precioTotal = this.cantidad * this.precio;
        return Math.round(precioTotal).toLocaleString();
        
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
        axios.post('https://laboratorio3-5459.restdb.io/rest/transactions',json,{
          headers:{
            'Content-Type':'application/json',
            'x-apikey':'64a57c2b86d8c50fe6ed8fa5',
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
        axios.get(`https://criptoya.com/api/bybit/${this.selectedOption.toLowerCase()}/ars/${this.cantidad}`)
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
@import '../assets/home.css'
</style>
