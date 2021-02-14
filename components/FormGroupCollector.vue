<template>
  <div class="row">
    <div class="col-sm-6">
      <b-form-group label="Grupo de coletores">
        <form-entity-select
          :value="value.group"
          type="groups"
          @input="groupChanged"
        />
      </b-form-group>
    </div>
    <div class="col-sm-6">
      <b-form-group label="Coletor">
        <form-entity-select
          v-if="collectors_filtered && collectors_filtered.length"
          :value="value.collector"
          :items="collectors_filtered"
          field="collector"
          @input="collectorChanged"
        />
        <no-item :list="collectors_filtered" />
      </b-form-group>
    </div>
  </div>
</template>

<script>
import NoItem from '@/components/NoItem'
import FormEntitySelect from '@/components/FormEntitySelect'

export default {
  name: 'FormGroupCollector',
  components: {
    NoItem,
    FormEntitySelect,
  },
  props: {
    value: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      collectors: [],
      collectors_filtered: [],
    }
  },
  created() {
    this.$axios
      .$get('users', {
        params: {
          role: 'collector',
          populate: {
            path: 'group',
            select: '_id',
          },
        },
      })
      .then((collectors) => {
        this.collectors = collectors

        this.collectors = this.collectors.map((collector) => {
          return {
            id: collector._id,
            title: collector.name,
            description: collector.nickname,
            picture: collector.image ? collector.image.thumb : '',
            group: collector.group ? collector.group._id : null,
          }
        })
        this.groupChanged(this.value.group)
      })
      .catch(this.showError)
  },
  methods: {
    groupChanged(group) {
      if (group) {
        this.collectors_filtered = this.collectors.filter((collector) => {
          return collector.group && collector.group === group
        })
      } else {
        this.collectors_filtered = this.collectors
      }
      const form = { ...this.value }
      form.group = group
      this.$emit('input', form)
    },
    collectorChanged(collector) {
      const form = { ...this.value }
      form.collector = collector
      this.$emit('input', form)
    },
  },
}
</script>
