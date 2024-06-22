<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/home">订单管理</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片布局 -->
        <el-card>
            <el-row class="queryorder" :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="根据手机号查询订单" v-model="queryInfo.query" clearable>
                        <el-button @click="getOrderListByPhoneNo" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table v-tableFit :data="orderlist.slice((currentPage - 1) * pagesize, currentPage * pagesize)" stripe border
                style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="orderId" label="订单编号"></el-table-column>
                <el-table-column prop="allPrice" label="订单价格" width="90"></el-table-column>
                <el-table-column prop="equipmentType" label="维修设备" width="120"></el-table-column>
                <el-table-column prop="resloveName" label="维修项目">
                    <template v-slot="scope">
                        <a class="tagA" v-for="(item, index) in scope.row.resloveName" :key="index">{{ item }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="是否维修" width="100">
                    <template v-slot="scope">
                        <el-tag type="warning" v-if="scope.row.repairStatus === 0">待维修</el-tag>
                        <el-tag type="warning" v-if="scope.row.repairStatus === 1">维修中</el-tag>
                        <el-tag type="success" v-if="scope.row.repairStatus === 2">维修完成</el-tag>
                        <el-tag type="success" v-if="scope.row.refundStatus !== 0">退款操作</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="colorName" label="颜色"></el-table-column>
                <el-table-column prop="remark" label="客户备注"></el-table-column>
                <el-table-column prop="callNum" label="客户电话"></el-table-column>
                <el-table-column prop="createTime" label="下单时间">
                    <template v-slot="scope">{{ scope.row.createTime | dataForm }}</template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template v-slot="scope">
                        <!-- 维修完成 -->
                        <el-button size="mini" type="primary" v-if="scope.row.repairStatus === 1"
                            @click="resloveOrder(scope.row, 1)">确认维修完成</el-button>
                        <!-- 维修中 -->
                        <el-button size="mini" type="primary" v-if="scope.row.repairStatus === 0"
                            @click="resloveOrder(scope.row, 2)">确认维修</el-button>
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
        /** 获取默认列表 */
        getOrderList() {
            this.$axios.get(`/getOrderList?openid=${''}`).then(res => {
                const { data } = res.data
                if (res.data.status == 200) {
                    if (data.length) {
                        data.forEach(item => {
                            item.resloveName = item.resloveName.split(';')
                            item.price = item.price.split(';')
                        })
                    }
                    let arr = data.filter(val => {
                        return val.isPay
                    })
                    this.orderlist = arr
                } else {
                    this.$message.error('请求错误，请刷新重试')
                }
            })
        },
        /** 更改修复状态 */
        resloveOrder(row, id) {
            let str = id == 1 ? '维修完成' : '维修中'
            this.$confirm(`此操作将代表修改状态为${str}`, '是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '修复成功'
                });
                row.repairStatus = id == 1 ? 2 : 1
                this.$axios.post('/updateOrderInfo', row).then(res => {
                    console.log(res);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        handleSizeChange(newSize) {
            this.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getOrderList();
        },
        getOrderListByPhoneNo() {
            if (this.queryInfo.query) {
                this.$axios.get(`/getOrderListByPhoneNo?callNum=${this.queryInfo.query}`).then(res => {
                    if (res.data.status === 200 && res.data.data.length) {
                        this.orderlist = res.data.data;
                    } else {
                        this.orderlist = [];
                    }
                })
            } else {
                this.getOrderList();
            }
        }
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