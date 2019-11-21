<template>
    <v-breadcrumbs :items="items" large>
        <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
        </template>
    </v-breadcrumbs>
</template>

<script>
  export default {
    data: () => ({
        items: [
            {
                text: 'Được chia sẻ với tôi',
                disabled: false,
                to: { name: 'user.share' }
            },
            {
                text: 'Link 1',
                disabled: false,
                href: 'breadcrumbs_link_1',
            },
        ],
    }),
  }
</script>