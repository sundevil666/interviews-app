<template>
  <q-btn
    no-caps
    flat
    :icon="icon"
    :label="title"
    size="lg"
    align="left"
    class="full-width"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: 'EssentialLink'
});

export interface IEssentialLinkProps {
  title: string;
  link?: string;
  icon?: string;
};

withDefaults(defineProps<IEssentialLinkProps>(), {
  link: '#',
  icon: '',
});
</script>
