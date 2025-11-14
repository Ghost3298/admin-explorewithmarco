import { Routes } from '@angular/router';
import { Login } from './login/login';
import { MainPage } from './main-page/main-page';
import { Bgnui } from './bgnui/bgnui';
import { Countries } from './countries/countries';
import { Packages } from './packages/packages';
import { Categories } from './categories/categories';
import { Blog } from './blog/blog';
import { Users } from './users/users';

export const routes: Routes = [
    {
        path:'', component: Login
    },
    {
        path:'home', component: MainPage, children:[
            // {
            //     path: "bgnui", component: Bgnui
            // },
            {
                path: "countries", component: Countries
            },
            {
                path: "categories", component: Categories
            },
            {
                path: "packages", component: Packages
            },
            {
                path: "blog", component: Blog
            },
            {
                path: "users", component: Users
            },
            {
                path: "**" , component: Countries
            }
        ]
    },
    {
        path: '**', component: Login
    }
];
