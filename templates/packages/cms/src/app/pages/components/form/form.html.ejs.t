---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form.component.html
---
<% const camelizedSingularName = h.inflection.singularize(h.inflection.camelize(tableName, true)) %><% _%>
<form #form="ngForm" id="<%= camelizedSingularName %>-form" class="px-6 pt-2" (ngSubmit)="save()" ngNativeValidate>
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
    <form method="dialog">
      <button class="btn" [disabled]="isLoading">Cancel</button>
    </form>
    <button type="submit" class="btn btn-primary" [disabled]="isLoading">
      @if (isLoading) {
        <span class="loading loading-spinner"></span>
        Saving...
      } @else {
        Save
      }
    </button>
  </div>
</form>
