<template>
  <div>
    <div class="main-bg">
      <div
        class="main-bg-image"
        :style="`background-image: url(${imageBaseUrl+mainPage.img.url});`"
      ></div>
      <v-container class="position-relative fill-height ma-auto py-5">
        <v-layout>
          <v-flex class="xs12 text-xs-center">
            <h1 class="main-header mb-4" v-text="page.title"></h1>
            <breadcrumbs :items="breadcrumbsItems"/>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-container grid-list-xl class="py-5">
      <v-layout wrap>
        <v-flex xs12>
          <p class="mb-4 display-2" v-text="page.city"></p>
          <div class="mb-0" v-html="page.content"></div>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex>
          <div data-aos="fade-in" v-html="mainPage.content"></div>
          <div class="justify-center align-center display-flex mt-4" style="flex-wrap: wrap">
            <v-btn
              data-aos="fade-in"
              color="#006df0"
              large
              dark
              @click="dialog=true"
            >Заполнить заявку</v-btn>

            <v-btn
              data-aos="fade-in"
              class
              outline
              color="#006df0"
              href="mailto:office@cscpharma.ru"
              tag="a"
              large
            >Отправить резюме</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="dialog" persistent>
      <v-card class="py-5">
        <v-btn icon @click="dialog=false" style=" position: fixed; top: 60px; right: 40px;">
          <v-icon>clear</v-icon>
        </v-btn>
        <v-container grid-list-xl>
          <vacancy-form :vacancy="page" v-bind:dialog.sync="dialog"></vacancy-form>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";
import VacancyForm from "~/components/VacancyForm";
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
      dialog: false,
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  components: { Breadcrumbs, VacancyForm },
  async asyncData(ctx) {
    const locale = ctx.app.i18n.locale;

    let client = ctx.app.apolloProvider.defaultClient;
    let query;

    if (locale === "ru") {
      query = gql`
        query pagesQuery($slug: String!) {
          locales(where: { name: "ru" }) {
            vacancies
            catalog
            aboutUs
            mainPage
            contacts
            copyright
            name
          }
          vacancies(where: { slug: $slug }) {
            title
            city
            content
          }
          mainPage: pages(where: { slug: "vacancy" }) {
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
        query pagesQuery($slug: String!) {
          locales(where: { name: "en" }) {
            vacancies
            catalog
            aboutUs
            mainPage
            contacts
            copyright
            name
          }
          vacancies(where: { slug: $slug }) {
            title_en
            city_en
            content_en
          }
          mainPage: pages(where: { slug: "vacancy" }) {
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
    let { data } = await client.query({
      variables: {
        slug: ctx.route.params.slug
      },
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
    // const { data } = await client.query({
    //   variables: {
    //     slug: ctx.route.params.slug,
    //     mainSlug: "vacancy"
    //   },
    //   query: ruQuery
    // });
    const aboutPagesItems = data.aboutPages;
    const sortPills = data.pills;
    // .sort((a, b) => {
    //   // console.log(a);
    //   if (a.title < b.title) {
    //     return -1;
    //   }
    //   if (a.title > b.title) {
    //     return 1;
    //   }
    //   return 0;
    // });
    ctx.store.commit("pills", sortPills);
    ctx.store.commit(
      "aboutPages",
      aboutPagesItems
      // .sort((a, b) => a.itemsOrder - b.itemsOrder)
    );
    ctx.store.commit("locale", data.locales[0]);

    // console.log(data.vacancies);
    return {
      page: data.vacancies[0],
      mainPage: data.mainPage[0]
    };
  },

  computed: {
    breadcrumbsItems() {
      return [
        {
          text: this.$store.state.locale.mainPage,
          to: this.localePath("index")
        },
        {
          text: this.$store.state.locale.aboutUs,
          to: this.localePath("vacancies")
        },
        // {
        //   text: "Главная",
        //   to: "/"
        // },
        // {
        //   text: "Вакансии",
        //   to: "/vacancies"
        // },
        {
          text: this.page.title,
          to: this.$route.path
        }
      ];
    }
    // vacanсy() {
    //   return this.$store.state.vacanсies.find(
    //     item => item.slug === this.$route.params.slug
    //   );
    // }
  }
};
</script>

<style lang="scss" scoped>
.main-bg {
  // min-height: 40vh;
  .main-header {
    font-size: 3rem;
  }
  // .main-bg-image {
  //   background-image: url(~assets/img/bg/vacancy3.jpg);
  // }
}
// .benefits {
//   .img-wrapper {
//     background-color: #dddddd;
//     border-radius: 20px;
//     min-height: 102px;

//     img {
//       max-width: 70px;
//       max-height: 70px;
//     }
//   }
// }
</style>
