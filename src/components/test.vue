<template>
  <div>
    <label
      v-for="(item,index) in radioList"
      :key="item.value"
      :for="item.linkLabel"
      :accesskey="index"
    >
      <span class="content__input">
        <span
          class="radio__replace"
          :class="{'radio__replace--checked':selectedRadio===item.value,'radio__replace--disable':item.isDisabled}"
        >
        </span>
        <input
          v-model="selectedRadio"
          type="radio"
          class="radio__button"
          name="radio"
          :id="item.linkLabel"
          :tabindex="index"
          :value="item.value"
          :disabled="item.isDisabled"
          @focus="item.isFocus = true"
          @blur="item.isFocus = false"
        />
      </span>
      <span class="content__text">{{item.label}}</span>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radioList: [
        {
          linkLabel: "label1",
          value: "1",
          isDisabled: false,
          isFocus: false,
          label: "标签1",
        },
        {
          linkLabel: "label2",
          value: "2",
          isDisabled: false,
          isFocus: false,
          label: "标签2",
        },
        {
          linkLabel: "label3",
          value: "3",
          isDisabled: true,
          isFocus: false,
          label: "标签3",
        },
      ],
      selectedRadio: "1",
    };
  },
};
</script>

<style scoped>
.radio__replace {
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
.radio__replace--checked {
  border-color: #409eff;
  /* background-color: #409eff; */
}
.radio__replace--disable {
  cursor: not-allowed;
}
.radio__replace:after {
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
.radio__button {
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
}
</style>