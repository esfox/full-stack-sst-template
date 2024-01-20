---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form.component.html
---
<% const camelizedSingularName = h.inflection.singularize(h.inflection.camelize(tableName, true)) %><% _%>
@if (isLoading()) {
  <span class="loading loading-spinner loading-lg block mx-auto my-24"></span>
}

<!-- Reason why this is only hidden when loading is because the form has to be rendered immediately -->
<div [class]="{ hidden: isLoading() }">
  <app-navbar>
    <ng-container title>
      <button class="btn btn-ghost btn-sm mr-2" (click)="cancel()">
        <i class="fa fa-chevron-left fa-lg"></i>
      </button>
      {{ navTitle }}
    </ng-container>
  </app-navbar>

  <form #form="ngForm" id="<%= camelizedSingularName %>-form" class="px-16 pt-6" (ngSubmit)="save()" ngNativeValidate>
    <!-- TODO: Modify fields and add placeholders as needed -->
    <% for (const column of columns) { %>
      <%_ if (!column.hasDefaultValue && column.name !== primaryKey && column.name !== 'updated_at' && column.name !== 'deleted_at') { _%>
        <label class="form-control w-full">
            <div class="label">
              <span class="label-text"><%= h.inflection.titleize(column.name) %></span>
            </div>
            <input
              type="text"
              class="input input-bordered w-full"
              name="<%= h.inflection.camelize(column.name, true) %>"
              ngModel
            />
          </label>
      <%_ } _%>
    <% } %>

    <div class="flex justify-end gap-2 py-6">
      <button type="button" class="btn" [disabled]="isSaving()" (click)="cancel()">Cancel</button>
      <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
        @if (isSaving()) {
          <span class="loading loading-spinner"></span>
          Saving...
        } @else {
          Save
        }
      </button>
    </div>
  </form>
</div>

@if (error) {
  <div class="text-error text-center font-medium py-4">{{ error }}</div>
}

