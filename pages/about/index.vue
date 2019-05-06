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
                  <img v-lazy="imageBaseUrl+item.url">
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
      imageBaseUrl: process.env.imageBaseUrl
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
          mainPage: pages(where: { slug: "about" }) {
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

          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title
            slug
            description
            itemsOrder
            img {
              url
            }
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
          mainPage: pages(where: { slug: "about" }) {
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

          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title_en
            slug
            itemsOrder
            description_en
            img {
              url
            }
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
    // console.log(data);
    ctx.store.commit("pills", data.pills);
    ctx.store.commit("aboutPages", data.aboutPages);
    ctx.store.commit("locale", data.locales[0]);

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

