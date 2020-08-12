<template>
  <label class="v_radio_label">
    <span class="v_radio">
      <span
        class="v_radio_circle"
        :class="{'v_radio_circle--checked': radioValue}"
      >
      </span>
      <!-- <input               
        type="radio"
        class="v_radio_input"
        :value="label"
        name="radio"
        @change="$emit('change',$event.target.value)"
      /> -->
       <input              
        type="radio"
        class="v_radio_input"        
        :value="label"
        name="radio"          
        @change="test"
      />
    </span>
    <span class="v_radio_label" @keydown.stop>
      <slot>
      </slot>
    </span>
  </label>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      radioValue: false,     
    };
  },
  props: {
    value: '',
    label: ''
  }, 
  methods: {
    test($event){
      this.radioValue = false
      this.radioValue = $event.target.checked
      // console.log('999',$event.target.value)
      // console.log('00055',this.label,this.value,this.radioValue)
      this.$emit('change',$event.target.value)
      this.$emit('ddfdj',$event.target.checked)
      console.log($event.target.checked)
    }
  }
};
</script>

<style scoped>
.v_radio_circle {
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  display: inline-block;
  box-sizing: border-box;
  z-index: 999;
  transition: 0.15s ease-in;
}
.v_radio_circle--checked {
  border-color: #409eff;
  /* background-color: #409eff; */
}
.v_radio_circle--disable {
  cursor: not-allowed;
}
.v_radio_circle--checked:after {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #409eff;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
/* .v_radio_circle:after {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #409eff;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
} */
/* .v_radio_input {
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
} */
</style>