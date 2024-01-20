---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.dasherize(tableName) %>-table/<%= h.inflection.dasherize(tableName) %>-table.component.html
---
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<% const camelizedName = h.inflection.camelize(tableName, true) %><% _%>
<% const camelizedSingularName = h.inflection.singularize(camelizedName) %><% _%>
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<app-navbar>
  <ng-container title><%= pascalizedName %></ng-container>
  <ng-container nav-content>
    <button class="btn btn-primary min-h-0 h-9 ml-auto" routerLink="add" routerLinkActive="hidden">
      <i class="fa fa-plus"></i>
      Add <%= pascalizedSingularName %>
    </button>
  </ng-container>
</app-navbar>

@if (isLoading()) {
  <span class="loading loading-spinner loading-lg block mx-auto my-24"></span>
} @else if (loadRecordsError) {
  <div class="text-error text-center font-medium py-4">{{ loadRecordsError }}</div>
} @else {
  <table class="table mb-28">
    <thead>
      <tr
        class="sticky top-[var(--navbar-height)] bg-base-100 border-b-0 shadow-[inset_0_-1px_0_oklch(var(--b2))] z-[2]"
      >
        <th>Name</th>
        <th>Created at</th>
        <th>Updated at</th>
        <th>Deleted at</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      @for (<%= camelizedSingularName %> of records(); track $index) {
        <app-<%= dasherizedName %>-table-row
          [<%= camelizedSingularName %>]="<%= camelizedSingularName %>"
          [alt-bg]="$index % 2 === 0"
          (edit)="edit(<%= camelizedSingularName %>)"
          (delete)="showDeletePrompt(<%= camelizedSingularName %>)"
        />
      }
    </tbody>
  </table>

  <app-prompt-dialog
    #deletePromptDialog
    title="Confirm Delete"
    [danger-confirm]="true"
    [disabled]="isDeleting()"
    (confirm)="deleteRecord()"
  >
    <p class="px-6 py-4">
      Are you sure you want to delete the <%= camelizedSingularName %>:
      <strong>{{ recordToDeleteLabel() }}</strong> ?
    </p>
    @if (deleteRecordError) {
      <div class="text-error text-center font-medium">{{ deleteRecordError }}</div>
    }
    <ng-container dialog-confirm>
      @if (isDeleting()) {
        <span class="loading loading-spinner"></span>
        Deleting...
      } @else {
        Delete
      }
    </ng-container>
  </app-prompt-dialog>
}
