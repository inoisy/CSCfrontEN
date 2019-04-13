<template>
  <v-form v-model="valid" class="layout wrap">
    <v-text-field
      class="xs12 sm6 py-0 flex"
      solo
      v-model="name"
      :error-messages="nameErrors"
      :counter="35"
      :label="currLocale==='ru'? 'Ваше имя' : 'Name'"
      required
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 sm6 py-0 flex"
      solo
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 sm6 py-0 flex"
      solo
      v-model="phone"
      :error-messages="phoneErrors"
      mask="(###) ### - ####"
      :label="currLocale==='ru'? 'Телефон' : 'Phone'"
      required
      @blur="$v.phone.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 sm6 py-0 flex"
      solo
      v-model="subject"
      :error-messages="subjectErrors"
      :label="currLocale==='ru'? 'Тема обращения' : 'Subject'"
      required
      @blur="$v.subject.$touch()"
    ></v-text-field>
    <v-textarea
      v-model="message"
      :error-messages="messageErrors"
      class="xs12 py-0 flex"
      solo
      name="input-7-4"
      :label="currLocale==='ru'? 'Ваше сообщение' : 'Message'"
      @blur="$v.message.$touch()"
    ></v-textarea>
    <v-flex>
      <v-btn class="ml-0" color="white" @click="submit">{{currLocale==="ru" ? 'Отправить' : "Send"}}</v-btn>
      <v-btn flat @click="clear">{{currLocale==="ru" ? 'Очистить' : "Clear"}}</v-btn>
    </v-flex>

    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert
          :value="this.formSuccess"
          class="flex xs12 mt-3"
          type="success"
        >{{currLocale==="ru" ? 'Cообщение отправлено!' : "Message sent!"}}</v-alert>
        <v-alert
          :value="this.formError"
          class="flex xs12 mt-3"
          type="error"
        >{{currLocale==="ru" ? 'Ошибка при отправке!' : "Error!"}}</v-alert>
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
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },
    email: { required, email },
    subject: {
      required,
      maxLength: maxLength(35),
      minLength: minLength(3)
    },
    phone: { required, minLength: minLength(10), maxLength: maxLength(15) },
    message: { required, maxLength: maxLength(1500), minLength: minLength(3) }
  },
  data: () => ({
    formMessage: "",
    formSuccess: false,
    formError: false,
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
    valid: ""
  }),
  methods: {
    clear() {
      this.$v.$reset();
      this.subject = "";
      this.phone = "";
      this.message = "";
      this.name = "";
      this.email = "";
    },
    async submit() {
      //   console.log(this.valid);
      this.$v.$touch();

      const msg = {
        name: this.name,
        email: this.email,
        subject: this.subject,
        phone: this.phone,
        message: this.message
      };
      //   console.log(this.$v);
      if (!this.$v.$anyError) {
        const req = await this.$axios
          .post(process.env.baseUrl + "/email", {
            to: process.env.formContactTo,
            from: process.env.formFrom,
            subject: `Обращение с сайта`,

            text: `Обращение с сайта от ${msg.name} на тему ${
              msg.subject
            }. Email: ${msg.email}. Телефон: ${msg.phone}. Сообщение: ${
              msg.message
            }`,
            html: `Обращение с сайта от ${msg.name} на тему ${
              msg.subject
            }.<br/> Email: ${msg.email}. Телефон: ${
              msg.phone
            }.<br/> Сообщение: ${msg.message}`
          })
          .then(response => {
            this.formSuccess = true;
            this.clear();
          })
          .catch(error => {
            this.formError = true;
            this.clear();
          });
      }
    }
  },
  computed: {
    currLocale() {
      return this.$i18n.locale;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push(
          this.currLocale === "ru" ? "Слишком длинное имя" : "Name is too long"
        );
      !this.$v.name.minLength &&
        errors.push(
          this.currLocale === "ru"
            ? "Слишком короткое имя"
            : "Name is too short"
        );
      !this.$v.name.required &&
        errors.push(
          this.currLocale === "ru" ? "Введите имя" : "Enter your name"
        );
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email &&
        errors.push(
          this.currLocale === "ru"
            ? "Введите корректный email"
            : "Enter a valid email"
        );
      !this.$v.email.required &&
        errors.push(this.currLocale === "ru" ? "Введите email" : "Enter email");
      return errors;
    },
    subjectErrors() {
      const errors = [];
      if (!this.$v.subject.$dirty) return errors;
      !this.$v.subject.maxLength &&
        errors.push(
          this.currLocale === "ru"
            ? "Слишком длинная тема"
            : "Subject is too long"
        );
      !this.$v.subject.minLength &&
        errors.push(
          this.currLocale === "ru"
            ? "Слишком короткая тема"
            : "Subject is too short"
        );
      !this.$v.subject.required &&
        errors.push(
          this.currLocale === "ru" ? "Введите тему" : "Enter subject"
        );
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.maxLength &&
        errors.push("Phone must be at most 15 characters long");
      !this.$v.phone.minLength &&
        errors.push(
          this.currLocale === "ru"
            ? "Слишком короткий телефон"
            : "Phone too short"
        );
      !this.$v.phone.required &&
        errors.push(
          this.currLocale === "ru" ? "Введите телефон" : "Enter phone"
        );
      return errors;
    },
    messageErrors() {
      const errors = [];
      if (!this.$v.message.$dirty) return errors;
      !this.$v.message.maxLength &&
        errors.push(
          this.currLocale === "ru"
            ? "Слишком длинное сообщение"
            : "Message too long"
        );
      !this.$v.message.minLength &&
        errors.push(
          this.currLocale === "ru" ? "Введите сообщение" : "Message too short"
        );
      !this.$v.message.required &&
        errors.push(
          this.currLocale === "ru" ? "Введите сообщение" : "Enter your message"
        );
      return errors;
    }
  }
};
</script>

