<template>
  <div class="flex w-full p-2">
    <div class="main-table flex flex-col flex-grow mr-5">
      <div class="flex flex-col border p-2">
        <div class="schema-options flex h-[32px] items-center justify-between">
          <div class="left flex items-center">
            <h3>@Schema</h3>
            <div class="w-[168px] ml-6">
              <el-input v-model="schemaOptions.collection" @input="generator"></el-input>
            </div>
            <el-checkbox
              label="timestamps"
              v-model="schemaOptions.timestamps"
              class="ml-6"
              @change="generator"
            />
          </div>
          <div class="right">
            <el-button type="secondary" @click="clearTableData">Clear</el-button>
          </div>
        </div>
        <div class="mt-2">
          <el-table :data="tableData" height="auto" width="600" border highlight-current-row>
            <el-table-column prop="field" label="field" width="120" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.field" @input="generator"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="type" width="180" align="center">
              <template #default="scope">
                <el-select
                  v-model="scope.row.type"
                  class=""
                  placeholder="Select"
                  @change="generator"
                >
                  <el-option
                    v-for="item in fieldTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="required" label="required" width="86" align="center">
              <template #default="scope">
                <el-checkbox
                  label=""
                  v-model="scope.row.required"
                  class="w-full flex justify-center"
                  @change="generator"
                />
              </template>
            </el-table-column>
            <el-table-column prop="index" label="index" width="86" align="center">
              <template #default="scope">
                <el-checkbox
                  label=""
                  v-model="scope.row.index"
                  class="w-full flex justify-center"
                  @change="generator"
                />
              </template>
            </el-table-column>
            <el-table-column prop="unique" label="unique" width="86" align="center">
              <template #default="scope">
                <el-checkbox
                  label=""
                  v-model="scope.row.unique"
                  class="w-full flex justify-center"
                  @change="generator"
                />
              </template>
            </el-table-column>
            <el-table-column prop="default" label="default" min-width="120" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.default" @input="generator" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ref" label="ref" min-width="120" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.ref" @input="generator" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column label="" width="60">
              <template #default="scope">
                <div class="flex justify-center hover:cursor-pointer hover:text-[#fa0011]">
                  <el-icon @click="onRemoveTableRow(scope.row.id)" size="20px"
                    ><CircleClose
                  /></el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button class="mt-4 w-[180px]" @click="onAddItem">Add item</el-button>
      </div>
    </div>
    <div class="viewer w-[580px] flex relative">
      <el-button class="absolute right-1 top-1">Copy</el-button>
      <pre class="w-full language-typescript !m-0">
        <code v-html="formattedCode" class="language-typescript prose"></code>
      </pre>
    </div>
  </div>

  <!-- <el-button class="mt-4" width="160" @click="generator">Generate</el-button> -->
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import Vue3DraggableResizable, { DraggableContainer } from 'vue3-draggable-resizable'
// import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

import { CircleClose } from '@element-plus/icons-vue'

import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-typescript'

type FieldObjectType = 'Types.ObjectId' | 'String' | 'Number' | 'Object' | 'Date' | 'Boolean'

interface IModelItem {
  id: number
  field: string
  type: FieldObjectType
  ref: string
  required: boolean
  unique: boolean
  index: boolean
  default: string
}

const fieldTypeOptions: FieldObjectType[] = [
  'Types.ObjectId',
  'String',
  'Object',
  'Number',
  'Boolean',
  'Date'
]

const tableData = ref<IModelItem[]>([
  {
    id: 0,
    field: '_id',
    ref: '',
    type: 'Types.ObjectId',
    required: true,
    unique: false,
    index: false,
    default: ''
  }
])

function onAddItem(): void {
  tableData.value.push({
    id: tableData.value.length,
    field: '',
    ref: '',
    type: 'String',
    required: false,
    index: false,
    unique: false,
    default: ''
  })
  generator()
}

const schemaOptions = ref({
  timestamps: true,
  collection: 'collection_name',
  schemaClass: 'schemaClass'
})

const output = ref('')
const formattedCode = ref('')

function getFieldType(type: FieldObjectType): string {
  const docs: Record<FieldObjectType, string> = {
    'Types.ObjectId': 'Types.ObjectId',
    Boolean: 'boolean',
    Number: 'number',
    String: 'string',
    Object: 'Record<string, any>',
    Date: 'Date'
  }
  return docs[type]
}

function generateField(item: IModelItem): string {
  if (!item.field) return ''
  return `
    @Prop({
      \ttype: ${item.type},${item.ref ? `\n\t\tref: () => ${item.ref},` : ''}${
    item.required ? `\n\t\trequired: ${item.required ? 'true' : 'false'},` : ''
  }${item.unique ? `\n\t\tunique: ${item.unique ? 'true' : 'false'},` : ''}${
    item.index ? `\n\t\tindex: ${item.index ? 'true' : 'false'},` : ''
  }${item.default ? `\n\t\tdefault: ${item.default},` : ''}
    })
    ${item.field}: ${getFieldType(item.type)}
  `
}

function generator(): void {
  output.value = `
  @Schema({
    timestamps: ${schemaOptions.value.timestamps ? 'true' : 'false'}${
    schemaOptions.value.collection ? `,\n\tcollection: '${schemaOptions.value.collection}'` : ''
  }
  })

  export class SchemaClass { 
  `

  tableData.value.forEach((row) => {
    output.value += generateField(row)
  })

  output.value += `\n  }`

  formattedCode.value = Prism.highlight(output.value, Prism.languages.typescript, 'typescript')
}

function onRemoveTableRow(id: number): void {
  tableData.value = tableData.value.filter((item) => item.id !== id)
  generator()
}

onMounted(() => {
  generator()
})

function clearTableData(): void {
  tableData.value = [
    {
      id: 0,
      field: '_id',
      ref: '',
      type: 'Types.ObjectId',
      required: true,
      unique: false,
      index: false,
      default: ''
    }
  ]
}
</script>

<style lang="scss"></style>
