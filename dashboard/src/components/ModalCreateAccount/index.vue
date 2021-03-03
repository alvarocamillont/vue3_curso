<template>
  <div class="flex justify-between">
    <h1 class="text-4xl font-black text-gray-800">Crie uma conta</h1>

    <button class="text-4xl text-gray-600 focus:outline-none" @click="close">
      &times;
    </button>
  </div>

  <div class="mt-16">
    <form @submit.prevent="handlerSubmit">
      <label class="block">
        <span class="text-lg font-medium text-gray-800">Nome</span>
        <input
          v-model="state.name.value"
          class="block w-full px-4 py-4 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
          :class="{
            'border-brand-danger': !!state.name.errorMessage
          }"
          type="text"
          placeholder="Jone Doe"
        />
        <span v-if="!!state.name.errorMessage" class="block font-medium text-brand-danger">{{
          state.name.errorMessage
        }}</span>
      </label>

      <label class="block mt-9">
        <span class="text-lg font-medium text-gray-800">Email</span>
        <input
          v-model="state.email.value"
          class="block w-full px-4 py-4 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
          :class="{
            'border-brand-danger': !!state.email.errorMessage
          }"
          type="email"
          placeholder="jonedoe@test.com"
        />
        <span v-if="!!state.email.errorMessage" class="block font-medium text-brand-danger">{{
          state.email.errorMessage
        }}</span>
      </label>
      <label class="block mt-9">
        <span class="text-lg font-medium text-gray-800">Senha</span>
        <input
          v-model="state.password.value"
          class="block w-full px-4 py-4 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
          :class="{
            'border-brand-danger': !!state.password.errorMessage
          }"
          type="password"
          placeholder="senha"
        />
        <span v-if="!!state.password.errorMessage" class="block font-medium text-brand-danger">{{
          state.password.errorMessage
        }}</span>
      </label>

      <button
        :disabled="state.isLoading"
        type="submit"
        :class="{
          'opacity-50': state.isLoading
        }"
        class="px-8 py-3 mt-10 text-2xl font-bold text-white rounded-full bg-brand-main focus:outline-none transition-all duration-150"
      >
        <icon v-if="state.isLoading" name="loading" class="animate-spin" />
        <span v-else>Entrar</span>
      </button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import useModal from '../../hooks/useModal';
import { useField } from 'vee-validate';
import { validateEmptyAndLength3, validateEmptyAndEmail } from '../../utils/validators';
import service from '../../services/index';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Icon from '../Icon';

export default {
  components: { Icon },
  setup() {
    const { value: emailValue, errorMessage: emailErrorMessage } = useField('email', validateEmptyAndEmail);
    const { value: passwordValue, errorMessage: passwordErrorMessage } = useField('password', validateEmptyAndLength3);
    const { value: nameValue, errorMessage: nameErrorMessage } = useField('name', validateEmptyAndLength3);

    const modal = useModal();
    const router = useRouter();
    const toast = useToast();

    const state = reactive({
      hasErrors: false,
      isLoading: false,
      name: {
        value: nameValue,
        errorMessage: nameErrorMessage
      },
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage
      },
      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage
      }
    });

    async function login({ email, password }) {
      const { data, errors } = await service.auth.login({
        email,
        password
      });
      if (!errors) {
        window.localStorage.setItem('token', data.token);
        router.push({ name: 'Feedbacks' });
        modal.close();
      }
      state.isLoading = false;
    }

    async function handlerSubmit() {
      try {
        toast.clear();
        state.isLoading = true;

        const { errors } = await service.auth.register({
          name: state.name.value,
          email: state.email.value,
          password: state.password.value
        });

        if (!errors) {
          await login({
            email: state.email.value,
            password: state.password.value
          });
          return;
        }

        if (errors.status === 404) {
          toast.error('Email não encontrado');
        }
        if (errors.status === 401) {
          toast.error('Email ou senha inválidos');
        }
        if (errors.status === 400) {
          toast.error('Ocorreu um erro ao criar a conta');
        }

        state.isLoading = false;
      } catch (error) {
        state.isLoading = false;
        state.hasErrors = !!error;
        toast.error('Ocorreu um erro ao criar a conta');
      }
    }

    return {
      state,
      close: modal.close,
      handlerSubmit
    };
  }
};
</script>
