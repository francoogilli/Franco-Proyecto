<template>
  <NavBar />
  <div class="container">
    <Comprar/>
    <Vender/>
    <EstadoActual/>
    <Historial/>

  </div>
    

</template>

<script>
import ComposicionCartera from '@/components/ComposicionCartera.vue';
import NavBar from '@/components/NavBar.vue';
import Comprar from'@/components/Comprar.vue';
import Vender from'@/components/Vender.vue';
import EstadoActual from '@/components/EstadoActual.vue';
import Historial from '@/components/Historial.vue';


export default {
  name: 'Home',
  components: {
    NavBar,Comprar,Vender,EstadoActual,Historial,ComposicionCartera,
  }
}
</script>


<style scoped>

.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 76vh; 
  margin-left: 8px;
  margin-right: 8px;
}
</style>