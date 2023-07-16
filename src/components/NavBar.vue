<template>
  <nav>
  <div class="left">
    <a href="#">Crypto</a>
  </div>

  <div class="right">     
    <a href="#">
      <i class="fa-solid fa-user fa-sm" style="color: #000000;"></i>
      <span>{{usuario}}</span>
    </a>
  </div>
</nav>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name:'NavBar',
  computed:{
    ...mapState({
      usuario:"usuario",
    })
  }
 
} 
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  color: #1a1c20;
  background-color:rgb(236, 240, 243);
  max-width: 1400px;
  margin: 0 auto;
}

a {
  color: #4a76ee;
  text-decoration: none;
}

/* NAVBAR */
nav {
  font-family: 'Poppins';
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ebeef1;
  padding: 0 50px;
  height: 80px;
  margin-top: -7px;
  margin-left: -8px;
  margin-right: -8px;
}

nav .left a {
  color: #1a1c20;
  font-size: 22px;
  font-weight: 600;
}

nav .right a {
  color: #1a1c20;
  margin: 0 10px;
}

nav .right a:last-child {
  color: black;
  background-color: rgb(236, 240, 243);
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 1.25rem;
  box-shadow: -4px -4px 10px rgba(255,255,255,1), inset 4px 4px 10px rgba(0,0,0,0.05), inset -4px -4px 10px rgba(255,255,255,1), 4px 4px 10px rgba(0,0,0,0.05);
}

nav .right a span {
  margin-left: 5px;
}


</style>