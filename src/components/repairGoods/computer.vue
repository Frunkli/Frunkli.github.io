<template>
    <div class="list">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/home">维修物品列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>设备问题列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="10" class="addType">
                <span style="margin-right: 5px">录入问题列表: </span>
                <el-input style="width: 200px;margin-right: 10px" v-model="problemName"></el-input>
                <el-button type="primary" @click="addType">添加</el-button>
            </el-col>
            <el-col :span="14">
                <el-button type="primary" @click="addDialogVisible = true">录入维修方案</el-button>
            </el-col>
        </el-row>
        <el-row>
            <span>设备名称：
                {{
                    this.$route.query.equipmentType ? this.$route.query.equipmentType : ""
                }}</span>
        </el-row>
        <el-row>
            <el-table :data="list" stripe border style="width: 100%;margin:10px 0;"
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                <el-table-column prop="problemType" label="问题类型" width="140"></el-table-column>
                <el-table-column prop="resloveName" label="维修方案" width="150"></el-table-column>
                <el-table-column prop="desc" label="维修方案描述"></el-table-column>
                <el-table-column prop="warrantyPeriod" label="保修期" width="140"></el-table-column>
                <el-table-column prop="price" label="维修价格" width="140"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <span @click="deleteMethods(scope.row)"
                            style="color: #2897ff;cursor: pointer; margin-right: 30px;">删除</span>
                        <span @click="updateMethods(scope.row)" style="color: #2897ff;cursor: pointer;">编辑</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-dialog title="添加维修方案" :visible.sync="addDialogVisible" @close="addCateDialogClose" width="70%">
            <el-row>
                <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
                    <el-form-item label="问题类型" prop="problemType">
                        <el-select v-model="addForm.problemType" placeholder="请选择对应的问题类型">
                            <el-option v-for="item in problemTypeList" :label="item.name" :key="item._id"
                                :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="维修方案" prop="resloveName">
                        <el-input v-model="addForm.resloveName"></el-input>
                    </el-form-item>
                    <el-form-item label="维修方案描述" prop="desc">
                        <el-input v-model="addForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="保修期" prop="warrantyPeriod">
                        <el-input v-model="addForm.warrantyPeriod"></el-input>
                    </el-form-item>
                    <el-form-item label="维修价格" prop="price">
                        <el-input v-model="addForm.price"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col :span="10" style="text-align: right;" v-if="showSave">
                    <el-button @click="save(1)" type="primary">保存</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right;" v-if="!showSave">
                    <el-button @click="saveList" type="primary">保存</el-button>
                </el-col>
                <el-col :span="4" style="opacity: 0;">11</el-col>
                <el-col :span="10" style="text-align: left;">
                    <el-button @click="cancel">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            problemName: "",
            problemTypeList: [],
            list: [],
            addDialogVisible: false,
            addFormRules: {},
            addForm: {
                problemType: "",
                resloveName: "",
                desc: "",
                warrantyPeriod: "",
                price: "",
                phoneId: "",
            },
            copyAddForm: {
                problemType: "",
                resloveName: "",
                desc: "",
                warrantyPeriod: "",
                price: "",
                phoneId: "",
            },
            val: "",
        };
    },
    computed: {
        showSave() {
            if (this.$route.query.id) {
                return true;
            } else {
                return false;
            }
        },
    },
    watch: {},
    mounted() {
        this.getProblemList();
        this.getProblem();
    },
    methods: {
        /** 添加问题类型 */
        addType() {
            if (this.problemName) {
                let params = {
                    name: this.problemName,
                };
                this.$axios.post("problemType/add", params).then((res) => {
                    if (res.data.status == 200) {
                        this.problemName = "";
                        this.$message.success(res.data.message);
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            } else {
                this.$message.warning("输入框不能为空");
            }
        },
        /** 获取机型解决方案 */
        getProblem() {
            this.$axios
                .post(
                    "queryRepairMethods",
                    {},
                    {
                        params: {
                            id: this.$route.query.id ? this.$route.query.id : 0,
                        },
                    }
                )
                .then((res) => {
                    this.list = res.data;
                });
        },
        /** 获取总问题列表 */
        getProblemList() {
            this.$axios.get("problemType/query").then((res) => {
                if (res.data.status == 200) {
                    this.problemTypeList = res.data.data;
                }
            });
        },
        /** 更新当前行数据 */
        updateMethods(row) {
            this.addForm = row;
            this.addDialogVisible = true;
            this.val = 1;
        },

        /** 删除该行数据 */
        deleteMethods(row) {
            this.$axios
                .post(
                    "deleteMethods",
                    {},
                    {
                        params: {
                            id: row._id,
                        },
                    }
                )
                .then((res) => {
                    const { data } = res;
                    if (data.status == 200) {
                        this.$message.success("成功删除一条数据");
                        this.getProblem();
                    } else {
                        this.$message.error("删除失败，请刷新重试");
                    }
                });
        },
        /** 关闭弹框 */
        addCateDialogClose() {
            // this.$refs.addForm.resetFields();
            this.addForm = JSON.parse(JSON.stringify(this.copyAddForm));
            this.addDialogVisible = false;
            this.val = "";
        },
        /** 单个保存 */
        save() {
            let url = this.val == 1 ? "addMethods/update" : "addMethods/add";
            this.addForm.phoneId = this.$route.query.id ? this.$route.query.id : 0;
            this.$axios.post(url, this.addForm).then((res) => {
                if (res.data.status == 200) {
                    this.$message.success(res.data.message);
                    this.addDialogVisible = false;
                    this.getProblem();
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        /** 列表保存 */
        saveList() {
            let list = this.$route.query.list;
            let arr = [];

            //         this.$confirm(
            //     `请检查录入信息\n
            //     问题类型: ${this.addForm.problemType}`,
            //     "提示",
            //     {
            //       confirmButtonText: "确定",
            //       cancelButtonText: "取消",
            //       type: "warning",
            //       dangerousUseHTMLString: true
            //     }
            //   ).catch(err => {
            //     return err;
            //   });

            if (list.length) {
                list.forEach((item) => {
                    let obj = { ...this.addForm, ...item };
                    arr.push(obj);
                });
                this.$axios.post("addSomeMethods", arr).then((res) => {
                    const { data } = res;
                    if (data.status == 200) {
                        this.$message.success('添加成功');
                        this.addDialogVisible = false;
                        this.getProblem();
                    } else {
                        this.$message.success('添加失败');
                    }
                });
            }
        },
        cancel() {
            this.$refs.addForm.resetFields();
            this.addDialogVisible = false;
        },
    },
};
</script>
<style scoped>
.addType {
    display: flex;
    align-content: center;
}

.addType span {
    line-height: 40px;
}
</style>
