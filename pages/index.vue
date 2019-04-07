<template>
  <div>
    <section class="main-bg display-flex justify-center align-center">
      <div
        class="main-bg-image"
        :style="page.img ? `background-image: url(${imageBaseUrl+page.img.url});` : ''"
      ></div>
      <no-ssr>
        <vue-particles
          style="position: absolute;width: 100%; height: 100%;"
          color="#ffffff"
          :particleOpacity="0.9"
          :particlesNumber="80"
          shapeType="circle"
          :particleSize="4"
          linesColor="#dedede"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.7"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push"
        />
      </no-ssr>

      <div
        ref="mainWrapper"
        class="main-wrapper flex xs10 md8 lg7 xl6 position-relative text-xs-center"
        data-aos="zoom-in"
      >
        <h1 class="main-header mb-4 text--accent" v-text="page.title"></h1>
        <p class="display-2 mb-4" v-text="page.description"></p>

        <v-btn :to="localePath('catalog')" nuxt round large dark color="#006df0">{{ $t("catalog") }}</v-btn>
        <v-btn
          :to="localePath('about')"
          nuxt
          round
          large
          flat
          outline
          color="#006df0"
        >{{ $t("about") }}</v-btn>
        <span class="bottom_corners"></span>
      </div>
    </section>
    <section class="about-us" :style="`background-image: url(${require('~/assets/bg1.jpg')});`">
      <v-container grid-list-xl class="py-5">
        <v-layout wrap class>
          <div class="flex xs12" data-aos="fade-in" v-html="page.content"></div>
          <div
            class="flex offset-xs1 xs10 offset-sm2 sm8 offset-md0 md6 lg3"
            data-aos="zoom-in"
            v-for="(item,index) in about"
            :key="index"
          >
            <v-card
              :to="localePath({name: 'about-slug', params: { slug: item.slug  }})"
              nuxt
              class="pa-3 fill-height display-flex column about-card br-10"
              hover
              ripple
            >
              <img
                v-if="item.icon"
                class="mx-auto d-block my-3 about-icon"
                :src="imageBaseUrl+item.icon.url"
                :alt="item.title"
              >
              <div>
                <h3 class="text-xs-center mb-3 about-us-title" v-text="item.title"/>
                <p
                  class="text-xs-center mb-0"
                  v-text="item.description && item.description.length > 120 ? item.description.substr(0,120).trim().concat('...') : item.description"
                />
              </div>
            </v-card>
          </div>
        </v-layout>
      </v-container>
    </section>

    <section class="pills">
      <div class="px-3 py-5 my-auto text-xs-center">
        <h2 class="mb-5 page-title" data-aos="fade-in">{{ $t("ourPills") }}</h2>
        <v-container v-swiper:mySwiper="swiperOption">
          <div class="swiper-wrapper">
            <v-flex
              offset-xs1
              xs10
              offset-sm0
              sm6
              md4
              lg3
              class="swiper-slide"
              v-for="(item,index) in pills"
              :key="index"
            >
              <v-card
                hover
                class="br-10 mb-5 mr-2 ml-2"
                :to="item.forms && item.forms.length > 0 ? localePath({name: 'catalog-slug', params: {slug: item.forms[0].slug}}) : ''"
                nuxt
                data-aos="zoom-in"
              >
                <div class="image-wrapper py-5 px-4 display-flex align-center">
                  <img v-if="item.img" :src="imageBaseUrl+item.img.url" :alt="item.title">
                </div>
                <div class="pa-3">
                  <h3 class="mb-2" v-text="item.title"/>
                </div>
              </v-card>
            </v-flex>
          </div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </v-container>
        <v-btn
          :to="localePath('catalog')"
          nuxt
          large
          class="mx-auto br-10"
          color="#006df0"
          dark
          data-aos="fade-in"
        >{{ $t("allPills") }}</v-btn>
      </div>
    </section>
    <section class="benefits">
      <v-container grid-list-xl class="pb-5">
        <v-layout wrap>
          <div class="flex xs12 md4 py-5" data-aos="fade-in">
            <h3 class="mb-3">{{ $t("ourBenefits") }}</h3>
            <p>{{ $t("ourBenefitsText") }}</p>
            <v-btn
              :to="localePath('about')"
              nuxt
              class="br-10 ml-0"
              outline
              color="#006df0"
            >{{ $t("about") }}</v-btn>
            <v-btn
              :to="localePath('vacancies')"
              nuxt
              class="br-10 ml-0"
              outline
              color="#006df0"
            >{{ $t("vacancies") }}</v-btn>
          </div>
          <v-flex
            xs12
            md4
            class="justify-center column display-flex py-0"
            v-for="(items,index) in [benefits.slice(0,benefits.length / 2),benefits.slice(benefits.length / 2,benefits.length)]"
            :key="index"
          >
            <div
              class="benefit-wrapper pb-4"
              v-for="(item,index) in items"
              :key="index"
              data-aos="fade-left"
            >
              <div class="left-wrapper">
                <div class="img-wrapper pa-2">
                  <img
                    style="width: 50px; height: 50px"
                    v-if="item.img"
                    :src="imageBaseUrl+item.img.url"
                    :alt="item.title+' - CSCPharma'"
                  >
                </div>
              </div>
              <div class="right-wrapper ml-4">
                <h4 v-text="item.title" class="mb-2"/>
                <div v-text="item.description"/>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section class="partners pt-5">
      <v-container data-aos="fade-in">
        <v-layout wrap class="display-flex align-center justify-center">
          <h2
            class="mb-4 text-xs-center flex xs12 page-title"
            data-aos="fade-in"
          >{{ $t("ourPartners") }}</h2>
          <div v-for="(item,index) in partners" :key="index" data-aos="zoom-in">
            <a
              v-if="item.link && item.logo"
              :href="item.link"
              target="_blank"
              class="display-flex ma-auto px-4 my-3 mb-5 flex"
            >
              <img class="d-block ma-auto" :src="imageBaseUrl+item.logo.url" :alt="item.title">
            </a>
            <div v-else-if="item.logo" class="display-flex ma-auto px-4 my-3 mb-5 flex">
              <img class="d-block ma-auto" :src="imageBaseUrl+item.logo.url" :alt="item.title">
            </div>
          </div>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.page-title {
  font-size: 3rem;
  font-weight: normal;
}

@import "swiper/dist/css/swiper.css";

.pills {
  background-image: url(https://csc.storage.yandexcloud.net/a77aa36b2f804e51908d830a0675b949.jpg);

  background-size: cover;
  background-position-x: center;
  background-position-y: top;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: white;
    opacity: 0.25;
  }
}
.main-wrapper {
  margin-top: calc(56px + 48px) !important;
  margin-bottom: 48px;
}
@media (max-width: 768px) {
  .main-bg {
    min-height: 100vh !important;
  }
  .pills {
    min-height: 100vh !important;
    background-position-x: 20%;
  }
  // .main-wrapper {
  //   margin-top: calc(56px + 48px) !important;
  //   margin-bottom: 48px;
  // }
  // .pills {
  //   background-position-x: 0%;
  // }
}
.main-bg {
  min-height: 70vh;
  padding-top: 0 !important;
  .main-header {
    // -webkit-text-fill-color: #65c851;
    // -webkit-text-stroke-width: 2px;
    // -webkit-text-stroke-color: #2f3199;
    // font-size: 4.5rem !important;
    font-weight: 600;
    font-size: 4rem;
  }
  .main-wrapper {
    margin-top: 56px;
  }
  // .container {
  //   margin-top: 56px;
  // }
  // .main-bg-image {

  // }
}
.about-us {
  min-height: 70vh;
  display: flex;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .about-us-title {
    font-size: 1.3rem;
  }
}

.about-icon {
  height: 70px;
}
.pills {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  .image-wrapper {
    background-color: #e7eaeb;
    min-height: 130px;
    img {
      max-height: 130px;
      max-width: 100%;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
.benefits {
  min-height: 50vh;
  display: flex;
}
.benefit-wrapper {
  display: flex;
  .left-wrapper,
  .right-wrapper {
    display: inline-flex;
    flex-direction: column;
  }
  .img-wrapper {
    background: #006df0;
    border-radius: 15px;
    min-height: 66px;
    display: flex;
  }
}

.partners {
  background-color: #7deee8;
  min-height: 35vh;
  // background: url(https://csc.storage.yandexcloud.net/d10f2fbf9eae4808a73c3d08b6f30c58.svg);
  // background-image: url(https://csc.storage.yandexcloud.net/eccbb76eb29442feaff2d5aefa41a5d3.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &:before {
    content: "";
    opacity: 0.65;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url(https://csc.storage.yandexcloud.net/d10f2fbf9eae4808a73c3d08b6f30c58.svg);
  }
  img {
    // max-width: 30%;
    max-height: 100px;
    // width: 200px;
    transition: all 0.2s ease-in-out;
    max-width: 10rem;
    width: 100%;
  }
  img:hover {
    transition: all 0.3s ease-in-out;
    transform: scale(1.1);
  }
  .swiper-container {
    width: 100%;
  }
}
</style>

<script>
import gql from "graphql-tag";

// import;
export default {
  head() {
    return {
      title: "CSC Pharma",
      titleTemplate: "",
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.page.description
        },
        {
          property: "og:locale",
          content: "ru_RU"
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:title",
          content: "CSC Pharma"
        },
        {
          property: "og:description",
          content:
            "CSC - это энергично развивающаяся фармацевтическая компания полного цикла, использующая передовые технологии фарминдустрии."
        },
        {
          property: "og:image",
          content:
            "https://csc.storage.yandexcloud.net/38cf1988f0e84a5d8f3c59890042cc6b.jpg"
        },
        {
          property: "og:url",
          content: "https://cscpharma.ru/"
        },
        {
          property: "og:site_name",
          content: "CSC Pharma"
        },
        {
          name: "yandex-verification",
          content: "382375539142406b"
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

        manufacturers {
          title
          link
          logo {
            url
          }
        }

        benefits {
          title
          description
          img {
            url
          }
        }

        pills {
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

        manufacturers {
          title
          link
          logo {
            url
          }
        }

        benefits {
          title_en
          description_en
          img {
            url
          }
        }

        pills {
          title_en

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
    let data;
    let localeData;
    if (locale === "ru") {
      console.log("RUSSIAN LANG");
      localeData = {};
      const { data: ruData } = await client.query({
        variables: {
          mainSlug: "index"
        },
        query: ruQuery
      });
      data = ruData;
    } else if (locale === "en") {
      console.log("en LANG");
      let { data: enData } = await client.query({
        variables: {
          mainSlug: "index"
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
    const pills = data.pills.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    // .map(item => {
    //   item.forms = item.forms.map(form => {
    //     const localeSlug = ctx.app.localePath({
    //       name: "catalog-slug",
    //       params: {
    //         slug: form.slug
    //       }
    //     });
    //     form.slug = localeSlug;
    //     console.log(localeSlug);

    //     return form;
    //   });
    //   return item;
    // });

    ctx.store.commit("pills", pills);
    const aboutPagesItems = [
      ...data.storyPage,
      ...data.charityPage,
      ...data.missionPage,
      ...data.teamPage
    ];
    ctx.store.commit(
      "aboutPages",
      aboutPagesItems
      // .map(item => {
      // const localeSlug = ctx.app.localePath({
      //   name: "about-slug",
      //   params: {
      //     slug: item.slug
      //   }
      // });
      //   console.log(localeSlug);
      //   item.slug = localeSlug;
      //   return item;
      // })
    );

    return {
      page: data.mainPage[0],
      // pills: pills,
      partners: data.manufacturers.filter(item => item.logo),
      benefits: data.benefits
    };
  },
  computed: {
    about() {
      return this.$store.state.aboutPages;
    },
    pills() {
      return this.$store.state.pills;
    }
  },

  data() {
    return {
      imageBaseUrl: "http://localhost:1337",
      swiperOption: {
        loop: true,
        slidesPerView: "auto",

        preloadImages: false,
        // Enable lazy loading
        lazy: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  }
};
</script>
