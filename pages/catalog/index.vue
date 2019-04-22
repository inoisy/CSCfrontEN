<template>
  <div>
    <div class="main-bg">
      <div
        class="main-bg-image"
        :style="page.img ? `background-image: url(${imageBaseUrl+page.img.url});` : ''"
      ></div>
      <v-container class="position-relative fill-height ma-auto py-5">
        <v-layout>
          <v-flex class="xs12 text-xs-center">
            <h1 class="main-header mb-4" v-text="page.title"></h1>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-container>
      <v-layout wrap>
        <v-flex v-for="item in pills" :key="item.title" class="mb-4" xs12>
          <div
            class="pill-wrapper pa-3 cursor-unset v-card v-card--hover v-sheet theme--light elevation-3"
            data-aos="fade-up"
          >
            <v-flex xs12 sm4 class="flex-center img-wrapper pa-2 pr-3">
              <img
                v-if="item && item.img"
                class="img mx-auto"
                v-lazy="imageBaseUrl+item.img.url"
                :alt="item.title"
              >
            </v-flex>
            <v-flex
              xs12
              sm8
              class="px-2 justify-center column text-xs-center text-sm-left display-flex"
            >
              <h2 class="display-3 mb-4 text-xs-center text-sm-left" v-text="item.title"></h2>
              <div v-html="item.description"/>
              <p class="my-3 font-italic caption">{{locale.catalogContraindications}}</p>
              <div v-if="item.forms.length > 1">
                <p>{{ locale.catalogDiffForms }}</p>
                <div>
                  <v-btn
                    v-for="it in item.forms"
                    :key="it.slug"
                    :to="localePath({ name: 'catalog-slug', params: { slug: it.slug } })"
                    outline
                    color="#006df0"
                    class="ml-0"
                  >{{currLocale==='ru' ? it.title : it.title_en}}</v-btn>
                </div>
              </div>
              <div v-if="item.forms.length === 1">
                <v-btn
                  :to=" localePath({ name: 'catalog-slug', params: { slug: item.forms[0].slug } })"
                  outline
                  color="#006df0"
                  class="ml-0"
                >{{ locale.readMore }}</v-btn>
              </div>
            </v-flex>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

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
            readMore
            catalogContraindications
            catalogDiffForms
          }
          mainPage: pages(where: { slug: "catalog" }) {
            title
            description
            content
            img {
              url
            }
          }
          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title
            slug
            itemsOrder
          }
          pagePills: pills(sort: "title:ask") {
            title
            description

            img {
              url
            }
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
            readMore
            catalogContraindications
            catalogDiffForms
          }
          mainPage: pages(where: { slug: "catalog" }) {
            title_en
            description_en
            content_en
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
          pagePills: pills(sort: "title:ask") {
            title_en
            description_en

            img {
              url
            }
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
    ctx.store.commit("pills", data.pagePills);

    ctx.store.commit("aboutPages", data.aboutPages);
    ctx.store.commit("locale", data.locales[0]);

    return {
      page: data.mainPage[0]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  computed: {
    currLocale() {
      return this.$i18n.locale;
    },
    locale() {
      return this.$store.state.locale;
    },
    pills() {
      return this.$store.state.pills;
    }
  }
};
</script>

<style lang="scss" scoped>
.pill-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .img-wrapper {
    .img {
      display: block;
      max-width: 100%;
      max-height: 200px;
    }
  }
}
</style>
