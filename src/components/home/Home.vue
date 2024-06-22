<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img style="border-radius: 50%; transform: translate(10px,0);" src="../../assets/img/yu.jpg" alt="便家" />
                <span>便家管理后台</span>
            </div>
            <!-- <el-button type="info" @click="logout">退出</el-button> -->
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-btn" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单 -->
                <el-menu :default-active="activePath" router background-color="#333744" text-color="#fff"
                    active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单主模板 -->
                        <template slot="title">
                            <i :class="iconObj[item.id]" class="iconf"></i>
                            <span>{{ item.authName }}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNaveState('/' + subItem.path)">
                            <!-- 二级菜单主模板 -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <!-- 占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist: [
                // {
                //   authName: "商品管理",
                //   id: 1,
                //   order: 1,
                //   path: "goods",
                //   children: [
                //     {
                //       id: 1,
                //       authName: "商品列表",
                //       order: null,
                //       path: "goods",
                //       children: []
                //     }
                //   ]
                // },
                {
                    authName: "订单管理",
                    id: 3,
                    order: 3,
                    path: "order",
                    children: [
                        {
                            id: 1,
                            authName: "订单列表",
                            order: null,
                            path: "orders",
                            children: []
                        },
                        {
                            id: 2,
                            authName: '退款列表',
                            order: null,
                            path: 'refundList',
                            children: []
                        }
                    ]
                },
                {
                    authName: "维修物品列表",
                    id: 2,
                    order: 2,
                    path: 'repairGoods',
                    children: [
                        {
                            id: 2,
                            authName: '设备系列列表',
                            order: null,
                            path: 'repairPhoneGoods',
                            children: []
                        },
                        {
                            id: 3,
                            authName: '设备问题列表',
                            order: null,
                            path: 'repairComputerGoods',
                            children: []
                        },
                        {
                            id: 4,
                            authName: '机型颜色库',
                            order: null,
                            path: 'colorsList',
                            children: [],
                        },
                        {
                            id: 5,
                            authName: '机型库',
                            order: null,
                            path: 'modelList',
                            children: [],
                        }
                    ]
                }
            ],
            iconObj: {
                //":key="item.id" : "图标"
                "125": "el-icon-s-custom",
                "103": "el-icon-bank-card",
                "101": "el-icon-shopping-cart-full",
                "102": "el-icon-postcard",
                "145": "el-icon-data-analysis"
            },
            isCollapse: false,
            // 激活地址
            activePath: ""
        };
    },
    methods: {
        toggleCollapse() {
            //点击是否水平折叠收起菜单
            this.isCollapse = !this.isCollapse;
        },
        // 保存连接激活状态
        saveNaveState(activePath) {
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        }
    },
    created() {
        this.activePath = window.sessionStorage.getItem("activePath");
    }
};
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center; // 内容居中
    color: #ffe;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 20px;
        }
    }

    div img {
        width: 50px;
        height: 50px;
    }
}

.el-aside {
    background-color: #333744;

    .el-menu {
        border: 0;
    }
}

.iconf {
    margin-right: 10px;
}

.toggle-btn {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2rem;
    cursor: pointer;
}

.el-main {
    background-color: #eaedf1;
}
</style>