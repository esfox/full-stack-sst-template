---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/<%= h.inflection.dasherize(tableName) %>.component.html
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const dasherizedSingularName = h.inflection.singularize(dasherizedName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<% const camelizedSingularName = h.inflection.singularize(h.inflection.camelize(tableName, true)) %><% _%>
<% const getFieldNameByIndex = (index) => h.inflection.titleize(columns[index].name) %><% _%>
<app-main-layout>
  <ng-container nav-title> <%= pascalizedName %> </ng-container>

  <ng-container nav-content>
    <button class="btn btn-primary min-h-0 h-9 ml-auto" (click)="showRecordForm()">
      <i class="fa fa-plus"></i>
      Add <%= h.inflection.transform(tableName, ['singularize', 'titleize']) %>
    </button>
  </ng-container>

  @if (isLoading()) {
    <span class="loading loading-spinner loading-lg block mx-auto my-24"></span>
  } @else {
    <table class="table mb-28">
      <thead>
        <tr
          class="sticky top-[var(--navbar-height)] bg-base-100 border-b-0 shadow-[inset_0_-1px_0_oklch(var(--b2))] z-[2]"
        >
          <!-- TODO: Change table headers as needed -->
          <% for (let i = 1; i <= 4; i++) { %><% _%>
            <% if (columns[i]) { %><% _%>
              <th><%= getFieldNameByIndex(i) %></th>
            <% } %>
          <% } %>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (<%= camelizedSingularName %> of records(); track $index) {
          <app-<%= dasherizedName %>-table-row
            [<%= dasherizedSingularName %>]="<%= camelizedSingularName %>"
            [alt-bg]="$index % 2 === 0"
            (edit)="showRecordForm(<%= camelizedSingularName %>)"
            (delete)="showDeletePrompt(<%= camelizedSingularName %>)"
          />
        }
      </tbody>
    </table>
  }
</app-main-layout>

<app-dialog #recordFormDialog [title]="recordFormDialogTitle()">
  <app-<%= dasherizedSingularName %>-form #recordForm [loading]="isSaving()" (save)="saveRecord($event)" />
</app-dialog>

<app-prompt-dialog
  #deletePromptDialog
  title="Confirm Delete"
  [danger-confirm]="true"
  [disabled]="isDeleting()"
  (confirm)="deleteRecord()"
>
  <p class="px-6 py-4">
    Are you sure you want to delete the <%= h.inflection.transform(tableName, [ 'singularize', 'humanize' ]) %> with id: <code>{{ recordToDeleteIdentifier() }}</code> ? <!-- TODO: Change as needed -->
  </p>
  <ng-container dialog-confirm>
    @if (isDeleting()) {
      <span class="loading loading-spinner"></span>
      Deleting...
    } @else {
      Delete
    }
  </ng-container>
</app-prompt-dialog>
