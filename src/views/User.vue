<template>
    <div>
        <div class="user-header">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-form :inline="true" :model="formInline">
                <el-form-item label="请输入">
                    <el-input placeholder="请输入用户名" v-model="formInline.keyWord" />
                </el-form-item>
                <el-form-item label="请输入">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="user-table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column v-for="item in tableLabel" :key="item.prop" :width="item.width ? item.width : 125"
                    :prop="item.prop" :label="item.label" />

                <el-table-column fixed="right" label="Operations" min-width="120">
                    <template #="scope">
                        <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pager" background layout="prev, pager,next" size="small" :total="config.total"
                @current-change="handleChange"></el-pagination>
        </div>
        <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
            :before-close="handleClose">
            <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clean
		在css进行处理-->
            <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="formUser.name" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="select-clean" label="性别" prop="sex">
                            <el-select v-model="formUser.sex" placeholder="请选择">
                                <el-option label="男" value="1" />
                                <el-option label="女" value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出生日期" prop="birth">
                            <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="地址" prop="addr">
                        <el-input v-model="formUser.addr" placeholder="请输入地址" />
                    </el-form-item>
                </el-row>
                <el-row style="justify-content: flex-end">
                    <el-form-item>
                        <el-button type="primary" @click="handleCancel">取消</el-button>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus';


const tableData = ref([])

const tableLabel = reactive([
    {
        prop: 'name',
        label: '姓名'
    },
    {
        prop: 'age',
        label: '年龄'
    },
    {
        prop: 'sexLabel',
        label: '性别'
    },
    {
        prop: 'birth',
        label: '出生日期',
        width: 200
    },
    {
        prop: 'addr',
        label: '出生地址',
        width: 300
    },
])

const formInline = reactive({
    keyWord: ''
})

const config = reactive({
    name: '',
    total: 0,
    page: 1
})

// 新增和编辑共用一个窗口，所以通过设置action区分
const action = ref('add')

// 控制对话框是否显示
const dialogVisible = ref(false)

const formUser = reactive({
    sex: '1'
})

// 表单校验规则
const rules = reactive({
    name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
    age: [
        { required: true, message: "年龄是必填项", trigger: "blur" },
        { type: "number", message: "年龄必须是数字" },
    ],
    sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
    birth: [{ required: true, message: "出生日期是必选项" }],
    addr: [{ required: true, message: '地址是必填项' }]
})


const { proxy } = getCurrentInstance()


const getUserData = async () => {
    const data = await proxy.$api.getUserData(config)
    tableData.value = data.list.map(item => ({
        ...item,
        sexLabel: item.sex == '1' ? '男' : '女'
    }))
    config.total = data.count
}

const handleSearch = () => {
    config.name = formInline.keyWord
    getUserData()
}

const handleChange = (page) => {
    config.page = page
    getUserData()
}

const handleDelete = (val) => {
    ElMessageBox.confirm('你确定要删除吗？').then(async () => {
        await proxy.$api.deleteUser({ id: val.id })
        ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success'
        })
        getUserData()
    })
}

const handleClose = () => {
    // 获取表单、重置表单
    dialogVisible.value = false
    proxy.$refs['userForm'].resetFields()
}

const handleCancel = () => {
    dialogVisible.value = false
    proxy.$refs['userForm'].resetFields()
}

const handleAdd = () => {
    dialogVisible.value = true
    action.value = 'add'
}

const timeFormat = (time) => {
    let dateTime = new Date(time)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let date = dateTime.getDate()
    const formatDateNum = (m) => {
        return m < 10 ? '0' + m : m
    }
    return year + '-' + formatDateNum(month) + '-' + formatDateNum(date)
}

const onSubmit = () => {
    // 校验表单
    proxy.$refs['userForm'].validate(async (valid) => {
        if (valid) {
            let res = null
            formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
            if (action.value == 'add') {
                res = await proxy.$api.addUser(formUser)
            } else {
                res = await proxy.$api.editUser(formUser)
            }
            if (res) {
                dialogVisible.value = false
                proxy.$refs['userForm'].resetFields()
                getUserData()
            }
        } else {
            ElMessage({
                showClose: true,
                message: '请输入正确的内容',
                type: 'error'
            })
        }
    })
}

const handleEdit = (val) => {
    action.value = 'edit'
    dialogVisible.value = true
    // Object.assign(formUser, { ...val, sex: '' + val.sex })

    nextTick(() => {
        // 因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
        // 具体：页面初始化之后， 点 新增-> 编辑 -> 新增 没有问题，新增框的数据是正常的
        // 但是：页面初始化之后， 点 编辑 -> 新增 这时候新增框里的数据是编辑的时候初始化的数据
        // 所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值
        Object.assign(formUser, { ...val, sex: "" + val.sex })
        // 这里需要改变sex数据类型，是因为el-option的value有类型的校验
    })
}

onMounted(() => {
    getUserData()
})
</script>

<style lang="less" scoped>
.user-header {
    display: flex;
    justify-content: space-between;
}

.user-table {
    position: relative;
    height: 520px;

    .pager {
        position: absolute;
        right: 10px;
        bottom: 30px;
    }

    .el-table {
        width: 100%;
        height: 500px;
    }
}

.select-clean {
    display: flex;
}
</style>