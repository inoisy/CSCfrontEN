<template>
  <div>
    <div class="main-bg">
      <div
        class="main-bg-image"
        :style="page.img ? `background-image: url(${imageBaseUrl+page.img.url});` : ''"
      ></div>
      <v-container class="position-relative fill-height ma-auto py-5">
        <v-layout>
          <div class="flex xs12 text-xs-center">
            <h1 class="main-header mb-4" v-text="page.title"></h1>
          </div>
        </v-layout>
      </v-container>
    </div>
    <section class="content-bg">
      <v-container class="py-5" grid-list-xl>
        <v-layout wrap>
          <div
            xs12
            v-for="(item,index) in contacts"
            :key="item.title"
            class="mb-5 flex xs12"
            data-aos="fade-in"
          >
            <h2 class="mb-4" v-text="item.title"></h2>
            <div class="contacts-list text-sm-left mb-4">
              <a class="mb-3 align-center display-flex" :href="`tel:${item.phone}`">
                <v-icon class="mr-2">phone</v-icon>
                {{item.phone}}
              </a>
              <a class="mb-3 align-center display-flex" :href="`mailto:${item.email}`">
                <v-icon class="mr-2">email</v-icon>
                {{item.email}}
              </a>

              <a class="mb-3 align-center display-flex" @click="$vuetify.goTo(`#map-${index}`)">
                <v-icon class="mr-2">location_on</v-icon>
                {{item.address}}
              </a>
              <p class="mb-3 align-center display-flex">
                <v-icon class="mr-2">access_time</v-icon>
                {{item.workTime}}
              </p>
            </div>
            <my-map
              :id="`map-${index}`"
              :markers="[item.mapMarker]"
              :options="{}"
              :zoom="14"
              :center="item.mapMarker"
              :detalized="true"
            />
          </div>
        </v-layout>
        <h2 class="mb-4 flex xs12 pl-0 mt-5 mb-4" data-aos="fade-in">{{locale.contactFormTitle}}</h2>
        <contact-form/>
        <h2 class="mb-3 mt-5" data-aos="fade-in">{{locale.contactReationTitle}}</h2>
        <p class="display-1 mb-4" data-aos="fade-in">{{locale.contactReationText}}</p>

        <div class="contacts-list" data-aos="fade-in">
          <a class="mb-3 align-center display-flex" :href="`tel:${locale.contactReactionPhone}`">
            <v-icon class="mr-2">phone</v-icon>
            {{locale.contactReactionPhone}}
          </a>
          <a class="mb-3 align-center display-flex">
            <v-icon class="mr-2">location_on</v-icon>
            {{locale.contactReactionAddress}}
          </a>
          <a class="align-center display-flex" :href="`mailto:${locale.contactReactionMail}`">
            <v-icon class="mr-2">email</v-icon>
            {{locale.contactReactionMail}}
          </a>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import MyMap from "~/components/Map";
import ContactForm from "~/components/ContactForm";

export default {
  head() {
    return {
      title: this.page.title,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.page.description
        }
      ]
    };
  },
  computed: {
    locale() {
      return this.$store.state.locale;
    }
  },
  data: () => ({
    dialog: false,
    imageBaseUrl: process.env.imageBaseUrl
  }),
  components: {
    MyMap,
    ContactForm
  },
  async asyncData(ctx) {
    const locale = ctx.app.i18n.locale;
    let client = ctx.app.apolloProvider.defaultClient;

    let query;
    if (locale === "ru") {
      query = gql`
        query pagesQuery {
          locales(where: { name: "ru" }) {
            vacancies
            catalog
            aboutUs
            mainPage
            contacts
            copyright
            name
            contactFormTitle
            contactReationTitle
            contactReationText
            contactReactionPhone
            contactReactionAddress
            contactReactionMail
          }
          mainPage: pages(where: { slug: "contacts" }) {
            title
            description
            img {
              url
            }
          }
          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title_en
            slug
            itemsOrder
          }
          contacts {
            title
            phone
            address
            email
            workTime
            mapMarker
            itemsOrder
          }
          pills(sort: "title:ask") {
            title
            forms {
              title
              slug
            }
          }
        }
      `;
    } else if (locale === "en") {
      query = gql`
        query pagesQuery {
          locales(where: { name: "en" }) {
            vacancies
            catalog
            aboutUs
            mainPage
            contacts
            copyright
            name
            contactFormTitle
            contactReationTitle
            contactReationText
            contactReactionPhone
            contactReactionAddress
            contactReactionMail
          }
          mainPage: pages(where: { slug: "contacts" }) {
            title_en
            description_en
            img {
              url
            }
          }
          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title_en
            slug
            itemsOrder
          }

          contacts {
            title_en
            phone
            address_en
            email
            workTime_en
            mapMarker
            itemsOrder
          }
          pills(sort: "title:ask", where: { title_ne: "Диалрапид" }) {
            title_en
            forms {
              title_en
              slug
            }
          }
        }
      `;
    }

    let { data } = await client.query({
      query: query
    });
    if (locale === "en") {
      for (let dataItem of Object.keys(data)) {
        data[dataItem] = data[dataItem].map(item => {
          let newObj = {};
          for (let i of Object.keys(item)) {
            if (i.includes("_en")) {
              newObj[i.replace("_en", "")] = item[i];
            } else {
              newObj[i] = item[i];
            }
          }
          return newObj;
        });
      }
    }
    ctx.store.commit("pills", data.pills);
    ctx.store.commit("aboutPages", data.aboutPages);
    ctx.store.commit("locale", data.locales[0]);
    return {
      page: data.mainPage[0],
      contacts: data.contacts
    };
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 45vh;
  min-height: 400px;
}

.content-bg {
  min-height: 60vh;
  display: flex;
  background-position: center;
  background-size: cover;
}
.contacts-list {
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #11333a;
    i {
      color: currentColor;
    }
    &:hover {
      color: #006df0;
    }
  }
}
</style>
