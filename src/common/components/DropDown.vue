<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropdown-button">
      {{ selectedOption || 'Select an option' }}
    </button>
    <ul v-if="showDropdown" class="dropdown-list">
      <li v-for="option in options" :key="option" @click="selectOption(option)">
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      selectedOption: null,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.showDropdown = false;
      this.$emit('selected', option);  // Emit selected option to parent
    }
  }
};
</script>

<style scoped>
.dropdown {
  color: black;
  position: relative;
  display: inline-block;
}

.dropdown-button {
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f7f7f7;
  outline: none;
}

.dropdown-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dropdown-list li {
  padding: 10px 20px;
  cursor: pointer;
  background-color: #f7f7f7;
}

.dropdown-list li:hover {
  background-color: #ddd;
}
</style>
