import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../user/user.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private requiredPermission!: string;

  constructor(
    private _UserService: UserService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set appHasPermission(permission: string) {
    this.requiredPermission = permission;
    this.updateView();
  }

  private updateView() {
    if (this._UserService.hasPermission(this.requiredPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
