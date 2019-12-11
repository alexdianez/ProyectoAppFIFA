import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", loadChildren: "./home/home.module#HomePageModule" },
  { path: "formulario/:id", loadChildren: "./formulario/formulario.module#FormularioPageModule" },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}