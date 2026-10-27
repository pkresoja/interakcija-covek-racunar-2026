<script lang="ts" setup>

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-custom mb-3">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">
               <i class="bi bi-camera-reels"></i> Filmovi
            </RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <RouterLink class="nav-link" active-class="active" to="/">
                           <i class="bi bi-house"></i> Početna
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" active-class="active" to="/about">
                           <i class="bi bi-info-circle"></i> O aplikacji
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" active-class="active" to="/cart">
                           <i class="bi bi-bag-check"></i> Moje Rezervacije
                        </RouterLink>
                    </li>
                </ul>
                <slot></slot>
            </div>
        </div>
    </nav>
</template>

<style>
.bg-custom {
    border: 1px solid #2d3139;
    padding: 12px;
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    background: #252832;
    box-shadow: 0 8px 25px rgba(20, 25, 35, 0.035);
}
</style>