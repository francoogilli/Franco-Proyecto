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
    fetchPrecio() {
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
        this.fetchPrecio();
      },
    },
    cantidad: {
      handler() {
        this.fetchPrecio();
      },
    },
  },
  created() {
    this.fetchPrecio();
  },
}
</script>

<style scoped>
@import '../assets/home.css'
</style>
