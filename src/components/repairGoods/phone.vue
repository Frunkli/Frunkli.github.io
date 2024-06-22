<template>
    <div class="list">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/home">维修物品列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>设备系列列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="custom-card">
            <div class="card-header">
                <div class="card-header-title">录入问题</div>
            </div>
            <div class="card-main">
                <el-form :model="query" ref="ruleForm" label-position="right" size="small" label-width="auto"
                    style="width: 100%; margin-top: 8px" label-suffix=":">
                    <el-row :gutter="5">
                        <el-col :lg="8" :md="12" :sm="24">
                            <el-form-item label="导航名称">
                                <el-select v-model="query.navName" placeholder="请选择对应的导航名称" style="width: 88%">
                                    <el-option v-for="item in navList" :label="item.name" :key="item.id"
                                        :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24">
                            <el-form-item label="设备类型">
                                <el-input v-model="query.typeName" style="width: 88%" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="8" :md="12" :sm="24">
                            <el-form-item label="品牌系列">
                                <el-input v-model="query.series" style="width: 88%" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" style="text-align:right;padding-right:35px">
                            <el-button size="small" type="primary" @click="getList">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="custom-card">
            <div class="card-header">
                <div class="card-header-title">问题列表</div>
            </div>
            <div class="card-main">
                <el-col :span="24" class="col-right">
                    <div class="btn-box">
                        <div class="icon-item add" @click="addPhone">
                            添加设备
                        </div>
                        <div class="icon-item add" @click="openColor">
                            录入当前颜色
                        </div>
                        <div class="icon-item add" @click="writeProblems">
                            批量录入问题
                        </div>
                        <div class="icon-item add" @click="writeProblems('all')">
                            一键录入全部
                        </div>
                    </div>
                </el-col>
                <el-row>
                    <el-table :data="
                        list.slice((currentPage - 1) * pagesize, currentPage * pagesize)
                    " stripe border :row-key="getRowKeys" @selection-change="selectionLineChangeHandle"
                        style="width: 100%; margin: 10px 0"
                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                        <el-table-column type="selection" :reserve-selection="true" width="55">
                        </el-table-column>
                        <el-table-column prop="navName" label="导航名称" width="140"></el-table-column>
                        <el-table-column prop="typeName" label="设备类型"></el-table-column>
                        <el-table-column prop="series" label="品牌系列"></el-table-column>
                        <el-table-column prop="equipmentType" label="设备名称"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <span @click="updataRow(scope.row)"
                                    style="color: #2897ff; margin-right: 30px; cursor: pointer">编辑</span>
                                <span @click="goProblem(scope.row)"
                                    style="color: #2897ff; margin-right: 30px; cursor: pointer">录入问题</span>
                                <span @click="deleteRow(scope.row._id)" style="color: #2897ff; cursor: pointer">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row>
                    <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="1" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper" :total="list.length">
                    </el-pagination>
                </el-row>
            </div>
        </div>

        <el-dialog title="添加颜色" :visible.sync="colorDialogVisible" @close="colorCateDialogClose" width="50%">
            <span>已包含颜色：</span>
            <span>
                <span style="margin-left: 8px;" v-for="item in hasColorList" :key="item._id">
                    <span>{{ item.colorName }}</span>
                    <!-- <span>{{item.colorNum}}</span> -->
                    <span class="colorNumRound" :style="{ background: item.colorNum }"></span>
                </span>
            </span>
            <el-row>
                <el-form :model="colorForm" ref="colorForm" label-width="80px">
                    <el-form-item label="颜色" prop="colorName">
                        <el-select v-model="colorForm.colorName" remote multiple filterable :remote-method="searchColor"
                            placeholder="请选择对应的颜色名称" value-key="_id">
                            <el-option v-for="item in colorList" :label="item.colorName" :key="item._id"
                                :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="10" style="text-align: right">
                            <el-button @click="saveColor" type="primary">保存</el-button>
                        </el-col>
                        <el-col :span="4" style="opacity: 0">11</el-col>
                        <el-col :span="10" style="text-align: left">
                            <el-button @click="cancelColor">取消</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
        </el-dialog>

        <el-dialog title="添加手机" :visible.sync="addDialogVisible" @close="addCateDialogClose" width="70%">
            <el-row>
                <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
                    <el-form-item label="导航栏" prop="nav">
                        <el-select v-model="addForm.navName" @change="changeSelect" placeholder="请选择对应的导航名称">
                            <el-option v-for="item in navList" :label="item.name" :key="item.id"
                                :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备类型" prop="typeName">
                        <el-input v-model="addForm.typeName" placeholder="苹果、华为"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌系列" prop="series">
                        <el-input v-model="addForm.series" placeholder="iphone系列"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称" prop="equipmentType">
                        <el-input v-model="addForm.equipmentType" placeholder="iphone 14"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col :span="10" style="text-align: right">
                    <el-button @click="save(1)" type="primary">保存</el-button>
                </el-col>
                <el-col :span="4" style="opacity: 0">11</el-col>
                <el-col :span="10" style="text-align: left">
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
            multipleSelection: [],
            list: [],
            currentPage: 1, //默认第一页
            pagesize: 10, //当前显示页数
            query: {
                navName: "手机",
                typeName: "",
                series: "",
            },
            addForm: {
                navId: null,
                navName: "",
                typeName: "",
                series: "",
                equipmentType: "",
            },
            colorForm: {
                colorName: "",
            },
            colorList: [],
            colorRowId: null,
            copyAddForm: {
                navName: "",
                typeName: "",
                series: "",
                equipmentType: "",
            },
            navList: [
                { id: 1, name: "手机" },
                { id: 2, name: "电脑" },
                { id: 3, name: "平板" },
                { id: 4, name: '贴膜' }
            ],
            addDialogVisible: false,
            colorDialogVisible: false,
            hasColorList: [],
            addFormRules: {
                series: [
                    { required: true, message: "请输入品牌系列", trigger: "blur" },
                ],
                equipmentType: [
                    { required: true, message: "请输入设备名称", trigger: "blur" },
                ],
                typeName: [
                    { required: true, message: "请输入设备类型", trigger: "blur" },
                ],
            },
            val: 1,
        };
    },
    computed: {
        /** 包含颜色 */
        hasColor() {
            return "白色";
        },
    },
    watch: {},
    mounted() {
        this.getList();
    },
    methods: {
        /** 批量录入问题数据 */
        writeProblems(val) {
            const list = [];
            if (val == 'all') {
                this.list.forEach(item => {
                    list.push({ phoneId: item._id })
                })
                this.$router.push({
                    path: "/repairComputerGoods",
                    query: {
                        list,
                    },
                });
            } else if (this.multipleSelection.length && this.multipleSelection.length > 1) {
                this.multipleSelection.forEach(item => {
                    list.push({ phoneId: item._id })
                })
                this.$router.push({
                    path: "/repairComputerGoods",
                    query: {
                        list,
                    },
                });
            } else {
                this.$message.error('请批量选择');
            }
        },
        getRowKeys(row) {
            return row._id;
        },
        openColor() {
            if (this.multipleSelection.length === 0) {
                this.$message.error("请选择一条需要添加的数据");
            } else if (this.multipleSelection.length !== 1) {
                this.$message.error("一次仅能选择一条数据");
            } else {
                this.colorDialogVisible = true;
                this.colorForm.colorName = "";
                this.colorRowId = this.multipleSelection[0]._id;
                this.hasColorList = this.multipleSelection[0].colorList;
                this.colorList = this.hasColorList;
                this.colorForm.colorName = this.hasColorList;
            }
        },
        saveColor() {
            if (this.colorForm.colorName.length) {
                let param = {
                    rowId: this.colorRowId,
                    list: this.colorForm.colorName,
                };
                this.$axios.post("insertColor", param).then((res) => {
                    const { data } = res;
                    if (data.status == 200) {
                        this.colorDialogVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                });
            }
        },
        cancelColor() {
            this.colorDialogVisible = false;
        },
        /** 获取默认列表数据 */
        getList() {
            this.$axios.post("getList", this.query).then((res) => {
                const { data } = res;
                console.log(data);
                if (data.status == 200) {
                    this.$nextTick(() => {
                        this.list = data.data.reverse();
                    });
                } else {
                    this.$message.error(data.message);
                    this.list = [];
                }
            });
        },
        searchColor(queryString) {
            if (queryString !== "") {
                let param = {
                    colorName: queryString,
                    colorNum: "",
                };
                this.$axios
                    .post("getColorList", param, {
                        hideLoading: true,
                        focusActiveElement: true,
                    })
                    .then((res) => {
                        const { data } = res;
                        this.colorList = this.colorList ? this.colorList : [];
                        if (data.status == 200) {
                            this.colorList = [...this.colorList, ...data.data];
                        }
                    });
            }
        },
        selectionLineChangeHandle(val) {
            this.multipleSelection = val;
        },
        /** 保存 */
        save() {
            let url;
            if (this.val == 1) {
                url = "addType";
            } else {
                url = "updata";
            }
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$axios.post(url, this.addForm).then((res) => {
                        const { data } = res;
                        if (data.status == 200) {
                            this.addDialogVisible = false;
                            this.getList();
                            if (this.val == 1) {
                                this.$message.success("添加成功");
                            } else {
                                this.$message.success("修改成功");
                            }
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }
            });
        },
        /** 删除商品 */
        deleteRow(id) {
            if (id) {
                this.$axios
                    .post(
                        "delete",
                        {},
                        {
                            params: {
                                id,
                            },
                        }
                    )
                    .then((res) => {
                        const { data } = res;
                        if (data.status == 200) {
                            this.$message.success("成功删除一条数据");
                            this.getList();
                        } else {
                            this.$message.error("删除失败，请刷新重试");
                        }
                    });
            }
        },
        /** 编辑 */
        updataRow(row) {
            this.addForm = row;
            this.val = 2;
            this.addDialogVisible = true;
        },
        /** 添加物品 */
        addPhone() {
            this.val = 1;
            this.addDialogVisible = true;
        },
        goProblem(row) {
            console.log(row);
            if (row._id) {
                this.$router.push({
                    path: "/repairComputerGoods",
                    query: {
                        id: row._id,
                        equipmentType: row.equipmentType,
                    },
                });
            } else {
                if (!this.multipleSelection.length) {
                    this.$message.error("请选择需要录入的数据");
                    return;
                }
                this.$router.push({
                    path: "/repairComputerGoods",
                    query: {
                        list: this.multipleSelection,
                    },
                });
            }

            window.sessionStorage.setItem("activePath", "/repairComputerGoods");
            this.$parent.$parent.$parent.$parent.activePath = "/repairComputerGoods";
        },
        changeSelect(val) {
            let id = null;
            this.navList.forEach((item) => {
                if (item.name == val) {
                    id = item.id;
                }
            });
            this.addForm.navId = id;
        },
        addCateDialogClose() {
            this.$refs.addForm.resetFields();
            this.addForm = JSON.parse(JSON.stringify(this.copyAddForm));
            this.addDialogVisible = false;
        },
        colorCateDialogClose() {
            this.colorDialogVisible = false;
            this.colorList = [];
            this.hasColorList = [];
        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList();
        },
        cancel() {
            this.$refs.addForm.resetFields();
            this.addDialogVisible = false;
        },
    },
};
</script>
<style scoped lang="less">
.colorNumRound {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    transform: translate(5px, 5px);
    border: 1px solid #000;
}

.col-right {
    .btn-box {
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: right;

        .icon-item {
            display: inline-block;
            position: relative;
            padding-left: 23px;
            color: rgba(60, 60, 60, 1);
            cursor: pointer;
            margin: 0 10px;
            // 双击不选中
            -moz-user-select: none;
            /*火狐*/
            -webkit-user-select: none;
            /*webkit浏览器*/
            -ms-user-select: none;
            /*IE10*/
            user-select: none;

            &::after {
                display: block;
                content: "";
                position: absolute;
                width: 18px;
                height: 18px;
                left: 0;
                top: 50%;
                transform: translate(0, -50%);
                background-size: 100%, 100%;
            }

            &:hover {
                color: #3a84fb;
            }
        }

        // 添加
        .add {
            &::after {
                background: url("../../assets/img/addicon.png") no-repeat center;
            }

            &:hover {
                &::after {
                    background: url("../../assets/img/addicon_hover.png") no-repeat center;
                }
            }
        }
    }
}
</style>