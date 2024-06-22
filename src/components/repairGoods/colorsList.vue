<!--  -->
<template>
    <div class="colorsList">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/home">维修物品列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>机型颜色库</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="container">
            <div class="custom-card">
                <div class="card-header">
                    <div class="card-header-title">添加颜色</div>
                </div>
                <div class="card-main">
                    <el-form :model="query" ref="ruleForm" label-position="right" size="small" label-width="auto"
                        style="width: 100%; margin-top: 8px" label-suffix=":">
                        <el-row :gutter="5">
                            <el-col :lg="10" :md="12" :sm="24">
                                <el-form-item label="颜色名称">
                                    <el-input v-model="query.colorName" clearable size="small"
                                        style="width: 88%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="10" :md="12" :sm="24">
                                <el-form-item label="颜色编号">
                                    <el-input v-model="query.colorNum" clearable size="small" style="width: 88%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="text-align:right;padding-right:35px">
                                <el-button size="small" type="primary" @click="queryEvent">查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <div class="custom-card">
                <div class="card-header">
                    <div class="card-header-title">颜色列表</div>
                </div>
                <div class="card-main">
                    <el-col :span="24" class="col-right">
                        <div class="btn-box">
                            <div class="icon-item add" @click="addColor">
                                添加颜色
                            </div>
                        </div>
                    </el-col>
                    <el-row>
                        <el-table :data="
                            list.slice((currentPage - 1) * pagesize, currentPage * pagesize)
                        " stripe border style="width: 100%;margin:10px 0;"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                            <el-table-column prop="colorName" label="颜色名称"></el-table-column>
                            <el-table-column prop="colorNum" label="颜色编号"></el-table-column>
                            <el-table-column label="编辑">
                                <template slot-scope="scope">
                                    <span @click="updataRow(scope.row)"
                                        style="color: #2897ff;cursor: pointer;margin-right: 30px;;">编辑</span>
                                    <span @click="deleteRow(scope.row)" style="color: #2897ff;cursor: pointer;">删除</span>
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
            <el-dialog title="添加手机" :visible.sync="addDialogVisible" @close="addCateDialogClose" width="70%">
                <el-row>
                    <el-form :model="addForm" ref="addForm" label-width="80px">
                        <el-form-item label="颜色名称" prop="colorName">
                            <el-input v-model="addForm.colorName" placeholder="星光色、远峰蓝"></el-input>
                        </el-form-item>
                        <el-form-item label="颜色编号" prop="colorNum">
                            <el-input v-model="addForm.colorNum" placeholder="#f3f3f3、#000000"></el-input>
                        </el-form-item> </el-form></el-row>
                <el-row>
                    <el-col :span="10" style="text-align: right;">
                        <el-button @click="save" type="primary">保存</el-button>
                    </el-col>
                    <el-col :span="4" style="opacity: 0;">11</el-col>
                    <el-col :span="10" style="text-align: left;">
                        <el-button @click="cancel">取消</el-button>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            list: [],
            currentPage: 1,
            pagesize: 10,
            addDialogVisible: false,
            addForm: {
                colorName: "",
                colorNum: "",
            },
            query: {
                colorName: "",
                colorNum: "",
            },
            val: null,
        };
    },
    computed: {},
    mounted() {
        this.queryEvent();
    },
    //方法集合
    methods: {
        /**
         * @param {row} Object 选中行数据
         * 选中行编辑
         */
        updataRow(row) {
            this.addDialogVisible = true;
            this.val = 2;
        },
        /**
         * @param {row} Object 选中行数据
         * 选中行删除
         */
        deleteRow(row) {
            this.$axios.get(`deleteColor?id=${row._id}`).then(res => {
                const { data } = res;
                if (data.status == 200) {
                    this.$message.success('删除成功');
                    this.queryEvent();
                } else {
                    this.$message.error('删除失败');
                }
            })
        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.queryEvent();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryEvent();
        },
        /** 查颜色列表 */
        queryEvent() {
            this.$axios.post("getColorList", this.query).then((res) => {
                const { data } = res;
                if (data.status == 200) {
                    this.list = data.data;
                }
            });
        },
        /** 添加颜色 */
        addColor() {
            this.addDialogVisible = true;
            this.val = 1;
        },
        /**
         * 保存颜色到数据库
         */
        save() {
            let url = this.val === 1 ? "addColor/add" : "addColor/updata";
            this.$axios.post(url, this.addForm).then((res) => {
                const { data } = res;
                if (data.status == 200) {
                    this.$message.success(data.message);
                    this.addDialogVisible = false;
                    this.queryEvent();
                } else {
                    this.$message.error(data.message);
                }
            });
        },
        /** 弹框取消 */
        cancel() {
            this.$refs.addForm.resetFields();
            this.addDialogVisible = false;
            this.val = null;
        },
        /** 弹框关闭 */
        addCateDialogClose() {
            this.$refs.addForm.resetFields();
            // this.addForm = JSON.parse(JSON.stringify(this.copyAddForm));
            this.addDialogVisible = false;
            this.val = null;
        },
    },
};
</script>
<style scoped lang="less">
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
