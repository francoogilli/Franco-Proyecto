<template>
    <div class="card">
    <div class="wrapper">
        <span class="material-symbols-outlined">
            data_usage
        </span>
      <button id="comprar" @click="mostrar = true">Composicion</button>
    </div>
  </div>
  <div v-if="mostrar" class="modal-overlay">
  <div class="modal" id="modal_comprar" v-show="mostrar">   
    <CircularChart />
    <span class="material-symbols-outlined" id="cerrarSpan" @click="mostrar = false">close</span>
  </div>
 </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import CircularChart from "./CircularChart.vue";

export default {   
    name:'ComposicionCartera',
    components: {
    CircularChart,
    },
    data() {
        return {
        mostrar: false,
        };
        
    },
    
    
}
</script>

<style scoped>

.modal{
    width: 41.1875rem;
    height: 40.625rem;
}
@import '../assets/home.css'
</style>