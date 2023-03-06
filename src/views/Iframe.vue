<template>
  <div class="iframe-container">
    <iframe
      :src="systemUrl"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemUrl:
        "http://161.189.153.241:18080/NatureResource/#/YZT?token=1c1e96ba-829d-49cc-9009-82ada01d8cce",
    };
  },
};
</script>

<style>
.iframe-container {
  width: 100%;
  height: 100%;
}
</style>
