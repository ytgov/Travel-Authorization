<template>
  <div>
    <!-- TODO: move this into the top level layout, once everything is using this layout -->
    <BreadcrumbsBar :items="breadcrumbs" />

    <router-view />
  </div>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue"

const { breadcrumbs } = useBreadcrumbs()
</script>
