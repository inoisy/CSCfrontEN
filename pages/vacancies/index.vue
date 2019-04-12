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
            <h1 class="main-header mb-3 text--accent" v-text="page.title"></h1>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-container grid-list-xl class="py-5">
      <v-layout wrap>
        <v-flex xs12 v-for="item in vacancy" :key="item.title">
          <v-card
            class="pa-3"
            hover
            ripple
            :to="localePath({ name: 'vacancies-slug', params: { slug: item.slug } })"
            nuxt
          >
            <p class="mb-2 display-2">{{item.city}}</p>
            <h2 class="mb-3">{{item.title}}</h2>
            <div class="mb-0" v-html="item.description"></div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
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
          }
          vacancies {
            title
            city
            slug
            description
          }
          mainPage: pages(where: { slug: "vacancies" }) {
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
            title
            slug
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
          }
          vacancies {
            title_en
            city_en
            slug
            description_en
          }
          mainPage: pages(where: { slug: "vacancies" }) {
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

          pills(sort: "title:ask") {
            title_en
            forms {
              title_en
              slug
            }
          }
        }
      `;
    }
    const { data } = await client.query({
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
    // const sortPills = data.pills
    // .sort((a, b) => {
    //   if (a.title < b.title) {
    //     return -1;
    //   }
    //   if (a.title > b.title) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // const pages = data.aboutPages;
    ctx.store.commit("pills", data.pills);
    ctx.store.commit("aboutPages", data.aboutPages);
    ctx.store.commit("locale", data.locales[0]);

    return {
      vacancy: data.vacancies,
      page: data.mainPage[0]
    };
  }
};
</script>

