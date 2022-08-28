import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuardsModule } from '@guards/guards.module';
import { ServicesModule } from '@services/services.module';
import { FileDropDirective } from '@directives/file-drop/file-drop.directive';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  imports: [CommonModule, GuardsModule, ServicesModule,DirectivesModule],
  exports: [FileDropDirective]
})
export class CoreModule {}
