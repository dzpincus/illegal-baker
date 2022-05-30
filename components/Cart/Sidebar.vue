<template>
    <b-sidebar
        width="400px"
        backdrop
        backdrop-variant="light"
        bg-variant="secondary"
        no-header
        right
        shadow
        id="sidebar-cart"
    >
        <template #default="{ hide }">
            <CartList
                formId="sidebar-form"
                :nav-height="height"
                @hide="hide()"
            />
        </template>
        <template #footer>
            <div
                class="
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-center
                    p-2
                    border-top border-info
                "
            >
                <h5>Total: ${{ total }}</h5>
                <b-button to="/checkout" block size="md" variant="primary"
                    >Checkout</b-button
                >
            </div>
        </template>
    </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: ["height"],
    computed: {
        ...mapGetters({ total: "cart/total" }),
    },
};
</script>