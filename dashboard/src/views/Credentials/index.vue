<template>
  <div class="flex justify-center w-full h-28 bg-brand-main">
    <header-logged />
  </div>
  <div class="flex flex-col items-center justify-center h-64 bg-brand-gray">
    <h1 class="text-4xl font-black text-center text-gray-800">Credenciais</h1>
    <p class="text-lg text-center text-gray-800 font-regular">
      Guia de instalação e geração de suas credenciais
    </p>
  </div>
  <div class="flex justify-center w-full h-full">
    <div class="flex flex-col w-4/5 max-w-6xl py-10">
      <h1 class="text-3xl font-black text-brand-darkgray">
        Instalação e configuração
      </h1>
      <p class="mt-10 text-lg  text-gray-800 font-regular">
        Esta aqui é sua chave de api
      </p>

      <content-loader v-if="store.Global.isLoading || state.isLoading" class="rounded" width="600px" height="50px" />

      <div v-else class="flex py-3 pl-5 pr-20 mt-2 rounded justify-between items-center bg-brand-gray w-full lg:w-1/2">
        <span v-if="state.hasErrors"> Erro ao carregar a APIKEY</span>
        <span v-else>{{ store.User.currentUser.apiKey }}</span>
        <div class="flex ml-20 mr-5" v-if="!state.hasErrors">
          <icon name="copy" :color="brandColors.graydark" size="24" class="cursor-pointer" @click="handlerCopy()" />
          <icon
            name="loading"
            :color="brandColors.graydark"
            size="24"
            class="cursor-pointer"
            @click="handlerGenerateAPIKey()"
          />
        </div>
      </div>
      <p class="mt-5 text-lg text-gray-800 font-regular">
        Coloque o script abaixo no seu site para comerçar a receber feedbacks
      </p>
      <content-loader v-if="store.Global.isLoading || state.isLoading" class="rounded" width="600px" height="50px" />
      <div v-else class="py-3 pl-5  mt-2 rounded bg-brand-gray w-full lg:w-2/3 overflow-x-scroll">
        <span v-if="state.hasErrors"> Erro ao carregar a APIKEY</span>
        <pre v-else>
        &lt;script src="https://alvarocamillont-feedbacker-widget.netlify.app?api_key={{
            store.User.currentUser.apiKey
          }}"&gt;&lt;/script&gt;
      </pre
        >
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLogged from '../../components/HeaderLogged';
import ContentLoader from '../../components/ContentLoader';
import Icon from '../../components/Icon';
import useStore from '../../hooks/useStore';
import pallete from '../../../palette';
import { reactive, watch } from 'vue';
import services from '../../services';
import { setApiKey } from '../../store/user';
import { useToast } from 'vue-toastification';

export default {
  components: { HeaderLogged, Icon, ContentLoader },
  setup() {
    const store = useStore();
    const state = reactive({
      hasErrors: false,
      isLoading: false
    });
    const toast = useToast();

    watch(
      () => store.User.currentUser,
      () => {
        if (!store.Global.isLoading && !store.User.currentUser.apiKey) {
          handlerError(true);
        }
      }
    );

    async function handlerGenerateAPIKey() {
      try {
        state.isLoading = true;
        const { data } = await services.users.generateApiKey();
        setApiKey(data.apiKey);
      } catch (error) {
        handlerError(error);
      } finally {
        state.isLoading = false;
      }
    }

    function handlerError(error) {
      state.isLoading = false;
      state.hasErrors = !!error;
    }

    async function handlerCopy() {
      toast.clear();
      try {
        await navigator.clipboard.writeText(store.User.currentUser.apiKey);
        toast.success('Copiado!');
      } catch (error) {
        handlerError(error);
      }
    }

    return {
      handlerCopy,
      handlerGenerateAPIKey,
      state,
      store,
      brandColors: pallete.brand
    };
  }
};
</script>
