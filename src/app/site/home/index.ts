import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function addHome(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create(
      'src/app/home/home.component.ts',
      `
        import { Component } from '@angular/core';
        @Component({
          selector: 'app-home',
          templateUrl: './home.component.html',
          styleUrls: ['./home.component.css']
        })
        export class HomeComponent {}
      `
    );
    return tree;
  };
}
