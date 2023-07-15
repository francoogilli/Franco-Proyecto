<template>
    <div class="card">
        <div class="wrapper">
            <span class="material-symbols-outlined">
                swap_vert
                </span>
            <button id="comprar" @click="mostrar = true">Vender</button>
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
            
            <input type="number" min="0" placeholder="Cantidad" />
          </div>
          <input type="submit" value="Vender" class="btn solid" id="ingresar-btn" />
          <div class="card">
            <div class="wrapper">
                
                <p>1 BTC = AR $14,922,900</p>
            </div>
        </div>
        <span class="material-symbols-outlined" id="cerrar_comprar" @click="mostrar = false">
            close
            </span>
    </div>
</template>

<script>
export default {
    name:'Vender',
    data() {
      return {
        mostrar:false,
        menuOpen: false,
        opciones: ["BTC", "ETH", "USDT","USDC","DAI"],
        selectedOption: "Elegir moneda",
      };
    },
    methods: {
      toggleMenu() {
        this.menuOpen = !this.menuOpen;
      },
      selectOption(opcion) {
        this.selectedOption = opcion;
        this.menuOpen = false;
      }
    }
}
</script>


<style scoped>
@import '../assets/home.css';
.modal .card {
    
    background: #faff1d;
}
</style>