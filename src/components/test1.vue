<template>
  <label
    class="v-radio"
    :class="[    
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },     
      { 'is-checked': model === label }
    ]"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="v-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="v-radio__inner"></span>
      <input
        ref="radio"
        class="v-radio__original"
        :value="label"
        type="radio"      
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"       
      >
    </span>
    <span class="v-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script> 
  export default {
    name: 'vRadio',     
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String,    
      size: String
    },
    data() {
      return {
        focus: false
      };
    },
    computed: {
  
      model: {
        get() {
          console.log(this.$refs.radio,this.label)      
          return  this.value
        },
        set(val) {          
          this.$emit('input', val);   
          console.log(this.model === this.label,this.$refs.radio,this.$refs.radio.checked,this.model,this.label)      
          this.$refs.radio && (this.$refs.radio.checked = this.model === this.label);
        },
        
      },    
      isDisabled() {
       
        return this.disabled 
      },    
    },
    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.$emit('change', this.model,this.label);
          console.log(this.model)         
        });
      }
    }
  };
</script>