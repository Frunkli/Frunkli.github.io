import Vue from "vue";
import VueRouter from "vue-router";
const Login = () =>
  import(
    /*webpackChunkName:"login_home_welcome" */ "../components/login/Login"
  );
const Home = () =>
  import(
    /*webpackChunkName:"login_home_welcome" */ "../components/home/Home.vue"
  );
const Weclome = () =>
  import(/*webpackChunkName:"login_home_welcome" */ "../components/Welcome");
// import Login from ''
// import Home from '../components/home/Home'
// import Weclome from '../components/Welcome'

const Users = () =>
  import(/*webpackChunkName:"user_rights_roles" */ "../components/users/Users");
const Rights = () =>
  import(
    /*webpackChunkName:"user_rights_roles" */ "../components/power/rights.vue"
  );
const Roles = () =>
  import(
    /*webpackChunkName:"user_rights_roles" */ "../components/power/Roles.vue"
  );
// import Users from '../components/users/Users'
// import Rights from '../components/power/rights.vue'
// import Roles from '../components/power/Roles.vue'

const Cate = () =>
  import(/*webpackChunkName:"cate_params" */ "../components/goods/Cate.vue");
const Params = () =>
  import(/*webpackChunkName:"cate_params" */ "../components/goods/Params.vue");
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'

const GoodsList = () =>
  import(/*webpackChunkName:"list_add" */ "../components/goods/List.vue");
const Add = () =>
  import(/*webpackChunkName:"list_add" */ "../components/goods/Add.vue");
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'

const Order = () =>
  import(/*webpackChunkName:"order_report" */ "../components/order/Order.vue");
const RefundList = () => 
  import("../components/order/refundList.vue");
const Report = () =>
  import(/*webpackChunkName:"list_add" */ "../components/report/Report.vue");

const repairPhoneGoods = () => import('../components/repairGoods/phone.vue');
const repairComputerGoods = () => import('../components/repairGoods/computer.vue');
const colorsList = () => import('../components/repairGoods/colorsList.vue');
const modelList = () => import('../components/repairGoods/modelList.vue');

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    redirect: "/Home",
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: Weclome,
      },
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/rights",
        component: Rights,
      },
      {
        path: "/roles",
        component: Roles,
      },
      {
        path: "/categories",
        component: Cate,
      },
      {
        path: "/params",
        component: Params,
      },
      {
        path: "/goods",
        component: GoodsList,
      },
      {
        path: "/goods/add",
        component: Add,
      },
      {
        path: "/orders",
        component: Order,
      },
      {
        path: "/refundList",
        component: RefundList,
      },
      {
        path: "/reports",
        component: Report,
      },
      {
        path: '/repairPhoneGoods',
        component: repairPhoneGoods
      },
      {
        path: '/repairComputerGoods',
        component: repairComputerGoods
      },
      {
        path: '/colorsList',
        component: colorsList
      },
      {
        path: '/modelList',
        component: modelList
      }
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转来
  // next 放行
  // next('/login') 强制跳转
  // next()  放行
  // if (to.path === '/login') return next();
  // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next();
});

export default router;
