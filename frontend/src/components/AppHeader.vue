<template>
  <header class="header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo">
          <img src="/pando-icon.png" alt="Pando" class="logo-icon-img" />
          <span class="product-title">Pando</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background-color: #F5F7FA;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.header-inner {
  max-width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.header-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 50%;
  display: block;
}
.product-title {
  font-size: 18px;
  font-weight: 500;
  color: #202124;
}
</style>
