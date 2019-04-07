<template>
  <v-form>
    <v-btn icon @click="$emit('update:dialog',false)" style="position: fixed;
   right: 33px;">
      <v-icon>clear</v-icon>
    </v-btn>
    <v-container>
      <v-card-title class="display-3">
        ИЗВЕЩЕНИЕ О НЕЖЕЛАТЕЛЬНОЙ РЕАКЦИИ
        ИЛИ ОТСУТСТВИИ ТЕРАПЕВТИЧЕСКОГО ЭФФЕКТА
        ЛЕКАРСТВЕННОГО ПРЕПАРАТА
      </v-card-title>

      <v-layout wrap class="px-3">
        <v-flex xs12>
          <h3>Данные пациента</h3>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="patientName"
            box
            hint="Обязательное поле"
            persistent-hint
            label="Инициалы пациента (код пациента)"
            required
            :error-messages="patientNameErrors"
            @blur="$v.patientName.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-subheader class="display-1 pl-0">Пол:</v-subheader>
          <v-radio-group class v-model="gender" row>
            <v-radio label="M" value="М"></v-radio>
            <v-radio label="Ж" value="Ж"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-slide-y-transition>
          <v-flex xs12 class="d-flex" v-if="gender==='Ж'">
            <v-checkbox class="flex xs12 sm6" label="Беременность" v-model="pregnant"></v-checkbox>
            <v-slide-x-transition>
              <v-text-field
                box
                v-if="pregnant"
                v-model="pregnantTime"
                class="flex xs12 sm6"
                label="Срок"
                suffix="недель"
              ></v-text-field>
            </v-slide-x-transition>
          </v-flex>
        </v-slide-y-transition>

        <v-flex xs12 sm6>
          <v-text-field v-model="age" box label="Возраст"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field v-model="weight" box label="Вес" suffix="кг"></v-text-field>
        </v-flex>

        <v-subheader class="display-1 flex xs12 mr-3">Аллергия</v-subheader>
        <v-radio-group class="flex xs12 sm6" v-model="allergy" row>
          <v-radio label="Нет" value="false"></v-radio>
          <v-radio label="Да" value="true"></v-radio>
        </v-radio-group>
        <v-slide-x-transition>
          <v-text-field
            v-model="allergySubj"
            box
            v-if="allergy==='true'"
            class="flex xs12 sm6 mt-3"
            label="На что"
          ></v-text-field>
        </v-slide-x-transition>
        <v-subheader class="flex xs12 display-1">Лечение</v-subheader>
        <v-checkbox v-model="therapy" class="flex" value="амбулаторное" label="амбулаторное"></v-checkbox>
        <v-checkbox v-model="therapy" class="flex" value="стационарное" label="стационарное"></v-checkbox>
        <v-checkbox v-model="therapy" class="flex" value="самолечение" label="самолечение"></v-checkbox>

        <h3 class="flex xs12">Лекарственные средства, предположительно вызвавшие НР</h3>
        <v-combobox
          box
          hint="Обязательное поле"
          persistent-hint
          class="flex xs12"
          v-model="pillName"
          :items="items"
          label="Наименование ЛС"
          :error-messages="pillNameErrors"
          @blur="$v.pillName.$touch()"
        ></v-combobox>
        <v-slide-y-transition>
          <v-combobox
            box
            class="flex xs12"
            v-if="pillName"
            v-model="pillForm"
            :items="forms"
            label="Форма выпуска"
          ></v-combobox>
        </v-slide-y-transition>
        <v-text-field v-model="batchNumber" box class="flex xs12 sm6" label="Номер серии"></v-text-field>
        <v-text-field v-model="dose" box class="flex xs12 sm6" label="Доза, путь введения"></v-text-field>
        <v-text-field v-model="dateStart" box class="flex xs12 sm6" label="Дата начала терапии"></v-text-field>
        <v-text-field v-model="dateEnd" box class="flex xs12 sm6" label="Дата окончания терапии"></v-text-field>
        <v-text-field v-model="indication" box class="flex xs12 sm6" label="Показание"></v-text-field>
        <h3 class="flex xs12">Нежелательная реакция</h3>
        <v-textarea
          v-model="reactionDescription"
          box
          hint="Обязательное поле"
          persistent-hint
          class="flex xs12"
          label="Описание реакции* (укажите все детали, включая данные лабораторных исследований)"
          required
          :error-messages="reactionDescriptionErrors"
          @blur="$v.reactionDescription.$touch()"
        ></v-textarea>
        <v-text-field v-model="reactionStart" box class="flex xs12 sm6" label="Дата начала НР"></v-text-field>
        <v-text-field v-model="reactionEnd" box class="flex xs12 sm6" label="Дата разрешения НР"></v-text-field>

        <v-subheader class="flex display-1 xs12">Критерии серьезности НР</v-subheader>
        <v-checkbox v-model="power" class="flex" value="Смерть" label="Смерть"></v-checkbox>
        <v-checkbox v-model="power" class="flex" value="Угроза жизни" label="Угроза жизни"></v-checkbox>
        <v-checkbox
          v-model="power"
          class="flex"
          value="Госпитализация или ее продление"
          label="Госпитализация или ее продление"
        ></v-checkbox>
        <v-checkbox v-model="power" class="flex" value="Инвалидность" label="Инвалидность"></v-checkbox>
        <v-checkbox
          v-model="power"
          class="flex"
          value="Врожденные аномалии"
          label="Врожденные аномалии"
        ></v-checkbox>
        <v-checkbox
          v-model="power"
          class="flex"
          value="Клинически значимое событие"
          label="Клинически значимое событие"
        ></v-checkbox>
        <v-checkbox v-model="power" class="flex" value="Не применимо" label="Не применимо"></v-checkbox>

        <v-subheader class="flex display-1 xs12">Предпринятые меры</v-subheader>
        <v-checkbox v-model="meri" class="flex" value="Без лечения" label="Без лечения"></v-checkbox>
        <v-checkbox
          v-model="meri"
          class="flex"
          value="Отмена подозреваемого ЛС"
          label="Отмена подозреваемого ЛС"
        ></v-checkbox>
        <v-checkbox v-model="meri" class="flex" value="Снижение дозы ЛС" label="Снижение дозы ЛС"></v-checkbox>
        <v-checkbox
          v-model="meri"
          class="flex"
          value="Немедикаментозная терапия (в т.ч. хирургическое вмешательство)"
          label="Немедикаментозная терапия (в т.ч. хирургическое вмешательство)"
        ></v-checkbox>
        <v-checkbox
          v-model="meri"
          class="flex"
          value="Лекарственная терапия"
          label="Лекарственная терапия"
        ></v-checkbox>
        <v-slide-y-transition>
          <v-text-field
            v-if="meri==='Лекарственная терапия'"
            v-model="meriTherapy"
            box
            class="flex xs12"
            label="Подробности"
          ></v-text-field>
        </v-slide-y-transition>
        <v-subheader class="flex display-1 xs12">Исход</v-subheader>
        <v-checkbox
          class="flex"
          v-model="ishod"
          value="Выздоровление без последствий"
          label="Выздоровление без последствий"
        ></v-checkbox>
        <v-checkbox
          class="flex"
          v-model="ishod"
          value="Улучшение состояние"
          label="Улучшение состояние"
        ></v-checkbox>
        <v-checkbox
          class="flex"
          v-model="ishod"
          value="Состояние без изменений"
          label="Состояние без изменений"
        ></v-checkbox>

        <v-checkbox class="flex" v-model="ishod" value="Смерть" label="Смерть"></v-checkbox>
        <v-checkbox class="flex" v-model="ishod" value="Неизвестно" label="Неизвестно"></v-checkbox>

        <v-checkbox class="flex" v-model="ishod" value="Не применимо" label="Не применимо"></v-checkbox>
        <v-checkbox
          class="flex"
          v-model="ishod"
          value="Выздоровление с последствиями"
          label="Выздоровление с последствиями"
        ></v-checkbox>
        <v-slide-y-transition>
          <v-text-field
            v-if="ishod==='Выздоровление с последствиями'"
            v-model="ishodText"
            box
            class="flex xs12"
            label="Укажите последствия"
          ></v-text-field>
        </v-slide-y-transition>
        <v-subheader class="flex display-1 xs12">Сопровождалась ли отмена ЛС исчезновением НР?</v-subheader>
        <v-checkbox v-model="ischeznovenie" class="flex" value="Нет" label="Нет"></v-checkbox>
        <v-checkbox v-model="ischeznovenie" class="flex" value="Да" label="Да"></v-checkbox>
        <v-checkbox
          v-model="ischeznovenie"
          class="flex"
          value="ЛС не отменялось"
          label="ЛС не отменялось"
        ></v-checkbox>
        <v-checkbox v-model="ischeznovenie" class="flex" value="Не применимо" label="Не применимо"></v-checkbox>

        <v-subheader class="flex display-1 xs12">Назначалось ли лекарство повторно?</v-subheader>
        <v-checkbox v-model="povtor" class="flex" value="Нет" label="Нет"></v-checkbox>
        <v-checkbox v-model="povtor" class="flex" value="Не применимо" label="Не применимо"></v-checkbox>
        <v-checkbox v-model="povtor" class="flex" value="Да" label="Да"></v-checkbox>
        <v-slide-y-transition>
          <v-text-field v-if="povtor==='Да'" box class="flex xs12" label="Результат"></v-text-field>
        </v-slide-y-transition>
        <h3 class="flex xs12" label>Данные сообщающего лица</h3>
        <v-checkbox
          v-model="personRole"
          class="flex"
          value="Другой специалист системы здравоохранения"
          label="Другой специалист системы здравоохранения"
        ></v-checkbox>
        <v-checkbox v-model="personRole" class="flex" value="Пациент" label="Пациент"></v-checkbox>
        <v-checkbox v-model="personRole" class="flex" value="Иной" label="Иной"></v-checkbox>
        <v-text-field
          v-model="personPhone"
          :error-messages="personPhoneErrors"
          mask="(###) ### - ####"
          hint="Обязательное поле"
          persistent-hint
          box
          class="flex xs12"
          label="Контактный телефон"
          required
          @blur="$v.personPhone.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="personEmail"
          :error-messages="personEmailErrors"
          hint="Обязательное поле"
          persistent-hint
          box
          class="flex xs12"
          label="Email"
          required
          @blur="$v.personEmail.$touch()"
        ></v-text-field>

        <v-text-field v-model="personName" box class="flex xs12" label="Ф.И.О"></v-text-field>
        <v-text-field v-model="personWork" box class="flex xs12" label="Должность и место работы"></v-text-field>
        <v-slide-y-transition>
          <v-alert :value="errors" class="flex xs12 mt-1 mb-4" type="error">
            <span v-for="(error,i) in allErrors" :key="i">{{error}},&nbsp;</span>
          </v-alert>
        </v-slide-y-transition>
      </v-layout>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outline color="red darken-1" large flat @click="$emit('update:dialog',false)">Закрыть</v-btn>
        <v-btn outline color="green darken-1" large flat @click="send">Отправить</v-btn>
      </v-card-actions>
    </v-container>
  </v-form>
</template>

<style lang="scss" scoped>
</style>

<script>
import axios from "axios";

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
    patientName: {
      required,
      maxLength: maxLength(35),
      minLength: minLength(3)
    },
    pillName: { required },
    personEmail: { required, email },
    personPhone: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(15)
    },
    reactionDescription: {
      required,
      maxLength: maxLength(3000),
      minLength: minLength(3)
    }
  },
  methods: {
    async send() {
      this.$v.$touch();

      if (!this.$v.$anyError) {
        const html = `
          <h1>Новое извещение о нежелательной реакции или отсуствии терапевтического эффекта лекарственного препарата</h1>
          <h2>Данные пациента</h2>
          Инициалы пациента (код пациента): ${this.patientName || ""}<br/>
          Пол: ${this.gender || ""}<br/>
          Беременность: ${
            this.pregnant ? "+ " + this.pregnantTime || "" : "-"
          } <br/>
          Возраст: ${this.age || ""}<br/>
          Вес: ${this.weight || ""}<br/>
          Аллергия: ${this.allergy || ""} на ${this.allergySubj || ""}<br/>
          Лечение: ${this.therapy || ""}<br/>
          <h2>Лекарственное средства, предположительно вызвавшие НР</h2>
          Название: ${this.pillForm || ""}<br/>
          Форма выпуска: ${this.pillName || ""}<br/>
          Номер серии: ${this.batchNumber || ""}<br/>
          Доза, путь введения: ${this.dose || ""}<br/>
          Дата начала терапии ${this.dateStart || ""}<br/>
          Дата окончания терапии: ${this.dateEnd || ""}<br/>
          Показание: ${this.indication || ""}<br/>
          <h2>Нежелательная реакция</h2>
          Описание реакции: ${this.reactionDescription || ""}<br/>
          Дата начала НР: ${this.reactionStart || ""}<br/>
          Дата разрешения НР: ${this.reactionEnd || ""}<br/>
          Критерии серьезности НР: ${this.power || ""}<br/>
          Предпринятые меры: ${this.meri || ""} ${this.meriTherapy || ""}<br/>
          Исход: ${this.ishod ? this.ishod + this.ishodText || "" : ""}<br/>
          Сопровождалась ли отмена ЛС исчезновением НР? ${this.ischeznovenie ||
            ""}<br/>
          Назначалось ли лекарство повторно? ${this.povtor || ""}<br/>
          <h2>Данные сообщающего лица</h2>
          Роль: ${this.personRole || ""}<br/>
          Email: ${this.personEmail || ""}<br/>
          Контактный телефон: ${this.personPhone || ""}<br/>
          Ф.И.О: ${this.personName || ""}<br/>
          Должность и место работы: ${this.personWork || ""}<br/>
          Дата сообщения: ${new Date()}
          `;
        const req = await axios
          .post(process.env.baseUrl + "/email", {
            to: process.env.formTroubleTo,
            from: process.env.formFrom,
            subject: `Нежелательная реакция`,
            html: html
          })
          .then(response => {
            this.$v.$reset();
            this.$emit("update:dialog", false);
          })
          .catch((error, item) => {
            this.formError = true;
            this.formErrors.push(error.response.data.message);
          });
      }
    }
  },
  computed: {
    pills() {
      return this.$store.state.pills;
    },
    items() {
      return this.pills.map(item => item.title);
    },
    forms() {
      return this.pills.find(item => (item.name = this.pillName))
        ? this.pills
            .find(item => (item.name = this.pillName))
            .forms.map(item => item.title)
        : "";
    },
    pillNameErrors() {
      const errors = [];
      if (!this.$v.pillName.$dirty) return errors;

      !this.$v.pillName.required &&
        errors.push("Выберите лекарственное средство");
      return errors;
    },
    reactionDescriptionErrors() {
      const errors = [];
      if (!this.$v.reactionDescription.$dirty) return errors;
      !this.$v.reactionDescription.maxLength &&
        errors.push("Слишком длинное описание");
      !this.$v.reactionDescription.minLength &&
        errors.push("Слишком короткое описание");
      !this.$v.reactionDescription.required &&
        errors.push("Введите описание НР");
      return errors;
    },
    patientNameErrors() {
      const errors = [];
      if (!this.$v.patientName.$dirty) return errors;
      !this.$v.patientName.maxLength && errors.push("Слишком длинное имя");
      !this.$v.patientName.minLength && errors.push("Слишком короткое имя");
      !this.$v.patientName.required && errors.push("Введите имя");
      return errors;
    },
    personEmailErrors() {
      const errors = [];
      if (!this.$v.personEmail.$dirty) return errors;
      !this.$v.personEmail.email && errors.push("Введите корректный email");
      !this.$v.personEmail.required && errors.push("Введите email");
      return errors;
    },
    personPhoneErrors() {
      const errors = [];
      if (!this.$v.personPhone.$dirty) return errors;
      !this.$v.personPhone.maxLength &&
        errors.push("phone must be at most 15 characters long");
      !this.$v.personPhone.minLength && errors.push("Слишком короткий телефон");
      !this.$v.personPhone.required && errors.push("Введите телефон");
      return errors;
    },
    errors() {
      return this.$v.$anyError || this.formError;
    },
    allErrors() {
      return [
        ...this.formErrors,
        ...this.personPhoneErrors,
        ...this.personEmailErrors,
        ...this.patientNameErrors,
        ...this.reactionDescriptionErrors,
        ...this.pillNameErrors
      ];
    }
  },
  data: () => ({
    formErrors: [],
    formError: false,
    patientName: "",
    gender: "",
    pregnant: false,
    pregnantTime: "",
    age: "",
    weight: "",
    allergy: false,
    allergySubj: "",
    therapy: "",
    pillName: "",
    batchNumber: "",
    dose: "",
    dateStart: "",
    dateEnd: "",
    indication: "",
    reactionDescription: "",
    reactionStart: "",
    reactionEnd: "",
    pillForm: "",
    ishod: "",
    ishodText: "",
    ischeznovenie: "",
    povtor: "",
    power: "",
    meri: "",
    meriTherapy: "",
    personRole: "",
    personEmail: "",
    personPhone: "",
    personName: "",
    personWork: ""
  })
};
</script>

