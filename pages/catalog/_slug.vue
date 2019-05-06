<template>
  <div>
    <div class="main-bg">
      <div
        class="main-bg-image"
        :style="bg.img ? `background-image: url(${imageBaseUrl+bg.img.url});` : ''"
      ></div>
      <v-container class="position-relative fill-height pt-5">
        <v-layout>
          <v-flex class="xs12 text-xs-center">
            <h1 class="mb-4" v-text="header"/>
            <breadcrumbs class="mb-4" :items="breadcrumbsItems"/>
          </v-flex>
        </v-layout>
      </v-container>
      <div class="display-flex justify-center" v-if="tabs && tabs.length>1" style="flex-wrap:wrap">
        <v-btn
          flat
          v-for="item in tabs"
          :key="item.title"
          class="ma-0 display-1"
          :to="localePath({ name: 'catalog-slug', params: { slug: item.slug } })"
          large
          nuxt
        >{{item.title || item.title_en }}</v-btn>
      </div>
    </div>
    <!-- {{pill.pilllink}} -->
    <section class="product-wrapper-outer" v-lazy:background-image="require('~/assets/bg1.jpg')">
      <v-container class="py-5 product-wrapper">
        <div class="product-infolayout wrap">
          <div class="flex product-text">
            <div class="flex xs12 md5 lg4 images-wrapper mb-4" v-if="img && img.length > 0 ">
              <div class="layout wrap pa-0">
                <div
                  class="flex pr-1 mb-2"
                  :class="img && img.length > 1 ? 'xs9' : 'offset-xs2 xs8 offset-md0 md12'"
                >
                  <v-card
                    hover
                    ripple
                    class="img-wrapper pa-3 fill-height align-center justify-center display-flex"
                    @click="dialog=true; carouselValue=0 "
                  >
                    <v-img
                      contain
                      :src="imageBaseUrl+ img[0].url "
                      :alt="header"
                      :aspect-ratio="1/1"
                    />
                  </v-card>
                </div>
                <div
                  v-if="img && img.length > 1"
                  class="flex xs3 thumbnail-wrapper display-flex pa-0"
                  style="flex-wrap: wrap; align-content: flex-start;"
                >
                  <div
                    v-for="(item,index) in img.slice(1,4)"
                    :key="item.url"
                    class="mb-2 flex pl-1 thumbnail-inner"
                  >
                    <v-card
                      hover
                      ripple
                      class="pa-2"
                      style="    border: 1px solid #919899; background-color: white; border-radius: 8px;"
                      @click="dialog=true; carouselValue=index+1"
                    >
                      <v-img
                        contain
                        :src="imageBaseUrl+item.url"
                        :alt="header"
                        style="width:100%;"
                        :aspect-ratio="1/1"
                      />
                    </v-card>
                  </div>
                </div>
              </div>
            </div>
            <v-alert
              class="mb-4"
              outline
              :value="recipe"
              type="error"
              color="#ff5252"
            >{{ locale.catalogRecipe }}</v-alert>
            <p v-if="pill.manufacturer">
              <strong>{{locale.catalogManufacturer}}:</strong>
              <a
                class="product-manufacturer"
                @click="$vuetify.goTo('#manufacturer')"
              >{{pill.manufacturer.title || pill.manufacturer.title_en }}</a>
            </p>

            <p v-if="nepatentovannoeNaimenovanieCurrLocale ">
              <strong>{{locale.catalogActiveIngredient}}:</strong>
              {{nepatentovannoeNaimenovanieCurrLocale}}
            </p>
            <p id="lekarstvennayaForma" v-if="lekarstvennayaFormaCurrLocale">
              <strong>{{locale.catalogDosageForm}}:</strong>
              {{lekarstvennayaFormaCurrLocale}}
            </p>
            <p v-if="pill.otherwebsitelink">
              {{locale.catalogOtherWebsite}}:
              <a
                target="_blank"
                class="product-manufacturer"
                :href="pill.otherwebsitelink"
              >{{pill.otherwebsitelink}}</a>
            </p>

            <v-btn
              v-if="descriptionCurrLocale && !access"
              class="ml-0 mb-3"
              @click="showDialog=true"
            >{{locale.readMore}}</v-btn>
            <v-dialog v-if="!access" v-model="showDialog" persistent max-width="400">
              <v-card>
                <v-card-title class="headline">{{locale.catalogLimitedTitle}}</v-card-title>
                <v-card-text v-html="locale.catalogLimitedText"></v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    flat
                    @click="showDialog = false; $store.commit('access',false)"
                  >{{locale.no}}</v-btn>
                  <v-btn
                    color="green darken-1"
                    flat
                    @click="showDialog = false; $store.commit('access',true)"
                  >{{locale.yes}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-slide-y-transition>
              <div v-if="descriptionCurrLocale && access" v-html="descriptionCurrLocale"/>
            </v-slide-y-transition>

            <p class="font-italic caption mb-0">{{locale.catalogContraindications}}</p>
          </div>
        </div>
        <v-dialog v-model="dialog" fullscreen v-if="img && img.length > 0">
          <v-carousel
            hide-delimiters
            :cycle="false"
            v-model="carouselValue"
            light
            height="100%"
            :hide-controls="img.length===1"
          >
            <v-carousel-item lazy v-for="(item,i) in img" :key="i">
              <div class="slide-wrapper">
                <img v-lazy="imageBaseUrl+item.url">
              </div>
            </v-carousel-item>
          </v-carousel>
          <v-btn fab class="btn-close" @click="dialog=false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-dialog>
        <v-tabs
          v-model="instructionTabs"
          v-if="currLocale==='ru'"
          ref="tab"
          show-arrows
          grow
          hide-slider
          class="mt-5"
          style="clear:both;"
          data-aos="fade-in"
        >
          <v-tab v-if="pokazaniya" ripple>Показания</v-tab>
          <v-tab-item v-if="pokazaniya" class="pa-3">
            <div v-html="pokazaniya"></div>
          </v-tab-item>
          <v-tab v-if="protivopokazaniya" ripple>Противопоказания</v-tab>
          <v-tab-item v-if="protivopokazaniya" class="pa-3">
            <div v-html="protivopokazaniya"></div>
          </v-tab-item>
          <v-tab v-if="sposobPrimeneniyaDozy" ripple>Дозировка</v-tab>
          <v-tab-item v-if="sposobPrimeneniyaDozy" class="pa-3">
            <div v-html="sposobPrimeneniyaDozy"></div>
          </v-tab-item>
          <v-tab v-if="pobochnoeDeystvie" ripple>Побочное действие</v-tab>
          <v-tab-item v-if="pobochnoeDeystvie" class="pa-3">
            <div v-html="pobochnoeDeystvie"></div>
          </v-tab-item>
          <v-tab ripple>Вся инструкция</v-tab>
          <v-tab-item class="pa-3">
            <p v-if="torgovoeNazvanieCurrLocale">
              <strong>Торговое название:</strong>
              {{torgovoeNazvanieCurrLocale}}
            </p>
            <p id="nepatentovannoeNaimenovanie" v-if="nepatentovannoeNaimenovanieCurrLocale">
              <strong>Международное непатентованное наименование:</strong>
              {{nepatentovannoeNaimenovanieCurrLocale}}
            </p>
            <p id="lekarstvennayaForma" v-if="lekarstvennayaFormaCurrLocale">
              <strong>Лекарственная форма:</strong>
              {{lekarstvennayaFormaCurrLocale}}
            </p>

            <div id="sostav" v-if="sostav">
              <p class="font-weight-bold">Состав</p>
              <div v-html="sostav"/>
            </div>

            <div id="opisanie" v-if="opisanie">
              <p class="font-weight-bold">Описание</p>
              <div v-html="opisanie"/>
            </div>

            <div id="farmakoterapevticheskayaGruppa" v-if="farmakoterapevticheskayaGruppa">
              <p class="font-weight-bold">Фармакотерапевтическая группа</p>
              <p v-text="farmakoterapevticheskayaGruppa"/>
            </div>
            <p id="kodATX" v-if="kodATX">
              <strong>Код:</strong>
              <span v-text="kodATX"/>
            </p>
            <p
              v-if="farmakodinamika || farmakokinetika"
              class="font-weight-bold"
            >Фармакологические свойства</p>
            <div id="farmakodinamika" v-if="farmakodinamika">
              <p class="font-weight-bold">Фармакодинамика</p>
              <div v-html="farmakodinamika"/>
            </div>
            <div id="farmakokinetika" v-if="farmakokinetika">
              <p class="font-weight-bold">Фармакокинетика</p>
              <div v-html="farmakokinetika"/>
            </div>
            <div id="pokazaniya" v-if="pokazaniya">
              <p class="font-weight-bold">Показания для применения</p>
              <div v-html="pokazaniya"/>
            </div>
            <div id="protivopokazaniya" v-if="protivopokazaniya">
              <p class="font-weight-bold">Противопоказания для применения</p>
              <div v-html="protivopokazaniya"/>
            </div>

            <div id="meryPredostorozhnosti" v-if="meryPredostorozhnosti">
              <p class="font-weight-bold">Меры предосторожности при применении</p>
              <div v-html="meryPredostorozhnosti"/>
            </div>
            <div id="priBeremennosti" v-if="priBeremennosti">
              <p class="font-weight-bold">Применение во время беременности и грудного вскармливания:</p>
              <div v-html="priBeremennosti"/>
            </div>

            <div id="sposobPrimeneniyaDozy" v-if="sposobPrimeneniyaDozy">
              <p class="font-weight-bold">Способ применения и дозы:</p>
              <div v-html="sposobPrimeneniyaDozy"/>
            </div>
            <div id="peredozirovka" v-if="peredozirovka">
              <p class="font-weight-bold">Передозировка</p>
              <div v-html="peredozirovka"/>
            </div>
            <div id="pobochnoeDeystvie" v-if="pobochnoeDeystvie">
              <p class="font-weight-bold">Побочное действие</p>
              <div v-html="pobochnoeDeystvie"/>
            </div>
            <div id="vzaimodeystvieSDrugimiPreparatami" v-if="vzaimodeystvieSDrugimiPreparatami">
              <p class="font-weight-bold">Взаимодействие с другими лекарственными препаратами</p>
              <div v-html="vzaimodeystvieSDrugimiPreparatami"/>
            </div>
            <div id="osobyeUkazaniya" v-if="osobyeUkazaniya">
              <p class="font-weight-bold">Особые указания</p>
              <div v-html="osobyeUkazaniya"/>
            </div>
            <div id="vliyanieNaAvtomobil" v-if="vliyanieNaAvtomobil">
              <p
                class="font-weight-bold"
              >Влияние на способность управления автотранспортом и механизмами</p>
              <div v-html="vliyanieNaAvtomobil"/>
            </div>
            <div id="formaVypuska" v-if="formaVypuska">
              <p class="font-weight-bold">Форма выпуска</p>
              <div v-html="formaVypuska"/>
            </div>
            <div id="usloviyaHraneniya" v-if="usloviyaHraneniya">
              <p class="font-weight-bold">Условия хранения</p>
              <div v-html="usloviyaHraneniya"/>
            </div>
            <div id="srokGodnosti" v-if="srokGodnosti">
              <p class="font-weight-bold">Срок годности</p>
              <div v-html="srokGodnosti"/>
            </div>
            <div
              id="vladelecRegistracionnogoUdostovereniya"
              v-if="vladelecRegistracionnogoUdostovereniya"
            >
              <p class="font-weight-bold">Владелец регистрационного удостоверения</p>
              <div v-html="vladelecRegistracionnogoUdostovereniya"/>
            </div>
            <div id="proizvoditel" v-if="proizvoditel">
              <div class="font-weight-bold mb-3">Производитель</div>
              <div v-html="proizvoditel"/>
            </div>
            <div id="upakovkaKontrol" v-if="upakovkaKontrol">
              <p class="font-weight-bold">Расфасовано и/или упаковано</p>
              <div v-html="upakovkaKontrol"/>
            </div>
            <div id="adresPretenziy" v-if="adresPretenziy">
              <p class="font-weight-bold">Организация принимающая претензии</p>
              <div v-html="adresPretenziy"/>
            </div>
          </v-tab-item>
          <v-tab v-if="pill.Articles && pill.Articles.length > 0" ripple>Научные публикации</v-tab>
          <v-tab-item
            v-if="pill.Articles && pill.Articles.length > 0"
            class="pa-3 justify-center"
            style="height: auto"
          >
            <div v-if="access">
              <v-card
                hover
                ripple
                v-for="item in pill.Articles"
                :key="item.url"
                :href="item.url"
                target="_blank"
                class="attachments-wrapper layout mb-3 display-flex"
              >
                <div
                  class="attachments-icon-wrapper display-flex align-center justify-center ml-3 mt-3"
                >
                  <v-icon color="white">notes</v-icon>
                </div>
                <v-card-title>
                  <div>
                    <p class="attachments-name mb-2" v-text="item.name.replace(item.ext, '')"></p>
                    <p class="attachments-size mb-0">{{(item.size/1000).toFixed(1)}} MB</p>
                  </div>
                </v-card-title>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs>

        <v-layout class="justify-center" wrap v-if="pill.pilllink && pill.pilllink.length > 0">
          <h2
            data-aos="fade-in"
            class="mt-5 xs12 flex mb-2 text-xs-center"
          >{{locale.catalogWhereBuy}}</h2>
          <div
            class="justify-center flex xs6 sm4 md3 lg2 justify-center display-flex"
            v-for="item in pill.pilllink"
            :key="item.href"
            data-aos="fade-in"
          >
            <a class="px-4 pillLink" :href="item.href" target="_blank">
              <img
                v-lazy="imageBaseUrl+ item.pharmacy.img.url"
                :alt="item.pharmacy.name"
                :title="item.pharmacy.name"
              >
            </a>
          </div>
        </v-layout>
      </v-container>
    </section>

    <section
      class="position-relative display-flex column"
      id="manufacturer"
      v-if="pill.manufacturer"
      style="clear:both;"
    >
      <v-flex order-xs2 order-md1>
        <my-map
          v-if="pill.manufacturer.mapMarkers"
          class="flex xs12"
          data-aos="fade-in"
          :zoom="5.5"
          :markers="pill.manufacturer.mapMarkers"
          :options="{
            clickable:false,
            draggable:false,
            disableDefaultUI: true,
            draggableCursor:''
          }"
        />
      </v-flex>
      <v-flex xs12 order-xs1 order-md2 class="flex position-relative manufacturer-wrapper">
        <v-container class="py-5">
          <v-layout>
            <div class="flex xs12 md6">
              <h2 class="mb-4" data-aos="fade-in">{{locale.catalogAboutManufacturer}}</h2>.
              <div class="manufacturer-content">
                <h3 class="display-4 mb-4" data-aos="fade-in" v-text="manufacturerTitleCurrLocale"/>
                <div class="img-wrapper" data-aos="fade-in" v-if="pill.manufacturer.img">
                  <img
                    class="mb-4"
                    v-lazy="imageBaseUrl+pill.manufacturer.img.url"
                    :alt="manufacturerTitleCurrLocale"
                    style="display: block; width: 100%; border: 1px solid #919899; border-radius: 15px;"
                  >
                </div>
                <div
                  class="font-weight-medium"
                  v-html=" pill.manufacturer.description || pill.manufacturer.description_en "
                  data-aos="fade-in"
                />
              </div>
            </div>
          </v-layout>
        </v-container>
      </v-flex>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.main-bg {
  display: flex;
  flex-direction: column;
}
.v-window-item,
.v-window__container,
.v-carousel__item {
  height: 100% !important;
}
.slide-wrapper {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 56px;
  padding-top: 30px;
  padding-right: 56px;
  padding-left: 56px;
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}
.btn-close {
  position: absolute;
  right: 0;
  margin: 9px;
  cursor: pointer;
  top: 0;
}
@media all and (max-width: 600px) {
  .slide-wrapper {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.pillLink {
  display: flex;
  align-items: center;
  min-height: 200px;
  img {
    width: 100%;
    transition: all 0.3s ease-in-out;
  }
  &:hover {
    img {
      transition: all 0.3s ease-in-out;
      transform: scale(1.1);
    }
  }
}
.attachments-wrapper {
  text-decoration: none;
  .attachments-icon-wrapper {
    margin-top: 5px;
    background-color: #77a5d6;
    width: 33px;
    min-width: 33px;
    height: 33px;
    border-radius: 5px;
    width: 33px;
    height: 33px;
  }
  .attachments-name {
    font-weight: 500;
    font-size: 1.2rem;
  }
  &:hover {
    .attachments-name {
      text-decoration: underline;
    }
  }
}
.manufacturer-wrapper {
  background: linear-gradient(
    90deg,
    #cecece 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.1) 60%
  );
}
.manufacturer-content {
  display: flex;
  flex-direction: column;
}
.thumbnail-inner {
  // flex-basis: 100%;
  min-width: 100%;
}
.images-wrapper {
  float: right;
  min-width: 100%;
}
@media (min-width: 1264px) {
  .images-wrapper {
    min-width: 33.33333333333333%;
  }
}
@media (min-width: 960px) {
  .images-wrapper {
    margin-left: 2rem;
    margin-bottom: 2rem;
    min-width: 41.66666666666667%;
  }
}
.product-text {
  padding-right: 48px;
}
@media (max-width: 960px) {
  .product-text {
    padding-right: 0px;
  }

  .manufacturer-wrapper {
    // padding-bottom: 50vh;
    background: linear-gradient(
      180deg,
      #cecece 0%,
      rgba(255, 255, 255, 0.8) 60%,
      rgba(255, 255, 255, 0.1) 70%
    );
  }
}
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.page-enter,
.page-leave-active {
  opacity: 1;
  //   transform: scale(0)
  .product-wrapper {
    opacity: 0;
  }
}
.forms-tabs-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  flex-wrap: wrap;
}
.product-wrapper-outer {
  background-size: cover;
  background-position: center;
  display: flex;
}
.product-wrapper {
  .product-manufacturer {
    text-decoration: none;
    color: #42648b;
    &:hover {
      text-decoration: underline;
    }
  }
  .img-wrapper {
    border: 1px solid #919899;
    background-color: white;
    border-radius: 8px;
    // width: 25rem;
    // min-width: 250px;
    img {
      display: block;
      width: 100%;
    }
  }
}
.map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
@media (max-width: 960px) {
  .map-container {
    height: 60vh;
    min-height: 500px;
    position: relative;
  }
}
@media (max-width: 600px) {
  .images-wrapper .layout .flex {
    padding: 4px;
  }
}
</style>

<script>
import MyMap from "~/components/Map";
import Breadcrumbs from "~/components/Breadcrumbs";
import gql from "graphql-tag";
export default {
  head() {
    // const description = this.descriptionCurrLocale;
    // console.log("TCL: head -> description", description);
    return {
      // title: this.header,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.descriptionCurrLocale
          // description && description.length > 97
          //   ? description
          //       .substr(0, 97)
          //       .replace(/<.*>/gm, "")
          //       .trim()
          //       .concat("...")
          //   : description || ""
        }
      ]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialog: false,
      showDesk: false,
      showDialog: false,
      // descAccess: false,
      carouselValue: 0,
      instructionTabs: ""
    };
  },
  components: {
    MyMap,
    Breadcrumbs
  },
  watch: {
    instructionTabs: function(tabs, sec) {
      if (
        this.pill.Articles &&
        this.pill.Articles.length > 0 &&
        tabs === this.$refs.tab.items.length - 1 &&
        !this.access
      ) {
        this.showDialog = true;
      }
    }
  },
  async asyncData(ctx) {
    const locale = ctx.app.i18n.locale;
    let client = ctx.app.apolloProvider.defaultClient;

    let query;
    if (locale === "ru") {
      query = gql`
        query FormsQuery($slug: String!) {
          locales(where: { name: "ru" }) {
            vacancies
            catalog
            aboutUs
            mainPage
            contacts
            copyright
            name
            catalogDosageForm
            catalogManufacturer
            catalogLimitedTitle
            catalogLimitedText
            catalogContraindications
            catalogActiveIngredient
            catalogOtherWebsite
            catalogRecipe
            catalogWhereBuy
            catalogAboutManufacturer
            yes
            no
            readMore
          }
          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title_en
            slug
          }
          bgPage: pages(where: { slug: "catalog" }) {
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
          forms(where: { slug: $slug }) {
            title
            description
            recipe
            torgovoeNazvanie
            nepatentovannoeNaimenovanie
            lekarstvennayaForma
            sostav
            opisanie
            farmakoterapevticheskayaGruppa
            kodATX
            farmakodinamika
            farmakokinetika
            pokazaniya
            protivopokazaniya
            meryPredostorozhnosti
            priBeremennosti
            sposobPrimeneniyaDozy
            peredozirovka
            pobochnoeDeystvie
            vzaimodeystvieSDrugimiPreparatami
            osobyeUkazaniya
            vliyanieNaAvtomobil
            formaVypuska
            srokGodnosti
            usloviyaHraneniya
            vladelecRegistracionnogoUdostovereniya
            proizvoditel
            upakovkaKontrol
            adresPretenziy
            img {
              url
              createdAt
            }
            pill {
              title
              description
              otherwebsitelink
              Articles {
                url
                ext
                name
                size
              }
              img {
                url
              }
              forms {
                title
                slug
              }
              pilllink {
                href
                pharmacy {
                  name
                  img {
                    url
                  }
                }
              }
              manufacturer {
                title
                description
                mapMarkers
                img {
                  url
                }
              }
            }
          }
        }
      `;
    } else if (locale === "en") {
      query = gql`
        query FormsQuery($slug: String!) {
          locales(where: { name: "en" }) {
            vacancies
            catalog
            aboutUs
            mainPage
            contacts
            copyright
            name
            catalogDosageForm
            catalogManufacturer
            catalogLimitedTitle
            catalogLimitedText
            catalogContraindications
            catalogActiveIngredient
            catalogOtherWebsite
            catalogRecipe
            catalogWhereBuy
            catalogAboutManufacturer
            yes
            no
            readMore
          }
          aboutPages: pages(
            sort: "itemsOrder:ask"
            where: { slug: ["story", "charity", "mission", "team"] }
          ) {
            title_en
            slug
          }
          bgPage: pages(where: { slug: "catalog" }) {
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
          forms(where: { slug: $slug }) {
            title_en
            description_en
            recipe
            torgovoeNazvanie_en
            nepatentovannoeNaimenovanie_en
            lekarstvennayaForma_en
            sostav
            opisanie
            farmakoterapevticheskayaGruppa
            kodATX
            farmakodinamika
            farmakokinetika
            pokazaniya
            protivopokazaniya
            meryPredostorozhnosti
            priBeremennosti
            sposobPrimeneniyaDozy
            peredozirovka
            pobochnoeDeystvie
            vzaimodeystvieSDrugimiPreparatami
            osobyeUkazaniya
            vliyanieNaAvtomobil
            formaVypuska
            srokGodnosti
            usloviyaHraneniya
            vladelecRegistracionnogoUdostovereniya
            proizvoditel
            upakovkaKontrol
            adresPretenziy
            img {
              url
              createdAt
            }
            pill {
              title_en
              description_en
              otherwebsitelink
              Articles {
                url
                ext
                name
                size
              }
              img {
                url
              }
              forms {
                title_en
                slug
              }
              pilllink {
                href
                pharmacy {
                  name
                  img {
                    url
                  }
                }
              }
              manufacturer {
                title_en
                description_en
                mapMarkers
                img {
                  url
                }
              }
            }
          }
        }
      `;
    }

    const { data } = await client.query({
      variables: {
        slug: ctx.route.params.slug
        // bgSlug: "catalog"
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
            } else if (!Array.isArray(item[i]) && typeof item[i] === "object") {
              // console.log("OBJECT!", item[i]);
              newObj[i] = item[i];
            } else {
              newObj[i] = item[i];
            }
          }
          return newObj;
        });
      }
    }
    ctx.store.commit("pills", data.pills);
    ctx.store.commit("aboutPages", data.aboutPages);
    let bg = data.bgPage[0];
    let form = data.forms[0];
    form.img = form.img.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    ctx.store.commit("locale", data.locales[0]);
    return {
      ...form,
      bg
    };
  },
  computed: {
    torgovoeNazvanieCurrLocale() {
      return this.torgovoeNazvanie; //|| this.torgovoeNazvanie_en;
    },
    descriptionCurrLocale() {
      return this.description; //|| this.description_en;
    },
    lekarstvennayaFormaCurrLocale() {
      return this.lekarstvennayaForma; //|| this.lekarstvennayaForma_en;
    },
    nepatentovannoeNaimenovanieCurrLocale() {
      return this.nepatentovannoeNaimenovanie; //|| this.nepatentovannoeNaimenovanie_en
    },
    manufacturerTitleCurrLocale() {
      return this.pill.manufacturer.title; //|| this.pill.manufacturer.title_en;
    },
    locale() {
      return this.$store.state.locale;
    },
    currLocale() {
      return this.$i18n.locale;
    },
    access() {
      return this.$store.state.access;
    },
    header() {
      // const locale = this.$store.state.locale;
      // const torgovoeNazvanie =
      //   locale === "ru" ? this.torgovoeNazvanie : this.torgovoeNazvanie_en;
      // let add =
      //   this.title && locale === "ru"
      //     ? this.title.toLowerCase()
      //     : this.title_en
      //     ? this.title_en.toLowerCase()
      //     : "";
      // console.log(this.title);
      // console.log("title_en", this.title_en);
      // console.log("TCL: header -> add", add);

      return (
        (this.torgovoeNazvanie || this.torgovoeNazvanie_en) +
        " " +
        (this.title || this.title_en)
      ); //torgovoeNazvanie; //+ " " + add;
    },
    tabs() {
      return this.pill.forms;
    },
    breadcrumbsItems() {
      return [
        {
          text: this.$store.state.locale.mainPage,
          to: this.localePath("index")
        },
        {
          text: this.$store.state.locale.catalog,
          to: this.localePath("catalog")
        },
        {
          text: this.header,
          to: this.$route.path
        }
      ];
    }
  }
};
</script>

