<template>
  <div class="car-container">
    <button @click="goBack" class="back-button">← Back</button>
    <div class="car-title">
      Limuzīns Jāņu nakts krāsās - žigulis
    </div>
    <div class="car-image">
      <img src="https://img4.spoki.lv/upload/articles/26/265430/images/Zigulis-7.jpg" alt="Car Image">
    </div>
    <div class="car-details">
      <table>
        <tbody>
          <tr>
            <td>Gads</td>
            <td>1984</td>
          </tr>
          <tr>
            <td>Modelis</td>
            <td>Vaz 2106</td>
          </tr>
          <tr>
            <td>Cena</td>
            <td>123 456</td>
          </tr>
          <tr>
            <td>Nobraukums</td>
            <td>77 700</td>
          </tr>
          <tr>
            <td>Numurs</td>
            <td>VS-9990</td>
          </tr>
          <tr>
            <td>Motors</td>
            <td>1.6 bendzīns</td>
          </tr>
          <tr>
            <td>Kārba</td>
            <td>5 ātrumu manuāls</td>
          </tr>
          <tr>
            <td>Tehniskā apskate</td>
            <td>05.2024</td>
          </tr>
          <tr>
            <td>Krāsa</td>
            <td>Balta</td>
          </tr>
          <tr>
            <td>Virsbūves tips</td>
            <td>Sedans</td>
          </tr>
          <tr>
            <td>VIN Kods</td>
            <td>XTA210600E1128235</td>
          </tr>
        </tbody>
      </table>
      <p>
        Klasiskais luksa žigulis Vaz 2106 ar oriģinālo 1600 cm³ motoru, kam tikko veikta pilna apkope, a.t.c.
      </p>
      <p>
        Vēsturiskā spēkrata statusa VRN ir cits.
      </p>
      <button>Rakstīt īpašniekam</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListingView",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // any other methods go here
  },
};
</script>

<style scoped>
.back-button {
  background-color: transparent;
  border: none;
  color: #2980b9;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
}

.back-button:hover {
  color: #3498db;
}
</style>
