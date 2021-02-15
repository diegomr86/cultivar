<template>
  <b-list-group class="sidebar color-white">
    <b-list-group-item>
      <i class="fas fa-tools" /> Ferramentas
    </b-list-group-item>
    <b-list-group-item class="submenu">
      <b-nav vertical>
        <b-nav-item to="/ferramentas/o-que-plantar-esse-mes">
          O que plantar esse mês?
        </b-nav-item>
        <b-nav-item to="/catalogo-de-especies">
          Catálogo de hortaliças
        </b-nav-item>
      </b-nav>
    </b-list-group-item>
    <b-list-group-item>
      <i class="fas fa-book-reader" /> Guia de cultivo
    </b-list-group-item>
    <b-list-group-item class="submenu">
      <b-nav vertical>
        <b-nav-item to="/guia-de-cultivo/dicas-basicas">
          Dicas básicas
        </b-nav-item>
        <b-nav-item to="/guia-de-cultivo/planejamento-da-horta">
          Planejamento da Horta
        </b-nav-item>
        <b-nav-item to="/guia-de-cultivo/quando-plantar">
          Quando plantar
        </b-nav-item>
        <b-nav-item to="/guia-de-cultivo/como-plantar">
          Como plantar
        </b-nav-item>
        <b-nav-item to="/guia-de-cultivo/cuidados-com-a-horta">
          Cuidados com a Horta
        </b-nav-item>
      </b-nav>
    </b-list-group-item>
    <b-list-group-item>
      <i class="fas fa-info-circle" /> Plataforma
    </b-list-group-item>
    <b-list-group-item class="submenu">
      <b-nav vertical>
        <b-nav-item to="/sobre"> Sobre </b-nav-item>
        <b-nav-item to="/colabore"> Colabore </b-nav-item>
      </b-nav>
    </b-list-group-item>
    <b-list-group-item v-if="currentUser">
      <i class="fa fa-user" /> {{ currentUser.name }}
    </b-list-group-item>
    <b-list-group-item v-if="currentUser" class="bg-brown-2">
      <b-nav vertical>
        <b-nav-item @click="$auth.logout()">Sair</b-nav-item>
      </b-nav>
    </b-list-group-item>
  </b-list-group>
</template>
