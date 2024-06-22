<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/home">订单管理</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>申请退款列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片布局 -->
        <el-card>
            <!-- <el-row class="queryorder" :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getOrderList" clearable>
            <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row> -->

            <!-- 表格 -->
            <el-table :data="orderlist.slice((currentPage - 1) * pagesize, currentPage * pagesize)" stripe border
                style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="orderId" label="订单编号" width="200"></el-table-column>
                <el-table-column prop="price" label="退款金额" width="130"></el-table-column>
                <el-table-column prop="reason" label="退款原因" width="190"></el-table-column>
                <el-table-column prop="remark" label="退款备注"></el-table-column>
                <el-table-column width='150' label="操作">
                    <template v-slot="scope">
                        <el-button size="mini" type="success" @click="operateRefund('agree', scope.row)">同意</el-button>
                        <el-button size="mini" type="danger" @click="operateRefund('reject', scope.row)">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页码 -->

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="orderlist.length" background></el-pagination>
        </el-card>

    </div>
</template>
<script>
import cityDate from "./citydata";
export default {
    data() {
        return {
            queryInfo: {
                query: "",
                currentPage: 1,
                pagesize: 10
            },
            currentPage: 1, //默认第一页
            pagesize: 10, //当前显示页数
            orderlist: [],
            total: 0,
            addressVisible: false,
            addressForm: {
                address1: [],
                address2: ""
            },
            addressFormRules: {
                address1: [
                    { required: true, message: "请选择省市区/县", trigger: "blur" }
                ],
                address2: [
                    { required: true, message: "请输入详细地址", trigger: "blur" }
                ]
            },
            cityDate,
            progressVisible: false,
            progressInfo: []
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        operateRefund(str, val) {
            if (str == 'agree') {
                this.$confirm(`请检查商户平台余额是否充足`, '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/confirmRefund", val).then(res => {
                        if (res?.data?.error?.message == 'NOTENOUGH 基本账户余额不足，请充值后重新发起') {
                            this.$message.error("基本账户余额不足，请充值后重新发起");
                            return;
                        }
                        if (res.status == 200) {
                            this.getOrderList();
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            } else {
                this.$axios.post("/confirmRefund/reject", val).then(res => {
                    if (res.status == 200) {
                        this.getOrderList();
                        this.$message.success(res.message);
                    } else {
                        this.$message.error('操作失败，请重试');
                    }
                })
            }
        },
        /** 获取默认列表 */
        getOrderList() {
            this.$axios.get(`/getRefundList`).then(res => {
                const { data } = res.data
                console.log(res)
                if (res.data.status == 200) {
                    let arr = data.filter(val => {
                        return val.agreeStatus == 0
                    })
                    this.orderlist = arr
                } else {
                    this.orderlist = []
                }
            })
        },
        handleSizeChange(newSize) {
            this.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getOrderList();
        },
    }
};
</script>

<style lang="less" scoped>
.queryorder {
    margin-bottom: 20px;
}

.el-pagination {
    margin-top: 15px;
}

.tagA {
    display: block;
    color: #2a98ff;
}
</style>