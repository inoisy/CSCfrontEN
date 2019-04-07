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
            >{{$t('writeResume')}}</v-btn>

            <v-btn
              data-aos="fade-in"
              class
              outline
              color="#006df0"
              href="mailto:office@cscpharma.ru"
              tag="a"
              large
            >{{$t('sendResume')}}</v-btn>
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
      imageBaseUrl: "http://localhost:1337"
    };
  },
  components: { Breadcrumbs, VacancyForm },
  async asyncData(ctx) {
    const locale = ctx.app.i18n.locale;

    let client = ctx.app.apolloProvider.defaultClient;

    const ruQuery = gql`
      fragment pagesFragment on Page {
        title
        slug
        itemsOrder
      }
      query pagesQuery($slug: String!, $mainSlug: String!) {
        vacancies(where: { slug: $slug }) {
          title
          city
          content
        }
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
        title
        slug
        itemsOrder
      }
      query pagesQuery($slug: String!, $mainSlug: String!) {
        vacancies(where: { slug: $slug }) {
          title_en
          city_en
          content_en
        }
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
          slug: ctx.route.params.slug,
          mainSlug: "vacancy"
        },
        query: ruQuery
      });
      data = ruData;
      // localeData = {};
    } else if (locale === "en") {
      console.log("en LANG");
      let { data: enData } = await client.query({
        variables: {
          slug: ctx.route.params.slug,
          mainSlug: "vacancy"
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

    // const { data } = await client.query({
    //   variables: {
    //     slug: ctx.route.params.slug,
    //     mainSlug: "vacancy"
    //   },
    //   query: ruQuery
    // });
    const aboutPagesItems = [
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
    ctx.store.commit(
      "aboutPages",
      aboutPagesItems.sort((a, b) => a.order - b.order)
    );
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
          text: this.$t("index"),
          to: this.localePath("index")
        },
        {
          text: this.$t("vacancies"),
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
