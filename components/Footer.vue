<template>
<div class="bg-dark w-100 flex-center py-3">
  <a href="https://www.instagram.com/illegalbaker" target="_blank">
    <font-awesome-layers v-b-tooltip.hover title="@illegalbaker" class="fa-2x mr-2" full-width>
      <font-awesome-icon icon="circle" class="text-dark"/>
      <font-awesome-icon class="text-white" transform="shrink-6" :icon="['fa-brands', 'instagram']"></font-awesome-icon>
    </font-awesome-layers>
  </a>

  <a href="tel:5163140453">
    <font-awesome-layers v-b-tooltip.hover title="(516) 314-0453" class="fa-2x mx-4" full-width>
      <font-awesome-icon icon="circle" class="text-dark"/>
      <font-awesome-icon class="text-white" transform="shrink-6" icon="phone"></font-awesome-icon>
    </font-awesome-layers>
  </a>

  <a href="mailto:amy@illegalbaker.com">
    <font-awesome-layers v-b-tooltip.hover title="amy@illegalbaker.com" class="fa-2x ml-2" full-width>
      <font-awesome-icon icon="circle" class="text-dark"/>
      <font-awesome-icon class="text-white" transform="shrink-6" icon="envelope"></font-awesome-icon>
    </font-awesome-layers>
  </a>
</div>
</template>

