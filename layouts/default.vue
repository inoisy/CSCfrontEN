<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      temporary
      width="220px"
      style="background-color: rgba(255,255,255,0.85)"
    >
      <v-list style="background: transparent">
        <template v-for="(item, i) in navigation">
          <v-list-group v-if="item.items.length>0" :key="i">
            <v-list-tile slot="activator" :to="localePath(item.to)">
              <v-list-tile-content>{{ item.title }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="it in item.items"
              :key="it.title"
              :to="it.forms && it.forms.length > 0 ? localePath({ name: 'catalog-slug', params: { slug: it.forms[0].slug } }) : localePath({ name: 'about-slug', params: { slug: it.slug } })"
            >
              <v-list-tile-content class="ml-4">{{ it.title }}</v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :to="localePath(item.to)" :key="i" nuxt exact>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"/>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed color="rgba(17, 51, 58, 0.72)" class="app-toolbar header" height="56">
      <nuxt-link :to="localePath('index')" class="fill-height" nuxt>
        <img :src="require('~/assets/images/logo.png')" class="fill-height">
      </nuxt-link>
      <v-btn
        dark
        flat
        nuxt
        v-for="item in locales"
        :key="item.code"
        :to="switchLocalePath(item.code)"
        class="fill-height"
      >{{item.code}}</v-btn>
      <v-spacer/>
      <template v-for="(item,index) in navigation">
        <v-menu
          :key="index"
          v-if="item.items.length>0"
          class="fill-height hidden-sm-and-down"
          open-on-hover
          offset-y
          attach
          bottom
          transition="slide-y-transition"
        >
          <v-btn
            class="fill-height ma-0 header-link"
            slot="activator"
            flat
            dark
            nuxt
            :to="localePath(item.to)"
          >
            {{item.title}}
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in item.items"
              :key="index"
              nuxt
              :to="item.forms && item.forms.length > 0 ? localePath({ name: 'catalog-slug', params: { slug: item.forms[0].slug } }) :  localePath({ name: 'about-slug', params: { slug: item.slug } })"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn
          dark
          v-else
          flat
          nuxt
          exact
          :key="index"
          class="ma-0 fill-height hidden-sm-and-down header-link"
          :to="localePath(item.to)"
        >{{item.title}}</v-btn>
      </template>
      <v-btn icon @click.stop="drawer = !drawer" class="ml-auto hidden-md-and-up">
        <v-icon color="white">menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <nuxt/>
    </v-content>
    <v-footer dark class="footer" style="height: auto" color="#11333A">
      <v-container class="py-5">
        <v-layout class="footer-inner">
          <v-flex
            class="footer-copy text-xs-center text-md-left display-flex align-center"
          >© CSC Ltd Russia. {{ $t("copyright") }}</v-flex>
          <v-flex class="display-flex layout wrap justify-space-around">
            <nuxt-link
              v-for="(item,index) in navigation"
              :key="index"
              nuxt
              :to="localePath(item.to)"
              v-text="item.title"
              class="pa-2 text-uppercase"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-footer>
  </v-app>
</template>
<style lang="scss" >
@media (max-width: 960px) {
  .footer-inner {
    flex-wrap: wrap-reverse !important;
  }
  .footer-copy {
    margin-top: 24px;
    text-align: center;
    justify-content: center;
  }
}
.v-toolbar {
  .v-tabs__bar,
  .v-tabs__wrapper,
  .v-tabs__container {
    height: 100%;
  }
}
.header {
  .v-btn--active:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    background-color: white;
  }
  .v-menu__activator {
    height: 100%;
  }
  .header-link:hover {
    color: #19bcdb;
  }
}

.footer {
  a,
  .description {
    color: #919899;
    text-decoration: none;
  }
  a:hover {
    color: #19bcdb;
  }
  .links-list {
    display: flex;
    flex-direction: column;
  }
  .contacts-list {
    display: flex;
    flex-direction: column;
    a {
      display: inline-flex;
      align-items: center;
      .contacts-icon {
        color: currentColor;
      }
    }
  }
}

@media (max-width: 600px) {
  .footer {
    .links-list {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      a {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .contacts-list {
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      drawer: false
    };
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    },
    locales() {
      return this.$i18n.locales.filter(item => item.code !== this.$i18n.locale);
    },
    navigation() {
      return [
        {
          title: this.$t("index"),
          to: "index",
          items: []
        },
        {
          title: this.$t("catalog"),
          to: "catalog",
          items: this.$store.state.pills
          // .map(item => {
          //   item.forms = item.forms.map(item => {
          //     item.slug = this.localePath({
          //       name: "catalog-slug",
          //       params: { slug: item.slug }
          //     });
          //     return item;
          //   });
          //   return item;
          // })
        },
        {
          title: this.$t("about"),
          to: "about",
          items: this.$store.state.aboutPages
          // .map(item => {
          //   console.log(item);
          //   // item.forms = item.forms.map(item => {
          //   item.slug = this.localePath({
          //     name: "about-slug",
          //     params: { slug: item.slug }
          //   });
          //   //   return item;
          //   // });
          //   return item;
          // })
        },
        {
          title: this.$t("vacancies"),
          to: "vacancies",
          items: []
        },
        {
          title: this.$t("contacts"),
          to: "contacts",
          items: []
        }
      ];
    },
    pills() {
      return this.$store.state.pills;
    },
    // navigation() {
    //   return this.$store.state.navigation;
    // },
    contacts() {
      return this.$store.state.contacts;
    }
  }
};
</script>
