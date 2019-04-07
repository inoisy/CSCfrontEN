<template>
  <v-form v-model="valid" class="layout wrap">
    <h2 class="flex xs12 mb-5">Форма отправки резюме</h2>
    <!-- {{vacancy}} -->
    <v-text-field
      class="xs12 py-0 flex"
      box
      hint="Обязательное поле"
      persistent-hint
      v-model="name"
      :error-messages="nameErrors"
      :counter="35"
      label="Ваше имя"
      required
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 sm6 py-0 flex"
      box
      hint="Обязательное поле"
      persistent-hint
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 sm6 py-0 flex"
      box
      hint="Обязательное поле"
      persistent-hint
      v-model="phone"
      :error-messages="phoneErrors"
      mask="(###) ### - ####"
      label="Телефон"
      required
      @blur="$v.phone.$touch()"
    ></v-text-field>

    <v-textarea
      v-model="about"
      class="xs12 py-0 flex"
      box
      name="input-7-4"
      label="Расскажите о себе"
    ></v-textarea>
    <v-textarea v-model="education" class="xs12 py-0 flex" box name="input-7-4" label="Образование"></v-textarea>
    <v-textarea v-model="work" class="xs12 py-0 flex" box name="input-7-4" label="Опыт работы"></v-textarea>
    <v-textarea
      v-model="skills"
      class="xs12 py-0 flex"
      box
      name="input-7-4"
      label="Ключевые навыки"
    ></v-textarea>
    <v-textarea
      v-model="languages"
      class="xs12 py-0 flex"
      box
      name="input-7-4"
      label="Знание языков"
    ></v-textarea>
    <v-textarea
      v-model="additional"
      class="xs12 py-0 flex"
      box
      name="input-7-4"
      label="Дополнительная информация"
    ></v-textarea>

    <!-- @blur="$v.message.$touch()" -->
    <v-flex>
      <v-btn large class="ml-0" color="white" @click="submit">Отправить</v-btn>
      <v-btn large outline @click="$emit('update:dialog',false)">Закрыть</v-btn>
    </v-flex>

    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || errors">
        <v-alert
          :value="this.formSuccess"
          class="flex xs12 mt-3"
          type="success"
        >Cообщение отправлено!</v-alert>
        <v-alert :value="errors" class="flex xs12 mt-3" type="error">
          <span v-for="(error,i) in allErrors" :key="i">{{error}},&nbsp;</span>
        </v-alert>
      </v-flex>
    </v-slide-y-transition>
    <!-- {{formMessage}} -->
  </v-form>
</template>


<script>
// import axios from "axios";

import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
  alpha
} from "vuelidate/lib/validators";
export default {
  props: ["vacancy"],
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },
    email: { required, email },
    // subject: {
    //   required,
    //   maxLength: maxLength(35),
    //   minLength: minLength(3)
    // },
    phone: { required, minLength: minLength(10), maxLength: maxLength(15) }
    // message: { required, maxLength: maxLength(1500), minLength: minLength(3) }
  },
  data: () => ({
    about: "",
    education: "",
    work: "",
    skills: "",
    languages: "",
    additional: "",
    // education: [],
    // educationName: "",
    formMessage: "",
    formSuccess: false,
    formError: false,
    formErrors: [],
    name: "",
    email: "",
    // subject: "",
    phone: "",
    valid: ""
  }),
  methods: {
    create() {
      this.education.push({
        text: this.educationName
      });
    },
    clear() {
      this.$v.$reset();
      this.phone = "";
      this.name = "";
      this.email = "";
      this.about = "";
      this.education = "";
      this.work = "";
      this.skills = "";
      this.languages = "";
      this.additional = "";
    },
    async submit() {
      this.$v.$touch();

      const msg = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        about: this.about,
        education: this.education,
        work: this.work,
        skills: this.skills,
        languages: this.languages,
        additional: this.additional
      };
      // console.log(this.$v);
      //   console.log(this.$v);
      if (!this.$v.$anyError) {
        const req = await this.$axios
          .post(process.env.baseUrl + "/email", {
            to: process.env.formContactTo,
            from: process.env.formFrom,
            subject: `Новое резюме`,
            html: `Имя ${msg.name}.<br/> 
            Email: ${msg.email}.<br/>
             Телефон: ${msg.phone}.<br/> О себе: ${msg.about}<br/>
            Образование: ${msg.education}<br/>
            Опыт работы: ${msg.work}<br/>
            Навыки: ${msg.skills}<br/>
            Языки: ${msg.languages}<br/>
            Доп.инфо: ${msg.additional}<br/>`
          })
          .then(response => {
            this.clear();
            this.formSuccess = true;
            this.$emit("update:dialog", false);
          })
          .catch(error => {
            this.clear();
            this.formError = true;
            this.formErrors.push(error.response.data.message);
          });
      }
    }
  },
  computed: {
    errors() {
      return this.$v.$anyError || this.formError;
    },
    allErrors() {
      return [
        ...this.formErrors,
        ...this.phoneErrors,
        ...this.emailErrors,
        ...this.nameErrors
      ];
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength && errors.push("Слишком длинное имя");
      !this.$v.name.minLength && errors.push("Слишком короткое имя");
      !this.$v.name.required && errors.push("Введите имя");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Введите корректный email");
      !this.$v.email.required && errors.push("Введите email");
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.maxLength &&
        errors.push("phone must be at most 15 characters long");
      !this.$v.phone.minLength && errors.push("Слишком короткий телефон");
      !this.$v.phone.required && errors.push("Введите телефон");
      return errors;
    }
  }
};
</script>

