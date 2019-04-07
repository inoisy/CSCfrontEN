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
      imageBaseUrl: "http://localhost:1337"
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
    const ruQuery = gql`
      fragment pagesFragment on Page {
        title
        slug
        description
        itemsOrder
        icon {
          url
        }
      }
      query pagesQuery($mainSlug: String!) {
        vacancies {
          title
          city
          slug
          description
        }
        mainPage: pages(where: { slug: $mainSlug }) {
          title
          description
          img {
            url
          }
        }

        storyPage: pages(where: { slug: "story" }) {
          ...pagesFragment
        }
        charityPage: pages(where: { slug: "charity" }) {
          ...pagesFragment
        }
        missionPage: pages(where: { slug: "mission" }) {
          ...pagesFragment
        }
        teamPage: pages(where: { slug: "team" }) {
          ...pagesFragment
        }

        pills {
          title
          forms {
            title
            slug
          }
        }
      }
    `;
    const enQuery = gql`
      fragment pagesFragment on Page {
        title_en
        slug
        description_en
        itemsOrder
        icon {
          url
        }
      }
      query pagesQuery($mainSlug: String!) {
        vacancies {
          title_en
          city_en
          slug
          description_en
        }
        mainPage: pages(where: { slug: $mainSlug }) {
          title_en
          description_en
          img {
            url
          }
        }

        storyPage: pages(where: { slug: "story" }) {
          ...pagesFragment
        }
        charityPage: pages(where: { slug: "charity" }) {
          ...pagesFragment
        }
        missionPage: pages(where: { slug: "mission" }) {
          ...pagesFragment
        }
        teamPage: pages(where: { slug: "team" }) {
          ...pagesFragment
        }

        pills {
          title_en
          forms {
            title_en
            slug
          }
        }
      }
    `;
    let data;
    if (locale === "ru") {
      const { data: ruData } = await client.query({
        variables: {
          mainSlug: "vacancies"
        },
        query: ruQuery
      });
      data = ruData;
      console.log("RUSSIAN LANG");
    } else if (locale === "en") {
      const { data: enData } = await client.query({
        variables: {
          mainSlug: "vacancies"
        },
        query: enQuery
      });
      for (let dataItem of Object.keys(enData)) {
        enData[dataItem] = enData[dataItem].map(item => {
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
      data = enData;
      console.log("en LANG");
    }
    const sortPills = data.pills.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    const pages = [
      ...data.storyPage,
      ...data.charityPage,
      ...data.missionPage,
      ...data.teamPage
    ];
    ctx.store.commit("pills", sortPills);
    ctx.store.commit("aboutPages", pages.sort((a, b) => a.order - b.order));
    return {
      vacancy: data.vacancies,
      page: data.mainPage[0]
    };
  }

  // computed: {
  //   vacanсies() {
  //     return this.$store.state.vacanсies;
  //   }
  // }
};
</script>

<style lang="scss" scoped>
// .main-bg {
//   min-height: 40vh;
//   // .main-bg-image {
//   //   background-image: url(~assets/img/bg/vacancies.jpg);
//   // }
// }
</style>
