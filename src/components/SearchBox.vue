<template>
  <v-combobox
    ref="searchCombobox"
    v-model="addressDummyModel"
    @change="onAutoCompleteSelection"
    @keyup="customOnChangeHandler"
    @paste="customOnChangeHandler"
    :items="comboboxItems"
    label="Digite um local"
    color="#1e1559"
    outlined
  ></v-combobox>
</template>
<script>
export default {
  name: "SearchBox",
  data: () => ({
    addressDummyModel: null,
  }),
  props: {
    comboboxItems: {
      type: Array,
      required: true
    }
  },
  methods: {
    onAutoCompleteSelection () {
      this.$emit("set-address", this.addressDummyModel)
    },
    customOnChangeHandler () {
      setTimeout (() => {
        if (this.$refs.searchCombobox) {
          this.$emit("set-address", this.$refs.searchCombobox.internalSearch)
        }
      });
    },
  }
}
</script>