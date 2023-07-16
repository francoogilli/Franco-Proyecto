<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <form @submit.prevent="validarFormulario" class="sign-in-form">
          <h2 class="title">Iniciar Sesión</h2>
          <div class="input-field">
            <i class="fas fa-user" id="user-icon"></i>
            <input type="text" v-model="usuario" placeholder="Usuario" />
          </div>
          <input type="submit" value="Ingresar" class="btn solid" id="ingresar-btn" />
          <p v-show="error" class="error-message">Por favor, ingrese al menos un carácter.</p>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>¿Cómo Ingresar?</h3>
          <p>Para poder ingresar, coloque su nombre y apellido, o el usuario que usted desee.</p>
        </div>
        <img src="../assets/img/hero.png" class="image" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
  name: 'LoginView',
  data() {
    return {
      usuario: '',
      error: false
    };
  },
  methods: {
    validarFormulario() {
      
      if (this.usuario.trim().length > 0) {
        // Si se ingresó al menos un carácter, guardar el nombre de usuario en el store
        this.$store.commit('actualizarUsuario', this.usuario);
        // Redirigir a la vista 'Home'
        this.$router.push('/home');
      } else {
        // Mostrar el mensaje de error
        this.error = true;
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
input {
  font-family: "Poppins", sans-serif;
}

.container {
  width: 100%;
  background-color: rgb(236, 240, 243);
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Poppins';
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 35%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
  border-radius: 1.5rem;
    background:rgb(236, 240, 243);
    box-shadow: rgb(203, 206, 209) 10px 10px 20px, rgb(255, 255, 255) -10px -10px 20px;
    padding-top: 7rem;
    padding-bottom: 7rem;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}


form.sign-in-form {
  z-index: 2;

}

.title {
  font-size: 2.2rem;
  color: #272727;
  margin-bottom: 0.625rem;
}

.input-field {
  max-width: 23.75rempx;
  width: 100%;
  background-color: #f2f2f2;;
  margin: 0.625rem 0;
  height: 3.4375rem;
  border-radius: 1.25rem;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
  border: none;
    background: transparent;
    padding: 0 1.25rem;
    font-size: 1.125rem;
    box-sizing: border-box;
    outline: none;
    box-shadow: -4px -4px 10px rgba(255,255,255,1),
               inset 4px 4px 10px rgba(0,0,0,0.05),
               inset -4px -4px 10px rgba(255,255,255,1),
               4px 4px 10px rgba(0,0,0,0.05)

}



.input-field i {
  text-align: center;
  line-height: 3.4375rem;
  color: #212020;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 650;
  font-size: 1.1rem;
  color: #4b4b4b;
}

.input-field input::placeholder {
  color: #ccc;
  font-weight: 500;
}


#toggle{
  position: absolute;
  top: 50%;
  right: 1.25rem;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;

  background-size: cover;
  cursor: pointer;
}

#toggle.hide{
  
  background-size: cover;
}






.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}





.btn {
  width: 9.375rem;
  background-color:rgb(236, 240, 243);
  border: none;
  outline: none;
  height: 3.0625rem;
  border-radius: 1.25rem;
  color: #272727;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.9375rem;
  margin: 0.625rem 0;
  cursor: pointer;
  transition: 0.5s;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.2);
}

.btn:active{
  box-shadow: -4px -4px 10px rgba(255,255,255,1), inset 4px 4px 10px rgba(0,0,0,0.05), inset -4px -4px 10px rgba(255,255,255,1), 4px 4px 10px rgba(0,0,0,0.05);
  color: #3d3d3d;
  transition: 0.4s;

}

.btn:hover {
  transition: 0.4s;
  transform: scale(1.04);
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 125rem;
  width: 125rem;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #0037ff 0%, #ffffff 100%);
  transition: 1.8s ease-in-out;
  border-radius: 30%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}



.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
  padding-top: 4rem;
}

.panel h3 {
  font-weight: 700;
  line-height: 3;
  font-size: 2.5rem;
}

.panel p {
  font-size: 1.15rem;
  padding: 0.7rem 0;
  font-weight: 500;
}





/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}


.container.sign-up-mode .left-panel {
  pointer-events: none;
}



@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }


  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 12.5rem;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }


  .container:before {
    width: 93.75rem;
    height: 93.75rem;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }


  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 35.625rem) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}

.error-message {
  font-family: 'Poppins';
  font-weight: bold;
  color: rgb(255, 55, 0);
  margin-top: 5px;
}

</style>


