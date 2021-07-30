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
        "http://161.189.153.241:18080/NatureResource/#/FZSC/ResultsReview/RVLandSpacePlanning/RVCityLandSpacePlanning?token=kD3BL6BvJ2B/6xxZ0B804RNFqRxT9gAt0pgFfwqpHAhiYI8zNfxauDQx2cfjmhRgoI1rFibxlYPAz/Hnj0Sq6TQPnxJVTPSbY4yF660AcHDao7NMBzHlj66kpScwCMTNRErxjVLx5IYP105NhCUr433c4TBsruF5FzTWclG55xE=",
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
