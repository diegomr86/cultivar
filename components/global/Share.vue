<template>
  <div>
    <!-- Sharingbutton Facebook -->
    <a
      class="resp-sharing-button__link"
      href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.cultivarbrasil.com"
      target="_blank"
      rel="noopener"
      aria-label="Facebook"
    >
      <div
        :class="
          'resp-sharing-button resp-sharing-button--facebook resp-sharing-button--' +
          size
        "
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm3.6 11.5h-2.1v7h-3v-7h-2v-2h2V8.34c0-1.1.35-2.82 2.65-2.82h2.35v2.3h-1.4c-.25 0-.6.13-.6.66V9.5h2.34l-.24 2z"
            />
          </svg>
        </div>
        {{ size != 'small' ? 'Facebook' : '' }}
      </div>
    </a>

    <!-- Sharingbutton Twitter -->
    <a
      class="resp-sharing-button__link"
      href="https://twitter.com/intent/tweet/?text=Cultivar%20%C3%A9%20um%20site%2Faplicativo%20em%20portugu%C3%AAs%20focado%20no%20Brasil%20com%20o%20objetivo%20de%20fortalecer%20a%20independ%C3%AAncia%20alimentar%20atrav%C3%A9s%20do%20aprendizado%20colaborativo%20e%20ferramentas%20que%20ajudam%20no%20cultivo.&amp;url=https%3A%2F%2Fwww.cultivarbrasil.com"
      target="_blank"
      rel="noopener"
      aria-label="Twitter"
    >
      <div
        :class="
          'resp-sharing-button resp-sharing-button--twitter resp-sharing-button--' +
          size
        "
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm5.26 9.38v.34c0 3.48-2.64 7.5-7.48 7.5-1.48 0-2.87-.44-4.03-1.2 1.37.17 2.77-.2 3.9-1.08-1.16-.02-2.13-.78-2.46-1.83.38.1.8.07 1.17-.03-1.2-.24-2.1-1.3-2.1-2.58v-.05c.35.2.75.32 1.18.33-.7-.47-1.17-1.28-1.17-2.2 0-.47.13-.92.36-1.3C7.94 8.85 9.88 9.9 12.06 10c-.04-.2-.06-.4-.06-.6 0-1.46 1.18-2.63 2.63-2.63.76 0 1.44.3 1.92.82.6-.12 1.95-.27 1.95-.27-.35.53-.72 1.66-1.24 2.04z"
            />
          </svg>
        </div>
        {{ size != 'small' ? 'Twitter' : '' }}
      </div>
    </a>

    <!-- Sharingbutton LinkedIn -->
    <a
      class="resp-sharing-button__link"
      href="https://www.linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Fwww.cultivarbrasil.com&amp;title=Cultivar%20%C3%A9%20um%20site%2Faplicativo%20em%20portugu%C3%AAs%20focado%20no%20Brasil%20com%20o%20objetivo%20de%20fortalecer%20a%20independ%C3%AAncia%20alimentar%20atrav%C3%A9s%20do%20aprendizado%20colaborativo%20e%20ferramentas%20que%20ajudam%20no%20cultivo.&amp;summary=Cultivar%20%C3%A9%20um%20site%2Faplicativo%20em%20portugu%C3%AAs%20focado%20no%20Brasil%20com%20o%20objetivo%20de%20fortalecer%20a%20independ%C3%AAncia%20alimentar%20atrav%C3%A9s%20do%20aprendizado%20colaborativo%20e%20ferramentas%20que%20ajudam%20no%20cultivo.&amp;source=https%3A%2F%2Fwww.cultivarbrasil.com"
      target="_blank"
      rel="noopener"
      aria-label="LinkedIn"
    >
      <div
        :class="
          'resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--' +
          size
        "
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
        >
          <svg
            version="1.1"
            x="0px"
            y="0px"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            enable-background="new 0 0 24 24"
            xml:space="preserve"
          >
            <path
              d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12s12-5.383,12-12S18.617,0,12,0z M9.5,16.5h-2v-7h2V16.5z M8.5,7.5 c-0.553,0-1-0.448-1-1c0-0.552,0.447-1,1-1s1,0.448,1,1C9.5,7.052,9.053,7.5,8.5,7.5z M18.5,16.5h-3V13c0-0.277-0.225-0.5-0.5-0.5 c-0.276,0-0.5,0.223-0.5,0.5v3.5h-3c0,0,0.031-6.478,0-7h3v0.835c0,0,0.457-0.753,1.707-0.753c1.55,0,2.293,1.12,2.293,3.296V16.5z"
            />
          </svg>
        </div>
        {{ size != 'small' ? 'LinkedIn' : '' }}
      </div>
    </a>

    <!-- Sharingbutton WhatsApp -->
    <a
      class="resp-sharing-button__link"
      href="whatsapp://send?text=Cultivar%20%C3%A9%20um%20site%2Faplicativo%20em%20portugu%C3%AAs%20focado%20no%20Brasil%20com%20o%20objetivo%20de%20fortalecer%20a%20independ%C3%AAncia%20alimentar%20atrav%C3%A9s%20do%20aprendizado%20colaborativo%20e%20ferramentas%20que%20ajudam%20no%20cultivo.%20https%3A%2F%2Fwww.cultivarbrasil.com"
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
    >
      <div
        :class="
          'resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--' +
          size
        "
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 24 24"
          >
            <path
              d="m12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm0 3.8c2.2 0 4.2 0.9 5.7 2.4 1.6 1.5 2.4 3.6 2.5 5.7 0 4.5-3.6 8.1-8.1 8.1-1.4 0-2.7-0.4-3.9-1l-4.4 1.1 1.2-4.2c-0.8-1.2-1.1-2.6-1.1-4 0-4.5 3.6-8.1 8.1-8.1zm0.1 1.5c-3.7 0-6.7 3-6.7 6.7 0 1.3 0.3 2.5 1 3.6l0.1 0.3-0.7 2.4 2.5-0.7 0.3 0.099c1 0.7 2.2 1 3.4 1 3.7 0 6.8-3 6.9-6.6 0-1.8-0.7-3.5-2-4.8s-3-2-4.8-2zm-3 2.9h0.4c0.2 0 0.4-0.099 0.5 0.3s0.5 1.5 0.6 1.7 0.1 0.2 0 0.3-0.1 0.2-0.2 0.3l-0.3 0.3c-0.1 0.1-0.2 0.2-0.1 0.4 0.2 0.2 0.6 0.9 1.2 1.4 0.7 0.7 1.4 0.9 1.6 1 0.2 0 0.3 0.001 0.4-0.099s0.5-0.6 0.6-0.8c0.2-0.2 0.3-0.2 0.5-0.1l1.4 0.7c0.2 0.1 0.3 0.2 0.5 0.3 0 0.1 0.1 0.5-0.099 1s-1 0.9-1.4 1c-0.3 0-0.8 0.001-1.3-0.099-0.3-0.1-0.7-0.2-1.2-0.4-2.1-0.9-3.4-3-3.5-3.1s-0.8-1.1-0.8-2.1c0-1 0.5-1.5 0.7-1.7s0.4-0.3 0.5-0.3z"
            />
          </svg>
        </div>
        {{ size != 'small' ? 'WhatsApp' : '' }}
      </div>
    </a>

    <!-- Sharingbutton Telegram -->
    <a
      class="resp-sharing-button__link"
      href="https://telegram.me/share/url?text=Cultivar%20%C3%A9%20um%20site%2Faplicativo%20em%20portugu%C3%AAs%20focado%20no%20Brasil%20com%20o%20objetivo%20de%20fortalecer%20a%20independ%C3%AAncia%20alimentar%20atrav%C3%A9s%20do%20aprendizado%20colaborativo%20e%20ferramentas%20que%20ajudam%20no%20cultivo.&amp;url=https%3A%2F%2Fwww.cultivarbrasil.com"
      target="_blank"
      rel="noopener"
      aria-label="Telegram"
    >
      <div
        :class="
          'resp-sharing-button resp-sharing-button--telegram resp-sharing-button--' +
          size
        "
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 23.5c6.35 0 11.5-5.15 11.5-11.5S18.35.5 12 .5.5 5.65.5 12 5.65 23.5 12 23.5zM2.505 11.053c-.31.118-.505.738-.505.738s.203.62.513.737l3.636 1.355 1.417 4.557a.787.787 0 0 0 1.25.375l2.115-1.72a.29.29 0 0 1 .353-.01L15.1 19.85a.786.786 0 0 0 .746.095.786.786 0 0 0 .487-.573l2.793-13.426a.787.787 0 0 0-1.054-.893l-15.568 6z"
              fill-rule="evenodd"
            />
          </svg>
        </div>
        {{ size != 'small' ? 'Telegram' : '' }}
      </div>
    </a>

    <!-- Sharingbutton E-Mail -->
    <a
      class="resp-sharing-button__link"
      href="mailto:?subject=Cultivar%20%C3%A9%20um%20site%2Faplicativo%20em%20portugu%C3%AAs%20focado%20no%20Brasil%20com%20o%20objetivo%20de%20fortalecer%20a%20independ%C3%AAncia%20alimentar%20atrav%C3%A9s%20do%20aprendizado%20colaborativo%20e%20ferramentas%20que%20ajudam%20no%20cultivo.&amp;body=https%3A%2F%2Fwww.cultivarbrasil.com"
      target="_self"
      rel="noopener"
      aria-label="E-Mail"
    >
      <div
        :class="
          'resp-sharing-button resp-sharing-button--email resp-sharing-button--' +
          size
        "
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm8 16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v8z"
            />
            <path
              d="M17.9 8.18c-.2-.2-.5-.24-.72-.07L12 12.38 6.82 8.1c-.22-.16-.53-.13-.7.08s-.15.53.06.7l3.62 2.97-3.57 2.23c-.23.14-.3.45-.15.7.1.14.25.22.42.22.1 0 .18-.02.27-.08l3.85-2.4 1.06.87c.1.04.2.1.32.1s.23-.06.32-.1l1.06-.9 3.86 2.4c.08.06.17.1.26.1.17 0 .33-.1.42-.25.15-.24.08-.55-.15-.7l-3.57-2.22 3.62-2.96c.2-.2.24-.5.07-.72z"
            />
          </svg>
        </div>
        {{ size != 'small' ? 'E-mail' : '' }}
      </div>
    </a>
    <br />
    <br />
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: 'medium',
    },
  },
}
</script>
<style scoped lang="sass">
@import '~/assets/css/share.sass'
</style>
