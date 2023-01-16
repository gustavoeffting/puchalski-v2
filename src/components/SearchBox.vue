<template>
  <v-combobox
    ref="searchCombobox"
    @keypress="customOnChangeHandler"
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
  props: {
    comboboxItems: {
      type: Array,
      required: true
    }
  },
  methods: {
    customOnChangeHandler () {
      this.$emit("set-address", this.$refs.searchCombobox.internalSearch)
    },
  }
}
</script>