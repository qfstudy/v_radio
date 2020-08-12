<template>
  <div>
     <v-test v-model="radio" label="1">备选项</v-test>
  <v-test v-model="radio" label="2">备选项</v-test>
    <!-- <v-radio v-model="value" label="1" @change="test" @ddfdj="ddfdj">的地方都</v-radio> -->
    <!-- <v-radio v-model="value1" label="2" @change="test1" @ddfdj="ddfdj">打广告</v-radio> -->
    <!-- <v-test :value="value" label="ds6d"></v-test>
    <v-test :value="value" label="dsd"></v-test> -->
  </div>
</template>
<script>
export default {};
</script>

<script>
import vRadio from './vRadio'
import vTest from './test1.vue'

export default {
  name: "HelloWorld",
  data() {
    return {
      value: '6',
      value1: '3',
      radio: ''
    };
  },
  components: {
    vRadio,
    vTest
  },
  methods: {
    test(e){    
      console.log(this.value)
    },
    test1(e){    
      console.log(this.value1)
    },
    ddfdj(vlaue){
      console.log('56526',vlaue)
    }
  }
};
</script>

<style scoped>

</style>
