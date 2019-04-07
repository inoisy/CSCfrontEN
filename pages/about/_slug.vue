<template>
  <div>
    <div class="main-bg">
      <div class="main-bg-image" :style="`background-image: url(${imageBaseUrl+page.img.url})`"></div>
      <v-container class="position-relative fill-height ma-auto py-5">
        <v-layout>
          <v-flex class="xs12 text-xs-center">
            <h1 class="main-header mb-4" v-text="page.title"/>
            <breadcrumbs :items="breadcrumbsItems"/>
          </v-flex>
        </v-layout>
      </v-container>
    </div>

    <div class="pt-5 container" v-html="page.content"></div>
    <v-container class="py-5" grid-list-xl v-if="page.gallery && page.gallery.length > 0">
      <v-layout wrap>
        <h2 class="flex xs12 mb-4">{{$t('gallery')}}</h2>
        <v-flex xs12>
          <v-carousel height="auto">
            <v-carousel-item v-for="(item,i) in page.gallery" :key="i">
              <v-img :src="imageBaseUrl+item.url" :aspect-ratio="14/9"></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="py-5" grid-list-xl>
      <v-layout wrap class>
        <h3 class="xs12 flex" data-aos="fade-in">{{$t('readMore')}}</h3>
        <div
          class="xs12 sm6 lg4 flex"
          data-aos="fade-up"
          v-for="item in aboutPages"
          :key="item.slug"
        >
          <v-list class="pa-0">
            <v-list-tile
              avatar
              style="background-color:#eeeeee"
              nuxt
              :to="localePath({ name: 'about-slug', params: { slug: item.slug } })"
            >
              <v-list-tile-avatar tile v-if="item.icon">
                <img :src="imageBaseUrl+item.icon.url">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="grey">arrow_forward</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>
<style lang="scss" scoped>
// .main-bg {
//   min-height: 40vh;
// }
</style>
<script>
import Breadcrumbs from "~/components/Breadcrumbs";
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
  components: { Breadcrumbs },
  async asyncData(ctx) {
    const locale = ctx.app.i18n.locale;
    let client = ctx.app.apolloProvider.defaultClient;
    // console.log(ctx.route);
    // console.log(ctx.route.params.slug);
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
      query pagesQuery($slug: String!) {
        pages(where: { slug: $slug }) {
          title
          description
          slug
          content
          gallery {
            url
          }
          icon {
            url
          }
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
      query pagesQuery($slug: String!) {
        pages(where: { slug: $slug }) {
          title_en
          description_en
          slug
          content_en
          gallery {
            url
          }
          icon {
            url
          }
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
      console.log("RUSSIAN LANG");
      let { data: ruData } = await client.query({
        variables: {
          slug: ctx.route.params.slug
        },
        query: ruQuery
      });
      data = ruData;
    } else if (locale === "en") {
      console.log("en LANG");
      let { data: enData } = await client.query({
        variables: {
          slug: ctx.route.params.slug
        },
        query: enQuery
      });
      // console.log(enData);
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
    }

    const pages = [
      ...data.storyPage,
      ...data.charityPage,
      ...data.missionPage,
      ...data.teamPage
    ];
    const sortPills = data.pills.sort((a, b) => {
      // console.log(a);
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    ctx.store.commit("pills", sortPills);
    ctx.store.commit("aboutPages", pages.sort((a, b) => a.order - b.order));
    // console.log(data);
    return {
      page: data.pages[0]
    };
  },
  computed: {
    data() {
      return {
        imageBaseUrl: "http://localhost:1337"
      };
    },
    aboutPages() {
      return this.$store.state.aboutPages.filter(
        item => !(item.slug === this.$route.params.slug)
      );
    },
    breadcrumbsItems() {
      return [
        {
          text: this.$t("index"),
          to: this.localePath("index")
        },
        {
          text: this.$t("about"),
          to: this.localePath("about")
        },
        {
          text: this.page.title,
          to: this.$route.path
        }
      ];
    }
  }
};
</script>


