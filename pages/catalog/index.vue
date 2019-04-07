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
                :src="imageBaseUrl+item.img.url"
                :alt="item.title"
              >
            </v-flex>
            <v-flex
              xs12
              sm8
              class="px-2 justify-center column text-xs-center text-sm-left display-flex"
            >
              <h2 class="display-3 mb-4 text-xs-center text-sm-left" v-text="item.title"></h2>
              <div class="mb-3" v-html="item.description"/>
              <div v-if="item.forms.length > 1">
                <p>{{ $t("pillDiffForms") }}</p>
                <div>
                  <v-btn
                    v-for="it in item.forms"
                    :key="it.slug"
                    :to="localePath({ name: 'catalog-slug', params: { slug: it.slug } })"
                    outline
                    color="#006df0"
                    class="ml-0"
                  >{{locale === "ru" ? it.title : it.title_en}}</v-btn>
                </div>
              </div>
              <div v-if="item.forms.length === 1">
                <v-btn
                  :to=" localePath({ name: 'catalog-slug', params: { slug: item.forms[0].slug } })"
                  outline
                  color="#006df0"
                  class="ml-0"
                >{{ $t("readMore") }}</v-btn>
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
        mainPage: pages(where: { slug: $mainSlug }) {
          title
          description
          content
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
        pagePills: pills {
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
        menuPills: pills {
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

        itemsOrder
        icon {
          url
        }
      }
      query pagesQuery($mainSlug: String!) {
        mainPage: pages(where: { slug: $mainSlug }) {
          title_en
          description_en
          content_en
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
        pagePills: pills {
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
        menuPills: pills {
          title_en
          forms {
            title_en
            slug
          }
        }
      }
    `;

    let data;
    let localeData;
    if (locale === "ru") {
      console.log("RUSSIAN LANG");
      localeData = {};
      const { data: ruData } = await client.query({
        variables: {
          mainSlug: "catalog"
        },
        query: ruQuery
      });
      const pages = [
        ...ruData.storyPage,
        ...ruData.charityPage,
        ...ruData.missionPage,
        ...ruData.teamPage
      ];
      ruData.aboutPages = pages;
      data = ruData;
    } else if (locale === "en") {
      console.log("en LANG");
      const { data: enData } = await client.query({
        variables: {
          mainSlug: "catalog"
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
      const pages = [
        ...enData.storyPage,
        ...enData.charityPage,
        ...enData.missionPage,
        ...enData.teamPage
      ];
      enData.aboutPages = pages;
      data = enData;
    }

    ctx.store.commit(
      "pills",
      data.menuPills.sort((a, b) => {
        // console.log(a);
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        // return 0;
      })
    );
    // const pages = [
    //   ...data.storyPage,
    //   ...data.charityPage,
    //   ...data.missionPage,
    //   ...data.teamPage
    // ];
    ctx.store.commit(
      "aboutPages",
      data.aboutPages.sort((a, b) => a.itemsOrder - b.itemsOrder)
    );

    return {
      pills: data.pagePills.sort((a, b) => {
        // console.log(a);
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        // return 0;
      }),
      page: data.mainPage[0]
    };
  },
  data() {
    return {
      imageBaseUrl: "http://localhost:1337"
    };
  },
  computed: {
    locale() {
      return this.$i18n.locale;
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
