<template>
  <div class="main-container w-full h-[100vh] flex flex-col">
    <header>
      <!-- <h1>HEADER</h1> -->
      <div class="h-[52px] w-full flex items-center justify-center">
        <h1 class="text-[20px] font-[700] leading-[24px] text-center">Mongoose Model Generator</h1>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <!-- <footer>footer</footer> -->
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
