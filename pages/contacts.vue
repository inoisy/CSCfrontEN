<template>
  <div>
    <div class="main-bg">
      <div
        class="main-bg-image"
        :style="page.img ? `background-image: url(${imageBaseUrl+page.img.url});` : ''"
      ></div>
      <v-container class="position-relative fill-height ma-auto py-5">
        <v-layout>
          <div class="flex xs12 text-xs-center">
            <h1 class="main-header mb-4" v-text="page.title"></h1>
          </div>
        </v-layout>
      </v-container>
    </div>
    <section class="content-bg">
      <v-container class="py-5" grid-list-xl>
        <v-layout class="mb-5" wrap v-for="(item,index) in contacts" :key="item.title">
          <v-flex>
            <h2 class="mb-4" v-text="item.title" data-aos="fade-in"></h2>
            <div class="contacts-list text-sm-left mb-4" data-aos="fade-in">
              <a class="mb-3 align-center display-flex" :href="`tel:${item.phone}`">
                <v-icon class="mr-2">phone</v-icon>
                {{item.phone}}
              </a>
              <a class="mb-3 align-center display-flex" :href="`mailto:${item.email}`">
                <v-icon class="mr-2">email</v-icon>
                {{item.email}}
              </a>

              <a class="mb-3 align-center display-flex" @click="$vuetify.goTo(`#map-${index}`)">
                <v-icon class="mr-2">location_on</v-icon>
                {{item.address}}
              </a>
              <p class="mb-3 align-center display-flex">
                <v-icon class="mr-2">access_time</v-icon>
                {{item.workTime}}
              </p>
            </div>
            <my-map
              :id="`map-${index}`"
              data-aos="fade-in"
              :markers="[item.mapMarker]"
              :options="{}"
              :zoom="14"
              :center="item.mapMarker"
              :detalized="true"
            />
          </v-flex>
        </v-layout>
        <h2 class="mb-4 flex xs12 pl-0 mt-5 mb-4" data-aos="fade-in">{{$t("formTitle")}}</h2>
        <contact-form/>
        <h2 class="mb-4 mt-5" data-aos="fade-in">{{$t("badReaction")}}</h2>
        <p class="display-1" data-aos="fade-in">{{$t("badReactionText")}}</p>

        <div class="contacts-list" data-aos="fade-in">
          <a class="mb-3 align-center display-flex" href="tel:+74993116771">
            <v-icon class="mr-2">phone</v-icon>+7 (499) 311 67 71
          </a>
          <a class="mb-3 align-center display-flex" @click="$vuetify.goTo(`#map-0`)">
            <v-icon class="mr-2">location_on</v-icon>{{badReactionAddress}}
          </a>
          <a class="align-center display-flex" href="mailto:office@cscpharma.ru">
            <v-icon class="mr-2">email</v-icon>office@cscpharma.ru
          </a>
        </div>

      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import MyMap from "~/components/Map";
import ContactForm from "~/components/ContactForm";
import TroubleForm from "~/components/TroubleForm";

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
  computed:{
    troubleContact(){
      return this.contacts.find(item=>item)
    }
  },
  data: () => ({
    dialog: false,
    imageBaseUrl: "http://localhost:1337"
  }),
  components: {
    MyMap,
    ContactForm,
    TroubleForm
    // Breadcrumbs
  },
  async asyncData(ctx) {
    const locale = ctx.app.i18n.locale;
    let client = ctx.app.apolloProvider.defaultClient;
    const ruQuery = gql`
      fragment pagesFragment on Page {
        title
        slug
        itemsOrder
      }
      query pagesQuery($mainSlug: String!) {
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
        contacts {
          title
          phone
          address
          email
          workTime
          mapMarker
          itemsOrder
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
        itemsOrder
      }
      query pagesQuery($mainSlug: String!) {
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
        contacts {
          title_en
          phone
          address_en
          email
          workTime_en
          mapMarker
          itemsOrder
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
          mainSlug: "contacts"
        },
        query: ruQuery
      });
      data = ruData;
    } else if (locale === "en") {
      console.log("en LANG");
      let { data: enData } = await client.query({
        variables: {
          mainSlug: "contacts"
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
    console.log(data);
    const sortPills = data.pills.sort((a, b) => {
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
    return {
      page: data.mainPage[0],
      contacts: data.contacts
    };
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 45vh;
  min-height: 400px;
}

.content-bg {
  min-height: 60vh;
  display: flex;
  // background-image: url(https://csc.storage.yandexcloud.net/3ec21ded61e84b1c9fdfe523b4a2dd1c.png);
  background-position: center;
  background-size: cover;
}
a:hover {
  color: #006df0;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    i {
      color: currentColor;
    }
  }
}
</style>
