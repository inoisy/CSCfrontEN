<template>
  <div>
    <div class="main-bg">
      <div
        class="main-bg-image"
        :style="page.img ? `background-image: url(${imageBaseUrl+page.img.url});` : ''"
      ></div>
      <v-container class="position-relative fill-height ma-auto py-5">
        <v-layout>
          <v-flex class="xs12 offset-sm1 sm10 text-xs-center">
            <h1 class="mb-4" v-text="page.title"/>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-container class="py-5">
      <v-layout wrap>
        <div class="mb-5 main-content flex xs12 md8 lg9">
          <div v-html="page.content"/>
          <v-layout wrap class="mb-5" v-if="page.gallery && page.gallery.length > 0">
            <h2 class="flex xs12 mb-4">Галерея</h2>
            <v-flex xs12>
              <v-carousel height="auto" style="height: auto">
                <v-carousel-item v-for="(item,i) in page.gallery" :key="i">
                  <v-img :src="imageBaseUrl+item.url" :aspect-ratio="14/9"></v-img>
                </v-carousel-item>
              </v-carousel>
            </v-flex>
          </v-layout>
        </div>
        <v-flex xs12 md4 lg3>
          <div
            data-aos="fade-left"
            class="subitem-wrapper mb-5"
            v-for="item in aboutSubitems"
            :key="item.title"
          >
            <nuxt-link
              :to="localePath({ name: 'about-slug', params: { slug: item.slug } })"
              class="subitem-link"
            >
              <v-img
                v-if="item.img"
                class="img-responsive mb-2"
                :src="imageBaseUrl+item.img.url"
                :alt="item.title"
                aspect-ratio="1.7778"
                gradient="to top right, rgba(168, 220, 220, 0.4), rgba(25, 32, 72, 0.5)"
              />
              <h3 class="mb-2" v-text="item.title" style="font-size: 1.3rem; font-weight: bold;"></h3>
            </nuxt-link>
            <div
              class="mb-2"
              v-text="item.description && item.description.length > 120 ? item.description.substr(0,120).trim().concat('...') : item.description"
              style="font-size: 0.85rem;"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<style lang="scss" scoped>
.subitem-link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.main-bg {
  .main-bg-image {
    background-position-y: 0%;
  }
}
.main-content {
  padding-right: 30px;
}
@media (max-width: 960px) {
  .main-content {
    padding-right: 0px;
  }
}
</style>

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
  data() {
    return {
      imageBaseUrl: "http://localhost:1337"
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
        img {
          url
        }
      }
      query pagesQuery($mainSlug: String!) {
        mainPage: pages(where: { slug: $mainSlug }) {
          title
          description
          content
          gallery {
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
        img {
          url
        }
      }
      query pagesQuery($mainSlug: String!) {
        mainPage: pages(where: { slug: $mainSlug }) {
          title_en
          description_en
          content_en
          gallery {
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
          mainSlug: "about"
        },
        query: ruQuery
      });
      data = ruData;
    } else if (locale === "en") {
      console.log("en LANG");
      let { data: enData } = await client.query({
        variables: {
          mainSlug: "about"
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
    // console.log(data);
    ctx.store.commit("pills", sortPills);
    ctx.store.commit("aboutPages", pages.sort((a, b) => a.order - b.order));
    return {
      // aboutSubitems: data.aboutPages
      page: data.mainPage[0]
    };
  },

  computed: {
    aboutSubitems() {
      return this.$store.state.aboutPages;
    }
  }
};
</script>

