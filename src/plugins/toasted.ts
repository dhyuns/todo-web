import Vue from 'vue';
import Toasted from 'vue-toasted';

const optionsTemp = {
    position: 'bottom-right',
    duration: 1000
  };

Vue.use(Toasted, optionsTemp);

export default Toasted;


