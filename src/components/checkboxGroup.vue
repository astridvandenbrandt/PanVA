<template>
  <div id="checkAllGroup" :style="{ borderBottom: '1px solid #E9E9E9' }">
    <a-checkbox
      v-model:checked="checkAll"
      :indeterminate="indeterminate"
      @change="onCheckAllChange"
    >
      select all
    </a-checkbox>
  </div>
  <!-- <br /> -->
  <div id="checkBoxGroup">
    <a-checkbox-group
      v-model:value="checkedList"
      :options="checkboxPos"
      @change="onCheckChange"
    />
  </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'checkboxGroup',
  setup() {
    const store = useStore()
    const checkboxPos = computed(() => store.getters.positionsCheckboxes)

    const state = reactive({
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      checkPositions: checkboxPos,
    })

    const onCheckAllChange = (e) => {
      if (e.target.checked == true) {
        console.log('check all')
        // lstCheck =
        state.checkedList = checkboxPos.value
        state.indeterminate = false
        // console.log('state', state, state.checkedList.length)
      }
      if (e.target.checked == false) {
        console.log('check none')
        state.checkedList = []
        // console.log('state', state, state.checkedList.length)
      }

      // if (state.checkedlist.length < checkboxPos.value.length){
      //   state.indeterminate = true
      // }
      // console.log('lstCheck = ', lstCheck)
      // Object.assign(state, {
      //   checkedList: e.target.checked ? checkboxPos : [],
      //   indeterminate: false,
      // });
      // console.log('state object', state)
      store.dispatch('setSelectedPositions', Array.from(state.checkedList))
      console.log(
        'getter updated selectedPositions',
        store.getters.selectedPositions
      )
    }

    const onCheckChange = (e) => {
      console.log('e', e)
      // console.log('state', state)
      store.dispatch('setSelectedPositions', Array.from(state.checkedList))
      console.log(
        'getter updated selectedPositions',
        store.getters.selectedPositions
      )
      // console.log('creating intermediate')
      // console.log(state.checkPositions, state.checkPositions.length, state.checkedList.length)
      if (state.checkedList.length < state.checkPositions.length) {
        state.checkAll = false
        state.indeterminate = true
      }
    }

    // watch(
    //   () => state.checkedList,
    //   val => {
    //     state.indeterminate = !!val.length && val.length < checkboxPos.value.length;
    //     state.checkAll = val.length === checkboxPos.value.length;
    //   },
    // );

    return {
      ...toRefs(state),
      onCheckAllChange,
      onCheckChange,
      store,
      checkboxPos,
    }
  },
}
</script>

<style>
#checkBoxGroup {
  margin-left: 2px;
}

label.ant-checkbox-group-item {
  display: inline-block;
  margin-left: 1px;
  margin-right: 1px;
  width: 9px;
  font-size: 0px;
}

span.ant-checkbox-inner {
  width: 8px;
  height: 8px;
}

span.ant-checkbox-inner::after {
  width: 4.5px;
  height: 6px;
}

span.ant-checkbox-indeterminate .ant-checkbox-inner::after {
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background-color: #1890ff;
  border: 0;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  content: ' ';
}

span.ant-checkbox-checked .ant-checkbox-inner::after {
  transform: rotate(45deg) scale(0.8) translate(-90%, -50%);
  -webkit-transform: rotate(45deg) scale(0.8) translate(-90%, -50%);
  -ms-transform: rotate(45deg) scale(0.8) translate(-90%, -50%);
}

/* #testCheck {
  
      } */
</style>
