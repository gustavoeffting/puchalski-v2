<template>
  <v-combobox
    @change="onAutoCompleteSelection"
    @keyup="customOnChangeHandler"
    @paste="customOnChangeHandler"
    color="#1e1559"
    :disabled="loading"
    :items="comboboxItems"
    label="Digite um local"
    outlined
    ref="searchCombobox"
    v-model="dummyAddress"
  ></v-combobox>
</template>
<script>
export default {
  name: "SearchBox",
  data: () => ({
    dummyAddress: null
  }),
  props: {
    comboboxItems: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onAutoCompleteSelection() {
      this.$emit("set-address", this.dummyAddress)
    },
    customOnChangeHandler () {
      this.$emit("set-address", this.$refs.searchCombobox.internalSearch)
    },
  }
}
</script>