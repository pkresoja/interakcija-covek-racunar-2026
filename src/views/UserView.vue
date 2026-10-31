<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { UserService } from '@/services/user.service';


</script>

<template>
    <Navigation />
    <pre>
    {{ UserService.getActiveUser() }}</pre>
</template>